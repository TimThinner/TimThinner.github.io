/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserElectricityChartsView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserElectricityModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		// Start listening notify -messages from ResizeEventObserver:
		//this.controller.master.modelRepo.get('ResizeEventObserver').subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
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
		console.log('UPDATE UserElectricityCharts !!!!!!!');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserElectricityModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserElectricityChartsView => UserElectricityModel fetched!');
					if (this.rendered) {
						$('#user-electricity-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#user-electricity-view-failure').empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							const html = '<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>';
							$(html).appendTo('#user-electricity-view-failure');
							setTimeout(() => {
								this.controller.forceLogout();
							}, 3000);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#user-electricity-view-failure');
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
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="user-electricity-view-failure">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					$('<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>').appendTo('#user-electricity-view-failure');
					setTimeout(() => {
						this.controller.forceLogout();
					}, 3000);
				}
				
			} else {
				const html =
					'<div class="row">'+
						'<div class="col s12">'+
							'<h4 style="text-align:center;">Electricity Charts</h4>'+
							'<p class="coming-soon">'+localized_string_coming_soon+'</p>'+
						'</div>'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<p>&nbsp;</p>'+
							'<p>&nbsp;</p>'+
							'<p>&nbsp;</p>'+
						'</div>'+
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="user-electricity-view-failure"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				this.startSwipeEventListeners(
					()=>{this.menuModel.setSelected('USERELECTRICITY');},
					()=>{this.menuModel.setSelected('USERELECTRICITYTARGETS');}
				);
			}
			$('#back').on('click',function() {
				
				self.menuModel.setSelected('USERELECTRICITY');
				
			});
			this.rendered = true;
		} else {
			console.log('UserElectricityChartsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}