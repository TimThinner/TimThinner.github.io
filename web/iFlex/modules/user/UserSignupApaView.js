import UserView from './UserView.js';
import Validator from '../common/Validator.js';
/*
	If not logged in:
		email + password input fields
		CANCEL-button AND LOGIN-button
		
		Signup link => signup page...
			email + password input fields
			CANCEL-button AND SIGNUP-button
		
		
	If logged in => Account info + logout
		Account INFO
		CANCEL-button AND LOGOUT-button
		
*/
export default class UserSignupApaView extends UserView {
	
	constructor(controller) {
		super(controller);
		this.FELID = 'signup-response';
		
		this.emaile = '';
		this.passworde = '';
		this.request_for_sensors = false;
		this.apa_letter = 'A';
		this.apa_tens = 0;
		this.apa_ones = 0;
		this.apartment = 'A0';
	}
	
	hide() {
		super.hide();
	}
	
	// Generate a "random" Registration code (this is the same method as in RegCodeCreateView.js).
	randomString(length, chars) {
		let result = '';
		for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}
	
	signupWithRegcode(opt) {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_user_password = LM['translation'][sel]['USER_PASSWORD'];
		const localized_string_user_regcode = LM['translation'][sel]['USER_REGCODE'];
		
		const _email = $('#signup-email').val();
		const _password = $('#signup-password').val();
		const _request_for_sensors = $('#request-for-sensors').is(':checked');
		// NOTE: If REGCODE is copy-pasted from somewhere, it might contain extra spaces... 
		// MUST remove them just in case!
		// The trim() method removes whitespace from both ends of a string. 
		// Whitespace in this context is all the whitespace characters (space, tab, no-break space, etc.) 
		// and all the line terminator characters (LF, CR, etc.).
		let _regcode = undefined;
		
		if (typeof opt !== 'undefined') {
			
			console.log(['opt=',opt]);
			_regcode = opt.code;
			
		} else {
			_regcode = $('#signup-regcode').val().trim();
		}
		
		const validateArray = [
			{test:"email",name:localized_string_user_email,value:_email},
			{test:"pass",name:localized_string_user_password,value:_password},
			{test:"exist",name:localized_string_user_regcode,value:_regcode}
		];
		const v = new Validator({languagemodel:LM});
		const errors = v.validate(validateArray);
		if (errors.length > 0) {
			
			const localized_message = errors.join(' ');
			const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
			$('#'+this.FELID).empty().append(html);
			
			// enable both buttons
			$("#signup-submit").prop("disabled", false);
			$("#cancel").prop("disabled", false);
			
		} else {
			
			$('#'+this.FELID).empty();
			var data = {
				email: _email,
				password: _password,
				regcode: _regcode,
				request_for_sensors: _request_for_sensors,
				consent_a: true,
				consent_b: true
			};
			// disable both buttons
			$("#cancel").prop("disabled", true);
			$("#signup-submit").prop("disabled", true);
			this.models['UserModel'].signup(data);
		}
	}
	
	signupWithApartment() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_user_password = LM['translation'][sel]['USER_PASSWORD'];
		
		const _email = $('#signup-email').val();
		const _password = $('#signup-password').val();
		
