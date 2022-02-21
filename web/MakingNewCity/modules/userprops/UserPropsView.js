/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserPropsView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.userModel = this.controller.master.modelRepo.get('UserModel');
		this.userModel.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'user-props-view-failure';
		
		// Always fill the price-object with values from UserModel.
		/*
		UM.price_energy_monthly
		UM.price_energy_basic
		UM.price_energy_transfer
		*/
		this.price = {
			energy: 0, // sents
			energy_frac: 0,
			transfer: 0, // sents
			transfer_frac: 0,
			monthly: 0, // euros
			monthly_frac: 0 // sents
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
	
	fillPriceFromUM() {
		// Fill the price-object with values from UserModel.
		const UM = this.userModel;
		
		const pem_integer_part = Math.floor(UM.price_energy_monthly);
		const pem_fractions_part = Math.round((UM.price_energy_monthly-pem_integer_part)*100);
		//console.log(['pem_integer_part=',pem_integer_part,' pem_fractions_part',pem_fractions_part]);
		
		const peb_integer_part = Math.floor(UM.price_energy_basic);
		const peb_fractions_part = Math.round((UM.price_energy_basic-peb_integer_part)*100);
		//console.log(['peb_integer_part=',peb_integer_part,' peb_fractions_part',peb_fractions_part]);
		
		const pet_integer_part = Math.floor(UM.price_energy_transfer);
		const pet_fractions_part = Math.round((UM.price_energy_transfer-pet_integer_part)*100);
		//console.log(['pet_integer_part=',pet_integer_part,' pet_fractions_part',pet_fractions_part]);
		
		
		/*
		UM.price_energy_monthly
		UM.price_energy_basic
		UM.price_energy_transfer
		*/
		this.price.monthly       = pem_integer_part;
		this.price.monthly_frac  = pem_fractions_part;
		this.price.energy        = peb_integer_part;
		this.price.energy_frac   = peb_fractions_part;
		this.price.transfer      = pet_integer_part;
		this.price.transfer_frac = pet_fractions_part;
	}
	
	notify(options) {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_price_saved_ok = LM['translation'][sel]['USER_ENERGY_PRICE_SAVED_OK'];
		
		if (this.controller.visible) {
			
			if (options.model==='UserModel' && options.method==='updateEnergyPrices') {
				
				if (options.status === 200) {
					// Show Toast: Energy Prices SAVED OK!
					M.toast({displayLength:1000, html: localized_string_price_saved_ok});
					
					$('#energy-'+options.type+'-price-edit-placeholder').empty();
					
					this.fillPriceFromUM();
					
					if (options.type === 'monthly') {
						$('#energy-basic-price-wrapper').show();
						$('#energy-transfer-price-wrapper').show();
						$('#change-password-wrapper').show();
						
						// Fill UI elements with correct values.
						$('#energy-monthly-price-value').empty().append(this.price.monthly.toString());
						if (this.price.monthly_frac < 10) {
							$('#energy-monthly-price-fractions-value').empty().append('0'+this.price.monthly_frac.toString());
						} else {
							$('#energy-monthly-price-fractions-value').empty().append(this.price.monthly_frac.toString());
						}
					} else if (options.type === 'basic') {
						
						$('#energy-monthly-price-wrapper').show();
						$('#energy-transfer-price-wrapper').show();
						$('#change-password-wrapper').show();
						
						// Fill UI elements with correct values.
						$('#energy-basic-price-value').empty().append(this.price.energy.toString());
						if (this.price.energy_frac < 10) {
							$('#energy-basic-price-fractions-value').empty().append('0'+this.price.energy_frac.toString());
						} else {
							$('#energy-basic-price-fractions-value').empty().append(this.price.energy_frac.toString());
						}
					} else { // 'transfer'
						$('#energy-monthly-price-wrapper').show();
						$('#energy-basic-price-wrapper').show();
						$('#change-password-wrapper').show();
						
						// Fill UI elements with correct values.
						$('#energy-transfer-price-value').empty().append(this.price.transfer.toString());
						if (this.price.transfer_frac < 10) {
							$('#energy-transfer-price-fractions-value').empty().append('0'+this.price.transfer_frac.toString());
						} else {
							$('#energy-transfer-price-fractions-value').empty().append(this.price.transfer_frac.toString());
						}
					}
				} else { // Error in REST-call.
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
	
	pad(num, size) {
		num = num.toString();
		while (num.length < size) num = "0" + num;
		return num;
	}
	
	/*
		this.price = {
			energy: 0, // sents
			energy_frac: 0,
			transfer: 0, // sents
			transfer_frac: 0,
			monthly: 0, // euros
			monthly_frac: 0 // sents
		};
	*/
	showEdit(type) {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_cancel = LM['translation'][sel]['DA_CANCEL'];
		const localized_string_da_save = LM['translation'][sel]['DA_SAVE'];
		
		const place = '#energy-'+type+'-price-edit-placeholder';
		
		let current_value = '';
		let current_value_frac = '';
		
		if (type === 'monthly') {
			current_value = this.pad(this.price.monthly,3);
			current_value_frac = this.pad(this.price.monthly_frac,2);
			
		} else if (type === 'basic') {
			current_value = this.pad(this.price.energy,3);
			current_value_frac = this.pad(this.price.energy_frac,2);
			
		} else {
			current_value = this.pad(this.price.transfer,3);
			current_value_frac = this.pad(this.price.transfer_frac,2);
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
					'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel-price">'+localized_string_da_cancel+'</button>'+
				'</div>'+
				'<div class="col s4 center">'+
					'<button class="btn waves-effect waves-light" id="update-price">'+localized_string_da_save+'</button>'+
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
		
		$('#cancel-price').on('click',function() {
			$(place).empty();
			if (type === 'monthly') {
				$('#energy-basic-price-wrapper').show();
				$('#energy-transfer-price-wrapper').show();
				
			} else if (type === 'basic') {
				$('#energy-monthly-price-wrapper').show();
				$('#energy-transfer-price-wrapper').show();
				
			} else {
				$('#energy-monthly-price-wrapper').show();
				$('#energy-basic-price-wrapper').show();
			}
			$('#change-password-wrapper').show();
		});
		
		$('#update-price').on('click',function() {
			const UM = self.userModel;
			const id = UM.id;
			const authToken = UM.token;
			
			const newfloat = hundreds*100 + tens*10 + ones + tenths/10 + hundredths/100;
			console.log(['newfloat=',newfloat]);
			
			const data = [{propName:'price_energy_'+type, value:newfloat}];
			UM.updateEnergyPrices(id, data, authToken, type);
		});
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			
			const localized_string_title = LM['translation'][sel]['USER_PROPS_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_PROPS_DESCRIPTION'];
			
			const localized_string_energy_prices_title = LM['translation'][sel]['USER_ENERGY_PRICES_TITLE'];
			const localized_string_energy_prices_description = LM['translation'][sel]['USER_ENERGY_PRICES_DESCRIPTION'];
			const localized_string_energy_prices_monthly = LM['translation'][sel]['USER_ENERGY_PRICES_MONTHLY'];
			const localized_string_energy_prices_energy = LM['translation'][sel]['USER_ENERGY_PRICES_ENERGY'];
			const localized_string_energy_prices_transfer = LM['translation'][sel]['USER_ENERGY_PRICES_TRANSFER'];
			const localized_string_energy_prices_monthly_unit = LM['translation'][sel]['USER_ENERGY_PRICES_MONTHLY_UNIT'];
			const localized_string_energy_prices_energy_unit = LM['translation'][sel]['USER_ENERGY_PRICES_ENERGY_UNIT'];
			const localized_string_energy_prices_transfer_unit = LM['translation'][sel]['USER_ENERGY_PRICES_TRANSFER_UNIT'];
			
			const localized_string_change_password_btn_txt = LM['translation'][sel]['USER_PROPS_CHANGE_PASSWORD_BTN_TXT'];
			
			let buttons_html = '';
			if (this.userModel.is_superuser) {
				buttons_html = 
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<p>Admin can view and edit RegCodes, view Users and associated ReadKeys.</p>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<button class="btn waves-effect waves-light" id="readkeys">ReadKeys</button>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<button class="btn waves-effect waves-light" id="regcodes">RegCodes</button>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<button class="btn waves-effect waves-light" id="users">Users</button>'+
						'</div>'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>';
			} else {
				buttons_html = 
					'<div class="row">'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>';
			}
			// Ones, Tens, Hundreds
			// Tenths, Hundredths
			// Perusmaksu €/kk
			// Energiamaksu snt/kWh
			// Siirtomaksu snt/kWh
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h4>'+localized_string_title+'</h4>'+
						'<p><img src="./svg/user.svg" height="80"/></p>'+
						'<p>'+localized_string_description+'</p>'+
					'</div>'+
				'</div>'+
				
				
				'<div class="row"><div class="col s12 center" style="border:1px solid #ccc;padding:16px;">'+
				
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h5>'+localized_string_energy_prices_title+'</h5>'+
						'<p>'+localized_string_energy_prices_description+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center" id="energy-monthly-price-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="energy-monthly-price-edit">'+
							localized_string_energy_prices_monthly +
							'<span id="energy-monthly-price-value"></span>,'+
							'<span id="energy-monthly-price-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> '+localized_string_energy_prices_monthly_unit+'</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="energy-monthly-price-edit-placeholder">'+
						'</div>'+
					'</div>'+
					
					'<div class="col s12 center" id="energy-basic-price-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="energy-basic-price-edit">'+
							localized_string_energy_prices_energy +
							'<span id="energy-basic-price-value"></span>,'+
							'<span id="energy-basic-price-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> '+localized_string_energy_prices_energy_unit+'</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="energy-basic-price-edit-placeholder">'+
						'</div>'+
					'</div>'+
					
					'<div class="col s12 center" id="energy-transfer-price-wrapper">'+
						'<div class="col s12 center">'+
							'<p class="edit-item-field">'+
							'<a href="javascript:void(0);" id="energy-transfer-price-edit">'+
							localized_string_energy_prices_transfer +
							'<span id="energy-transfer-price-value"></span>,'+
							'<span id="energy-transfer-price-fractions-value"></span>'+
							'<span class="edit-item-field-postfix"> '+localized_string_energy_prices_transfer_unit+'</span></a></p>'+
						'</div>'+
						'<div class="col s12 center" id="energy-transfer-price-edit-placeholder">'+
						'</div>'+
					'</div>'+
				'</div>'+
				
				'</div></div>'+
				
				'<div class="row"><div class="col s12 center" style="border:1px solid #ccc;padding:16px;">'+
				'<div class="row">'+
					'<div class="col s12 center" id="change-password-wrapper">'+
						'<div class="col s12 center">'+
							'<p><a href="javascript:void(0);" id="changepsw">'+localized_string_change_password_btn_txt+'</a></p>'+
						'</div>'+
					'</div>'+
				'</div>' +
				'</div></div>'+
				
				buttons_html +
				
				'<div class="row">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			// Fill the price-object with values from UserModel.
			this.fillPriceFromUM();
			
			// Fill UI elements with correct values.
			$('#energy-monthly-price-value').empty().append(this.price.monthly.toString());
			$('#energy-basic-price-value').empty().append(this.price.energy.toString());
			$('#energy-transfer-price-value').empty().append(this.price.transfer.toString());
			
			if (this.price.monthly_frac < 10) {
				$('#energy-monthly-price-fractions-value').empty().append('0'+this.price.monthly_frac.toString());
			} else {
				$('#energy-monthly-price-fractions-value').empty().append(this.price.monthly_frac.toString());
			}
			if (this.price.energy_frac < 10) {
				$('#energy-basic-price-fractions-value').empty().append('0'+this.price.energy_frac.toString());
			} else {
				$('#energy-basic-price-fractions-value').empty().append(this.price.energy_frac.toString());
			}
			if (this.price.transfer_frac < 10) {
				$('#energy-transfer-price-fractions-value').empty().append('0'+this.price.transfer_frac.toString());
			} else {
				$('#energy-transfer-price-fractions-value').empty().append(this.price.transfer_frac.toString());
			}
			
			$('#energy-monthly-price-edit').on('click',function() {
				$('#energy-basic-price-wrapper').hide();
				$('#energy-transfer-price-wrapper').hide();
				$('#change-password-wrapper').hide();
				self.showEdit('monthly');
			});
			
			$('#energy-basic-price-edit').on('click',function() {
				$('#energy-monthly-price-wrapper').hide();
				$('#energy-transfer-price-wrapper').hide();
				$('#change-password-wrapper').hide();
				self.showEdit('basic');
			});
			
			$('#energy-transfer-price-edit').on('click',function() {
				$('#energy-monthly-price-wrapper').hide();
				$('#energy-basic-price-wrapper').hide();
				$('#change-password-wrapper').hide();
				self.showEdit('transfer');
			});
			
			// Three input fields:
			//   - Monthly fee:    NN,NN € / kk
			//   - Energy price    snt/kWh?   NN,NN
			//   - Transfer price  snt/kWh?   05,34 snt/kWh
			
			if (this.userModel.is_superuser) {
				$('#regcodes').on('click',function() {
					self.models['MenuModel'].setSelected('REGCODES');
				});
				$('#users').on('click',function() {
					self.models['MenuModel'].setSelected('USERS');
				});
				$('#readkeys').on('click',function() {
					self.models['MenuModel'].setSelected('READKEYS');
				});
			}
			
			$('#changepsw').on('click',function() {
				self.models['MenuModel'].setSelected('userchangepsw');
			});
			
			$('#back').on('click',function() {
				self.models['MenuModel'].setSelected('userpage');
			});
			
			this.handleErrorMessages(this.FELID);
			this.rendered = true;
			
		} else {
			console.log('UserPropsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}