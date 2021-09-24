import View from '../common/View.js';

export default class MenuView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
			
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
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			console.log('LOCALIZE TEXTS!');
			//const LM = this.controller.master.modelRepo.get('LanguageModel');
			//const sel = LM.selected;
			
			//const localized_grid_title = LM['translation'][sel]['DAA_TITLE'];
			//this.fillSVGTextElement(svgObject, 'a-title', 'A');
			//this.fillSVGTextElement(svgObject, 'b-title', 'B');
		}
	}
	
	setLanguageSelection(sel) {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			if (sel === 'fi') {
				const lang_en_bg = svgObject.getElementById('language-en-background');
				if (lang_en_bg) {
					lang_en_bg.style.fill = '#eee'; // Set fill to #eee
					lang_en_bg.style.stroke = '#1a488b'; // Set stroke to #aaa
					lang_en_bg.style.strokeWidth = 1;
				}
				const lang_fi_bg = svgObject.getElementById('language-fi-background');
				if (lang_fi_bg) {
					lang_fi_bg.style.fill = '#fff'; // Set fill to #fff
					lang_fi_bg.style.stroke = '#78c51b'; // Set stroke to light green
					lang_fi_bg.style.strokeWidth = 3;
				}
			} else {
				const lang_fi_bg = svgObject.getElementById('language-fi-background');
				if (lang_fi_bg) {
					lang_fi_bg.style.fill = '#eee'; // Set fill to #eee
					lang_fi_bg.style.stroke = '#1a488b'; // Set stroke to #aaa
					lang_fi_bg.style.strokeWidth = 1;
				}
				const lang_en_bg = svgObject.getElementById('language-en-background');
				if (lang_en_bg) {
					lang_en_bg.style.fill = '#fff'; // Set fill to #fff
					lang_en_bg.style.stroke = '#78c51b'; // Set stroke to light green
					lang_en_bg.style.strokeWidth = 3;
				}
			}
		}
	}
	
	addSVGEventHandlers() {
		const self = this;
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		/*const STROKE_COLOR = '#1a488b';
		const STROKE_COLOR_HOVER = '#0f0';*/
		const FILL_COLOR = '#fff';
		const FILL_COLOR_HOVER = '#0f0';
/*
iFLEX Dark blue   #1a488b ( 26,  72, 139)
iFLEX Dark green  #008245 (  0, 130,  69)
iFLEX Light green #78c51b (120, 197,  27)
*/
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const lang_fi = svgObject.getElementById('language-fi');
			lang_fi.addEventListener("click", function(){
				if (LM.selected !== 'fi') {
					const lang_en_bg = svgObject.getElementById('language-en-background');
					if (lang_en_bg) {
						lang_en_bg.style.fill = '#eee'; // Set fill to #eee
						lang_en_bg.style.stroke = '#1a488b'; // Stroke Dark Blue
						lang_en_bg.style.strokeWidth = 1;
					}
					const lang_fi_bg = svgObject.getElementById('language-fi-background');
					if (lang_fi_bg) {
						lang_fi_bg.style.fill = '#fff'; // Set fill to #fff
						lang_fi_bg.style.stroke = '#78c51b'; // Set stroke to light green
						lang_fi_bg.style.strokeWidth = 3;
					}
					LM.selected = 'fi';
					self.localizeSVGTexts();
				}
			}, false);
			
			const lang_en = svgObject.getElementById('language-en');
			lang_en.addEventListener("click", function(){
				if (LM.selected !== 'en') {
					const lang_fi_bg = svgObject.getElementById('language-fi-background');
					if (lang_fi_bg) {
						lang_fi_bg.style.fill = '#eee'; // Set fill to #eee
						lang_fi_bg.style.stroke = '#1a488b'; // Stroke Dark Blue
						lang_fi_bg.style.strokeWidth = 1;
					}
					const lang_en_bg = svgObject.getElementById('language-en-background');
					if (lang_en_bg) {
						lang_en_bg.style.fill = '#fff'; // Set fill to #fff
						lang_en_bg.style.stroke = '#78c51b'; // Set stroke to light green
						lang_en_bg.style.strokeWidth = 3;
					}
					LM.selected = 'en';
					self.localizeSVGTexts();
				}
			}, false);
			
			const targetA = svgObject.getElementById('target-a');
			targetA.addEventListener("click", function(){
				
				self.models['MenuModel'].setSelected('A');
				
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
				
				self.models['MenuModel'].setSelected('B');
				
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
				
				self.models['MenuModel'].setSelected('C');
				
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
				
				self.models['MenuModel'].setSelected('D');
				
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
	
	/*
	
	LANDSCAPE:
	<circle id="target-e-border" cx="0" cy="0" r="100" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
	<circle cx="0" cy="0" r="90" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
	<circle cx="0" cy="0" r="60" stroke="#1a488b" stroke-width="0.5" opacity="1" fill="#fff" />
	<image x="-50" y="-37.5" width="100" height="75" xlink:href="user.svg" />
	<circle id="target-e" class="surface" x="0" y="0" r="100" />
	
	SQUARE:
	<circle id="target-e-border" cx="0" cy="0" r="100" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
	<circle cx="0" cy="0" r="90" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
	<circle cx="0" cy="0" r="60" stroke="#1a488b" stroke-width="0.5" opacity="1" fill="#fff" />
	<image x="-50" y="-37.5" width="100" height="75" xlink:href="user.svg" />
	<circle id="target-e" class="surface" x="0" y="0" r="100" />
	
	PORTRAIT:
	<circle id="target-e-border" cx="0" cy="0" r="90" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
	<circle cx="0" cy="0" r="80" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
	<circle cx="0" cy="0" r="60" stroke="#1a488b" stroke-width="0.5" opacity="1" fill="#fff" />
	<image x="-50" y="-37.5" width="100" height="75" xlink:href="user.svg" />
	<circle id="target-e" class="surface" x="0" y="0" r="100" />
	*/
	
	generateUserSVG(svgObject, UBW, radius, state) {
		const self = this;
		
		/*
		iFLEX Dark blue   #1a488b ( 26,  72, 139)
		iFLEX Dark green  #008245 (  0, 130,  69)
		iFLEX Light green #78c51b (120, 197,  27)
		*/
		
		const FILL_COLOR = '#fff';
		const FILL_COLOR_HOVER = '#0f0';
		
		let STROKE_COLOR_USER_PATH = '#aaa';
		let FILL_COLOR_USER_PATH = '#ccc';
		let STROKE_COLOR_USER_HEAD = '#aaa';
		let FILL_COLOR_USER_HEAD = '#fff';
		
		if (state === 'in') {
			STROKE_COLOR_USER_PATH = '#008245';
			FILL_COLOR_USER_PATH = '#78c51b';
			STROKE_COLOR_USER_HEAD = '#008245';
			FILL_COLOR_USER_HEAD = '#fff'//'#78c51b';
		}
		
		//<circle id="target-e-border" cx="0" cy="0" r="100" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
		const uc = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		uc.setAttributeNS(null, 'id', 'target-e-border');
		uc.setAttributeNS(null, 'cx', 0);
		uc.setAttributeNS(null, 'cy', 0);
		uc.setAttributeNS(null, 'r', radius);
		uc.setAttributeNS(null, 'stroke', '#1a488b');
		uc.setAttributeNS(null, 'stroke-width', 2);
		uc.setAttributeNS(null, 'fill', '#fff');
		uc.setAttributeNS(null, 'opacity', 0.5);
		UBW.appendChild(uc);
		
		//	<circle cx="0" cy="0" r="80" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
		const uc2 = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		uc2.setAttributeNS(null, 'cx', 0);
		uc2.setAttributeNS(null, 'cy', 0);
		uc2.setAttributeNS(null, 'r', radius-10);
		uc2.setAttributeNS(null, 'stroke', '#1a488b');
		uc2.setAttributeNS(null, 'stroke-width', 2);
		uc2.setAttributeNS(null, 'fill', '#fff');
		uc2.setAttributeNS(null, 'opacity', 0.5);
		UBW.appendChild(uc2);
		
		//	<circle cx="0" cy="0" r="60" stroke="#1a488b" stroke-width="0.5" opacity="1" fill="#fff" />
		const uc3 = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		uc3.setAttributeNS(null, 'cx', 0);
		uc3.setAttributeNS(null, 'cy', 0);
		uc3.setAttributeNS(null, 'r', 60);
		uc3.setAttributeNS(null, 'stroke', '#1a488b');
		uc3.setAttributeNS(null, 'stroke-width', 0.5);
		uc3.setAttributeNS(null, 'fill', '#fff');
		uc3.setAttributeNS(null, 'opacity', 1);
		UBW.appendChild(uc3);
		
		
		//<path d="M-150,150 A150,150 0 0,1 150,150 Z" style="stroke:#aaa;stroke-width:12;fill:#ccc;opacity:1;" />
		//<circle cx="0" cy="-60" r="80" style="stroke:#aaa;stroke-width:10;fill:#fff;opacity:1;"/>
		const d = "M-150,140 A150,150 0 0,1 150,140 Z";
		const path = document.createElementNS('http://www.w3.org/2000/svg', "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = STROKE_COLOR_USER_PATH;
		path.style.strokeWidth = '14';
		path.style.fill = FILL_COLOR_USER_PATH;
		path.style.opacity = '1';
		path.style.transform = 'scale(0.25,0.25)';
		UBW.appendChild(path);
		
		const head = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		head.setAttributeNS(null, 'cx', 0);
		head.setAttributeNS(null, 'cy', -90);
		head.setAttributeNS(null, 'r', 80);
		head.setAttributeNS(null, 'stroke', STROKE_COLOR_USER_HEAD);
		head.setAttributeNS(null, 'stroke-width', 12);
		head.setAttributeNS(null, 'fill', FILL_COLOR_USER_HEAD);
		head.setAttributeNS(null, 'opacity', 1);
		head.style.transform = 'scale(0.25,0.25)';
		UBW.appendChild(head);
		
		
		// Smile
		//<path d="M-40,-50 A50,50,0,0,0,40,-50" style="stroke:#008245;stroke-width:6;fill:none;opacity:1;" />
		// eyes
		//<circle cx="-30" cy="-80" r="7" style="stroke:#008245;stroke-width:3;fill:#008245;opacity:1;"/>
		//<circle cx="30" cy="-80" r="7" style="stroke:#008245;stroke-width:3;fill:#008245;opacity:1;"/>
		if (state === 'in') {
			const d_smile = "M-40,-60 A50,50,0,0,0,40,-60";
			const path_smile = document.createElementNS('http://www.w3.org/2000/svg', "path");
			path_smile.setAttributeNS(null, 'd', d_smile);
			path_smile.style.stroke = STROKE_COLOR_USER_PATH;
			path_smile.style.strokeWidth = '10';
			path_smile.style.fill = 'none';
			path_smile.style.transform = 'scale(0.25,0.25)';
			UBW.appendChild(path_smile);
			
			const leye = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			leye.setAttributeNS(null, 'cx', -30);
			leye.setAttributeNS(null, 'cy', -100);
			leye.setAttributeNS(null, 'r', 10);
			leye.setAttributeNS(null, 'stroke', STROKE_COLOR_USER_HEAD);
			leye.setAttributeNS(null, 'stroke-width', 3);
			leye.setAttributeNS(null, 'fill', STROKE_COLOR_USER_HEAD);
			leye.style.transform = 'scale(0.25,0.25)';
			UBW.appendChild(leye);
			const reye = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			reye.setAttributeNS(null, 'cx', 30);
			reye.setAttributeNS(null, 'cy', -100);
			reye.setAttributeNS(null, 'r', 10);
			reye.setAttributeNS(null, 'stroke', STROKE_COLOR_USER_HEAD);
			reye.setAttributeNS(null, 'stroke-width', 3);
			reye.setAttributeNS(null, 'fill', STROKE_COLOR_USER_HEAD);
			reye.style.transform = 'scale(0.25,0.25)';
			UBW.appendChild(reye);
		}
		
		//<circle id="target-e" class="surface" x="0" y="0" r="100" />
		const uc4 = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		uc4.setAttributeNS(null, 'id', 'target-e');
		uc4.setAttributeNS(null, 'cx', 0);
		uc4.setAttributeNS(null, 'cy', 0);
		uc4.setAttributeNS(null, 'r', 100);
		//uc4.setAttributeNS(null, 'class', 'surface');
		//cursor: pointer;
		//fill: #000;
		//fill-opacity: 0;
		uc4.style.cursor = 'pointer';
		uc4.style.fill = '#000';
		uc4.style.fillOpacity = 0;
		UBW.appendChild(uc4);
		
		const targetE = svgObject.getElementById('target-e');
		targetE.addEventListener("click", function(){
			
			if (state === 'out') {
				self.models['MenuModel'].setSelected('userlogin');
			} else {
				self.models['MenuModel'].setSelected('USERPAGE');
			}
			
		}, false);
		targetE.addEventListener("mouseover", function(event){ 
			//svgObject.getElementById('target-e-border').style.stroke = STROKE_COLOR_HOVER;
			svgObject.getElementById('target-e-border').style.fill = FILL_COLOR_HOVER;
		}, false);
		targetE.addEventListener("mouseout", function(event){ 
			//svgObject.getElementById('target-e-border').style.stroke = STROKE_COLOR;
			svgObject.getElementById('target-e-border').style.fill = FILL_COLOR;
		}, false);
	}
	
	addSVGUser(radius, state) {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const UBW = svgObject.getElementById('user-button-wrapper');
			if (UBW) {
				this.generateUserSVG(svgObject, UBW, radius, state);
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
		let radius = 100;
		
		let svgFile, svgClass;
		if (mode === 'LANDSCAPE') {
			svgFile = './svg/menuL.svg';
			svgClass = 'svg-landscape-container';
			
		} else if (mode === 'PORTRAIT') {
			svgFile = './svg/menuP.svg';
			svgClass = 'svg-portrait-container';
			radius = 90;
		} else {
			svgFile = './svg/menuS.svg';
			svgClass = 'svg-square-container';
		}
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const html =
			'<div class="row">'+ // style="margin-top:-20px">'+
				'<div class="col s12" style="padding-left:0;padding-right:0;">'+
					'<div class="'+svgClass+'">'+
						'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
					'</div>'+
				'</div>'+
			'</div>';
			//'<div class="row">'+
			//	'<div class="col s12 center">'+
			//		'<h4>Info</h4>'+
			//		'<p>Here we can put some information about this page.</p>'+
			//	'</div>'+
			//'</div>';
		$(html).appendTo(this.el);
		
		// AND WAIT for SVG object to fully load, before assigning event handlers!
		const svgObj = document.getElementById("svg-object");
		svgObj.addEventListener('load', function(){
			console.log('ADD SVG EVENT HANDLERS!');
			
			self.setLanguageSelection(LM.selected);
			self.addSVGEventHandlers();
			self.localizeSVGTexts();
			
			if (USER_MODEL.isLoggedIn()) {
				console.log('User is Logged in.');
				self.addSVGUser(radius, 'in'); // We use a little bit smaller "button" for PORTRAIT mode. 
			} else {
				console.log('User is NOT Logged in.');
				self.addSVGUser(radius, 'out'); // We use a little bit smaller "button" for PORTRAIT mode. 
			}
			
		});
		this.rendered = true;
	}
}
