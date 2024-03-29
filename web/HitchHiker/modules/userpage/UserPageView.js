import View from '../common/View.js';

export default class UserPageView extends View {
	
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
		c.setAttributeNS(null, 'r', 3);
		c.style.stroke = DARK_BLUE;
		c.style.strokeWidth = 2;
		c.style.opacity = 0.5;
		c.style.fill = DARK_BLUE;
		$('#space').append(c);
	}
	
	/*
	appendConnectors() {
		const r = this.sunRadius();
		const corner = Math.sin(45*Math.PI/180) * r; // sin(45) * r;   45*PI/180
		const endpoint = 12*r/5;
		this.appendConnector(corner, endpoint, 0); // Bottom Left
		this.appendConnector(corner, endpoint, 1); // Top Left
		this.appendConnector(corner, endpoint, 2); // Top Right
		this.appendConnector(corner, endpoint, 3); // Bottom Right
	}
	*/
	/*
	The radius of circle is 12,5% of H or W (smaller dimension).
	=> circle diameter is 25% of H or W.
	*/
	appendApartment() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		
		const corner = 7*r/5;
		const framer = 8*r/5;
		const endpoint = 12*r/5;
		
		const dF = 'M-'+framer+','+framer+' L-'+framer+',-'+framer+' L'+framer+',-'+framer+' L'+framer+','+framer+' Z';
		const pathF = document.createElementNS(svgNS, "path");
		pathF.setAttributeNS(null, 'd', dF);
		pathF.style.stroke = DARK_BLUE;
		pathF.style.strokeWidth = 3;
		pathF.style.fill = '#fff';
		pathF.style.fillOpacity = 1;
		pathF.style.opacity = 0.5;
		$('#space').append(pathF);
		
		const d = 'M-'+corner+','+corner+' L-'+corner+',-'+corner+' L'+corner+',-'+corner+' L'+corner+','+corner+' Z';
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = DARK_BLUE;
		path.style.strokeWidth = 4;
		path.style.fill = '#ffffcc';
		path.style.fillOpacity = 1;
		path.style.opacity = 0.5;
		$('#space').append(path);
		
		this.appendConnector(framer, endpoint, 0); // Bottom Left
		this.appendConnector(framer, endpoint, 1); // Top Left
		this.appendConnector(framer, endpoint, 2); // Top Right
		this.appendConnector(framer, endpoint, 3); // Bottom Right
		
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
		pathLC.style.stroke = '#000';
		pathLC.style.strokeWidth = 3;
		pathLC.style.fill = DARK_BLUE;
		pathLC.style.fillOpacity = 0.75
		pathLC.style.opacity = 0.6;
		$('#space').append(pathLC);
		
		// RIGHT CURTAIN FOR HOME WINDOW!
		//<path d="M140,-140 L28,-140 A300,300 0 0 0 140,0 A400,400 0 0 0 112,140 L140,140 Z" 
		//stroke="#000" stroke-width="3" fill="#00a" fill-opacity="0.75" opacity="0.75" />
		const dRC = 'M'+corner+',-'+corner+' L'+gap+',-'+corner+
			' A300,300 0 0 0 '+corner+',0'+
			' A400,400 0 0 0 '+pad+','+corner+
			' L'+corner+','+corner+' Z';
		const pathRC = document.createElementNS(svgNS, "path");
		pathRC.setAttributeNS(null, 'd', dRC);
		pathRC.style.stroke = '#000';
		pathRC.style.strokeWidth = 3;
		pathRC.style.fill = DARK_BLUE;
		pathRC.style.fillOpacity = 0.75
		pathRC.style.opacity = 0.6;
		$('#space').append(pathRC);
	}
	
	appendSun(type) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		const r2 = r-r*0.1;
		const r3 = r-r*0.3;
		
		// All SVG images are 400 x 300 => w=r, h=r*0.75
		const w = r;
		const wper2 = w*0.5;
		const h = r*0.75; 
		const hper2 = h*0.5;
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		if (type === 'BUILDING') {
			tx = ty = -12*r/5;
		} else if (type === 'LOGOUT') {
			tx = 12*r/5;
			ty = -12*r/5;
		} else if (type === 'HEATING') {
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
			img.setAttribute('href', './svg/user.svg');
			group.appendChild(img);
		} else if (type === 'BUILDING') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/building.svg');
			group.appendChild(img);
		} else if (type === 'LOGOUT') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/logout.svg');
			group.appendChild(img);
		} else if (type === 'HEATING') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/radiator.svg');
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
		surface.addEventListener("click", function(){
			self.models['MenuModel'].setSelected('galaxy');
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
	
	renderALL() {
		console.log('renderALL()!!!!');
		$(this.el).empty();
		this.createSpace();
		this.appendApartment();
		this.appendSun('USER');
		this.appendSun('BUILDING');
		this.appendSun('LOGOUT');
		this.appendSun('HEATING');
		this.appendSun('FEEDBACK');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				this.show();
			}
		}
	}
	
	render() {
		this.renderALL();
		this.rendered = true;
	}
}
