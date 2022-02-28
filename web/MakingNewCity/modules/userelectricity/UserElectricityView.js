/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

export default class UserElectricityView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.PTO = new PeriodicTimeoutObserver({interval:180000}); // interval 3 minutes.
		this.PTO.subscribe(this);
		
		/*
			Note: IT TAKES time to fecth electricity values (totalEnergy), even if we are fetching 
			only one value from short period of time.
			
			2022-02-25:
			
			https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=energy&limit=1&start=2022-02-23T23:50&end=2022-02-24T00:00
			...
			https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=energy&limit=1&start=2022-01-25T23:50&end=2022-01-26T00:00
		*/
		
		this.fetchQueue = [];
		this.rendered = false;
		this.FELID = 'user-electricity-view-failure';
		this.chart = undefined; // We have a chart!
	}
	
	show() {
		this.render();
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	
	foo(model_name) {
		
		const ele = this.models[model_name];
		const meas = ele.measurement; // is in normal situation an array.
		if (Array.isArray(meas) && meas.length > 0) {
			const energy = meas[0].totalEnergy;
			console.log(['energy=',energy]);
		}
	}
	
	/*
	foo() {
		
		const ele_now = this.models['UserElectricityNowModel'];
		const ele_day = this.models['UserElectricityDayModel'];
		const ele_week = this.models['UserElectricityWeekModel'];
		const ele_month = this.models['UserElectricityMonthModel'];
		
		const UM = this.controller.master.modelRepo.get('UserModel');
		
		//const dim = moment().daysInMonth();
		
		
		//UM.price_energy_monthly
		//UM.price_energy_basic
		//UM.price_energy_transfer
		
		const meas_now = ele_now.measurement; // is in normal situation an array.
		const meas_day = ele_day.measurement; // is in normal situation an array.
		const meas_week = ele_week.measurement; // is in normal situation an array.
		const meas_month = ele_month.measurement; // is in normal situation an array.
		
		if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_day) && meas_day.length > 0) {
			const energy_now = meas_now[0].totalEnergy;
			const energy_day = meas_day[0].totalEnergy;
			if (typeof energy_now !== 'undefined' && typeof energy_day !== 'undefined') {
				
				const energy_diffe = energy_now - energy_day;
				console.log(['Electricity for day = ',energy_diffe]);
				
			}
		}
		if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_week) && meas_week.length > 0) {
			const energy_now = meas_now[0].totalEnergy;
			const energy_week = meas_week[0].totalEnergy;
			if (typeof energy_now !== 'undefined' && typeof energy_week !== 'undefined') {
				
				const energy_diffe = energy_now - energy_week;
				console.log(['Electricity for week = ',energy_diffe]);
			}
		}
		if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_month) && meas_month.length > 0) {
			const energy_now = meas_now[0].totalEnergy;
			const energy_month = meas_month[0].totalEnergy;
			if (typeof energy_now !== 'undefined' && typeof energy_month !== 'undefined') {
				
				const energy_diffe = energy_now - energy_month;
				console.log(['Electricity for month = ',energy_diffe]);
			}
		}
	}
	*/
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model.indexOf('UserElectricity') === 0 && options.method==='fetched') {
				
				
				//.. and start the fetching process with NEXT model:
				const f = this.fetchQueue.shift();
				if (typeof f !== 'undefined') {
					this.models[f.key].fetch(f.token, f.readkey);
				}
				
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 200) {
						
						$('#'+this.FELID).empty();
						//console.log('OK. '+options.model+' FETCHED.');
						
						this.foo(options.model);
						
						if (typeof this.chart !== 'undefined') {
							console.log('chart is OK => UPDATE CHART DATA!');
						} else {
							console.log('chart not yet done => renderChart!');
							//this.renderChart();
						}
					}
				} else {
					this.render();
				}
				
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Models are 'MenuModel', 'UserElectricityNowModel', ...
				
				this.fetchQueue = [];
				Object.keys(this.models).forEach(key => {
					console.log(['FETCH MODEL key=',key]);
					const UM = this.controller.master.modelRepo.get('UserModel');
					if (UM) {
						this.fetchQueue.push({'key':key,'token':UM.token,'readkey':UM.readkey});
						//this.models[key].fetch(UM.token, UM.readkey);
					}
				});
				//.. and start the fetching process with FIRST model:
				const f = this.fetchQueue.shift();
				if (typeof f !== 'undefined') {
					this.models[f.key].fetch(f.token, f.readkey);
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
		const localized_string_title = LM['translation'][sel]['USER_ELECTRICITY_TITLE'];
		const localized_string_description = LM['translation'][sel]['USER_ELECTRICITY_DESCRIPTION'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/radiator.svg" height="80"/></p>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			/*
			'<div class="row">'+
					'<div class="col s12 chart-wrapper dark-theme">'+
						'<div id="user-electricity-chart" class="medium-chart"></div>'+
						'<div style="text-align:center;" id="user-electricity-chart-average"></div>'+
					'</div>'+
				'</div>'+
				*/
				'<div class="row">'+
					'<div class="col s12 center" style="margin-top:16px;">'+
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
			self.models['MenuModel'].setSelected('userpage');
		});
		//this.handleErrorMessages(this.FELID);
		//this.renderChart();
		this.rendered = true;
	}
}