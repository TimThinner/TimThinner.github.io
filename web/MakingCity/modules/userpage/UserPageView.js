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
			if (key==='UserWaterModel'||key==='UserHeatingModel'||key==='UserElectricityModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		// Start listening notify -messages from ResizeEventObserver:
		this.controller.master.modelRepo.get('ResizeEventObserver').subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-page-view-failure';
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
			if (options.model==='UserWaterModel'||options.model==='UserHeatingModel'||options.model==='UserElectricityModel') {
				if (options.method==='fetched') {
					if (options.status === 200) {
						console.log(['UserPageView: ',options.model,' fetched!']);
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
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("UserPageView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
		}
	}
	
	
	/*
	NOTE: transform is defined within style-attribute, NOT as SVG property!
	
	Here the event.target.style.transform is something like:
	"translateX(240px) scale(1.1)" or
	"translateY(240px) scale(1)"
	BUT to make method more general lets not assume that scale will be always the last transform function.
	*/
	setHoverEffect(event, scale) {
		/*
		// style="stroke:#0a0;stroke-width:5px;fill:#fff;opacity:0.25;
		// Originally strokeWidth=5 and opacity=0.25
		if (scale === 'scale(1.0)') {
			//event.target.style.stroke = '#0a0';
			event.target.style.strokeWidth = 5;
			//event.target.style.opacity = 0.25;
		} else {
			//event.target.style.stroke = '#1fac78';
			event.target.style.strokeWidth = 7;
			//event.target.style.opacity = 0.5;
		}
		*/
		const oldT = event.target.style.transform;
		//console.log(['oldT=',oldT]);
		// Tokenize it:
		const fs = oldT.split(' ');
		//console.log(['fs=',fs]);
		const newA = [];
		// Just replace the "scale()" function with scale and leave other untouched.
		fs.forEach(f => {
			//console.log(['f=',f]);
			if (f.indexOf("scale")===0) {
				newA.push(scale);
			} else {
				newA.push(f);
			}
		});
		const newT = newA.join(' ');
		//console.log(['newT=',newT]);
		event.target.style.transform = newT;
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
			/*
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
			}*/
			
		} else {
			console.log("svgObject is NOT ready!");
		}
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
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
			
			console.log('UserPageView => render Models ARE READY!');
			
			const UM = this.controller.master.modelRepo.get('UserModel')
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'">'+
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
					this.forceLogout(this.FELID);
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
						'<div class="col s12 center" id="'+this.FELID+'"></div>'+
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
			console.log('UserPageView => render Models ARE NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}
