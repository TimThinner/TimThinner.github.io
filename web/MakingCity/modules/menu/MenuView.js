import View from '../common/View.js';
/*
	
	
	
	
	<a href="http://makingcity.eu/" target="_blank" rel="noreferrer noopener" aria-label="This is an external link (opens in a new tab)">THE MAKING-CITY PROJECT</a>
	
	
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
	
	/*
	NOTE: transform is defined within style-attribute, NOT as SVG property!
	*/
	setHoverEffect(event, scale) {
		/*if (scale === 'scale(1.0)') {
			
			event.target.style.strokeWidth = 1;
			event.target.style.fillOpacity = 0.05;
		} else {
			
			event.target.style.strokeWidth = 3;
			event.target.style.fillOpacity = 0.5;
		}*/
		const oldtra = event.target.style.transform;
		//const oldtra = event.target.getAttributeNS(null,'transform');
		//console.log(['oldtra=',oldtra]);
		
		
		const index = oldtra.indexOf("scale"); // transform="translate(500,670) scale(1.1)" />
		const newtra = oldtra.slice(0, index) + scale;
		
		event.target.style.transform = newtra;
		//event.target.setAttributeNS(null,'transform',newtra);
	}
	
	setDashArrayLength(svgObject, path) {
		const p = svgObject.getElementById(path);
		if (p) {
			const len = p.getTotalLength();
			console.log(['len=',len]);
			//stroke-dasharray:700px 700px
			p.style.strokeDasharray = len+'px '+len+'px';
			const anim = svgObject.getElementById(path+'-animate');
			anim.setAttributeNS(null, 'from', len);
		} else {
			console.log('p is null!!!!!');
		}
	}
	
	setStroke(svgObject, path, strokeColor, strokeWidth) {
		const p = svgObject.getElementById(path);
		if (p) {
			p.style.stroke = strokeColor;
			p.style.strokeWidth = strokeWidth;
		} else {
			console.log('p is null!!!!!');
		}
	}
	
	addSVGInactiveUser() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const UB = svgObject.getElementById('user-button');
			if (UB) {
				// Draw the home:
				let coords = "M-50,50 L50,50"; // bottom ground
				coords += " M-40,50 L-40,-20 M40,-20 L40,50"; // house walls
				coords += " M-50,-10 L0,-50 L50,-10"; // roof
				coords += " M-40,-20 L-40,-50 L-20,-50 L-20,-35"; // chimney
				coords += " M-30,20 L-30,0 L-10,0 L-10,20 L-30,20 Z"; // window
				coords += " M0,50 L0,0 L30,0 L30,50 Z"; // door
				
				var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path.setAttributeNS(null, 'd', coords);
				path.setAttributeNS(null, 'class', 'inactive-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				
				var ph = svgObject.getElementById('before-buttons-placeholder');
				ph.appendChild(path);
			}
		}
	
	}
	
	addSVGUser() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const UB = svgObject.getElementById('user-button');
			if (UB) {
				//const cx = parseInt(UB.getAttributeNS(null,'cx'),10);
				//const cy = parseInt(UB.getAttributeNS(null,'cy'),10);
				const r = parseInt(UB.getAttributeNS(null,'r'),10);
				//console.log(['cx=',cx,' cy=',cy,' r=',r]);
				const r2 = r+10;
				const values = r + ';' + r2 + ';' + r;
				// <animate attributeName="r" begin="0s" dur="3s" repeatCount="indefinite" values="70;75;70" />
				const svgAnimateElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
				svgAnimateElement.setAttributeNS(null,'attributeName','r');
				svgAnimateElement.setAttributeNS(null,'begin','0s');
				svgAnimateElement.setAttributeNS(null,'dur','3s');
				svgAnimateElement.setAttributeNS(null,'repeatCount','indefinite');
				svgAnimateElement.setAttributeNS(null,'values',values);
				
				UB.appendChild(svgAnimateElement);
				
				UB.setAttributeNS(null,'class','active-district');
				UB.style.stroke = '#0a0';
				
				// Draw the home:
				let coords = "M-50,50 L50,50"; // bottom ground
				coords += " M-40,50 L-40,-20 M40,-20 L40,50"; // house walls
				coords += " M-50,-10 L0,-50 L50,-10"; // roof
				coords += " M-40,-20 L-40,-50 L-20,-50 L-20,-35"; // chimney
				coords += " M-30,20 L-30,0 L-10,0 L-10,20 L-30,20 Z" // window
				coords += " M0,50 L0,0 L30,0 L30,50 Z" // door
				
				var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path.setAttributeNS(null, 'd', coords);
				path.setAttributeNS(null, 'class', 'active-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				
				var ph = svgObject.getElementById('before-buttons-placeholder');
				ph.appendChild(path);
				UB.addEventListener("click", function(){
					
					self.models['MenuModel'].setSelected('USERHOME');
					
				}, false);
				UB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				UB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
		}
	}
	
	addSVGSolarPanel() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const UB = svgObject.getElementById('solar-button');
			if (UB) {
				//const cx = parseInt(UB.getAttributeNS(null,'cx'),10);
				//const cy = parseInt(UB.getAttributeNS(null,'cy'),10);
				const r = parseInt(UB.getAttributeNS(null,'r'),10);
				//console.log(['cx=',cx,' cy=',cy,' r=',r]);
				const r2 = r+10;
				const values = r + ';' + r2 + ';' + r;
				// <animate attributeName="r" begin="0s" dur="3s" repeatCount="indefinite" values="70;75;70" />
				const svgAnimateElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
				svgAnimateElement.setAttributeNS(null,'attributeName','r');
				svgAnimateElement.setAttributeNS(null,'begin','0s');
				svgAnimateElement.setAttributeNS(null,'dur','3s');
				svgAnimateElement.setAttributeNS(null,'repeatCount','indefinite');
				svgAnimateElement.setAttributeNS(null,'values',values);
				UB.appendChild(svgAnimateElement);
				
				UB.setAttributeNS(null,'class','active-district');
				UB.style.stroke = '#0a0';
				
				// Draw the sun and solarpanel:
				/*var sun = document.createElementNS('http://www.w3.org/2000/svg', "circle");
				sun.setAttributeNS(null, 'cx', -40);
				sun.setAttributeNS(null, 'cy', -60);
				sun.setAttributeNS(null, 'r', 20);
				sun.setAttributeNS(null, 'stroke', '#f80');
				sun.setAttributeNS(null, 'fill', '#ff0');
				sun.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				
				var ph = svgObject.getElementById('before-buttons-placeholder');
				ph.appendChild(sun);
				*/
				
				var ph = svgObject.getElementById('before-buttons-placeholder');
				
				// Draw the solar-panel:
				let coords_1 = "M-50,20 L-20,-40 L50,-40 L20,20 L-50,20 Z";
				var path_1 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_1.setAttributeNS(null, 'd', coords_1);
				path_1.setAttributeNS(null, 'class', 'active-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path_1.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_1);
				
				let coords_2 = "M-25,45 L-10,25 L5,45 L-25,45 Z";
				var path_2 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_2.setAttributeNS(null, 'd', coords_2);
				path_2.setAttributeNS(null, 'class', 'active-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path_2.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_2);
				
				let coords_3 = "M-40,15 L-15,-35 L-5,-35 L-30,15 L-40,15 Z";
				var path_3 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_3.setAttributeNS(null, 'd', coords_3);
				path_3.setAttributeNS(null, 'class', 'panel'); // NOTE: styles for this class are defined in SVG files!
				path_3.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_3);
				
				let coords_4 = "M-25,15 L0,-35 L10,-35 L-15,15 L-25,15 Z";
				var path_4 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_4.setAttributeNS(null, 'd', coords_4);
				path_4.setAttributeNS(null, 'class', 'panel'); // NOTE: styles for this class are defined in SVG files!
				path_4.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_4);
				
				let coords_5 = "M-10,15 L15,-35 L25,-35 L0,15 L-10,15 Z";
				var path_5 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_5.setAttributeNS(null, 'd', coords_5);
				path_5.setAttributeNS(null, 'class', 'panel'); // NOTE: styles for this class are defined in SVG files!
				path_5.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_5);
				
				let coords_6 = "M5,15 L30,-35 L40,-35 L15,15 L5,15 Z";
				var path_6 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_6.setAttributeNS(null, 'd', coords_6);
				path_6.setAttributeNS(null, 'class', 'panel'); // NOTE: styles for this class are defined in SVG files!
				path_6.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_6);
				
				UB.addEventListener("click", function(){
					
					self.models['MenuModel'].setSelected('SOLARPAGE');
					
				}, false);
				UB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				UB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
		}
	}
	
	addSVGGrid() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const UB = svgObject.getElementById('grid-button');
			if (UB) {
				
				// Make the circle beat!
				const r = parseInt(UB.getAttributeNS(null,'r'),10);
				const r2 = r+10;
				const values = r + ';' + r2 + ';' + r;
				// <animate attributeName="r" begin="0s" dur="3s" repeatCount="indefinite" values="70;75;70" />
				const svgAnimateElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
				svgAnimateElement.setAttributeNS(null,'attributeName','r');
				svgAnimateElement.setAttributeNS(null,'begin','0s');
				svgAnimateElement.setAttributeNS(null,'dur','3s');
				svgAnimateElement.setAttributeNS(null,'repeatCount','indefinite');
				svgAnimateElement.setAttributeNS(null,'values',values);
				UB.appendChild(svgAnimateElement);
				
				UB.setAttributeNS(null,'class','active-district');
				UB.style.stroke = '#0a0';
				
				var ph = svgObject.getElementById('before-buttons-placeholder');
				
				// Draw the grid:
				let coords_1 = "M-40,50 L-20,20 L-20,-50 L20,-50 L20,20 L40,50 L-20,20 L20,20 L-40,50 Z";
				var path_1 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_1.setAttributeNS(null, 'd', coords_1);
				path_1.setAttributeNS(null, 'class', 'active-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path_1.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_1);
				
				let coords_2 = "M-40,-40 L-20,-50 L20,-50 L40,-40 L-40,-40 L-40,-30 M40,-40 L40,-30";
				var path_2 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_2.setAttributeNS(null, 'd', coords_2);
				path_2.setAttributeNS(null, 'class', 'active-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path_2.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_2);
				
				let coords_3 = "M-40,-10 L-20,-20 L20,-20 L40,-10 L-40,-10 L-40,0 M40,-10 L40,0";
				var path_3 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_3.setAttributeNS(null, 'd', coords_3);
				path_3.setAttributeNS(null, 'class', 'active-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path_3.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_3);
				
				
				UB.addEventListener("click", function(){
					
					self.models['MenuModel'].setSelected('GRID');
					
				}, false);
				UB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				UB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
		}
	}
	
	addSVGLeaf() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const UB = svgObject.getElementById('comp-button');
			if (UB) {
				
				// Make the circle beat!
				const r = parseInt(UB.getAttributeNS(null,'r'),10);
				const r2 = r+10;
				const values = r + ';' + r2 + ';' + r;
				// <animate attributeName="r" begin="0s" dur="3s" repeatCount="indefinite" values="70;75;70" />
				const svgAnimateElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
				svgAnimateElement.setAttributeNS(null,'attributeName','r');
				svgAnimateElement.setAttributeNS(null,'begin','0s');
				svgAnimateElement.setAttributeNS(null,'dur','3s');
				svgAnimateElement.setAttributeNS(null,'repeatCount','indefinite');
				svgAnimateElement.setAttributeNS(null,'values',values);
				UB.appendChild(svgAnimateElement);
				
				UB.setAttributeNS(null,'class','active-district');
				UB.style.stroke = '#0a0';
				
				var ph = svgObject.getElementById('before-buttons-placeholder');
				
				// Draw the LEAF:
				// C x1 y1, x2 y2, x y 
				// The last set of coordinates here (x,y) specify where the line should end. 
				// The other two are control points. (x1,y1) is the control point for the start of the curve, 
				// and (x2,y2) is the control point for the end. 
				
				let coords_1 = "M-40,40 C0,30 30,0 30,-50 C20,-20 -10,-30 -30,-20 S-50,20 -25,25 M30,-50 C40,20 20,50 -5,35";
				var path_1 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_1.setAttributeNS(null, 'd', coords_1);
				path_1.setAttributeNS(null, 'class', 'active-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path_1.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_1);
				
				let coords_2 = "M-37,43 C0,30 30,0 30,-50";
				var path_2 = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path_2.setAttributeNS(null, 'd', coords_2);
				path_2.setAttributeNS(null, 'class', 'active-menu-button-path'); // NOTE: styles for this class are defined in SVG files!
				path_2.style.transform = UB.style.transform; // Use same transform as "parent" circle!
				ph.appendChild(path_2);
				
				UB.addEventListener("click", function(){
					
					self.models['MenuModel'].setSelected('ENVIRONMENTPAGE');
					
				}, false);
				UB.addEventListener("mouseover", function(event){ self.setHoverEffect(event,'scale(1.1)'); }, false);
				UB.addEventListener("mouseout", function(event){ self.setHoverEffect(event,'scale(1.0)'); }, false);
			}
		}
	}
	
	addSVGEventHandlers(mode) {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			const hexA = svgObject.getElementById('district');
			hexA.addEventListener("click", function(){
				
				self.models['MenuModel'].setSelected('D');
				
			}, false);
			
			const OD = svgObject.getElementById('outer-district');
			hexA.addEventListener("mouseover", function(event){
				const scale ='scale(1.1)';
				event.target.setAttributeNS(null,'transform',scale);
				if (OD) {
					OD.setAttributeNS(null,'transform',scale);
				}
			}, false);
			hexA.addEventListener("mouseout", function(event){ 
				const scale ='scale(1.0)';
				event.target.setAttributeNS(null,'transform',scale);
				if (OD) {
					OD.setAttributeNS(null,'transform',scale);
				}
			}, false);
/*
Animated line drawing in SVG:
http://bkaprt.com/psvg/07-17/
http://bkaprt.com/psvg/07-18/
NOTE: Values stroke-dasharray set to 0px 0px and animate from to 0 in SVG-file.
These are filled with correct values in here:
*/
			/*const path = svgObject.getElementById('first-building-path');
			var len = path.getTotalLength();
			console.log(['len=',len]);
			//stroke-dasharray:700px 700px
			path.style.strokeDasharray = len+'px '+len+'px';
			const anim = svgObject.getElementById('first-building-path-animate');
			anim.setAttributeNS(null, 'from', len);
			
			first  = #51b0ce
			second = #73d3ae
			third  = #1fac78
			*/
			
			this.setDashArrayLength(svgObject, 'first-building-path');
			this.setDashArrayLength(svgObject, 'second-building-path');
			this.setDashArrayLength(svgObject, 'third-building-path');
			
			setTimeout(() => { 
				this.setStroke(svgObject, 'first-painting-path', '#51b0ce', '10px');
				this.setStroke(svgObject, 'second-painting-path', '#73d3ae', '10px');
				this.setStroke(svgObject, 'third-painting-path', '#1fac78', '10px');
			}, 1000);
			//this.setDashArrayLength(svgObject, 'first-painting-path');
			//this.setDashArrayLength(svgObject, 'second-painting-path');
			//this.setDashArrayLength(svgObject, 'third-painting-path');
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
	
	
	/*
		menuLandscape.svg		"1800"	"900"		"-900 -500 1800 900"
		menuSquare.svg			"1000"	"900"		"-500 -500 1000 900"
		menuPortrait.svg		"600"	"900"		"-300 -500 600 900"
	*/
	adjustViewBox() {
		const width  = this.controller.master.modelRepo.get('ResizeEventObserver').width;
		const height = this.controller.master.modelRepo.get('ResizeEventObserver').height;
		console.log(['width=',width,' height=',height]);
		
		const svgObject = document.getElementById('svg-object').contentDocument;
		
		
		const svgWidth  = svgObject.activeElement.getAttribute('width');
		const svgHeight = svgObject.activeElement.getAttribute('height');
		const viewBox = svgObject.activeElement.getAttribute('viewBox');
		console.log(['svgWidth=',svgWidth,' svgHeight=',svgHeight,' viewBox=',viewBox]);
		let aa = viewBox.split(/\s+|,/);
		console.log(['aa=',aa]);
		const H = height+200;
		aa[3] = H.toString();
		console.log(['new H=',aa[3]]);
		
		//svgObject.activeElement.setAttribute('height',aa[3]);
		//svgObject.activeElement.setAttribute('viewBox',aa.join(' '));
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
		
		let filename = 'userInActive.svg';
		if (USER_MODEL.isLoggedIn()) {
			filename = 'userActive.svg';
		}
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const html =
			'<div class="row">'+
				'<div class="col s12 menu-view-top-bar">'+
					'<img id="user-auth" class="user" src="./svg/'+filename+'" />'+
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
				'<div class="col s12 center">'+
					'<p id="menu-description" style="color:#777"></p>'+
				'</div>'+
				'<div class="col s12 center">'+
					'<a href="http://makingcity.eu/" target="_blank" rel="noreferrer noopener" aria-label="This is an external link (opens in a new tab)">'+
					'<img src="./img/MC_flag.png" class="mc-logo" />'+
					'</a>'+
					'<img src="./img/640px-Flag_of_Europe.svg.png" class="mc-logo" />'+
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
			if (USER_MODEL.isLoggedIn()) {
				self.addSVGUser();
			} else {
				self.addSVGInactiveUser();
			}
			
			self.addSVGSolarPanel();
			self.addSVGGrid();
			self.addSVGLeaf();
			
			
			self.adjustViewBox();
			
			
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
