import View from '../common/View.js';
/*
iFLEX Dark blue   #1a488b ( 26,  72, 139)
iFLEX Dark green  #008245 (  0, 130,  69)
iFLEX Light green #78c51b (120, 197,  27)
*/
export default class GalaxyView extends View {
	
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
		console.log('GalaxyView show()');
		this.render();
	}
	
	hide() {
		console.log('GalaxyView hide()');
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		console.log('GalaxyView remove()');
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
		$('html').css('background-color','#ddd');
		$('body').css('background-color','#ddd');
		$('.container').css('background-color','#ddd');
		
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
			{"color":"#ddd","offset": "50%"}
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
		path.style.stroke = '#1a488b';
		path.style.strokeWidth = 2;
		path.style.opacity = 0.5;
		path.style.fill = 'none';
		$('#space').append(path);
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', cx);
		c.setAttributeNS(null, 'cy', cy);
		c.setAttributeNS(null, 'r', 5);
		c.style.stroke = '#1a488b';
		c.style.strokeWidth = 2;
		c.style.opacity = 0.5;
		c.style.fill = '#1a488b';
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
		
		const corner = 7*r/5;
		const rooftop = 9*r/5;
		const endpoint = 12*r/5;
		
		const d = 'M-'+corner+','+corner+' L-'+corner+',-'+corner+' L0,-'+rooftop+' L'+corner+',-'+corner+' L'+corner+','+corner+' Z';
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = '#1a488b';
		path.style.strokeWidth = 9;
		path.style.fill = '#1a488b';
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
		door.style.stroke = '#1a488b';
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
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/anon.svg');
			group.appendChild(img);
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
		surface.addEventListener("click", function(){
			self.models['MenuModel'].setSelected('menu');
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
	<g transform="translate(0,250)">
		<circle id="target-info-border" cx="0" cy="0" r="30" stroke="#1a488b" stroke-width="2" opacity="0.5" fill="#fff" />
		<image x="-25" y="-25" width="50" height="50" xlink:href="info.svg" />
		<circle id="target-info" class="surface" cx="0" cy="0" r="30" />
	</g>
	*/
	appendInfoButton() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		const rr = r*0.25;
		const r2 = rr-rr*0.1;
		const w = rr;
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
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', 0);
		ca.setAttributeNS(null, 'r', r2);
		ca.style.fill = WHITE;
		ca.style.fillOpacity = 0.5;
		ca.style.stroke = DARK_BLUE;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
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
			self.models['MenuModel'].setSelected('menu');
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
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log('ResizeEventObserver resize => SHOW()!');
				this.show();
			}
		}
	}
	
	render() {
		console.log('GalaxyView render()');
		this.renderALL();
		this.rendered = true;
	}
}
