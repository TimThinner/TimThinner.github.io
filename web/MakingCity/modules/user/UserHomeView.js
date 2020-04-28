/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserHomeView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserHomeModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		// Start listening notify -messages from ResizeEventObserver:
		this.controller.master.modelRepo.get('ResizeEventObserver').subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
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
	
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserHomeModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserHomeView => UserHomeModel fetched!');
					if (this.rendered) {
						$('#user-home-view-failure').empty();
						//this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#user-home-view-failure').empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							const html = '<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>';
							$(html).appendTo('#user-home-view-failure');
							setTimeout(() => {
								this.controller.forceLogout();
							}, 3000);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#user-home-view-failure');
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("UserHomeView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="user-home-view-failure">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s6 center">'+
							'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					$('<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>').appendTo('#user-home-view-failure');
					setTimeout(() => {
						this.controller.forceLogout();
					}, 3000);
				}
				
			} else {
				const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
				let svgFile, svgClass;
				if (mode === 'LANDSCAPE') {
					console.log('LANDSCAPE');
					//svgFile = './svg/DALandscape.svg';
					//svgClass = 'svg-landscape-container';
				} else if (mode === 'PORTRAIT') {
					console.log('PORTRAIT');
					//svgFile = './svg/DAPortrait.svg';
					//svgClass = 'svg-portrait-container';
				} else {
					console.log('SQUARE');
					//svgFile = './svg/DASquare.svg';
					//svgClass = 'svg-square-container';
				}
				const LM = this.controller.master.modelRepo.get('LanguageModel');
				const sel = LM.selected;
				//const localized_string_da_description = LM['translation'][sel]['DA_DESCRIPTION'];
				//const localized_string_da_toggle = LM['translation'][sel]['DA_TOGGLE_DIRECTION'];
				const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
				const html =
					'<div class="row">'+
						'<div class="col s12" style="padding-left:0;padding-right:0;">'+
							'<h2 style="color:#aaa; text-align:center;">Welcome to Home!</h2>'+
							"<p style='color:#aaa; text-align:center;'>This is the home view. User's personal information will be shown here.</p>"+
						'</div>'+
						'<div class="col s6 center" style="margin-top:14px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="user-home-view-failure"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				/*const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					
					self.addSVGEventHandlers();
					self.addEventHandlers();
					self.localizeSVGTexts();
					self.updateLatestValues();
					
				});
				*/
				
			}
			$('#back').on('click',function() {
				self.menuModel.setSelected('menu');
			});
			this.rendered = true;
		} else {
			console.log('UserHomeView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}