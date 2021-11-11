/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
export default class DistrictBView extends View {
	
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
		this.FELID = 'district-b-view-failure';
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
	/*
		Geothermal part of "flow" is:
		
		LANDSCAPE:
		Giving: <path id="geothermal-pipe" d="M 1400,300 L 1400,380"
		Taking: <path id="geothermal-pipe" d="M 1400,380 L 1400,300"
		
		style="opacity:0.5;stroke:#f00;stroke-width:15px;stroke-dasharray:30px 10px;fill:none;">
		<animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
		
		SQUARE:
		Giving: <path id="geothermal-pipe" d="M 670,260 L 670,330"
		Taking: <path id="geothermal-pipe" d="M 670,330 L 670,260"
		
		style="opacity:0.5;stroke:#f00;stroke-width:12px;stroke-dasharray:30px 10px;fill:none;">
		<animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
		
		PORTRAIT:
		Giving: <path id="geothermal-pipe" d="M 380,260 L 380,350"
		Taking: <path id="geothermal-pipe" d="M 380,350 L 380,260"
		
		style="opacity:0.5;stroke:#f00;stroke-width:10px;stroke-dasharray:30px 10px;fill:none;">
		<animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
		
		
	*/
	updateOne(svgObject, svgId, val) {
		const textElement = svgObject.getElementById(svgId);
		while (textElement.firstChild) {
			textElement.removeChild(textElement.firstChild);
		}
		// Check if 'geothermal-power' is giving or taking.
		if (svgId === 'geothermal-power') {
			const ps = {
				'PORTRAIT':{
					'give':'M 380,260 L 380,350',
					'take':'M 380,350 L 380,260'
				},
				'SQUARE':{
					'give':'M 670,260 L 670,330',
					'take':'M 670,330 L 670,260'
				},
				'LANDSCAPE':{
					'give':'M 1400,300 L 1400,380',
					'take':'M 1400,380 L 1400,300'
				}
			};
			const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
			
			if (val === 0) {
				// Freeze the animation!
				const pipeElement = svgObject.getElementById('geothermal-pipe');
				if (pipeElement.firstElementChild) {
					// from = "40" set also to = "40", this freezes the "flow".
					pipeElement.firstElementChild.setAttributeNS(null, 'to', '40');
				}
				// Render power YELLOW color!
				textElement.appendChild(document.createTextNode(Math.abs(val).toFixed(1) + " kW"));
				textElement.setAttributeNS(null, 'fill', '#ff0');
				
			} else if (val < 0) {
				const pipeElement = svgObject.getElementById('geothermal-pipe');
				pipeElement.setAttributeNS(null, 'd', ps[mode]['take']);
				// Remember to set flow back to normal.
				if (pipeElement.firstElementChild) {
					pipeElement.firstElementChild.setAttributeNS(null, 'to', '0');
				}
				textElement.appendChild(document.createTextNode(Math.abs(val).toFixed(1) + " kW"));
				textElement.setAttributeNS(null, 'fill', '#f00');
				
			} else { // val > 0
				const pipeElement = svgObject.getElementById('geothermal-pipe');
				pipeElement.setAttributeNS(null, 'd', ps[mode]['give']);
				// Remember to set flow back to normal.
				if (pipeElement.firstElementChild) {
					pipeElement.firstElementChild.setAttributeNS(null, 'to', '0');
				}
				textElement.appendChild(document.createTextNode(val.toFixed(1) + " kW"));
				textElement.setAttributeNS(null, 'fill', '#0a0');
			}
			
		} else if (svgId === 'district-heating-power') {
			this.flowCheck(svgObject, val, 'district-heating-pipe');
			textElement.appendChild(document.createTextNode(val.toFixed(1) + " kW"));
			
		} else if (svgId === 'solar-power') {
			this.flowCheck(svgObject, val, 'solar-pipe');
			textElement.appendChild(document.createTextNode(val.toFixed(1) + " kW"));
			
		} else if (svgId === 'kitchen-power') {
			this.flowCheck(svgObject, val, 'kitchen-pipe');
			textElement.appendChild(document.createTextNode(val.toFixed(1) + " kW"));
			
		} else if (svgId === 'other-power') {
			this.flowCheck(svgObject, val, 'others-pipe');
			textElement.appendChild(document.createTextNode(val.toFixed(1) + " kW"));
			
		} else {
			textElement.appendChild(document.createTextNode(val.toFixed(1) + " kW"));
		}
	}
/*
meterId
116		Solar energy		2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
114		Total consumption	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
		Lights & appliances	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								4 coloured values in same chart:
103								Indoor lighting (JK_101)
102								Outdoor lighting (JK_101)
110								Indoor lighting (JK_102)
104								Common spaces (JK_101)
		Kitchen appliances	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								3 coloured values in same chart:
106								R3 Owen
107								R4 Owen
108								Dishwasher
		HPAC				2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								3 coloured values in same chart:
101								HPAC (JK_101)
105								HPAC (JK_102)
		Coolers & freezers	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								2 coloured values in same chart:
113								Refrigerating machines
112								Refrigerating equipments
		Other				2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								2 coloured values in same chart:
109								Car heating
111								VSS lighting
115		Geothermal energy	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
	*/
	updateLatestJetitekValue(modelName) {
		let power = 0;
		// [{"created_at":"2020-12-22T14:31:01","pointValue":132.9,"pointId":1012,"inserted":null}]
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			this.models[modelName].values.forEach(v => {
				if (v.pointValue) {
					power = v.pointValue;
				}
			});
			if (modelName === 'StatusJetitek983Model') {
				this.updateOne(svgObject, 'district-heating-power', power);
			} else {
				this.updateOne(svgObject, 'cooling-power', power);
			}
		}
	}
	
	updateLatestValues() {
		//console.log("UPDATE!");
		let solar_power = 0;
		let total_power = 0;
		let geothermal_power = 0;
		let cooler_equipment_power = 0;
		let cooler_machines_power = 0;
		let lights_power = 0;
		let kitchen_power = 0;
		let hpac_power = 0;
		let other_power = 0;
		let heating_devices_power = 0;
		
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			this.models['StatusModel'].values.forEach(item => {
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
			});
			//console.log(['total_power=',total_power,' solar_power=',solar_power,' geothermal_power=',geothermal_power]);
			// {"meterId":114,"meterName":"SPK_sahko_paamittaus","meterType":1,"dateTime":"2020-02-05 08:13:05","energy":444978.4,"avPower":77.143,"timeDiff":70,"energyDiff":1.5},
			this.updateOne(svgObject, 'grid-power', total_power);
			this.updateOne(svgObject, 'solar-power', solar_power);
			this.updateOne(svgObject, 'geothermal-power', geothermal_power);
			this.updateOne(svgObject, 'lights-power', lights_power);
			this.updateOne(svgObject, 'kitchen-power', kitchen_power);
			this.updateOne(svgObject, 'ventilation-power', hpac_power);
			this.updateOne(svgObject, 'other-power', other_power);
			this.updateOne(svgObject, 'cooler-machines-power', cooler_machines_power);
			this.updateOne(svgObject, 'cooler-equipments-power', cooler_equipment_power);
			this.updateOne(svgObject, 'heating-devices-power', heating_devices_power);
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			
			
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("DistrictAView ResizeEventObserver resize!!!!!!!!!!!!!!");
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
			
			/* 
			11 targets:
			"target-b-a"  ... "target-b-k"
			*/
			const targetBA = svgObject.getElementById('target-b-a');
			targetBA.addEventListener("click", function(){
				
				console.log('Target B A clicked!');
				//self.menuModel.setSelected('DBA');
				
			}, false);
			targetBA.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBA.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBB = svgObject.getElementById('target-b-b');
			targetBB.addEventListener("click", function(){
				
				console.log('Target B B clicked!');
				//self.menuModel.setSelected('DBB');
				
			}, false);
			targetBB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBC = svgObject.getElementById('target-b-c');
			targetBC.addEventListener("click", function(){
				
				console.log('Target B C clicked!');
				//self.menuModel.setSelected('DBC');
				
			}, false);
			targetBC.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBC.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBD = svgObject.getElementById('target-b-d');
			targetBD.addEventListener("click", function(){
				
				console.log('Target B D clicked!');
				//self.menuModel.setSelected('DBD');
				
			}, false);
			targetBD.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBD.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBE = svgObject.getElementById('target-b-e');
			targetBE.addEventListener("click", function(){
				
				console.log('Target B E clicked!');
				//self.menuModel.setSelected('DBE');
				
			}, false);
			targetBE.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBE.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBF = svgObject.getElementById('target-b-f');
			targetBF.addEventListener("click", function(){
				
				console.log('Target B F clicked!');
				//self.menuModel.setSelected('DBF');
				
			}, false);
			targetBF.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBF.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBG = svgObject.getElementById('target-b-g');
			targetBG.addEventListener("click", function(){
				
				console.log('Target B G clicked!');
				//self.menuModel.setSelected('DBG');
				
			}, false);
			targetBG.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBG.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBH = svgObject.getElementById('target-b-h');
			targetBH.addEventListener("click", function(){
				
				console.log('Target B H clicked!');
				//self.menuModel.setSelected('DBH');
				
			}, false);
			targetBH.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBH.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBI = svgObject.getElementById('target-b-i');
			targetBI.addEventListener("click", function(){
				
				console.log('Target B I clicked!');
				//self.menuModel.setSelected('DBI');
				
			}, false);
			targetBI.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBI.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBJ = svgObject.getElementById('target-b-j');
			targetBJ.addEventListener("click", function(){
				
				console.log('Target B J clicked!');
				//self.menuModel.setSelected('DBJ');
				
			}, false);
			targetBJ.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetBJ.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetBK = svgObject.getElementById('target-b-k');
			targetBK.addEventListener("click", function(){
				
				console.log('Target B K clicked!');
				//self.menuModel.setSelected('DBK');
				
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
			
			/*
			const localized_grid_title = LM['translation'][sel]['DAA_TITLE'];
			const localized_solar_title = LM['translation'][sel]['DAB_TITLE'];
			const localized_geothermal_title = LM['translation'][sel]['DAI_TITLE'];
			const localized_light_title = LM['translation'][sel]['DAC_TITLE'];
			const localized_kitchen_title = LM['translation'][sel]['DAD_TITLE'];
			const localized_hpac_title = LM['translation'][sel]['DAE_TITLE'];
			const localized_other_title = LM['translation'][sel]['DAF_TITLE'];
			const localized_cooler_machines_title = LM['translation'][sel]['DAHA_TITLE'];
			const localized_cooler_equipment_title = LM['translation'][sel]['DAHB_TITLE'];
			const localized_cooling_title = LM['translation'][sel]['DAHC_TITLE'];
			const localized_heating_title = LM['translation'][sel]['DAHD_TITLE'];
			const localized_dhn_title_a = LM['translation'][sel]['DAP_TITLE_A'];
			const localized_dhn_title_b = LM['translation'][sel]['DAP_TITLE_B'];
			const localized_dhn_title_c = LM['translation'][sel]['DAP_TITLE_C'];
			*/
			const localized_solar_title = LM['translation'][sel]['DBB_TITLE'];
			const localized_dhn_title_a = LM['translation'][sel]['DBI_TITLE_A'];
			const localized_dhn_title_b = LM['translation'][sel]['DBI_TITLE_B'];
			const localized_dhn_title_c = LM['translation'][sel]['DBI_TITLE_C'];
			/*
			this.fillSVGTextElement(svgObject, 'da-grid-title', localized_grid_title);
			this.fillSVGTextElement(svgObject, 'da-solar-title', localized_solar_title);
			this.fillSVGTextElement(svgObject, 'da-geothermal-title', localized_geothermal_title);
			this.fillSVGTextElement(svgObject, 'da-light-title', localized_light_title);
			this.fillSVGTextElement(svgObject, 'da-kitchen-title', localized_kitchen_title);
			this.fillSVGTextElement(svgObject, 'da-hpac-title', localized_hpac_title);
			this.fillSVGTextElement(svgObject, 'da-other-title', localized_other_title);
			this.fillSVGTextElement(svgObject, 'da-cooler-machines-title', localized_cooler_machines_title);
			this.fillSVGTextElement(svgObject, 'da-cooler-equipment-title', localized_cooler_equipment_title);
			this.fillSVGTextElement(svgObject, 'da-cooling-title', localized_cooling_title);
			this.fillSVGTextElement(svgObject, 'da-heating-title', localized_heating_title);
			this.fillSVGTextElement(svgObject, 'da-dhn-district-title', localized_dhn_title_a);
			this.fillSVGTextElement(svgObject, 'da-dhn-heating-title', localized_dhn_title_b);
			this.fillSVGTextElement(svgObject, 'da-dhn-network-title', localized_dhn_title_c);
			*/
			this.fillSVGTextElement(svgObject, 'db-solar-title', localized_solar_title);
			this.fillSVGTextElement(svgObject, 'db-solar-title-2', localized_solar_title);
			this.fillSVGTextElement(svgObject, 'db-dhn-district-title', localized_dhn_title_a);
			this.fillSVGTextElement(svgObject, 'db-dhn-heating-title', localized_dhn_title_b);
			this.fillSVGTextElement(svgObject, 'db-dhn-network-title', localized_dhn_title_c);
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
				//self.updateLatestValues();
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