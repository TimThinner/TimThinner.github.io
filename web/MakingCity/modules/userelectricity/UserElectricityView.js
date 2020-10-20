/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserElectricityView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserElectricityNowModel'||key==='UserElectricityDayModel'||key==='UserElectricityWeekModel'||key==='UserElectricityMonthModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-electricity-view-failure';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		super.hide();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		super.remove();
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		
		const ele_now = this.controller.master.modelRepo.get('UserElectricityNowModel');
		const ele_day = this.controller.master.modelRepo.get('UserElectricityDayModel');
		const ele_week = this.controller.master.modelRepo.get('UserElectricityWeekModel');
		const ele_month = this.controller.master.modelRepo.get('UserElectricityMonthModel');
		
		if (ele_now && ele_day) {
			
			const meas_now = ele_now.measurement; // is in normal situation an array.
			const meas_day = ele_day.measurement; // is in normal situation an array.
			
			if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_day) && meas_day.length > 0) {
				
				const energy_now = meas_now[0].totalEnergy;
				const energy_day = meas_day[0].totalEnergy;
				if (typeof energy_now !== 'undefined' && typeof energy_day !== 'undefined') {
					const energy_diffe = energy_now - energy_day;
					$('#day-energy').empty().append(energy_diffe.toFixed(1));
				} else {
					$('#day-energy').empty().append('---');
				}
				
			} else {
				$('#day-energy').empty().append('---');
			}
		}
		
		if (ele_now && ele_week) {
			
			const meas_now = ele_now.measurement; // is in normal situation an array.
			const meas_week = ele_week.measurement; // is in normal situation an array.
			if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_week) && meas_week.length > 0) {
				
				const energy_now = meas_now[0].totalEnergy;
				const energy_week = meas_week[0].totalEnergy;
				if (typeof energy_now !== 'undefined' && typeof energy_week !== 'undefined') {
					const energy_diffe = energy_now - energy_week;
					$('#week-energy').empty().append(energy_diffe.toFixed(1));
				} else {
					$('#week-energy').empty().append('---');
				}
				
			} else {
				$('#week-energy').empty().append('---');
			}
		}
		
		if (ele_now && ele_month) {
			const meas_now = ele_now.measurement; // is in normal situation an array.
			const meas_month = ele_month.measurement; // is in normal situation an array.
			if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_month) && meas_month.length > 0) {
				
				const energy_now = meas_now[0].totalEnergy;
				const energy_month = meas_month[0].totalEnergy;
				if (typeof energy_now !== 'undefined' && typeof energy_month !== 'undefined') {
					const energy_diffe = energy_now - energy_month;
					$('#month-energy').empty().append(energy_diffe.toFixed(1));
				} else {
					$('#month-energy').empty().append('---');
				}
				
			} else {
				$('#month-energy').empty().append('---');
			}
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserElectricityNowModel'||options.model==='UserElectricityDayModel'||options.model==='UserElectricityWeekModel'||options.model==='UserElectricityMonthModel') {
				if (options.method==='fetched') {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
						if (options.status === 200) {
							this.updateLatestValues();
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
						'<p style="text-align:center;"><img src="./svg/userpage/electricity.svg" height="80"/></p>'+
						'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
					'<div class="col s12" style="background-color:#fff">'+
						'<table class="centered striped">'+
							'<thead>'+
								'<tr>'+
									'<th>Period</th>'+
									'<th>kWh</th>'+
									'<th>€</th>'+
									'<th>kgCO2</th>'+
								'</tr>'+
							'</thead>'+
							'<tbody>'+
								'<tr>'+
									'<td>Today</td>'+
									'<td id="day-energy"></td>'+
									'<td>---</td>'+
									'<td>---</td>'+
								'</tr>'+
								'<tr>'+
									'<td>This week</td>'+
									'<td id="week-energy"></td>'+
									'<td>---</td>'+
									'<td>---</td>'+
								'</tr>'+
								'<tr>'+
									'<td>This month</td>'+
									'<td id="month-energy"></td>'+
									'<td>---</td>'+
									'<td>---</td>'+
								'</tr>'+
							'</tbody>'+
						'</table>'+
					'</div>'+
					
					'<div class="col s4 center" style="margin-top:16px;">'+
						'<a id="view-charts" >'+
							'<img src="./svg/userpage/viewcharts.svg" class="view-button" />'+
						'</a>'+
					'</div>'+
					'<div class="col s4 center" style="margin-top:16px;">'+
						'<a id="targets" >'+
							'<img src="./svg/userpage/targets.svg" class="view-button" />'+
						'</a>'+
					'</div>'+
					'<div class="col s4 center" style="margin-top:16px;">'+
						'<a id="compensate" >'+
							'<img src="./svg/userpage/compensate.svg" class="view-button" />'+
						'</a>'+
					'</div>'+
					
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
			
			this.startSwipeEventListeners(
				()=>{this.menuModel.setSelected('USERPAGE');},
				()=>{this.menuModel.setSelected('USERPROPS');}
			);
			
			$('#view-charts').on('click',function() {
				//console.log('VIEW CHARTS!');
				self.menuModel.setSelected('USERELECTRICITYCHARTS');
			});
			
			$('#targets').on('click',function() {
				//console.log('TARGETS!');
				self.menuModel.setSelected('USERELECTRICITYTARGETS');
			});
			
			$('#compensate').on('click',function() {
				//console.log('COMPENSATE!');
				self.menuModel.setSelected('USERELECTRICITYCOMPENSATE');
			});
			
			$('#back').on('click',function() {
				self.menuModel.setSelected('USERPAGE');
			});
			
			this.handleErrorMessages(this.FELID);
			this.updateLatestValues();
			this.rendered = true;
			
		} else {
			console.log('UserElectricityView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}