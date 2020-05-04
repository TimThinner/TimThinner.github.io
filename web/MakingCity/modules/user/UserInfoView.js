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
		BACK-button AND LOGOUT-button
*/
export default class UserInfoView extends UserView {
	
	constructor(controller) {
		super(controller);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model === 'UserModel' && options.method === 'logout') {
				// User is now logged out
				// This notification is already handled in MasterController, 
				// so there is really no need to do anything here!
				//$("#logout-submit").prop("disabled", false);
			}
		}
	}
	
	render() {
		var self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_info_title = LM['translation'][sel]['USER_INFO'];//'User Info';
		const localized_string_logout_button_text = LM['translation'][sel]['USER_LOGOUT']; //'LOGOUT';
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_description = LM['translation'][sel]['USER_DESCRIPTION'];
		const localized_string_bullet_1 = LM['translation'][sel]['USER_BULLET_1'];
		const localized_string_bullet_2 = LM['translation'][sel]['USER_BULLET_2'];
		const localized_string_bullet_3 = LM['translation'][sel]['USER_BULLET_3'];
		const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_info_title+'</h4>'+
					'<p style="text-align:center;">'+localized_string_user_email+': '+this.controller.models['UserModel'].email+'</p>'+
					'<p class="coming-soon">'+localized_string_coming_soon+'</p>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'<p style="text-align:center;">'+localized_string_bullet_1+'</p>'+
					'<p style="text-align:center;">'+localized_string_bullet_2+'</p>'+
					'<p style="text-align:center;">'+localized_string_bullet_3+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="back">'+localized_string_da_back+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" type="submit" id="logout-submit">'+localized_string_logout_button_text+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#back").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#logout-submit").on('click', function() {
			//$("#logout-submit").prop("disabled", true);
			self.models['UserModel'].logout();
		});
	}
}
