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
		this.FELID = 'action-response';
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
			if (options.model==='ConfigModel' && options.method==='updateConfig') {
				if (options.status === 200) {
					const html = '<div class="success-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					const signup_value = this.models['ConfigModel'].configs[0].signup;
					$("#signup").empty().append('signup: '+signup_value);
					
					const show_fetching_info_value = this.models['ConfigModel'].configs[0].show_fetching_info;
					$("#show-fetching-info").empty().append('show fetching info: '+show_fetching_info_value);
					setTimeout(() => {
						this.models['MenuModel'].setSelected('USERPROPS');
					}, 1000);
					
				} else {
					// Something went wrong
					if (options.status === 401) {
						// This status code must be caught and wired to forceLogout() action.
						this.forceLogout(this.FELID);
					} else {
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$('#'+this.FELID).empty().append(html);
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
			if (CONFIG_MODEL && typeof CONFIG_MODEL.configs !== 'undefined' && Array.isArray(CONFIG_MODEL.configs) && CONFIG_MODEL.configs.length > 0) {
				// CONFIG_MODEL.configs is an array where first element contains different configuration parameters:
				// { "_id" : ObjectId("618298bcc577f5f73eaaa0d1"), "signup" : true, "version" : "21.11.03" }
				/*
				const props = [];
				Object.keys(CONFIG_MODEL.configs[0]).forEach(key => {
					const p = key+': '+CONFIG_MODEL.configs[0][key];
					props.push(p);
				};
				config_html = '<div class="col s12"><p>';
				config_html += props.join('<br/>');
				config_html += '</p></div>';*/
				config_html = '<div class="col s6 center"><p id="signup">signup: '+CONFIG_MODEL.configs[0].signup+'</p></div>';
				config_html += '<div class="col s6 center"><p><button class="btn waves-effect waves-light" id="toggle-signup">TOGGLE</button></p></div>';
				config_html = '<div class="col s6 center"><p id="show-fetching-info">show fetching info: '+CONFIG_MODEL.configs[0].show_fetching_info+'</p></div>';
				config_html += '<div class="col s6 center"><p><button class="btn waves-effect waves-light" id="toggle-show-fetching-info">TOGGLE</button></p></div>';
			}
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_back = LM['translation'][sel]['BACK'];
			const localized_string_title = 'Configurations';//LM['translation'][sel]['USER_PROPS_ADMIN_USERS'];
			const html =
				'<div class="row">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'</div>'+ 
					config_html +
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
			
			if (CONFIG_MODEL && typeof CONFIG_MODEL.configs !== 'undefined' && Array.isArray(CONFIG_MODEL.configs) && CONFIG_MODEL.configs.length > 0) {
				
				$('#toggle-signup').on('click',function() {
					const UM = self.controller.master.modelRepo.get('UserModel')
					
					const id = CONFIG_MODEL.configs[0]._id;
					let signup = CONFIG_MODEL.configs[0].signup;
					
					signup = !signup; // Toggle
					
					const authToken = UM.token;
					const data = [
						{propName:'signup', value:signup}
					];
					CONFIG_MODEL.updateConfig(id, data, authToken);
				});
				
				$('#toggle-show-fetching-info').on('click',function() {
					const UM = self.controller.master.modelRepo.get('UserModel')
					
					const id = CONFIG_MODEL.configs[0]._id;
					let show_fetching_info = CONFIG_MODEL.configs[0].show_fetching_info;
					
					show_fetching_info = !show_fetching_info; // Toggle
					
					const authToken = UM.token;
					const data = [
						{propName:'show_fetching_info', value:show_fetching_info}
					];
					CONFIG_MODEL.updateConfig(id, data, authToken);
				});
				
			}
			
			$('#back').on('click',function() {
				self.models['MenuModel'].setSelected('USERPROPS');
			});
			
			this.handleErrorMessages(this.FELID);
			this.rendered = true;
			
		} else {
			this.showSpinner(this.el);
		}
	}
}