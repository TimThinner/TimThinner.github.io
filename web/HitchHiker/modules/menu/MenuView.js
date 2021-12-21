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
		//this.FELID = 'menuview-message';
		//this.BALLID = 'svg-ball-wrapper';
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
				if (this.rendered===true) {
					//this.createBall();
					this.createBackground();
				} else {
					this.render();
				}
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
	createBackground() {
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
		
		// Store an array of stop information for the <linearGradient>
		const stops = [
			{
				"style": "stop-color:#fff; stop-opacity:1",
				"offset": "10%"
			},
			{
				"style": "#stop-color:#eee; stop-opacity:1",
				"offset": "50%"
			},
			{
				"style": "#stop-color:#ddd; stop-opacity:1",
				"offset": "90%"
			}
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
		
		//rect.setAttribute('width', '100%');
		//rect.setAttribute('height', '100%');
		
		// Assign an id, classname, width and height
		//svg.setAttribute('width', '100%');
		//svg.setAttribute('height', '100%')
		//svg.setAttribute('version', '1.1');
		//svg.setAttribute('xmlns', svgNS);
		
		// Add the <defs> and <rect> elements to <svg>
		svg.appendChild(defs);
		svg.appendChild(rect);
		
		// Add the <svg> element to <body>
		//document.body.appendChild(svg);
		/*
		const defs = document.createElementNS(svgNS,'defs');
		svg.appendChild(defs);
		
		pathdef = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		pathdef.id = "conn1";
		pathdef.setAttributeNS(null, "d", "M264 133 L396 132");
		defs.appendChild(pathdef);
		
		const rect = document.createElementNS(svgNS,'rect');
		rect.setAttribute('x',-wp2);
		rect.setAttribute('y',-hp2);
		rect.setAttribute('width',w);
		rect.setAttribute('height',h);
		rect.setAttribute('fill','url(#grad)');
		svg.appendChild(rect);
		//document.body.appendChild(svg);
		*/
		$(this.el).append(svg);
	}
	
	createBall() {
		//$('#'+this.BALLID).empty();
		//$(this.el).empty();
		
		const w = this.REO.width-18; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height-18;
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const vb = '-'+wp2+' -'+hp2+' '+w+' '+h;
		
		console.log('CREATE SVG CIRCLE!');
		const svgNS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttributeNS(null,'width',w);
		svg.setAttributeNS(null,'height',h);
		svg.setAttributeNS(null,'viewBox',vb);
		
		
		/*var rect = document.createElementNS(svgNS,'rect');
		rect.setAttribute('x',5);
		rect.setAttribute('y',5);
		rect.setAttribute('width',500);
		rect.setAttribute('height',500);
		rect.setAttribute('fill','#95B3D7');
		svg.appendChild(rect);
		document.body.appendChild(svg);
		
		var h = document.createElement('a');
		h.setAttribute('href', 'http://www.google.com');
		var t=document.createTextNode('Hello World');
		h.appendChild(t);
		document.body.appendChild(h);*/
		const r = Math.min(wp2, hp2)*0.9;
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = '#000'; 
		c.style.fill = '#8ff';
		svg.appendChild(c);
		
		/*
		const BALLWRAPPER = document.getElementById(this.BALLID);
		if (BALLWRAPPER) {
			console.log('APPEND SVG AND BALL!!!!!');
			BALLWRAPPER.appendChild(svg);
		}
		*/
		$(this.el).append(svg);
	}
	
	render() {
		//$(this.el).empty();
		/*const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.BALLID+'"></div>'+
						'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		*/
		this.rendered = true;
		this.createBackground();
		//this.createBall();
		/*
		if (this.areModelsReady()) {
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
				$(html).appendTo('#'+this.FELID);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				this.createBall();
			}
		} else {
			console.log('MenuView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.BALLID);
		}
		*/
	}
}
