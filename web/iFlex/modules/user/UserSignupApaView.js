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
		this.FELID = 'signup-failed';
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
			{test:"email",name:"Email",value:_email},
			{test:"pass",name:"Password",value:_password},
			{test:"exist",name:"Regcode",value:_regcode}
		];
		const v = new Validator();
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
			$('#signup-success').empty();
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
		const _email = $('#signup-email').val();
		const _password = $('#signup-password').val();
		
		const validateArray = [
			{test:"email",name:"Email",value:_email},
			{test:"pass",name:"Password",value:_password}
		];
		const v = new Validator();
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
			$('#signup-success').empty();
			
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
					$(html).appendTo('#signup-success');
					setTimeout(() => {
						this.controller.models['MenuModel'].setSelected('menu');
						//$("#signup-submit").prop("disabled", false);
						//$("#cancel").prop("disabled", false);
					}, 1000);
					
				} else {
					// Show the reason for failure (message).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$(html).appendTo('#'+this.FELID);
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
					$(html).appendTo('#'+this.FELID);
					$("#signup-submit").prop("disabled", false);
					$("#cancel").prop("disabled", false);
				}
			}
			
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		
		/*
				'USER_LOGIN_TITLE':'Login',
				'USER_EMAIL':'Email',
				'USER_PASSWORD':'Password',
				'USER_REGCODE':'Registration code',
				'USER_LOGIN_BTN_TXT':'Login',
				'USER_OPEN_SIGNUP_FORM':'Open signup form &raquo;',
				'USER_SIGNUP_TITLE':'Signup',
				'USER_SIGNUP_BTN_TXT':'Signup',
				'COMING_SOON':'COMING SOON!',
		
				'DA_BACK':'BACK',
				'DA_CANCEL':'CANCEL',
				'DA_SAVE':'SAVE',
				'DA_QUICK_LOGIN':'MOCKUP LOGIN',
				'DA_QUICK_LOGIN_MESSAGE':'NOTE: This is a MOCKUP. You can use the login button below to login as "testuser@testdomain.com".',
		*/
		
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		//const sel = LM.selected;
		const localized_string_da_cancel = 'CANCEL'; //LM['translation'][sel]['DA_CANCEL'];
		
		const localized_string_signup_title = 'Signup';//LM['translation'][sel]['USER_SIGNUP_TITLE'];
		const localized_string_user_email = 'Email';//LM['translation'][sel]['USER_EMAIL'];
		const localized_string_user_password = 'Password';//LM['translation'][sel]['USER_PASSWORD'];
		const localized_string_signup_button_text = 'Signup';//LM['translation'][sel]['USER_SIGNUP_BTN_TXT'];
		
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
							'<option value="NONE" selected>Not selected</option>'+ // Choose your apartment
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
						'<label>Apartment number</label>'+
					'</div>'+
					'<div class="input-field col s12">'+
						// checked="checked"
						'<p class="note">You can also have sensors to measure temperature and humidity in your apartment. This data is shown only to you. Due to limited number of sensors in this PILOT, be quick and check the checkbox below.</p>'+
						'<p><label><input type="checkbox" class="filled-in" id="request-for-sensors" /><span>Yes, I want sensors.</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<p><label><input type="checkbox" class="filled-in" id="consent-gdpr" /><span>I have read the <a href="javascript:void(0);" id="gdpr-text">GDPR statement</a> and give my consent.</span></label></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+localized_string_da_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" type="submit" id="signup-submit">'+localized_string_signup_button_text+'</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					'<div class="col s12 center" id="signup-success"></div>'+
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
			$('#signup-success').empty();
		});
		
		$('#signup-password').on('keyup', function(){
			$('#'+self.FELID).empty();
			$('#signup-success').empty();
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
				const html = '<div class="error-message"><p>Must input <b>Apartment number</b></p></div>';
				$('#'+self.FELID).empty().append(html);
			} else {
				// Good to go for the Apartment Registration PHASE.
				// Here we create a REGCODE WITHOUT authentication => a new backend endpoint is needed!
				self.signupWithApartment();
			}
		});
	}
}
