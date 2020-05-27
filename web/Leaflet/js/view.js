class MapView {
	
	constructor(controller, model, el) {
		this.controller = controller;
		this.model = model;
		this.model.subscribe(this);
		this.el = el;
		this.mymap = undefined;
		this.mapMarkers = [];
		this.mapLabels = [];
	}
	
	fetchMapData(){
		this.model.fetch();
	}
	/*
	Text labels in leaflet
	
	var label = L.marker(new L.LatLng(lat, lon), {icon:self.createLabelIcon("yellowLabel", key)}).addTo(self.mymap);
	
	See: http://www.coffeegnome.net/labels-in-leaflet/
	*/
	createLabelIcon(labelClass,labelText){
		return L.divIcon({ 
			className: labelClass,
			html: labelText
		});
	}
	
	removeLabels() {
		console.log('removeLabels');
		var self = this;
		$.each(this.mapLabels, function(i,v) {
			self.mymap.removeLayer(v);
		});
		this.mapLabels = [];
	}
	
	renderLabels() {
		var self = this;
		if (this.mapLabels.length > 0) {
			
		} else {
			var maplist = this.model.getMapData();
			Object.keys(maplist).map(key => {
				var lat = maplist[key].latitude;
				var lon = maplist[key].longitude;
				var label = L.marker(new L.LatLng(lat, lon), {icon:self.createLabelIcon("yellowLabel", key)}).addTo(self.mymap);
				this.mapLabels.push(label);
			});
		}
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
		
		var maplist = this.model.getMapData();
		// What are the two corners of bounding box?
		// LEFT-UPPER CORNER:
		// maxLat,minLon
		//					RIGHT-LOWER CORNER:
		//					minLat,maxLon
		let maxLat = 0;
		let minLon = 180;
		let minLat = 90;
		let maxLon = -180;
		Object.keys(maplist).map(key => {
			
			var lat = maplist[key].latitude;
			var lon = maplist[key].longitude;
			
			if (lat > maxLat) { maxLat = lat; }
			if (lat < minLat) { minLat = lat; }
			if (lon > maxLon) { maxLon = lon; }
			if (lon < minLon) { minLon = lon; }
			
			var pic =  maplist[key].picture;
			var title =  maplist[key].title;
			
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
				var marker = L.marker([lat,lon]).bindPopup('<h6 style="text-align:center;">'+title+'</h6><img src="'+pic+'" width="300"/>').addTo(self.mymap);
				this.mapMarkers.push(marker);
			} else {
				var marker = L.marker([lat,lon],{icon: orangeIcon}).bindPopup('<h6 style="text-align:center;">'+title+'</h6><img src="'+pic+'" width="300"/>').addTo(self.mymap);
				this.mapMarkers.push(marker);
			}
		});
		
		
		const bounds = [[maxLat, minLon], [minLat, maxLon]];
		console.log(['bounds=',bounds]);
		// bounds = 
		// 41.1428, -16.9314
		// 27.7646, 28.2107
		
		// create an orange rectangle
		L.rectangle(bounds, {color: "#ff7800", weight: 1, fillOpacity: 0.05}).addTo(self.mymap);
		
		
		// zoom the map to the rectangle bounds
		this.mymap.fitBounds(bounds);
		
		
		/*
		const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
		svgElement.setAttribute('viewBox', "0 0 200 200");
		svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
		*/
		var svgElementBounds = [ [ 42, 30 ], [ 28, 38 ] ];
		L.svgOverlay('./svg/water.svg', svgElementBounds).addTo(this.mymap);
	}
	
	notify(options) {
		if (options.model === 'MapListModel' && options.method === 'fetch') {
			if (options.status === 200) {
				this.renderMarkers();
			}
		}
	}
	
	renderMap() {
		var self = this;
		$(this.el).empty();
		//var token = 'pk.eyJ1IjoidGltb2tpbm51bmVuIiwiYSI6ImNqbTZhNjNycjA2cDIza282Zm1ybWEzeWgifQ.GS5Z5VxxA9UlGFsmeISrSg';
		//this.mymap = L.map('mapid',{scrollWheelZoom:false}).setView([45.0, 10.0], 3);
		
		// See: https://github.com/elmarquis/Leaflet.GestureHandling
		this.mymap = L.map('mapid',{gestureHandling: true}).setView([45.0, 10.0], 3);
		/*
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+token, {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
				'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			id: 'mapbox.streets'
		}).addTo(this.mymap);
		*/
		
		/*
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
				'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			id: 'mapbox.streets'
		}).addTo(this.mymap);
		*/
		
		
		// create the tile layer with correct attribution
		var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
		L.tileLayer(osmUrl, {minZoom: 1, maxZoom: 18, attribution: osmAttrib}).addTo(this.mymap);
		
		setTimeout(() => this.fetchMapData(), 100);
		
		this.mymap.on("zoomend", function(e) { 
			var zoom = self.mymap.getZoom();
			//console.log(["ZOOMEND zoom=", zoom]);
			if (zoom > 4) {
				self.renderLabels();
			} else {
				self.removeLabels();
			}
		});
	}
}
