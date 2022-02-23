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
	
	notify(options) {
		if (this.controller.visible) {
			if ((options.model==='UserElectricityNowModel'||
				options.model==='UserElectricityDayModel'||
				options.model==='UserElectricityWeekModel'||
				options.model==='UserElectricityMonthModel') && options.method==='fetched') {
				
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 200) {
						
						$('#'+this.FELID).empty();
						console.log('OK. Electricity Now, Day, Week or Month FETCHED.');
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
				Object.keys(this.models).forEach(key => {
					console.log(['FETCH MODEL key=',key]);
					const UM = this.controller.master.modelRepo.get('UserModel');
					if (UM) {
						this.models[key].fetch(UM.token, UM.readkey);
					}
				});
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
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
			
			this.handleErrorMessages(this.FELID);
			//this.renderChart();
			this.rendered = true;
			
		} else {
			console.log('UserElectricityView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}