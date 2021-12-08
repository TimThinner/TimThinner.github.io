import View from '../common/View.js';

export default class UserConsentView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.rendered = false;
		this.FELID = 'consent-response';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	
	// const caller = this.controller.models['UserConsentModel'].caller;
	// if (typeof caller !== 'undefined') {
	// NOTE: if caller = 'USERPROPS' => we disable the checkboxes!
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model === 'UserModel' && options.method === 'updateUserData') {
				if (options.status === 200) {
					// User is now signed as a new user.
					const html = '<div class="success-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					setTimeout(() => {
						const caller = this.controller.models['UserConsentModel'].caller;
						if (typeof caller !== 'undefined') {
							this.controller.models['MenuModel'].setSelected(caller);
						} else {
							this.controller.models['MenuModel'].setSelected('usersignup');
						}
					}, 1000);
					
				} else {
					// Show the reason for failure (message).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_consent_title = LM['translation'][sel]['CONSENT_TITLE'];
		const localized_string_consent_text_a = LM['translation'][sel]['CONSENT_TEXT_A'];
		const localized_string_consent_check_a = LM['translation'][sel]['CONSENT_CHECK_A'];
		const localized_string_consent_check_b = LM['translation'][sel]['CONSENT_CHECK_B'];
		const localized_string_consent_text_b = LM['translation'][sel]['CONSENT_TEXT_B'];
		const localized_string_ok = LM['translation'][sel]['OK'];
		
		let display_only = false;
		
		let consent_one_checkbox = '<p><label><input type="checkbox" class="filled-in" id="consent-one" /><span style="color:#000;">'+
			localized_string_consent_check_a+'</span></label></p>';
		
		let consent_two_checkbox = '<p><label><input type="checkbox" class="filled-in" id="consent-two" /><span style="color:#000;">'+
			localized_string_consent_check_b+'</span></label></p>';
		
		const caller = this.controller.models['UserConsentModel'].caller;
		if (typeof caller !== 'undefined' && caller === 'USERPROPS') {
			// NOTE: if caller = 'USERPROPS' => we disable the checkboxes!
			display_only = true;
			consent_one_checkbox = '<p><label><input type="checkbox" class="filled-in" disabled="disabled" id="consent-one" /><span style="color:#000;">'+
				localized_string_consent_check_a+'</span></label></p>';
			consent_two_checkbox = '<p><label><input type="checkbox" class="filled-in" disabled="disabled" id="consent-two" /><span style="color:#000;">'+
				localized_string_consent_check_b+'</span></label></p>';
		}
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_consent_title+'</h4>'+
						'<p>'+localized_string_consent_text_a+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="input-field col s12">'+
						consent_one_checkbox+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="input-field col s12">'+
						consent_two_checkbox+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<p>'+localized_string_consent_text_b+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_ok+
							//'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		if (!display_only) {
			// If the user has logged in we have to show her/his consent state here.
			// Otherwise we show the state of UserConsentModel (used during signup).
			if (typeof this.models['UserModel'].token !== 'undefined') {
				
				if (this.models['UserModel'].consent_a === true) {
					$('#consent-one').attr('checked','checked');
					this.models['UserConsentModel'].consent_one = true;
				} else {
					this.models['UserConsentModel'].consent_one = false;
				}
				
				if (this.models['UserModel'].consent_b === true) {
					$('#consent-two').attr('checked','checked');
					this.models['UserConsentModel'].consent_two = true;
				} else {
					this.models['UserConsentModel'].consent_two = false;
				}
				
			} else {
				if (this.models['UserConsentModel'].consent_one === true) {
					$('#consent-one').attr('checked','checked');
				}
				if (this.models['UserConsentModel'].consent_two === true) {
					$('#consent-two').attr('checked','checked');
				}
			}
			
			$("#consent-one").change(function() {
				if (this.checked) {
					self.models['UserConsentModel'].consent_one = true;
				} else {
					self.models['UserConsentModel'].consent_one = false;
				}
			});
			
			$("#consent-two").change(function() {
				if (this.checked) {
					self.models['UserConsentModel'].consent_two = true;
				} else {
					self.models['UserConsentModel'].consent_two = false;
				}
			});
		}
		
		// OK Button pressed.
		$("#back").on('click', function() {
			if (display_only) {
				self.controller.models['MenuModel'].setSelected('USERPROPS');
			} else {
				// If User is logged in, UPDATE consent state into database (if consent has changed).
				let update = false;
				
				if (typeof self.models['UserModel'].token !== 'undefined') {
					const ca = self.models['UserConsentModel'].consent_one;
					const cb = self.models['UserConsentModel'].consent_two;
					if (ca !== self.models['UserModel'].consent_a || cb !== self.models['UserModel'].consent_b) {
						/// Update
						const id = self.models['UserModel'].id;
						const token = self.models['UserModel'].token;
						const data = [{propName:'consent_a',value:ca},{propName:'consent_b', value:cb}];
						self.models['UserModel'].updateUserData(id, data, token);
						update = true;
					}
				}
				if (!update) {
					const caller = self.controller.models['UserConsentModel'].caller;
					if (typeof caller !== 'undefined') {
						self.controller.models['MenuModel'].setSelected(caller);
					} else {
						self.controller.models['MenuModel'].setSelected('usersignup');
					}
				}
			}
		});
	}
}
