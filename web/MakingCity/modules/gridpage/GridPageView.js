/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class GridPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			// Subscribe to all models from Controller:
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.rendered = false;
		this.FELID = 'grid-page-view-failure';
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
	
	getFingridPowerSystemStateColor(value) {
		let color = '#fff';
		if (typeof value !== 'undefined') {
			if (value === 1) {
				color = '#0f0';
			} else if (value === 2) {
				color = '#ff0';
			} else if (value === 3) {
				color = '#f00';
			} else if (value === 4) {
				color = '#000';
			} else if (value === 5) {
				color = '#00f';
			}
		}
		return color;
	}
	
	createTrafficLight(value) {
		// Draw the state of the Grid indicator:
		// Circle with color
		const svg = document.querySelector("#fingrid-power-system-state-value-svg");
		const uc = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		uc.setAttributeNS(null, 'cx', 0);
		uc.setAttributeNS(null, 'cy', 0);
		uc.setAttributeNS(null, 'r', 12);
		uc.setAttributeNS(null, 'stroke', '#555');
		uc.setAttributeNS(null, 'stroke-width', 1);
		const fc = this.getFingridPowerSystemStateColor(value);
		uc.setAttributeNS(null, 'fill', fc);
		// append the new circle to the svg
		svg.appendChild(uc);
	}
	
	updateFingridPowerSystemState() {
		const value = this.models['FingridPowerSystemStateModel'].value;
		const start_time = this.models['FingridPowerSystemStateModel'].start_time;
		
		this.createTrafficLight(value);
		
		$('#fingrid-power-system-state-timestamp').empty().append(start_time);
	}
	
	updateElectricityProductionInFinland() {
		const value = this.models['FingridElectricityProductionFinlandModel'].value;
		const start_time = this.models['FingridElectricityProductionFinlandModel'].start_time;
		$('#fingrid-ele-prod-fin-value').empty().append(value);
		$('#fingrid-ele-prod-fin-timestamp').empty().append(start_time);
	}
	
	updateElectricityConsumptionInFinland() {
		const value = this.models['FingridElectricityConsumptionFinlandModel'].value;
		const start_time = this.models['FingridElectricityConsumptionFinlandModel'].start_time;
		$('#fingrid-ele-cons-fin-value').empty().append(value);
		$('#fingrid-ele-cons-fin-timestamp').empty().append(start_time);
	}
	
	updateNuclearPowerProductionInFinland() {
		const value = this.models['FingridNuclearPowerProductionFinlandModel'].value;
		const start_time = this.models['FingridNuclearPowerProductionFinlandModel'].start_time;
		$('#fingrid-nuclear-power-production-value').empty().append(value);
		$('#fingrid-nuclear-power-production-timestamp').empty().append(start_time);
	}
	
	createTable(fid) {
		const html = '<table class="striped">'+
			'<thead>'+
				'<tr>'+
					'<th>Data</th>'+
					'<th>Value (MW)</th>'+
					'<th>Timestamp</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>'+
				'<tr>'+
					'<td>Power system state</td>'+
					'<td id="fingrid-power-system-state-value">'+
						'<svg id="fingrid-power-system-state-value-svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="-15 -15 30 30">'+
							'<circle cx="0" cy="0" r="12" fill="#fff" />'+
						'</svg>'+
					'</td>'+
					'<td id="fingrid-power-system-state-timestamp"></td>'+
				'</tr>'+
				'<tr>'+
					'<td>Electricity production in Finland</td>'+
					'<td id="fingrid-ele-prod-fin-value"></td>'+
					'<td id="fingrid-ele-prod-fin-timestamp"></td>'+
				'</tr>'+
				'<tr>'+
					'<td>Electricity consumption in Finland</td>'+
					'<td id="fingrid-ele-cons-fin-value"></td>'+
					'<td id="fingrid-ele-cons-fin-timestamp"></td>'+
				'</tr>'+
				'<tr>'+
					'<td>Nuclear power production</td>'+
					'<td id="fingrid-nuclear-power-production-value"></td>'+
					'<td id="fingrid-nuclear-power-production-timestamp"></td>'+
				'</tr>'+
			'</tbody>'+
		'</table>';
		$(html).appendTo(fid);
		
		
		/*
		
		Hydro power production
		Power system state
		Wind power production
		Condensing power production
		Other production inc. estimated small-scale production and reserve power plants
		Industrial cogeneration
		Cogeneration of district heating
		Solar power
		Transmission between Finland and Central Sweden
		Transmission between Finland and Estonia
		Transmission between Finland and Northern Sweden
		Transmission between Finland and Russia
		Transmission between Finland and Norway
		*/
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='FingridPowerSystemStateModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('GridPageView => FingridPowerSystemStateModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateFingridPowerSystemState();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='FingridElectricityProductionFinlandModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('GridPageView => FingridElectricityProductionFinlandModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateElectricityProductionInFinland();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='FingridElectricityConsumptionFinlandModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('GridPageView => FingridElectricityConsumptionFinlandModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateElectricityConsumptionInFinland();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='FingridNuclearPowerProductionFinlandModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('GridPageView => FingridNuclearPowerProductionFinlandModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateNuclearPowerProductionInFinland();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
			
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_title = LM['translation'][sel]['GRID_PAGE_TITLE'];
		const localized_string_description = LM['translation'][sel]['GRID_PAGE_DESCRIPTION'];
		//const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					//'<p class="coming-soon">'+localized_string_coming_soon+'</p>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
				'<div class="col s12" id="spinner-wrapper">'+
				'</div>'+
				'<div class="col s12" id="table-wrapper" style="margin-bottom:32px;">'+
				'</div>'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$('#back').on('click',function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		this.createTable('#table-wrapper');
		this.rendered = true;
		
		if (this.areModelsReady()) {
			
			this.handleErrorMessages(this.FELID);
			
			this.updateFingridPowerSystemState();
			this.updateElectricityProductionInFinland();
			this.updateElectricityConsumptionInFinland();
			this.updateNuclearPowerProductionInFinland();
		} //else {
		//	console.log('GridPageView => render models are NOT READY!!!!');
			// this.el = '#content'
			//this.showSpinner('#spinner-wrapper');
		//}
	}
}