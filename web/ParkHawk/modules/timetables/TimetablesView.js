import View from '../common/View.js';

export default class TimetablesView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.rendered = false;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	
	createTimetable(stop) {
		let s = '<h6 style="text-align:center;">'+stop.name+'</h6>';
		s += '<table class="striped bus-stop-times">';
		s += '<thead><tr><th>Määränpää</th><th>Linja</th><th>Lähtöaika</th></tr></thead><tbody>';
		//let firstsix = stop.departures.slice(0,6);
		for (let depa of stop.departures) { //firstsix) {
			s += '<tr><td>'+depa.headsign+'</td><td>'+depa.shortName+'</td><td>'+depa.departureString+'</td></tr>';
		}
		s += '</tbody></table>';
		console.log(['s=',s]);
		$('#timetables-content-placeholder').empty().append(s);
	}
	
	linkHandler(name) {
		console.log(['name=',name]);
		let found = false;
		const MM = this.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData && MM.BusStopData.stopnames && MM.BusStopData.alldepartures && MM.BusStopData.stops) {
				const allDepInfo = MM.BusStopData.alldepartures;
				const stops      = MM.BusStopData.stops;
				for (let stop of stops) {
					if (stop.name === name && found===false) {
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
	
	showTimetables() {
		const self = this;
		let stopnames = [];
		const MM = this.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData && MM.BusStopData.stopnames) {
				stopnames = MM.BusStopData.stopnames;
			}
		}
		//console.log(['TimetablesView stopnames=',stopnames]);
		let i=0;
		let html = '<ul>';
		stopnames.forEach(stopname => {
			html += '<div class="timetable-index-page-div"><a id="stopname-'+i+'">'+stopname+'</a></div>';
			i++;
		});
		html += '</ul>';
		$('#timetables-index-placeholder').empty().append(html);
		
		// Add Event Handlers for Each STOP => Show Timetable in right side of screen?
		i=0;
		stopnames.forEach(stopname => {
			$('#stopname-'+i).on('click',function(e) {
				self.linkHandler(stopname);
			});
			i++;
		});
	}
	
	notify(options) {
		if (options.model === 'MapModel' && options.method === 'fetched') {
			if (options.status === 200) {
				console.log('MapView Model fetched');
				this.showTimetables();
			}
		}
	}
	
	render() {
		$(this.el).empty();
		
		Object.keys(this.models).forEach(key => {
			if (key==='MapModel') {
				setTimeout(() => this.models[key].fetch(), 100);
			}
		});
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">Timetables</h4>'+
				'</div>'+
				'<div class="col s5" id="timetables-index-placeholder">'+
				'</div>'+
				'<div class="col s7" id="timetables-content-placeholder">'+
					'<p>UNDER CONSTRUCTION</p>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		this.rendered = true;
	}
}
