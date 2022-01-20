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
