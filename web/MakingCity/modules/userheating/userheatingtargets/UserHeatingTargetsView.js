/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../../common/View.js';

export default class UserHeatingTargetsView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserHeatingNowModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.userModel = this.controller.master.modelRepo.get('UserModel');
		this.userModel.subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-heating-view-failure';
		
		// Always fill the targets-object with values from UserModel.
		this.targets = {
			heating_temperature_upper: 0,
			heating_target_temperature: 0,
			heating_temperature_lower: 0,
			
			heating_humidity_upper: 0,
			heating_target_humidity: 0,
			heating_humidity_lower: 0
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
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.userModel.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		console.log('UPDATE UserHeatingTargets !!!!!!!');
	}
	
	fillTargetsFromUM() {
		// Fill the targets-object with values from UserModel.
		const UM = this.userModel;
		
		this.targets.heating_temperature_upper  = UM.heating_temperature_upper;
		this.targets.heating_target_temperature = UM.heating_target_temperature;
		this.targets.heating_temperature_lower  = UM.heating_temperature_lower;
		
		this.targets.heating_humidity_upper  = UM.heating_humidity_upper;
		this.targets.heating_target_humidity = UM.heating_target_humidity;
		this.targets.heating_humidity_lower  = UM.heating_humidity_lower;
	}
	
	notify(options) {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_heating_target_saved = LM['translation'][sel]['USER_HEATING_TARGET_SAVED'];
		
		if (this.controller.visible) {
			if (options.model==='UserHeatingNowModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserHeatingTargetsView => UserHeatingNowModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestValues();
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
			} else if (options.model==='UserModel' && options.method==='updateHeatingTargets') {
				if (options.status === 200) {
					this.fillTargetsFromUM();
				}
			}
		}
	}
	
	updateTemperature(values) {
		const UM = this.userModel;
		const id = UM.id;
		const authToken = UM.token;
		
		// values = ["20.0°C", "22.0°C", "24.7°C"]
		const data = [
			{propName:'heating_temperature_lower', value:parseFloat(values[0])},
			{propName:'heating_target_temperature', value:parseFloat(values[1])},
			{propName:'heating_temperature_upper', value:parseFloat(values[2])}
		];
		UM.updateHeatingTargets(id, data, authToken);
	}
	
	updateHumidity(values) {
		const UM = this.userModel;
		const id = UM.id;
		const authToken = UM.token;
		
		// values = ['20.0%','30.0%','40.0%']
		const data = [
			{propName:'heating_humidity_lower', value:parseFloat(values[0])},
			{propName:'heating_target_humidity', value:parseFloat(values[1])},
			{propName:'heating_humidity_upper', value:parseFloat(values[2])}
		];
		UM.updateHeatingTargets(id, data, authToken);
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_title = LM['translation'][sel]['USER_HEATING_TARGETS_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_HEATING_TARGET_BOTH_DESCRIPTION'];
			
			const localized_string_subtitle_1 = LM['translation'][sel]['USER_HEATING_CHART_LEGEND_TEMPERATURE'];
			const localized_string_subtitle_2 = LM['translation'][sel]['USER_HEATING_CHART_LEGEND_HUMIDITY'];
			
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			/*
			const localized_string_target_temperature = LM['translation'][sel]['USER_HEATING_TARGET_TEMPERATURE'];
			const localized_string_upper_temperature = LM['translation'][sel]['USER_HEATING_UPPER_TEMPERATURE'];
			const localized_string_lower_temperature = LM['translation'][sel]['USER_HEATING_LOWER_TEMPERATURE'];
			const localized_string_target_humidity = LM['translation'][sel]['USER_HEATING_TARGET_HUMIDITY'];
			const localized_string_upper_humidity = LM['translation'][sel]['USER_HEATING_UPPER_HUMIDITY'];
			const localized_string_lower_humidity = LM['translation'][sel]['USER_HEATING_LOWER_HUMIDITY'];
			*/
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h4>'+localized_string_title+'</h4>'+
						'<p>'+localized_string_description+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s6 center">'+
						'<h5>'+localized_string_subtitle_1+':</h5><p>&nbsp;</p>'+
						'<div id="temperature-slider"></div>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<h5>'+localized_string_subtitle_2+':</h5><p>&nbsp;</p>'+
						'<div id="humidity-slider"></div>'+
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
			
			/*
			this.startSwipeEventListeners(
				()=>{this.menuModel.setSelected('USERHEATING');},
				()=>{this.menuModel.setSelected('USERHEATINGCOMPENSATE');}
			);
			*/
			$('#back').on('click',function() {
				self.menuModel.setSelected('USERHEATING');
			});
			
			this.handleErrorMessages(this.FELID);
			
			const start_temperatures = [
				this.targets.heating_temperature_lower,
				this.targets.heating_target_temperature,
				this.targets.heating_temperature_upper
			];
			var temperature = document.getElementById('temperature-slider');
			noUiSlider.create(temperature, {
				range: {
					'min': 18,
					'max': 26
				},
				step: 0.1,
				// Handles start at ...
				start: [start_temperatures[0], start_temperatures[1], start_temperatures[2]],
				connect: [true, true, true, true],
				// Put '0' at the bottom of the slider
				direction: 'rtl',
				orientation: 'vertical',
				// Move handle on tap, bars are draggable
				behaviour: 'tap-drag',
				tooltips: [true, true, true],
				format: wNumb({
					decimals: 1,
					suffix: '°C'
				})
			});
			// Give the slider dimensions
			temperature.style.height = '300px';
			temperature.style.margin = '0 auto 30px';
			temperature.noUiSlider.on('change', function (values) {
				// values = ["20.0°C", "22.0°C", "24.7°C"]
				console.log(['values=',values]);
				self.updateTemperature(values);
			});
			
			const start_humidities = [
				this.targets.heating_humidity_lower,
				this.targets.heating_target_humidity,
				this.targets.heating_humidity_upper
			];
			var humidity = document.getElementById('humidity-slider');
			noUiSlider.create(humidity, {
				range: {
					'min': 20,
					'max': 60
				},
				step: 1,
				// Handles start at ...
				start: [start_humidities[0], start_humidities[1], start_humidities[2]],
				connect: [true, true, true, true],
				// Put '0' at the bottom of the slider
				direction: 'rtl',
				orientation: 'vertical',
				// Move handle on tap, bars are draggable
				behaviour: 'tap-drag',
				tooltips: [true, true, true],
				format: wNumb({
					decimals: 1,
					suffix: '%'
				})
			});
			// Give the slider dimensions
			humidity.style.height = '300px';
			humidity.style.margin = '0 auto 30px';
			humidity.noUiSlider.on('change', function (values) {
				// values = ['20.0%','30.0%','40.0%']
				console.log(['values=',values]);
				self.updateHumidity(values);
			});
			
			this.rendered = true;
			
		} else {
			console.log('UserHeatingTargetsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}