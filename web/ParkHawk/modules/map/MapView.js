import View from '../common/View.js';
//import TimetableControl from './TimetableControl.js';
import HikingRoutesControl from './HikingRoutesControl.js';
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
		
		// Different view depending on Zoom level:
		// Zoom levels 11, 12: busStopMarkersA
		this.busStopMarkersA = L.layerGroup();
		// Zoom levels 13, 14: busStopMarkersB
		this.busStopMarkersB = L.layerGroup();
		// Zoom levels 15, 16, 17, 18: busStopMarkersC
		this.busStopMarkersC = L.layerGroup();
		
		// Different view depending on Zoom level:
		// Show only 2 P-ICONS when zoom-level is between 10-14, hide: 15-18
		this.parkCameraMarkersA = L.layerGroup(); // Only two icons (groups: 2 for Haukkalampi and 2 for Kattila)
		this.parkCameraMarkersB = L.layerGroup(); // All 4 cameras as separate icons
		
		this.boundOnMarkerClick = (e) => this.onMarkerClick(e);
		
		/*
		Place Timetable handling to separate Control: TimetableControl
		Create TimetableControl when MapView is ready.
		
		*/
		//this.timetableControl = undefined;
		this.hikingRoutesControl = undefined;
		
		this.mapzoom = 11;
		this.mapcenter = { lat: 60.32, lng: 24.54 }; //[60.32, 24.54];
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
			console.log(['invalidateSize() H=',H,' W=',this.REO.width]);
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
	
	createBusStopMarkers() {
		
		this.mymap.removeLayer(this.busStopMarkersA);
		this.busStopMarkersA = new L.LayerGroup();
		
		this.mymap.removeLayer(this.busStopMarkersB);
		this.busStopMarkersB = new L.LayerGroup();
		
		this.mymap.removeLayer(this.busStopMarkersC);
		this.busStopMarkersC = new L.LayerGroup();
		
		const MM = this.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData.alldepartures && MM.BusStopData.stops) {
				let AStops = [];
				let BStops = [];
				let CStops = [];
				
				const allDepInfo = MM.BusStopData.alldepartures;
				const stops      = MM.BusStopData.stops;
				//const stopnames      = MM.BusStopData.stopnames;
				let stopNames = [];
				
				for (let stop of stops) {
					// Only few selected bus stops (stop.priority=1) are added to Layer A (zoom levels 11 and 12).
					// Stops with priority 1 are defined in MapModel:
					// ['Kattila','Haukkalammentie','Haltia','Siikaniemi','Siikaranta','Veikkola','Gumbölenristi']
					let genStop = { name: stop.name, latlng: stop.latlng, priority: stop.priority };
					genStop.departures = [];
					for (let departure of allDepInfo) {
						if (departure.stopName === genStop.name) {
							genStop.departures.push(departure);
						}
					}
					if (!stopNames.includes(stop.name)) {
						stopNames.push(stop.name);
						if (stop.priority === 1) {
							AStops.push(genStop);
						}
						BStops.push(genStop);
					}
					CStops.push(genStop);
				}
				console.log('AStops=',AStops);
				console.log('BStops=',BStops);
				console.log('CStops=',CStops);
				if (AStops.length > 0) { this.addMarkers(AStops, this.busStopMarkersA); }
				if (BStops.length > 0) { this.addMarkers(BStops, this.busStopMarkersB); }
				if (CStops.length > 0) { this.addMarkers(CStops, this.busStopMarkersC); }
			}
		}
	}
	
	onMarkerClick(e) {
		//console.log('onMarkerKattilaClick');
		const marker = e.target;
		//console.log(['e.target=',e.target]);
		const elem = marker.getElement();
		if (elem.alt) {
			marker.unbindPopup();
			/* 
			Do not always use 50% of window.innerWidth. Create a more adaptive solution 
			where narrow viewport popup will have 90% and wide viewport 50%.
			When width = 0 => percentage = 90
			When width = 2000 => percentage = 50
			*/
			const percentage = 90 - window.innerWidth*4/200;
			const d = new Date();
			const popupWidth = Math.round(percentage*window.innerWidth/100);
			const imageWidth = popupWidth-20;
			const imageHeight = 720*imageWidth/1280;
			const popupMaxWidth = imageWidth+30;
			const popupMaxHeight = imageHeight+200;
			let s = '';
			const ADM = this.getModel('AppDataModel');
			if (typeof ADM !== 'undefined') {
				ADM.targets[ADM.activeTarget].cameras.forEach(cam=>{
					if (cam.loc === elem.alt) {
						s += '<div class="map-marker-popup-content">';
						//s += '<h5 class="cameras-image-title">'+cam.name+'</h5>';
						s += '<img src="'+cam.url+'?time='+d.getTime()+'" width='+imageWidth+' height='+imageHeight+' alt="" />';
						s += '</div>';
					} else if (cam.name === elem.alt) {
						s += '<div class="map-marker-popup-content">';
						//s += '<h5 class="cameras-image-title">'+cam.name+'</h5>';
						s += '<img src="'+cam.url+'?time='+d.getTime()+'" width='+imageWidth+' height='+imageHeight+' alt="" />';
						s += '</div>';
					}
				});
			}
			marker.bindPopup(s,{minWidth: popupWidth, maxWidth: popupMaxWidth, maxHeight:popupMaxHeight}).openPopup();
		}
	}
	
	createParkCameraMarkers() {
		this.mymap.removeLayer(this.parkCameraMarkersA);
		this.parkCameraMarkersA = new L.LayerGroup();
		
		this.mymap.removeLayer(this.parkCameraMarkersB);
		this.parkCameraMarkersB = new L.LayerGroup();
		
		var ParkCameraIcon = L.Icon.extend({
			options: {
				shadowUrl: 'assets/ParkCameraIconShadow.png',
				iconSize:     [50, 40],
				shadowSize:   [60, 30],
				iconAnchor:   [2, 38],
				shadowAnchor: [2, 34],
				popupAnchor:  [25, -35]
			}
		});
		var pcIcon = new ParkCameraIcon({iconUrl: 'assets/ParkCameraIcon.png'});
		
		const ADM = this.getModel('AppDataModel');
		if (typeof ADM !== 'undefined') {
			ADM.targets[ADM.activeTarget].cameras.forEach(cam=>{
				if (cam.name === 'Haukkalampi 2') {
					// Create merged P-icon for two Parking areas at Haukkalampi.
					const m = L.marker([cam.lat, cam.lon], {icon: pcIcon,'alt':cam.loc}).on('click', this.boundOnMarkerClick);
					this.parkCameraMarkersA.addLayer(m);
				}
				if (cam.name === 'Kattila 1') {
					// Create merged P-icon for two Parking areas at Kattila.
					const m = L.marker([cam.lat, cam.lon], {icon: pcIcon,'alt':cam.loc}).on('click', this.boundOnMarkerClick);
					this.parkCameraMarkersA.addLayer(m);
				}
			});
			ADM.targets[ADM.activeTarget].cameras.forEach(cam=>{
				// Create separate P-icon for each camera.
				const m = L.marker([cam.lat, cam.lon], {icon: pcIcon,'alt':cam.name}).on('click', this.boundOnMarkerClick);
				this.parkCameraMarkersB.addLayer(m);
			});
		}
	}
	
	showRoutingAreas() {
		/*
				routingAreas: [
					{ lat: 60.270, lng: 24.594, radius: 3200 },
					{ lat: 60.2695, lng: 24.4440, radius: 300 },
					{ lat: 60.283, lng: 24.511, radius: 1600 },
					{ lat: 60.310, lng: 24.546, radius: 3000 },
					{ lat: 60.324, lng: 24.5, radius: 1300 }
				]
		*/
		const ADM = this.getModel('AppDataModel');
		if (typeof ADM !== 'undefined') {
			ADM.targets[ADM.activeTarget].busStops.routingAreas.forEach(a=>{
				L.circle([a.lat, a.lng], {radius: a.radius}).addTo(this.mymap);
			});
		}
	}
	
	notify(options) {
		// When map is rendered MapModel is fetched => Bus Stop Markers are created again.
		if (options.model === 'MapModel' && options.method === 'fetched') {
			if (options.status === 200) {
				if (typeof this.mymap !== 'undefined') {
					console.log('MapView Model fetched');
					this.createBusStopMarkers();
					this.createParkCameraMarkers();
					this.handleZoom();
					//this.showRoutingAreas();
				}
			}
		} else if (options.model === 'ResizeEventObserver' && options.method === 'resize') {
			console.log('MapView resize!!!!');
			if (this.rendered) {
				this.setMapHeight();
			}
		}
	}
	/*
		L.geoJSON routedata style CALLBACK
	*/
	getRouteStyle(feature) {
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
	/*
		L.geoJSON routedata onEachFeature CALLBACK
	*/
	getEachRouteFeature(feature, layer) {
		if (feature.properties && feature.properties.Nimi) {
			if (feature.properties.url.length > 0) {
				let s = '<div class="map-route-info-popup-wrapper">';
				s += '<p class="map-feature-title"><a href="'+feature.properties.url+'" target="_blank">'+feature.properties.Nimi+'</a></p>';
				s += 'Tyyppi: '+feature.properties.tyyppi+'<br/>Pituus: '+feature.properties.length+'km</div>';
				layer.bindPopup(s);
			} else {
				let s = '<div class="map-route-info-popup-wrapper">';
				s += '<p class="map-feature-title">'+feature.properties.Nimi+'</p>';
				s += 'Tyyppi: '+feature.properties.tyyppi+'<br/>Pituus: '+feature.properties.length+'km</div>';
				layer.bindPopup(s);
			}
		}
	}
	/*
		L.geoJSON buildingdata style CALLBACK
	*/
	getBuildingStyle(feature) {
		
	}
	/*
		L.geoJSON buildingdata pointToLayer CALLBACK
	*/
	onPointToLayer(feature, latlng) {
		// Map icons for buildings etc.
		let iconurl = 'assets/markers/opastusbluecircle.png';
		switch (feature.properties.tyyppi) {
			case 'Opastus (Info)':                      iconurl = 'assets/markers/opastusbluecircle.png'; break;
			case 'Tulentekopaikka':                     iconurl = 'assets/markers/tulentekopaikkaredcircle.png'; break;
			case 'Keittokatos':                         iconurl = 'assets/markers/keittokatosred.png'; break;
			case 'Laavu':                               iconurl = 'assets/markers/laavu.png'; break;
			case 'Varattava telttailualue':             iconurl = 'assets/markers/varattavatelttailualue.png'; break;
			case 'Telttailualue':                       iconurl = 'assets/markers/telttailualue.png'; break;
			case 'Telttailupaikka':                     iconurl = 'assets/markers/telttailualue.png'; break;
			case 'Kuivakäymälä':                        iconurl = 'assets/markers/kuivakaymala.png'; break;
			case 'Jätteiden keräys- ja lajittelupiste': iconurl = 'assets/markers/jatteidenlajittelu.png'; break;
			case 'Kota':                                iconurl = 'assets/markers/kota.png'; break;
			case 'Luonto- tai näkötorni':               iconurl = 'assets/markers/luontotorni.png'; break;
			case 'Kävely- tai kevyen liikenteen silta': iconurl = 'assets/markers/silta.png'; break;
			case 'Vuokrakämppä tai -tupa':              iconurl = 'assets/markers/vuokratupacircle.png'; break;
			case 'Muu majoitus- tai liikerakennus':     iconurl = 'assets/markers/majoitus.png'; break;
			case 'Sauna':                               iconurl = 'assets/markers/sauna.png'; break;
			case 'Luontokeskus':                        iconurl = 'assets/markers/luontokeskus.png'; break;
			case 'Luontotupa':                          iconurl = 'assets/markers/luontotupa.png'; break;
			default: break;
		}
		var BuildingIcon = L.Icon.extend({
			options: {
				shadowUrl: 'assets/markers/varjo.png',
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
			let s = '<div class="map-route-info-popup-wrapper">';
			s += '<p class="map-feature-title">'+feature.properties.Nimi+'</p>';
			s += 'Tyyppi: '+feature.properties.tyyppi+'</div>';
			m.bindPopup(s);
		}
		this.buildingMarkers.addLayer(m);
		// NOTE: We do NOT return marker (m) here, so that this new Marker is NOT added to default Layer.
		// It is therefore not shown in opening view (default zoom is 11).
		return null;
	}
	/*
		L.geoJSON buildingdata onEachFeature CALLBACK
	*/
	getEachBuildingFeature(feature) {
		
	}
	/*
		Zoom levels 11, 12, 13: "buildings" are NOT VISIBLE
		Zoom levels 14, 15, 16, 17, 18: "buildings" are VISIBLE
		
		Zoom levels 11, 12: busStopMarkersA VISIBLE
		Zoom levels 13, 14: busStopMarkersB VISIBLE
		Zoom levels 15, 16, 17, 18: busStopMarkersC VISIBLE
		
		// Show only 2 P-ICONS when zoom-level is between 11-14, hide: 15-18
		this.parkCameraMarkersA = L.layerGroup(); // Only two icons (groups: 2 for Haukkalampi and 2 for Kattila)
	*/
	handleZoom() {
		switch(this.mapzoom) {
			case 11:
			case 12:
				// NOT VISIBLE: buildingMarkers, busStopMarkersB, busStopMarkersC, parkCameraMarkersB
				if (this.mymap.hasLayer(this.buildingMarkers)) {
					this.mymap.removeLayer(this.buildingMarkers);
				}
				if (this.mymap.hasLayer(this.busStopMarkersB)) {
					this.mymap.removeLayer(this.busStopMarkersB);
				}
				if (this.mymap.hasLayer(this.busStopMarkersC)) {
					this.mymap.removeLayer(this.busStopMarkersC);
				}
				if (this.mymap.hasLayer(this.parkCameraMarkersB)) {
					this.mymap.removeLayer(this.parkCameraMarkersB);
				}
				// VISIBLE: busStopMarkersA, parkCameraMarkersA
				if (!this.mymap.hasLayer(this.busStopMarkersA)) {
					this.mymap.addLayer(this.busStopMarkersA);
				}
				if (!this.mymap.hasLayer(this.parkCameraMarkersA)) {
					this.mymap.addLayer(this.parkCameraMarkersA);
				}
				break;
			
			case 13:
				// NOT VISIBLE: buildingMarkers, busStopMarkersA, busStopMarkersC, parkCameraMarkersB
				if (this.mymap.hasLayer(this.buildingMarkers)) {
					this.mymap.removeLayer(this.buildingMarkers);
				}
				if (this.mymap.hasLayer(this.busStopMarkersA)) {
					this.mymap.removeLayer(this.busStopMarkersA);
				}
				if (this.mymap.hasLayer(this.busStopMarkersC)) {
					this.mymap.removeLayer(this.busStopMarkersC);
				}
				if (this.mymap.hasLayer(this.parkCameraMarkersB)) {
					this.mymap.removeLayer(this.parkCameraMarkersB);
				}
				// VISIBLE: busStopMarkersB, parkCameraMarkersA
				if (!this.mymap.hasLayer(this.busStopMarkersB)) {
					this.mymap.addLayer(this.busStopMarkersB);
				}
				if (!this.mymap.hasLayer(this.parkCameraMarkersA)) {
					this.mymap.addLayer(this.parkCameraMarkersA);
				}
				break;
				
			case 14:
				// NOT VISIBLE: busStopMarkersA, busStopMarkersC, parkCameraMarkersB
				if (this.mymap.hasLayer(this.busStopMarkersA)) {
					this.mymap.removeLayer(this.busStopMarkersA);
				}
				if (this.mymap.hasLayer(this.busStopMarkersC)) {
					this.mymap.removeLayer(this.busStopMarkersC);
				}
				if (this.mymap.hasLayer(this.parkCameraMarkersB)) {
					this.mymap.removeLayer(this.parkCameraMarkersB);
				}
				
				// VISIBLE: buildingMarkers, busStopMarkersB, parkCameraMarkersA
				if (!this.mymap.hasLayer(this.buildingMarkers)) {
					this.mymap.addLayer(this.buildingMarkers);
				}
				if (!this.mymap.hasLayer(this.busStopMarkersB)) {
					this.mymap.addLayer(this.busStopMarkersB);
				}
				if (!this.mymap.hasLayer(this.parkCameraMarkersA)) {
					this.mymap.addLayer(this.parkCameraMarkersA);
				}
				break;
			
			case 15:
			case 16:
			case 17:
			case 18:
				// NOT VISIBLE: busStopMarkersA, busStopMarkersB, parkCameraMarkersA
				if (this.mymap.hasLayer(this.busStopMarkersA)) {
					this.mymap.removeLayer(this.busStopMarkersA);
				}
				if (this.mymap.hasLayer(this.busStopMarkersB)) {
					this.mymap.removeLayer(this.busStopMarkersB);
				}
				if (this.mymap.hasLayer(this.parkCameraMarkersA)) {
					this.mymap.removeLayer(this.parkCameraMarkersA);
				}
				
				// VISIBLE: buildingMarkers, busStopMarkersC, parkCameraMarkersB
				if (!this.mymap.hasLayer(this.buildingMarkers)) {
					this.mymap.addLayer(this.buildingMarkers);
				}
				if (!this.mymap.hasLayer(this.busStopMarkersC)) {
					this.mymap.addLayer(this.busStopMarkersC);
				}
				if (!this.mymap.hasLayer(this.parkCameraMarkersB)) {
					this.mymap.addLayer(this.parkCameraMarkersB);
				}
				break;
		}
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
			
			this.mapzoom = homeZoom;
			this.mapcenter = homeCenter;
			
			console.log(['homeActiveTarget=',homeActiveTarget]);
			console.log(['homeCenter=',homeCenter]);
			console.log(['homeZoom=',homeZoom]);
			
			const lat = homeCenter.lat;
			const lng = homeCenter.lng;
			//const maxBounds = L.latLngBounds(L.latLng(lat+0.2, lng-0.5),L.latLng(lat-0.2, lng+0.5));
			const maxBounds = L.latLngBounds(L.latLng(lat-0.2, lng-0.5),L.latLng(lat+0.2, lng+0.5));
			
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
			// Adds a scale to bottom-left corner of map.
			L.control.scale().addTo(this.mymap);
			
			this.mymap.on('popupopen', function(e) {
				$('.leaflet-control').hide();
			});
			this.mymap.on('popupclose', function(e) {
				$('.leaflet-control').show();
			});
			
			this.mymap.on('load', function(e) { 
				//console.log('MapView MAP LOADED!!!!!');
				self.rendered = true;
				self.setMapHeight();
				
				// __TIMETABLES
				self.hikingRoutesControl = new HikingRoutesControl(self);
				self.hikingRoutesControl.addHikingRoutesCustomControl();
				//self.timetableControl.addBusTimetablesCustomControl();
				// When map area (outside timetable) is clicked, we should close the Timetable.
				//self.mymap.on('click', function(e) {
					//self.timetableControl.hideBusTimetables();
				//});
			});
			
			this.mymap.setView(this.mapcenter, this.mapzoom);
			
			Object.keys(this.models).forEach(key => {
				if (key==='MapModel') {
					setTimeout(() => this.models[key].fetch(), 100);
				}
			});
			
			this.mymap.on("zoomend", function(e) { 
				self.mapzoom = self.mymap.getZoom();
				console.log(['self.mapzoom=',self.mapzoom]);
				ADM.targets[ADM.activeTarget].zoom = self.mapzoom;
				self.handleZoom();
			});
			
			this.mymap.on("moveend", function(e) {
				self.mapcenter = self.mymap.getCenter();
				console.log(['self.mapcenter=',self.mapcenter]);
				ADM.targets[ADM.activeTarget].center = self.mapcenter; //[self.mapcenter.lat, self.mapcenter.lng];
			});
		}
	}
}
