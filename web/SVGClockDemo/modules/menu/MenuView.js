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
		
		this.PTOs = [
			new PeriodicTimeoutObserver({interval:1000,name:'second'}), // interval 1 seconds
			new PeriodicTimeoutObserver({interval:60000,name:'minute'}) // interval 60 seconds
		];
		this.PTOs.forEach(t=>{
			t.subscribe(this);
		});
		
		// colors:   in styles.css background is '#ccc'
		this.colors = {
			SPACE_FILL: '#ccc',
			CLOCK_FACE_CIRCLE_STROKE: '#000',
			CLOCK_FACE_CIRCLE_FILL: '#fff',
			CLOCK_FACE_CENTER_DOT_STROKE: '#000',
			CLOCK_FACE_CENTER_DOT_FILL: '#000',
			CLOCK_FACE_TICK_LINE_STROKE: '#000',
			CLOCK_FACE_TICK_TXT_FILL: '#888',
			CLOCK_FACE_TICK_TXT_STROKE: '#888',
			CLOCK_FACE_SECONDS_HAND: '#f00',
			CLOCK_FACE_SECONDS_CENTER_DOT_STROKE: '#000',
			CLOCK_FACE_SECONDS_CENTER_DOT_FILL: '#f00',
			CLOCK_FACE_MINUTES_HAND: '#000',
			CLOCK_FACE_HOURS_HAND: '#000',
			SECTOR_PATH_STROKE: '#888',
			SECTOR_DATENUMBER_FILL_INACTIVE: '#eee',
			SECTOR_DATENUMBER_FILL_ACTIVE: '#8f8',
			SECTOR_MONTH_FILL_INACTIVE: '#eee',
			SECTOR_MONTH_FILL_ACTIVE: '#ff8',
			SECTOR_TXT_STROKE: '#888',
			SECTOR_TXT_FILL: '#888',
			FRAME_STROKE: '#000'
		}
		this.rendered = false;
	}
	
	show() {
		console.log('MenuView show()');
		this.render();
		this.PTOs.forEach(t=>{
			t.restart();
		});
	}
	
	hide() {
		this.PTOs.forEach(t=>{
			t.stop();
		});
		this.rendered = false;
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).empty();
		let wrap = document.getElementById(this.el.slice(1));
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		}
	}
	
	remove() {
		this.PTOs.forEach(t=>{
			t.stop();
			t.unsubscribe(this);
		});
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
		rect.setAttribute('fill', this.colors.SPACE_FILL);
		
		svg.appendChild(rect);
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).append(svg);
		document.getElementById(this.el.slice(1)).appendChild(svg);
	}
	
	sunRadius() {
		const w = this.REO.width;
		const h = this.REO.height;
		const wp2 = w*0.5; // 50%
		const hp2 = h*0.5; // 50%
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
		const rh = r - r*0.4;
		
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
		
		const mm = 180 - tm*6 - ts/10;
		const xm = Math.sin(mm*Math.PI/180) * rm;
		const ym = Math.cos(mm*Math.PI/180) * rm;
		
		// th = 0 - 23   1 hour => 180 - 30 = 150 degrees
		const hh = 180 - th*30 - tm/2 - ts/120;  // 60s => 0.5 degrees => 1s = 1/120 degrees.
		const xh = Math.sin(hh*Math.PI/180) * rh;
		const yh = Math.cos(hh*Math.PI/180) * rh;
		
		// MINUTES:
		const m_hand = document.createElementNS(svgNS, "line");
		m_hand.setAttributeNS(null, 'x1', 0);
		m_hand.setAttributeNS(null, 'y1', 0);
		m_hand.setAttributeNS(null, 'x2', xm);
		m_hand.setAttributeNS(null, 'y2', ym);
		m_hand.style.stroke = this.colors.CLOCK_FACE_MINUTES_HAND;
		m_hand.style.strokeWidth = 5;
		group.appendChild(m_hand);
		
		// HOURS:
		const h_hand = document.createElementNS(svgNS, "line");
		h_hand.setAttributeNS(null, 'x1', 0);
		h_hand.setAttributeNS(null, 'y1', 0);
		h_hand.setAttributeNS(null, 'x2', xh);
		h_hand.setAttributeNS(null, 'y2', yh);
		h_hand.style.stroke = this.colors.CLOCK_FACE_HOURS_HAND;
		h_hand.style.strokeWidth = 7;
		group.appendChild(h_hand);
		
		// Small circle in center (RED):
		const cc = document.createElementNS(svgNS, "circle");
		cc.setAttributeNS(null, 'cx', 0);
		cc.setAttributeNS(null, 'cy', 0);
		cc.setAttributeNS(null, 'r', 5);
		cc.style.stroke = this.colors.CLOCK_FACE_SECONDS_CENTER_DOT_STROKE;
		cc.style.strokeWidth = 2;
		cc.style.fill = this.colors.CLOCK_FACE_SECONDS_CENTER_DOT_FILL;
		group.appendChild(cc);
		
		// SECONDS (RED):
		const s_hand = document.createElementNS(svgNS, "line");
		s_hand.setAttributeNS(null, 'x1', 0);
		s_hand.setAttributeNS(null, 'y1', 0);
		s_hand.setAttributeNS(null, 'x2', xs);
		s_hand.setAttributeNS(null, 'y2', ys);
		s_hand.style.stroke = this.colors.CLOCK_FACE_SECONDS_HAND;
		s_hand.style.strokeWidth = 2;
		group.appendChild(s_hand);
		
		document.getElementById('space').appendChild(group);
	}
	
	/*
		ri = inner radius
		ro = outer radius 
		ab = angle to begin 
		ae = angle to end
	*/
	appendSector(params) {
		
		const group = params.group;
		const ri = params.innerRadius;
		const ro = params.outerRadius;
		const ab = params.startAngle;
		const ae = params.endAngle;
		const span = params.span;
		const label = params.label;
		const fill = params.fill;
		
		const centerAngle = ab-span/2;
		const centerRadius = (ri+ro)/2;
		const xTxt = Math.sin(centerAngle*Math.PI/180) * centerRadius;
		const yTxt = Math.cos(centerAngle*Math.PI/180) * centerRadius;
		
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
		p.style.stroke = this.colors.SECTOR_PATH_STROKE;
		p.style.strokeWidth = 1;
		p.style.fill = fill;
		group.appendChild(p);
		
		// Text (label) is wrapped inside SVG-element.
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttributeNS(null, 'x', xTxt-16);
		svg.setAttributeNS(null, 'y', yTxt-10);
		svg.setAttributeNS(null, 'width', 32);
		svg.setAttributeNS(null, 'height', 20);
		
		const txt = document.createElementNS(svgNS, 'text');
		txt.setAttribute('x','50%');
		txt.setAttribute('y','50%');
		//txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
		txt.style.fontFamily = "'Open Sans', sans-serif";
		txt.style.fontSize = '16px';
		//txt.setAttribute('font-weight','bold');
		txt.setAttribute('dominant-baseline','middle');
		txt.setAttribute('text-anchor','middle');
		txt.style.fill = this.colors.SECTOR_TXT_FILL;
		txt.style.stroke = this.colors.SECTOR_TXT_STROKE;
		txt.style.strokeWidth = 1;
		const text_node = document.createTextNode(label);
		txt.appendChild(text_node);
		svg.appendChild(txt);
		
		group.appendChild(svg);
	}
	
	updateDateNumberInMonth() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		// Start by removing ALL hands (hours, minutes, seconds).
		let wrap = document.getElementById('days');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const date = moment().date(); // Number 1....31
		const dim = moment().daysInMonth();
		const dAngle = 360/dim; // angle for one day
		
		const group = document.createElementNS(svgNS, "g");
		group.id = 'days';
		
		for (let i=1; i<=dim; i++) {
			const sa = 180-(i-1)*dAngle;
			const ea = sa - dAngle;
			const span = dAngle; // The "length" of sector.
			
			let fill = this.colors.SECTOR_DATENUMBER_FILL_INACTIVE;
			if (i==date) {
				fill = this.colors.SECTOR_DATENUMBER_FILL_ACTIVE;
			}
			// SECTOR
			this.appendSector({
				group: group,
				innerRadius: r,
				outerRadius: r + r*0.3,
				startAngle: sa,
				endAngle: ea,
				span: span,
				label: i,
				fill: fill
			});
		}
		document.getElementById('space').appendChild(group);
	}
	
	updateMonth() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		// Start by removing ALL months.
		let wrap = document.getElementById('months');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const month = moment().month(); // Number 0...11
		const dim = 12;
		const mAngle = 360/dim; // angle for one month
		const label = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		
		const group = document.createElementNS(svgNS, "g");
		group.id = 'months';
		
		for (let i=0; i<dim; i++) {
			const sa = 180-i*mAngle;
			const ea = sa - mAngle;
			const span = mAngle; // The "length" of sector.
			let fill = this.colors.SECTOR_MONTH_FILL_INACTIVE;
			if (i==month) {
				fill = this.colors.SECTOR_MONTH_FILL_ACTIVE;
			}
			// SECTOR
			this.appendSector({
				group: group,
				innerRadius: r + r*0.3,
				outerRadius: r + r*0.7,
				startAngle: sa,
				endAngle: ea,
				span: span,
				label: label[i],
				fill: fill
			});
		}
		
		// The most outer black frame!
		const frameWidth = 10;
		const cf = document.createElementNS(svgNS, "circle");
		cf.setAttributeNS(null, 'cx', 0);
		cf.setAttributeNS(null, 'cy', 0);
		cf.setAttributeNS(null, 'r', r+r*0.7+frameWidth/2);
		cf.style.stroke = this.colors.FRAME_STROKE;
		cf.style.strokeWidth = frameWidth;
		cf.style.fill = 'none';
		group.appendChild(cf);
		
		document.getElementById('space').appendChild(group);
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
		line.style.stroke = this.colors.CLOCK_FACE_TICK_LINE_STROKE;
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
		txt.style.fontFamily = "'Open Sans', sans-serif";
		txt.style.fontSize = '16px';
		//txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
		//txt.setAttribute('font-size','16px');
		//txt.setAttribute('font-weight','bold');
		txt.setAttribute('dominant-baseline','middle');
		txt.setAttribute('text-anchor','middle');
		txt.style.stroke = this.colors.CLOCK_FACE_TICK_TXT_STROKE;
		txt.style.fill = this.colors.CLOCK_FACE_TICK_TXT_FILL;
		txt.style.strokeWidth = 1;
		const text_node = document.createTextNode(h);
		txt.appendChild(text_node);
		svg.appendChild(txt);
		group.appendChild(svg);
	}
	
	appendClock() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const group = document.createElementNS(svgNS, "g");
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = this.colors.CLOCK_FACE_CIRCLE_STROKE;
		c.style.strokeWidth = 9;
		c.style.fill = this.colors.CLOCK_FACE_CIRCLE_FILL;
		group.appendChild(c);
		
		const cc = document.createElementNS(svgNS, "circle");
		cc.setAttributeNS(null, 'cx', 0);
		cc.setAttributeNS(null, 'cy', 0);
		cc.setAttributeNS(null, 'r', 6);
		cc.style.stroke = this.colors.CLOCK_FACE_CENTER_DOT_STROKE;
		cc.style.strokeWidth = 2;
		cc.style.fill = this.colors.CLOCK_FACE_CENTER_DOT_FILL;
		group.appendChild(cc);
		
		const degrees = [150,120,90,60,30,0,-30,-60,-90,-120,-150,-180];
		const hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
		degrees.forEach((a,i)=>{
			// 150	120	90	60	30	0	-30	-60	-90	-120	-150	-180
			//   1	  2	 3	 4	 5	6	 7	  8	  9	  10	  11	  12
			this.appendTick(group, r, a, hours[i]);
		});
		document.getElementById('space').appendChild(group);
	}
	
	renderALL() {
		console.log('renderALL() START v6!');
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
				if (options.name==='second') {
					//console.log('PeriodicTimeoutObserver one second has elapsed!');
					if (this.rendered) {
						this.updateHands();
					}
				} else if (options.name==='minute') {
					//console.log('PeriodicTimeoutObserver one minute has elapsed!');
					if (this.rendered) {
						this.updateDateNumberInMonth();
						this.updateMonth();
					}
				}
			}
		}
	}
	
	render() {
		this.renderALL();
		this.rendered = true;
	}
}
