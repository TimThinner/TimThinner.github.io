/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserAlarmView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserAlarmModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-alarm-view-failure';
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
	
	/*
		Different ALARM types (see BackgroundPeriodicPoller):
		
		'HeatingTemperatureUpperLimit'
		'HeatingTemperatureLowerLimit'
		'HeatingHumidityUpperLimit'
		'HeatingHumidityLowerLimit'
		
		'WaterHotUpperLimit'
		'WaterHotLowerLimit'
		'WaterColdUpperLimit'
		'WaterColdLowerLimit'
		
		'EnergyUpperLimit'
		'EnergyLowerLimit'
	*/
	
	updateLatestValues(param) {
		const self = this;
		//console.log('UPDATE LATEST VALUES '+param);
		/*
			alarmTimestamp: "2021-01-25T23:00"
​​​​			alarmType: "HeatingHumidityUpperLimit"
​​​​			refToUser: "nodatabaseid"
			severity: 3
		*/
		const totals = {
			'HeatingTemperatureUpperLimit':0,
			'HeatingTemperatureLowerLimit':0,
			'HeatingHumidityUpperLimit':0,
			'HeatingHumidityLowerLimit':0,
			'WaterHotUpperLimit':0,
			'WaterHotLowerLimit':0,
			'WaterColdUpperLimit':0,
			'WaterColdLowerLimit':0,
			'EnergyUpperLimit':0,
			'EnergyLowerLimit':0
		}
		// Go through all alarms to count totals for different types:
		
		/*
		let tempc=0;
		let humic=0;
		this.models['UserAlarmModel'].alarms.forEach(a => {
			if (a.alarmType==='HeatingTemperatureUpperLimit') {
				tempc++;
			} else if (a.alarmType==='HeatingHumidityUpperLimit') {
				humic++;
			}
		});*/
		
		//console.log(['tempc=',tempc,' humic=',humic]);
		
		
		this.models['UserAlarmModel'].alarms.forEach(a => {
			//console.log(['alarmTimestamp=',a.alarmTimestamp,' alarmType=',a.alarmType,' refToUser=',a.refToUser,' severity=',a.severity]);
			totals[a.alarmType]++;
		});
		
		//console.log(['totals=',totals]);
		
		
		$('#alarms-table').empty();
		// If totals for some type is greater than zero, create count as a link to further detailed timechart of alarms.
		Object.keys(totals).forEach(key => {
			if (totals[key] > 0) {
				$('#alarms-table').append('<tr><td>'+key+'</td><td>'+totals[key]+'</td><td ><a id="'+key+'-details" href="javascript:void(0);">VIEW DETAILS</a></td></tr>');
				// If user clicks on "DETAILS"-link, set the "selected" and switch to USERALARMDETAILS-view.
				$('#'+key+'-details').on('click',function() {
					self.models['UserAlarmModel'].selected = key;
					self.menuModel.setSelected('USERALARMDETAILS');
				});
			} else {
				$('#alarms-table').append('<tr><td>'+key+'</td><td>'+totals[key]+'</td><td></td></tr>');
			}
		});
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserAlarmModel' && options.method==='fetched') {
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 200) {
						this.updateLatestValues('ALARM MODEL FETCHED');
					}
				} else {
					this.render();
				}
			} else if (options.model==='UserAlarmModel' && options.method==='addOne') {
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 201) {
						this.updateLatestValues('ALARM MODEL ADDED');
					}
				} else {
					this.render();
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
			const localized_string_title = LM['translation'][sel]['USER_ALARM_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_ALARM_DESCRIPTION'];
			
			const html =
				'<div class="row">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
					'<div class="col s12" style="padding-bottom:16px;background-color:#fff">'+
						'<table class="striped">'+
							'<thead>'+
								'<tr>'+
									'<th>Type</th>'+
									'<th>Count</th>'+
									'<th>Details</th>'+
								'</tr>'+
							'</thead>'+
							'<tbody id="alarms-table">'+
							'</tbody>'+
						'</table>'+
					'</div>'+
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
							'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+
				//'<div class="row">'+
				//	'<div class="col s12 center" style="margin-top:16px;">'+
				//		'<button class="btn waves-effect waves-light" id="create-alarm">Create new Alarm'+
				//		'</button>'+
				//	'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			//this.startSwipeEventListeners(
			//	()=>{this.menuModel.setSelected('USERPAGE');},
			//	()=>{this.menuModel.setSelected('USERHEATING');}
			//);
			
			//$('#create-alarm').on('click',function() {
				//self.menuModel.setSelected('USERALARMCREATE');
			//});
			
			$('#back').on('click',function() {
				self.menuModel.setSelected('USERPAGE');
			});
			
			this.handleErrorMessages(this.FELID);
			this.updateLatestValues('RENDER ALARM MODEL READY');
			this.rendered = true;
			
		} else {
			console.log('UserAlarmView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}



		/*
								'<tr>'+
									'<td>Heating Temperature Upper Limit</td>'+
									'<td id="heating-temperature-upper-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Heating Temperature Lower Limit</td>'+
									'<td id="heating-temperature-lower-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Heating Humidity Upper Limit</td>'+
									'<td id="heating-humidity-upper-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Heating Humidity Lower Limit</td>'+
									'<td id="heating-humidity-lower-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Water Hot Upper Limit</td>'+
									'<td id="water-hot-upper-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Water Hot Lower Limit</td>'+
									'<td id="water-hot-lower-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Water Cold Upper Limit</td>'+
									'<td id="water-cold-upper-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Water Cold Lower Limit</td>'+
									'<td id="water-cold-lower-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Energy Upper Limit</td>'+
									'<td id="energy-upper-limit"></td>'+
								'</tr>'+
								'<tr>'+
									'<td>Energy Lower Limit</td>'+
									'<td id="energy-lower-limit"></td>'+
								'</tr>'+
		*/
