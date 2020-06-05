import View from '../common/View.js';

/* These routes and buildings are for Nuuksio: */
import routedata from '../../assets/geojson/routedata.js';
import buildingdata from '../../assets/geojson/buildingdata.js';

export default class MapView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			
			console.log(['key=',key]);
			
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.REO = controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.mymap = undefined;
		this.markerGroup = L.layerGroup();
		//this.labelGroup = L.layerGroup();
		
		
		
		// Just to make explicit what the issue is - Leaflet uses classes, and also has factory methods for creating new objects. 
		// The classes are captialized and need to be called with new, while the factory methods are lowercase and should not. 
		// The documentation uses factory methods, so I cannot say whether directly instantiating class instance is supported, 
		// although the factories simply call new anyway. The following are therefore equivalent, though only the first is documented.

		// Small t, calling factory method 
		//const positron = L.tileLayer(...); 
		// Capital T, instantiating a new instance directly 
		//const positron = new L.TileLayer(...);
		
		// Zoom levels 10, 11, 12, 13: "buildings" are NOT VISIBLE
		// Zoom levels 14, 15, 16, 17, 18: "buildings" are VISIBLE
		this.buildingMarkers = L.layerGroup();
		this.boundOnPointToLayer = (feature,latlng) => this.onPointToLayer(feature, latlng);
		this.buildingBaseUrl = 'https://timthinner.github.io/web/ParkHawk/assets/markers/';
		
		
		// Different view depending on Zoom level:
		// Zoom levels 11, 12: busStopMarkersA
		this.busStopMarkersA = L.layerGroup();
		// Zoom levels 13, 14: busStopMarkersB
		//this.busStopMarkersB = L.layerGroup();
		// Zoom levels 15, 16, 17, 18: busStopMarkersC
		//this.busStopMarkersC = L.layerGroup();
		
		
		
		this.mapzoom = 11;
		this.mapcenter = [60.32, 24.54];
		this.rendered = false;
	}
	
	hide() {
		if (typeof this.mymap !== 'undefined') {
			this.mymap.remove();
			this.mymap = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		if (typeof this.mymap !== 'undefined') {
			this.mymap.remove();
			this.mymap = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	setMapHeight() {
		if (typeof this.REO.height !== 'undefined' && typeof this.mymap !== 'undefined') {
			const H = (this.REO.height-70) + 'px'; // menu Height maximum is 60px.
			$('#mapid').css({height:H,width:"100%"});
			this.mymap.invalidateSize();
			console.log(['invalidateSize() H=',H]);
		}
	}
	
	addMarkers(stops, layer) {
		const myIcon = L.icon({
			iconUrl:      'assets/bus-stop-yellow.png',
			shadowUrl:    'assets/bus-stop-shadow.png',
			iconSize:     [50, 80],
			shadowSize:   [70, 50],
			iconAnchor:   [2, 63],
			shadowAnchor: [2, 34],
			popupAnchor:  [25, -55]
		});
		for (let stop of stops) {
			let s = '<h6 style="text-align:center;">'+stop.name+'</h6>';
			s += '<table class="striped bus-stop-times">';
			s += '<thead><tr><th>Määränpää</th><th>Linja</th><th>Lähtöaika</th></tr></thead><tbody>';
			
			let firstsix = stop.departures.slice(0,6);
			for (let depa of firstsix) {
				s += '<tr><td>'+depa.headsign+'</td><td>'+depa.shortName+'</td><td>'+depa.departureString+'</td></tr>';
			}
			s += '</tbody></table>';
			
			const marker = L.marker([stop.latlng.lat, stop.latlng.lng],{icon: myIcon}).bindPopup(s);
			layer.addLayer(marker);
		}
	}
	
	
	createBusStopMarkersA() {
		const MM = this.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData.alldepartures && MM.BusStopData.stops) {
				let AStops = [];
				const allDepInfo = MM.BusStopData.alldepartures;
				const stops      = MM.BusStopData.stops;
				//const stopnames      = MM.BusStopData.stopnames;
				let stopNames = [];
				for (let stop of stops) {
					if (stop.priority === 1) {
						if (!stopNames.includes(stop.name)) {
							stopNames.push(stop.name);
							let genStop = { name: stop.name, latlng: stop.latlng, priority: stop.priority };
							genStop.departures = [];
							for (let departure of allDepInfo) {
								if (departure.stopName === genStop.name) {
									genStop.departures.push(departure);
								}
							}
							AStops.push(genStop);
						}
					}
				}
				console.log('AStops=',AStops);
				if (AStops.length > 0) {
					this.addMarkers(AStops, this.busStopMarkersA);
					// Add the group to the map if zoom is 11 or 12.
					//if (this.mapzoom < 13) {
					this.busStopMarkersA.addTo(this.mymap);
					//}
				}
			}
		}
	}
	
	/*
	renderMarkers() {
		const MM = this.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData.alldepartures && MM.BusStopData.stops) {
				let AStops = [];
				const allDepInfo = MM.BusStopData.alldepartures;
				const stops      = MM.BusStopData.stops;
				//const stopnames      = MM.BusStopData.stopnames;
				let stopNames = [];
				for (let stop of stops) {
					if (stop.priority === 1) {
						if (!stopNames.includes(stop.name)) {
							stopNames.push(stop.name);
							let genStop = { name: stop.name, latlng: stop.latlng, priority: stop.priority };
							genStop.departures = [];
							for (let departure of allDepInfo) {
								if (departure.stopName === genStop.name) {
									genStop.departures.push(departure);
								}
							}
							AStops.push(genStop);
						}
					}
				}
				console.log('AStops=',AStops);
				if (AStops.length > 0) {
					this.addMarkers(AStops, this.busStopMarkersA);
					// Add the group to the map
					this.busStopMarkersA.addTo(this.mymap);
				}
			}
		}
	}*/
	
	
	
	/*
	Text labels in leaflet
	
	var label = L.marker(new L.LatLng(lat, lon), {icon:self.createLabelIcon("yellowLabel", key)}).addTo(self.mymap);
	
	See: http://www.coffeegnome.net/labels-in-leaflet/
	*/
	/*
	createLabelIcon(labelClass,labelText){
		return L.divIcon({ 
			className: labelClass,
			html: labelText
		});
	}*/
	/*
	removeLabels() {
		//console.log('Remove Labels');
		this.labelGroup.remove();
	}
	
	renderLabels() {
		//console.log('Add Labels');
		this.labelGroup.addTo(this.mymap);
	}
	
	renderMarkers() {
		var self = this;
		
		var orangeIcon = L.icon({
			iconUrl:       'img/marker-icon-orange.png',
			iconRetinaUrl: 'img/marker-icon-orange-2x.png',
			shadowUrl:     'img/marker-shadow.png',
			iconSize:    [25, 41], // size of the icon
			shadowSize:  [41, 41], // size of the shadow
			iconAnchor:  [12, 41], // point of the icon which will correspond to marker's location
			//shadowAnchor: [12, 41],  // the same for the shadow
			popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
			tooltipAnchor: [16, -28]
		});
		
		let maplist = undefined;
		Object.keys(this.models).forEach(key => {
			if (key==='MapListModel') {
				maplist = this.models[key].getMapData();
			}
		});
		if (typeof maplist !== 'undefined') {
			Object.keys(maplist).map(key => {
				var lat = maplist[key].latitude;
				var lon = maplist[key].longitude;
				var pic =  maplist[key].picture;
				var title =  maplist[key].title;
				
				var labelMarker = L.marker(new L.LatLng(lat, lon), {icon:self.createLabelIcon("yellowLabel", key)});//.addTo(self.mymap);
				this.labelGroup.addLayer(labelMarker);
				
				var sd = maplist[key].startDate; // sd = "25.05.2019"
				
				var start_timestamp = moment();
				start_timestamp
					.year(parseInt(sd.slice(6),10))
					.month(parseInt(sd.slice(3,5),10)-1)
					.date(parseInt(sd.slice(0,2),10))
					.hour(0)
					.minute(0)
					.second(0);
				
				var now_ts = moment();
				var trip_ts = moment(start_timestamp);
				if (trip_ts.isBefore(now_ts)) {
					var marker = L.marker([lat,lon]).bindPopup('<h6 style="text-align:center;">'+title+'</h6><img src="'+pic+'" width="300"/>');
					// Add each marker to the group
					this.markerGroup.addLayer(marker);
				} else {
					var marker = L.marker([lat,lon],{icon: orangeIcon}).bindPopup('<h6 style="text-align:center;">'+title+'</h6><img src="'+pic+'" width="300"/>');
					// Add each marker to the group
					this.markerGroup.addLayer(marker);
				}
			});
			// Add the group to the map
			this.markerGroup.addTo(this.mymap);
		}
	}
	*/
	
	notify(options) {
		
		if (options.model === 'MapModel' && options.method === 'fetched') {
			if (options.status === 200) {
				if (typeof this.mymap !== 'undefined') {
					console.log('MapView Model fetched');
					
					//this.renderMarkers();
					this.createBusStopMarkersA();
					//this.mymap.addLayer(this.busStopMarkersA);
					
				}
			}
		} else if (options.model === 'ResizeEventObserver' && options.method === 'resize') {
			console.log('MapView resize!!!!');
			if (this.rendered) {
				this.setMapHeight();
			}
		}
	}
	
	
	
	getRouteStyle(feature, layer) {
		let c = '#000000';
		let w = 6;
		if (feature.properties.priority > 0) {
			w += 2;
		}
		if (feature.properties.color) {
			c = feature.properties.color;
		}
		return {
			color: c,
			weight: w,
			opacity: 0.8
		}
	}
	
	getEachRouteFeature(feature, layer) {
		//console.log(feature, layer);
		//Nimi: "Päivättärenpolku"
		//​​color: "#3d9b48"
		//id: 1000109095
		//length: 1.4
		//tyyppi: "Luontopolku"
		//url: ""
		if (feature.properties && feature.properties.Nimi) {
			if (feature.properties.url.length > 0) {
				let s = `<div class="map-route-info-popup-wrapper">
						<p class="map-feature-title">
						<a href="${feature.properties.url}" target="_blank">${feature.properties.Nimi}</a>
						</p>Tyyppi: ${feature.properties.tyyppi}<br/>Pituus: ${feature.properties.length}km
					</div>`
				layer.bindPopup(s);
			} else {
				let s = `<div class="map-route-info-popup-wrapper">
					<p class="map-feature-title">${feature.properties.Nimi}</p>
					Tyyppi: ${feature.properties.tyyppi}<br/>Pituus: ${feature.properties.length}km
				</div>`
				layer.bindPopup(s);
			}
		}
	}
	
	
	getBuildingStyle(feature) {
		
		
	}
	
	onPointToLayer(feature, latlng) {
	
		//console.log('getPointToLayer feature: ',feature);
		//console.log('getPointToLayer: ',latlng);
		//let fcolor = '#ffff00';
		//let fcolor = '#222222';
		
		//console.log('Tyyppi=',feature.properties.tyyppi)
		
		//	switch (feature.properties.tyyppi) {
		//		case 'Opastus (Info)':  fcolor = '#0000ff'; break;
		//		case 'Tulentekopaikka': fcolor = '#ff0000'; break;
		//		case 'Keittokatos':     fcolor = '#ff7800'; break;
		//		default: break;
		//	}
		
		
		// Map icons for buildings etc.
		let iconurl = this.buildingBaseUrl+'opastusbluecircle.png';
		switch (feature.properties.tyyppi) {
			case 'Opastus (Info)':                      iconurl = this.buildingBaseUrl+'opastusbluecircle.png'; break;
			case 'Tulentekopaikka':                     iconurl = this.buildingBaseUrl+'tulentekopaikkaredcircle.png'; break;
			case 'Keittokatos':                         iconurl = this.buildingBaseUrl+'keittokatosred.png'; break;
			case 'Laavu':                               iconurl = this.buildingBaseUrl+'laavu.png'; break;
			case 'Varattava telttailualue':             iconurl = this.buildingBaseUrl+'varattavatelttailualue.png'; break;
			case 'Telttailualue':                       iconurl = this.buildingBaseUrl+'telttailualue.png'; break;
			case 'Telttailupaikka':                     iconurl = this.buildingBaseUrl+'telttailualue.png'; break;
			case 'Kuivakäymälä':                        iconurl = this.buildingBaseUrl+'kuivakaymala.png'; break;
			case 'Jätteiden keräys- ja lajittelupiste': iconurl = this.buildingBaseUrl+'jatteidenlajittelu.png'; break;
			case 'Kota':                                iconurl = this.buildingBaseUrl+'kota.png'; break;
			case 'Luonto- tai näkötorni':               iconurl = this.buildingBaseUrl+'luontotorni.png'; break;
			case 'Kävely- tai kevyen liikenteen silta': iconurl = this.buildingBaseUrl+'silta.png'; break;
			case 'Vuokrakämppä tai -tupa':              iconurl = this.buildingBaseUrl+'vuokratupacircle.png'; break;
			case 'Muu majoitus- tai liikerakennus':     iconurl = this.buildingBaseUrl+'majoitus.png'; break;
			case 'Sauna':                               iconurl = this.buildingBaseUrl+'sauna.png'; break;
			case 'Luontokeskus':                        iconurl = this.buildingBaseUrl+'luontokeskus.png'; break;
			case 'Luontotupa':                          iconurl = this.buildingBaseUrl+'luontotupa.png'; break;
			default: break;
		}
		
		//	const m = L.circleMarker(latlng, {
		//	radius: 10,
		//	fillColor: fcolor,
		//	color: "#000",
		//	weight: 1,
		//	opacity: 1,
		//	fillOpacity: 0.5
		//});
		var BuildingIcon = L.Icon.extend({
			options: {
				shadowUrl: this.buildingBaseUrl+'varjo.png',
				iconSize:     [30, 30],
				shadowSize:   [30, 30],
				iconAnchor:   [2, 28],
				shadowAnchor: [2, 28],
				popupAnchor:  [15, -30]
			}
		});
		var bIcon = new BuildingIcon({iconUrl: iconurl});
		const m = L.marker([latlng.lat, latlng.lng], {icon: bIcon});
		if (feature.properties && feature.properties.Nimi) {
			let s = `<div class="map-route-info-popup-wrapper">
				<p class="map-feature-title">${feature.properties.Nimi}</p>
				Tyyppi: ${feature.properties.tyyppi}
			</div>`
			m.bindPopup(s);
		}
		
		
		
		this.buildingMarkers.addLayer(m);
		// NOTE: We do NOT return marker (m) here, so that this new Marker is NOT added to default Layer.
		// It is therefore not shown in opening view (default zoom is 12).
		return null;
		
		
		
	}
	
	
	getEachBuildingFeature(feature, layer) {
	/*
	*/
	}
	
	handleZoom(z) {
		if (z < 14) { // 11,12,13 
			// Remove layer if it is there.
			if (this.mymap.hasLayer(this.buildingMarkers)) {
				this.mymap.removeLayer(this.buildingMarkers);
			}
		} else { // 14,15,16,17,18
			// if requested zoom level is between 14 - 18: add the layer if it is not already there.
			if (this.mymap.hasLayer(this.buildingMarkers)) {
				// Do nothing
			} else {
				this.mymap.addLayer(this.buildingMarkers);
			}
		}
		
		/*
		
		if (z < 13) { // 11,12
			if (this.mymap.hasLayer(this.busStopMarkersA)) {
				// Do nothing
			} else {
				this.mymap.addLayer(this.busStopMarkersA);
			}
		} else { // 13,14,15,16,17,18
			// Remove layer if it is there.
			if (this.mymap.hasLayer(this.busStopMarkersA)) {
				this.mymap.removeLayer(this.busStopMarkersA);
			}
		}
		*/
	}
	
	render() {
		var self = this;
		
		if (typeof this.mymap !== 'undefined') {
			this.mymap.remove();
		}
		$(this.el).empty().append('<div id="mapid"></div>');
		
		// Setting the map height is NOT needed here, 
		// since we are handling CSS height for the map dynamically in map 'load' callback and in resize callback.
		//$('#mapid').css({height:"85vh",width:"100%"}); 
		
		const ADM = this.getModel('AppDataModel');
		if (typeof ADM !== 'undefined') {
			const homeActiveTarget = ADM.activeTarget;
			const homeZoom = ADM.targets[ADM.activeTarget].zoom;
			const homeCenter = ADM.targets[ADM.activeTarget].center;
			
			console.log(['homeActiveTarget=',homeActiveTarget]);
			console.log(['homeCenter=',homeCenter]);
			console.log(['homeZoom=',homeZoom]);
			
			const position = homeCenter; //[this.lat, this.lng]
			const lat = position[0];
			const lng = position[1];
			const maxBounds = L.latLngBounds(L.latLng(lat+0.2, lng-0.5),L.latLng(lat-0.2, lng+0.5));
			
			// See: https://github.com/elmarquis/Leaflet.GestureHandling
			
			//this.mymap = L.map('mapid',{gestureHandling: true});//.setView([60.26, 24.6], 12);
			this.mymap = L.map('mapid');//.setView([60.26, 24.6], 12);
			
			// NOTE: To use this.mymap.on('load', ... we MUST call this.mymap.setView(...) AFTER defining the 'load'-callback!
			
			/* Example of bounds:
			var southWest = L.latLng(40.712, -74.227),
				northEast = L.latLng(40.774, -74.125),
				mybounds = L.latLngBounds(southWest, northEast);
				
			var map = L.map('map').setView([40.743, -74.176], 17);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png' , {
				bounds: mybounds,
				maxZoom: 18,
				minZoom: 16,
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
			}) .addTo(map);
			L.marker([40.743, -74.176]) .addTo(map); */
			
			// create the tile layer with correct attribution
			var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
			L.tileLayer(osmUrl, {minZoom: 11, maxZoom: 18, bounds: maxBounds, attribution: osmAttrib}).addTo(this.mymap);
			
			if (homeActiveTarget === 'Nuuksio') {
				// Show routes and buildings for Nuuksio.
				//<GeoJSON data={routedata} style={this.getRouteStyle} onEachFeature={this.getEachRouteFeature} />
				L.geoJSON(routedata, {
					style: this.getRouteStyle,
					onEachFeature: this.getEachRouteFeature
				}).addTo(this.mymap);
				//<GeoJSON data={buildingdata} style={this.getBuildingStyle} pointToLayer={this.onPointToLayer} onEachFeature={this.getEachBuildingFeature} />
				L.geoJSON(buildingdata, {
					style: this.getBuildingStyle,
					pointToLayer: this.boundOnPointToLayer, // this.onPointToLayer,
					onEachFeature: this.getEachBuildingFeature
				}).addTo(this.mymap);
			}
			
			this.mymap.on('load', function(e) { 
				//console.log('MapView MAP LOADED!!!!!');
				self.rendered = true;
				self.setMapHeight();
			});
			
			//this.mymap.setView(this.mapcenter, this.mapzoom);
			this.mymap.setView(homeCenter, homeZoom);
			
			
			Object.keys(this.models).forEach(key => {
				if (key==='MapModel') {
					setTimeout(() => this.models[key].fetch(), 100);
				}
			});
			
			
			this.handleZoom(homeZoom);
			
			this.mymap.on("zoomend", function(e) { 
				self.mapzoom = self.mymap.getZoom();
				console.log(['self.mapzoom=',self.mapzoom]);
				ADM.targets[ADM.activeTarget].zoom = self.mapzoom;
				/*if (self.mapzoom > 4) {
					self.renderLabels();
				} else {
					self.removeLabels();
				}*/
				self.handleZoom(self.mapzoom);
			});
			
			this.mymap.on("moveend", function(e) {
				self.mapcenter = self.mymap.getCenter();
				console.log(['self.mapcenter=',self.mapcenter]);
				ADM.targets[ADM.activeTarget].center = [self.mapcenter.lat, self.mapcenter.lng];
			});
		}
	}
}
