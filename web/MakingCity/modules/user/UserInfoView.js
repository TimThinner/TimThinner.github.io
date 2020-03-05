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
		const localized_string_da_cancel = LM['translation'][sel]['DA_CANCEL'];
		
		const localized_string_info_title = 'User Info';
		const localized_string_logout_button_text = 'LOGOUT';
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_info_title+'</h4>'+
					'<p style="text-align:center;">Email: '+this.controller.models['UserModel'].email+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+localized_string_da_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" type="submit" id="logout-submit">'+localized_string_logout_button_text+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#cancel").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		$("#logout-submit").on('click', function() {
			//$("#logout-submit").prop("disabled", true);
			self.models['UserModel'].logout();
		});
	}
}
