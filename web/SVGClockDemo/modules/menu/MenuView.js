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
		console.log('MenuView show()');
		this.render();
	}
	
	hide() {
		console.log('MenuView hide()');
		this.rendered = false;
		
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).empty();
		let wrap = document.getElementById(this.el.slice(1));
		while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
	}
	
	remove() {
		console.log('MenuView remove()');
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).empty();
		let wrap = document.getElementById(this.el.slice(1));
		while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
	}
	
	createSpace() {
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
		
		const rect = document.createElementNS(svgNS, 'rect');
		// Setup the <rect> element.
		rect.setAttribute('x',-wp2);
		rect.setAttribute('y',-hp2);
		rect.setAttribute('width',w);
		rect.setAttribute('height',h);
		rect.setAttribute('fill', '#232022');
		
		svg.appendChild(rect);
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).append(svg);
		document.getElementById(this.el.slice(1)).appendChild(svg);
	}
	
	faceRadius() {
		const w = this.REO.width;
		const h = this.REO.height;
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const r = Math.min(wp2, hp2)*0.5;
		return r;
	}
	
	appendClock() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.faceRadius();
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = '#333';
		c.style.strokeWidth = 6;
		c.style.fill = '#ffffff';
		document.getElementById('space').appendChild(c);
	}
	
	renderALL() {
		console.log('renderALL()!');
		let wrap = document.getElementById(this.el.slice(1));
		while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		this.createSpace();
		this.appendClock();
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
		console.log('MenuView render()');
		this.renderALL();
		this.rendered = true;
	}
}
