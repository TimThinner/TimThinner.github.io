import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';
/*
MakingCity colors:

const WHITE = '#fff';
const BLUE = '#51b0ce';
const LIGHTGREEN = '#73d3ae';
const DARKGREEN = '#1fac78';
const LIGHTGREY = '#777';
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
		
		this.PTO = new PeriodicTimeoutObserver({interval:180000}); // interval 3 minutes.
		this.PTO.subscribe(this);
		
		this.LANGUAGE_MODEL = this.controller.master.modelRepo.get('LanguageModel');
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.rendered = false;
	}
	
	show() {
		console.log('MenuView show()');
		this.render();
		this.PTO.restart();
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
	Different states of the power system - traffic lights
		1 = green
		2 = yellow
		3 = red
		4 = black
		5 = blue
		
	https://www.fingrid.fi/en/electricity-market/power-system/different-states-of-the-power-system---traffic-lights/
	
	Different states of the power system - traffic lights
	
	1 = Green: Power system is in normal secure state.
	2 = Yellow: Power system is in endangered state. The adequacy of the electricity is endangered (serious risk for electricity shortage) or the power system doesn't fulfill the security standards.
	3 = Red: Power system is in disturbed state. Manual load shedding has taken placehappened in order to maintainkeep the adequacy and security of the power system (electricity shortage) or there is a serious risk to a wide black out.
	4 = Black: An extremely serious disturbance or a wide black out in Finland.
	5 = Blue: The network is being restored after an extremely serious disturbance or a wide blackout.
	*/
	updateFingridPowerSystemState() {
		const svg_element = document.getElementById('FingridPowerSystemState');
		let color = '#fff';
		const value = this.models['FingridPowerSystemStateModel'].value;
		if (typeof value !== 'undefined') {
			if (value === 1) {
				color = '#0f0';
			} else if (value === 2) {
				color = '#ff0';
			} else if (value === 3) {
				color = '#f00';
			} else if (value === 4) {
				color = '#000';
			} else if (value === 5) {
				color = '#00f';
			}
		}
		svg_element.style.fill = color;
	}
	
	updateSVGLeafColor(ave, last) {
		const svg_element = document.getElementById('EnvironmentLeafImage');
		// NOTE: Set FILL and STROKE according to calculated values.
		const margin = ave/10; // 10% margin
		const upper_limit = ave + margin;
		const lower_limit = ave - margin;
		
		//console.log(['last=',last,' upper_limit=', upper_limit,' lower_limit=',lower_limit])
		
		if (last > upper_limit) {
			svg_element.setAttribute('href', './svg/redleaf.svg'); // RED
		} else if (last < lower_limit) {
			svg_element.setAttribute('href', './svg/greenleaf.svg'); // GREEN
		} else {
			svg_element.setAttribute('href', './svg/yellowleaf.svg'); // YELLOW
		}
	}
	
	updateEmissionsValue() {
		// Calculate average value 
		let sum = 0;
		const resuArray = [];
		
		//console.log('ALL EmpoEmissionsModels ARE READY!!!!!!');
		
		const numOfModels = this.controller.numOfEmpoModels;
		for (let i=1; i<numOfModels+1; i++) {
			const res = this.models['EmpoEmissions'+i+'Model'].results;
			res.forEach(r=>{
				if (Number.isFinite(r.em_cons)) {
					const d = new Date(r.date_time);
					resuArray.push({date:d, cons:r.em_cons});
					sum += r.em_cons;
				}
			});
		}
		if (resuArray.length > 0) {
			// Get the last value:
			// Then sort array based according to time, oldest entry first.
			resuArray.sort(function(a,b){
				return a.date - b.date;
			});
			const last = resuArray[resuArray.length-1].cons;
			// Average:
			const ave = sum/resuArray.length;
			const vals = last.toFixed(0);
			const aves = '('+ave.toFixed(0)+')';
			//console.log(['vals=',vals,' aves=',aves]);
			/*
			this.fillSVGTextElement(svgObject, 'emissions-value', vals);
			this.fillSVGTextElement(svgObject, 'emissions-ave', aves);
			this.updateSVGLeafPathColor(ave, last);
			*/
			this.updateSVGLeafColor(ave, last);
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				// This could be just render()
				// BUT do we want to also restart PeriodicTimeoutObserver?
				this.show(); 
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Do something with each TICK!
				//
				// 'FingridPowerSystemStateModel'
				// 'EmpoEmissions1Model'
				// ...
				// 'EmpoEmissions30Model'
				Object.keys(this.models).forEach(key => {
					//console.log(['FETCH MODEL key=',key]);
					this.models[key].fetch();
				});
				
			} else if (options.model==='FingridPowerSystemStateModel' && options.method==='fetched') {
				//console.log(options.model + 'fetched!');
				//console.log(['model value=',this.models['FingridPowerSystemStateModel'].value,' values=',this.models['FingridPowerSystemStateModel'].values]);
				if (options.status === 200) {
					// Set the value to element with id='FingridPowerSystemState'
					this.updateFingridPowerSystemState();
				}
				
			} else if (options.model.indexOf('EmpoEmissions') === 0 && options.method==='fetched') {
				//console.log(options.model + 'fetched!');
				if (options.status === 200) {
					this.updateEmissionsValue();
				}
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
	
	appendGreyLines() {
		
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const STROKECOLOR = '#ccc';
		const r = this.sunRadius();
		const a = 2*r;
		const b = a;
		const rca = Math.sqrt(a*a + b*b);
		
		const cx = 0;
		let cy = 0;
		// If view is SQUARE: Put all circles to vertical center.
		// If view is PORTRAIT: Put all circles to vertical center.
		// If view is LANDSCAPE: Move all circles 10% down from vertical center.
		if (this.REO.mode === 'LANDSCAPE') {
			cy = this.REO.height*0.1;
		}
		
		const group = document.createElementNS(svgNS, "g");
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', cy);
		ca.setAttributeNS(null, 'r', rca);
		ca.style.fill = 'none';
		ca.style.stroke = STROKECOLOR;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
		const corner = Math.sin(45*Math.PI/180) * rca; // sin(45) * r;   45*PI/180
		
		let ex = -corner;
		let ey = cy-corner;
		let d = 'M'+cx+','+cy+' L'+ex+','+ey;
		const lineA = document.createElementNS(svgNS, "path");
		lineA.setAttributeNS(null, 'd', d);
		lineA.style.stroke = STROKECOLOR;
		lineA.style.strokeWidth = 1;
		lineA.style.fill = 'none';
		group.appendChild(lineA);
		
		ex = corner;
		ey = cy-corner;
		d = 'M'+cx+','+cy+' L'+ex+','+ey;
		const lineB = document.createElementNS(svgNS, "path");
		lineB.setAttributeNS(null, 'd', d);
		lineB.style.stroke = STROKECOLOR;
		lineB.style.strokeWidth = 1;
		lineB.style.fill = 'none';
		group.appendChild(lineB);
		
		ex = -corner;
		ey = cy+corner;
		d = 'M'+cx+','+cy+' L'+ex+','+ey;
		const lineC = document.createElementNS(svgNS, "path");
		lineC.setAttributeNS(null, 'd', d);
		lineC.style.stroke = STROKECOLOR;
		lineC.style.strokeWidth = 1;
		lineC.style.fill = 'none';
		group.appendChild(lineC);
		
		ex = corner;
		ey = cy+corner;
		d = 'M'+cx+','+cy+' L'+ex+','+ey;
		const lineD = document.createElementNS(svgNS, "path");
		lineD.setAttributeNS(null, 'd', d);
		lineD.style.stroke = STROKECOLOR;
		lineD.style.strokeWidth = 1;
		lineD.style.fill = 'none';
		group.appendChild(lineD);
		
		$('#space').append(group);
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
			//console.log('Mobile Device.');
			fontsize = 36; // big font 36, small font 12
			
		} else if (w > 600 && w <= 992) {
			//console.log('Tablet Device.');
			fontsize = 42; // big font 42, small font 14
			
		} else if (w > 992 && w <= 1200) {
			//console.log('Desktop Device.');
			fontsize = 54; // big font 54, small font 18
			
		} else {
			//console.log('Large Desktop Device.');
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
	
	appendSun(type) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius();
		let icon_w = 0;
		if (type === 'CITY') {
			icon_w = r*2; // Make image bigger.
			r = r*1.2; // 120%
		} else {
			icon_w = r;
			r = r*0.8; // 80%
		}
		const WHITE = '#fff';
		const LIGHTGREEN = '#73d3ae';
		const DARKGREEN = '#1fac78';
		
		let cy = 0;
		// If view is SQUARE: Put all circles to vertical center.
		// If view is PORTRAIT: Put all circles to vertical center.
		// If view is LANDSCAPE: Move all circles 10% down from vertical center.
		if (this.REO.mode === 'LANDSCAPE') {
			cy = this.REO.height*0.1;
		}
		
		const r2 = r-r*0.1;
		const r3 = r-r*0.3;
		const icon_x = -icon_w*0.5;
		const icon_h = icon_w*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
		const icon_y = cy - icon_h*0.5;
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		if (type === 'USER') {
			tx = ty = -12*r/5;
		} else if (type === 'SOLAR') {
			tx = 12*r/5;
			ty = -12*r/5;
		} else if (type === 'GRID') {
			tx = -12*r/5;
			ty = 12*r/5;
		} else if (type === 'ENVIRONMENT') {
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
		
		if (type === 'CITY') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/city.svg');
			group.appendChild(img);
			
		} else if (type === 'USER') {
			if (this.USER_MODEL.isLoggedIn()) {
				const img = document.createElementNS(svgNS, "image");
				img.setAttribute('x', icon_x);
				img.setAttribute('y', icon_y);
				img.setAttribute('width', icon_w);
				img.setAttribute('height', icon_h);
				img.setAttribute('href', './svg/user.svg');
				group.appendChild(img);
			} else {
				const img = document.createElementNS(svgNS, "image");
				img.setAttribute('x', icon_x);
				img.setAttribute('y', icon_y);
				img.setAttribute('width', icon_w);
				img.setAttribute('height', icon_h);
				img.setAttribute('href', './svg/anon.svg');
				group.appendChild(img);
			}
			
		} else if (type === 'SOLAR') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/solarpanel.svg');
			group.appendChild(img);
		} else if (type === 'GRID') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/grid.svg');
			group.appendChild(img);
			
			
			// Draw the state of the Grid indicator:
			// Circle with color
			const uc = document.createElementNS(svgNS, "circle");
			uc.setAttributeNS(null, 'id', 'FingridPowerSystemState');
			uc.setAttributeNS(null, 'cx', 0);
			uc.setAttributeNS(null, 'cy', cy);
			uc.setAttributeNS(null, 'r', r*0.2);
			uc.style.stroke = '#333';
			uc.style.strokeWidth = 1;
			uc.style.fill = '#fff'; // This will overwrite the fill: none; definition in CSS active-menu-button-path
			group.appendChild(uc);
			
		} else if (type === 'ENVIRONMENT') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/greenleaf.svg');
			img.setAttributeNS(null, 'id', 'EnvironmentLeafImage');
			group.appendChild(img);
		}
		
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', cy);
		surface.setAttributeNS(null, 'r', r);
		surface.style.stroke = LIGHTGREEN;
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		
		// Select which pages open...
		
		if (type === 'CITY') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('district');
			}, false);
			
		} else if (type === 'USER') {
			if (this.USER_MODEL.isLoggedIn()) {
				surface.addEventListener("click", function(){
					self.models['MenuModel'].setSelected('userpage');
				}, false);
			} else {
				console.log('NOT LOGGED IN!');
				surface.addEventListener("click", function(){
					self.models['MenuModel'].setSelected('userlogin');
				}, false);
			}
			
		} else if (type === 'SOLAR') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('solarpage');
			}, false);
			
		} else if (type === 'GRID') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('gridpage');
			}, false);
			
		} else if (type === 'ENVIRONMENT') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('environmentpage');
			}, false);
		}
		
		surface.addEventListener("mouseover", function(event){ 
			border.style.fill = DARKGREEN;
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
		const LIGHTGREEN = '#73d3ae';
		const DARKGREEN = '#1fac78';
		
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
		border.style.stroke = LIGHTGREEN;
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
		surface.style.stroke = LIGHTGREEN;
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		surface.addEventListener("click", function(){
			self.models['MenuModel'].setSelected('HELP');
		}, false);
		surface.addEventListener("mouseover", function(event){ 
			border.style.fill = DARKGREEN;
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
		const DARK_BLUE = '#51b0ce';
		const DARK_GREEN = '#1fac78';
		
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
		txt.setAttribute('fill',DARK_BLUE);
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
		
		const w = this.REO.width;
		const h = this.REO.height;
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
	
	/*
	640px-Flag_of_Europe.svg.png: 640 x 427
	MC.png: 330 x 330 
<rect x="478" y="278" width="104" height="104" style="stroke:#1fac78;stroke-width:2px;fill:none;" />
<image id="project" class="active-district" x="480" y="280" width="100" height="100" xlink:href="MC.png" />
<image x="610" y="280" width="149.88" height="100" xlink:href="640px-Flag_of_Europe.svg.png" />
	*/
	appendMCLinkAndEUFlag() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const DARK_BLUE = '#51b0ce';
		//const DARK_GREEN = '#1fac78';
		
		const w = this.REO.width;
		const h = this.REO.height;
		
		const img_dim = 50;
		const img_x_pos = -w*0.5+20;
		const img_y_pos = h*0.5-52; // MakingCity LINK image at the bottom left.
		
		const group = document.createElementNS(svgNS, "g");
		
		const rect = document.createElementNS(svgNS, 'rect');
		rect.setAttribute('x',img_x_pos-1);
		rect.setAttribute('y',img_y_pos-1);
		rect.setAttribute('width',img_dim+2);
		rect.setAttribute('height',img_dim+2);
		rect.style.stroke = DARK_BLUE;
		rect.style.strokeWidth = 1;
		rect.style.fill = 'none';
		group.appendChild(rect);
		
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', img_x_pos);
		img.setAttribute('y', img_y_pos);
		img.setAttribute('width', img_dim);
		img.setAttribute('height', img_dim);
		img.setAttribute('href', './img/MC.png'); // Logo original dimensions are 330 x 330 pixels.
		img.style.cursor = 'pointer';
		img.addEventListener("click", function(){
			window.open('http://makingcity.eu/', '_blank');
		}, false);
		group.appendChild(img);
		
		// Flag original dimensions are 640 x 427 pixels.
		const flag_w = 66;
		const flag_h = 44;
		const flag_x_pos = -w*0.5+80;
		const flag_y_pos = h*0.5-46;
		const flag = document.createElementNS(svgNS, "image");
		flag.setAttribute('x', flag_x_pos);
		flag.setAttribute('y', flag_y_pos);
		flag.setAttribute('width', flag_w);
		flag.setAttribute('height', flag_h);
		flag.setAttribute('href', './img/640px-Flag_of_Europe.svg.png');
		group.appendChild(flag);
		
		$('#space').append(group);
	}
	
	renderALL() {
		console.log('renderALL()!');
		$(this.el).empty();
		
		this.createSpace();
		this.appendGreyLines();
		this.appendLogo();
		
		//this.appendBuilding();
		
		this.appendSun('CITY');
		this.appendSun('USER');
		this.appendSun('SOLAR');
		this.appendSun('GRID');
		this.appendSun('ENVIRONMENT');
		
		this.appendInfoButton();
		this.appendLanguageSelections();
		this.appendMCLinkAndEUFlag();
	}
	
	render() {
		console.log('MenuView render()');
		this.renderALL();
		this.rendered = true;
	}
}
