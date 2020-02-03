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
			if (key === 'DistrictAModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		// Start listening notify -messages from ResizeObserverModel:
		this.controller.master.modelRepo.get('ResizeObserverModel').subscribe(this);
		
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
		console.log("UPDATE!");
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='DistrictAModel' && options.method==='fetched') {
				if (options.status === 200) {
					//console.log('DistrictAView => DistrictAModel fetched!');
					if (this.rendered) {
						$('#district-a-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#district-a-view-failure').empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#district-a-view-failure');
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeObserverModel' && options.method==='resize') {
				//if (options.status === 200) {
				this.render();
				//}
			}
		}
	}
	
	/*
	<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="64px" fill="#00897b">click me</text>
	*/
	setHoverEffect(event, scale){
		if (scale === 'scale(1.0)') {
			
			event.target.style.strokeWidth = 3;
			event.target.style.fillOpacity = 0.05;
		} else {
			
			event.target.style.strokeWidth = 9;
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
		if (typeof svgObject !== 'undefined') {
			
			//console.log("svgObject is now ready!");
			const targetAA = svgObject.getElementById('target-a-a');
			targetAA.addEventListener("click", function(){
				self.menuModel.setSelected('DAA');
			}, false);
			targetAA.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAA.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAB = svgObject.getElementById('target-a-b');
			targetAB.addEventListener("click", function(){
				//self.menuModel.setSelected('DAA');
			}, false);
			targetAB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAC = svgObject.getElementById('target-a-c');
			targetAC.addEventListener("click", function(){
				//self.menuModel.setSelected('DAA');
			}, false);
			targetAC.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAC.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAD = svgObject.getElementById('target-a-d');
			targetAD.addEventListener("click", function(){
				//self.menuModel.setSelected('DAA');
			}, false);
			targetAD.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAD.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAE = svgObject.getElementById('target-a-e');
			targetAE.addEventListener("click", function(){
				//self.menuModel.setSelected('DAA');
			}, false);
			targetAE.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAE.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const targetAF = svgObject.getElementById('target-a-f');
			targetAF.addEventListener("click", function(){
				//self.menuModel.setSelected('DAA');
			}, false);
			targetAF.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			targetAF.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			
		} else {
			console.log("svgObject is NOT ready!");
		}
	}
	
	addEventHandlers() {
		const self = this;
		$("#toggle-direction").on('click',function(){
			const svgObject = document.getElementById('svg-object').contentDocument;
			if (typeof svgObject !== 'undefined') {
				const mode = self.controller.master.modelRepo.get('ResizeObserverModel').mode;
				//console.log(['mode=',mode]);
				/* 
				DAPortrait: 		<path id="p1" d="M 140,400 L 300,400 
				DASquare.svg: 		<path id="p1" d="M 300,400 L 500,400 
				DALandscape.svg:	<path id="p1" d="M 300,400 L 1000,400 
				*/
				const ps = {
					'PORTRAIT' : {'forward':'M 140,400 L 300,400','reverse':'M 300,400 L 140,400' },
					'SQUARE'   : {'forward':'M 300,400 L 500,400','reverse':'M 500,400 L 300,400' },
					'LANDSCAPE': {'forward':'M 300,400 L 1000,400','reverse':'M 1000,400 L 300,400' }
				}
				const modef = ps[mode]['forward'];
				
				const len = modef.length;
				//console.log(['modef=',modef,' len=',len]);
				
				let pathElement = svgObject.getElementById('p1');
				//<text id="grid-power" x="400" y="380" font-family="Arial, Helvetica, sans-serif" font-size="42px" fill="#f00">120.0 kW</text>
				const textElement = svgObject.getElementById('grid-power');
				
				let d = pathElement.getAttributeNS(null, 'd');
				//console.log(['d=',d]);
				const head = d.slice(0,len);
				const tail = d.slice(len);
				
				if (head === modef) {
					// Change text GREEN and value 2.5 kW
					while (textElement.firstChild) {
						textElement.removeChild(textElement.firstChild);
					}
					var txt = document.createTextNode("2.5 kW");
					textElement.appendChild(txt);
					textElement.setAttributeNS(null, 'fill', '#0a0');
					
					const new_d = ps[mode]['reverse'] + tail;
					pathElement.setAttributeNS(null, 'd', new_d);
					
				} else {
					// Change text RED and value 120.0 kW
					while (textElement.firstChild) {
						textElement.removeChild(textElement.firstChild);
					}
					var txt = document.createTextNode("120.0 kW");
					textElement.appendChild(txt);
					textElement.setAttributeNS(null, 'fill', '#f00');
					
					const new_d = modef + tail;
					pathElement.setAttributeNS(null, 'd', new_d);
				}
			}
		});
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (typeof svgObject !== 'undefined') {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			
			const localized_solar_panels = LM['translation'][sel]['SOLAR_PANELS'];
			const localized_grid_text = LM['translation'][sel]['GRID_TEXT'];
			
			this.fillSVGTextElement(svgObject, 'solar-panels', localized_solar_panels);
			this.fillSVGTextElement(svgObject, 'grid-text', localized_grid_text);
			
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
						'<div class="col s12 center">'+
							'<p>UUPS! Something went wrong.</p>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s6 center">'+
							'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
			} else {
				const mode = this.controller.master.modelRepo.get('ResizeObserverModel').mode;
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
				const localized_string_da_description = LM['translation'][sel]['DA_DESCRIPTION'];
				const localized_string_da_toggle = LM['translation'][sel]['DA_TOGGLE_DIRECTION'];
				const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
				const html =
					'<div class="row">'+
						'<div class="col s12" style="padding-left:0;padding-right:0;">'+
							'<div class="'+svgClass+'">'+
								'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="district-a-view-failure"></div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<h5 id="menu-description" style="color:#777">'+localized_string_da_description+'</h5>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s6 center">'+
							//'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
						'<div class="col s6 center">'+
							'<button class="btn waves-effect waves-light" id="toggle-direction">'+localized_string_da_toggle+
								'<i class="material-icons right">send</i>'+
							'</button>'+
							//'<a id="toggle-direction" class="waves-effect waves-light btn-large">Toggle direction</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				// This button will be available as soon as SVG is fully loaded.
				$("#toggle-direction").prop("disabled", true);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					
					self.addSVGEventHandlers();
					self.addEventHandlers();
					self.localizeSVGTexts();
					$("#toggle-direction").prop("disabled", false);
				});
			}
			$('#back').on('click',function() {
				self.controller.menuModel.setSelected('menu');
			});
			this.rendered = true;
		} else {
			console.log('DistrictAView => render DistrictAModel IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}
