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
				this.createSpace();
				this.appendMoon();
				this.appendSun();
			}
		}
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
	*/
	createSpace() {
		$(this.el).empty();
		
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
		
		// Store an array of stop information for the <linearGradient>
		const stops = [
			{"style": "stop-color:#fff; stop-opacity:1","offset": "10%"},
			{"style": "#stop-color:#eee; stop-opacity:1","offset": "50%"},
			{"style": "#stop-color:#ddd; stop-opacity:1","offset": "90%"}
		];
		const defs = document.createElementNS(svgNS, 'defs');
		const gradient = document.createElementNS(svgNS, 'radialGradient');
		const rect = document.createElementNS(svgNS, 'rect');
		
		// Parses an array of stop information and appends <stop> elements to the <linearGradient>
		for (let i = 0, length = stops.length; i < length; i++) {
			// Create a <stop> element and set its offset based on the position of the for loop.
			const stop = document.createElementNS(svgNS, 'stop');
			stop.setAttribute('offset', stops[i].offset);
			stop.setAttribute('style', stops[i].style);
			// Add the stop to the <lineargradient> element.
			gradient.appendChild(stop);
		}
		// Apply the <lineargradient> to <defs>
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
	
	appendSun() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const r = Math.min(wp2, hp2)*0.5;
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = '#000'; 
		c.style.fill = '#fff';
		$('#space').append(c);
	}
/*
<g opacity="0.75">
	<!-- A rx ry x-axis-rotation large-arc-flag sweep-flag x y -->
	<path class="compressor" d="M 80,0 L 80,-10 A 40 40 0 0 0 57,-15 M 80,0 L 80,10 A 40 40 0 0 1 57,15 A 80 80 0 0 0 57,-15" />
	<path class="compressor" d="M 80,0 L 80,-10 A 40 40 0 0 0 57,-15 M 80,0 L 80,10 A 40 40 0 0 1 57,15 A 80 80 0 0 0 57,-15" transform="rotate(-45)" />
	<path class="compressor" d="M 80,0 L 80,-10 A 40 40 0 0 0 57,-15 M 80,0 L 80,10 A 40 40 0 0 1 57,15 A 80 80 0 0 0 57,-15" transform="rotate(-90)" />
	<path class="compressor" d="M 80,0 L 80,-10 A 40 40 0 0 0 57,-15 M 80,0 L 80,10 A 40 40 0 0 1 57,15 A 80 80 0 0 0 57,-15" transform="rotate(-135)" />
	<path class="compressor" d="M 80,0 L 80,-10 A 40 40 0 0 0 57,-15 M 80,0 L 80,10 A 40 40 0 0 1 57,15 A 80 80 0 0 0 57,-15" transform="rotate(-180)" />
	<path class="compressor" d="M 80,0 L 80,-10 A 40 40 0 0 0 57,-15 M 80,0 L 80,10 A 40 40 0 0 1 57,15 A 80 80 0 0 0 57,-15" transform="rotate(-225)" />
	<path class="compressor" d="M 80,0 L 80,-10 A 40 40 0 0 0 57,-15 M 80,0 L 80,10 A 40 40 0 0 1 57,15 A 80 80 0 0 0 57,-15" transform="rotate(-270)" />
	<path class="compressor" d="M 80,0 L 80,-10 A 40 40 0 0 0 57,-15 M 80,0 L 80,10 A 40 40 0 0 1 57,15 A 80 80 0 0 0 57,-15" transform="rotate(-315)" />
	<circle cx="0" cy="0" r="60" stroke-width="3" stroke="#888" fill="#fff" />
	<!--<circle cx="0" cy="0" r="30" stroke-width="3" stroke="#888" fill="#80cbc4" />-->
	<circle cx="0" cy="0" r="30" stroke-width="3" stroke="#888" fill="#c1e5e3" />
	<animateTransform attributeName="transform" 
					attributeType="XML" 
					dur="8s" 
					repeatCount="indefinite" 
					type="rotate" 
					from="0" 
					to="360" >
	</animateTransform>
</g>
*/
	appendMoon() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const r = Math.min(wp2, hp2)*0.2;
		
		
		const group = document.createElementNS(svgNS, "g");
		
		//<path d="M-150,150 A150,150 0 0,1 150,150 Z" style="stroke:#aaa;stroke-width:12;fill:#ccc;opacity:1;" />
		//<circle cx="0" cy="-60" r="80" style="stroke:#aaa;stroke-width:10;fill:#fff;opacity:1;"/>
		//const d = 'M-'+hp2+',0 A150,150 0 0,1 150,140 Z';
		
		const r2 = r*2;
		const d = 'M0,-'+r2+' L0,'+r2;
		
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = '#000';
		path.style.strokeWidth = '1';
		path.style.fill = 'none';
		path.style.opacity = '1';
		//path.style.transform = 'scale(0.25,0.25)';
		group.appendChild(path);
		
		//	<circle cx="0" cy="0" r="60" stroke="#1a488b" stroke-width="0.5" opacity="1" fill="#fff" />
		const c = document.createElementNS(svgNS, "circle");
		c.setAttribute('cx', 0);
		c.setAttribute('cy', -r2);
		c.setAttribute('r', r);
		c.setAttribute('stroke', '#f00');
		c.setAttribute('stroke-width', 2);
		c.setAttribute('fill', '#f80');
		c.setAttribute('opacity', 1);
		group.appendChild(c);
		
		const c2 = document.createElementNS(svgNS, "circle");
		c2.setAttribute('cx', 0);
		c2.setAttribute('cy', r2);
		c2.setAttribute('r', r);
		c2.setAttribute('stroke', '#f00');
		c2.setAttribute('stroke-width', 2);
		c2.setAttribute('fill', '#0f0');
		c2.setAttribute('opacity', 1);
		group.appendChild(c2);
		
		const rot = document.createElementNS(svgNS, 'animateTransform');
		rot.setAttribute('attributeName', 'transform');
		rot.setAttribute('attributeType', 'XML');
		rot.setAttribute('dur', '60s');
		rot.setAttribute('repeatCount', 'indefinite');
		rot.setAttribute('type', 'rotate');
		rot.setAttribute('from', '0');
		rot.setAttribute('to', '360');
		group.appendChild(rot);
		
		$('#space').append(group);
	}
	
	render() {
		$(this.el).empty();
		this.rendered = true;
		this.createSpace();
		this.appendMoon();
		this.appendSun();
	}
}
