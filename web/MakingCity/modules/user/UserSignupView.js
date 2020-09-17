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
export default class UserSignupView extends UserView {
	
	constructor(controller) {
		super(controller);
	}
	
	// TESTING!
	randomString(length, chars) {
		let result = '';
		for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
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
						$("#signup-submit").prop("disabled", false);
						$("#cancel").prop("disabled", false);
					}, 1000);
					
				} else {
					// Show the reason for failure (message).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$(html).appendTo('#signup-failed');
					$("#signup-submit").prop("disabled", false);
					$("#cancel").prop("disabled", false);
				}
			}
		}
	}
	
	render() {
		var self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_cancel = LM['translation'][sel]['DA_CANCEL'];
		
		const localized_string_signup_title = LM['translation'][sel]['USER_SIGNUP_TITLE'];
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_user_password = LM['translation'][sel]['USER_PASSWORD'];
		const localized_string_signup_button_text = LM['translation'][sel]['USER_SIGNUP_BTN_TXT'];
		
		const html = 
			/*'<nav>'+
				'<div class="nav-wrapper">'+
					'<a href="javascript:void(0);" class="brand-logo"><img src="./img/logo2.png" height="64"/></a>'+
				'</div>'+
			'</nav>'+
			*/
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
					
					'<div class="col s12 center" id="signup-failed"></div>'+
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
			$('#signup-failed').empty();
			$('#signup-success').empty();
		});
		
		$('#signup-password').on('keyup', function(){
			$('#signup-failed').empty();
			$('#signup-success').empty();
		});
		
		$('#signup-password').keypress(function(event){
			if (event.keyCode == 13) {
				$('#signup-submit').focus().click();
			}
		});
		
		$("#cancel").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#signup-submit").on('click', function() {
			
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
				$('#signup-failed').empty();
				const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
				$(html).appendTo('#signup-failed');
				
			} else {
				
				$('#signup-failed').empty();
				$('#signup-success').empty();
				
				var data = {
					email: _email,
					password: _password
				};
				// disable both buttons
				$("#cancel").prop("disabled", true);
				$("#signup-submit").prop("disabled", true);
				self.models['UserModel'].signup(data);
			}
		});
		// TESTING:
		//const rString = this.randomString(6, '23456789abcdefghijkmnpqrstuvwxyz');
		//console.log(rString);
	}
}
