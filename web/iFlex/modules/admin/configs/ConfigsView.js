/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../../common/View.js';

export default class ConfigsView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
			
		});
		this.rendered = false;
		this.FELID = 'view-failure';
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
	
	notify(options) {
		if (this.controller.visible) {
			if ((options.model==='ConfigModel' && options.method==='updateConfig') {
				if (options.status === 200) {
					
					
					
					
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
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
			
			let config_html = '';
			
			const CONFIG_MODEL = this.models['ConfigModel']; // Stored at the MongoDB.
			if (CONFIG_MODEL) {
				// CONFIG_MODEL.configs is an array where first element contains different configuration parameters:
				// { "_id" : ObjectId("618298bcc577f5f73eaaa0d1"), "signup" : true, "version" : "21.11.03" }
				if (typeof CONFIG_MODEL.configs !== 'undefined' && 
					Array.isArray(CONFIG_MODEL.configs) && 
					CONFIG_MODEL.configs.length > 0) {
					config_html = '<div class="col s12"><p>SIGNUP: '+CONFIG_MODEL.configs[0].signup+'</p>'+
					'<p>VERSION: '+CONFIG_MODEL.configs[0].version+'</p></div>';
				}
			}
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_back = LM['translation'][sel]['BACK'];
			const localized_string_title = 'Configurations';//LM['translation'][sel]['USER_PROPS_ADMIN_USERS'];
			const html =
				'<div class="row">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'</div>'+ config_html +
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_back+
							'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			$('#back').on('click',function() {
				self.menuModel.setSelected('USERPROPS');
			});
			
			this.handleErrorMessages(this.FELID);
			
			this.rendered = true;
			
		} else {
			this.showSpinner(this.el);
		}
	}
}