/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserPageModel') {
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
	
	
	updateLatestValues() {
		
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserPageModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserPageView => UserPageModel fetched!');
					if (this.rendered) {
						$('#user-page-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#user-page-view-failure').empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							const html = '<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>';
							$(html).appendTo('#user-page-view-failure');
							setTimeout(() => {
								this.controller.forceLogout();
							}, 3000);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#user-page-view-failure');
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("UserPageView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
		}
	}
	
	
	/*
	NOTE: transform is defined within style-attribute, NOT as SVG property!
	*/
	setHoverEffect(event, scale) {
		/*if (scale === 'scale(1.0)') {
			
			event.target.style.strokeWidth = 1;
			event.target.style.fillOpacity = 0.05;
		} else {
			
			event.target.style.strokeWidth = 3;
			event.target.style.fillOpacity = 0.5;
		}*/
		const oldtra = event.target.style.transform;
		//const oldtra = event.target.getAttributeNS(null,'transform');
		//console.log(['oldtra=',oldtra]);
		
		
		const index = oldtra.indexOf("scale"); // transform="translate(500,670) scale(1.1)" />
		const newtra = oldtra.slice(0, index) + scale;
		
		event.target.style.transform = newtra;
		//event.target.setAttributeNS(null,'transform',newtra);
	}
	
	addSVGEventHandlers() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const logOut = svgObject.getElementById('logout');
			logOut.addEventListener("click", function(){
				
				const UM = self.controller.master.modelRepo.get('UserModel');
				if (UM) {
					UM.logout();
				}
				//if (options.model === 'UserModel' && options.method === 'logout') {
				// User is now logged out
				// This notification is already handled in MasterController, 
				// so there is really no need to do anything here!
			}, false);
			
			const back = svgObject.getElementById('back');
			back.addEventListener("click", function(){
				
				self.menuModel.setSelected('menu');
				
			}, false);
			
			const UB = svgObject.getElementById('user-button');
			if (UB) {
				UB.addEventListener("click", function(){
					
					self.menuModel.setSelected('USERPROPS');
					
				}, false);
				UB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				UB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
			
			const EB = svgObject.getElementById('electricity-button');
			if (EB) {
				EB.addEventListener("click", function(){
					
					self.menuModel.setSelected('USERELECTRICITY');
					
				}, false);
				EB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				EB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
			
			const HB = svgObject.getElementById('heating-button');
			if (HB) {
				HB.addEventListener("click", function(){
					
					self.menuModel.setSelected('USERHEATING');
					
				}, false);
				HB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				HB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
			
			const WB = svgObject.getElementById('water-button');
			if (WB) {
				WB.addEventListener("click", function(){
					
					self.menuModel.setSelected('USERWATER');
					
				}, false);
				WB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				WB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
			
			const HCT = svgObject.getElementById('TheHomeColorTest');
			if (HCT) {
				HCT.addEventListener("click", function(){
					
					
					// Original circle is green (#0a0) and stroke-width 5px => 
					if (UB && EB && HB && WB) {
						//console.log(['HB.style.stroke=',HB.style.stroke]);
						if (UB.style.stroke === 'rgb(0, 170, 0)') {
							UB.style.stroke = '#f00';
							UB.style.strokeWidth = '10';
							EB.style.stroke = '#f00';
							EB.style.strokeWidth = '10';
							HB.style.stroke = '#f00';
							HB.style.strokeWidth = '10';
							WB.style.stroke = '#f00';
							WB.style.strokeWidth = '10';
							self.fillSVGTextElement(svgObject, 'color-test-text', 'Thank you!');
						} else {
							UB.style.stroke = '#0a0';
							UB.style.strokeWidth = '5';
							EB.style.stroke = '#0a0';
							EB.style.strokeWidth = '5';
							HB.style.stroke = '#0a0';
							HB.style.strokeWidth = '5';
							WB.style.stroke = '#0a0';
							WB.style.strokeWidth = '5';
							self.fillSVGTextElement(svgObject, 'color-test-text', 'Click the house!');
						}
					}
				}, false);
			}
			
		} else {
			console.log("svgObject is NOT ready!");
		}
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			//const LM = this.controller.master.modelRepo.get('LanguageModel');
			//const sel = LM.selected;
			const UM = this.controller.master.modelRepo.get('UserModel');
			if (UM) {
				const index = UM.email.indexOf('@');
				const email = UM.email.slice(0,index);
				this.fillSVGTextElement(svgObject, 'user-email', email);
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
			/*
			const localized_string_title = LM['translation'][sel]['USER_PAGE_TITLE'];
			const localized_string_electricity = LM['translation'][sel]['USER_PAGE_ELECTRICITY'];
			const localized_string_heating = LM['translation'][sel]['USER_PAGE_HEATING'];
			const localized_string_water = LM['translation'][sel]['USER_PAGE_WATER'];
			const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
			const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
			*/
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="user-page-view-failure">'+
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
				
				$('#back').on('click',function() {
					self.menuModel.setSelected('menu');
				});
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					$('<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>').appendTo('#user-page-view-failure');
					setTimeout(() => {
						this.controller.forceLogout();
					}, 3000);
				}
				
			} else {
				const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
				let svgFile, svgClass;
				if (mode === 'LANDSCAPE') {
					console.log('LANDSCAPE');
					svgFile = './svg/userpage/UserPageLandscape.svg';
					svgClass = 'svg-landscape-container';
				} else if (mode === 'PORTRAIT') {
					console.log('PORTRAIT');
					svgFile = './svg/userpage/UserPagePortrait.svg';
					svgClass = 'svg-portrait-container';
				} else {
					console.log('SQUARE');
					svgFile = './svg/userpage/UserPageSquare.svg';
					svgClass = 'svg-square-container';
				}
				const html =
					'<div class="row">'+
						'<div class="col s12" style="padding-left:0;padding-right:0;">'+
							'<div class="'+svgClass+'">'+
								'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="user-page-view-failure"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					
					self.addSVGEventHandlers();
					self.localizeSVGTexts();
					self.updateLatestValues();
				});
			}
			this.rendered = true;
		} else {
			console.log('UserPageView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}
