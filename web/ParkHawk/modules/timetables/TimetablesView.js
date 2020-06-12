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
	
	showTimetables() {
		let stopnames = [];
		const MM = this.getModel('MapModel');
		if (typeof MM !== 'undefined') {
			if (MM.BusStopData && MM.BusStopData.stopnames) {
				stopnames = MM.BusStopData.stopnames;
			}
		}
		console.log(['TimetablesView stopnames=',stopnames]);
		
		let i=0;
		let html = '<ul>';
		stopnames.forEach(stopname => {
			html += '<div class="timetable-index-page-div"><a id="stopname-'+i+'">'+stopname+'</a></div>';
			i++;
		});
		html += '</ul>';
		$('#tt-index-placeholder').empty().append(html);
		
		
		// TODO: 
		// Add Event Handlers for Each STOP => Show Timetable in right side of screen?
		// ETC.
		
		
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
				'<div class="col s6" id="tt-index-placeholder">'+
				'</div>'+
				'<div class="col s6" id="tt-content-placeholder">'+
					'<p>UNDER CONSTRUCTION</p>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		this.rendered = true;
	}
}
