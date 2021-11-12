import View from '../common/View.js';
export default class DistrictView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'DistrictModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
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
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("DistrictView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
		}
	}
	
	/*
	NOTE: transform is defined as SVG property!
	NOTE: old version used always scale(1.0) => scale(1.1. NOW we have different scales for 
	different orientations, therefore we need to check old scale and just that as a base starting point.
	LANDSCAPE:	scale(1.3)
	SQUARE:		scale(1.3)
	PORTRAIT:	scale(1.0)
	*/
	setHoverEffect(event, scale){
		if (scale === 0) {
			// mouseout
			event.target.style.strokeWidth = 1;
			event.target.style.fillOpacity = 0.05;
		} else {
			// mouseover
			event.target.style.strokeWidth = 5;
			event.target.style.fillOpacity = 0.2;
		}
		// Check what is the old scale?
		const oldT = event.target.getAttributeNS(null,'transform');
		//console.log(['oldT=',oldT]);
		// Tokenize it:
		const fs = oldT.split(' ');
		/*
		For example:
		"translate(1090,655)"
		"scale(1.0)"
		"rotate(90)"
		*/
		//console.log(['fs=',fs]);
		const newA = [];
		// Just replace the "scale()" function with new scale and leave other untouched.
		fs.forEach(f => {
			//console.log(['f=',f]);
			if (f.indexOf("scale")===0) {
				let oldscale = parseFloat(f.slice(6));
				if (scale === 0) {
					// mouseout
					oldscale -= 0.1;
				} else {
					// mouseover
					oldscale += 0.1;
				}
				const newscale = 'scale('+oldscale+')';
				//console.log(['newscale=',newscale]);
				newA.push(newscale);
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
				
				self.controller.models['MenuModel'].setSelected('menu');
				
			}, false);
			
			const hexA = svgObject.getElementById('hex-a');
			hexA.addEventListener("click", function(){
				
				self.controller.models['MenuModel'].setSelected('DA');
				
			}, false);
			hexA.addEventListener("mouseover", function(event){ self.setHoverEffect(event, 1); }, false);
			hexA.addEventListener("mouseout", function(event){ self.setHoverEffect(event, 0); }, false);
			
			const hexB = svgObject.getElementById('hex-b');
			hexB.addEventListener("click", function(){
				//console.log('HEXAGON B CLICKED!');
				// Sivakka 1
				self.controller.models['MenuModel'].setSelected('DB');
				
			}, false);
			hexB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,1); }, false);
			hexB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,0); }, false);
			
			const hexC = svgObject.getElementById('hex-c');
			hexC.addEventListener("click", function(){
				//console.log('HEXAGON C CLICKED!');
				self.controller.models['MenuModel'].setSelected('DC');
				
			}, false);
			hexC.addEventListener("mouseover", function(event){ self.setHoverEffect(event,1); }, false);
			hexC.addEventListener("mouseout", function(event){ self.setHoverEffect(event,0); }, false);
			
			const hexD = svgObject.getElementById('hex-d');
			hexD.addEventListener("click", function(){
				console.log('HEXAGON D CLICKED!');
			}, false);
			hexD.addEventListener("mouseover", function(event){ self.setHoverEffect(event,1); }, false);
			hexD.addEventListener("mouseout", function(event){ self.setHoverEffect(event,0); }, false);
			
			const hexE = svgObject.getElementById('hex-e');
			hexE.addEventListener("click", function(){
				console.log('HEXAGON E CLICKED!');
			}, false);
			hexE.addEventListener("mouseover", function(event){ self.setHoverEffect(event,1); }, false);
			hexE.addEventListener("mouseout", function(event){ self.setHoverEffect(event,0); }, false);
			
			const hexF = svgObject.getElementById('hex-f');
			hexF.addEventListener("click", function(){
				console.log('HEXAGON F CLICKED!');
			}, false);
			hexF.addEventListener("mouseover", function(event){ self.setHoverEffect(event,1); }, false);
			hexF.addEventListener("mouseout", function(event){ self.setHoverEffect(event,0); }, false);
		}
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_d_a = LM['translation'][sel]['DISTRICT_A_LABEL'];
			const localized_d_b = LM['translation'][sel]['DISTRICT_B_LABEL'];
			const localized_d_c = LM['translation'][sel]['DISTRICT_C_LABEL'];
			const localized_d_d = LM['translation'][sel]['DISTRICT_D_LABEL'];
			const localized_d_e = LM['translation'][sel]['DISTRICT_E_LABEL'];
			const localized_d_f = LM['translation'][sel]['DISTRICT_F_LABEL'];
			
			this.fillSVGTextElement(svgObject, 'district-a', localized_d_a);
			this.fillSVGTextElement(svgObject, 'district-b', localized_d_b);
			this.fillSVGTextElement(svgObject, 'district-c', localized_d_c);
			this.fillSVGTextElement(svgObject, 'district-d', localized_d_d);
			this.fillSVGTextElement(svgObject, 'district-e', localized_d_e);
			this.fillSVGTextElement(svgObject, 'district-f', localized_d_f);
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
		
		let svgFile, svgClass;
		if (mode === 'LANDSCAPE') {
			//console.log('LANDSCAPE');
			svgFile = './svg/D/DLandscape.svg';
			svgClass = 'svg-landscape-container';
		} else if (mode === 'PORTRAIT') {
			//console.log('PORTRAIT');
			svgFile = './svg/D/DPortrait.svg';
			svgClass = 'svg-portrait-container';
		} else {
			//console.log('SQUARE');
			svgFile = './svg/D/DSquare.svg';
			svgClass = 'svg-square-container';
		}
		
		const html =
			'<div class="row">'+
				'<div class="col s12" style="padding-left:0;padding-right:0;">'+
					'<div class="'+svgClass+'">'+
						'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		// AND WAIT for SVG object to fully load, before assigning event handlers!
		const svgObj = document.getElementById("svg-object");
		svgObj.addEventListener('load', function(){
			//console.log('ADD SVG EVENT HANDLERS!');
			self.addSVGEventHandlers();
			self.localizeSVGTexts();
		});
		this.rendered = true;
	}
}
