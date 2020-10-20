/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserWaterView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserWaterNowModel'||key === 'UserWaterDayModel'||key === 'UserWaterWeekModel'||key === 'UserWaterMonthModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-water-view-failure';
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
		
		const water_now = this.controller.master.modelRepo.get('UserWaterNowModel');
		const water_day = this.controller.master.modelRepo.get('UserWaterDayModel');
		const water_week = this.controller.master.modelRepo.get('UserWaterWeekModel');
		const water_month = this.controller.master.modelRepo.get('UserWaterMonthModel');
		
		if (water_now && water_day) {
			
			const meas_now = water_now.measurement; // is in normal situation an array.
			const meas_day = water_day.measurement; // is in normal situation an array.
			
			if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_day) && meas_day.length > 0) {
				
				const hot_now = meas_now[0].hotTotal;
				const hot_day = meas_day[0].hotTotal;
				if (typeof hot_now !== 'undefined' && typeof hot_day !== 'undefined') {
					const hot_diffe = hot_now - hot_day;
					$('#day-hot').empty().append(hot_diffe.toFixed(0));
				} else {
					$('#day-hot').empty().append('---');
				}
				const cold_now = meas_now[0].coldTotal;
				const cold_day = meas_day[0].coldTotal;
				if (typeof cold_now !== 'undefined' && typeof cold_day !== 'undefined') {
					const cold_diffe = cold_now - cold_day;
					$('#day-cold').empty().append(cold_diffe.toFixed(0));
				} else {
					$('#day-cold').empty().append('---');
				}
			} else {
				$('#day-hot').empty().append('---');
				$('#day-cold').empty().append('---');
			}
		}
		
		if (water_now && water_week) {
			const meas_now = water_now.measurement; // is in normal situation an array.
			const meas_week = water_week.measurement; // is in normal situation an array.
			if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_week) && meas_week.length > 0) {
				
				const hot_now = meas_now[0].hotTotal;
				const hot_week = meas_week[0].hotTotal;
				if (typeof hot_now !== 'undefined' && typeof hot_week !== 'undefined') {
					const hot_diffe = hot_now - hot_week;
					$('#week-hot').empty().append(hot_diffe.toFixed(0));
				} else {
					$('#week-hot').empty().append('---');
				}
				const cold_now = meas_now[0].coldTotal;
				const cold_week = meas_week[0].coldTotal;
				if (typeof cold_now !== 'undefined' && typeof cold_week !== 'undefined') {
					const cold_diffe = cold_now - cold_week;
					$('#week-cold').empty().append(cold_diffe.toFixed(0));
				} else {
					$('#week-cold').empty().append('---');
				}
			} else {
				$('#week-hot').empty().append('---');
				$('#week-cold').empty().append('---');
			}
		}
		
		if (water_now && water_month) {
			const meas_now = water_now.measurement; // is in normal situation an array.
			const meas_month = water_month.measurement; // is in normal situation an array.
			if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_month) && meas_month.length > 0) {
				
				const hot_now = meas_now[0].hotTotal;
				const hot_month = meas_month[0].hotTotal;
				if (typeof hot_now !== 'undefined' && typeof hot_month !== 'undefined') {
					const hot_diffe = hot_now - hot_month;
					$('#month-hot').empty().append(hot_diffe.toFixed(0));
				} else {
					$('#month-hot').empty().append('---');
				}
				const cold_now = meas_now[0].coldTotal;
				const cold_month = meas_month[0].coldTotal;
				if (typeof cold_now !== 'undefined' && typeof cold_month !== 'undefined') {
					const cold_diffe = cold_now - cold_month;
					$('#month-cold').empty().append(cold_diffe.toFixed(0));
				} else {
					$('#month-cold').empty().append('---');
				}
			} else {
				$('#month-hot').empty().append('---');
				$('#month-cold').empty().append('---');
			}
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserWaterNowModel'||options.model==='UserWaterDayModel'||options.model==='UserWaterWeekModel'||options.model==='UserWaterMonthModel') {
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
			const localized_string_title = LM['translation'][sel]['USER_WATER_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_WATER_DESCRIPTION'];
			
			const html =
				'<div class="row">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						'<p style="text-align:center;"><img src="./svg/userpage/water.svg" height="80"/></p>'+
						'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
					'<div class="col s12" style="background-color:#fff">'+
						'<table class="centered striped">'+
							'<thead>'+
								'<tr>'+
									'<th>Period</th>'+
									//'<th><img src="./svg/userpage/waterhot.svg" height="30"/> L</th>'+
									//'<th><img src="./svg/userpage/watercold.svg" height="30"/> L</th>'+
									'<th>HOT (L)</th>'+
									'<th>COLD (L)</th>'+
									'<th>€</th>'+
									'<th>kgCO2</th>'+
								'</tr>'+
							'</thead>'+
							'<tbody>'+
								'<tr>'+
									'<td>Today</td>'+
									'<td id="day-hot"></td>'+
									'<td id="day-cold"></td>'+
									'<td>---</td>'+
									'<td>---</td>'+
								'</tr>'+
								'<tr>'+
									'<td>This week</td>'+
									'<td id="week-hot"></td>'+
									'<td id="week-cold"></td>'+
									'<td>---</td>'+
									'<td>---</td>'+
								'</tr>'+
								'<tr>'+
									'<td>This month</td>'+
									'<td id="month-hot"></td>'+
									'<td id="month-cold"></td>'+
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
					
					'<div class="col s12 center" style="margin-top:32px;">'+
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
				()=>{this.menuModel.setSelected('USERHEATING');}
			);
			
			$('#view-charts').on('click',function() {
				console.log('VIEW CHARTS!');
				self.menuModel.setSelected('USERWATERCHARTS');
			});
			$('#targets').on('click',function() {
				console.log('TARGETS!');
				self.menuModel.setSelected('USERWATERTARGETS');
			});
			$('#compensate').on('click',function() {
				console.log('COMPENSATE!');
				self.menuModel.setSelected('USERWATERCOMPENSATE');
			});
			
			$('#back').on('click',function() {
				self.menuModel.setSelected('USERPAGE');
			});
			
			this.handleErrorMessages(this.FELID);
			this.updateLatestValues();
			this.rendered = true;
			
		} else {
			console.log('UserWaterView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}