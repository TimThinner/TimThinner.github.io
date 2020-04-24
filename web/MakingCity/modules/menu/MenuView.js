import View from '../common/View.js';
/*
	Tenant UI: 
*/
export default class MenuView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'MenuModel') {
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
				console.log("MenuView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
		}
	}
	
	setHoverEffect(event, scale){
		if (scale === 'scale(1.0)') {
			event.target.style.strokeWidth = 5;
			event.target.style.stroke = '#ccc';
			//event.target.style.fillOpacity = 0.05;
		} else {
			event.target.style.strokeWidth = 5;
			event.target.style.stroke = '#aaa';
			//event.target.style.fillOpacity = 0.2;
		}
		event.target.setAttributeNS(null,'transform',scale);
	}
	
	addSVGEventHandlers(mode) {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const hexA = svgObject.getElementById('district');
			hexA.addEventListener("click", function(){
				
				self.models['MenuModel'].setSelected('D');
				
			}, false);
			hexA.addEventListener("mouseover", function(event){ self.setHoverEffect(event, 'scale(1.1)'); }, false);
			hexA.addEventListener("mouseout", function(event){ self.setHoverEffect(event, 'scale(1.0)'); }, false);
			
/*
Animated line drawing in SVG:
http://bkaprt.com/psvg/07-17/
http://bkaprt.com/psvg/07-18/
NOTE: Values stroke-dasharray set to 0px 0px and animate from to 0 in SVG-file.
These are filled with correct values in here:
*/
			const path = svgObject.getElementById('first-building-path');
			if (path) {
				var len = path.getTotalLength();
				console.log(['len=',len]);
				//stroke-dasharray:700px 700px
				path.style.strokeDasharray = len+'px '+len+'px';
				const anim = svgObject.getElementById('first-building-path-animate');
				anim.setAttributeNS(null, 'from', len);
			} else {
				console.log('path is null!!!!!');
			}
		}
	}
	
	/*
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
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
	*/
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
		
		const USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
		
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
		
		let filename = 'user_grey.png';
		if (USER_MODEL.isLoggedIn()) {
			filename = 'user_color.png';
		}
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const html =
			'<div class="row">'+
				'<div class="col s12 menu-view-top-bar">'+
					'<img id="user-auth" class="user" src="./img/'+filename+'" />'+
					'<img id="language-fi" class="flag" src="./img/flag_fi.png" />'+
					'<img id="language-en" class="flag" src="./img/flag_en.png" />'+
				'</div>'+
			'</div>'+
			'<div class="row" style="margin-top:-20px">'+
				'<div class="col s12" style="padding-left:0;padding-right:0;">'+
					'<div class="'+svgClass+'">'+
						'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
					'</div>'+
				'</div>'+
			'</div>'+
			//'<div class="row">'+
			//	'<div class="col s12 center" id="menu-view-failure"></div>'+
			//'</div>'+
			'<div class="row mc-footer">'+
				'<div class="col s12 m7 center">'+
					'<p id="menu-description" style="color:#777"></p>'+
				'</div>'+
				'<div class="col s12 m5">'+
					'<img src="./img/640px-Flag_of_Europe.svg.png" class="mc-logo" />'+
					'<img src="./img/MC.png" class="mc-logo" />'+
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
			//self.localizeSVGTexts();
			
			
			$("#language-fi").on('click',function(){
				if ($(this).hasClass('selected')) {
					//console.log('This is selected!');
				} else {
					// Select 'fi'
					$("#language-en").removeClass('selected');
					$("#language-fi").addClass('selected');
					LM.selected = 'fi';
					self.fillLocalizedTexts();
					//self.localizeSVGTexts();
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
					//self.localizeSVGTexts();
				}
			});
			$('#user-auth').on('click',function(){
				if (USER_MODEL.isLoggedIn()) {
					// User is logged in already => Show user info!
					self.models['MenuModel'].setSelected('userinfo');
				} else {
					self.models['MenuModel'].setSelected('userlogin');
				}
			});
		});
		this.rendered = true;
	}
}
