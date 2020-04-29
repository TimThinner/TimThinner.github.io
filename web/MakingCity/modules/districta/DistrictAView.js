/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
export default class DistrictAView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'StatusModel') {
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
	
	/*
		Geothermal part of "flow" is:
		
		LANDSCAPE:
		Giving: <path id="geothermal-pipe" d="M 1300,300 L 1300,350 A 50,50 0 0,1 1250,400 L 1000,400"
		Taking: <path id="geothermal-pipe" d="M 1000,400 L 1250,400 A 50,50 0 0,0 1300,350 L 1300,300"
		
		SQUARE:
		Giving: <path id="geothermal-pipe" d="M 720,260 L 720,300 A 50,50 0 0,1 670,350 L 500,350"
		Taking: <path id="geothermal-pipe" d="M 500,350 L 670,350 A 50,50 0 0,0 720,300 L 720,260"
		
		PORTRAIT:
		Giving: <path id="geothermal-pipe" d="M 480,260 L 480,350 A 50,50 0 0,1 430,400 L 300,400"
		Taking: <path id="geothermal-pipe" d="M 300,400 L 430,400 A 50,50 0 0,1 480,350 L 480,260"
	*/
	updateOne(svgObject, svgId, val) {
		const textElement = svgObject.getElementById(svgId);
		while (textElement.firstChild) {
			textElement.removeChild(textElement.firstChild);
		}
		// Check if 'geothermal-power' is giving or taking.
		if (svgId === 'geothermal-power') {
			const ps = {
				/*'PORTRAIT':{
					'give':'M 480,260 L 480,350 A 50,50 0 0,1 430,400 L 300,400',
					'take':'M 300,400 L 430,400 A 50,50 0 0,0 480,350 L 480,260'
				},
				'SQUARE':{
					'give':'M 720,260 L 720,300 A 50,50 0 0,1 670,350 L 500,350',
					'take':'M 500,350 L 670,350 A 50,50 0 0,0 720,300 L 720,260'
				},
				'LANDSCAPE':{
					'give':'M 1300,300 L 1300,350 A 50,50 0 0,1 1250,400 L 1000,400',
					'take':'M 1000,400 L 1250,400 A 50,50 0 0,0 1300,350 L 1300,300'
				}*/
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
			if (val < 0) {
				textElement.appendChild(document.createTextNode(Math.abs(val).toFixed(1) + " kW"));
				textElement.setAttributeNS(null, 'fill', '#f00');
				const pathElement = svgObject.getElementById('geothermal-pipe');
				pathElement.setAttributeNS(null, 'd', ps[mode]['take']);
			} else {
				textElement.appendChild(document.createTextNode(val.toFixed(1) + " kW"));
				textElement.setAttributeNS(null, 'fill', '#0a0');
				const pathElement = svgObject.getElementById('geothermal-pipe');
				pathElement.setAttributeNS(null, 'd', ps[mode]['give']);
			}
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
			console.log(['total_power=',total_power,' solar_power=',solar_power,' geothermal_power=',geothermal_power]);
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
			if (options.model==='StatusModel' && options.method==='fetched') {
				if (options.status === 200) {
					//console.log('DistrictAView => StatusModel fetched!');
					if (this.rendered) {
						$('#district-a-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#district-a-view-failure').empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							const html = '<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>';
							$(html).appendTo('#district-a-view-failure');
							setTimeout(() => {
								this.controller.forceLogout();
							}, 3000);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#district-a-view-failure');
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("DistrictAView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
		}
	}
	
	/*
	<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="64px" fill="#00897b">click me</text>
	*/
	setHoverEffect(event, scale){
		if (scale === 'scale(1.0)') {
			
			event.target.style.strokeWidth = 1;
			event.target.style.fillOpacity = 0.05;
		} else {
			
			event.target.style.strokeWidth = 3;
			event.target.style.fillOpacity = 0.5;
		}
		const oldtra = event.target.getAttributeNS(null,'transform');
		const index = oldtra.indexOf("scale"); // transform="translate(500,670) scale(1.1)" />
		const newtra = oldtra.slice(0, index) + scale;
		event.target.setAttributeNS(null,'transform',newtra);
	}
	
	addSVGEventHandlers() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const targetAA = svgObject.getElementById('target-a-a');
			targetAA.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAA');
				
			}, false);
			targetAA.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAA.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAB = svgObject.getElementById('target-a-b');
			targetAB.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAB');
				
			}, false);
			targetAB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAC = svgObject.getElementById('target-a-c');
			targetAC.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAC');
				
			}, false);
			targetAC.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAC.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAD = svgObject.getElementById('target-a-d');
			targetAD.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAD');
				
			}, false);
			targetAD.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAD.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAE = svgObject.getElementById('target-a-e');
			targetAE.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAE');
				
			}, false);
			targetAE.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAE.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAF = svgObject.getElementById('target-a-f');
			targetAF.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAF');
				
			}, false);
			targetAF.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAF.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAG = svgObject.getElementById('target-a-g');
			targetAG.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAG');
				
			}, false);
			targetAG.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAG.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAH = svgObject.getElementById('target-a-h');
			targetAH.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAG');
				
			}, false);
			targetAH.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAH.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAM = svgObject.getElementById('target-a-m');
			targetAM.addEventListener("click", function(){
				
				console.log('Cooling');
				
			}, false);
			targetAM.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAM.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAN = svgObject.getElementById('target-a-n');
			targetAN.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAG');
				
			}, false);
			targetAN.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAN.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAI = svgObject.getElementById('target-a-i');
			targetAI.addEventListener("click", function(){
				
				self.menuModel.setSelected('DAI');
				
			}, false);
			targetAI.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAI.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAP = svgObject.getElementById('target-a-p');
			targetAP.addEventListener("click", function(){
				
				console.log('District Heating Network');
				
			}, false);
			targetAP.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAP.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
		} else {
			console.log("svgObject is NOT ready!");
		}
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			
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
						'<div class="col s12 center" id="district-a-view-failure">'+
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
					$('<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>').appendTo('#district-a-view-failure');
					setTimeout(() => {
						this.controller.forceLogout();
					}, 3000);
				}
				
			} else {
				const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
				let svgFile, svgClass;
				if (mode === 'LANDSCAPE') {
					//console.log('LANDSCAPE');
					svgFile = './svg/DALandscape.svg';
					svgClass = 'svg-landscape-container';
				} else if (mode === 'PORTRAIT') {
					//console.log('PORTRAIT');
					svgFile = './svg/DAPortrait.svg';
					svgClass = 'svg-portrait-container';
				} else {
					//console.log('SQUARE');
					svgFile = './svg/DASquare.svg';
					svgClass = 'svg-square-container';
				}
				const LM = this.controller.master.modelRepo.get('LanguageModel');
				const sel = LM.selected;
				//const localized_string_da_description = LM['translation'][sel]['DA_DESCRIPTION'];
				//const localized_string_da_toggle = LM['translation'][sel]['DA_TOGGLE_DIRECTION'];
				const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
				const localized_string_auto_update_msg_1 = LM['translation'][sel]['AUTO_UPDATE_MSG_1_B'];
				const localized_string_auto_update_msg_2 = LM['translation'][sel]['AUTO_UPDATE_MSG_2'];
				const html =
					'<div class="row">'+
						'<div class="col s12" style="padding-left:0;padding-right:0;">'+
							'<div class="'+svgClass+'">'+
								'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
						'<div class="col s6 center" style="margin-top:14px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
						'<div class="col s6">'+
							'<p style="font-size:14px;color:#888">'+localized_string_auto_update_msg_1+' 30 '+localized_string_auto_update_msg_2+'.</p>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="district-a-view-failure"></div>'+
					'</div>';
					
					/*
					'<div class="row">'+
						'<div class="col s6">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
						'<div class="col s6">'+
							'<p style="color:#aaa">'+localized_string_auto_update_msg_1+' 30 '+localized_string_auto_update_msg_2+'.</p>'+
						'</div>'+
					'</div>';*/
				$(html).appendTo(this.el);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					
					self.addSVGEventHandlers();
					self.localizeSVGTexts();
					self.updateLatestValues();
				});
			}
			$('#back').on('click',function() {
				self.menuModel.setSelected('D');
			});
			this.rendered = true;
		} else {
			console.log('DistrictAView => render StatusModel IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}