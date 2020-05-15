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
		
		this.controller.master.modelRepo.get('ResizeEventObserver').subscribe(this);
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
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("DistrictView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
		}
	}
	
	setHoverEffect(event, scale){
		if (scale === 'scale(1.0)') {
			event.target.style.strokeWidth = 1;
			event.target.style.fillOpacity = 0.05;
		} else {
			event.target.style.strokeWidth = 5;
			event.target.style.fillOpacity = 0.2;
		}
		const oldtra = event.target.getAttributeNS(null,'transform');
		const index = oldtra.indexOf("scale"); // transform="translate(500,670) scale(1.1)" />
		const newtra = oldtra.slice(0, index) + scale;
		event.target.setAttributeNS(null,'transform',newtra);
	}
	
	addSVGEventHandlers(mode) {
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
			hexA.addEventListener("mouseover", function(event){ self.setHoverEffect(event, 'scale(1.1)'); }, false);
			hexA.addEventListener("mouseout", function(event){ self.setHoverEffect(event, 'scale(1.0)'); }, false);
			
			const hexB = svgObject.getElementById('hex-b');
			hexB.addEventListener("click", function(){
				console.log('HEXAGON B CLICKED!');
			}, false);
			hexB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			hexB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const hexC = svgObject.getElementById('hex-c');
			hexC.addEventListener("click", function(){
				console.log('HEXAGON C CLICKED!');
			}, false);
			hexC.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			hexC.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const hexD = svgObject.getElementById('hex-d');
			hexD.addEventListener("click", function(){
				console.log('HEXAGON D CLICKED!');
			}, false);
			hexD.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			hexD.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const hexE = svgObject.getElementById('hex-e');
			hexE.addEventListener("click", function(){
				console.log('HEXAGON E CLICKED!');
			}, false);
			hexE.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			hexE.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
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
			
			this.fillSVGTextElement(svgObject, 'district-a', localized_d_a);
			this.fillSVGTextElement(svgObject, 'district-b', localized_d_b);
			this.fillSVGTextElement(svgObject, 'district-c', localized_d_c);
			this.fillSVGTextElement(svgObject, 'district-d', localized_d_d);
			this.fillSVGTextElement(svgObject, 'district-e', localized_d_e);
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
			self.addSVGEventHandlers(mode);
			self.localizeSVGTexts();
		});
		this.rendered = true;
	}
}
