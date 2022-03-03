import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

/*

Made similar clock as amCharts example here:

https://www.amcharts.com/demos-v4/clock-v4/




https://timthinner.github.io/web/SVGClockDemo/index.html

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
		
		this.PTO = new PeriodicTimeoutObserver({interval:1000}); // interval 1 seconds
		this.PTO.subscribe(this);
		
		this.rendered = false;
	}
	
	show() {
		console.log('MenuView show()');
		this.render();
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		this.rendered = false;
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).empty();
		let wrap = document.getElementById(this.el.slice(1));
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		}
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).empty();
		let wrap = document.getElementById(this.el.slice(1));
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		}
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
	
	
	
	updateHands() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		// Start by removing ALL hands (hours, minutes, seconds).
		let wrap = document.getElementById('hands');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const tim = moment();
		const ts = tim.seconds();
		const tm = tim.minutes();
		const th = tim.hours();
		
		const rs = r - r*0.1;
		const rm = r - r*0.2;
		const rh = r - r*0.3;
		
		//console.log(['Time now h=',th,' tm=',tm,' ts=',ts]);
		const group = document.createElementNS(svgNS, "g");
		group.id = 'hands';
		
		// const degrees = [150,120,90,60,30,0,-30,-60,-90,-120,-150,-180];
		// const hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
		// Each second equals 6 degrees.
		// 0 => 180
		// 1 => 174
		// ...
		// Seconds can go "one-second-at-a-time", but minutes and hours movement is calculated to be smooth.
		const ss = 180 - ts*6;
		const xs = Math.sin(ss*Math.PI/180) * rs;
		const ys = Math.cos(ss*Math.PI/180) * rs;
		
		const mm = 180 - tm*6 + ts*0.1;
		const xm = Math.sin(mm*Math.PI/180) * rm;
		const ym = Math.cos(mm*Math.PI/180) * rm;
		
		//const hh = 180 - th * 6;
		//const xh = Math.sin(hh*Math.PI/180) * rh;
		//const yh = Math.cos(hh*Math.PI/180) * rh;
		
		// MINUTES:
		const m_hand = document.createElementNS(svgNS, "line");
		m_hand.setAttributeNS(null, 'x1', 0);
		m_hand.setAttributeNS(null, 'y1', 0);
		m_hand.setAttributeNS(null, 'x2', xm);
		m_hand.setAttributeNS(null, 'y2', ym);
		m_hand.style.stroke = '#444';
		m_hand.style.strokeWidth = 4;
		group.appendChild(m_hand);
		
		// HOURS:
		/*
		const h_hand = document.createElementNS(svgNS, "line");
		h_hand.setAttributeNS(null, 'x1', 0);
		h_hand.setAttributeNS(null, 'y1', 0);
		h_hand.setAttributeNS(null, 'x2', xh);
		h_hand.setAttributeNS(null, 'y2', yh);
		h_hand.style.stroke = '#444';
		h_hand.style.strokeWidth = 4;
		group.appendChild(h_hand);*/
		
		// Small circle in center (RED):
		const cc = document.createElementNS(svgNS, "circle");
		cc.setAttributeNS(null, 'cx', 0);
		cc.setAttributeNS(null, 'cy', 0);
		cc.setAttributeNS(null, 'r', 5);
		cc.style.stroke = '#000';
		cc.style.strokeWidth = 2;
		cc.style.fill = '#f00';
		group.appendChild(cc);
		
		// SECONDS (RED):
		const s_hand = document.createElementNS(svgNS, "line");
		s_hand.setAttributeNS(null, 'x1', 0);
		s_hand.setAttributeNS(null, 'y1', 0);
		s_hand.setAttributeNS(null, 'x2', xs);
		s_hand.setAttributeNS(null, 'y2', ys);
		s_hand.style.stroke = '#f00';
		s_hand.style.strokeWidth = 3;
		group.appendChild(s_hand);
		
		document.getElementById('space').appendChild(group);
	}
	
	/*
		ri = inner radius
		ro = outer radius 
		ab = angle to begin 
		ae = angle to end
	*/
	appendSector(group, ri, ro, ab, ae) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const xbi = Math.sin(ab*Math.PI/180) * ri;
		const ybi = Math.cos(ab*Math.PI/180) * ri;
		const xbo = Math.sin(ab*Math.PI/180) * ro;
		const ybo = Math.cos(ab*Math.PI/180) * ro;
		
		const xei = Math.sin(ae*Math.PI/180) * ri;
		const yei = Math.cos(ae*Math.PI/180) * ri;
		const xeo = Math.sin(ae*Math.PI/180) * ro;
		const yeo = Math.cos(ae*Math.PI/180) * ro;
		// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
		const d='M '+xbi+','+ybi+' '+
				'L '+xbo+','+ybo+' '+
				'A '+ro+','+ro+' 0,0,1 '+xeo+','+yeo+' '+
				'L '+xei+','+yei+' '+
				'A '+ri+','+ri+' 0,0,0 '+xbi+','+ybi;
				
		const p = document.createElementNS(svgNS, "path");
		p.setAttributeNS(null, 'd', d);
		p.style.stroke = '#000';
		p.style.strokeWidth = 3;
		p.style.fill = '#0f0'; // 'none'
		group.appendChild(p);
	}
	
	appendTick(group, r, a, h) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r2 = r-r*0.1;
		const r3 = r-r*0.2;
		
		const x1 = Math.sin(a*Math.PI/180) * r;
		const y1 = Math.cos(a*Math.PI/180) * r;
		const x2 = Math.sin(a*Math.PI/180) * r2;
		const y2 = Math.cos(a*Math.PI/180) * r2;
		const x3 = Math.sin(a*Math.PI/180) * r3;
		const y3 = Math.cos(a*Math.PI/180) * r3;
		
		const line = document.createElementNS(svgNS, "line");
		line.setAttributeNS(null, 'x1', x1);
		line.setAttributeNS(null, 'y1', y1);
		line.setAttributeNS(null, 'x2', x2);
		line.setAttributeNS(null, 'y2', y2);
		line.style.stroke = '#333';
		line.style.strokeWidth = 3;
		group.appendChild(line);
		
		// TEXT is wrapped inside SVG-element.
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttributeNS(null, 'x', x3-16);
		svg.setAttributeNS(null, 'y', y3-10);
		svg.setAttributeNS(null, 'width', 32);
		svg.setAttributeNS(null, 'height', 20);
		
		const txt = document.createElementNS(svgNS, 'text');
		txt.setAttribute('x','50%');
		txt.setAttribute('y','50%');
		txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
		txt.setAttribute('font-size','16px');
		//txt.setAttribute('font-weight','bold');
		txt.setAttribute('dominant-baseline','middle');
		txt.setAttribute('text-anchor','middle');
		txt.style.fill = '#777';
		txt.style.stroke = '#777';
		txt.style.strokeWidth = 1;
		const text_node = document.createTextNode(h);
		txt.appendChild(text_node);
		svg.appendChild(txt);
		group.appendChild(svg);
	}
	
	appendDot(group, r, a, color) {
		const svgNS = 'http://www.w3.org/2000/svg';
		
		const cx = Math.sin(a*Math.PI/180) * r;
		const cy = Math.cos(a*Math.PI/180) * r;
		
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
		c.style.stroke = '#444';
		c.style.strokeWidth = 9;
		c.style.fill = '#eee';
		group.appendChild(c);
		
		const cc = document.createElementNS(svgNS, "circle");
		cc.setAttributeNS(null, 'cx', 0);
		cc.setAttributeNS(null, 'cy', 0);
		cc.setAttributeNS(null, 'r', 3);
		cc.style.stroke = '#000';
		cc.style.strokeWidth = 1;
		cc.style.fill = '#000';
		group.appendChild(cc);
		
		const degrees = [150,120,90,60,30,0,-30,-60,-90,-120,-150,-180];
		const hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
		degrees.forEach((a,i)=>{
			// 150	120	90	60	30	0	-30	-60	-90	-120	-150	-180
			//   1	  2	 3	 4	 5	6	 7	  8	  9	  10	  11	  12
			//this.appendDot(group, r, a, '#777');
			this.appendTick(group, r, a, hours[i]);
		});
		
		const ri = r;
		const ro = r + r*0.2;
		const ab = -180; // From 12
		const ae = 90;    // to 3
		this.appendSector(group, ri, ro, ab, ae);
		
		document.getElementById('space').appendChild(group);
	}
	
	renderALL() {
		console.log('renderALL() START v5!');
		let wrap = document.getElementById(this.el.slice(1));
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		}
		this.createSpace();
		this.appendClock();
		console.log('renderALL() END!');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log('ResizeEventObserver resize => SHOW()!');
				this.show();
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				
				console.log('PeriodicTimeoutObserver TIMEOUT!');
				
				if (this.rendered) {
					// Do something with each TICK!
					this.updateHands();
				} else {
					console.log('WTF?!');
				}
			}
		}
	}
	
	render() {
		this.renderALL();
		this.rendered = true;
	}
}
