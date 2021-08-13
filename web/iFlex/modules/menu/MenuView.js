import View from '../common/View.js';

export default class MenuView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'MenuModel') {
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
				this.render();
			}
		}
	}
	
	addSVGEventHandlers() {
		const self = this;
		const BORDER_COLOR = '#000';
		const BORDER_COLOR_HOVER = '#0f0';
		const BACKGROUND_COLOR = '#aaa';
		const BACKGROUND_COLOR_HOVER = '#ccc';
		
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const targetA = svgObject.getElementById('target-a');
			targetA.addEventListener("click", function(){
				
				self.models['MenuModel'].setSelected('A');
				
			}, false);
			targetA.addEventListener("mouseover", function(event){ 
				svgObject.getElementById('target-a-border').style.stroke = BORDER_COLOR_HOVER;
				svgObject.getElementById('target-a-border').style.fill = BACKGROUND_COLOR_HOVER;
			}, false);
			targetA.addEventListener("mouseout", function(event){ 
				svgObject.getElementById('target-a-border').style.stroke = BORDER_COLOR;
				svgObject.getElementById('target-a-border').style.fill = BACKGROUND_COLOR;
			}, false);
			
			
			const targetB = svgObject.getElementById('target-b');
			targetB.addEventListener("click", function(){
				
				//self.models['MenuModel'].setSelected('B');
				console.log('Selected B');
				
			}, false);
			targetB.addEventListener("mouseover", function(event){ 
				svgObject.getElementById('target-b-border').style.stroke = BORDER_COLOR_HOVER;
				svgObject.getElementById('target-b-border').style.fill = BACKGROUND_COLOR_HOVER;
			}, false);
			targetB.addEventListener("mouseout", function(event){ 
				svgObject.getElementById('target-b-border').style.stroke = BORDER_COLOR;
				svgObject.getElementById('target-b-border').style.fill = BACKGROUND_COLOR;
			}, false);
			
			
			const targetC = svgObject.getElementById('target-c');
			targetC.addEventListener("click", function(){
				
				//self.models['MenuModel'].setSelected('C');
				console.log('Selected C');
				
			}, false);
			targetC.addEventListener("mouseover", function(event){ 
				svgObject.getElementById('target-c-border').style.stroke = BORDER_COLOR_HOVER;
				svgObject.getElementById('target-c-border').style.fill = BACKGROUND_COLOR_HOVER;
			}, false);
			targetC.addEventListener("mouseout", function(event){ 
				svgObject.getElementById('target-c-border').style.stroke = BORDER_COLOR;
				svgObject.getElementById('target-c-border').style.fill = BACKGROUND_COLOR;
			}, false);
			
			const targetD = svgObject.getElementById('target-d');
			targetD.addEventListener("click", function(){
				
				//self.models['MenuModel'].setSelected('D');
				console.log('Selected D');
				
			}, false);
			targetD.addEventListener("mouseover", function(event){ 
				svgObject.getElementById('target-d-border').style.stroke = BORDER_COLOR_HOVER;
				svgObject.getElementById('target-d-border').style.fill = BACKGROUND_COLOR_HOVER;
			}, false);
			targetD.addEventListener("mouseout", function(event){ 
				svgObject.getElementById('target-d-border').style.stroke = BORDER_COLOR;
				svgObject.getElementById('target-d-border').style.fill = BACKGROUND_COLOR;
			}, false);
			
			
			const door = svgObject.getElementById('door');
			door.addEventListener("click", function(){
				
				//self.models['MenuModel'].setSelected('door');
				console.log('Selected door');
				
			}, false);
			door.addEventListener("mouseover", function(event){ 
				svgObject.getElementById('door-border').style.stroke = BORDER_COLOR_HOVER;
				svgObject.getElementById('door-border').style.fill = BACKGROUND_COLOR_HOVER;
			}, false);
			door.addEventListener("mouseout", function(event){ 
				svgObject.getElementById('door-border').style.stroke = BORDER_COLOR;
				svgObject.getElementById('door-border').style.fill = BACKGROUND_COLOR;
			}, false);
			
		}
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			//const LM = this.controller.master.modelRepo.get('LanguageModel');
			//const sel = LM.selected;
			
			//const localized_grid_title = LM['translation'][sel]['DAA_TITLE'];
			this.fillSVGTextElement(svgObject, 'a-title', 'A');
			this.fillSVGTextElement(svgObject, 'b-title', 'B');
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
		
		let svgFile, svgClass;
		if (mode === 'LANDSCAPE') {
			svgFile = './svg/menu/menuL.svg';
			svgClass = 'svg-landscape-container';
			
		} else if (mode === 'PORTRAIT') {
			svgFile = './svg/menu/menuP.svg';
			svgClass = 'svg-portrait-container';
			
		} else {
			svgFile = './svg/menu/menuS.svg';
			svgClass = 'svg-square-container';
		}
		
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		const html =
			'<div class="row">'+ // style="margin-top:-20px">'+
				'<div class="col s12" style="padding-left:0;padding-right:0;">'+
					'<div class="'+svgClass+'">'+
						'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>Info</h4>'+
					'<p>Here we can put some information about this page.</p>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		// AND WAIT for SVG object to fully load, before assigning event handlers!
		const svgObj = document.getElementById("svg-object");
		svgObj.addEventListener('load', function(){
			console.log('ADD SVG EVENT HANDLERS!');
			
			//self.scaleIt();
			//self.setLanguageSelection(LM.selected);
			
			
			self.addSVGEventHandlers();
			//self.localizeSVGTexts();
			
		});
		this.rendered = true;
	}
}
