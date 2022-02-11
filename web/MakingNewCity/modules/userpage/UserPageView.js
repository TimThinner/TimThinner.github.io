/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		// Start listening notify -messages from ResizeEventObserver:
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
				console.log("UserPageView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.show();
			}
		}
	}
	
	/*
	The radius of circle is 12,5% of H or W (smaller dimension).
	=> circle diameter is 25% of H or W.
	*/
	sunRadius() {
		const w = this.REO.width;
		const h = this.REO.height;
		const wp2 = w*0.125;
		const hp2 = h*0.125;
		const r = Math.min(wp2, hp2); // r = 0,125 x W or H, whichever is smallest (d=0,25 x W or H)
		return r;
	}
	
	appendConnector(group, corner, endpoint, pos) {
		const svgNS = 'http://www.w3.org/2000/svg';
		//const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const DARKGREEN = '#1fac78';
		
		let d, cx, cy;
		if (pos === 0) {
			d = 'M-'+corner+','+corner+' L-'+endpoint+','+endpoint;
			cx = -corner;
			cy = corner;
		} else if (pos === 1) {
			d = 'M-'+corner+',-'+corner+' L-'+endpoint+',-'+endpoint;
			cx = -corner;
			cy = -corner;
		} else if (pos === 2) {
			d = 'M'+corner+',-'+corner+' L'+endpoint+',-'+endpoint;
			cx = corner;
			cy = -corner;
		} else if (pos === 3) {
			d = 'M'+corner+','+corner+' L'+endpoint+','+endpoint;
			cx = corner;
			cy = corner;
		} else {
			d = 'M0,'+corner+' L0,'+endpoint;
			cx = 0;
			cy = corner;
		}
		
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = DARKGREEN;
		path.style.strokeWidth = 2;
		path.style.opacity = 0.5;
		path.style.fill = 'none';
		//$('#space').append(path);
		group.appendChild(path);
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', cx);
		c.setAttributeNS(null, 'cy', cy);
		c.setAttributeNS(null, 'r', 3);
		c.style.stroke = DARKGREEN;
		c.style.strokeWidth = 2;
		c.style.opacity = 0.5;
		c.style.fill = DARKGREEN;
		//$('#space').append(c);
		group.appendChild(c);
	}
	
	createSpace() {
		//$('html').css('background-color','#012265');
		//$('body').css('background-color','#012265');
		//$('.container').css('background-color','#012265');
		const w = this.REO.width;
		const h = this.REO.height;
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const vb = '-'+wp2+' -'+hp2+' '+w+' '+h;
		
		const svgNS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(svgNS, "svg");
		
		svg.setAttributeNS(null,'width',w);
		svg.setAttributeNS(null,'height',h);
		svg.setAttributeNS(null,'viewBox',vb);
		svg.id = 'space';
		
		/*
			#e0f2f1 teal lighten-5
			#b2dfdb teal lighten-4
			#80cbc4 teal lighten-3
		*/
		// Store an array of stop information for the gradient
		var stops = [
			{"color":"#e0f2f1","offset": "5%"},
			{"color":"#b2dfdb","offset": "40%"},
			{"color":"#80cbc4","offset": "90%"}
		];
		const defs = document.createElementNS(svgNS, 'defs');
		const gradient = document.createElementNS(svgNS, 'radialGradient');
		const rect = document.createElementNS(svgNS, 'rect');
		
		// Parses an array of stop information and appends <stop> elements to the gradient
		for (let i=0, length=stops.length; i < length; i++) {
			// Create a <stop> element and set its offset based on the position of the for loop.
			var stop = document.createElementNS(svgNS, 'stop');
			stop.setAttribute('offset', stops[i].offset);
			stop.setAttribute('stop-color', stops[i].color);
			// Add the stop to the gradient element.
			gradient.appendChild(stop);
		}
		// Apply the gradient to <defs>
		gradient.id = 'grad';
		gradient.setAttribute('cx', '50%');
		gradient.setAttribute('cy', '50%');
		gradient.setAttribute('r', '100%');
		defs.appendChild(gradient);
		
		// Setup the <rect> element.
		rect.setAttribute('x',-wp2);
		rect.setAttribute('y',-hp2);
		rect.setAttribute('width',w);
		rect.setAttribute('height',h);
		rect.setAttribute('fill', 'url(#grad)');
		
		svg.appendChild(defs);
		svg.appendChild(rect);
		
		$(this.el).append(svg);
	}
	
	appendLogo() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const w = this.REO.width;
		const h = this.REO.height;
		
		const FILLCOLOR = '#777';
		const STROKECOLOR = '#777';
		/*
		Screen Sizes (in Materialize CSS)
		Mobile Devices		Tablet Devices		Desktop Devices		Large Desktop Devices
		<= 600px 			> 600px 			> 992px 				> 1200px
		*/
		let fontsize;
		if (w <= 600) {
			console.log('Mobile Device.');
			fontsize = 36; // big font 36, small font 12
			
		} else if (w > 600 && w <= 992) {
			console.log('Tablet Device.');
			fontsize = 42; // big font 42, small font 14
			
		} else if (w > 992 && w <= 1200) {
			console.log('Desktop Device.');
			fontsize = 54; // big font 54, small font 18
			
		} else {
			console.log('Large Desktop Device.');
			fontsize = 72; // big font 72, small font 24
		}
		const bw = w;
		const bh = fontsize+fontsize*0.5;
		const bx = -w*0.5;
		const by = -h*0.5+fontsize*0.25;
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.id = 'logo-svg';
		svg.setAttribute('x',bx);
		svg.setAttribute('y',by);
		svg.setAttributeNS(null,'width',bw);
		svg.setAttributeNS(null,'height',bh);
		/*
		const rect_bg = document.createElementNS(svgNS, 'rect');
		rect_bg.setAttribute('x',1);
		rect_bg.setAttribute('y',1);
		rect_bg.setAttribute('width',bw-2);
		rect_bg.setAttribute('height',bh-2);
		rect_bg.style.stroke = '#ccc';
		rect_bg.style.strokeWidth = 1;
		rect_bg.style.fill = 'none';
		svg.appendChild(rect_bg);
		*/
		/*
			opacity: 0.75;
			stroke-width: 2;
			stroke: #444;
		<text x="-370" y="-390" opacity="0.75" font-family="Arial, Helvetica, sans-serif" font-size="128px" fill="#444">Making City</text>
		<path class="grid-head" d="M-900 -481 H-361" />
		<path class="grid-head" d="M36 -388 H900" />
		<text x="65" y="-340" opacity="0.75" font-family="Arial, Helvetica, sans-serif" font-size="36px" fill="#444">Positive Energy Districts</text>
		*/
		const d_fontsize = fontsize/3;
		
		
		const title = document.createElementNS(svgNS, 'text');
		title.id = 'logo-title';
		title.setAttribute('x','50%');
		title.setAttribute('y','40%');
		title.setAttribute('font-family','Arial, Helvetica, sans-serif');
		title.setAttribute('font-size',fontsize);
		title.setAttribute('dominant-baseline','middle');
		title.setAttribute('text-anchor','middle');
		title.setAttribute('fill',FILLCOLOR);
		title.style.opacity = 0.75;
		title.appendChild(document.createTextNode('Making City'));
		svg.appendChild(title);
		
		const descr = document.createElementNS(svgNS, 'text');
		descr.setAttribute('x','70%');
		descr.setAttribute('y','80%');
		descr.setAttribute('font-family','Arial, Helvetica, sans-serif');
		descr.setAttribute('font-size',d_fontsize);
		descr.setAttribute('dominant-baseline','middle');
		descr.setAttribute('text-anchor','middle');
		descr.setAttribute('fill',FILLCOLOR);
		descr.style.opacity = 0.75;
		descr.appendChild(document.createTextNode('Positive Energy Districts'));
		svg.appendChild(descr);
		
		$('#space').append(svg);
		
		const textElement = document.querySelector('#logo-title');
		const containerElement = document.querySelector('#logo-svg');
		const bboxGroup = textElement.getBBox();
		//console.log(['HIPHEI MONDAY BEE! x=',bboxGroup.x,' y=',bboxGroup.y,' width=',bboxGroup.width,' height=',bboxGroup.height]);
		/*
		const rect_foo = document.createElementNS(svgNS, 'rect');
		rect_foo.setAttribute('x',bboxGroup.x);
		rect_foo.setAttribute('y',bboxGroup.y);
		rect_foo.setAttribute('width',bboxGroup.width);
		rect_foo.setAttribute('height',bboxGroup.height);
		rect_foo.style.stroke = '#f00';
		rect_foo.style.strokeWidth = 4;
		rect_foo.style.fill = 'none';
		containerElement.appendChild(rect_foo);
		*/
		const laposY = fontsize*0.14;
		const laposX = bboxGroup.x+fontsize*0.05;
		const da = 'M0,'+laposY+' H'+laposX;
		const lineA = document.createElementNS(svgNS, "path");
		lineA.setAttributeNS(null, 'd', da);
		lineA.style.stroke = STROKECOLOR;
		lineA.style.strokeWidth = 2;
		lineA.style.opacity = 0.75;
		lineA.style.fill = 'none';
		containerElement.appendChild(lineA);
		
		const lbposY = bboxGroup.height-bboxGroup.height*0.2;
		const lbposX = bboxGroup.x+bboxGroup.width*0.61;
		const db = 'M'+lbposX+','+lbposY+' H'+w;
		const lineB = document.createElementNS(svgNS, "path");
		lineB.setAttributeNS(null, 'd', db);
		lineB.style.stroke = STROKECOLOR;
		lineB.style.strokeWidth = 2;
		lineB.style.opacity = 0.75;
		lineB.style.fill = 'none';
		containerElement.appendChild(lineB);
	}
	
	
	/*
	class="back-button" x="80" y="25" width="105" height="70" xlink:href="backbutton.svg" />
	width="150" height="100"
	NOTE:
	Uses dimensions created in appendLogo() -method.
	*/
	appendBackButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const w = this.REO.width;
		const h = this.REO.height;
		// Position back-button left and below horizontal line in Making City logo.
		let bw;
		if (w <= 600) {
			bw = 60;
		} else if (w > 600 && w <= 992) {
			bw = 70;
		} else if (w > 992 && w <= 1200) {
			bw = 80;
		} else {
			bw = 90;
		}
		const textElement = document.querySelector('#logo-title');
		const bboxGroup = textElement.getBBox();
		
		const bh = bw * 0.667 ; // bw * 100/150
		const bx = -w*0.5 + bboxGroup.x - bw*1.3;
		const by = -h*0.5 + bh*0.5;
		
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', bx);
		img.setAttribute('y', by);
		img.setAttribute('width', bw);
		img.setAttribute('height', bh);
		img.setAttribute('href', './svg/backbutton.svg');
		img.style.cursor = 'pointer';
		img.addEventListener("click", function(){
			self.models['MenuModel'].setSelected('menu');
		}, false);
		$('#space').append(img);
	}
	
	/*
	The radius of circle is 12,5% of H or W (smaller dimension).
	=> circle diameter is 25% of H or W.
	*/
	appendApartment() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const WHITE = '#fff';
		const BLUE = '#51b0ce';
		const LIGHTGREEN = '#73d3ae';
		const DARKGREEN = '#1fac78';
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		// If view is SQUARE: Put all circles to vertical center.
		// If view is PORTRAIT: Put all circles to vertical center.
		// If view is LANDSCAPE: Move all circles 10% down from vertical center.
		/*if (this.REO.mode === 'LANDSCAPE') {
			ty = this.REO.height*0.1;
		}*/
		
		const framer = r;
		const corner = 4*r/5;
		const endpoint = 11*r/5; // 11/5 = 2,2
		const endpointTop = 1.6*r;
		
		const group = document.createElementNS(svgNS, "g");
		
		const dF = 'M-'+framer+','+framer+' L-'+framer+',-'+framer+' L'+framer+',-'+framer+' L'+framer+','+framer+' Z';
		const pathF = document.createElementNS(svgNS, "path");
		pathF.setAttributeNS(null, 'd', dF);
		pathF.style.stroke = DARKGREEN;
		pathF.style.strokeWidth = 3;
		pathF.style.fill = '#ffffff';
		pathF.style.fillOpacity = 1;
		pathF.style.opacity = 0.5;
		group.appendChild(pathF);
		//$('#space').append(pathF);
		
		const d = 'M-'+corner+','+corner+' L-'+corner+',-'+corner+' L'+corner+',-'+corner+' L'+corner+','+corner+' Z';
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = DARKGREEN;
		path.style.strokeWidth = 5;
		path.style.opacity = 0.5;
		path.style.fill = '#ffffff';
		path.style.fillOpacity = 1;
		group.appendChild(path);
		//$('#space').append(path);
		
		this.appendConnector(group, framer, endpoint, 0); // Bottom Left
		this.appendConnector(group, framer, endpointTop, 1); // Top Left
		this.appendConnector(group, framer, endpointTop, 2); // Top Right
		this.appendConnector(group, framer, endpoint, 3); // Bottom Right
		this.appendConnector(group, framer, endpoint, 4); // Bottom CENTER
		
		const gap = corner*0.2;
		const pad = corner-gap;
		// LEFT CURTAIN FOR HOME WINDOW!
		//<path d="M-140,-140 L-28,-140 A300,300 0 0 1 -140,0 A400,400 0 0 1 -112,140 L-140,140 Z" 
		//stroke="#000" stroke-width="3" fill="#00a" fill-opacity="0.75" opacity="0.75" />
		const dLC = 'M-'+corner+',-'+corner+' L-'+gap+',-'+corner+
			' A300,300 0 0 1 -'+corner+',0'+
			' A400,400 0 0 1 -'+pad+','+corner+
			' L-'+corner+','+corner+' Z';
		const pathLC = document.createElementNS(svgNS, "path");
		pathLC.setAttributeNS(null, 'd', dLC);
		pathLC.style.stroke = DARKGREEN;
		pathLC.style.strokeWidth = 3;
		pathLC.style.opacity = 0.5;
		pathLC.style.fill = DARKGREEN;
		pathLC.style.fillOpacity = 0.5;
		group.appendChild(pathLC);
		//$('#space').append(pathLC);
		
		// RIGHT CURTAIN FOR HOME WINDOW!
		//<path d="M140,-140 L28,-140 A300,300 0 0 0 140,0 A400,400 0 0 0 112,140 L140,140 Z" 
		//stroke="#000" stroke-width="3" fill="#00a" fill-opacity="0.75" opacity="0.75" />
		const dRC = 'M'+corner+',-'+corner+' L'+gap+',-'+corner+
			' A300,300 0 0 0 '+corner+',0'+
			' A400,400 0 0 0 '+pad+','+corner+
			' L'+corner+','+corner+' Z';
		const pathRC = document.createElementNS(svgNS, "path");
		pathRC.setAttributeNS(null, 'd', dRC);
		pathRC.style.stroke = DARKGREEN;
		pathRC.style.strokeWidth = 3;
		pathRC.style.opacity = 0.5;
		pathRC.style.fill = DARKGREEN;
		pathRC.style.fillOpacity = 0.5
		//$('#space').append(pathRC);
		group.appendChild(pathRC);
		
		const icon_w = r;
		const icon_x = -icon_w*0.5;
		const icon_h = icon_w*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
		const icon_y = -icon_h*0.5;
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', icon_x);
		img.setAttribute('y', icon_y);
		img.setAttribute('width', icon_w);
		img.setAttribute('height', icon_h);
		img.setAttribute('href', './svg/user.svg');
		group.appendChild(img);
		
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		
		$('#space').append(group);
	}
	
	appendSun(type) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius()*0.9;
		
		const WHITE = '#fff';
		const BLUE = '#51b0ce';
		const LIGHTGREEN = '#73d3ae';
		const DARKGREEN = '#1fac78';
		
		let cy = 0;
		// If view is SQUARE: Put all circles to vertical center.
		// If view is PORTRAIT: Put all circles to vertical center.
		// If view is LANDSCAPE: Move all circles 10% down from vertical center.
		/*if (this.REO.mode === 'LANDSCAPE') {
			cy = this.REO.height*0.1;
		}*/
		let icon_w = r;
		let r2 = r-r*0.1;
		let r3 = r-r*0.3;
		
		let icon_x = -icon_w*0.5;
		let icon_h = icon_w*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
		let icon_y = cy - icon_h*0.5;
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		if (type === 'SETTINGS') {
			
			icon_w = r;
			r = r*0.6;
			r2 = r-r*0.1;
			r3 = r-r*0.3;
			
			icon_x = -icon_w*0.5;
			icon_h = icon_w*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
			icon_y = cy - icon_h*0.5;
			
			tx = -3.3*r;
			ty = -3.3*r;
			
		} else if (type === 'LOGOUT') {
			
			icon_w = r;
			r = r*0.6;
			r2 = r-r*0.1;
			r3 = r-r*0.3;
			
			icon_x = -icon_w*0.5;
			icon_h = icon_w*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
			icon_y = cy - icon_h*0.5;
			
			tx = 3.3*r;
			ty = -3.3*r;
			
		} else if (type === 'ELECTRICITY') {
			tx = -12*r/5;
			ty = 12*r/5;
		} else if (type === 'HEATING') {
			tx = 0;
			ty = 12*r/5;
		} else if (type === 'WATER') {
			tx = ty = 12*r/5;
		}
		
		
		const group = document.createElementNS(svgNS, "g");
		
		const border = document.createElementNS(svgNS, "circle");
		border.setAttributeNS(null, 'cx', 0);
		border.setAttributeNS(null, 'cy', cy);
		border.setAttributeNS(null, 'r', r);
		border.style.fill = WHITE;
		border.style.fillOpacity = 0.5;
		border.style.stroke = LIGHTGREEN;
		border.style.strokeWidth = 2;
		group.appendChild(border);
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', cy);
		ca.setAttributeNS(null, 'r', r2);
		ca.style.fill = WHITE;
		ca.style.fillOpacity = 0.5;
		ca.style.stroke = LIGHTGREEN;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
		const cb = document.createElementNS(svgNS, "circle");
		cb.setAttribute('cx', 0);
		cb.setAttribute('cy', cy);
		cb.setAttribute('r', r3);
		cb.style.fill = WHITE;
		cb.style.fillOpacity = 1;
		cb.style.stroke = LIGHTGREEN;
		cb.style.strokeWidth = 0.5;
		group.appendChild(cb);
		
		if (type === 'SETTINGS') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/settings.svg');
			group.appendChild(img);
			
		} else if (type === 'LOGOUT') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/logout.svg');
			group.appendChild(img);
			
		} else if (type === 'ELECTRICITY') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/electricity.svg');
			group.appendChild(img);
			
		} else if (type === 'HEATING') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/radiator.svg');
			group.appendChild(img);
			
		} else if (type === 'WATER') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/water.svg');
			group.appendChild(img);
		}
		
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', cy);
		surface.setAttributeNS(null, 'r', r);
		surface.style.stroke = LIGHTGREEN;
		surface.style.strokeWidth = 1;
		//surface.style.fill = DARKGREEN;
		//surface.style.fillOpacity = 0;
		//surface.style.cursor = 'pointer';
		
		// Disable water!
		/*
			#e0f2f1 teal lighten-5
			#b2dfdb teal lighten-4
			#80cbc4 teal lighten-3
		*/
		
		if (type === 'WATER') {
			surface.style.stroke = '#b2dfdb';
			surface.style.strokeWidth = 2;
			surface.style.fill = '#b2dfdb';
			surface.style.fillOpacity = 0.8;
			surface.style.cursor = 'default';
		} else {
			surface.style.fill = DARKGREEN;
			surface.style.fillOpacity = 0;
			surface.style.cursor = 'pointer';
			
			surface.addEventListener("click", function(){
				if (type === 'LOGOUT') {
					const UM = self.controller.master.modelRepo.get('UserModel');
					// UM.logout() will do the following:
					// this.notifyAll({model:'UserModel',method:'before-logout',id:this.id,token:this.token});
					// this.reset();
					// this.store();
					// console.log('USER LOGOUT! Localstorage cleaned!');
					// setTimeout(() => this.notifyAll({model:'UserModel',method:'logout',status:200,message:'Logout OK'}), 100);
					//
					// These notifications are handled in MasterController.
					if (UM) {
						UM.logout();
					}
				} else {
					console.log('HEY, '+type+' CLICKED!');
				}
			}, false);
			surface.addEventListener("mouseover", function(event){ 
				border.style.fill = DARKGREEN;
			}, false);
			surface.addEventListener("mouseout", function(event){ 
				border.style.fill = WHITE;
			}, false);
		}
		group.appendChild(surface);
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(group);
	}
	
	
	renderALL() {
		$(this.el).empty();
		this.createSpace();
		this.appendLogo();
		this.appendBackButton();
		this.appendApartment();
		
		this.appendSun('SETTINGS');
		this.appendSun('LOGOUT');
		this.appendSun('ELECTRICITY');
		this.appendSun('HEATING');
		this.appendSun('WATER');
	}
	
	render() {
		this.renderALL();
		this.rendered = true;
	}
}
