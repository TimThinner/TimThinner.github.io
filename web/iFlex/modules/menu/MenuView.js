import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js'
/*
iFLEX Dark blue   #1a488b ( 26,  72, 139)
iFLEX Dark green  #008245 (  0, 130,  69)
iFLEX Light green #78c51b (120, 197,  27)
*/
export default class MenuView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		this.LANGUAGE_MODEL = this.controller.master.modelRepo.get('LanguageModel');
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		
		this.PTO = new PeriodicTimeoutObserver({interval:this.controller.fetching_interval_in_seconds*1000});
		this.PTO.subscribe(this);
		
		this.elecons = []; // array of {timestamp, value} pairs. Value contains electricity consumption sum from PL1,PL2,PL3.
		this.prices = []; // array of {timestamp, value} pairs. 
	}
	
	show() {
		console.log('MenuView show()');
		this.PTO.restart();
		this.render();
		if (typeof this.models['ProxesCleanerModel'] !== 'undefined') {
			this.models['ProxesCleanerModel'].clean();
		}
	}
	
	hide() {
		console.log('MenuView hide()');
		this.PTO.stop();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		console.log('MenuView remove()');
		this.PTO.stop();
		this.PTO.unsubscribe(this);
		
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	/*
	The radius of circle is 12,5% of H or W (smaller dimension).
	=> circle diameter is 25% of H or W.
	*/
	
	sunRadius() {
		const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		const wp2 = w*0.125;
		const hp2 = h*0.125;
		const r = Math.min(wp2, hp2); // r = 0,125 x W or H, whichever is smallest (d=0,25 x W or H)
		return r;
	}
	
	/*
	<defs>
	<radialGradient id="grad" cx="50%" cy="50%" r="100%">
		<stop offset="10%" style="stop-color:#fff; stop-opacity:1" />
		<stop offset="50%" style="stop-color:#eee; stop-opacity:1" />
		<stop offset="90%" style="stop-color:#ddd; stop-opacity:1" />
	</radialGradient>
	</defs>
	<rect x="-900" y="-500" width="1800" height="900" fill="url(#grad)" stroke-width="0" stroke="#000" />
	
	https://stackoverflow.com/questions/13760299/dynamic-svg-linear-gradient-when-using-javascript
	
	*/
	createSpace() {
		//$('html').css('background-color','#ddd');
		//$('body').css('background-color','#ddd');
		//$('.container').css('background-color','#ddd');
		
		const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const vb = '-'+wp2+' -'+hp2+' '+w+' '+h;
		
		const svgNS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(svgNS, "svg");
		
		svg.setAttributeNS(null,'width',w);
		svg.setAttributeNS(null,'height',h);
		svg.setAttributeNS(null,'viewBox',vb);
		svg.id = 'space';
		
		// Store an array of stop information for the gradient
		var stops = [
			{"color":"#fff","offset": "10%"},
			{"color":"#eee","offset": "50%"}
		];
		/*
		const stops = [
			{"style":"stop-color:#fff; stop-opacity:1","offset": "10%"}
			//{"style":"#stop-color:#eee; stop-opacity:1","offset": "50%"},
			//{"style":"#stop-color:#ddd; stop-opacity:1","offset": "90%"}
		];*/
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
	/*
	<image x="-120" y="-450" width="240" height="240" xlink:href="../img/iFLEX.png" />
	*/
	appendLogo() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const h = this.REO.height-18;
		const r = this.sunRadius();
		const img_dim = r*2;
		const img_x_pos = -img_dim*0.5;
		let img_y_pos = -h*0.5; // Logo at the top!
		// Center Logo vertically (if space). Note that we want Logo to be just above rooftop.
		const rooftop = 9*r/5; // See also appendBuilding()
		
		const temp = (h*0.5-img_dim-rooftop)*0.5;
		if (temp > 0) {
			img_y_pos = -(temp+img_dim+rooftop);
		}
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', img_x_pos);
		img.setAttribute('y', img_y_pos);
		img.setAttribute('width', img_dim);
		img.setAttribute('height', img_dim);
		img.setAttribute('href', './img/iFLEX.png'); // Logo original dimensions are 1000 x 1000 pixels.
		$('#space').append(img);
	}
	
	appendConnector(corner, endpoint, pos) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
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
		} else {
			d = 'M'+corner+','+corner+' L'+endpoint+','+endpoint;
			cx = corner;
			cy = corner;
		}
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = DARK_BLUE;
		path.style.strokeWidth = 2;
		path.style.opacity = 0.5;
		path.style.fill = 'none';
		$('#space').append(path);
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', cx);
		c.setAttributeNS(null, 'cy', cy);
		c.setAttributeNS(null, 'r', 5);
		c.style.stroke = DARK_BLUE;
		c.style.strokeWidth = 2;
		c.style.opacity = 0.5;
		c.style.fill = DARK_BLUE;
		$('#space').append(c);
	}
	
	appendWindow(d, tx, ty) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = '#1a488b';
		path.style.strokeWidth = 5;
		path.style.opacity = 0.5;
		path.style.fill = '#fff';
		path.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(path);
	}
	/*
	The radius of circle is 12,5% of H or W (smaller dimension).
	=> circle diameter is 25% of H or W.
	*/
	appendBuilding() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		
		const corner = 7*r/5;
		const rooftop = 9*r/5;
		const endpoint = 12*r/5;
		
		const d = 'M-'+corner+','+corner+' L-'+corner+',-'+corner+' L0,-'+rooftop+' L'+corner+',-'+corner+' L'+corner+','+corner+' Z';
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = DARK_BLUE;
		path.style.strokeWidth = 9;
		path.style.fill = DARK_BLUE;
		path.style.fillOpacity = 0.25
		path.style.opacity = 0.3;
		$('#space').append(path);
		
		this.appendConnector(corner, endpoint, 0); // Bottom Left
		this.appendConnector(corner, endpoint, 1); // Top Left
		this.appendConnector(corner, endpoint, 2); // Top Right
		this.appendConnector(corner, endpoint, 3); // Bottom Right
		
		// Windows:
		const wunit = 14*r/60;
		const wd = 'M-'+wunit+','+wunit+' L-'+wunit+',-'+wunit+' L'+wunit+',-'+wunit+' L'+wunit+','+wunit+' Z';
		// Upper row:
		this.appendWindow(wd, -4*wunit, -4*wunit);
		this.appendWindow(wd, 0, -4*wunit);
		this.appendWindow(wd, 4*wunit, -4*wunit);
		// Center row:
		this.appendWindow(wd, -4*wunit, 0);
		this.appendWindow(wd, 0, 0);
		this.appendWindow(wd, 4*wunit, 0);
		// Bottom row:
		this.appendWindow(wd, -4*wunit, 4*wunit);
		this.appendWindow(wd, 4*wunit, 4*wunit);
		
		// DOOR:
		const dd = 'M-'+wunit+','+2*wunit+' L-'+wunit+',-'+wunit+' L'+wunit+',-'+wunit+' L'+wunit+','+2*wunit+' Z';
		const tx = 0;
		const ty = 4*wunit;
		const door = document.createElementNS(svgNS, "path");
		door.setAttributeNS(null, 'd', dd);
		door.style.stroke = DARK_BLUE;
		door.style.strokeWidth = 5;
		door.style.opacity = 0.5;
		door.style.fill = 'none';
		door.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(door);
	}
	
	/*
	<circle id="target-d-border" cx="0" cy="0" r="100" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
	<circle cx="0" cy="0" r="90" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
	<circle cx="0" cy="0" r="60" stroke="#1a488b" stroke-width="0.5" opacity="1" fill="#fff" />
	<image x="-50" y="-37.5" width="100" height="75" xlink:href="feedback.svg" />
	<circle id="target-d" class="surface" x="0" y="0" r="100" />
	
	
	
	<g transform="translate(0,0)">
	<g transform="translate(250,250)">
	...
	
	*/
	appendSun(type) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		const r2 = r-r*0.1;
		const r3 = r-r*0.3;
		const w = r;
		const wper2 = w*0.5;
		const h = r*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
		const hper2 = h*0.5;
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		if (type === 'ELECTRICITY') {
			tx = ty = -12*r/5;
		} else if (type === 'HEATING') {
			tx = 12*r/5;
			ty = -12*r/5;
		} else if (type === 'ENVIRONMENT') {
			tx = -12*r/5;
			ty = 12*r/5;
		} else if (type === 'FEEDBACK') {
			tx = ty = 12*r/5;
		}
		
		const group = document.createElementNS(svgNS, "g");
		
		const border = document.createElementNS(svgNS, "circle");
		border.setAttributeNS(null, 'cx', 0);
		border.setAttributeNS(null, 'cy', 0);
		border.setAttributeNS(null, 'r', r);
		border.style.fill = WHITE;
		border.style.fillOpacity = 0.5;
		border.style.stroke = DARK_BLUE;
		border.style.strokeWidth = 2;
		group.appendChild(border);
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', 0);
		ca.setAttributeNS(null, 'r', r2);
		ca.style.fill = WHITE;
		ca.style.fillOpacity = 0.5;
		ca.style.stroke = DARK_BLUE;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
		const cb = document.createElementNS(svgNS, "circle");
		cb.setAttribute('cx', 0);
		cb.setAttribute('cy', 0);
		cb.setAttribute('r', r3);
		cb.style.fill = WHITE;
		cb.style.fillOpacity = 1;
		cb.style.stroke = DARK_BLUE;
		cb.style.strokeWidth = 0.5;
		group.appendChild(cb);
		
		if (type === 'USER') {
			if (this.USER_MODEL.isLoggedIn()) {
				const img = document.createElementNS(svgNS, "image");
				img.setAttribute('x', -wper2);
				img.setAttribute('y', -hper2);
				img.setAttribute('width', w);
				img.setAttribute('height', h);
				img.setAttribute('href', './svg/user.svg');
				group.appendChild(img);
			} else {
				const img = document.createElementNS(svgNS, "image");
				img.setAttribute('x', -wper2);
				img.setAttribute('y', -hper2);
				img.setAttribute('width', w);
				img.setAttribute('height', h);
				img.setAttribute('href', './svg/anon.svg');
				group.appendChild(img);
			}
		} else if (type === 'ELECTRICITY') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/electricity.svg');
			group.appendChild(img);
		} else if (type === 'HEATING') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/radiator.svg');
			group.appendChild(img);
		} else if (type === 'ENVIRONMENT') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/leaf.svg');
			group.appendChild(img);
		} else if (type === 'FEEDBACK') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/feedback.svg');
			group.appendChild(img);
		}
		
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', 0);
		surface.setAttributeNS(null, 'r', r);
		surface.style.stroke = DARK_BLUE;
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		
		// Select which pages open...
		if (type === 'USER') {
			if (this.USER_MODEL.isLoggedIn()) {
				surface.addEventListener("click", function(){
					self.models['MenuModel'].setSelected('USERPAGE');
				}, false);
			} else {
				surface.addEventListener("click", function(){
					self.models['MenuModel'].setSelected('userlogin');
				}, false);
			}
		} else if (type === 'ELECTRICITY') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('A');
			}, false);
		} else if (type === 'HEATING') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('B');
			}, false);
		} else if (type === 'ENVIRONMENT') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('C');
			}, false);
		} else if (type === 'FEEDBACK') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('D');
			}, false);
		}
		
		surface.addEventListener("mouseover", function(event){ 
			border.style.fill = GREEN;
		}, false);
		surface.addEventListener("mouseout", function(event){ 
			border.style.fill = WHITE;
		}, false);
		
		group.appendChild(surface);
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(group);
	}
	
	appendInfoButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		const rr = r*0.4;
		const r2 = rr-rr*0.2;
		const w = r2*2;
		const wper2 = w*0.5;
		
		 // 'transform' => 'translate('+tx+','+ty+')'
		const tx = 0;
		const ty = 12*r/5;
		
		const group = document.createElementNS(svgNS, "g");
		
		const border = document.createElementNS(svgNS, "circle");
		border.setAttributeNS(null, 'cx', 0);
		border.setAttributeNS(null, 'cy', 0);
		border.setAttributeNS(null, 'r', rr);
		border.style.fill = WHITE;
		border.style.fillOpacity = 0.5;
		border.style.stroke = DARK_BLUE;
		border.style.strokeWidth = 2;
		group.appendChild(border);
		
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', -wper2);
		img.setAttribute('y', -wper2);
		img.setAttribute('width', w);
		img.setAttribute('height', w);
		img.setAttribute('href', './svg/info.svg');
		group.appendChild(img);
		
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', 0);
		surface.setAttributeNS(null, 'r', rr);
		surface.style.stroke = DARK_BLUE;
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		surface.addEventListener("click", function(){
			self.models['MenuModel'].setSelected('HELP');
		}, false);
		surface.addEventListener("mouseover", function(event){ 
			border.style.fill = GREEN;
		}, false);
		surface.addEventListener("mouseout", function(event){ 
			border.style.fill = WHITE;
		}, false);
		
		group.appendChild(surface);
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(group);
	}
	
	setSelectedLanguage(lang) {
		
		this.LANGUAGE_MODEL.selected = lang;
		// and redraw the whole view!
		this.show();
	}
	
	appendLangButton(lang, bx, by, bw, bh, fontsize, selected) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const DARK_BLUE = '#1a488b';
		//const LIGHT_GREEN = '#78c51b';
		const DARK_GREEN = '#008245';
		const language_label = {
			'en':'English',
			'fi':'Suomi'
		};
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',bx);
		svg.setAttribute('y',by);
		svg.setAttributeNS(null,'width',bw);
		svg.setAttributeNS(null,'height',bh);
		
		const rounding = bw*0.1; // 10% rounded corners.
		const rect_bg = document.createElementNS(svgNS, 'rect');
		rect_bg.setAttribute('x',1);
		rect_bg.setAttribute('y',1);
		rect_bg.setAttribute('width',bw-2);
		rect_bg.setAttribute('height',bh-2);
		rect_bg.setAttribute('rx',rounding);
		if (selected) {
			rect_bg.style.stroke = DARK_GREEN;
			rect_bg.style.strokeWidth = 1;
			rect_bg.style.fill = '#fff';
		} else {
			rect_bg.style.stroke = DARK_BLUE;
			rect_bg.style.strokeWidth = 1;
			rect_bg.style.fill = '#eee';
		}
		svg.appendChild(rect_bg);
		
		const txt = document.createElementNS(svgNS, 'text');
		txt.setAttribute('x','50%');
		txt.setAttribute('y','50%');
		txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
		txt.setAttribute('font-size',fontsize);
		txt.setAttribute('dominant-baseline','middle');
		txt.setAttribute('text-anchor','middle');
		txt.setAttribute('fill','#00a');
		const text_node = document.createTextNode(language_label[lang]);
		txt.appendChild(text_node);
		svg.appendChild(txt);
		
		const rect_fg = document.createElementNS(svgNS, 'rect');
		rect_fg.setAttribute('x',0);
		rect_fg.setAttribute('y',0);
		rect_fg.setAttribute('width',bw);
		rect_fg.setAttribute('height',bh);
		rect_fg.style.stroke = '#000';
		rect_fg.style.strokeWidth = 1;
		rect_fg.style.fill = '#fff';
		rect_fg.style.opacity = 0;
		rect_fg.style.cursor = 'pointer';
		rect_fg.addEventListener("click", function(){
			if (!selected) {
				self.setSelectedLanguage(lang);
			}
		}, false);
		/*
		rect_fg.addEventListener("mouseover", function(event){ 
		}, false);
		rect_fg.addEventListener("mouseout", function(event){ 
		}, false);
		*/
		svg.appendChild(rect_fg);
		$('#space').append(svg);
	}
	
	appendLanguageSelections() {
		const lang_array = this.LANGUAGE_MODEL.languages;
		const sel = this.LANGUAGE_MODEL.selected;
		
		//this.languages = ['en','fi'];
		//this.selected = 'fi';
		
		const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		/*
		Screen Sizes (in Materialize CSS)
		Mobile Devices		Tablet Devices		Desktop Devices		Large Desktop Devices
		<= 600px 			> 600px 			> 992px 				> 1200px
		*/
		lang_array.forEach((lang,index)=>{
			let selected = false;
			if (lang === sel) {
				selected = true;
			}
			let bw, bh, fontsize;
			if (w <= 600) {
				console.log('Mobile Device.');
				fontsize = '14px';
				bw = 82;
				bh = 34;
			} else if (w > 600 && w <= 992) {
				console.log('Tablet Device.');
				fontsize = '14px';
				bw = 88;
				bh = 36;
			} else if (w > 992 && w <= 1200) {
				console.log('Desktop Device.');
				fontsize = '16px';
				bw = 94;
				bh = 38;
			} else {
				console.log('Large Desktop Device.');
				fontsize = '18px';
				bw = 100;
				bh = 40;
			}
			const gap = 6;
			// Adjusted to the bottom right:
			const basew = w*0.5;
			const baseh = h*0.5;
			// or adjusted to the center:
			//const basew = gap*0.5+bw;
			//const baseh = h*0.5;
			const bx = basew-(index+1)*bw-index*gap;
			const by = baseh-bh;
			this.appendLangButton(lang, bx, by, bw, bh, fontsize, selected);
		});
	}
	
	renderALL() {
		console.log('renderALL()!!!!');
		$(this.el).empty();
		this.createSpace();
		this.appendLogo();
		this.appendBuilding();
		
		this.appendSun('USER');
		this.appendSun('ELECTRICITY');
		this.appendSun('HEATING');
		this.appendSun('ENVIRONMENT');
		this.appendSun('FEEDBACK');
		
		this.appendInfoButton();
		this.appendLanguageSelections();
	}
	
	
	merge() {
		if (this.elecons.length > 0 && this.prices.length > 0) {
			
			console.log('======== MERGE! =========');
			const bucket = {};
			// For all consumption timestamps, check if price exist.
			this.elecons.forEach(e=>{
				const ds = moment(e.timestamp).format(); // timestamp is a Date object => convert to string.
				console.log(['ELECONS ds=',ds]);
				
				bucket[ds] = {};
				bucket[ds]['elecons'] = e.value;
			});
			this.prices.forEach(p=>{
				const ds = moment(p.date).format(); // timestamp is a Date object => convert to string.
				if (bucket.hasOwnProperty(ds)) {
					bucket[ds]['price'] = p.price;
				} else {
					// DISCARD THIS!
					console.log(['DISCARD PRICE ds=',ds]);
				}
			});
			// How many entries?
			const len = Object.keys(bucket).length;
			console.log(['AFTER MERGE bucket=',bucket,' length=',len]);
			//Object.keys(bucket).forEach(key => {
			//});
			
		} else {
			console.log('======== NOT READY TO MERGE YET! =========');
		}
	}
	
	calculateSum() {
		
		// CALL THIS FOR EVERY MODEL, BUT NOTE THAT SUM IS CALCULATED ONLY WHEN ALL 3 MODELS ARE READY AND FILLED WITH VALUES!
		const val_array = [];
		
		if (this.models['MenuBuildingElectricityPL1Model'].values.length > 0 && 
			this.models['MenuBuildingElectricityPL2Model'].values.length > 0 &&
			this.models['MenuBuildingElectricityPL3Model'].values.length > 0) {
			
			// Calculate the sum of models like before.
			// and assign that to self.values array {timestamp => value}
			const sumbucket = {};
			
			this.models['MenuBuildingElectricityPL1Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL1'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL1'] = val; // update
				}
			});
			
			this.models['MenuBuildingElectricityPL2Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL2'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL2'] = val; // update
				}
			});
			
			this.models['MenuBuildingElectricityPL3Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL3'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL3'] = val; // update
				}
			});
			
			Object.keys(sumbucket).forEach(key => {
				let sum = 0;
				Object.keys(sumbucket[key]).forEach(m => {
					sum += sumbucket[key][m];
				});
				val_array.push({timestamp: moment(key).toDate(), value:sum});
			});
			// NEW: Sort values by the timestamp Date: oldest first.
			// sort by string (created is a string, for example: "2021-04-21T07:40:50.965Z")
			val_array.sort(function(a, b) {
				if (a.timestamp < b.timestamp) {
					return -1;
				}
				if (a.timestamp > b.timestamp) {
					return 1;
				}
				return 0; // dates must be equal
			});
		} else {
			console.log('NOT ALL ELECTRICITY MODELS ARE READY... WAIT!');
		}
		console.log(['val_array=',val_array]);
		return val_array;
	}
	
	/*
		p.timeInterval object with two arrays: start "2021-12-01T23:00Z" and end "2021-12-02T23:00Z"
		p.resolution array with one item "PT60M"
		
		p.Point array with 24 items
		position "1"
		price "99.12"
	*/
	convertPriceData() {
		// array of {date:..., price: ... } objects.
		const ts = this.models['EntsoeEnergyPriceModel'].timeseries;
		
		// At ENTSOE price_unit is 'MWH' and currency is 'EUR', we want to convert this to snt/kWh (c/kWh)
		// 'EUR' => 'snt' and 'MWH' => 'kWh' multiply with 100 and divide by 1000 => MULTIPLY BY 0.1!
		let currency = 'EUR';
		if (this.models['EntsoeEnergyPriceModel'].currency !== 'undefined') {
			currency = this.models['EntsoeEnergyPriceModel'].currency;
		}
		let price_unit = 'MWH';
		if (this.models['EntsoeEnergyPriceModel'].price_unit !== 'undefined') {
			price_unit = this.models['EntsoeEnergyPriceModel'].price_unit;
		}
		let factor = 1;
		if (price_unit === 'MWH') {
			// Convert values to EUR/kWh, we have to divide by 1000 (multiply by 1/1000).
			factor = 0.001; // 300 EUR/MWH => 30 EUR/kWh
		}
		console.log(['currency=',currency,' price_unit=',price_unit,' factor=',factor]);
		const newdata = [];
		ts.forEach(t=>{
			let timestamp = moment(t.timeInterval.start);
			const reso = moment.duration(t.resolution);
			t.Point.forEach(p=>{
				const price = p.price*factor;
				newdata.push({date: timestamp.toDate(), price: price});
				// Do we need to handle the +p.position when stepping from start to end?
				timestamp.add(reso);
			});
		});
		return newdata;
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				this.show();
				
			} else if (options.model==='ProxesCleanerModel' && options.method==='clean') {
				
				if (options.status === 200) {
					console.log('PROXES CLEAN OK!');
				}
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Do something with each TICK!
				
				// Reset data arrays.
				this.elecons = [];
				this.prices = [];
				
				console.log('PeriodicTimeoutObserver timeout!');
				Object.keys(this.models).forEach(key => {
					if (key === 'EntsoeEnergyPriceModel') {
						console.log(['FETCH MODEL key=',key]);
						this.models[key].fetch();
					} else if (key.indexOf('MenuBuildingElectricityPL') === 0) {
						//key === 'MenuBuildingElectricityPL1Model' || key === 'MenuBuildingElectricityPL2Model' || key === 'MenuBuildingElectricityPL3Model') {
						// See if these params are enough?
						this.models[key].interval = 'PT60M';
						this.models[key].timerange = {begin:{value:5,unit:'days'},end:{value:0,unit:'days'}};
						// Add empty object as dummy parameter.
						
						// See: adjustSyncMinute() and adjustSyncHour() at TimeRangeView.js
						const sync_minute = 0;
						const sync_hour = moment().hour();
						console.log(['FETCH key=',key,' sync_minute=',sync_minute,' sync_hour=',sync_hour]);
						this.models[key].fetch({}, sync_minute, sync_hour);
					}
				});
			} else if (options.model==='EntsoeEnergyPriceModel' && options.method==='fetched') {
				if (options.status === 200) {
					
					this.prices = this.convertPriceData();
					
					console.log('==================================');
					console.log(['this.prices=',this.prices]);
					console.log('==================================');
					
					this.merge(); // If both datasets are fetched and ready, merge.
					
					//this.populatePriceValues(newdata);
					//this.updatePriceForecast();
					//this.updatePriceText();
						
				} else { // Error in fetching.
					
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model.indexOf('MenuBuildingElectricityPL') === 0 && options.method==='fetched') {
				console.log('NOTIFY '+options.model+' fetched!');
				console.log(['options.status=',options.status]);
				if (options.status === 200 || options.status === '200') {
					if (this.models[options.model].values.length > 0) {
						
						console.log(['values=',this.models[options.model].values]);
						this.elecons = this.calculateSum();
						if (this.elecons.length > 0) {
							this.merge(); // If both datasets are fetched and ready, merge.
						}
						
					} else {
						console.log('NO values!!!');
					}
					
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
			} 
		}
	}
	
	render() {
		console.log('MenuView render()');
		this.renderALL();
		this.rendered = true;
	}
}
