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
	
	sunRadius() {
		const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const r = Math.min(wp2, hp2)*0.5;
		return r;
	}
	
	appendBackButton() {
		//const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		//const wp2 = w*0.5;
		//const hp2 = h*0.5;
		
		const y_pos = h-100;
		
		const svgNS = 'http://www.w3.org/2000/svg';
		
		/*
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttributeNS(null,'width',150);
		svg.setAttributeNS(null,'height',100);
		svg.setAttributeNS(null,'viewBox','-75 -50 150 100');
		svg.id = 'backbutton';*/
		
		const group = document.createElementNS(svgNS, "g");
		group.id = 'backbutton';
		const d_a = 'M0,-45 L50,-45 A20,20 0 0,1 70,-25 L70,25 A20,20 0 0,1 50,45 L-50,45 A20,20 0 0,1 -70,25 L-70,-25 A20,20 0 0,1 -50,-45 L0,-45';
		const path_a = document.createElementNS(svgNS, "path");
		path_a.setAttributeNS(null, 'd', d_a);
		path_a.style.stroke = '#ccc';
		path_a.style.strokeWidth = 5;
		path_a.style.fill = '#fff';
		group.appendChild(path_a);
		
		const d_b = 'M-40,0 L0,-30 L0,-10 L50,-10 L50,10 L0,10 L0,30 L-40,0 Z';
		const path_b = document.createElementNS(svgNS, "path");
		path_b.setAttributeNS(null, 'd', d_b);
		path_b.style.stroke = '#444';
		path_b.style.strokeWidth = 5;
		path_b.style.fill = '#444';
		group.appendChild(path_b);
		
		group.style.transform = 'translateY('+y_pos+'px)';
		$('#space').append(group);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				this.createSpace();
				this.appendMoon(0.3, 0.10, '#ff5722', '10s');
				this.appendMoon(0.4, 0.12, '#ff7043', '15s');
				this.appendMoon(0.5, 0.14, '#ff8a65', '20s');
				this.appendMoon(0.6, 0.16, '#ffab91', '25s');
				this.appendMoon(0.7, 0.18, '#ffccbc', '30s');
				this.appendMoon(0.8, 0.20, '#fbe9e7', '35s');
				this.appendSun();
				//this.appendBackButton();
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
		
		console.log('SET SPACE!');
		
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
		const stops = [
			{"style":"stop-color:#fff; stop-opacity:1","offset": "10%"},
			{"style":"stop-color:#eee; stop-opacity:1","offset": "50%"},
			{"style":"stop-color:#ddd; stop-opacity:1","offset": "90%"}
		];
		const defs = document.createElementNS(svgNS, 'defs');
		const gradient = document.createElementNS(svgNS, 'radialGradient');
		const rect = document.createElementNS(svgNS, 'rect');
		
		// Parses an array of stop information and appends <stop> elements to the gradient
		for (let i = 0, length = stops.length; i < length; i++) {
			// Create a <stop> element and set its offset based on the position of the for loop.
			const stop = document.createElementNS(svgNS, 'stop');
			stop.setAttribute('offset', stops[i].offset);
			stop.setAttribute('style', stops[i].style);
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
#fbe9e7 deep-orange lighten-5
#ffccbc deep-orange lighten-4
#ffab91 deep-orange lighten-3
#ff8a65 deep-orange lighten-2
#ff7043 deep-orange lighten-1
#ff5722 deep-orange
#f4511e deep-orange darken-1
#e64a19 deep-orange darken-2
#d84315 deep-orange darken-3
#bf360c deep-orange darken-4
*/
	appendSun() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = '#333'; 
		c.style.fill = '#bf360c';
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
	appendMoon(df, rf, fillcolor, dur) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		const group = document.createElementNS(svgNS, "g");
		
		const r2 = r+r*df; //0.5;
		const d = 'M0,-'+r2+' L0,'+r2;
		const r3 = r*rf;//0.1;
		
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = '#000';
		path.style.strokeWidth = '1';
		path.style.fill = 'none';
		path.style.opacity = '0';
		//path.style.transform = 'scale(0.25,0.25)';
		group.appendChild(path);
		
		//	<circle cx="0" cy="0" r="60" stroke="#1a488b" stroke-width="0.5" opacity="1" fill="#fff" />
		const c = document.createElementNS(svgNS, "circle");
		c.setAttribute('cx', 0);
		c.setAttribute('cy', -r2);
		c.setAttribute('r', r3);
		c.setAttribute('stroke', '#333');
		c.setAttribute('stroke-width', 1);
		c.setAttribute('fill', fillcolor);
		c.setAttribute('opacity', 1);
		group.appendChild(c);
		
		const rot = document.createElementNS(svgNS, 'animateTransform');
		rot.setAttribute('attributeName', 'transform');
		rot.setAttribute('attributeType', 'XML');
		rot.setAttribute('dur', dur);
		rot.setAttribute('repeatCount', 'indefinite');
		rot.setAttribute('type', 'rotate');
		rot.setAttribute('from', '0');
		rot.setAttribute('to', '360');
		group.appendChild(rot);
		
		$('#space').append(group);
	}
/*
#fbe9e7 deep-orange lighten-5
#ffccbc deep-orange lighten-4
#ffab91 deep-orange lighten-3
#ff8a65 deep-orange lighten-2
#ff7043 deep-orange lighten-1
#ff5722 deep-orange
#f4511e deep-orange darken-1
#e64a19 deep-orange darken-2
#d84315 deep-orange darken-3
#bf360c deep-orange darken-4
*/
	render() {
		$(this.el).empty();
		this.rendered = true;
		this.createSpace();
		this.appendMoon(0.3, 0.10, '#ff5722', '10s');
		this.appendMoon(0.4, 0.12, '#ff7043', '15s');
		this.appendMoon(0.5, 0.14, '#ff8a65', '20s');
		this.appendMoon(0.6, 0.16, '#ffab91', '25s');
		this.appendMoon(0.7, 0.18, '#ffccbc', '30s');
		this.appendMoon(0.8, 0.20, '#fbe9e7', '35s');
		this.appendSun();
		//this.appendBackButton();
	}
}
