import ScreenOrientationObserver from  '../common/ScreenOrientationObserver.js';

export default class MenuView {
	
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.model = controller.master.modelRepo.get('MenuModel');
		this.svgObject = undefined;
		
		this.hexagonTranslations = { 
			'SQUARE' : {
				'A':'translate(500,300)',
				'B':'translate(800,510)',
				'C':'translate(700,820)',
				'D':'translate(300,820)',
				'E':'translate(200,510)'
			},
			'LANDSCAPE' : {
				'A':'translate(870,300)',
				'B':'translate(1170,510)',
				'C':'translate(1070,820)',
				'D':'translate(670,820)',
				'E':'translate(570,510)'
			},
			'PORTRAIT' : {
				'A':'translate(300,260)',
				'B':'translate(470,460)',
				'C':'translate(440,720)',
				'D':'translate(160,720)',
				'E':'translate(130,460)'
			}
		};
		this.screen = new ScreenOrientationObserver();
		
	}
	
	hide() {
		this.screen.stop();
		this.screen.unsubscribe(this);
		$(this.el).empty();
	}
	
	remove() {
		this.screen.stop();
		this.screen.unsubscribe(this);
		$(this.el).empty();
	}
	
	addSVGEventHandlers(mode) {
		const self = this;
		this.svgObject = document.getElementById('svg-object').contentDocument;
		if (typeof this.svgObject !== 'undefined') {
			console.log("svgObject is now ready!");
			
			const hexA = this.svgObject.getElementById('hex-a');
			hexA.addEventListener("click", function(){
				
				console.log('HEXAGON A CLICKED!');
				self.model.setSelected('DA');
				
				
			}, false);
			hexA.addEventListener("mouseover", function(event){
				event.target.style.strokeWidth = 5;
				event.target.style.fillOpacity = 0.2;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['A']+' scale(1.1)');
			}, false);
			hexA.addEventListener("mouseout", function(event){
				event.target.style.strokeWidth = 1;
				event.target.style.fillOpacity = 0.05;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['A']+' scale(1.0)');
			}, false);
			
			
			const hexB = this.svgObject.getElementById('hex-b');
			hexB.addEventListener("click", function(){
				
				console.log('HEXAGON B CLICKED!');
				
				
			}, false);
			hexB.addEventListener("mouseover", function(event){
				event.target.style.strokeWidth = 5;
				event.target.style.fillOpacity = 0.2;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['B']+' scale(1.1)');
			}, false);
			hexB.addEventListener("mouseout", function(event){
				event.target.style.strokeWidth = 1;
				event.target.style.fillOpacity = 0.05;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['B']+' scale(1.0)');
			}, false);
			
			
			const hexC = this.svgObject.getElementById('hex-c');
			hexC.addEventListener("click", function(){
				
				console.log('HEXAGON C CLICKED!');
				
				
			}, false);
			hexC.addEventListener("mouseover", function(event){
				event.target.style.strokeWidth = 5;
				event.target.style.fillOpacity = 0.2;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['C']+' scale(1.1)');
			}, false);
			hexC.addEventListener("mouseout", function(event){
				event.target.style.strokeWidth = 1;
				event.target.style.fillOpacity = 0.05;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['C']+' scale(1.0)');
			}, false);
			
			
			
			const hexD = this.svgObject.getElementById('hex-d');
			hexD.addEventListener("click", function(){
				
				console.log('HEXAGON D CLICKED!');
				
			}, false);
			hexD.addEventListener("mouseover", function(event){
				event.target.style.strokeWidth = 5;
				event.target.style.fillOpacity = 0.2;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['D']+' scale(1.1)');
			}, false);
			hexD.addEventListener("mouseout", function(event){
				event.target.style.strokeWidth = 1;
				event.target.style.fillOpacity = 0.05;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['D']+' scale(1.0)');
			}, false);
			
			const hexE = this.svgObject.getElementById('hex-e');
			hexE.addEventListener("click", function(){
				
				console.log('HEXAGON E CLICKED!');
				
			}, false);
			hexE.addEventListener("mouseover", function(event){
				event.target.style.strokeWidth = 5;
				event.target.style.fillOpacity = 0.2;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['E']+' scale(1.1)');
			}, false);
			hexE.addEventListener("mouseout", function(event){
				event.target.style.strokeWidth = 1;
				event.target.style.fillOpacity = 0.05;
				event.target.setAttributeNS(null,'transform',self.hexagonTranslations[mode]['E']+' scale(1.0)');
			}, false);
		}
	}
	
	start() {
		this.screen.subscribe(this);
		this.screen.start();
	}
	
	showSpinner(el) {
		const html =
			'<div id="preload-spinner" style="text-align:center;"><p>&nbsp;</p>'+
				'<div class="preloader-wrapper active">'+
					'<div class="spinner-layer spinner-blue-only">'+
						'<div class="circle-clipper left">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="gap-patch">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="circle-clipper right">'+
							'<div class="circle"></div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<p>&nbsp;</p>'+
			'</div>';
		$(html).appendTo(el);
	}
	
	render(options) {
		
		const self = this;
		
		$(this.el).empty();
		if (this.model.ready) {
			
			let mode = 'SQUARE';
			if (typeof options !== 'undefined') {
				if (typeof options.mode !== 'undefined') {
					mode = options.mode;
				}
			}
			let svgFile, svgClass;
			if (mode === 'LANDSCAPE') {
				console.log('LANDSCAPE');
				svgFile = 'menuLandscape.svg';
				svgClass = 'svg-landscape-container';
			} else if (mode === 'PORTRAIT') {
				console.log('PORTRAIT');
				svgFile = 'menuPortrait.svg';
				svgClass = 'svg-portrait-container';
			} else {
				console.log('SQUARE');
				svgFile = 'menuSquare.svg';
				svgClass = 'svg-square-container';
			}
			console.log(['this.model.data=',this.model.data]);
			if (this.model.errorMessage.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<h3 style="color:#444">ERROR:</h3>'+
							'<h5 style="color:#f44">'+this.model.errorMessage+'</h5>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
			} else {
				const html =
					'<div class="row">'+
						'<div class="col s12">'+
							'<div class="'+svgClass+'">'+
								'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					console.log('ADD SVG EVENT HANDLERS!');
					self.addSVGEventHandlers(mode);
				});
			}
		} else {
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}
