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
		/*
		UM.temperature_target
		UM.temperature_upper_limit
		UM.temperature_lower_limit
		UM.humidity_target
		UM.humidity_upper_limit
		UM.humidity_lower_limit
		*/
		this.targets = {
			temp_upper: 24,
			temp_upper_frac: 0,
			temp: 22,
			temp_frac: 0,
			temp_lower: 20,
			temp_lower_frac: 0,
			humi_upper: 45,
			humi_upper_frac: 0,
			humi: 40,
			humi_frac: 0,
			humi_lower: 35,
			humi_lower_frac: 0
		};
		this.types = [
			'heating_temperature_upper',
			'heating_target_temperature',
			'heating_temperature_lower',
			'heating_humidity_upper',
			'heating_target_humidity',
			'heating_humidity_lower'
		];
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
		
		const htt_integer_part = Math.floor(UM.heating_target_temperature);
		const htt_fractions_part = Math.round((UM.heating_target_temperature-htt_integer_part)*100);
		const htu_integer_part = Math.floor(UM.heating_temperature_upper);
		const htu_fractions_part = Math.round((UM.heating_temperature_upper-htu_integer_part)*100);
		const htl_integer_part = Math.floor(UM.heating_temperature_lower);
		const htl_fractions_part = Math.round((UM.heating_temperature_lower-htl_integer_part)*100);
		
		const hth_integer_part = Math.floor(UM.heating_target_humidity);
		const hth_fractions_part = Math.round((UM.heating_target_humidity-hth_integer_part)*100);
		const hhu_integer_part = Math.floor(UM.heating_humidity_upper);
		const hhu_fractions_part = Math.round((UM.heating_humidity_upper-hhu_integer_part)*100);
		const hhl_integer_part = Math.floor(UM.heating_humidity_lower);
		const hhl_fractions_part = Math.round((UM.heating_humidity_lower-hhl_integer_part)*100);
		
		this.targets.temp            = htt_integer_part;
		this.targets.temp_frac       = htt_fractions_part;
		this.targets.temp_upper      = htu_integer_part;
		this.targets.temp_upper_frac = htu_fractions_part;
		this.targets.temp_lower      = htl_integer_part;
		this.targets.temp_lower_frac = htl_fractions_part;
		
		this.targets.humi            = hth_integer_part;
		this.targets.humi_frac       = hth_fractions_part;
		this.targets.humi_upper      = hhu_integer_part;
		this.targets.humi_upper_frac = hhu_fractions_part;
		this.targets.humi_lower      = hhl_integer_part;
		this.targets.humi_lower_frac = hhl_fractions_part;
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
			
			var temperature = document.getElementById('temperature-slider');
			noUiSlider.create(temperature, {
				range: {
					'min': 18,
					'max': 26
				},
				step: 0.1,
				// Handles start at ...
				start: [20, 22, 24],
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
			
			
			var humidity = document.getElementById('humidity-slider');
			noUiSlider.create(humidity, {
				range: {
					'min': 20,
					'max': 60
				},
				step: 1,
				// Handles start at ...
				start: [30, 40, 50],
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
			
			this.rendered = true;
			
		} else {
			console.log('UserHeatingTargetsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}