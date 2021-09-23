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
		this.apartment = 'NONE';
	}
	
	hide() {
		super.hide();
		this.apartment = 'NONE';
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
				request_for_sensors: _request_for_sensors
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
					
					setTimeout(() => {
						this.controller.models['MenuModel'].setSelected('menu');
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
		
		const gdpr_ok_1 = LM['translation'][sel]['USER_SIGNUP_GDPR_OK_1'];
		const gdpr_ok_2 = LM['translation'][sel]['USER_SIGNUP_GDPR_OK_2'];
		const gdpr_link_text = LM['translation'][sel]['USER_SIGNUP_GDPR_LINK_TXT'];
		
		const localized_string_signup_apartment_number = LM['translation'][sel]['USER_SIGNUP_APARTMENT_NUMBER'];
		const localized_string_signup_apartment_not_selected = LM['translation'][sel]['USER_SIGNUP_APARTMENT_NOT_SELECTED'];
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
					'<div class="input-field col s12">'+
						'<select id="select-apartment">'+
							'<option value="NONE" selected>'+localized_string_signup_apartment_not_selected+'</option>'+ // Choose your apartment
							'<option value="A1">A1</option>'+
							'<option value="A2">A2</option>'+
							'<option value="A3">A3</option>'+
							'<option value="A4">A4</option>'+
							'<option value="A5">A5</option>'+
							'<option value="A6">A6</option>'+
							'<option value="A7">A7</option>'+
							'<option value="A8">A8</option>'+
							'<option value="A9">A9</option>'+
						'</select>'+
						'<label>'+localized_string_signup_apartment_number+'</label>'+
					'</div>'+
					'<div class="input-field col s12">'+
						// checked="checked"
						'<p class="note">'+localized_string_signup_sensors_text+'</p>'+
						'<p><label><input type="checkbox" class="filled-in" id="request-for-sensors" /><span>'+localized_string_signup_sensors_cb_label+'</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<p><label><input type="checkbox" class="filled-in" id="consent-gdpr" /><span>'+gdpr_ok_1+'<a href="javascript:void(0);" id="gdpr-text">'+gdpr_link_text+'</a>'+gdpr_ok_2+'</span></label></p>'+
					'</div>'+
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
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#consent-gdpr").change(function() {
			 if (this.checked) {
				$("#signup-submit").prop("disabled", false);
			} else {
				$("#signup-submit").prop("disabled", true);
			}
		});
		if ($('#consent-gdpr').is(':checked')) {
			$("#signup-submit").prop("disabled", false);
		} else {
			$("#signup-submit").prop("disabled", true);
		}
		$("#gdpr-text").on('click', function() {
			self.controller.models['MenuModel'].setSelected('userGDPR');
		});
		
		// Attach all event-handlers:
		$('#signup-email').on('keyup', function(){
			$('#'+self.FELID).empty();
		});
		
		$('#signup-password').on('keyup', function(){
			$('#'+self.FELID).empty();
		});
		$("#select-apartment").change(function() {
			$('#'+self.FELID).empty();
			const selected = $(this).find(":selected").val();
			self.apartment = selected;
			console.log(['Selected apartment = ',self.apartment]);
		});
		
		$('#select-apartment > option[value='+self.apartment+']').prop('selected', true);
		
		// This must be called AFTER all select options are filled in and default selection done.
		$('select').formSelect();
		
		$("#cancel").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#signup-submit").on('click', function() {
			
			// If there is no REGCODE => 1st phase creates a REGCODE and second phase does the rest of the sign-up.
			if (self.apartment === 'NONE') {
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