		const validateArray = [
			{test:"email",name:localized_string_user_email,value:_email},
			{test:"pass",name:localized_string_user_password,value:_password}
		];
		const v = new Validator({languagemodel:LM});
		const errors = v.validate(validateArray);
		if (errors.length > 0) {
			
			const localized_message = errors.join(' ');
			
			const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
			$('#'+this.FELID).empty().append(html);
			
			// enable both buttons
			$("#signup-submit").prop("disabled", false);
			$("#cancel").prop("disabled", false);
			
		} else {
			
			$('#'+this.FELID).empty();
			
			const startDate = moment().toDate();
			const endDate = moment().add(12, 'months').toDate();
			const code = this.randomString(6, '23456789abcdefghijkmnprstuvwxyz');
			
			var data = {
				email: _email,
				code: code,
				apartmentId: this.apartment,
				startdate: startDate,
				enddate: endDate
			};
			// disable both buttons
			$("#cancel").prop("disabled", true);
			$("#signup-submit").prop("disabled", true);
			
			this.models['UserModel'].signupApa(data);
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model === 'UserModel' && options.method === 'signup') {
				// RESPONSE (OK: 201, error: 500)
				if (options.status === 201) {
					// User is now signed as a new user.
					const html = '<div class="success-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					// Here we shoud empty the filled properties:
					this.emaile = '';
					this.passworde = '';
					this.request_for_sensors = false;
					this.apa_letter = 'A';
					this.apa_tens = 0;
					this.apa_ones = 0;
					this.apartment = 'A0';
					// We set HelpModel to know we are calling it froom successful signup process!
					const HM = this.controller.master.modelRepo.get('HelpModel');
					HM.caller = 'signup';
					setTimeout(() => {
						this.controller.models['MenuModel'].setSelected('HELP');
						//$("#signup-submit").prop("disabled", false);
						//$("#cancel").prop("disabled", false);
					}, 1000);
					
				} else {
					// Show the reason for failure (message).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					$("#signup-submit").prop("disabled", false);
					$("#cancel").prop("disabled", false);
				}
			} else if (options.model === 'UserModel' && options.method === 'signupApa') {
				// RESPONSE (OK: 201, error: 500)
				if (options.status === 201) {
					// Registration code is now created => Use it to make rest of the signup.
					
					this.signupWithRegcode(options.data);
					
				} else {
					// Show the reason for failure (message).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					$("#signup-submit").prop("disabled", false);
					$("#cancel").prop("disabled", false);
				}
			}
			
		}
	}
	
	/*
		type = letter or number
	*/
	
	/*
	showApaEdit(type) {
		const self = this;
		
		
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
	
	*/
	updateApaInfo() {
		
		$('#'+this.FELID).empty();
		
		$('#letters').empty().append(this.apa_letter);
		
		if (this.apa_tens > 0) {
			$('#tens').empty().append(this.apa_tens);
		} else {
			$('#tens').empty();
		}
		$('#ones').empty().append(this.apa_ones);
		
		this.apartment = this.apa_letter;
		if (this.apa_tens > 0) {
			this.apartment += this.apa_tens;
		}
		this.apartment += this.apa_ones;
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_cancel = LM['translation'][sel]['CANCEL'];
		const localized_string_signup_title = LM['translation'][sel]['USER_SIGNUP_TITLE'];
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_user_password = LM['translation'][sel]['USER_PASSWORD'];
		const localized_string_signup_button_text = LM['translation'][sel]['USER_SIGNUP_BTN_TXT'];
		const localized_string_signup_sensors_text = LM['translation'][sel]['USER_SIGNUP_SENSORS_TXT'];
		const localized_string_signup_sensors_cb_label = LM['translation'][sel]['USER_SIGNUP_SENSORS_CHECKBOX_LABEL'];
		
		const consent_ok_1 = LM['translation'][sel]['USER_SIGNUP_CONSENT_OK_1'];
		const consent_ok_2 = LM['translation'][sel]['USER_SIGNUP_CONSENT_OK_2'];
		const consent_link_text = LM['translation'][sel]['USER_SIGNUP_CONSENT_LINK_TXT'];
		const gdpr_link_text = LM['translation'][sel]['USER_SIGNUP_GDPR_LINK_TXT'];
		
		
		const localized_string_signup_apartment_number = LM['translation'][sel]['USER_SIGNUP_APARTMENT_NUMBER'];
		//const localized_string_signup_apartment_not_selected = LM['translation'][sel]['USER_SIGNUP_APARTMENT_NOT_SELECTED'];
		const localized_string_signup_apartment_must_input = LM['translation'][sel]['USER_SIGNUP_APARTMENT_MUST_INPUT'];
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_signup_title+'</h4>'+
					'</div>'+
					'<div class="input-field col s12 m6">'+
						'<input id="signup-email" type="email" class="validate" required="" aria-required="true" />'+
						'<label for="signup-email">'+localized_string_user_email+'</label>'+
					'</div>'+
					'<div class="input-field col s12 m6">'+
						'<input id="signup-password" type="password" class="validate" required="" aria-required="true" />'+
						'<label for="signup-password">'+localized_string_user_password+'</label>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					//'<div class="col s12 center">'+
						'<p style="color:#aaa;">'+localized_string_signup_apartment_number+'</p>'+
					//'</div>'+
				'</div>'+
				//'<div class="col s12">'+
				//	'<div class="col s2 m1 offset-m3"></div>'+
				//	'<div class="col s4 m2">PORRAS:</div>'+
				//	'<div class="col s4 m2">NUMERO:</div>'+
				//	'<div class="col s2 m1"></div>'+
				//'</div>'+
			'</div>'+
			'<div class="row" style="margin-top:0;margin-bottom:0;">'+
				'<div class="col s2 m1 offset-m3">&nbsp;</div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="letters-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1">&nbsp;</div>'+
				//'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="hundreds-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="tens-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="ones-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1"></div>'+
			'</div>'+
			'<div class="row" style="margin-top:0;margin-bottom:0;">'+
				'<div class="col s2 m1 offset-m3">&nbsp;</div>'+
				'<div class="col s2 m1 edit-item-change-number" id="letters"></div>'+
				'<div class="col s2 m1 edit-item-change-number">&nbsp;</div>'+
				//'<div class="col s2 m1 edit-item-change-number" id="hundreds"></div>'+
				'<div class="col s2 m1 edit-item-change-number" id="tens"></div>'+
				'<div class="col s2 m1 edit-item-change-number" id="ones"></div>'+
				'<div class="col s2 m1"></div>'+
			'</div>'+
			'<div class="row" style="margin-top:0;margin-bottom:0;">'+
				'<div class="col s2 m1 offset-m3">&nbsp;</div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="letters-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1">&nbsp;</div>'+
				//'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="hundreds-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="tens-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="ones-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1"></div>'+
			'</div>'+
					/*
					'<div class="input-field col s6">'+
						'<select id="select-apartment">'+
							'<option value="NONE" selected>'+localized_string_signup_apartment_not_selected+'</option>'+ // Choose your apartment
							'<option value="A">A</option>'+
							'<option value="B">B</option>'+
							'<option value="C">C</option>'+
						'</select>'+
						'<label>'+localized_string_signup_apartment_number+'</label>'+
					'</div>'+
					*/
					/*
					'<div class="input-field col s6">'+
						'<select id="select-apartment">'+
							'<option value="NONE" selected>'+localized_string_signup_apartment_not_selected+'</option>'+ // Choose your apartment
							'<option value="1">1</option>'+
							'<option value="2">2</option>'+
							'<option value="3">3</option>'+
							'<option value="4">4</option>'+
							'<option value="5">5</option>'+
							'<option value="6">6</option>'+
							'<option value="7">7</option>'+
							'<option value="8">8</option>'+
							'<option value="9">9</option>'+
							'<option value="10">10</option>'+
						'</select>'+
						'<label>'+localized_string_signup_apartment_number+'</label>'+
					'</div>'+
					*/
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="input-field col s12">'+
						// checked="checked"
						'<p class="note">'+localized_string_signup_sensors_text+'</p>'+
						'<p><label><input type="checkbox" class="filled-in" id="request-for-sensors" /><span>'+localized_string_signup_sensors_cb_label+'</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<p><label><input type="checkbox" class="filled-in" id="consent" />'+
						'<span>'+consent_ok_1+
							'<a href="javascript:void(0);" id="gdpr-text">'+gdpr_link_text+'</a>'+consent_ok_2+
							'<a href="javascript:void(0);" id="consent-text">'+consent_link_text+'</a>'+
						'</span></label></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+localized_string_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" type="submit" id="signup-submit">'+localized_string_signup_button_text+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		const UCM = this.controller.master.modelRepo.get('UserConsentModel');
		const UGDPRM = this.controller.master.modelRepo.get('UserGDPRModel');
		
		if (UCM.consent_one === true && UCM.consent_two === true) {
			$("#consent").prop("disabled", false);
		} else {
			$("#consent").prop("disabled", true);
		}
		
		$("#consent").change(function() {
			 if (this.checked) {
				$("#signup-submit").prop("disabled", false);
			} else {
				$("#signup-submit").prop("disabled", true);
			}
		});
		if ($('#consent').is(':checked')) {
			$("#signup-submit").prop("disabled", false);
		} else {
			$("#signup-submit").prop("disabled", true);
		}
		
		$("#gdpr-text").on('click', function() {
			UGDPRM.caller = 'usersignup';
			self.controller.models['MenuModel'].setSelected('userGDPR');
		});
		
		$("#consent-text").on('click', function() {
			UCM.caller = 'usersignup';
			self.controller.models['MenuModel'].setSelected('userConsent');
		});
		
		// Attach all event-handlers:
		$('#signup-email').on('keyup', function(){
			$('#'+self.FELID).empty();
			self.emaile = $('#signup-email').val();
		});
		if (this.emaile.length > 0) {
			$('#signup-email').val(this.emaile);
			$('label[for="signup-email"]').addClass('active');
		}
		
		$('#signup-password').on('keyup', function(){
			$('#'+self.FELID).empty();
			self.passworde = $('#signup-password').val();
		});
		if (this.passworde.length > 0) {
			$('#signup-password').val(this.passworde);
			$('label[for="signup-password"]').addClass('active');
		}
		
		this.updateApaInfo();
		
		// All digits can be set to values from 0 to 9.
		$('#tens-up').on('click',function() {
			if (self.apa_tens < 9) {
				self.apa_tens++;
				self.updateApaInfo();
			}
		});
		$('#tens-down').on('click',function() {
			if (self.apa_tens > 0) {
				self.apa_tens--;
				self.updateApaInfo();
			}
		});
		$('#ones-up').on('click',function() {
			if (self.apa_ones < 9) {
				self.apa_ones++;
				self.updateApaInfo();
			}
		});
		$('#ones-down').on('click',function() {
			if (self.apa_ones > 0) {
				self.apa_ones--;
				self.updateApaInfo();
			}
		});
		
		
		$('#letters-up').on('click',function() {
			if (self.apa_letter === 'A') {
				self.apa_letter = 'B';
			} else if (self.apa_letter === 'B') {
				self.apa_letter = 'C';
			} else if (self.apa_letter === 'C') {
				self.apa_letter = 'D';
			}
			self.updateApaInfo();
		});
		$('#letters-down').on('click',function() {
			if (self.apa_letter === 'D') {
				self.apa_letter = 'C';
			} else if (self.apa_letter === 'C') {
				self.apa_letter = 'B';
			} else if (self.apa_letter === 'B') {
				self.apa_letter = 'A';
			}
			self.updateApaInfo();
		});
		
		
		/*
		$("#select-apartment").change(function() {
			$('#'+self.FELID).empty();
			const selected = $(this).find(":selected").val();
			self.apartment = selected;
			console.log(['Selected apartment = ',self.apartment]);
		});
		
		$('#select-apartment > option[value='+self.apartment+']').prop('selected', true);
		
		*/
		$("#request-for-sensors").change(function() {
			 if (this.checked) {
				self.request_for_sensors = true;
			} else {
				self.request_for_sensors = false;
			}
		});
		if (this.request_for_sensors === true) {
			$('#request-for-sensors').attr('checked','checked');
		}
		
		// This must be called AFTER all select options are filled in and default selection done.
		//$('select').formSelect();
		
		$("#cancel").on('click', function() {
			// Here we shoud empty the filled properties:
			self.emaile = '';
			self.passworde = '';
			self.request_for_sensors = false;
			UCM.consent_one = false;
			UCM.consent_two = false;
			self.apa_letter = 'A';
			self.apa_tens = 0;
			self.apa_ones = 0;
			self.apartment = 'A0';
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#signup-submit").on('click', function() {
			
			// If there is no REGCODE => 1st phase creates a REGCODE and second phase does the rest of the sign-up.
			if (self.apartment === 'A0' || self.apartment === 'B0' || self.apartment === 'C0' || self.apartment === 'D0') {
				// Show the reason for failure (message).
				const html = '<div class="error-message"><p>'+localized_string_signup_apartment_must_input+'</p></div>';
				$('#'+self.FELID).empty().append(html);
			} else {
				// Good to go for the Apartment Registration PHASE.
				// Here we create a REGCODE WITHOUT authentication => a new backend endpoint is needed!
				self.signupWithApartment();
			}
		});
	}
}
