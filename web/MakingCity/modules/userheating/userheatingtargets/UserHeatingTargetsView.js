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
					
					// Show Toast: SAVED!
					M.toast({displayLength:1000, html: localized_string_heating_target_saved});
					
					$('#'+options.type+'-edit-placeholder').empty();
					
					this.fillTargetsFromUM();
					
					this.types.forEach(typ=>{
						if (options.type === typ) {
							
						} else {
							$('#'+typ+'-wrapper').show();
						}
					});
					
					
					if (options.type === 'heating_temperature_upper') {
						
						// Fill UI elements with correct values.
						$('#upper-temperature-value').empty().append(this.targets.temp_upper.toString());
						if (this.targets.temp_upper_frac < 10) {
							$('#upper-temperature-fractions-value').empty().append('0'+this.targets.temp_upper_frac.toString());
						} else {
							$('#upper-temperature-fractions-value').empty().append(this.targets.temp_upper_frac.toString());
						}
						
					} else if (options.type === 'heating_target_temperature') {
						
						$('#target-temperature-value').empty().append(this.targets.temp.toString());
						if (this.targets.temp_frac < 10) {
							$('#target-temperature-fractions-value').empty().append('0'+this.targets.temp_frac.toString());
						} else {
							$('#target-temperature-fractions-value').empty().append(this.targets.temp_frac.toString());
						}
						
					} else if (options.type === 'heating_temperature_lower') {
						$('#lower-temperature-value').empty().append(this.targets.temp_lower.toString());
						
						if (this.targets.temp_lower_frac < 10) {
							$('#lower-temperature-fractions-value').empty().append('0'+this.targets.temp_lower_frac.toString());
						} else {
							$('#lower-temperature-fractions-value').empty().append(this.targets.temp_lower_frac.toString());
						}
						
					} else if (options.type === 'heating_humidity_upper') {
						$('#upper-humidity-value').empty().append(this.targets.humi_upper.toString());
						if (this.targets.humi_upper_frac < 10) {
							$('#upper-humidity-fractions-value').empty().append('0'+this.targets.humi_upper_frac.toString());
						} else {
							$('#upper-humidity-fractions-value').empty().append(this.targets.humi_upper_frac.toString());
						}
						
					} else if (options.type === 'heating_target_humidity') {
						$('#target-humidity-value').empty().append(this.targets.humi.toString());
						if (this.targets.humi_frac < 10) {
							$('#target-humidity-fractions-value').empty().append('0'+this.targets.humi_frac.toString());
						} else {
							$('#target-humidity-fractions-value').empty().append(this.targets.humi_frac.toString());
						}
						
					} else if (options.type === 'heating_humidity_lower') {
						$('#lower-humidity-value').empty().append(this.targets.humi_lower.toString());
						if (this.targets.humi_lower_frac < 10) {
							$('#lower-humidity-fractions-value').empty().append('0'+this.targets.humi_lower_frac.toString());
						} else {
							$('#lower-humidity-fractions-value').empty().append(this.targets.humi_lower_frac.toString());
						}
					}
				}
			}
		}
	}
	
	pad(num, size) {
		num = num.toString();
		while (num.length < size) num = "0" + num;
		return num;
	}
	
	
	/*
	
	
	ToDo:
		Limit ranges so that upper cannot be below target, upper cannot be below lower, etc.
	
	*/
	
	
	
	showEdit(type) {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_cancel = LM['translation'][sel]['DA_CANCEL'];
		const localized_string_da_save = LM['translation'][sel]['DA_SAVE'];
		
		// Hide all other wrappers, but not this selected one.
		this.types.forEach(typ=>{
			if (type === typ) {
				
			} else {
				$('#'+typ+'-wrapper').hide();
			}
		});
		
		
		
		const place = '#'+type+'-edit-placeholder';
		/* type = 
			'heating_temperature_upper'
			'heating_target_temperature'
			'heating_temperature_lower'
			'heating_humidity_upper'
			'heating_target_humidity'
			'heating_humidity_lower'
		*/
		let current_value = '';
		let current_value_frac = '';
		
		
		/*
		this.targets = {
			temp: 22,
			temp_frac: 0,
			temp_upper: 26,
			temp_upper_frac: 0,
			temp_lower: 18,
			temp_lower_frac: 0,
			humi: 40,
			humi_frac: 0,
			humi_upper: 45,
			humi_upper_frac: 0,
			humi_lower: 35,
			humi_lower_frac: 0
		};
		*/
		
		if (type === 'heating_temperature_upper') {
			current_value = this.pad(this.targets.temp_upper,3);
			current_value_frac = this.pad(this.targets.temp_upper_frac,2);
			
		} else if (type === 'heating_target_temperature') {
			current_value = this.pad(this.targets.temp,3);
			current_value_frac = this.pad(this.targets.temp_frac,2);
			
		} else if (type === 'heating_temperature_lower') {
			current_value = this.pad(this.targets.temp_lower,3);
			current_value_frac = this.pad(this.targets.temp_lower_frac,2);
		
		} else if (type === 'heating_humidity_upper') {
			current_value = this.pad(this.targets.humi_upper,3);
			current_value_frac = this.pad(this.targets.humi_upper_frac,2);
			
		} else if (type === 'heating_target_humidity') {
			current_value = this.pad(this.targets.humi,3);
			current_value_frac = this.pad(this.targets.humi_frac,2);
			
		} else if (type === 'heating_humidity_lower') {
			current_value = this.pad(this.targets.humi_lower,3);
			current_value_frac = this.pad(this.targets.humi_lower_frac,2);
		}
		
		
		let hundreds = parseInt(current_value[0], 10);
		let tens = parseInt(current_value[1], 10);
		let ones = parseInt(current_value[2], 10);
		
		let tenths = parseInt(current_value_frac[0], 10);
		let hundredths = parseInt(current_value_frac[1], 10);
		
		$(place).empty();
		// Ones, Tens, Hundreds
		// Tenths, Hundredths
		const html =
			'<div class="row" style="margin-top:0;margin-bottom:0;">'+
				'<div class="col s2 m1 offset-m3 edit-item-change-button"><a href="javascript:void(0);" id="hundreds-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="tens-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="ones-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1">&nbsp;</div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="tenths-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="hundredths-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
			'</div>'+
			'<div class="row" style="margin-top:0;margin-bottom:0;">'+
				'<div class="col s2 m1 offset-m3 edit-item-change-number" id="hundreds">'+hundreds+'</div>'+
				'<div class="col s2 m1 edit-item-change-number" id="tens">'+tens+'</div>'+
				'<div class="col s2 m1 edit-item-change-number" id="ones">'+ones+'</div>'+
				'<div class="col s2 m1 edit-item-change-number">,</div>'+
				'<div class="col s2 m1 edit-item-change-number" id="tenths">'+tenths+'</div>'+
				'<div class="col s2 m1 edit-item-change-number" id="hundredths">'+hundredths+'</div>'+
			'</div>'+
			'<div class="row" style="margin-top:0;">'+
				'<div class="col s2 m1 offset-m3 edit-item-change-button"><a href="javascript:void(0);" id="hundreds-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="tens-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="ones-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1">&nbsp;</div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="tenths-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="hundredths-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s2 center">'+
					'<p>&nbsp;</p>'+
				'</div>'+
				'<div class="col s4 center">'+
					'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel-target">'+localized_string_da_cancel+'</button>'+
				'</div>'+
				'<div class="col s4 center">'+
					'<button class="btn waves-effect waves-light" id="update-target">'+localized_string_da_save+'</button>'+
				'</div>'+
				'<div class="col s2 center">'+
					'<p>&nbsp;</p>'+
				'</div>'+
			'</div>';
		$(html).appendTo(place);
		
		// All digits can be set to values from 0 to 9.
		$('#hundreds-up').on('click',function() {
			if (hundreds < 9) {
				hundreds++;
				$('#hundreds').empty().append(hundreds);
			}
		});
		$('#hundreds-down').on('click',function() {
			if (hundreds > 0) {
				hundreds--;
				$('#hundreds').empty().append(hundreds);
			}
		});
		$('#tens-up').on('click',function() {
			if (tens < 9) {
				tens++;
				$('#tens').empty().append(tens);
			}
		});
		$('#tens-down').on('click',function() {
			if (tens > 0) {
				tens--;
				$('#tens').empty().append(tens);
			}
		});
		$('#ones-up').on('click',function() {
			if (ones < 9) {
				ones++;
				$('#ones').empty().append(ones);
			}
		});
		$('#ones-down').on('click',function() {
			if (ones > 0) {
				ones--;
				$('#ones').empty().append(ones);
			}
		});
		$('#tenths-up').on('click',function() {
			if (tenths < 9) {
				tenths++;
				$('#tenths').empty().append(tenths);
			}
		});
		$('#tenths-down').on('click',function() {
			if (tenths > 0) {
				tenths--;
				$('#tenths').empty().append(tenths);
			}
		});
		$('#hundredths-up').on('click',function() {
			if (hundredths < 9) {
				hundredths++;
				$('#hundredths').empty().append(hundredths);
			}
		});
		$('#hundredths-down').on('click',function() {
			if (hundredths > 0) {
				hundredths--;
				$('#hundredths').empty().append(hundredths);
			}
		});
		
		$('#cancel-target').on('click',function() {
			$(place).empty();
			self.types.forEach(typ=>{
				if (type === typ) {
					
				} else {
					$('#'+typ+'-wrapper').show();
				}
			});
		});
		
		
		$('#update-target').on('click',function() {
			const UM = self.userModel;
			const id = UM.id;
			const authToken = UM.token;
			
			const newfloat = hundreds*100 + tens*10 + ones + tenths/10 + hundredths/100;
			console.log(['newfloat=',newfloat]);
			/*
			propName: 
			'heating_target_temperature'
			'heating_temperature_upper'
			'heating_temperature_lower'
			
			'heating_target_humidity'
			'heating_humidity_upper'
			'heating_humidity_lower'
			
			*/
			
			const data = [{propName:type, value:newfloat}];
			UM.updateHeatingTargets(id, data, authToken, type);
		});
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_title = LM['translation'][sel]['USER_HEATING_TARGETS_TITLE'];
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			
			const localized_string_target_temperature = LM['translation'][sel]['USER_HEATING_TARGET_TEMPERATURE'];
			const localized_string_upper_temperature = LM['translation'][sel]['USER_HEATING_UPPER_TEMPERATURE'];
			const localized_string_lower_temperature = LM['translation'][sel]['USER_HEATING_LOWER_TEMPERATURE'];
			const localized_string_target_humidity = LM['translation'][sel]['USER_HEATING_TARGET_HUMIDITY'];
			const localized_string_upper_humidity = LM['translation'][sel]['USER_HEATING_UPPER_HUMIDITY'];
			const localized_string_lower_humidity = LM['translation'][sel]['USER_HEATING_LOWER_HUMIDITY'];
			
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h4>'+localized_string_title+'</h4>'+
					'</div>'+
				'</div>'+
				
				'<div class="row">'+
					'<div class="col s12 center" id="heating_temperature_upper-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="upper-temperature-edit">'+
							localized_string_upper_temperature +
							'<span id="upper-temperature-value"></span>,'+
							'<span id="upper-temperature-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> °C</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="heating_temperature_upper-edit-placeholder">'+
						'</div>'+
					'</div>'+
					
					'<div class="col s12 center" id="heating_target_temperature-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="target-temperature-edit">'+
							localized_string_target_temperature +
							'<span id="target-temperature-value"></span>,'+
							'<span id="target-temperature-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> °C</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="heating_target_temperature-edit-placeholder">'+
						'</div>'+
					'</div>'+
					
					'<div class="col s12 center" id="heating_temperature_lower-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="lower-temperature-edit">'+
							localized_string_lower_temperature +
							'<span id="lower-temperature-value"></span>,'+
							'<span id="lower-temperature-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> °C</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="heating_temperature_lower-edit-placeholder">'+
						'</div>'+
					'</div>'+
				'</div>'+
				
				
				'<div class="row">'+
					'<div class="col s12 center" id="heating_humidity_upper-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="upper-humidity-edit">'+
							localized_string_upper_humidity +
							'<span id="upper-humidity-value"></span>,'+
							'<span id="upper-humidity-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> %</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="heating_humidity_upper-edit-placeholder">'+
						'</div>'+
					'</div>'+
					
					'<div class="col s12 center" id="heating_target_humidity-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="target-humidity-edit">'+
							localized_string_target_humidity +
							'<span id="target-humidity-value"></span>,'+
							'<span id="target-humidity-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> %</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="heating_target_humidity-edit-placeholder">'+
						'</div>'+
					'</div>'+
					
					'<div class="col s12 center" id="heating_humidity_lower-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="lower-humidity-edit">'+
							localized_string_lower_humidity +
							'<span id="lower-humidity-value"></span>,'+
							'<span id="lower-humidity-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> %</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="heating_humidity_lower-edit-placeholder">'+
						'</div>'+
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
			
			
			
			// Fill UI elements with correct values.
			$('#upper-temperature-value').empty().append(this.targets.temp_upper.toString());
			$('#target-temperature-value').empty().append(this.targets.temp.toString());
			$('#lower-temperature-value').empty().append(this.targets.temp_lower.toString());
			
			if (this.targets.temp_upper_frac < 10) {
				$('#upper-temperature-fractions-value').empty().append('0'+this.targets.temp_upper_frac.toString());
			} else {
				$('#upper-temperature-fractions-value').empty().append(this.targets.temp_upper_frac.toString());
			}
			if (this.targets.temp_frac < 10) {
				$('#target-temperature-fractions-value').empty().append('0'+this.targets.temp_frac.toString());
			} else {
				$('#target-temperature-fractions-value').empty().append(this.targets.temp_frac.toString());
			}
			if (this.targets.temp_lower_frac < 10) {
				$('#lower-temperature-fractions-value').empty().append('0'+this.targets.temp_lower_frac.toString());
			} else {
				$('#lower-temperature-fractions-value').empty().append(this.targets.temp_lower_frac.toString());
			}
			
			$('#upper-humidity-value').empty().append(this.targets.humi_upper.toString());
			$('#target-humidity-value').empty().append(this.targets.humi.toString());
			$('#lower-humidity-value').empty().append(this.targets.humi_lower.toString());
			
			if (this.targets.humi_upper_frac < 10) {
				$('#upper-humidity-fractions-value').empty().append('0'+this.targets.humi_upper_frac.toString());
			} else {
				$('#upper-humidity-fractions-value').empty().append(this.targets.humi_upper_frac.toString());
			}
			if (this.targets.humi_frac < 10) {
				$('#target-humidity-fractions-value').empty().append('0'+this.targets.humi_frac.toString());
			} else {
				$('#target-humidity-fractions-value').empty().append(this.targets.humi_frac.toString());
			}
			if (this.targets.humi_lower_frac < 10) {
				$('#lower-humidity-fractions-value').empty().append('0'+this.targets.humi_lower_frac.toString());
			} else {
				$('#lower-humidity-fractions-value').empty().append(this.targets.humi_lower_frac.toString());
			}
			
			
			/* Use these as types:
			'heating_target_temperature'
			'heating_temperature_upper'
			'heating_temperature_lower'
			'heating_target_humidity'
			'heating_humidity_upper'
			'heating_humidity_lower'
			*/
			$('#upper-temperature-edit').on('click',function() {
				self.showEdit('heating_temperature_upper');
				
			});
			
			$('#target-temperature-edit').on('click',function() {
				self.showEdit('heating_target_temperature');
				
			});
			
			$('#lower-temperature-edit').on('click',function() {
				
				self.showEdit('heating_temperature_lower');
			});
			
			$('#upper-humidity-edit').on('click',function() {
				
				self.showEdit('heating_humidity_upper');
			});
			$('#target-humidity-edit').on('click',function() {
				self.showEdit('heating_target_humidity');
				
			});
			$('#lower-humidity-edit').on('click',function() {
				self.showEdit('heating_humidity_lower');
			});
			
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
			
			this.rendered = true;
			
		} else {
			console.log('UserHeatingTargetsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}