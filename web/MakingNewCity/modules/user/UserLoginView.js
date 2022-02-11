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
					this.controller.models['MenuModel'].setSelected('userpage');
				} else {
					// Show the reason for failure (message).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$(html).appendTo('#login-failed');
				}
				$("#login-submit").prop("disabled", false);
			}
		}
	}
	
	render() {
		var self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_cancel = LM['translation'][sel]['DA_CANCEL'];
		
		const localized_string_login_title = LM['translation'][sel]['USER_LOGIN_TITLE'];
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_user_password = LM['translation'][sel]['USER_PASSWORD'];
		const localized_string_login_button_text = LM['translation'][sel]['USER_LOGIN_BTN_TXT'];
		const localized_string_open_signup_form_link_text = LM['translation'][sel]['USER_OPEN_SIGNUP_FORM'];
		
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
					'<div class="col s12 center" id="login-failed"></div>'+
					'<div class="col s12 center" id="login-success"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+localized_string_da_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" type="submit" id="login-submit">'+localized_string_login_button_text+'</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" style="margin-top:1rem">'+
					'<a href="javascript:void(0);" id="show-signup-form">'+localized_string_open_signup_form_link_text+'</a>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		// Attach all event-handlers:
		$('#login-email').on('keyup', function(){
			$('#login-failed').empty();
			$('#login-success').empty();
		});
		
		$('#login-password').on('keyup', function(){
			$('#login-failed').empty();
			$('#login-success').empty();
		});
		
		$('#login-password').keypress(function(event){
			if (event.keyCode == 13) {
				$('#login-submit').focus().click();
			}
		});
		
		$("#show-signup-form").on('click', function() {
			self.controller.models['MenuModel'].setSelected('usersignup');
		});
		
		$("#cancel").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#login-submit").on('click', function() {
			const _email = $('#login-email').val();
			const _password = $('#login-password').val();
			const validateArray = [
				{test:"email",name:"Email",value:_email},
				{test:"pass",name:"Password",value:_password}
			];
			const v = new Validator();
			const errors = v.validate(validateArray);
			if (errors.length > 0) {
				
				const localized_message = errors.join(' ');
				$('#login-failed').empty();
				const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
				$(html).appendTo('#login-failed');
				
			} else {
				
				$('#login-failed').empty();
				$('#login-success').empty();
				
				var data = {
					email: _email,
					password: _password
				};
				// disable the submit button
				$("#login-submit").prop("disabled", true);
				self.models['UserModel'].login(data);
			}
		});
	}
}
