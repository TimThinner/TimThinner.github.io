import View from '../common/View.js';

/*
#f3e5f5 purple lighten-5
#e1bee7 purple lighten-4
#ce93d8 purple lighten-3
#ba68c8 purple lighten-2
#ab47bc purple lighten-1
#9c27b0 purple
#8e24aa purple darken-1
#7b1fa2 purple darken-2
#6a1b9a purple darken-3
#4a148c purple darken-4

#e8f5e9 green lighten-5
#c8e6c9 green lighten-4
#a5d6a7 green lighten-3
#81c784 green lighten-2
#66bb6a green lighten-1
#4caf50 green
#43a047 green darken-1
#388e3c green darken-2
#2e7d32 green darken-3
#1b5e20 green darken-4

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

#e1f5fe light-blue lighten-5
#b3e5fc light-blue lighten-4
#81d4fa light-blue lighten-3
#4fc3f7 light-blue lighten-2
#29b6f6 light-blue lighten-1
#03a9f4 light-blue
#039be5 light-blue darken-1
#0288d1 light-blue darken-2
#0277bd light-blue darken-3
#01579b light-blue darken-4
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
		
		this.PTO = this.controller.PTO;
		this.PTO.subscribe(this);
		
		this.rendered = false;
		this.selectedColor = 'deep-orange';
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
		this.PTO.unsubscribe(this);
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
	
	appendButtons() {
		const self = this;
		const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		const bw = w/18;
		const bh = h/18;
		
		const svgNS = 'http://www.w3.org/2000/svg';
		
		//<rect x="120" width="100" height="100" rx="15" />
		
		// NOTE: origo is at the center of the view!
		const r_a = document.createElementNS(svgNS, "rect");
		r_a.setAttributeNS(null, 'x', bw);
		r_a.setAttributeNS(null, 'y', h/2-bh-4);
		r_a.setAttributeNS(null, 'width', bw);
		r_a.setAttributeNS(null, 'height', bh);
		r_a.setAttributeNS(null, 'rx', 10);
		if (this.selectedColor === 'deep-orange') {
			r_a.style.stroke = '#fff';
		} else {
			r_a.style.stroke = '#444';
		}
		r_a.style.strokeWidth = 3;
		r_a.style.cursor = 'pointer';
		r_a.style.fill = '#ff5722'; // 'deep-orange'
		r_a.addEventListener("click", function(){
			self.selectedColor = 'deep-orange';
			self.createSpace();
			self.appendButtons();
			self.appendMoons();
			self.appendSun();
		}, false);
		$('#space').append(r_a);
		
		const r_b = document.createElementNS(svgNS, "rect");
		r_b.setAttributeNS(null, 'x', 3*bw);
		r_b.setAttributeNS(null, 'y', h/2-bh-4);
		r_b.setAttributeNS(null, 'width', bw);
		r_b.setAttributeNS(null, 'height', bh);
		r_b.setAttributeNS(null, 'rx', 10);
		if (this.selectedColor === 'green') {
			r_b.style.stroke = '#fff';
		} else {
			r_b.style.stroke = '#444';
		}
		r_b.style.strokeWidth = 3;
		r_b.style.cursor = 'pointer';
		r_b.style.fill = '#4caf50'; //'green'
		r_b.addEventListener("click", function(){
			self.selectedColor = 'green';
			self.createSpace();
			self.appendButtons();
			self.appendMoons();
			self.appendSun();
		}, false);
		$('#space').append(r_b);
		
		const r_c = document.createElementNS(svgNS, "rect");
		r_c.setAttributeNS(null, 'x', 5*bw);
		r_c.setAttributeNS(null, 'y', h/2-bh-4);
		r_c.setAttributeNS(null, 'width', bw);
		r_c.setAttributeNS(null, 'height', bh);
		r_c.setAttributeNS(null, 'rx', 10);
		if (this.selectedColor === 'light-blue') {
			r_c.style.stroke = '#fff';
		} else {
			r_c.style.stroke = '#444';
		}
		r_c.style.strokeWidth = 3;
		r_c.style.cursor = 'pointer';
		r_c.style.fill = '#03a9f4'; //'light-blue'
		r_c.addEventListener("click", function(){
			self.selectedColor = 'light-blue';
			self.createSpace();
			self.appendButtons();
			self.appendMoons();
			self.appendSun();
		}, false);
		$('#space').append(r_c);
		
		const r_d = document.createElementNS(svgNS, "rect");
		r_d.setAttributeNS(null, 'x', 7*bw);
		r_d.setAttributeNS(null, 'y', h/2-bh-4);
		r_d.setAttributeNS(null, 'width', bw);
		r_d.setAttributeNS(null, 'height', bh);
		r_d.setAttributeNS(null, 'rx', 10);
		if (this.selectedColor === 'purple') {
			r_d.style.stroke = '#fff';
		} else {
			r_d.style.stroke = '#444';
		}
		r_d.style.strokeWidth = 3;
		r_d.style.cursor = 'pointer';
		r_d.style.fill = '#9c27b0'; //'purple'
		r_d.addEventListener("click", function(){
			self.selectedColor = 'purple';
			self.createSpace();
			self.appendButtons();
			self.appendMoons();
			self.appendSun();
		}, false);
		$('#space').append(r_d);
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
		
		// Store an array of stop information for the gradient
		var stops = [
			{"color":"#fff","offset": "10%"},
			{"color":"#000","offset": "50%"}
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
	
	appendSun() {
		const svgNS = 'http://www.w3.org/2000/svg';
		/*
			#4a148c purple darken-4
			#1b5e20 green darken-4
			#bf360c deep-orange darken-4
			#01579b light-blue darken-4
		*/
		let fill = '#ffffff';
		if (this.selectedColor === 'purple') {
			fill = '#4a148c';
		} else if (this.selectedColor === 'green') {
			fill = '#1b5e20';
		} else if  (this.selectedColor === 'deep-orange') {
			fill = '#bf360c';
		} else { // light-blue
			fill = '#01579b';
		}
		const r = this.sunRadius();
		// <a href="../index.html#HitchHiker"></a>
		const a = document.createElementNS(svgNS, "a");
		a.setAttributeNS(null,'href','../index.html#HitchHiker');
		console.log('Sun with a LINK!');
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = '#333'; 
		c.style.fill = fill;
		a.appendChild(c);
		$('#space').append(a);
	}
