/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

export default class DistrictBView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.PTO = new PeriodicTimeoutObserver({interval:180000}); // interval 3 minutes.
		this.PTO.subscribe(this);
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'district-b-view-failure';
	}
	
	show() {
		this.render();
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
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
	"solar-pipe-1"
	"solar-pipe-2"
	"sub-pipe-1"
	"apartment-pipe"
	"other-pipe"
	"exthaus-pipe"
	"wastewater-pipe"
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
	id="solar-power-left"
	id="solar-power-right"
	id="apartments-power"
	id="sauna-etc-power"
	id="heating-power"
	id="heating-devices-power"
	id="hot-water-power"
	id="exthaus-power"
	id="wastewater-power"
	id="dh-hot-power"
	id="dh-cool-power"
	*/
	updateLatestValues() {
		
		let grid_power = 0;
		let solar_power_left = 0;
		let solar_power_right = 0;
		let apartments_power = 0;
		let sauna_etc_power = 0;
		let heating_power = 0;
		let heating_devices_power = 0;
		let hot_water_power = 0;
		let exthaus_power = 0;
		let wastewater_power = 0;
		let dh_hot_power = 0;
		let dh_cool_power = 0;
		
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			if (this.models['SivakkaStatusModel'].values.length > 0) {
			/* 
				values is an array with 131 items (currently):
				[{
					"pointName":"Ulkolampotila (101TE00)",
					"pointId":11051263,
					"timestamp":"2021-12-03 14:02:33",
					"created_at":"2021-12-03 14:02:37",
					"value":-9.1
				}, ... ]
1.2		11099378	Exthaus air recovery
1.3		
1.4		11793375	DHN hot
1.5		11099156	DHN Cool
1.6		
1.7		
1.8		
1.9		11050758	Heating Devices
			*/
				this.models['SivakkaStatusModel'].values.forEach(item => {
					if (item.pointId === 11099378) {
						exthaus_power = item.value;
						
					} else if (item.pointId === 11793375) {
						dh_hot_power = item.value;
						
					} else if (item.pointId === 11099156) {
						dh_cool_power = item.value;
						
					} else if (item.pointId === 11050758) {
						heating_devices_power = item.value;
					}
				});
			}
			//this.updateOne(svgObject, 'grid-power', grid_power);
			//this.updateOne(svgObject, 'solar-power-left', solar_power_left);
			//this.updateOne(svgObject, 'solar-power-right', solar_power_right);
			//this.updateOne(svgObject, 'apartments-power', apartments_power);
			//this.updateOne(svgObject, 'sauna-etc-power', sauna_etc_power);
			//this.updateOne(svgObject, 'heating-power', heating_power);
			this.updateOne(svgObject, 'heating-devices-power', heating_devices_power);
			//this.updateOne(svgObject, 'hot-water-power', hot_water_power);
			this.updateOne(svgObject, 'exthaus-power', exthaus_power);
			//this.updateOne(svgObject, 'wastewater-power', wastewater_power);
			this.updateOne(svgObject, 'dh-hot-power', dh_hot_power);
			this.updateOne(svgObject, 'dh-cool-power', dh_cool_power);
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			
			if (options.model==='SivakkaStatusModel' && options.method==='fetched') {
				if (options.status === 200) {
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
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				//console.log("DistrictBView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Models are 'SivakkaStatusModel', 'MenuModel'.
				Object.keys(this.models).forEach(key => {
					//console.log(['FETCH MODEL key=',key]);
					this.models[key].fetch();
				});
			}
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
				
				self.models['MenuModel'].setSelected('district');
				
			}, false);
			
			/* 
			11 targets:
			"target-b-a"  ... "target-b-k"
			*/
			const targetBA = svgObject.getElementById('target-b-a');
			targetBA.addEventListener("click", function(){
				
				console.log('Target B A clicked!');
				//self.models['MenuModel'].setSelected('DBA');
				
			}, false);
			targetBA.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBA.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBB = svgObject.getElementById('target-b-b');
			targetBB.addEventListener("click", function(){
				
				console.log('Target B B clicked!');
				//self.models['MenuModel'].setSelected('DBB');
				
			}, false);
			targetBB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBC = svgObject.getElementById('target-b-c');
			targetBC.addEventListener("click", function(){
				
				console.log('Target B C clicked!');
				//self.models['MenuModel'].setSelected('DBC');
				
			}, false);
			targetBC.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBC.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBD = svgObject.getElementById('target-b-d');
			targetBD.addEventListener("click", function(){
				
				console.log('Target B D clicked!');
				//self.models['MenuModel'].setSelected('DBD');
				
			}, false);
			targetBD.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBD.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBE = svgObject.getElementById('target-b-e');
			targetBE.addEventListener("click", function(){
				
				console.log('Target B E clicked!');
				//self.models['MenuModel'].setSelected('DBE');
				
			}, false);
			targetBE.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBE.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBF = svgObject.getElementById('target-b-f');
			targetBF.addEventListener("click", function(){
				
				console.log('Target B F clicked!');
				//self.models['MenuModel'].setSelected('DBF');
				
			}, false);
			targetBF.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBF.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBG = svgObject.getElementById('target-b-g');
			targetBG.addEventListener("click", function(){
				
				console.log('Target B G clicked!');
				//self.models['MenuModel'].setSelected('DBG');
				
			}, false);
			targetBG.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBG.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBH = svgObject.getElementById('target-b-h');
			targetBH.addEventListener("click", function(){
				
				console.log('Target B H clicked!');
				//self.models['MenuModel'].setSelected('DBH');
				
			}, false);
			targetBH.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBH.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBI = svgObject.getElementById('target-b-i');
			targetBI.addEventListener("click", function(){
				
				console.log('Target B I clicked!');
				//self.models['MenuModel'].setSelected('DBI');
				
			}, false);
			targetBI.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBI.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBJ = svgObject.getElementById('target-b-j');
			targetBJ.addEventListener("click", function(){
				
				console.log('Target B J clicked!');
				//self.models['MenuModel'].setSelected('DBJ');
				
			}, false);
			targetBJ.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBJ.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBK = svgObject.getElementById('target-b-k');
			targetBK.addEventListener("click", function(){
				
				console.log('Target B K clicked!');
				//self.models['MenuModel'].setSelected('DBK');
				
			}, false);
			targetBK.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBK.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
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
			const localized_solar_title = LM['translation'][sel]['DBB_TITLE'];
			const localized_apartments_title = LM['translation'][sel]['DBD_TITLE'];
			const localized_other_title_1 = LM['translation'][sel]['DBE_TITLE_1'];
			const localized_other_title_2 = LM['translation'][sel]['DBE_TITLE_2'];
			const localized_other_title_3 = LM['translation'][sel]['DBE_TITLE_3'];
			const localized_heating_system_title_1 = LM['translation'][sel]['DBF_TITLE_1'];
			const localized_heating_system_title_2 = LM['translation'][sel]['DBF_TITLE_2'];
			const localized_exthaus_air_reco_title_1 = LM['translation'][sel]['DBG_TITLE_1'];
			const localized_exthaus_air_reco_title_2 = LM['translation'][sel]['DBG_TITLE_2'];
			const localized_wastewater_reco_title_1 = LM['translation'][sel]['DBH_TITLE_1'];
			const localized_wastewater_reco_title_2 = LM['translation'][sel]['DBH_TITLE_2'];
			const localized_dhn_title_1 = LM['translation'][sel]['DBI_TITLE_1'];
			const localized_dhn_title_2 = LM['translation'][sel]['DBI_TITLE_2'];
			const localized_dhn_title_3 = LM['translation'][sel]['DBI_TITLE_3'];
			const localized_heating_dev_title_1 = LM['translation'][sel]['DBJ_TITLE_1'];
			const localized_heating_dev_title_2 = LM['translation'][sel]['DBJ_TITLE_2'];
			const localized_hot_water_title_1 = LM['translation'][sel]['DBK_TITLE_1'];
			const localized_hot_water_title_2 = LM['translation'][sel]['DBK_TITLE_2'];
			
			this.fillSVGTextElement(svgObject, 'db-grid-title', localized_grid_title);
			this.fillSVGTextElement(svgObject, 'db-solar-title', localized_solar_title);
			this.fillSVGTextElement(svgObject, 'db-solar-title-2', localized_solar_title);
			this.fillSVGTextElement(svgObject, 'db-apartments-title', localized_apartments_title);
			this.fillSVGTextElement(svgObject, 'db-other-title-1', localized_other_title_1);
			this.fillSVGTextElement(svgObject, 'db-other-title-2', localized_other_title_2);
			this.fillSVGTextElement(svgObject, 'db-other-title-3', localized_other_title_3);
			this.fillSVGTextElement(svgObject, 'db-heating-system-title-1', localized_heating_system_title_1);
			this.fillSVGTextElement(svgObject, 'db-heating-system-title-2', localized_heating_system_title_2);
			this.fillSVGTextElement(svgObject, 'db-exthaus-air-reco-title-1', localized_exthaus_air_reco_title_1);
			this.fillSVGTextElement(svgObject, 'db-exthaus-air-reco-title-2', localized_exthaus_air_reco_title_2);
			this.fillSVGTextElement(svgObject, 'db-wastewater-reco-title-1', localized_wastewater_reco_title_1);
			this.fillSVGTextElement(svgObject, 'db-wastewater-reco-title-2', localized_wastewater_reco_title_2);
			this.fillSVGTextElement(svgObject, 'db-dhn-title-1', localized_dhn_title_1);
			this.fillSVGTextElement(svgObject, 'db-dhn-title-2', localized_dhn_title_2);
			this.fillSVGTextElement(svgObject, 'db-dhn-title-3', localized_dhn_title_3);
			this.fillSVGTextElement(svgObject, 'db-heating-dev-title-1', localized_heating_dev_title_1);
			this.fillSVGTextElement(svgObject, 'db-heating-dev-title-2', localized_heating_dev_title_2);
			this.fillSVGTextElement(svgObject, 'db-hot-water-title-1', localized_hot_water_title_1);
			this.fillSVGTextElement(svgObject, 'db-hot-water-title-2', localized_hot_water_title_2);
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
				svgFile = './svg/DB/DBLandscape.svg';
				svgClass = 'svg-landscape-container';
			} else if (mode === 'PORTRAIT') {
				//console.log('PORTRAIT');
				svgFile = './svg/DB/DBPortrait.svg';
				svgClass = 'svg-portrait-container';
			} else {
				//console.log('SQUARE');
				svgFile = './svg/DB/DBSquare.svg';
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
			console.log('DistrictBView => render Models NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}