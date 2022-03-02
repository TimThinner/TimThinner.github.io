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
		rect.setAttribute('fill', '#fff');
		
		svg.appendChild(rect);
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).append(svg);
		document.getElementById(this.el.slice(1)).appendChild(svg);
	}
	
	sunRadius() {
		const w = this.REO.width;
		const h = this.REO.height;
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const r = Math.min(wp2, hp2)*0.5; // r = 25% of width (or height).
		return r;
	}
	
	appendTick(group, r, v, h) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r2 = r-r*0.1;
		
		const x1 = Math.sin(v*Math.PI/180) * r;
		const y1 = Math.cos(v*Math.PI/180) * r;
		const x2 = Math.sin(v*Math.PI/180) * r2;
		const y2 = Math.cos(v*Math.PI/180) * r2;
		
		const line = document.createElementNS(svgNS, "line");
		line.setAttributeNS(null, 'x1', x1);
		line.setAttributeNS(null, 'y1', y1);
		line.setAttributeNS(null, 'x2', x2);
		line.setAttributeNS(null, 'y2', y2);
		line.style.stroke = '#333';
		line.style.strokeWidth = 3;
		group.appendChild(line);
	}
	
	appendDot(group, r, v, color) {
		const svgNS = 'http://www.w3.org/2000/svg';
		
		const cx = Math.sin(v*Math.PI/180) * r;
		const cy = Math.cos(v*Math.PI/180) * r;
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', cx);
		c.setAttributeNS(null, 'cy', cy);
		c.setAttributeNS(null, 'r', 4);
		c.style.stroke = '#333';
		c.style.strokeWidth = 2;
		c.style.fill = color;
		group.appendChild(c);
	}
	
	appendClock() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const group = document.createElementNS(svgNS, "g");
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = '#000';
		c.style.strokeWidth = 10;
		c.style.fill = '#fff';
		group.appendChild(c);
		
		const degrees = [150,120,90,60,30,0,-30,-60,-90,-120,-150,-180];
		const hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
		degrees.forEach((v,i)=>{
			// 150	120	90	60	30	0	-30	-60	-90	-120	-150	-180
			//   1	  2	 3	 4	 5	6	 7	  8	  9	  10	  11	  12
			this.appendDot(group, r, v, '#777');
			this.appendTick(group, r, v, hours[i]);
		});
		document.getElementById('space').appendChild(group);
	}
	
	renderALL() {
		console.log('renderALL() v2!');
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
