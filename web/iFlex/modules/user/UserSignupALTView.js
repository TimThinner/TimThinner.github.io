import View from '../common/View.js';
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
export default class UserSignupALTView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.rendered = false;
		this.FELID = 'signup-failed';
		this.apartment = 'NONE';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		this.apartment = 'NONE';
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
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
			$('#'+this.FELID).empty();
			const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
			$(html).appendTo('#'+this.FELID);
			// enable both buttons
			$("#signup-submit").prop("disabled", false);
			$("#cancel").prop("disabled", false);
			
		} else {
			
			$('#'+this.FELID).empty();
			$('#signup-success').empty();
			var data = {
				email: _email,
				password: _password,
				regcode: _regcode
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
			$('#'+this.FELID).empty();
			const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
			$(html).appendTo('#'+this.FELID);
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
			
			this.models['UserModel'].signupALT(data);
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
			} else if (options.model === 'UserModel' && options.method === 'signupALT') {
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
		const localized_string_user_regcode = 'Registration code';//LM['translation'][sel]['USER_REGCODE'];
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
					'<div class="col s12 center" id="login-failed"></div>'+
					'<div class="col s12 center" id="login-success"></div>'+
				'<div>'+
			'<div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<p style="padding:16px;border:1px solid #8f8;background-color:#efe;">Please input <b>Registration code</b> OR <b>Apartment number</b></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="input-field col s6">'+
						'<input id="signup-regcode" type="text" class="validate" required="" aria-required="true" />'+
						'<label for="signup-regcode">'+localized_string_user_regcode+'</label>'+
					'</div>'+
					'<div class="input-field col s6">'+
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
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					'<div class="col s12 center" id="signup-success"></div>'+
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
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		// Attach all event-handlers:
		$('#signup-email').on('keyup', function(){
			$('#'+self.FELID).empty();
			$('#signup-success').empty();
		});
		
		$('#signup-password').on('keyup', function(){
			$('#'+self.FELID).empty();
			$('#signup-success').empty();
		});
		/*
		$('#signup-password').keypress(function(event){
			if (event.keyCode == 13) {
				$('#signup-submit').focus().click();
			}
		});*/
		$("#select-apartment").change(function() {
			const selected = $(this).find(":selected").val();
			self.apartment = selected;
			console.log(['Selected apartment = ',self.apartment]);
		});
		
		$('#select-apartment > option[value='+self.apartment+']').prop('selected', true);
		
		// This must be called AFTER all select options are filled in and default selection done.
		$('select').formSelect();
		
		
		/*
		$('#signup-regcode').keypress(function(event){
			//if (event.keyCode == 13) {
				//$('#signup-submit').focus().click();
			//});
			// IF REGCODE is given => disable the APARTMENT-selection input.
			const temp = $('#signup-regcode').val().trim();
			if (temp.length > 0) {
				//<select disabled>
				$("#select-apartment").prop('disabled', true);
			} else {
				// <select>
				$("#select-apartment").prop('disabled', false);
			}
		});*/
		
		
		
		$("#cancel").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#signup-submit").on('click', function() {
			
			// If there is no REGCODE => 1st phase creates a REGCODE and second phase does the rest of the sign-up.
			// If there is REGCODE => do the normal stuff.
			
			// NOTE: If REGCODE is copy-pasted from somewhere, it might contain extra spaces... 
			// MUST remove them just in case!
			// The trim() method removes whitespace from both ends of a string. 
			// Whitespace in this context is all the whitespace characters (space, tab, no-break space, etc.) 
			// and all the line terminator characters (LF, CR, etc.).
			const _regcode = $('#signup-regcode').val().trim();
			if (_regcode.length === 0) {
				if (self.apartment === 'NONE') {
					// Show the reason for failure (message).
					const html = '<div class="error-message"><p>Must input <b>Registration code</b> OR <b>Apartment number</b></p></div>';
					$(html).appendTo('#'+self.FELID);
					
				} else {
					// Good to go for the Apartment Registration PHASE.
					// Here we create a REGCODE WITHOUT authentication => a new backend endpoint is needed!
					self.signupWithApartment();
				}
			} else {
				// TRY TO USE the given REGCODE.
				self.signupWithRegcode();
			}
		});
	}
}
