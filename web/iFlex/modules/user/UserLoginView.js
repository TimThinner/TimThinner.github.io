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
export default class UserLoginView extends UserView {
	
	constructor(controller) {
		super(controller);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model === 'UserModel' && options.method === 'login') {
				// RESPONSE (OK: 200, error: 500)
				if (options.status === 200) {
					// User is now logged in
					this.controller.models['MenuModel'].setSelected('USERPAGE');
				} else {
					// Show the reason for failure (message).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$(html).appendTo('#login-response');
				}
				$("#login-submit").prop("disabled", false);
			}
		}
	}
	
	render() {
		var self = this;
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
				
				'BACK':'BACK',
				'CANCEL':'CANCEL',
				'SAVE':'SAVE',
		*/
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const localized_string_login_title = LM['translation'][sel]['USER_LOGIN_TITLE'];
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_user_password = LM['translation'][sel]['USER_PASSWORD'];
		const localized_string_login_button_text = LM['translation'][sel]['USER_LOGIN_BTN_TXT'];
		const localized_string_open_signup_form_link_text = LM['translation'][sel]['USER_OPEN_SIGNUP_FORM'];
		const localized_string_signup_coming_soon = LM['translation'][sel]['USER_SIGNUP_COMING_SOON'];
		
		const localized_string_cancel = LM['translation'][sel]['CANCEL'];
		const localized_quick_login = LM['translation'][sel]['QUICK_LOGIN'];
		const localized_quick_login_message = LM['translation'][sel]['QUICK_LOGIN_MESSAGE'];
		
		let signup_enabled = false;
		const USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		const CONFIG_MODEL = this.controller.master.modelRepo.get('ConfigModel'); // Stored at the MongoDB.
		if (CONFIG_MODEL) {
			// CONFIG_MODEL.configs is an array where first element contains different configuration parameters:
			// { "_id" : ObjectId("618298bcc577f5f73eaaa0d1"), "signup" : true, "version" : "21.11.03" }
			if (typeof CONFIG_MODEL.configs !== 'undefined' && Array.isArray(CONFIG_MODEL.configs)) {
				signup_enabled = CONFIG_MODEL.configs[0].signup;
			}
		}
		
		let signup_link_markup = '<div class="row">'+
				'<div class="col s12 center" style="margin-top:1rem">'+
					'<p>'+localized_string_signup_coming_soon+
					'<br/><a href="javascript:void(0);" class="disabled" id="show-signup-form">'+localized_string_open_signup_form_link_text+'</a></p>'+
				'</div>'+
			'</div>';
		if (signup_enabled) {
			signup_link_markup = '<div class="row">'+
				'<div class="col s12 center" style="margin-top:1rem">'+
					'<a href="javascript:void(0);" id="show-signup-form">'+localized_string_open_signup_form_link_text+'</a>'+
				'</div>'+
			'</div>';
		}

		/*
		let mockup_button_markup = '';
		if (USER_MODEL.MOCKUP===true) {
			mockup_button_markup = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<p class="success-message" style="padding:10px;">'+localized_quick_login_message+'</p>'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="quick-login">'+localized_quick_login+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		}
		*/
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_login_title+'</h4>'+
					'</div>'+
					
					'<div class="input-field col s12 m6">'+
						'<input id="login-email" type="email" class="validate" required="" aria-required="true" />'+
						'<label for="login-email">'+localized_string_user_email+'</label>'+
					'</div>'+
					'<div class="input-field col s12 m6">'+
						'<input id="login-password" type="password" class="validate" required="" aria-required="true" />'+
						'<label for="login-password">'+localized_string_user_password+'</label>'+
					'</div>'+
					'<div class="col s12 center" id="login-response"></div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+localized_string_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" type="submit" id="login-submit">'+localized_string_login_button_text+'</button>'+
					'</div>'+
				'</div>'+
			'</div>' + signup_link_markup;
			/*
			'<div class="row">'+
				'<div class="col s12 center" style="margin-top:1rem">'+
					'<a href="javascript:void(0);" id="show-signup-form">'+localized_string_open_signup_form_link_text+'</a>'+
				'</div>'+
			'</div>'+mockup_button_markup;
			*/
			
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		// Attach all event-handlers:
		$('#login-email').on('keyup', function(){
			$('#login-response').empty();
		});
		
		$('#login-password').on('keyup', function(){
			$('#login-response').empty();
		});
		
		$('#login-password').keypress(function(event){
			if (event.keyCode == 13) {
				$('#login-submit').focus().click();
			}
		});
		
		// Handle link click message ONLY if SIGNUP is enabled.
		if (signup_enabled) {
			$("#show-signup-form").on('click', function() {
				self.controller.models['MenuModel'].setSelected('usersignup');
			});
		}
		
		$("#cancel").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#login-submit").on('click', function() {
			
			const _email = $('#login-email').val();
			const _password = $('#login-password').val();
			
			const validateArray = [
				{test:"email",name:localized_string_user_email,value:_email},
				{test:"pass",name:localized_string_user_password,value:_password}
			];
			const v = new Validator({languagemodel:LM});
			const errors = v.validate(validateArray);
			
			if (errors.length > 0) {
				
				const localized_message = errors.join(' ');
				$('#login-response').empty();
				const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
				$(html).appendTo('#login-response');
				
			} else {
				
				$('#login-response').empty();
				
				var data = {
					email: _email,
					password: _password
				};
				// disable the submit button
				$("#login-submit").prop("disabled", true);
				self.models['UserModel'].login(data);
			}
		});
		/*
		if (USER_MODEL.MOCKUP===true) {
			$("#quick-login").on('click', function() {
				const _email = 'testuser@testdomain.com';
				const _password = 'anything123';
				var data = {
					email: _email,
					password: _password
				};
				// disable the submit button
				$("#login-submit").prop("disabled", true);
				self.models['UserModel'].login(data);
			});
		}*/
	}
}
