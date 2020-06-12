
export default class TimetableControl {
	
	constructor(mapview) {
		console.log('TimetableControl Created!');
		this.mapview = mapview;
		this.mymap = mapview.mymap;
		
		this.offset = 0;
		this.MAXLINES = 6;
		this.bustimetables = undefined;
		this.timetableIndexPage = undefined;
		this.boundBusScheduleHandler = (ev) => this.busScheduleHandler(ev);
		this.boundDivHandler = (ev) => this.divHandler(ev);
		this.boundLinkHandler = (ev, context) => this.linkHandler(ev, context);
		this.boundCloseHandler = (ev) => this.closeHandler(ev);
		this.boundUpHandler = (ev) => this.upHandler(ev);
		this.boundDownHandler = (ev) => this.downHandler(ev);
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
	
	
	createTimetable(stop) {
		let s = '<h6 style="text-align:center;">'+stop.name+'</h6>';
		s += '<table class="striped bus-stop-times">';
		s += '<thead><tr><th>Määränpää</th><th>Linja</th><th>Lähtöaika</th></tr></thead><tbody>';
		let firstsix = stop.departures.slice(0,6);
		for (let depa of firstsix) {
			s += '<tr><td>'+depa.headsign+'</td><td>'+depa.shortName+'</td><td>'+depa.departureString+'</td></tr>';
		}
		s += '</tbody></table>';
		console.log(['s=',s]);
		$('#timetable-placeholder').empty().append(s);
	}
	
	
	linkHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		console.log(['link clicked ev.target.id=',ev.target.id]);
		//console.log(['link clicked target=',target]);
		// stopname-0 ....  stopname-7
		const ind = parseInt(ev.target.id.slice(9), 10);
		let _stopnames = [];
		let found = false;
		const MM = this.mapview.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData && MM.BusStopData.stopnames && MM.BusStopData.alldepartures && MM.BusStopData.stops) {
				
				_stopnames = MM.BusStopData.stopnames;
				const sname = _stopnames[this.offset+ind];
				const allDepInfo = MM.BusStopData.alldepartures;
				const stops      = MM.BusStopData.stops;
				for (let stop of stops) {
					if (stop.name === sname && found===false) {
						// Take only the first one.
						let genStop = { name: stop.name, latlng: stop.latlng, priority: stop.priority };
						genStop.departures = [];
						for (let departure of allDepInfo) {
							if (departure.stopName === genStop.name) {
								genStop.departures.push(departure);
							}
						}
						this.createTimetable(genStop);
						found = true;
					}
				}
			}
		}
	}
	
	closeHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		this.hideBusTimetables();
	}
	
	upHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		console.log('up handler');
		let stopnames = [];
		const MM = this.mapview.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData && MM.BusStopData.stopnames) {
				stopnames = MM.BusStopData.stopnames;
			}
		}
		const stopcount = stopnames.length;
		if (this.offset > 0) {
			this.offset--;
		}
		let maxrows = this.MAXLINES;
		if (stopcount < maxrows) {
			maxrows = stopcount;
		}
		for(let i = 0; i < maxrows; i++) {
			$('#stopname-'+i).empty().append(stopnames[i+this.offset]);
		}
	}
	
	downHandler(ev) {
		L.DomEvent.stopPropagation(ev);
		console.log('down handler');
		let stopnames = [];
		const MM = this.mapview.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData && MM.BusStopData.stopnames) {
				stopnames = MM.BusStopData.stopnames;
			}
		}
		const stopcount = stopnames.length;
		const limit = stopcount-this.MAXLINES;
		if (this.offset < limit) {
			this.offset++;
		}
		
		let maxrows = this.MAXLINES;
		if (stopcount < maxrows) {
			maxrows = stopcount;
		}
		for(let i = 0; i < maxrows; i++) {
			$('#stopname-'+i).empty().append(stopnames[i+this.offset]);
		}
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
			console.log(['stopnames=',stopnames]);
			const offs = this.offset;
			const stopcount = stopnames.length;
			let maxrows = this.MAXLINES;
			if (stopcount < maxrows) {
				maxrows = stopcount;
			}
			
			this.timetableIndexPage = L.control({position: 'topright'});
			this.timetableIndexPage.onAdd = function (map) {
				console.log('timetableIndexPage now Added!');
				this._div = L.DomUtil.create('div', 'timetable-index-page'); // create a div with a class "timetable-index-page"
				
				this._div_Row = L.DomUtil.create('div', 'row', this._div); // create a div with a class "row"
				this._div_LCol = L.DomUtil.create('div', 'col s10', this._div_Row);
				
				this._div_Stops = [];
				for (let i = 0; i < maxrows; i++) {
					
					this._div_Stops[i] = L.DomUtil.create('div', 'timetable-index-page-div', this._div_LCol);
					this._div_Stops[i].innerHTML = '<a id="stopname-'+i+'">'+stopnames[i+offs]+'</a>';
					L.DomEvent.on(this._div_Stops[i], 'click dblclick', self.boundLinkHandler);
				}
				
				this._div_RCol = L.DomUtil.create('div', 'col s2', this._div_Row);
				this._img_close = L.DomUtil.create('img', 'timetable-button', this._div_RCol);
				this._img_close.src = 'assets/x.svg';
				L.DomEvent.on(this._img_close, 'click dblclick', self.boundCloseHandler);
				
				if (stopcount > self.MAXLINES) {
					this._img_up = L.DomUtil.create('img', 'timetable-button', this._div_RCol);
					this._img_up.src = 'assets/arrowup.svg';
					this._img_down = L.DomUtil.create('img', 'timetable-button', this._div_RCol);
					this._img_down.src = 'assets/arrowdown.svg';
					L.DomEvent.on(this._img_up, 'click dblclick', self.boundUpHandler);
					L.DomEvent.on(this._img_down, 'click dblclick', self.boundDownHandler);
				}
				L.DomEvent.on(this._div, 'click dblclick', self.boundDivHandler);
				
				//this._div_TTRow = L.DomUtil.create('div', 'row', this._div); // create a div with a class "row"
				this._div_TTCol = L.DomUtil.create('div', 'col s12', this._div_Row);
				this._div_TTCol.id = 'timetable-placeholder';
				//this._div_TTCol.innerHTML = '<div id="timetable-placeholder"></div>';
				return this._div;
			};
			this.timetableIndexPage.onRemove = function (map) {
				console.log('timetableIndexPage now Removed!');
				for (let i = 0; i < maxrows; i++) {
					L.DomEvent.off(this._div_Stops[i], 'click dblclick', self.boundLinkHandler);
				}
				L.DomEvent.off(this._img_close, 'click dblclick', self.boundCloseHandler);
				if (stopcount > self.MAXLINES) {
					L.DomEvent.off(this._img_up, 'click dblclick', self.boundUpHandler);
					L.DomEvent.off(this._img_down, 'click dblclick', self.boundDownHandler);
				}
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