/*
	<circle r="5" fill="red">
		<animateMotion 
			dur="10s" 
			repeatCount="indefinite" 
			path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z" />
	</circle>
	
	SEE: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion
*/
	appendEllipticalMoon(df, rf, fillcolor, dur) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		//const group = document.createElementNS(svgNS, "g");
		/*
		<path class="a" d="M-300,0 
		A300,200 0 0,1 0,-200 
		A300,200 0 0,1 0,200 
		A300,200 0 0,1 -300,0"  />
		*/
		const rx = r+r*df; //0.9;
		const ry = r+r*df*0.15;
		const d = 'M-'+rx+',0'+
		' A'+rx+','+ry+' 0 0,1 0,-'+ry+
		' A'+rx+','+ry+' 0 0,1 0,'+ry+
		' A'+rx+','+ry+' 0 0,1 -'+rx+',0';
		const r3 = r*rf;//0.1;
		
		/*
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = '#888';
		path.style.strokeWidth = '1';
		path.style.fill = 'none';
		path.style.opacity = '1';
		$('#space').append(path);
		*/
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttribute('r', r3);
		c.setAttribute('stroke', '#333');
		c.setAttribute('stroke-width', 1);
		c.setAttribute('fill', fillcolor);
		c.setAttribute('opacity', 1);
		
		const am = document.createElementNS(svgNS, 'animateMotion');
		am.setAttribute('dur', dur);
		am.setAttribute('repeatCount', 'indefinite');
		am.setAttribute('path', d);
		c.appendChild(am);
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
	appendMoon(df, rf, fillcolor, dur, cc) {
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
		group.appendChild(path);
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttribute('cx', 0);
		c.setAttribute('cy', -r2);
		c.setAttribute('r', r3);
		c.setAttribute('stroke', '#333');
		c.setAttribute('stroke-width', 1);
		c.setAttribute('fill', fillcolor);
		c.setAttribute('opacity', 1);
		group.appendChild(c);
		
		if (typeof cc !== 'undefined') {
			const rot = document.createElementNS(svgNS, 'animateTransform');
			rot.setAttribute('attributeName', 'transform');
			rot.setAttribute('attributeType', 'XML');
			rot.setAttribute('dur', dur);
			rot.setAttribute('repeatCount', 'indefinite');
			rot.setAttribute('type', 'rotate');
			rot.setAttribute('from', '360');
			rot.setAttribute('to', '0');
			group.appendChild(rot);
		} else {
			const rot = document.createElementNS(svgNS, 'animateTransform');
			rot.setAttribute('attributeName', 'transform');
			rot.setAttribute('attributeType', 'XML');
			rot.setAttribute('dur', dur);
			rot.setAttribute('repeatCount', 'indefinite');
			rot.setAttribute('type', 'rotate');
			rot.setAttribute('from', '0');
			rot.setAttribute('to', '360');
			group.appendChild(rot);
		}
		$('#space').append(group);
	}
	/*
		purple
		green
		deep-orange
		light-blue
	*/
	appendMoons() {
		
		this.appendEllipticalMoon(0.9, 0.08, '#ffff00', '8s');
		
		if (this.selectedColor === 'deep-orange') {
			this.appendMoon(0.2, 0.10, '#d84315', '10s');
			this.appendMoon(0.3, 0.12, '#e64a19', '15s');
			this.appendMoon(0.4, 0.14, '#f4511e', '20s');
			this.appendMoon(0.5, 0.16, '#ff5722', '25s');
			this.appendMoon(0.6, 0.18, '#ff7043', '30s');
			this.appendMoon(0.7, 0.20, '#ff8a65', '35s');
			this.appendMoon(0.8, 0.22, '#ffab91', '40s');
			this.appendMoon(0.9, 0.24, '#ffccbc', '45s');
			this.appendMoon(1.0, 0.26, '#fbe9e7', '50s');
			
		} else if (this.selectedColor === 'green') {
			this.appendMoon(0.2, 0.10, '#2e7d32', '10s', true);
			this.appendMoon(0.3, 0.12, '#388e3c', '15s');
			this.appendMoon(0.4, 0.14, '#43a047', '20s');
			this.appendMoon(0.5, 0.16, '#4caf50', '25s');
			this.appendMoon(0.6, 0.18, '#66bb6a', '30s');
			this.appendMoon(0.7, 0.20, '#81c784', '35s');
			this.appendMoon(0.8, 0.22, '#a5d6a7', '40s');
			this.appendMoon(0.9, 0.24, '#c8e6c9', '45s');
			this.appendMoon(1.0, 0.26, '#e8f5e9', '50s');
			
		} else if (this.selectedColor === 'light-blue') {
			this.appendMoon(0.2, 0.10, '#0277bd', '10s', true);
			this.appendMoon(0.3, 0.12, '#0288d1', '15s');
			this.appendMoon(0.4, 0.14, '#039be5', '20s', true);
			this.appendMoon(0.5, 0.16, '#03a9f4', '25s');
			this.appendMoon(0.6, 0.18, '#29b6f6', '30s');
			this.appendMoon(0.7, 0.20, '#4fc3f7', '35s');
			this.appendMoon(0.8, 0.22, '#81d4fa', '40s');
			this.appendMoon(0.9, 0.24, '#b3e5fc', '45s');
			this.appendMoon(1.0, 0.26, '#e1f5fe', '50s');
			
		} else { //'purple' => GO CRAZY!
			this.appendMoon(0.2, 0.10, '#6a1b9a', '10s');
			this.appendMoon(0.3, 0.12, '#7b1fa2', '15s', true); // true = counter clockwise
			this.appendMoon(0.4, 0.14, '#8e24aa', '20s');
			this.appendMoon(0.5, 0.16, '#9c27b0', '25s', true);
			this.appendMoon(0.6, 0.18, '#ab47bc', '30s');
			this.appendMoon(0.7, 0.20, '#ba68c8', '35s', true);
			this.appendMoon(0.8, 0.22, '#ce93d8', '40s');
			this.appendMoon(0.9, 0.24, '#e1bee7', '45s', true);
			this.appendMoon(1.0, 0.26, '#f3e5f5', '50s');
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				this.createSpace();
				this.appendButtons();
				this.appendMoons();
				this.appendSun();
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Do something with each TICK!
				console.log('TICK');
				this.appendMoon(0.6, 0.11, '#000000', '22s');
			}
		}
	}
	
	render() {
		//$(this.el).empty(); NOTE: this.createSpace(); empties the view!
		this.rendered = true;
		this.createSpace();
		this.appendButtons();
		this.appendMoons();
		this.appendSun();
	}
}
