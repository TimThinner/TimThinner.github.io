import routedata from '../../assets/geojson/routedata.js';

export default class HikingRoutesControl {
	
	constructor(mapview) {
		console.log('HikingRoutesControl Created!');
		this.mapview = mapview;
		this.mymap = mapview.mymap;
		
		this.hikingRoutesPage = undefined;
		this.hikingRoutes = undefined;
		this.boundHikingHandler = (ev) => this.hikingHandler(ev);
		this.boundCloseHandler = (ev) => this.closeHandler(ev);
	}
	
	closeHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		if (typeof this.hikingRoutesPage !== 'undefined') {
			this.hikingRoutesPage.remove();
			this.hikingRoutesPage = undefined;
			$('.hiking-button').show();
		}
	}
	
	hikingHandler(ev) {
		const self = this;
		L.DomEvent.stopPropagation(ev);
		
		let homeActiveTarget = 'Nuuksio';
		
		const ADM = this.mapview.getModel('AppDataModel');
		if (typeof ADM !== 'undefined') {
			homeActiveTarget = ADM.activeTarget;
		}
		
		console.log('Hiking Handler for '+homeActiveTarget);
		
		if (typeof this.hikingRoutesPage === 'undefined') {
			
			let routes = [];
			
			if (homeActiveTarget === 'Nuuksio') {
				for (let feature of routedata.features) {
					if (feature.properties.url && feature.properties.url.length > 0) {
						let route = {};
						route.name = feature.properties.Nimi;
						route.url = feature.properties.url;
						route.color = feature.properties.color ? feature.properties.color : '#f00';
						routes.push(route);
					}
				}
			}
				
				/*
				if (feature.properties.color) {
					let route = {};
					route.name = feature.properties.Nimi;
					route.url = feature.properties.url;
					route.color = feature.properties.color;
					routes.push(route);
				} else {
					let route = {};
					route.name = feature.properties.Nimi;
					route.url = feature.properties.url;
					route.color = "#000000";
					routes.push(route);
				}
				*/
			
			routes.sort(function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
			console.log('routes=',routes);
			
			this.hikingRoutesPage = L.control({position: 'bottomright'});
			this.hikingRoutesPage.onAdd = function (map) {
				this._div = L.DomUtil.create('div', 'legend-container'); // create a div with a class "hiking-routes-page"
				this._div_Row = L.DomUtil.create('div', 'row', this._div); // create a div with a class "row"
				
				this._div_Col = L.DomUtil.create('div', 'col s12', this._div_Row);
				
				//this._div_ColR = L.DomUtil.create('div', 'col s2', this._div_Row);
				this._img_close = L.DomUtil.create('img', 'hiking-close-button', this._div_Col);
				this._img_close.src = 'assets/x.svg';
				L.DomEvent.on(this._img_close, 'click dblclick', self.boundCloseHandler);
				
				this._Heading = L.DomUtil.create('p', 'legendtitle', this._div_Col);
				this._Heading.innerHTML = 'Ulkoilureitit';
				
				this._ul = L.DomUtil.create('ul', 'routelist', this._div_Col);
				routes.forEach(route => {
					//const stylecolor = { color: route.color };
					//const stylecolorURL = { color: route.color, fontWeight:'bold' };
					//if (route.url.length > 0) {
					const _li = L.DomUtil.create('li', 'legenditem', this._ul);
					_li.style.color = route.color;
					_li.style.borderLeft = 'solid 7px '+route.color;
					_li.style.fontWeight = 'bold';
					_li.innerHTML = '<a href="'+route.url+'" target="_blank" rel="noopener noreferrer">'+route.name+'</a>';
					//} else {
					//	const _li = L.DomUtil.create('li', 'legenditem', this._ul);
					//	_li.style.color = route.color;
					//	_li.innerHTML = route.name;
					//}
				});
				return this._div;
			};
			this.hikingRoutesPage.onRemove = function (map) {
				L.DomEvent.off(this._img_close, 'click dblclick', self.boundCloseHandler);
			};
			this.hikingRoutesPage.addTo(this.mymap);
			// When Hiking Routes page is displayed, hide the button.
			$('.hiking-button').hide();
		}
	}
	
	/*
		When control is added it is given a class "hiking-button"
	*/
	addHikingRoutesCustomControl() {
		const self = this;
		const img = L.DomUtil.create('img','hiking-button');
		// If your custom control has interactive elements such as clickable buttons, remember
		// to use L.DomEvent.on() inside onAdd() and L.DomEvent.off() inside onRemove().
		L.Control.HikingRoutes = L.Control.extend({
			onAdd: function(map) {
				img.src = 'assets/Hiking2.png';
				img.style.width = '60px';
				img.style.cursor = 'pointer';
				L.DomEvent.on(img, 'click dblclick', self.boundHikingHandler);
				return img;
			},
			onRemove: function(map) {
				L.DomEvent.off(img, 'click dblclick', self.boundHikingHandler);
			}
		});
		this.hikingRoutes = function(opts) {
			return new L.Control.HikingRoutes(opts);
		}
		this.hikingRoutes({ position: 'bottomright' }).addTo(this.mymap);
	}
}