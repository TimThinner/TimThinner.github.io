import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js'
/*
iFLEX Dark blue   #1a488b ( 26,  72, 139)
iFLEX Dark green  #008245 (  0, 130,  69)
iFLEX Light green #78c51b (120, 197,  27)

MONTHLY SAVINGS:

(1)
Energy Cost:
10 €
17% decrease

(2)
Energy Consumption:
25kWh
21% decrease

(3)
CO2 Emissions:
5 kg
1% decrease

(1): 
	- kWh for each hour (power)		this.elecons = [];
	- price for each hour (price)	this.prices = [];
	- daily price = sum of 24 power x price multiplications.
		See: const sum_bucket = {};  {date: Date, total: float}
	To get the SAVING we must use 
		this.optimization_hash to divide sum_bucket into "base" and "opti" sums => 
			difference in euros and in percentages.
		if base-sum > opti-sum ..
	
(2):
	- kWh for each hour (power)		this.dh_hash = {};
	- price is constant (11,35 c/kWh) 
	- claculate similar sum_bucket as in (1)...
	
	To get the SAVING we must use: see (1)
	
	
(3):
	- 
	ELE: this.emission_factor_hash = {};
			this.elecons = [];
	
	DH: this.dh_hash = {};
		Carbon dioxide emissions from heat and power production (gCO2/kWh)
		factor is constant 182
	
	To get the SAVING we must use: see (1)
	
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
		
		this.numberOfDays = this.controller.numberOfDays;
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
		} else if (pos === 3) {
			d = 'M'+corner+','+corner+' L'+endpoint+','+endpoint;
			cx = corner;
			cy = corner;
		} else if (pos === 4) {
			d = 'M-'+corner+',0 L-'+endpoint+',0';
			cx = -corner;
			cy = 0;
		} else if (pos === 5) {
			d = 'M'+corner+',0 L'+endpoint+',0';
			cx = corner;
			cy = 0;
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
	
	appendText(wunit,tx,ty,fontsize,color,str,id) {
		const svgNS = 'http://www.w3.org/2000/svg';
		/*
		<svg x="-100" y="410" width="200px" height="32px">
			<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" id="version" class="version-info"></text>
		</svg>
		*/
		const x = -wunit;
		const y = -wunit;
		const w = 2*wunit;
		const h = wunit;
		
		$('#'+id).remove(); // First remove old text from space.
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',x);
		svg.setAttribute('y',y);
		svg.setAttributeNS(null,'width',w);
		svg.setAttributeNS(null,'height',h);
		svg.setAttribute('transform', 'translate('+tx+','+ty+')');
		svg.id = id;
		
		const txt = document.createElementNS(svgNS, 'text');
		txt.setAttribute('x','50%');
		txt.setAttribute('y','50%');
		txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
		txt.setAttribute('font-size',fontsize);
		txt.setAttribute('dominant-baseline','middle');
		txt.setAttribute('text-anchor','middle');
		txt.setAttribute('fill',color);
		const text_node = document.createTextNode(str);
		txt.appendChild(text_node);
		svg.appendChild(txt);
		$('#space').append(svg);
	}
	
	/*
	NOTE: 
	Window-SURFACE will be added AFTER flexibility values are fetched and displayed 
	
	#85bc25 = rgb(133,188,37)
	*/
	
	appendWindow(wunit, tx, ty, id, optiz) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		
		if (typeof id !== 'undefined') {
			const rid = id+'-surface-rect';
			const bid = id+'-surface-border';
			
			$('#'+rid).remove(); // First remove rect from space.
			$('#'+bid).remove(); // and remove border from space.
			
			const i_rect = document.createElementNS(svgNS, 'rect');
			i_rect.setAttribute('x',-wunit);
			i_rect.setAttribute('y',-wunit);
			i_rect.setAttribute('width',wunit*2);
			i_rect.setAttribute('height',wunit*2);
			i_rect.style.cursor = 'pointer';
			
			if (optiz > 0) {
				i_rect.style.fill = '#f80';
			} else {
				i_rect.style.fill = '#ff0';
			}
			i_rect.style.fillOpacity = 0.2;
			i_rect.style.strokeOpacity = 1;
			i_rect.style.stroke = '#1a488b';
			i_rect.style.strokeWidth = 1;
			i_rect.setAttribute('transform', 'translate('+tx+','+ty+')');
			i_rect.id = rid;
			
			const border = document.createElementNS(svgNS, 'rect');
			border.setAttribute('x',-wunit-3);
			border.setAttribute('y',-wunit-3);
			border.setAttribute('width',wunit*2+6);
			border.setAttribute('height',wunit*2+6);
			border.style.fill = '#000'; // not visible, but must be something other than "none"!
			border.style.fillOpacity = 0;
			border.style.strokeOpacity = 0;
			border.style.strokeWidth = 6;
			border.style.stroke = '#0f0';
			border.setAttribute('transform', 'translate('+tx+','+ty+')');
			border.id = bid;
			
			i_rect.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('FLEX');
			}, false);
			
			i_rect.addEventListener("mouseover", function(event){
				border.style.strokeOpacity = 1;
			}, false);
			
			i_rect.addEventListener("mouseout", function(event){
				border.style.strokeOpacity = 0;
			}, false);
			
			$('#space').append(border);
			$('#space').append(i_rect);
			
		} else {
			const o_rect = document.createElementNS(svgNS, 'rect');
			o_rect.setAttribute('x',-wunit);   // -6
			o_rect.setAttribute('y',-wunit);   // -6
			o_rect.setAttribute('width',wunit*2);  // +12
			o_rect.setAttribute('height',wunit*2); // +12
			o_rect.style.fill = '#fff';
			o_rect.style.fillOpacity = 1;
			o_rect.style.strokeOpacity = 1;
			o_rect.style.stroke = '#1a488b';
			o_rect.style.strokeWidth = 2;
			o_rect.setAttribute('transform', 'translate('+tx+','+ty+')');
			$('#space').append(o_rect);
		}
	}
	
	
	appendRings(factor) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		r = r * factor;
		const r2 = r-r*0.05;
		
		const tx = 0;
		const ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		const group = document.createElementNS(svgNS, "g");
		
		const border = document.createElementNS(svgNS, "circle");
		border.setAttributeNS(null, 'cx', 0);
		border.setAttributeNS(null, 'cy', 0);
		border.setAttributeNS(null, 'r', r);
		border.style.fill = WHITE;
		border.style.fillOpacity = 0;
		border.style.stroke = DARK_BLUE;
		border.style.strokeWidth = 1;
		border.style.strokeOpacity = 0.25;
		group.appendChild(border);
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', 0);
		ca.setAttributeNS(null, 'r', r2);
		ca.style.fill = WHITE;
		ca.style.fillOpacity = 0;
		ca.style.stroke = DARK_BLUE;
		ca.style.strokeWidth = 1;
		ca.style.strokeOpacity = 0.25;
		group.appendChild(ca);
		
		
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(group);
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
		
		this.appendConnector(corner, endpoint, 4); // Center Left
		this.appendConnector(corner, endpoint, 5); // Center Right
		
		// Windows:
		const wunit = 14*r/60;
		//const wd = 'M-'+wunit+','+wunit+' L-'+wunit+',-'+wunit+' L'+wunit+',-'+wunit+' L'+wunit+','+wunit+' Z';
		// Upper row:
		this.appendWindow(wunit, -4*wunit, -4*wunit);
		this.appendWindow(wunit, 0, -4*wunit);
		this.appendWindow(wunit, 4*wunit, -4*wunit);
		// Center row:
		this.appendWindow(wunit, -4*wunit, 0);
		this.appendWindow(wunit, 4*wunit, 0);
		// Bottom row:
		this.appendWindow(wunit, -4*wunit, 4*wunit);
		this.appendWindow(wunit, 4*wunit, 4*wunit);
		
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
		let r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		r = r*0.8; // Smaller circle (80% from original)
		
		let r2 = r-r*0.1;
		let r3 = r-r*0.3;
		let w = r;
		let wper2 = w*0.5;
		let h = r*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
		let hper2 = h*0.5;
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		// Make CENTER CIRCLE (USER) smaller than others.
		if (type === 'USER') {
			r = r*0.8; // Smaller circle
			r2 = r-r*0.1;
			r3 = r-r*0.3;
			w = r;
			wper2 = w*0.5;
			h = r*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
			hper2 = h*0.5;
			
		} else if (type === 'ELECTRICITY') {
			tx = ty = -14*r/5;
		} else if (type === 'HEATING') {
			tx = 14*r/5;
			ty = -14*r/5;
		} else if (type === 'ENVIRONMENT') {
			tx = -14*r/5;
			ty = 14*r/5;
		} else if (type === 'FEEDBACK') {
			tx = ty = 14*r/5;
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
		let r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		r = r*0.8; // Smaller circle (75% from original)
		r = r*0.8; // Smaller circle (80% from original)
		let r2 = r-r*0.1;
		let r3 = r-r*0.3;
		let w = r;
		let wper2 = w*0.5;
		let h = w;//r*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75, except info is 220 x 220
		let hper2 = wper2; //h*0.5;
		
		const tx = 18*r/5;
		const ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
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
		
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', -wper2);
		img.setAttribute('y', -hper2);
		img.setAttribute('width', w);
		img.setAttribute('height', h);
		img.setAttribute('href', './svg/info.svg');
		group.appendChild(img);
		
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', 0);
		surface.setAttributeNS(null, 'r', r);
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
	
	/*
	appendInfoButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		const rr = r*0.5;
		const r2 = rr-rr*0.2;
		const w = r2*2;
		const wper2 = w*0.5;
		
		 // 'transform' => 'translate('+tx+','+ty+')'
		const tx = 12*r/5;
		const ty = 0;
		
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
	*/
	
	appendFlexButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		
		r = r*0.8; // Smaller circle (75% from original)
		r = r*0.8; // Smaller circle (80% from original)
		let r2 = r-r*0.1;
		let r3 = r-r*0.3;
		let w = r;
		let wper2 = w*0.5;
		let h = r*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75, except info is 220 x 220
		let hper2 = h*0.5;
		
		const tx = -18*r/5;
		const ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
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
		
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', -wper2);
		img.setAttribute('y', -hper2);
		img.setAttribute('width', w);
		img.setAttribute('height', h);
		img.setAttribute('href', './svg/flex.svg');
		group.appendChild(img);
		
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', 0);
		surface.setAttributeNS(null, 'r', r);
		surface.style.stroke = DARK_BLUE;
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		
		surface.addEventListener("click", function(){
			self.models['MenuModel'].setSelected('FLEX');
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
	
	updateSavingsTextLine(id,x,y,w,h,fontsize,color,str) {
		const svgNS = 'http://www.w3.org/2000/svg';
		$('#'+id).remove(); // First remove old text from space.
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',x);
		svg.setAttribute('y',y);
		svg.setAttributeNS(null,'width',w);
		svg.setAttributeNS(null,'height',h);
		svg.id = id;
		
		const txt = document.createElementNS(svgNS, 'text');
		txt.setAttribute('x','50%');
		txt.setAttribute('y','50%');
		txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
		txt.setAttribute('font-size',fontsize);
		txt.setAttribute('dominant-baseline','middle');
		txt.setAttribute('text-anchor','middle');
		txt.setAttribute('fill',color);
		const text_node = document.createTextNode(str);
		txt.appendChild(text_node);
		svg.appendChild(txt);
		
		$('#savings-box').append(svg);
	}
	
	/*
	MONTHLY SAVINGS:

	Energy Cost:
	10 €
	17% decrease

	Energy Consumption:
	25kWh
	21% decrease

	CO2 Emissions:
	5 kg
	1% decrease
	*/
	
	updateSavingsTitle() {
		const sel = this.LANGUAGE_MODEL.selected;
		const string_title = this.LANGUAGE_MODEL['translation'][sel]['BUILDING_MONTHLY_SAVINGS'];
		const r = this.sunRadius();
		const wunit = r+r*0.25;
		const fontsize = r*0.2;
		const title_color = '#a5c5f1';
		this.updateSavingsTextLine('savings-title', 0, fontsize, 2*wunit, fontsize, fontsize, title_color, string_title);
	}
	
	updateSavingsText(prop, sums) {
		
		const sel = this.LANGUAGE_MODEL.selected;
		const string_energy_cost = this.LANGUAGE_MODEL['translation'][sel]['BUILDING_ENERGY_COST'];
		const string_energy_consumption = this.LANGUAGE_MODEL['translation'][sel]['BUILDING_ENERGY_CONSUMPTION'];
		const string_co2_emissions = this.LANGUAGE_MODEL['translation'][sel]['BUILDING_CO2_EMISSIONS'];
		const string_decrease = this.LANGUAGE_MODEL['translation'][sel]['BUILDING_OPTIMIZATION_DECREASE'];
		const string_increase = this.LANGUAGE_MODEL['translation'][sel]['BUILDING_OPTIMIZATION_INCREASE'];
		
		const r = this.sunRadius();
		const wunit = r+r*0.25;
		const fontsize = r*0.175;
		const fontsize_m = r*0.15;
		const fontsize_s = r*0.125;
		const sub_title_color = '#ccc';
		const text_color = '#fff';
		const sub_color = '#888';
		
		const opt = sums.opt.toFixed(0);
		const base = sums.base.toFixed(0);
		let percentage = 0;
		let percentage_text = '';
		if (sums.base > 0) {
			if (sums.base > sums.opt) { // decrease
				const d = sums.base - sums.opt;
				percentage = d*100/sums.base;
				percentage_text = percentage.toFixed(0) + '% '+string_decrease;
				
			} else {
				// increase
				const d = sums.opt - sums.base;
				percentage = d*100/sums.base;
				percentage_text = percentage.toFixed(0) + '% '+string_increase;
			}
		}
		
		if (prop === 'price') {
			this.updateSavingsTextLine('savings-txt-price-a', 0, 2.5*fontsize, 2*wunit, fontsize, fontsize_m, sub_title_color, string_energy_cost);
			this.updateSavingsTextLine('savings-txt-price-c', 0, 3.5*fontsize, 2*wunit, fontsize, fontsize, text_color, percentage_text);
			this.updateSavingsTextLine('savings-txt-price-b', 0, 4.5*fontsize, 2*wunit, fontsize, fontsize_s, sub_color, opt+'€  ('+base+'€)');
			
		} else if (prop === 'energy') {
			this.updateSavingsTextLine('savings-txt-energy-a', 0, 6.4*fontsize, 2*wunit, fontsize, fontsize_m, sub_title_color, string_energy_consumption);
			this.updateSavingsTextLine('savings-txt-energy-c', 0, 7.4*fontsize, 2*wunit, fontsize, fontsize, text_color, percentage_text);
			this.updateSavingsTextLine('savings-txt-energy-b', 0, 8.4*fontsize, 2*wunit, fontsize, fontsize_s, sub_color, opt+'kWh  ('+base+'kWh)');
			
		} else { // 'emissions'
			this.updateSavingsTextLine('savings-txt-emissions-a', 0, 10.3*fontsize, 2*wunit, fontsize, fontsize_m, sub_title_color, string_co2_emissions);
			this.updateSavingsTextLine('savings-txt-emissions-c', 0, 11.3*fontsize, 2*wunit, fontsize, fontsize, text_color, percentage_text);
			this.updateSavingsTextLine('savings-txt-emissions-b', 0, 12.3*fontsize, 2*wunit, fontsize, fontsize_s, sub_color, opt+'kg  ('+base+'kg)');
		}
	}
	
	appendSavingsBox() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		/*
		let w = r;
		let wper2 = w*0.5;
		let h = r*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75, except info is 220 x 220
		let hper2 = h*0.5;
		*/
		
		const wunit = r+r*0.25;
		const wunit_i = wunit-wunit*0.075; // inner rectange is 10% smaller
		const rounding = wunit*0.15; // 10% rounded corners.
		const rounding_i = wunit_i*0.15; // 10% rounded corners.
		const tx = 0;
		const ty = r; // 'transform' => 'translate('+tx+','+ty+')'
		const vb = '0 0 '+wunit*2+' '+wunit*2;
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-wunit);
		
		
		//svg.setAttribute('y',1.125*wunit);
		svg.setAttribute('y',wunit*0.75);
		
		svg.setAttributeNS(null,'width',wunit*2);
		svg.setAttributeNS(null,'height',wunit*2);
		svg.setAttributeNS(null,'viewBox',vb);
		svg.id = 'savings-box';
		//svg.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(svg);
		
		const group = document.createElementNS(svgNS, "g");
		
		const rect = document.createElementNS(svgNS, 'rect');
		rect.setAttribute('x',1);
		rect.setAttribute('y',1);
		rect.setAttribute('width',wunit*2-2);
		rect.setAttribute('height',wunit*2-2);
		rect.setAttribute('rx',rounding);
		rect.style.fill = '#f0f0f0';
		rect.style.fillOpacity = 0.5;
		rect.style.strokeOpacity = 1;
		rect.style.stroke = DARK_BLUE;
		rect.style.strokeWidth = 1;
		group.appendChild(rect);
		
		const rect_i = document.createElementNS(svgNS, 'rect');
		rect_i.setAttribute('x',wunit*0.075);
		rect_i.setAttribute('y',wunit*0.075);
		rect_i.setAttribute('width',wunit*2-wunit*0.15);
		rect_i.setAttribute('height',wunit*2-wunit*0.15);
		rect_i.setAttribute('rx',rounding_i);
		rect_i.style.fill = '#333';
		rect_i.style.fillOpacity = 1;//0.75;
		rect_i.style.strokeOpacity = 1;
		rect_i.style.stroke = DARK_BLUE;
		rect_i.style.strokeWidth = 1;
		group.appendChild(rect_i);
		
		//group.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#savings-box').append(group);
		//$('#space').append(group);
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
				//console.log('Mobile Device.');
				fontsize = '14px';
				bw = 82;
				bh = 34;
			} else if (w > 600 && w <= 992) {
				//console.log('Tablet Device.');
				fontsize = '14px';
				bw = 88;
				bh = 36;
			} else if (w > 992 && w <= 1200) {
				//console.log('Desktop Device.');
				fontsize = '16px';
				bw = 94;
				bh = 38;
			} else {
				//console.log('Large Desktop Device.');
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
	
	extractObixArray(vals) {
		const val_array = [];
		vals.forEach(v => {
			let val = +v.value; // Converts string to number.
			val_array.push({timestamp: moment(v.timestamp).toDate(), value:val});
		});
		// NEW: Sort values by the timestamp: oldest first.
		// Sort by date (timestamp is a Date).
		val_array.sort(function(a, b) {
			if (a.timestamp < b.timestamp) {
				return -1;
			}
			if (a.timestamp > b.timestamp) {
				return 1;
			}
			return 0; // dates must be equal
		});
		return val_array;
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
			// NEW: Sort values by the timestamp: oldest first.
			// Sort by date (timestamp is a Date).
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
		//console.log(['val_array=',val_array]);
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
				newdata.push({timestamp: timestamp.toDate(), value: price});
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
				// TESTING...
				this.models['FlexResultModel'].reset();
				
				console.log('PeriodicTimeoutObserver timeout!');
				Object.keys(this.models).forEach(key => {
					// MenuModel + ProxesCleanerModel + FlexResultModel + 7 models as listed below:
					//this.modelnames = [
					//'MenuBuildingElectricityPL1Model',
					//'MenuBuildingElectricityPL2Model',
					//'MenuBuildingElectricityPL3Model',
					//'MenuEmissionFactorForElectricityConsumedInFinlandModel',
					//'MenuBuildingHeatingQE01Model',
					//'EntsoeEnergyPriceModel',
					//'OptimizationModel'
					//];
					if (key === 'MenuModel' || key === 'ProxesCleanerModel' || key === 'FlexResultModel') {
						// do nothing...
						
					} else if (key === 'EntsoeEnergyPriceModel') {
						const daysToFetch = this.numberOfDays+1;
						const timerange = {begin:{value:daysToFetch,unit:'days'}};
						this.models[key].fetch(timerange);
						//this.models[key].fetch(); // The default timerange is 192 hours ( = 8 days)
						
					} else {
						//'MenuBuildingElectricityPL1Model',
						//'MenuBuildingElectricityPL2Model',
						//'MenuBuildingElectricityPL3Model',
						//'MenuEmissionFactorForElectricityConsumedInFinlandModel',
						//'MenuBuildingHeatingQE01Model',
						//'OptimizationModel'
						const daysToFetch = this.numberOfDays+1;
						this.models[key].interval = 'PT60M';
						this.models[key].timerange = {begin:{value:daysToFetch,unit:'days'},end:{value:0,unit:'days'}};
						// See: adjustSyncMinute() and adjustSyncHour() at TimeRangeView.js
						const sync_minute = 0;
						const sync_hour = moment().hour();
						console.log(['FETCH key=',key,' sync_minute=',sync_minute,' sync_hour=',sync_hour]);
						// Add empty object as dummy parameter.
						this.models[key].fetch({}, sync_minute, sync_hour);
					}
				});
				
				
			} else if (options.model==='EntsoeEnergyPriceModel' && options.method==='fetched') {
				if (options.status === 200) {
					
					const ele_prices = this.convertPriceData(); // An array of {timestamp(Date), value(price)} -objects.
					console.log(['ele_prices=',ele_prices]);
					
					this.models['FlexResultModel'].copy('ele_prices',ele_prices);
					const priceArray = this.models['FlexResultModel'].merge('ele_cons','ele_prices');
					this.models['FlexResultModel'].update('ele_price', priceArray);
					
					const sumB = this.models['FlexResultModel'].calculate('price');
					this.updateSavingsText('price', sumB);
					
					
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model === 'OptimizationModel' && options.method==='fetched') {
				if (options.status === 200) {
					// timestamp:Date, value: "0.0" or "3.0" (or "2.0")
					const vals = this.models[options.model].values;
					if (vals.length > 0) {
						const optimizations = this.extractObixArray(vals);
						
						this.models['FlexResultModel'].copy('optimizations',optimizations);
						this.models['FlexResultModel'].update('optimization', optimizations);
						// Todo: Show percentages when "base" days are compared to "optimized" days.
						
						const sumA = this.models['FlexResultModel'].calculate('energy');
						if (sumA.base > 0 && sumA.opt > 0) {
							this.updateSavingsText('energy', sumA);
						}
						const sumB = this.models['FlexResultModel'].calculate('price');
						if (sumB.base > 0 && sumB.opt > 0) {
							this.updateSavingsText('price', sumB);
						}
						const sumC = this.models['FlexResultModel'].calculate('emissions');
						if (sumC.base > 0 && sumC.opt > 0) {
							this.updateSavingsText('emissions', sumC);
						}
					}
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model === 'MenuEmissionFactorForElectricityConsumedInFinlandModel' && options.method==='fetched') {
				//console.log('NOTIFY '+options.model+' fetched!');
				//console.log(['options.status=',options.status]);
				if (options.status === 200) {
					const vals = this.models[options.model].values;
					if (vals.length > 0) {
						const ele_emission_factors = this.extractObixArray(vals);
						console.log(['ele_emission_factors=',ele_emission_factors]);
						if (ele_emission_factors.length > 0) {
							
							this.models['FlexResultModel'].copy('ele_emission_factors',ele_emission_factors);
							const emisArray = this.models['FlexResultModel'].merge('ele_cons','ele_emission_factors');
							this.models['FlexResultModel'].update('ele_emissions', emisArray);
							
							const sumC = this.models['FlexResultModel'].calculate('emissions');
							
							this.updateSavingsText('emissions', sumC);
							
						}
						// Todo: Show CO2 for ele. Merge with this.ele_cons
					}
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model === 'MenuBuildingHeatingQE01Model' && options.method==='fetched') {
				//console.log('NOTIFY '+options.model+' fetched!');
				//console.log(['options.status=',options.status]);
				if (options.status === 200) {
					const vals = this.models[options.model].values;
					if (vals.length > 0) {
						const dh_cons = this.extractObixArray(vals);
						console.log(['dh_cons=',dh_cons]);
						// Todo: Show HEATING (DH) daily POWER (use constant to scale)
						if (dh_cons.length > 0) {
							this.models['FlexResultModel'].copy('dh_cons',dh_cons);
							
							// Update FlexResultModel DH indicators.
							this.models['FlexResultModel'].update('dh_energy', dh_cons);
							this.models['FlexResultModel'].update('dh_price', dh_cons);
							this.models['FlexResultModel'].update('dh_emissions', dh_cons);
							
							const sumA = this.models['FlexResultModel'].calculate('energy');
							if (sumA.base > 0 && sumA.opt > 0) {
								this.updateSavingsText('energy', sumA);
							}
							const sumB = this.models['FlexResultModel'].calculate('price');
							if (sumB.base > 0 && sumB.opt > 0) {
								this.updateSavingsText('price', sumB);
							}
							const sumC = this.models['FlexResultModel'].calculate('emissions');
							if (sumC.base > 0 && sumC.opt > 0) {
								this.updateSavingsText('emissions', sumC);
							}
						}
					}
					
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model.indexOf('MenuBuildingElectricityPL') === 0 && options.method==='fetched') {
				//console.log('NOTIFY '+options.model+' fetched!');
				//console.log(['options.status=',options.status]);
				if (options.status === 200) {
					const vals = this.models[options.model].values;
					if (vals.length > 0) {
						const ele_cons = this.calculateSum();
						if (ele_cons.length > 0) {
							this.models['FlexResultModel'].copy('ele_cons',ele_cons);
							
							const priceArray = this.models['FlexResultModel'].merge('ele_cons','ele_prices');
							const emisArray = this.models['FlexResultModel'].merge('ele_cons','ele_emission_factors');
							
							// Update FlexResultModel ELECTRICITY indicators.
							this.models['FlexResultModel'].update('ele_energy', ele_cons);
							this.models['FlexResultModel'].update('ele_price', priceArray);
							this.models['FlexResultModel'].update('ele_emissions', emisArray);
							
							const sumA = this.models['FlexResultModel'].calculate('energy');
							if (sumA.base > 0 && sumA.opt > 0) {
								this.updateSavingsText('energy', sumA);
							}
							const sumB = this.models['FlexResultModel'].calculate('price');
							if (sumB.base > 0 && sumB.opt > 0) {
								this.updateSavingsText('price', sumB);
							}
							const sumC = this.models['FlexResultModel'].calculate('emissions');
							if (sumC.base > 0 && sumC.opt > 0) {
								this.updateSavingsText('emissions', sumC);
							}
						}
					}
					
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
			}
		}
	}
	
	renderALL() {
		console.log('renderALL()!!!!');
		$(this.el).empty();
		this.createSpace();
		
		this.appendRings(2.4);
		this.appendRings(3.3);
		this.appendLogo();
		this.appendBuilding();
		
		this.appendSun('USER');
		this.appendSun('ELECTRICITY');
		this.appendSun('HEATING');
		this.appendSun('ENVIRONMENT');
		this.appendSun('FEEDBACK');
		
		this.appendInfoButton();
		this.appendFlexButton();
		
		this.appendSavingsBox();
		this.updateSavingsTitle();
		
		this.appendLanguageSelections();
	}
	
	render() {
		console.log('MenuView render()');
		this.renderALL();
		this.rendered = true;
	}
}
