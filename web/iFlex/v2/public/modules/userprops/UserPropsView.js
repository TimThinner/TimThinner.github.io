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
			
			//console.log(['UM=',UM]);
			let consent_A_state = '<p style="color:#4a4">Suostumus <b>tutkimukseen osallistumiseen</b> on voimassa.</p>';
			if (UM.consent_a === false) {
				consent_A_state = '<p style="color:#a44">Suostumus <b>tutkimukseen osallistumiseen</b> on peruttu.</p>';
			}
			let consent_B_state = '<p style="color:#4a4">Suostumus <b>henkilötietojen käsittelyyn tutkimuksessa</b> on voimassa.</p>';
			if (UM.consent_b === false) {
				consent_B_state = '<p style="color:#a44">Suostumus <b>henkilötietojen käsittelyyn tutkimuksessa</b> on peruttu.</p>';
			}
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_back = LM['translation'][sel]['BACK'];
			
			const localized_string_title = LM['translation'][sel]['USER_PROPS_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_PROPS_DESCRIPTION'];
			const localized_string_change_password_btn_txt = LM['translation'][sel]['USER_PROPS_CHANGE_PASSWORD_BTN_TXT'];
			const localized_string_admin_description = LM['translation'][sel]['USER_PROPS_ADMIN_DESCRIPTION'];
			
			const localized_string_admin_regcodes = LM['translation'][sel]['USER_PROPS_ADMIN_REGCODES'];
			const localized_string_admin_users = LM['translation'][sel]['USER_PROPS_ADMIN_USERS'];
			const localized_string_admin_configs = LM['translation'][sel]['USER_PROPS_ADMIN_CONFIGS'];
			const localized_string_admin_feedbacks = LM['translation'][sel]['USER_PROPS_ADMIN_FEEDBACKS'];
			
			//const consent_text = LM['translation'][sel]['USER_PROPS_CONSENT'];
			//const consent_link_text = LM['translation'][sel]['USER_SIGNUP_CONSENT_LINK_TXT'];
			const consent_text = LM['translation'][sel]['USER_CONSENT_TXT'];
			const consent_link_text = LM['translation'][sel]['USER_CONSENT_LINK_TXT'];
			const gdpr_text = LM['translation'][sel]['USER_GDPR_TXT'];
			const gdpr_link_text = LM['translation'][sel]['USER_GDPR_LINK_TXT'];
			
			let admin_buttons_html = '';
			if (UM.is_superuser) {
				admin_buttons_html = 
					'<div class="row">'+
						'<div class="col s12" style="margin-top:32px;">'+
							'<div class="col s12" style="padding:16px 0 32px 0; border:1px solid #ccc; background-color:#fff">'+
								'<div class="col s12 center">'+
									'<p>'+localized_string_admin_description+'</p>'+
								'</div>'+
								'<div class="col s12 m6 l3 center">'+
									'<button class="btn waves-effect waves-light iflex-button" id="regcodes">'+localized_string_admin_regcodes+'</button>'+
								'</div>'+
								'<div class="col s12 m6 l3 center">'+
									'<button class="btn waves-effect waves-light iflex-button" id="users">'+localized_string_admin_users+'</button>'+
								'</div>'+
								'<div class="col s12 m6 l3 center">'+
									'<button class="btn waves-effect waves-light iflex-button" id="configs">'+localized_string_admin_configs+'</button>'+
								'</div>'+
								'<div class="col s12 m6 l3 center">'+
									'<button class="btn waves-effect waves-light iflex-button" id="feedbacks">'+localized_string_admin_feedbacks+'</button>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';
			}
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h4>'+localized_string_title+'</h4>'+
						'<p><img src="./svg/user.svg" height="80"/></p>'+
						'<p>'+localized_string_description+'</p>'+
						// Show user info here:
						consent_A_state + consent_B_state +
						//'<p>Email: '+UM.email+'</p>'+'<p>ObixCode: '+UM.obix_code+'</p>'+
						'<p>Email: '+UM.email+'</p>'+
						'<p>'+consent_text+'<a href="javascript:void(0);" id="consent-text">'+consent_link_text+'</a></p>'+
						'<p>'+gdpr_text+'<a href="javascript:void(0);" id="gdpr-text">'+gdpr_link_text+'</a></p>'+
						'<p><a href="javascript:void(0);" id="changepsw">'+localized_string_change_password_btn_txt+'</a></p>'+
					'</div>'+
				'</div>'+ 
				'<div class="row">'+
					'<div class="col s12 center" style="margin-top:32px;">'+
						'<button class="btn waves-effect waves-light iflex-button" id="back">'+localized_string_back+
							'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+ admin_buttons_html +
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
				$('#configs').on('click',function() {
					self.models['MenuModel'].setSelected('CONFIGS');
				});
				$('#feedbacks').on('click',function() {
					self.models['MenuModel'].setSelected('FEEDBACKS');
				});
			}
			
			$('#back').on('click',function() {
				self.models['MenuModel'].setSelected('USERPAGE');
			});
			
			$('#changepsw').on('click',function() {
				self.models['MenuModel'].setSelected('USERCHANGEPSW');
			});
			
			$('#consent-text').on('click',function() {
				const UCM = self.controller.master.modelRepo.get('UserConsentModel');
				if (UCM) {
					UCM.caller = 'USERPROPS';
				}
				self.models['MenuModel'].setSelected('userConsent');
			});
			
			$('#gdpr-text').on('click',function() {
				const UGDPRM = self.controller.master.modelRepo.get('UserGDPRModel');
				if (UGDPRM) {
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