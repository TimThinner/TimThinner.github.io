
export default class TimetableControl {
	
	constructor(mapview) {
		console.log('TimetableControl Created!');
		this.mapview = mapview;
		this.mymap = mapview.mymap;
		
		this.bustimetables = undefined;
		this.timetableIndexPage = undefined;
		this.boundBusScheduleHandler = (ev) => this.busScheduleHandler(ev);
		this.boundDivHandler = (ev) => this.divHandler(ev);
		this.boundLinkHandler = (ev, context) => this.linkHandler(ev, context);
		this.boundCloseHandler = (ev) => this.closeHandler(ev);
	}
	
	hideBusTimetables() {
		if (typeof this.timetableIndexPage !== 'undefined') {
			this.timetableIndexPage.remove();
			this.timetableIndexPage = undefined;
			$('.bus-timetable-button').show();
		}
	}
	
	divHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		console.log('div clicked!');
	}
	
	linkHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		console.log(['link clicked ev.target=',ev.target]);
		//console.log(['link clicked target=',target]);
	}
	
	closeHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		this.hideBusTimetables();
	}
	
	busScheduleHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		const self = this;
		if (typeof this.timetableIndexPage === 'undefined') {
			
			let stopnames = [];
			const MM = this.mapview.getModel('MapModel');
			if (typeof MM !== 'undefined') {
				if (MM.BusStopData && MM.BusStopData.stopnames) {
					stopnames = MM.BusStopData.stopnames;
				}
			}
			const stopcount = stopnames.length;
			const maxrows = 8;
			let rowoffset = 0;
			if (stopcount > maxrows) {
				
			}
			
			this.timetableIndexPage = L.control({position: 'topright'});
			this.timetableIndexPage.onAdd = function (map) {
				console.log('timetableIndexPage now Added!');
				this._div = L.DomUtil.create('div', 'timetable-index-page'); // create a div with a class "timetable-index-page"
				
				this._div_Row = L.DomUtil.create('div', 'row', this._div); // create a div with a class "row"
				this._div_LCol = L.DomUtil.create('div', 'col s10', this._div_Row);
				
				this._div_Stops = [];
				for (let i = rowoffset; i < maxrows; i++) {
					
					this._div_Stops[i] = L.DomUtil.create('div', 'timetable-index-page-div', this._div_LCol);
					this._div_Stops[i].innerHTML = '<a id="stopname-'+i+'">'+stopnames[i]+'</a>';
					L.DomEvent.on(this._div_Stops[i], 'click dblclick', self.boundLinkHandler);
				}
				
				this._div_RCol = L.DomUtil.create('div', 'col s2', this._div_Row);
				this._img = L.DomUtil.create('img', 'timetable-button', this._div_RCol);
				this._img.src = 'assets/x.svg';
				L.DomEvent.on(this._img, 'click dblclick', self.boundCloseHandler);
				L.DomEvent.on(this._div, 'click dblclick', self.boundDivHandler);
				return this._div;
			};
			this.timetableIndexPage.onRemove = function (map) {
				console.log('timetableIndexPage now Removed!');
				for (let i = rowoffset; i < maxrows; i++) {
					L.DomEvent.off(this._div_Stops[i], 'click dblclick', self.boundLinkHandler);
				}
				L.DomEvent.off(this._img, 'click dblclick', self.boundCloseHandler);
				L.DomEvent.off(this._div, 'click dblclick', self.boundDivHandler);
			};
			this.timetableIndexPage.addTo(this.mymap);
			// When Timetable index page is displayed, hide the button.
			$('.bus-timetable-button').hide();
		}
	}
	
	/*
		When control is added it is given a class "bus-timetable-button"
	*/
	addBusTimetablesCustomControl() {
		const self = this;
		const img = L.DomUtil.create('img','bus-timetable-button');
		// If your custom control has interactive elements such as clickable buttons, remember
		// to use L.DomEvent.on() inside onAdd() and L.DomEvent.off() inside onRemove().
		L.Control.BusTimetables = L.Control.extend({
			onAdd: function(map) {
				img.src = 'assets/bustimetables.svg';
				img.style.width = '50px';
				img.style.cursor = 'pointer';
				L.DomEvent.on(img, 'click dblclick', self.boundBusScheduleHandler);
				return img;
			},
			onRemove: function(map) {
				L.DomEvent.off(img, 'click dblclick', self.boundBusScheduleHandler);
			}
		});
		this.bustimetables = function(opts) {
			return new L.Control.BusTimetables(opts);
		}
		this.bustimetables({ position: 'topright' }).addTo(this.mymap);
	}
}