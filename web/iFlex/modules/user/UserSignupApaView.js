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
		
		// NEW:
		this.letters_allowed = ['A','B','C','D'];
		this.numbers_allowed = {'from':1, 'to':99};
		
		this.apa_tens = 0; // Always available!
		this.apa_ones = 0; // Always available!
		this.apa_letter = this.letters_allowed[0];
		this.apartment = this.apa_letter + '0';
		if (this.numbers_allowed.to > 99) {
			this.apa_hundreds = 0;
		} else 
			this.apa_hundreds = undefined;
		}
	}
	
	hide() {
		super.hide();
	}
	
	resetApartment() {
		this.apa_tens = 0;
		this.apa_ones = 0;
		this.apa_letter = this.letters_allowed[0];
		this.apartment = this.apa_letter + '0';
		if (this.numbers_allowed.to > 99) {
			this.apa_hundreds = 0;
		} else 
			this.apa_hundreds = undefined;
		}
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
					
					// Here we shoud empty (reset) the filled properties:
					this.emaile = '';
					this.passworde = '';
					this.request_for_sensors = false;
					
					this.resetApartment();
					
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
	
	updateApaInfo() {
		
		$('#'+this.FELID).empty();
		
		$('#letters').empty().append(this.apa_letter);
		
		let apa_number_string = '';
		if (typeof this.apa_hundreds !== 'undefined') {
			if (this.apa_hundreds > 0) {
				apa_number_string += this.apa_hundreds.toString();
				apa_number_string += this.apa_tens.toString();
				apa_number_string += this.apa_ones.toString();
			} else {
				if (this.apa_tens > 0) {
					apa_number_string += this.apa_tens.toString();
					apa_number_string += this.apa_ones.toString();
				} else {
					apa_number_string += this.apa_ones.toString();
				}
			}
		} else {
			if (this.apa_tens > 0) {
				apa_number_string += this.apa_tens.toString();
				apa_number_string += this.apa_ones.toString();
			} else {
				apa_number_string += this.apa_ones.toString();
			}
		}
		$('#hundreds').empty();
		$('#tens').empty();
		$('#ones').empty();
		if (apa_number_string.length === 3) {
			$('#hundreds').append(apa_number_string[0]);
			$('#tens').append(apa_number_string[1]);
			$('#ones').append(apa_number_string[2]);
			
		} else if (apa_number_string.length === 2) {
			$('#tens').append(apa_number_string[0]);
			$('#ones').append(apa_number_string[1]);
			
		} else if (apa_number_string.length === 1) {
			$('#ones').append(apa_number_string[0]);
		}
		
		this.apartment = this.apa_letter + apa_number_string;
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
		const localized_string_signup_apartment_must_input = LM['translation'][sel]['USER_SIGNUP_APARTMENT_MUST_INPUT'];
		
		/*
		NOTE:
		We have here implemented apartment selection from range:
			A 1 ... A 99
			B 1 ... B 99
			C 1 ... C 99
			D 1 ... D 99
		What if these ranges need to be extended to include more letters or more numbers?
		*/
		let hundreds_up = '<div class="col s2 m1">&nbsp;</div>';
		let hundreds_ph = '<div class="col s2 m1 edit-item-change-number">&nbsp;</div>';
		let hundreds_do = '<div class="col s2 m1">&nbsp;</div>';
		
		if (typeof this.apa_hundreds !== 'undefined') {
			hundreds_up = '<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="hundreds-up"><i class="small material-icons">arrow_drop_up</i></a></div>';
			hundreds_ph = '<div class="col s2 m1 edit-item-change-number" id="hundreds"></div>';
			hundreds_do = '<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="hundreds-down"><i class="small material-icons">arrow_drop_down</i></a></div>';
		}
		
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
					'<p style="color:#aaa;">'+localized_string_signup_apartment_number+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row" style="margin-top:0;margin-bottom:0;">'+
				'<div class="col s2 m1 offset-m3">&nbsp;</div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="letters-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				hundreds_up+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="tens-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="ones-up"><i class="small material-icons">arrow_drop_up</i></a></div>'+
				'<div class="col s2 m1"></div>'+
			'</div>'+
			'<div class="row" style="margin-top:0;margin-bottom:0;">'+
				'<div class="col s2 m1 offset-m3">&nbsp;</div>'+
				'<div class="col s2 m1 edit-item-change-number" id="letters"></div>'+
				hundreds_ph+
				'<div class="col s2 m1 edit-item-change-number" id="tens"></div>'+
				'<div class="col s2 m1 edit-item-change-number" id="ones"></div>'+
				'<div class="col s2 m1"></div>'+
			'</div>'+
			'<div class="row" style="margin-top:0;margin-bottom:0;">'+
				'<div class="col s2 m1 offset-m3">&nbsp;</div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="letters-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				hundreds_do+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="tens-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1 edit-item-change-button"><a href="javascript:void(0);" id="ones-down"><i class="small material-icons">arrow_drop_down</i></a></div>'+
				'<div class="col s2 m1"></div>'+
			'</div>'+
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
		
		$('#hundreds-up').on('click',function() {
			if (self.apa_hundreds < 9) {
				self.apa_hundreds++;
				self.updateApaInfo();
			}
		});
		$('#hundreds-down').on('click',function() {
			if (self.apa_hundreds > 0) {
				self.apa_hundreds--;
				self.updateApaInfo();
			}
		});
		
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
			// Use the array: this.letters_allowed = ['A','B','C','D'];
			const len = self.letters_allowed.length;
			let sel_index = len;
			self.letters_allowed.forEach((letter,index)=>{
				if (self.apa_letter === letter) {
					sel_index = index+1; // new selected letter is the next one.
				}
			});
			// If we are not already at the LAST LETTER.
			if (sel_index < len) {
				self.apa_letter = self.letters_allowed[sel_index];
			}
			self.updateApaInfo();
		});
		
		$('#letters-down').on('click',function() {
			// Use the array: this.letters_allowed = ['A','B','C','D'];
			let sel_index = -1;
			self.letters_allowed.forEach((letter,index)=>{
				if (self.apa_letter === letter) {
					sel_index = index-1; // new selected letter is the previous one.
				}
			});
			// If we are not already at the FIRST LETTER.
			if (sel_index >= 0) {
				self.apa_letter = self.letters_allowed[sel_index];
			}
			self.updateApaInfo();
		});
		
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
		
		$("#cancel").on('click', function() {
			// Here we shoud empty the filled properties:
			self.emaile = '';
			self.passworde = '';
			self.request_for_sensors = false;
			UCM.consent_one = false;
			UCM.consent_two = false;
			
			self.resetApartment();
			
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#signup-submit").on('click', function() {
			
			// If there is no REGCODE => 1st phase creates a REGCODE and second phase does the rest of the sign-up.
			
			const not_allowed = [];
			//this.letters_allowed = ['A','B','C','D'];
			self.letters_allowed.forEach(letter=>{
				not_allowed.push(letter + '0');
			});
			
			if (not_allowed.includes(self.apartment)) { //self.apartment === 'A0' || self.apartment === 'B0' || self.apartment === 'C0' || self.apartment === 'D0') {
				// Show the reason for failure (message):
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
