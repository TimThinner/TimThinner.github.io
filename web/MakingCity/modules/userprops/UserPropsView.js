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
			if (key === 'UserPropsModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
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
		this.rendered = false;
		$(this.el).empty();
	}
	
	
	updateLatestValues() {
		console.log('UPDATE UserProps  !!!!!!!');
	}
	
	notify(options) {
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
			
			const UM = this.controller.master.modelRepo.get('UserModel')
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			const localized_string_title = LM['translation'][sel]['USER_PROPS_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_PROPS_DESCRIPTION'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<p>&nbsp;</p>'+
							'<p>&nbsp;</p>'+
							'<p>&nbsp;</p>'+
						'</div>'+
						'<div class="col s12 center">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					this.forceLogout(this.FELID);
				}
				
			} else {
				let buttons_html = '';
				let admin_info = '';
				if (UM.is_superuser) {
					
					admin_info = '<p>Admin can view and edit RegCodes, view Users and associated ReadKeys.</p>';
					buttons_html = 
						'<div class="col s6 center">'+
							'<button class="btn waves-effect waves-light" id="regcodes">RegCodes</button>'+
						'</div>'+
						'<div class="col s6 center">'+
							'<button class="btn waves-effect waves-light" id="users">Users</button>'+
						'</div>'+
						//'<div class="col s4 center">'+
						//	'<button class="btn waves-effect waves-light" id="readkeys">Readkeys</button>'+
						//'</div>'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>';
						
					
				} else {
					buttons_html = 
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>';
				}
				
				const html =
					'<div class="row">'+
						'<div class="col s12">'+
							'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
							'<p style="text-align:center;"><img src="./svg/userpage/user.svg" height="80"/></p>'+
							'<p style="text-align:center;">'+localized_string_description+'</p>'+
						'</div>'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<p>&nbsp;</p>'+admin_info+
							
							'<p>&nbsp;</p>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+buttons_html+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (UM.is_superuser) {
					$('#regcodes').on('click',function() {
						self.menuModel.setSelected('REGCODES');
					});
					$('#users').on('click',function() {
						self.menuModel.setSelected('USERS');
					});
					$('#readkeys').on('click',function() {
						self.menuModel.setSelected('READKEYS');
					});
				}
				
				this.startSwipeEventListeners(
					()=>{this.menuModel.setSelected('USERPAGE');},
					()=>{this.menuModel.setSelected('USERWATER');}
				);
			}
			$('#back').on('click',function() {
				
				self.menuModel.setSelected('USERPAGE');
				
			});
			this.rendered = true;
		} else {
			console.log('UserPropsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}