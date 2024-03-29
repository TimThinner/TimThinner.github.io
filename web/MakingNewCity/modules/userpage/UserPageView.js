/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

export default class UserPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			
			console.log(['UserPageView constructor key=',key]);
			
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.PTO = new PeriodicTimeoutObserver({interval:180000}); // interval 3 minutes.
		this.PTO.subscribe(this);
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.resuArray = [];
		this.rendered = false;
	}
	
	show() {
		// Call 'UserModel' => 'refreshPointIds'
		this.USER_MODEL.refreshPointIds(); // NOTE: render() is called at notify()
		this.PTO.restart();
		
	}
	
	hide() {
		this.PTO.stop();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.USER_MODEL.unsubscribe(this);
		
		this.rendered = false;
		$(this.el).empty();
	}
	
	/*
	19.4kWh
	300W
	
	24.7°C
	36.9%
	*/
	updateValueNow(type, first, second) {
		// Remove old value.
		let wrap_f = document.getElementById(type+'-now-first');
		if (wrap_f) {
			while(wrap_f.firstChild) { 
				wrap_f.removeChild(wrap_f.firstChild);
			}
			// Append new value.
			wrap_f.appendChild(document.createTextNode(first));
		}
		
		// Remove old value.
		let wrap_s = document.getElementById(type+'-now-second');
		if (wrap_s) {
			while(wrap_s.firstChild) { 
				wrap_s.removeChild(wrap_s.firstChild);
			}
			// Append new value.
			wrap_s.appendChild(document.createTextNode(second));
		}
	}
	/*
		apartmentId: 101
​​​		averagePower: 1200
​​​		created_at: "2022-02-14T23:59:35"
​​​		impulseLastCtr: 20
​​​		impulseTotalCtr: 18797376
​​​		meterId: 1001
​​​		residentId: 1
​​​		totalEnergy: 18797.376
	*/
	convertResults() {
		let ele_now = undefined;
		let ele_zero = undefined;
		
		this.resuArray = [];
		Object.keys(this.models).forEach(key => {
			if (key === 'UserElectricityNowModel') {
				const meas = this.models[key].values; // is in normal situation an array.
				if (Array.isArray(meas) && meas.length > 0) {
					const power = meas[0].AveragePower;
					const total = meas[0].TotalEnergy;
					const d = new Date(meas[0].created_at);
					ele_now = {date:d, power:power, total:total};
				}
			} else if (key === 'UserElectricity0Model') {
				const meas = this.models[key].values; // is in normal situation an array.
				if (Array.isArray(meas) && meas.length > 0) {
					const power = meas[0].AveragePower;
					const total = meas[0].TotalEnergy;
					const d = new Date(meas[0].created_at);
					ele_zero = {date:d, power:power, total:total};
				}
			}
		});
		if (typeof ele_now !== 'undefined' && typeof ele_zero !== 'undefined') {
			const date = ele_now.date;
			const power = ele_now.power;
			const total = ele_now.total - ele_zero.total;
			this.resuArray.push({date:date, power:power, total:total});
		}
		/*
		this.resuArray = [];
		Object.keys(this.models).forEach(key => {
			if (key.indexOf('UserElectricity') === 0) {
				const meas = this.models[key].values; // is in normal situation an array.
				if (Array.isArray(meas) && meas.length > 0) {
					const total = meas[0].TotalEnergy;
					const power = meas[0].AveragePower;
					const d = new Date(meas[0].created_at);
					this.resuArray.push({date:d, total:total, power:power});
					//temp_a.push({date:d, total:total, power:power});
				}
			}
		});
		*/
	}
	
	updateHeatingNow() {
		let first = '---';
		let second = '---';
		
		// NOTE: This is how simulated data is used:
		/*const meas = this.models['UserHeatingNowModel'].measurement; // is in normal situation an array.
		if (Array.isArray(meas) && meas.length > 0) {
			
			const temp = meas[0].temperature;
			if (typeof temp !== 'undefined' && temp > 0 && temp < 100) {
				first = temp.toFixed(1)+'°C';
			}
			const humi = meas[0].humidity;
			if (typeof humi !== 'undefined' && humi > 0 && humi < 100) {
				second = humi.toFixed(1)+'%';
			}
		}
		this.updateValueNow('heating', first, second);
		*/
		const temp = this.models['UserHeatingNowModel'].measurement.temperature;
		if (typeof temp !== 'undefined' && temp > 0 && temp < 100) {
			first = temp.toFixed(1)+'°C';
		}
		const humi = this.models['UserHeatingNowModel'].measurement.humidity;
		if (typeof humi !== 'undefined' && humi > 0 && humi < 100) {
			second = humi.toFixed(1)+'%';
		}
		this.updateValueNow('heating', first, second);
	}
	
	updateElectricityNow() {
		this.convertResults();
		if (this.resuArray.length > 0) {
			let first = '---';
			let second = '---';
			const total = this.resuArray[0].total;
			if (typeof total !== 'undefined' && total >= 0) {
				first = total.toFixed(1)+'kWh';
			}
			const power = this.resuArray[0].power;
			if (typeof power !== 'undefined' && power >= 0) {
				second = power.toFixed(0)+'W';
			}
			this.updateValueNow('electricity', first, second);
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("UserPageView ResizeEventObserver resize!!!!!!!!!!!!!!");
				//this.show();
				this.render();
				
			} else if (options.model==='UserModel' && options.method==='refreshPointIds') {
				if (options.status === 200) {
					console.log('PointIds are now refreshed!');
				} else {
					console.log(['PointIds are NOT refreshed!',options.status]);
				}
				this.render();
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Models are 'MenuModel', 'UserHeatingNowModel'
				Object.keys(this.models).forEach(key => {
					console.log(['FETCH MODEL key=',key]);
					// this.USER_MODEL.point_id_a // HEATING
					// this.USER_MODEL.point_id_b, // ELECTRICITY
					// this.USER_MODEL.point_id_c  // WATER
					if (key === 'UserHeatingNowModel') {
						this.models[key].fetch(this.USER_MODEL.token, this.USER_MODEL.readkey, this.USER_MODEL.point_id_a);
					} else if (key.indexOf('UserElectricity') === 0) {
						this.models[key].fetch(this.USER_MODEL.token, this.USER_MODEL.readkey, this.USER_MODEL.point_id_b);
					}
				});
			} else if (options.model==='UserHeatingNowModel' && options.method==='fetched') {
				if (options.status === 200) {
					
					this.updateHeatingNow();
					
				} else {
					console.log(['ERROR when fetching '+options.model+': options.status=',options.status]);
				}
				
			} else if (options.model.indexOf('UserElectricity') === 0 && options.method==='fetched') {
				if (options.status === 200) {
					
					this.updateElectricityNow();
					
				} else {
					console.log(['ERROR when fetching '+options.model+': options.status=',options.status]);
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
	}*/
	
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
		
		//this.appendConnector(group, framer, endpoint, 0); // Bottom Left
		//this.appendConnector(group, framer, endpointTop, 1); // Top Left
		//this.appendConnector(group, framer, endpointTop, 2); // Top Right
		//this.appendConnector(group, framer, endpoint, 3); // Bottom Right
		//this.appendConnector(group, framer, endpoint, 4); // Bottom CENTER
		
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
	
	/*
	19.4kWh
	300W
	
	24.7°C
	36.9%
	*/
	appendValueNowTextWrapper(group, type) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		/*
		The radius of circle is 12,5% of H or W (smaller dimension).
		0,125 x 600 = 75
		0,125 x 992 = 124
		0,125 x 1200 = 150
		*/
		let fontsize;
		if (r <= 75) {
			fontsize = 16; // 18;
		} else if (r > 75 && r <= 124) {
			fontsize = 20; //22;
		} else if (r > 124 && r <= 150) {
			fontsize = 24; // 26;
		} else {
			fontsize = 28; //30;
		}
		const d_fontsize = fontsize-6;
		
		/*
		const rect_bg = document.createElementNS(svgNS, 'rect');
		rect_bg.setAttribute('x',-r);
		rect_bg.setAttribute('y',r*0.33);
		rect_bg.setAttribute('width',r*2);
		rect_bg.setAttribute('height',r*0.5);
		rect_bg.style.stroke = '#888';
		rect_bg.style.strokeWidth = 3;
		rect_bg.style.fill = 'none';
		group.appendChild(rect_bg);
		*/
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.id = type+'-now-svg';
		svg.setAttribute('x',-r);
		svg.setAttribute('y',r*0.33);
		svg.setAttributeNS(null,'width',r*2);
		svg.setAttributeNS(null,'height',r*0.5);
		
		const txt = document.createElementNS(svgNS, 'text');
		txt.id = type + '-now-first';
		txt.setAttribute('x','50%');
		txt.setAttribute('y','40%');
		txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
		txt.setAttribute('font-size',fontsize);
		txt.setAttribute('dominant-baseline','middle');
		txt.setAttribute('text-anchor','middle');
		txt.setAttribute('fill','#000');
		txt.style.opacity = 0.75;
		//txt.appendChild(document.createTextNode('19.4kWh'));
		svg.appendChild(txt);
		
		const txt2 = document.createElementNS(svgNS, 'text');
		txt2.id = type + '-now-second';
		txt2.setAttribute('x','50%');
		txt2.setAttribute('y','75%');
		txt2.setAttribute('font-family','Arial, Helvetica, sans-serif');
		txt2.setAttribute('font-size',d_fontsize);
		txt2.setAttribute('dominant-baseline','middle');
		txt2.setAttribute('text-anchor','middle');
		txt2.setAttribute('fill','#000');
		txt2.style.opacity = 0.75;
		//txt2.appendChild(document.createTextNode('300W'));
		svg.appendChild(txt2);
		
		group.appendChild(svg);
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
		
		// Make 'SETTINGS' and 'LOGOUT' smaller.
		
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
		surface.style.fill = DARKGREEN;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		/*
			#e0f2f1 teal lighten-5
			#b2dfdb teal lighten-4
			#80cbc4 teal lighten-3
		*/
		
		// What is the order here (heating, electricity, water)?
		// UM.point_id_a = ''; HEATING.
		// UM.point_id_b = ''; ELECTRICITY
		// UM.point_id_c = ''; WATER
		if (type === 'HEATING') {
			if (typeof this.USER_MODEL.point_id_a !== 'undefined' && this.USER_MODEL.point_id_a.length > 0) {
				// HEATING is enabled
				surface.addEventListener("click", function(){
					
					self.models['MenuModel'].setSelected('userheating');
					
				}, false);
				surface.addEventListener("mouseover", function(event){ 
					border.style.fill = DARKGREEN;
				}, false);
				surface.addEventListener("mouseout", function(event){ 
					border.style.fill = WHITE;
				}, false);
				
				// Add text wrapper for Heating Now measurement to be added.
				this.appendValueNowTextWrapper(group,'heating');
				
			} else { // HEATING is disabled
				surface.style.stroke = '#b2dfdb';
				surface.style.strokeWidth = 2;
				surface.style.fill = '#b2dfdb';
				surface.style.fillOpacity = 0.8;
				surface.style.cursor = 'default';
			}
		} else if (type === 'ELECTRICITY') {
			if (typeof this.USER_MODEL.point_id_b !== 'undefined' && this.USER_MODEL.point_id_b.length > 0) {
				// ELECTRICITY is enabled
				surface.addEventListener("click", function(){
					self.models['MenuModel'].setSelected('userelectricity');
				}, false);
				surface.addEventListener("mouseover", function(event){ 
					border.style.fill = DARKGREEN;
				}, false);
				surface.addEventListener("mouseout", function(event){ 
					border.style.fill = WHITE;
				}, false);
				
				// Add text wrapper for Electricity Now measurement to be added.
				this.appendValueNowTextWrapper(group,'electricity')
				
			} else { // ELECTRICITY is disabled
				surface.style.stroke = '#b2dfdb';
				surface.style.strokeWidth = 2;
				surface.style.fill = '#b2dfdb';
				surface.style.fillOpacity = 0.8;
				surface.style.cursor = 'default';
			}
		} else if (type === 'WATER') {
			if (typeof this.USER_MODEL.point_id_c !== 'undefined' && this.USER_MODEL.point_id_c.length > 0) {
				// WATER is enabled
				surface.addEventListener("click", function(){
					console.log('HEY! '+type+' CLICKED!');
				}, false);
				surface.addEventListener("mouseover", function(event){ 
					border.style.fill = DARKGREEN;
				}, false);
				surface.addEventListener("mouseout", function(event){ 
					border.style.fill = WHITE;
				}, false);
				
			} else { // WATER is disabled
				surface.style.stroke = '#b2dfdb';
				surface.style.strokeWidth = 2;
				surface.style.fill = '#b2dfdb';
				surface.style.fillOpacity = 0.8;
				surface.style.cursor = 'default';
			}
		} else if (type === 'LOGOUT') {
			surface.addEventListener("click", function(){
				// UM.logout() will do the following:
				// this.notifyAll({model:'UserModel',method:'before-logout',id:this.id,token:this.token});
				// this.reset();
				// this.store();
				// console.log('USER LOGOUT! Localstorage cleaned!');
				// setTimeout(() => this.notifyAll({model:'UserModel',method:'logout',status:200,message:'Logout OK'}), 100);
				//
				// These notifications are handled in MasterController.
				self.USER_MODEL.logout();
				
			}, false);
			surface.addEventListener("mouseover", function(event){ 
				border.style.fill = DARKGREEN;
			}, false);
			surface.addEventListener("mouseout", function(event){ 
				border.style.fill = WHITE;
			}, false);
			
			
		} else { // type === 'SETTINGS'
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('userprops');
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
		
		this.updateHeatingNow();
		this.updateElectricityNow();
	}
	
	render() {
		this.renderALL();
		this.rendered = true;
	}
}
