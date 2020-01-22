//import ResizeObserverModel from  '../common/ResizeObserverModel.js';

export default class MenuView {
	
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.model = controller.master.modelRepo.get('MenuModel');
		this.model.subscribe(this);
		
		controller.master.modelRepo.get('ResizeObserverModel').subscribe(this);
		
		
		this.svgObject = undefined;
		this.rendered = false;
		this.visible = false;
		
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
		this.updateCounter = 0;
	}
	
	show() {
		this.visible = true;
		this.render();
	}
	
	hide() {
		this.visible = false;
		this.svgObject = undefined;
		this.rendered = false;
		this.updateCounter = 0;
		$(this.el).empty();
	}
	
	remove() {
		this.visible = false;
		this.model.unsubscribe(this);
		this.svgObject = undefined;
		this.rendered = false;
		this.updateCounter = 0;
		$(this.el).empty();
	}
	
	changeCounterValue() {
		if (typeof this.svgObject !== 'undefined') {
			const textElement = this.svgObject.getElementById('update-counter');
			while (textElement.firstChild) {
				textElement.removeChild(textElement.firstChild);
			}
			this.updateCounter++;
			var txt = document.createTextNode("Updated "+this.updateCounter+" times");
			textElement.appendChild(txt);
			//textElement.setAttributeNS(null, 'fill', '#0a0');
		}
	}
	
	updateLatestValues() {
		console.log("UPDATE!");
		this.changeCounterValue();
	}
	
	notify(options) {
		if (this.visible) {
			
			if (options.model==='MenuModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('MenuView => MenuModel fetched!');
					if (this.rendered) {
						$('#menu-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#menu-view-failure').empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#menu-view-failure');
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
	
	render() {
		const self = this;
		
		
		console.log('MenuView => render%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
		
		$(this.el).empty();
		if (this.model.ready) {
			
			console.log('MenuView => render MenuModel IS READY!');
			
			const mode = this.controller.master.modelRepo.get('ResizeObserverModel').mode;
			
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
						'<div class="col s12 center" id="menu-view-failure">'+
							'<div class="error-message"><p>'+this.model.errorMessage+'</p></div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<p>UUPS! Something went wrong.</p>'+
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
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="menu-view-failure"></div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<h3>Positive Energy Districts</h3>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12">'+
							"<p>Lancashire babybel melted cheese. Cheesy feet airedale feta pepper jack cheesy feet cheese triangles cheese on toast mozzarella. Edam babybel dolcelatte brie everyone loves fromage gouda cheesy grin. Bocconcini pecorino blue castello bavarian bergkase when the cheese comes out everybody's happy fromage frais cheeseburger fromage frais. Stinking bishop mascarpone st. agur blue cheese queso.</p>"+
							'<p>Swiss fondue the big cheese. Cauliflower cheese red leicester swiss fondue smelly cheese cheese and biscuits cream cheese lancashire. Cauliflower cheese camembert de normandie croque monsieur goat boursin caerphilly taleggio cauliflower cheese. Emmental edam cheesy feet squirty cheese stinking bishop swiss smelly cheese the big cheese. Everyone loves fromage frais.</p>'+
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
			
			this.rendered = true;
			
		} else {
			// this.el = '#content'
			console.log('MenuView => render MenuModel IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
