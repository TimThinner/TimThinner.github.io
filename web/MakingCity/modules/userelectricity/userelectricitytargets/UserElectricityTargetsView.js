/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../../common/View.js';

export default class UserElectricityTargetsView extends View {
	
	constructor(controller) {
		super(controller);
		
		this.userModel = this.controller.master.modelRepo.get('UserModel');
		this.userModel.subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-electricity-view-failure';
		
		this.targets = {
			energy_upper: 0,
			energy_target: 0,
			energy_lower: 0,
		};
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
		this.userModel.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	fillTargetsFromUM() {
		// Fill the targets-object with values from UserModel.
		const UM = this.userModel;
		
		this.targets.energy_upper  = UM.energy_upper;
		this.targets.energy_target = UM.energy_target;
		this.targets.energy_lower  = UM.energy_lower;
		
	}
	
	
	/*
		"EnergyUpperLimit"
		"EnergyLowerLimit"
		const data = {
			refToUser: UM.id,
			alarmType: 'EnergyUpperLimit',
			alarmTimestamp: '2020-12-12T12:00',
			severity: 3
		};
	*/
	
	updateAlarmCount() {
		const m = this.controller.master.modelRepo.get('UserAlarmModel');
		let EUL = 0;
		let ELL = 0;
		m.alarms.forEach(a => {
			if (a.alarmType==='EnergyUpperLimit') {
				EUL++;
			} else if (a.alarmType==='EnergyLowerLimit') {
				ELL++;
			}
		});
		$('#EUL-count').empty().append(EUL);
		$('#ELL-count').empty().append(ELL);
	}
	
	notify(options) {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_target_saved = LM['translation'][sel]['USER_TARGET_SAVED'];
		
		if (this.controller.visible) {
			if (options.model==='UserModel' && options.method==='updateEnergyTargets') {
				if (options.status === 200) {
					
					// Show Toast: SAVED!
					M.toast({displayLength:1000, html: localized_string_target_saved});
					
					this.fillTargetsFromUM();
					this.controller.master.checkAlarms('UserElectricityTSModel');
					this.updateAlarmCount();
				}
			}
		}
	}
	
	updateEnergy(values) {
		const UM = this.userModel;
		const id = UM.id;
		const authToken = UM.token;
		
		// values = ["23kWh", "25kWh", "45kWh"]
		// if any value is really changed => update model.
		const v0 = parseFloat(values[0]);
		const v1 = parseFloat(values[1]);
		const v2 = parseFloat(values[2]);
		
		if (this.targets.energy_lower!==v0||this.targets.energy_target!== v1||this.targets.energy_upper!==v2) {
			const data = [
				{propName:'energy_lower', value:v0},
				{propName:'energy_target', value:v1},
				{propName:'energy_upper', value:v2}
			];
			UM.updateEnergyTargets(id, data, authToken);
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_title = LM['translation'][sel]['USER_ELECTRICITY_TARGETS_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_ELECTRICITY_TARGETS_DESCRIPTION'];
			const localized_string_alarm_count_description = LM['translation'][sel]['USER_TARGETS_ALARM_COUNT_DESCRIPTION'];
			
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			
			const localized_string_target = LM['translation'][sel]['USER_TARGET'];
			const localized_string_upper_limit = LM['translation'][sel]['USER_UPPER_LIMIT'];
			const localized_string_lower_limit = LM['translation'][sel]['USER_LOWER_LIMIT'];
			
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h4>'+localized_string_title+'</h4>'+
						'<p>'+localized_string_description+' <span class="alarm-count-description">'+localized_string_alarm_count_description+'</span></p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<p class="alarm-count" id="EUL-count"></p>'+
						'<div id="energy-slider"></div>'+
						'<p class="alarm-count" id="ELL-count"></p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
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
			
			// Fill the targets-object with values from UserModel.
			this.fillTargetsFromUM();
			
			//this.startSwipeEventListeners(
			//	()=>{this.menuModel.setSelected('USERELECTRICITY');},
			//	()=>{this.menuModel.setSelected('USERELECTRICITYCOMPENSATE');}
			//);
			
			$('#back').on('click',function() {
				// If limits are changed, we must perform Alarm checking immediately.
				self.controller.master.checkAlarms('UserElectricityTSModel');
				
				if (typeof self.controller.returnAddress !== 'undefined') {
					self.menuModel.setSelected(self.controller.returnAddress); // 'USERALARM'
					self.controller.returnAddress = undefined; // Now the return address is back to default.
				} else {
					self.menuModel.setSelected('USERELECTRICITY');
				}
			});
			
			this.handleErrorMessages(this.FELID);
			
			const start_energy = [
				this.targets.energy_lower,
				this.targets.energy_target,
				this.targets.energy_upper
			];
			
			const energy_range_max = this.targets.energy_upper + 20;
			
			var energys = document.getElementById('energy-slider');
			noUiSlider.create(energys, {
				range: {
					'min': 0,
					'max': energy_range_max
				},
				step: 0.1,
				// Handles start at ...
				start: [start_energy[0], start_energy[1], start_energy[2]],
				connect: [true, true, true, true],
				// Put '0' at the bottom of the slider
				direction: 'rtl',
				orientation: 'vertical',
				// Move handle on tap, bars are draggable
				behaviour: 'tap-drag',
				tooltips: [wNumb({decimals:0, suffix:'kWh', prefix:localized_string_lower_limit}), wNumb({decimals:0, suffix:'kWh',prefix:localized_string_target}), wNumb({decimals:0, suffix:'kWh', prefix:localized_string_upper_limit})]
				//tooltips: [true, true, true],
				/*format: wNumb({
					decimals: 1,
					suffix: '°C'
				})*/
			});
			// Give the slider dimensions
			energys.style.height = '300px';
			energys.style.margin = '30px auto';
			energys.noUiSlider.on('change', function (values) {
				console.log(['values=',values]);
				self.updateEnergy(values);
			});
			
			this.updateAlarmCount();
			this.rendered = true;
			
		} else {
			console.log('UserElectricityTargetsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}