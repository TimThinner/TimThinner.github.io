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
			if (key==='UserWaterNowModel'||key==='UserHeatingNowModel'||key==='UserElectricityNowModel'||
				key==='UserWaterDayModel'||key==='UserElectricityDayModel'||
				key==='UserAlarmModel') {
				
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
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
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	
	updateAlarmCount() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const m = this.controller.master.modelRepo.get('UserAlarmModel');
			if (m) {
				let ae = 0;
				let aw = 0;
				let ah = 0;
				m.alarms.forEach(a=>{
					if (a.alarmType.indexOf('Heating')===0) {
						ah++;
					} else if (a.alarmType.indexOf('Water')===0) {
						aw++;
					} else {
						ae++;
					}
				});
				this.fillSVGTextElement(svgObject, 'alarm-count', m.alarms.length);
				this.fillSVGTextElement(svgObject, 'alarm-count-heating', ah);
				this.fillSVGTextElement(svgObject, 'alarm-count-water', aw);
				this.fillSVGTextElement(svgObject, 'alarm-count-electricity', ae);
			}
		}
	}
	
	updateLatestValues() {
		/*
		#user-electricity-power
		#user-electricity-energy
		#user-water-cold
		#user-water-hot
		#user-temperature
		#user-humidity
		*/
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const ele_now = this.controller.master.modelRepo.get('UserElectricityNowModel');
			const ele_24h = this.controller.master.modelRepo.get('UserElectricityDayModel');
			
			if (ele_now && ele_24h) {
				const meas_now = ele_now.measurement; // is in normal situation an array.
				const meas_24h = ele_24h.measurement; // is in normal situation an array.
				
				if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_24h) && meas_24h.length > 0) {
					
					// Average power now.
					const power_now = meas_now[0].averagePower;
					if (typeof power_now !== 'undefined') {
						this.fillSVGTextElement(svgObject, 'user-electricity-power', power_now + 'W');
					} else {
						this.fillSVGTextElement(svgObject, 'user-electricity-power', '---');
					}
					
					// Energy total
					const energy_now = meas_now[0].totalEnergy;
					const energy_24h = meas_24h[0].totalEnergy;
					if (typeof energy_now !== 'undefined' && typeof energy_24h !== 'undefined') {
						
						const energy_24hours = energy_now - energy_24h;
						this.fillSVGTextElement(svgObject, 'user-electricity-energy', energy_24hours.toFixed(1) + 'kWh');
					} else {
						this.fillSVGTextElement(svgObject, 'user-electricity-energy', '---');
					}
					
				} else {
					if (typeof meas_now.message !== 'undefined' || typeof meas_24h.message !== 'undefined') {
						// Possible messages: "Readkey Expired", "Readkey not found", some other error...
						const messages = [];
						if (typeof meas_now.message !== 'undefined') {
							messages.push(meas_now.message);
						}
						if (typeof meas_24h.message !== 'undefined') {
							messages.push(meas_24h.message);
						}
						const message = messages.join(' ');
						console.log(['message=',message]);
						this.fillSVGTextElement(svgObject, 'user-message', message);
					}
				}
			}
			
			const heating_now = this.controller.master.modelRepo.get('UserHeatingNowModel');
			if (heating_now) {
				const meas = heating_now.measurement; // is in normal situation an array.
				if (Array.isArray(meas) && meas.length > 0) {
					
					const temp = meas[0].temperature;
					if (typeof temp !== 'undefined') {
						this.fillSVGTextElement(svgObject, 'user-temperature', temp.toFixed(1) + '°C');
					} else {
						this.fillSVGTextElement(svgObject, 'user-temperature', '---');
					}
					
					const humi = meas[0].humidity;
					if (typeof humi !== 'undefined') {
						this.fillSVGTextElement(svgObject, 'user-humidity', humi.toFixed(1) + '%');
					} else {
						this.fillSVGTextElement(svgObject, 'user-humidity', '---');
					}
					
				} else if (typeof meas.message !== 'undefined') {
					// Possible messages: "Readkey Expired", "Readkey not found", some other error...
					console.log(['meas.message=',meas.message]);
					this.fillSVGTextElement(svgObject, 'user-message', meas.message);
				}
			}
			
			const water_now = this.controller.master.modelRepo.get('UserWaterNowModel');
			const water_24h = this.controller.master.modelRepo.get('UserWaterDayModel');
			if (water_now && water_24h) {
				
				const meas_now = water_now.measurement; // is in normal situation an array.
				const meas_24h = water_24h.measurement; // is in normal situation an array.
				
				if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_24h) && meas_24h.length > 0) {
					
					const hot_now = meas_now[0].hotTotal;
					const hot_24h = meas_24h[0].hotTotal;
					if (typeof hot_now !== 'undefined' && typeof hot_24h !== 'undefined') {
						const hot_24hours = hot_now - hot_24h;
						this.fillSVGTextElement(svgObject, 'user-water-hot', hot_24hours.toFixed(0) + 'L');
					} else {
						this.fillSVGTextElement(svgObject, 'user-water-hot', '---');
					}
					
					const cold_now = meas_now[0].coldTotal;
					const cold_24h = meas_24h[0].coldTotal;
					if (typeof cold_now !== 'undefined' && typeof cold_24h !== 'undefined') {
						const cold_24hours = cold_now - cold_24h;
						this.fillSVGTextElement(svgObject, 'user-water-cold', cold_24hours.toFixed(0) + 'L');
					} else {
						this.fillSVGTextElement(svgObject, 'user-water-cold', '---');
					}
					
				} else {
					if (typeof meas_now.message !== 'undefined' || typeof meas_24h.message !== 'undefined') {
						// Possible messages: "Readkey Expired", "Readkey not found", some other error...
						const messages = [];
						if (typeof meas_now.message !== 'undefined') {
							messages.push(meas_now.message);
						}
						if (typeof meas_24h.message !== 'undefined') {
							messages.push(meas_24h.message);
						}
						const message = messages.join(' ');
						console.log(['message=',message]);
						this.fillSVGTextElement(svgObject, 'user-message', message);
					}
				}
			}
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserWaterNowModel'||options.model==='UserHeatingNowModel'||options.model==='UserElectricityNowModel'||options.model==='UserWaterDayModel'||options.model==='UserElectricityDayModel') {
				if (options.method==='fetched') {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
						if (options.status === 200) {
							this.updateLatestValues();
							this.updateAlarmCount();
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				console.log("UserPageView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
				
			} else if (options.model==='UserAlarmModel' && options.method==='addOne') {
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 201) {
						this.updateAlarmCount();
					}
				} else {
					this.render();
				}
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
			
			const HomeButton = svgObject.getElementById('home-button');
			if (HomeButton) {
				HomeButton.addEventListener("click", function(){
					
					self.menuModel.setSelected('USERALARM');
					
				}, false);
				HomeButton.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				HomeButton.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
			
			
			// <image x="-120" y="-120" width="240" height="240" xlink:href="Home.svg" id="home-button" class="active-button" style="transform: translateY(0px) scale(1.0);" />
			
			
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
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		//const sel = LM.selected;
		//const localized_string_subtitle = LM['translation'][sel]['USER_PAGE_SUBTITLE'];
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const UM = this.controller.master.modelRepo.get('UserModel');
			if (UM) {
				const index = UM.email.indexOf('@');
				const email = UM.email.slice(0,index);
				this.fillSVGTextElement(svgObject, 'user-email', email);
			}
			//this.fillSVGTextElement(svgObject, 'user-page-subtitle', localized_string_subtitle);
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			console.log('UserPageView => render Models ARE READY!');
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			
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
				self.updateAlarmCount();
			});
			
			this.handleErrorMessages(this.FELID);
			
			this.rendered = true;
			
		} else {
			console.log('UserPageView => render Models ARE NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}
