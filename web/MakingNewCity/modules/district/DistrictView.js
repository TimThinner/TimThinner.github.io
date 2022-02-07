import View from '../common/View.js';
export default class DistrictView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		this.rendered = false;
		
		console.log('DistrictView constructor v1');
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
				console.log("DistrictView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.show();
			}
		}
	}
	
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
		
		// Store an array of stop information for the gradient
		var stops = [
			{"color":"#b4dcf4","offset": "5%"},
			{"color":"#4dace6","offset": "40%"},
			{"color":"#012265","offset": "90%"}
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
	/*
	.hex {
	cursor: pointer;
	fill-opacity: 0.05;
	stroke: #fff;
	stroke-width: 1;
	fill: #012265;
}*/

	appendPolygon(id) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius();
		
		let cy = 0;
		// If view is SQUARE: Put all circles to vertical center.
		// If view is PORTRAIT: Put all circles to vertical center.
		// If view is LANDSCAPE: Move all circles 10% down from vertical center.
		if (this.REO.mode === 'LANDSCAPE') {
			cy = this.REO.height*0.1;
		}
		const p = '0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50';
		const poly = document.createElementNS(svgNS, "polygon");
		poly.setAttributeNS(null, 'points', p);
		poly.style.stroke = '#fff';
		poly.style.fill = '#012265';
		poly.style.strokeWidth = 1;
		poly.style.fillOpacity = 0.05;
		poly.style.cursor = 'pointer';
		poly.id = id;
		$('#space').append(poly);
		
		/*
		<polygon class="hex" id="hex-a" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(870,290) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-b" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(1090,410) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-c" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(1090,655) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-f" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(870,770) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-d" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(660,655) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-e" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(660,410) scale(1.3) rotate(90)" />
		*/
	}
	
	renderALL() {
		console.log('renderALL()!');
		$(this.el).empty();
		this.createSpace();
		
		this.appendPolygon("hex-a");
		/*
		<polygon class="hex" id="hex-a" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(870,290) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-b" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(1090,410) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-c" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(1090,655) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-f" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(870,770) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-d" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(660,655) scale(1.3) rotate(90)" />
		<polygon class="hex" id="hex-e" points="0,-100 -86.6,-50.0 -86.6,50 0,100 86.6,50 86.6,-50" transform="translate(660,410) scale(1.3) rotate(90)" />
		*/
	}
		
		
		
	}
	
	render() {
		this.renderALL();
		this.rendered = true;
	}
}
