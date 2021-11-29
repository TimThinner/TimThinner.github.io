/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
export default class DistrictEView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			/*if (key === 'StatusModel'||key==='StatusJetitek983Model'||key==='StatusJetitek1012Model') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}*/
		});
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'district-e-view-failure';
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
	
	/*
	PIPE NAMES:
	"main-pipe"
	"sub-pipe-1"
	"apartment-pipe"
	"other-pipe"
	"heating-devices-pipe"
	"hot-water-pipe"
	"dh-input-pipe"
	"cool-pipe"
	
	Animate element:
		<animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
	when measured value is greater than zero (flowing) we use from="40" to="0".
	We can freeze the animation by setting from="40" to="40".
	*/
	
	flowCheck(svgObject, val, pipeName) {
		if (val === 0) {
			// If Energy Consumption equals zero => FREEZE the animation!
			const pipeElement = svgObject.getElementById(pipeName);
			//pipeElement.style.stroke='#ff0';
			if (pipeElement.firstElementChild) {
				// from = "40" set also to = "40", this freezes the "flow".
				pipeElement.firstElementChild.setAttributeNS(null, 'to', '40');
			}
		} else {
			// Normal flow, red stroke and from 40 to 0.
			const pipeElement = svgObject.getElementById(pipeName);
			//pipeElement.style.stroke='#f00';
			if (pipeElement.firstElementChild) {
				pipeElement.firstElementChild.setAttributeNS(null, 'to', '0');
			}
		}
	}
	
	updateOne(svgObject, svgId, val) {
		const textElement = svgObject.getElementById(svgId);
		while (textElement.firstChild) {
			textElement.removeChild(textElement.firstChild);
		}
		textElement.appendChild(document.createTextNode(val.toFixed(1) + " kW"));
	}
	
	/*
	id="grid-power"
	id="apartments-power"
	id="sauna-etc-power"
	id="heating-power"
	id="heating-devices-power"
	id="hot-water-power"
	id="dh-hot-power"
	id="dh-cool-power"
	*/
	
	updateLatestValues() {
		
		let grid_power = 0;
		let apartments_power = 0;
		let sauna_etc_power = 0;
		let heating_power = 0;
		let heating_devices_power = 0;
		let hot_water_power = 0;
		let dh_hot_power = 0;
		let dh_cool_power = 0;
		
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			/*this.models['StatusModel'].values.forEach(item => {
				if (item.avPower) {
					if (item.meterId === 116) {
						solar_power = item.avPower;
					} else if (item.meterId === 114) {
						total_power = item.avPower;
					} else if (item.meterId === 115) {
						geothermal_power = item.avPower;
					} else if (item.meterId === 112) {
						cooler_equipment_power = item.avPower;
					} else if (item.meterId === 113) {
						cooler_machines_power = item.avPower;
					} else if (item.meterId === 102 || item.meterId === 103 || item.meterId === 104 || item.meterId === 110) {
						lights_power += item.avPower;
					} else if (item.meterId === 106 || item.meterId === 107 || item.meterId === 108) {
						kitchen_power += item.avPower;
					} else if (item.meterId === 101 || item.meterId === 105) {
						hpac_power += item.avPower;
					} else if (item.meterId === 109 || item.meterId === 111) {
						other_power += item.avPower;
					} else if (item.meterId === 117) {
						heating_devices_power = item.avPower;
					}
				}
			});*/
			this.updateOne(svgObject, 'grid-power', grid_power);
			this.updateOne(svgObject, 'apartments-power', apartments_power);
			this.updateOne(svgObject, 'sauna-etc-power', sauna_etc_power);
			this.updateOne(svgObject, 'heating-power', heating_power);
			this.updateOne(svgObject, 'heating-devices-power', heating_devices_power);
			this.updateOne(svgObject, 'hot-water-power', hot_water_power);
			this.updateOne(svgObject, 'dh-hot-power', dh_hot_power);
			this.updateOne(svgObject, 'dh-cool-power', dh_cool_power);
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			
			
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				//console.log("DistrictEView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
			
			/*
			if (options.model==='StatusModel' && options.method==='fetched') {
				if (options.status === 200) {
					//console.log('DistrictAView => StatusModel fetched!');
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
			} else if ((options.model==='StatusJetitek983Model'||options.model==='StatusJetitek1012Model') && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestJetitekValue(options.model);
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
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("DistrictAView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
			*/
		}
	}
	
	/*
	NOTE: transform is defined as SVG property!
	*/
	setHoverEffect(event, scale){
		if (scale === 'scale(1.0)') {
			event.target.style.strokeWidth = 1;
			event.target.style.fillOpacity = 0.05;
		} else {
			event.target.style.strokeWidth = 3;
			event.target.style.fillOpacity = 0.5;
		}
		const oldT = event.target.getAttributeNS(null,'transform');
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
		event.target.setAttributeNS(null,'transform',newT);
	}
	
	addSVGEventHandlers() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			
			const back = svgObject.getElementById('back');
			back.addEventListener("click", function(){
				
				self.menuModel.setSelected('D');
				
			}, false);
			
			
			const targetA = svgObject.getElementById('target-e-a');
			targetA.addEventListener("click", function(){
				
				console.log('Target E A clicked!');
				//self.menuModel.setSelected('DBA');
				
			}, false);
			targetA.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetA.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetD = svgObject.getElementById('target-e-d');
			targetD.addEventListener("click", function(){
				
				console.log('Target E D clicked!');
				//self.menuModel.setSelected('DBD');
				
			}, false);
			targetD.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetD.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetE = svgObject.getElementById('target-e-e');
			targetE.addEventListener("click", function(){
				
				console.log('Target E E clicked!');
				//self.menuModel.setSelected('DBE');
				
			}, false);
			targetE.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetE.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetF = svgObject.getElementById('target-e-f');
			targetF.addEventListener("click", function(){
				
				console.log('Target E F clicked!');
				//self.menuModel.setSelected('DBF');
				
			}, false);
			targetF.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetF.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetI = svgObject.getElementById('target-e-i');
			targetI.addEventListener("click", function(){
				
				console.log('Target E I clicked!');
				//self.menuModel.setSelected('DBI');
				
			}, false);
			targetI.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetI.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetJ = svgObject.getElementById('target-e-j');
			targetJ.addEventListener("click", function(){
				
				console.log('Target E J clicked!');
				//self.menuModel.setSelected('DBJ');
				
			}, false);
			targetJ.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetJ.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetK = svgObject.getElementById('target-e-k');
			targetK.addEventListener("click", function(){
				
				console.log('Target E K clicked!');
				//self.menuModel.setSelected('DBK');
				
			}, false);
			targetK.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetK.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			
		} else {
			console.log("svgObject is NOT ready!");
		}
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			
			const localized_grid_title = LM['translation'][sel]['DBA_TITLE'];
			const localized_apartments_title = LM['translation'][sel]['DBD_TITLE'];
			const localized_other_title_1 = LM['translation'][sel]['DBE_TITLE_1'];
			const localized_other_title_2 = LM['translation'][sel]['DBE_TITLE_2'];
			const localized_other_title_3 = LM['translation'][sel]['DBE_TITLE_3'];
			const localized_heating_system_title_1 = LM['translation'][sel]['DBF_TITLE_1'];
			const localized_heating_system_title_2 = LM['translation'][sel]['DBF_TITLE_2'];
			const localized_dhn_title_1 = LM['translation'][sel]['DBI_TITLE_1'];
			const localized_dhn_title_2 = LM['translation'][sel]['DBI_TITLE_2'];
			const localized_dhn_title_3 = LM['translation'][sel]['DBI_TITLE_3'];
			const localized_heating_dev_title_1 = LM['translation'][sel]['DBJ_TITLE_1'];
			const localized_heating_dev_title_2 = LM['translation'][sel]['DBJ_TITLE_2'];
			const localized_hot_water_title_1 = LM['translation'][sel]['DBK_TITLE_1'];
			const localized_hot_water_title_2 = LM['translation'][sel]['DBK_TITLE_2'];
			
			this.fillSVGTextElement(svgObject, 'dd-grid-title', localized_grid_title);
			this.fillSVGTextElement(svgObject, 'dd-apartments-title', localized_apartments_title);
			this.fillSVGTextElement(svgObject, 'dd-other-title-1', localized_other_title_1);
			this.fillSVGTextElement(svgObject, 'dd-other-title-2', localized_other_title_2);
			this.fillSVGTextElement(svgObject, 'dd-other-title-3', localized_other_title_3);
			this.fillSVGTextElement(svgObject, 'dd-heating-system-title-1', localized_heating_system_title_1);
			this.fillSVGTextElement(svgObject, 'dd-heating-system-title-2', localized_heating_system_title_2);
			this.fillSVGTextElement(svgObject, 'dd-dhn-title-1', localized_dhn_title_1);
			this.fillSVGTextElement(svgObject, 'dd-dhn-title-2', localized_dhn_title_2);
			this.fillSVGTextElement(svgObject, 'dd-dhn-title-3', localized_dhn_title_3);
			this.fillSVGTextElement(svgObject, 'dd-heating-dev-title-1', localized_heating_dev_title_1);
			this.fillSVGTextElement(svgObject, 'dd-heating-dev-title-2', localized_heating_dev_title_2);
			this.fillSVGTextElement(svgObject, 'dd-hot-water-title-1', localized_hot_water_title_1);
			this.fillSVGTextElement(svgObject, 'dd-hot-water-title-2', localized_hot_water_title_2);
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			
			//const localized_string_da_toggle = LM['translation'][sel]['DA_TOGGLE_DIRECTION'];
			//const localized_string_auto_update_msg_1 = LM['translation'][sel]['AUTO_UPDATE_MSG_1_B'];
			//const localized_string_auto_update_msg_2 = LM['translation'][sel]['AUTO_UPDATE_MSG_2'];
			
			const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
			let svgFile, svgClass;
			if (mode === 'LANDSCAPE') {
				//console.log('LANDSCAPE');
				svgFile = './svg/DE/DELandscape.svg';
				svgClass = 'svg-landscape-container';
			} else if (mode === 'PORTRAIT') {
				//console.log('PORTRAIT');
				svgFile = './svg/DE/DEPortrait.svg';
				svgClass = 'svg-portrait-container';
			} else {
				//console.log('SQUARE');
				svgFile = './svg/DE/DESquare.svg';
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
			svgObj.addEventListener('load', function() {
				self.addSVGEventHandlers();
				self.localizeSVGTexts();
				self.updateLatestValues();
				//self.updateLatestJetitekValue('StatusJetitek983Model');
				//self.updateLatestJetitekValue('StatusJetitek1012Model');
			});
			
			this.handleErrorMessages(this.FELID);
			
			this.rendered = true;
			
		} else {
			console.log('DistrictEView => render Models NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}