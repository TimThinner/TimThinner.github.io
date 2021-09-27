/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserPropsView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.userModel = this.controller.master.modelRepo.get('UserModel');
		this.userModel.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'user-props-view-failure';
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
	
	
	updateLatestValues() {
		console.log('UPDATE UserProps  !!!!!!!');
	}
	
	notify(options) {
		
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		//const sel = LM.selected;
		//const localized_string_price_saved_ok = 'Saved OK';//LM['translation'][sel]['USER_ENERGY_PRICE_SAVED_OK'];
		
		if (this.controller.visible) {
			if (options.model==='UserPropsModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserPropsView => UserPropsModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const UM = this.userModel;
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_back = LM['translation'][sel]['BACK'];
			
			const localized_string_title = LM['translation'][sel]['USER_PROPS_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_PROPS_DESCRIPTION'];
			const localized_string_change_password_btn_txt = LM['translation'][sel]['USER_PROPS_CHANGE_PASSWORD_BTN_TXT'];
			const localized_string_admin_description = LM['translation'][sel]['USER_PROPS_ADMIN_DESCRIPTION'];
			
			const localized_string_admin_regcodes = LM['translation'][sel]['USER_PROPS_ADMIN_REGCODES'];
			const localized_string_admin_users = LM['translation'][sel]['USER_PROPS_ADMIN_USERS'];
			
			const gdpr_text = LM['translation'][sel]['USER_PROPS_GDPR'];
			const gdpr_link_text = LM['translation'][sel]['USER_SIGNUP_GDPR_LINK_TXT'];
			
			let buttons_html = '';
			if (UM.is_superuser) {
				buttons_html = 
					'<div class="row">'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12" style="margin-top:16px;">'+
							'<div class="col s12" style="padding:16px 0 16px 0; border:1px solid #ccc; background-color:#fff">'+
								'<div class="col s12 center">'+
									'<p>'+localized_string_admin_description+'</p>'+
								'</div>'+
								'<div class="col s6 center">'+
									'<button class="btn waves-effect waves-light" id="regcodes">'+localized_string_admin_regcodes+'</button>'+
								'</div>'+
								'<div class="col s6 center">'+
									'<button class="btn waves-effect waves-light" id="users">'+localized_string_admin_users+'</button>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';
			} else {
				buttons_html = 
					'<div class="row">'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>';
			}
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h4>'+localized_string_title+'</h4>'+
						'<p><img src="./svg/user.svg" height="80"/></p>'+
						'<p>'+localized_string_description+'</p>'+
						'<p>&nbsp;</p>'+
						'<button class="btn waves-effect waves-light" id="changepsw">'+localized_string_change_password_btn_txt+'</button>'+
						'<p>&nbsp;</p>'+
						
						'<p>'+gdpr_text+'<a href="javascript:void(0);" id="gdpr-text">'+gdpr_link_text+'</a></p>'+
						
					'</div>'+
				'</div>'+ buttons_html +
				'<div class="row">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			if (UM.is_superuser) {
				$('#regcodes').on('click',function() {
					self.models['MenuModel'].setSelected('REGCODES');
				});
				$('#users').on('click',function() {
					self.models['MenuModel'].setSelected('USERS');
				});
			}
			
			$('#back').on('click',function() {
				self.models['MenuModel'].setSelected('USERPAGE');
			});
			
			$('#changepsw').on('click',function() {
				self.models['MenuModel'].setSelected('USERCHANGEPSW');
			});
			
			$('#gdpr-text').on('click',function() {
				const UGDPRM = self.controller.master.modelRepo.get('UserGDPRModel');
				if (UGDPRM) {
					console.log(['SET caller USERPROPS']);
					UGDPRM.caller = 'USERPROPS';
				}
				self.models['MenuModel'].setSelected('userGDPR');
			});
			
			this.handleErrorMessages(this.FELID);
			//this.updateLatestValues();
			
			this.rendered = true;
			
		} else {
			console.log('UserPropsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}