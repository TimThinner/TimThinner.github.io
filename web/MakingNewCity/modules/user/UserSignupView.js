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
		this.FELID = 'signup-message';
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model === 'UserModel' && options.method === 'signup') {
				// RESPONSE (OK: 201, error: 500)
				if (options.status === 201) {
					// User is now signed as a new user.
					const html = '<div class="success-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					// We set HelpModel to know we are calling it froom successful signup process!
					const HM = this.controller.master.modelRepo.get('HelpModel');
					HM.caller = 'signup';
					setTimeout(() => {
						this.controller.models['MenuModel'].setSelected('HELP');
					}, 1000);
					/*
					setTimeout(() => {
						this.controller.models['MenuModel'].setSelected('menu');
						$("#signup-submit").prop("disabled", false);
						$("#cancel").prop("disabled", false);
					}, 1000);
					*/
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
		var self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_cancel = LM['translation'][sel]['DA_CANCEL'];
		
		const localized_string_signup_title = LM['translation'][sel]['USER_SIGNUP_TITLE'];
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_user_password = LM['translation'][sel]['USER_PASSWORD'];
		const localized_string_user_regcode = LM['translation'][sel]['USER_REGCODE'];
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
			'<div class="row">'+
				'<div class="input-field col s12">'+
					'<input id="signup-regcode" type="text" class="validate" required="" aria-required="true" />'+
					'<label for="signup-regcode">'+localized_string_user_regcode+'</label>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
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
		});
		
		$('#signup-password').on('keyup', function(){
			$('#'+self.FELID).empty();
		});
		/*
		$('#signup-password').keypress(function(event){
			if (event.keyCode == 13) {
				$('#signup-submit').focus().click();
			}
		});*/
		$('#signup-regcode').keypress(function(event){
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
			// NOTE: If REGCODE is copy-pasted from somewhere, it might contain extra spaces... 
			// MUST remove them just in case!
			// The trim() method removes whitespace from both ends of a string. 
			// Whitespace in this context is all the whitespace characters (space, tab, no-break space, etc.) 
			// and all the line terminator characters (LF, CR, etc.).
			const _regcode = $('#signup-regcode').val().trim();
			
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
				$('#'+self.FELID).empty().append(html);
				
			} else {
				$('#'+self.FELID).empty();
				var data = {
					email: _email,
					password: _password,
					regcode: _regcode
				};
				// disable both buttons
				$("#cancel").prop("disabled", true);
				$("#signup-submit").prop("disabled", true);
				self.models['UserModel'].signup(data);
			}
		});
	}
}
