import View from '../common/View.js';

export default class UserPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
			
		});
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
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
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				this.render();
			}
		}
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const USER_MODEL = this.controller.master.modelRepo.get('UserModel');
			if (USER_MODEL) {
				const index = USER_MODEL.email.indexOf('@');
				const email = USER_MODEL.email.slice(0,index);
				this.fillSVGTextElement(svgObject, 'user-name', email);
			}
		}
	}
	
	addSVGEventHandlers() {
		const self = this;
		
		const FILL_COLOR = '#fff';
		const FILL_COLOR_HOVER = '#0f0';
		
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const targetA = svgObject.getElementById('target-a');
			targetA.addEventListener("click", function(){
				
				self.models['MenuModel'].setSelected('menu');
				
			}, false);
			targetA.addEventListener("mouseover", function(event){ 
				//svgObject.getElementById('target-a-border').style.stroke = STROKE_COLOR_HOVER;
				svgObject.getElementById('target-a-border').style.fill = FILL_COLOR_HOVER;
			}, false);
			targetA.addEventListener("mouseout", function(event){ 
				//svgObject.getElementById('target-a-border').style.stroke = STROKE_COLOR;
				svgObject.getElementById('target-a-border').style.fill = FILL_COLOR;
			}, false);
			
			
			const targetB = svgObject.getElementById('target-b');
			targetB.addEventListener("click", function(){
				
				const UM = self.controller.master.modelRepo.get('UserModel');
				if (UM) {
					UM.logout();
				}
				
			}, false);
			targetB.addEventListener("mouseover", function(event){ 
				//svgObject.getElementById('target-b-border').style.stroke = STROKE_COLOR_HOVER;
				svgObject.getElementById('target-b-border').style.fill = FILL_COLOR_HOVER;
			}, false);
			targetB.addEventListener("mouseout", function(event){ 
				//svgObject.getElementById('target-b-border').style.stroke = STROKE_COLOR;
				svgObject.getElementById('target-b-border').style.fill = FILL_COLOR;
			}, false);
			
			
			const targetC = svgObject.getElementById('target-c');
			targetC.addEventListener("click", function(){
				
				self.models['MenuModel'].setSelected('USERHEATING');
				
			}, false);
			targetC.addEventListener("mouseover", function(event){ 
				//svgObject.getElementById('target-c-border').style.stroke = STROKE_COLOR_HOVER;
				svgObject.getElementById('target-c-border').style.fill = FILL_COLOR_HOVER;
			}, false);
			targetC.addEventListener("mouseout", function(event){ 
				//svgObject.getElementById('target-c-border').style.stroke = STROKE_COLOR;
				svgObject.getElementById('target-c-border').style.fill = FILL_COLOR;
			}, false);
			
			
			const targetD = svgObject.getElementById('target-d');
			targetD.addEventListener("click", function(){
				
				self.models['MenuModel'].setSelected('USERFEEDBACK');
				
			}, false);
			targetD.addEventListener("mouseover", function(event){ 
				//svgObject.getElementById('target-d-border').style.stroke = STROKE_COLOR_HOVER;
				svgObject.getElementById('target-d-border').style.fill = FILL_COLOR_HOVER;
			}, false);
			targetD.addEventListener("mouseout", function(event){ 
				//svgObject.getElementById('target-d-border').style.stroke = STROKE_COLOR;
				svgObject.getElementById('target-d-border').style.fill = FILL_COLOR;
			}, false);
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			//const USER_MODEL = this.controller.master.modelRepo.get('UserModel');
			const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
			let radius = 100;
			
			let svgFile, svgClass;
			if (mode === 'LANDSCAPE') {
				svgFile = './svg/userL.svg';
				svgClass = 'svg-landscape-container';
				
			} else if (mode === 'PORTRAIT') {
				svgFile = './svg/userP.svg';
				svgClass = 'svg-portrait-container';
				radius = 90;
			} else {
				svgFile = './svg/userS.svg';
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
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			// AND WAIT for SVG object to fully load, before assigning event handlers!
			const svgObj = document.getElementById("svg-object");
			svgObj.addEventListener('load', function(){
				console.log('ADD SVG EVENT HANDLERS!');
				
				//self.setLanguageSelection(LM.selected);
				self.addSVGEventHandlers();
				self.localizeSVGTexts();
				
				
			});
			this.handleErrorMessages(this.FELID);
			this.rendered = true;
		
		} else {
			console.log('UserPageView => render Models ARE NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
