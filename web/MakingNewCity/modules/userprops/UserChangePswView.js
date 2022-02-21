import View from '../common/View.js';
import Validator from '../common/Validator.js';

export default class UserChangePswView extends View {
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.userModel = this.controller.master.modelRepo.get('UserModel');
		this.userModel.subscribe(this);
		this.FELID = 'form-message';
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
	
	notify(options) {
		if (options.model === 'UserModel' && options.method === 'changePassword') {
			// Check the status (OK: 200, Auth Failed: 401, error: 500)
			if (options.status === 200) {
				var html = '<div class="success-message"><p>'+options.message+'</p></div>';
				$('#'+this.FELID).empty().append(html);
				setTimeout(() => {
					
					this.models['MenuModel'].setSelected('userprops');
					
				}, 500);
				
			} else {
				var html = '<div class="error-message"><p>'+options.message+'</p></div>';
				$('#'+this.FELID).empty().append(html);
				// Force LOGOUT if Auth failed!
				/*if (options.status === 401) {
					setTimeout(() => {
						this.controller.forceLogout();
					}, 1000);
				}*/
			}
			$("#password-submit").prop("disabled", false);
		}
	}
	
	render() {
		var self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const localized_string_change_password_title = LM['translation'][sel]['USER_CHANGE_PASSWORD_TITLE'];
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_old_password = LM['translation'][sel]['USER_OLD_PASSWORD'];
		const localized_string_new_password = LM['translation'][sel]['USER_NEW_PASSWORD'];
		const localized_string_cancel = LM['translation'][sel]['DA_CANCEL'];
		const localized_string_save = LM['translation'][sel]['DA_SAVE'];
		
		let html_email_field = '';
		if (this.userModel.is_superuser===true) {
			html_email_field =
				'<div class="input-field col s12">'+
					'<input id="super-email" type="email" class="validate" required="" aria-required="true" />'+
					'<label for="super-email" class="active">'+localized_string_user_email+'</label>'+
				'</div>';
		}
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_change_password_title+'</h4>'+
					'</div>'+ html_email_field +
					'<div class="input-field col s12 m6">'+
						'<input id="old-password" type="password" class="validate" required="" aria-required="true" />'+
						'<label for="old-password">'+localized_string_old_password+'</label>'+
					'</div>'+
					'<div class="input-field col s12 m6">'+
						'<input id="new-password" type="password" class="validate" required="" aria-required="true" />'+
						'<label for="new-password">'+localized_string_new_password+'</label>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:16px;">'+
						'<button class="btn grey lighten-2" style="color:#000" id="password-cancel">'+localized_string_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="password-submit">'+localized_string_save+
							'<i class="material-icons right">send</i>'+
						'</button>'+
					'</div>'+
					'<div class="col s12 center" id="'+this.FELID+'" style="margin-top:16px;">'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		
		if (this.userModel.is_superuser===true) {
			$("#super-email").val(this.userModel.email);
		}
		
		// Attach all event-handlers:
		$("#password-cancel").on('click', function() {
			self.models['MenuModel'].setSelected('userprops');
		});
		/*
		$('#new-password').keypress(function(event){
			if (event.keyCode == 13) {
				$('#password-submit').focus().click();
			}
		});*/
		
		//$("#password-submit").on('click', function() {
		$("#password-submit").click(function (event) {
			//stop submit the form, we will post it manually.
			event.preventDefault();
			
			$('#'+self.FELID).empty();
			
			const old_password = $("#old-password").val();
			const new_password = $("#new-password").val();
			let super_email = self.userModel.email;
			
			const validateArray = [];
			
			if (self.userModel.is_superuser===true) {
				super_email = $("#super-email").val();
				// Test ONLY that new password exist!
				validateArray.push({test:"pass",name:localized_string_new_password,value:new_password});
			} else {
				// BOTH passwords MUST exist!
				validateArray.push({test:"pass",name:localized_string_old_password,value:old_password});
				validateArray.push({test:"pass",name:localized_string_new_password,value:new_password});
			}
			
			const v = new Validator({languagemodel:LM});
			const errors = v.validate(validateArray);
			if (errors.length > 0) {
				const localized_message = errors.join(' ');
				
				const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
				$('#'+self.FELID).empty().append(html);
				
			} else {
				$("#password-submit").prop("disabled", true);
				var data = {
					email: super_email,
					oldpassword: old_password,
					newpassword: new_password
				};
				self.userModel.changePassword(data);
			}
		});
	}
}
