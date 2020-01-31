import View from '../common/View.js';
export default class MenuView extends View {
	
	constructor(controller) {
		super(controller);
		
		this.model = this.controller.master.modelRepo.get('MenuModel');
		this.model.subscribe(this);
		
		this.controller.master.modelRepo.get('ResizeObserverModel').subscribe(this);
		
		this.svgObject = undefined;
		this.rendered = false;
		
		//this.updateCounter = 0;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.svgObject = undefined;
		this.rendered = false;
		//this.updateCounter = 0;
		$(this.el).empty();
	}
	
	remove() {
		this.model.unsubscribe(this);
		this.svgObject = undefined;
		this.rendered = false;
		//this.updateCounter = 0;
		$(this.el).empty();
	}
	/*
	increaseCounterValue() {
		this.updateCounter++;
		if (typeof this.svgObject !== 'undefined') {
			const textElement = this.svgObject.getElementById('update-counter');
			while (textElement.firstChild) {
				textElement.removeChild(textElement.firstChild);
			}
			var txt = document.createTextNode("Updated "+this.updateCounter+" times");
			textElement.appendChild(txt);
			//textElement.setAttributeNS(null, 'fill', '#0a0');
		} else {
			console.log('SVG OBJECT IS NOT READY YET!');
		}
	}*/
	
	updateLatestValues() {
		console.log("UPDATE!");
		//this.increaseCounterValue();
	}
	
	notify(options) {
		if (this.controller.visible) {
			
			if (options.model==='MenuModel' && options.method==='fetched') {
				if (options.status === 200) {
					//console.log('MenuView => MenuModel fetched!');
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
		this.svgObject = document.getElementById('svg-object').contentDocument;
		if (typeof this.svgObject !== 'undefined') {
			
			//console.log("svgObject is now ready!");
			
			const hexA = this.svgObject.getElementById('hex-a');
			hexA.addEventListener("click", function(){
				console.log('HEXAGON A CLICKED!');
				self.model.setSelected('DA');
			}, false);
			hexA.addEventListener("mouseover", function(event){ self.setHoverEffect(event, 'scale(1.1)'); }, false);
			hexA.addEventListener("mouseout", function(event){ self.setHoverEffect(event, 'scale(1.0)'); }, false);
			
			const hexB = this.svgObject.getElementById('hex-b');
			hexB.addEventListener("click", function(){
				console.log('HEXAGON B CLICKED!');
			}, false);
			hexB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			hexB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const hexC = this.svgObject.getElementById('hex-c');
			hexC.addEventListener("click", function(){
				console.log('HEXAGON C CLICKED!');
			}, false);
			hexC.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			hexC.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const hexD = this.svgObject.getElementById('hex-d');
			hexD.addEventListener("click", function(){
				console.log('HEXAGON D CLICKED!');
			}, false);
			hexD.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			hexD.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			
			const hexE = this.svgObject.getElementById('hex-e');
			hexE.addEventListener("click", function(){
				console.log('HEXAGON E CLICKED!');
			}, false);
			hexE.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
			hexE.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
		}
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (typeof svgObject !== 'undefined') {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_d_a = LM['translation'][sel]['MENU_D_A_LABEL'];
			const localized_d_b = LM['translation'][sel]['MENU_D_B_LABEL'];
			const localized_d_c = LM['translation'][sel]['MENU_D_C_LABEL'];
			const localized_d_d = LM['translation'][sel]['MENU_D_D_LABEL'];
			const localized_d_e = LM['translation'][sel]['MENU_D_E_LABEL'];
			
			this.fillSVGTextElement(svgObject, 'district-a', localized_d_a);
			this.fillSVGTextElement(svgObject, 'district-b', localized_d_b);
			this.fillSVGTextElement(svgObject, 'district-c', localized_d_c);
			this.fillSVGTextElement(svgObject, 'district-d', localized_d_d);
			this.fillSVGTextElement(svgObject, 'district-e', localized_d_e);
		}
	}
	
	fillLocalizedTexts() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_title = LM['translation'][sel]['MENU_TITLE'];
		const localized_descr = LM['translation'][sel]['MENU_DESCRIPTION'];
		$('#menu-title').empty().append(localized_title);
		$('#menu-description').empty().append(localized_descr);
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.model.ready) {
			
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
				const mode = this.controller.master.modelRepo.get('ResizeObserverModel').mode;
				let svgFile, svgClass;
				if (mode === 'LANDSCAPE') {
					//console.log('LANDSCAPE');
					svgFile = './svg/menuLandscape.svg';
					svgClass = 'svg-landscape-container';
				} else if (mode === 'PORTRAIT') {
					//console.log('PORTRAIT');
					svgFile = './svg/menuPortrait.svg';
					svgClass = 'svg-portrait-container';
				} else {
					//console.log('SQUARE');
					svgFile = './svg/menuSquare.svg';
					svgClass = 'svg-square-container';
				}
				const LM = this.controller.master.modelRepo.get('LanguageModel');
				const html =
					'<div class="row">'+
						'<div class="col s12" style="background-color:#012265;">'+
							'<div class="flag-wrapper">'+
								'<img id="language-fi" class="flag" src="./img/flag_fi.png" />'+
								'<img id="language-en" class="flag" src="./img/flag_en_sel.png" />'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row" style="margin-top:-20px">'+
						'<div class="col s12" style="padding-left:0;padding-right:0;">'+
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
							'<h3 id="menu-title" style="color:#777"></h3>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<h5 id="menu-description" style="color:#777"></h5>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				this.fillLocalizedTexts();
				$('#language-'+LM.selected).addClass('selected');
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					//console.log('ADD SVG EVENT HANDLERS!');
					self.addSVGEventHandlers(mode);
					self.localizeSVGTexts();
					
					$("#language-fi").on('click',function(){
						if ($(this).hasClass('selected')) {
							//console.log('This is selected!');
						} else {
							// Select 'fi'
							$("#language-en").removeClass('selected');
							$("#language-fi").addClass('selected');
							LM.selected = 'fi';
							self.fillLocalizedTexts();
							self.localizeSVGTexts();
						}
					});
					$('#language-en').on('click',function(){
						if ($(this).hasClass('selected')) {
							//console.log('This is selected!');
						} else {
							// Select 'en'
							$("#language-fi").removeClass('selected');
							$("#language-en").addClass('selected');
							LM.selected = 'en';
							self.fillLocalizedTexts();
							self.localizeSVGTexts();
						}
					});
				});
			}
			
			this.rendered = true;
			
		} else {
			// this.el = '#content'
			//console.log('MenuView => render MenuModel IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
