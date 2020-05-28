

export default class MapView {
	
	constructor(controller) {
		this.controller = controller;
		this.mapListModel = controller.master.modelRepo.get('MapListModel');
		this.mapListModel.subscribe(this);
		this.el = controller.el;
		this.mymap = undefined;
		this.markerGroup = L.layerGroup();
		this.labelGroup = L.layerGroup();
		
		this.REO = controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.mapzoom = 3; //12;
		this.mapcenter = [45, 10]; //[60.32, 24.54];
		this.rendered = false;
	}
	
	hide() {
		if (this.mymap) {
			this.mymap.remove();
			this.mymap = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		if (this.mymap) {
			this.mymap.remove();
			this.mymap = undefined;
		}
		this.mapListModel.unsubscribe(this);
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	setMapHeight() {
		if (typeof this.REO.height !== 'undefined') {
			const H = (this.REO.height-70) + 'px'; // menu Height maximum is 60px.
			//console.log(['H=',H]);
			$('#mapid').css({height:H,width:"100%"});
		}
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
		console.log('Remove Labels');
		this.labelGroup.remove();
	}
	
	renderLabels() {
		console.log('Add Labels');
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
		
		var maplist = this.mapListModel.getMapData();
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
				var marker = L.marker([lat,lon]).bindPopup('<h6 style="text-align:center;">'+title+'</h6><img src="'+pic+'" width="300"/>');//.addTo(self.mymap);
				
				// Add each marker to the group
				this.markerGroup.addLayer( marker );
				
			} else {
				var marker = L.marker([lat,lon],{icon: orangeIcon}).bindPopup('<h6 style="text-align:center;">'+title+'</h6><img src="'+pic+'" width="300"/>');//.addTo(self.mymap);
				
				// Add each marker to the group
				this.markerGroup.addLayer( marker );
				
			}
		});
		
		// Add the group to the map
		this.markerGroup.addTo(this.mymap);
		
	}
	
	notify(options) {
		if (options.model === 'MapListModel' && options.method === 'fetch') {
			if (options.status === 200) {
				if (this.mymap) {
					this.renderMarkers();
					
					
				}
			}
		} else if (options.model === 'ResizeEventObserver' && options.method === 'resize') {
			if (this.rendered) {
				
				this.setMapHeight();
				
			} /*else {
				console.log('Map NOT rendered yet!');
			}*/
		}
	}
	
	render() {
		var self = this;
		
		if (this.mymap) {
			this.mymap.remove();
		}
		$(this.el).empty().append('<div id="mapid"></div>');
		
		// Setting the map height is NOT needed here, 
		// since we are handling CSS height for the map dynamically in map 'load' callback and in resize callback.
		//$('#mapid').css({height:"85vh",width:"100%"}); 
		
		// See: https://github.com/elmarquis/Leaflet.GestureHandling
		this.mymap = L.map('mapid',{gestureHandling: true});//.setView([60.26, 24.6], 12);
		// NOTE: To use this.mymap.on('load', ... we MUST call this.mymap.setView(...) AFTER defining the 'load'-callback!
		
		// create the tile layer with correct attribution
		var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
		L.tileLayer(osmUrl, {minZoom: 1, maxZoom: 18, attribution: osmAttrib}).addTo(this.mymap);
		
		this.mymap.on('load', function(e) { 
			console.log('MAP LOADED!!!!!');
			self.setMapHeight();
			self.rendered = true;
		});
		
		this.mymap.setView(this.mapcenter, this.mapzoom);
		
		setTimeout(() => this.mapListModel.fetch(), 100);
		
		this.mymap.on("zoomend", function(e) { 
			self.mapzoom = self.mymap.getZoom();
			if (self.mapzoom > 4) {
				self.renderLabels();
			} else {
				self.removeLabels();
			}
		});
		
		this.mymap.on("moveend", function(e) {
			self.mapcenter = self.mymap.getCenter();
		});
	}
}
