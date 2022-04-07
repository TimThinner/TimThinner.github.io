/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

export default class GridPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			// Subscribe to all models from Controller:
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		//this.PTO = new PeriodicTimeoutObserver({interval:180000}); // interval 3 minutes.
		this.PTO = new PeriodicTimeoutObserver({interval:60000}); // interval 1 minute.
		this.PTO.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'grid-page-view-failure';
		
		this.chart = undefined; // We have a chart!
		this.price_chart = undefined; // We have also second chart!
		
		this.table_labels = {
			'FingridPowerSystemStateModel':{'label':'Power system state','shortname':'Power State'},
			'Fingrid192Model':{'label':'Electricity production in Finland','shortname':'Production'},
			'Fingrid193Model':{'label':'Electricity consumption in Finland','shortname':'Consumption'},
			'Fingrid188Model':{'label':'Nuclear power production','shortname':'Nuclear'},
			'Fingrid191Model':{'label':'Hydro power production','shortname':'Hydro'},
			'Fingrid181Model':{'label':'Wind power production','shortname':'Wind'},
			'Fingrid205Model':{'label':'Other production','shortname':'Other'},
			'Fingrid202Model':{'label':'Industrial co-generation','shortname':'Co-gen'},
			'Fingrid201Model':{'label':'Co-generation of district heating','shortname':'Co-gen DH'},
			'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Central Swe'},
			'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Estonia'},
			'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Northern Swe'},
			'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Russia'},
			'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Norway'}
		};
		/*
		Other production inc. estimated small-scale production and reserve power plants
		*/
		
		this.category_Production = 'Prod';
		this.category_Production_and_Import = 'Prod+import';
		this.category_Consumption_and_Export = 'Cons+export';
		
		this.emissionAverages = {};
		this.priceAverages = {};
		
		// colors:   in styles.css background is '#ccc'
		this.colors = {
			SPACE_FILL: '#eee',
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
			SECTOR_FILL_GREEN: '#8f8',
			SECTOR_FILL_ORANGE: '#f80',
			SECTOR_FILL_RED: '#f00',
			SECTOR_FILL_GREY: '#eee',
			SECTOR_FILL_DARK_GREY: '#ccc',
			SECTOR_TXT_STROKE: '#888',
			SECTOR_TXT_FILL: '#888',
			FRAME_STROKE: '#000'
		}
	}
	
	show() {
		this.render();
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		if (typeof this.price_chart !== 'undefined') {
			this.price_chart.dispose();
			this.price_chart = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		if (typeof this.price_chart !== 'undefined') {
			this.price_chart.dispose();
			this.price_chart = undefined;
		}
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	/*
	getFingridPowerSystemStateColor(value) {
		let color = '#fff';
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
		return color;
	}*/
	/*
	createTrafficLight(mname, value) {
		// Draw the state of the Grid indicator:
		// Circle with color
		const svg = document.querySelector('#'+mname+'-value-svg');
		const uc = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		uc.setAttributeNS(null, 'cx', 0);
		uc.setAttributeNS(null, 'cy', 0);
		uc.setAttributeNS(null, 'r', 12);
		uc.setAttributeNS(null, 'stroke', '#555');
		uc.setAttributeNS(null, 'stroke-width', 1);
		const fc = this.getFingridPowerSystemStateColor(value);
		uc.setAttributeNS(null, 'fill', fc);
		// append the new circle to the svg
		svg.appendChild(uc);
	}*/
	
	/*
	For the clock: 
	
	{ "results": [ 
		{ "country": "FI", "date_time": "2022-04-04 09:43:40", "em_cons": 183.0017, "em_prod": 144.4801, "emdb": "EcoInvent", "id": 794585 }, 
		...
	
	
	After populate we have hourly averages in 
		
		
			For example:
			{
				"H6" : { fiveDayAve:209.456787, oneHourAve:32}
				"H7": 
				...
				"H16": 
			}
		11 key,value pairs to visualize around the clock.
		
		inner circle for emissions.
		3 colors?
		
		outer circle for price forecast.. next 11 hours?
		
	*/
	createClockSpace() {
		const w = this.REO.width-12;
		const h = this.REO.height*0.5; // Note: use only half of vertical space
		const wp2 = w*0.5;
		const hp2 = h*0.5;
		const vb = '-'+wp2+' -'+hp2+' '+w+' '+h;
		
		const svgNS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(svgNS, "svg");
		
		svg.setAttributeNS(null,'width',w);
		svg.setAttributeNS(null,'height',h);
		svg.setAttributeNS(null,'viewBox',vb);
		svg.id = 'clock-space';
		
		const rect = document.createElementNS(svgNS, 'rect');
		// Setup the <rect> element.
		rect.setAttribute('x',-wp2);
		rect.setAttribute('y',-hp2);
		rect.setAttribute('width',w);
		rect.setAttribute('height',h);
		rect.setAttribute('fill', this.colors.SPACE_FILL);
		
		svg.appendChild(rect);
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		$('#clock-placeholder').append(svg);
		//document.getElementById(this.el.slice(1)).appendChild(svg);
	}
	
	sunRadius() {
		const w = this.REO.width-12;
		const h = this.REO.height*0.5; // Note: use only half of vertical space
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
		//const ss = 180 - ts*6;
		//const xs = Math.sin(ss*Math.PI/180) * rs;
		//const ys = Math.cos(ss*Math.PI/180) * rs;
		
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
		/*const cc = document.createElementNS(svgNS, "circle");
		cc.setAttributeNS(null, 'cx', 0);
		cc.setAttributeNS(null, 'cy', 0);
		cc.setAttributeNS(null, 'r', 5);
		cc.style.stroke = this.colors.CLOCK_FACE_SECONDS_CENTER_DOT_STROKE;
		cc.style.strokeWidth = 2;
		cc.style.fill = this.colors.CLOCK_FACE_SECONDS_CENTER_DOT_FILL;
		group.appendChild(cc);
		*/
		// SECONDS (RED):
		/*
		const s_hand = document.createElementNS(svgNS, "line");
		s_hand.setAttributeNS(null, 'x1', 0);
		s_hand.setAttributeNS(null, 'y1', 0);
		s_hand.setAttributeNS(null, 'x2', xs);
		s_hand.setAttributeNS(null, 'y2', ys);
		s_hand.style.stroke = this.colors.CLOCK_FACE_SECONDS_HAND;
		s_hand.style.strokeWidth = 2;
		group.appendChild(s_hand);
		*/
		document.getElementById('clock-space').appendChild(group);
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
		/*
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
		*/
	}
	
	updatePriceText() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		// Price sectors are positioned:
		// 		innerRadius: r + r*0.3,
		//		outerRadius: r + r*0.6,
		// => text path has ARC with r + r*0.45
		const radius = r+r*0.45;
		const b_x = -radius;
		const b_y = 0;
		const r_x = radius; const r_y = radius;
		const e_x = radius;
		const e_y = 0;
		
		// Start by removing old element.
		let wrap = document.getElementById('clock-price-text');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const group = document.createElementNS(svgNS, "g");
		group.id = 'clock-price-text';
		const defs = document.createElementNS(svgNS, 'defs');
		/*
		<defs>
		<path id="MyPath" fill="none" stroke="red" d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
		</defs>*/
		// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
		
		//<path d="M-140,140 A140,140 0 0,1 140,140 Z" style="stroke:#aaa;stroke-width:12;fill:#ccc;opacity:1;" />
		const d='M '+b_x+','+b_y+' A '+r_x+','+r_y+' 0,0,1 '+e_x+','+e_y;
		const path = document.createElementNS(svgNS, "path");
		path.id = 'PricePath';
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = '#000';
		path.style.strokeWidth = 1;
		defs.appendChild(path);
		group.appendChild(defs);
		/*
		<text>
			<textPath href="#MyPath">
				Quick brown fox jumps over the lazy dog.
			</textPath>
		</text>
		*/
		const txt = document.createElementNS(svgNS, 'text');
		const txtPath = document.createElementNS(svgNS, 'textPath');
		txtPath.setAttributeNS(null, 'href', '#PricePath');
		const text_node = document.createTextNode('price forecast for the next 11 hours');
		txtPath.appendChild(text_node);
		txt.appendChild(txtPath);
		
		group.appendChild(txt);
		
		document.getElementById('clock-space').appendChild(group);
	}
	/*
		% Colour coding for the wheel
		% I take a value of 5% around the moving average to assess the "Orange" colour, above the 5% limit it is "Red" and below the "Green"
		
		emiT.cat(emiT.emissions > 1.05 * emiT.movingmean)                                       = .1 ;
		emiT.cat(emiT.emissions >= emiT.movingmean & emiT.emissions <= 1.05*emiT.movingmean)    = .5 ;
		emiT.cat(emiT.emissions < emiT.movingmean)                                              = 1 ;
		
		% For the pricing, 2 approaches can deployed, either the same approach than for the emissions <=> 5% around the moving average of the last 5 days.
		% or take a fix value of 10€cts/kWh as the limit price and around the 5% of this limit, [9.5 10.5], this is orange, green blow this point, red above the threshold (Fingrid approach).
		% For the making city project, we are taking the first appraoch <=> 5% around the moving average of the last 5 days.
		
		elsepost_array(elsepost_array > 1.05 * elsepost_array.movingmean)                                       = .1 ;
		elsepost_array(elsepost_array >= elsepost_array.movingmean & elsepost_array <= 1.05*elsepost_array.movingmean)    = .5 ;
		elsepost_array(elsepost_array < elsepost_array.movingmean)                                              = 1 ;
		
		% 0.1 = 'Red'
		% 0.5 = 'Orange'
		% 1   = 'Green'
	*/
	updatePriceForecast() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		// Start by removing ALL emissions.
		let wrap = document.getElementById('clock-price-forecast');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const mAngle = 360/12; // angle for one hour
		//const label = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		const group = document.createElementNS(svgNS, "g");
		group.id = 'clock-price-forecast';
		
		Object.keys(this.priceAverages).forEach(key => {
			// key = HN  where N = 0 ... 23
			//
			let kk = parseInt(key.slice(1));
			// map kk to 0...11
			if (kk > 11) { kk -= 12; }
			
			const sa = 180-kk*mAngle;
			const ea = sa - mAngle;
			const span = mAngle; // The "length" of sector.
			let fill = this.colors.SECTOR_FILL_DARK_GREY;
			const val = this.priceAverages[key];
			
			if (typeof val !== 'undefined' &&  
				typeof val.fiveDayAve !== 'undefined' &&  val.fiveDayAve > 0 &&
				typeof val.oneHourAve !== 'undefined' &&  val.oneHourAve > 0) {
				
				const upper_limit = val.fiveDayAve + val.fiveDayAve*0.05; // upper
				const lower_limit = val.fiveDayAve - val.fiveDayAve*0.05; // lower
				
				if (val.oneHourAve > upper_limit) {
					console.log('UPDATE PRICES key='+key+' RED!');
					fill = this.colors.SECTOR_FILL_RED;
					
				} else if (val.oneHourAve < lower_limit) {
					console.log('UPDATE PRICES key='+key+' GREEN!');
					fill = this.colors.SECTOR_FILL_GREEN;
					
				} else {
					console.log('UPDATE PRICES key='+key+' ORANGE!');
					fill = this.colors.SECTOR_FILL_ORANGE;
				}
			} else {
				console.log('UPDATE PRICES key='+key+' NO VALUES!');
			}
			// SECTOR
			this.appendSector({
				group: group,
				innerRadius: r + r*0.3,
				outerRadius: r + r*0.6,
				startAngle: sa,
				endAngle: ea,
				span: span,
				//label: label[i],
				fill: fill
			});
		});
		// The most outer black frame!
		const frameWidth = 9;
		const cf = document.createElementNS(svgNS, "circle");
		cf.setAttributeNS(null, 'cx', 0);
		cf.setAttributeNS(null, 'cy', 0);
		cf.setAttributeNS(null, 'r', r+r*0.6+frameWidth/2);
		cf.style.stroke = this.colors.FRAME_STROKE;
		cf.style.strokeWidth = frameWidth;
		cf.style.fill = 'none';
		group.appendChild(cf);
		
		document.getElementById('clock-space').appendChild(group);
	}
	
	updateEmissionsText() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		// Emissions sectors are positioned:
		//
		//		innerRadius: r,
		//		outerRadius: r + r*0.3,
		// => text path has ARC with r + r*0.15
		const radius = r+r*0.15;
		const b_x = -radius;
		const b_y = 0;
		const r_x = radius; const r_y = radius;
		const e_x = radius;
		const e_y = 0;
		
		// Start by removing old element.
		let wrap = document.getElementById('clock-emissions-text');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const group = document.createElementNS(svgNS, "g");
		group.id = 'clock-emissions-text';
		const defs = document.createElementNS(svgNS, 'defs');
		/*
		<defs>
		<path id="MyPath" fill="none" stroke="red" d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
		</defs>*/
		// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
		
		//<path d="M-140,140 A140,140 0 0,1 140,140 Z" style="stroke:#aaa;stroke-width:12;fill:#ccc;opacity:1;" />
		const d='M '+b_x+','+b_y+' A '+r_x+','+r_y+' 0,0,1 '+e_x+','+e_y;
		const path = document.createElementNS(svgNS, "path");
		path.id = 'PricePath';
		path.setAttributeNS(null, 'd', d);
		path.style.stroke = '#000';
		path.style.strokeWidth = 1;
		defs.appendChild(path);
		group.appendChild(defs);
		/*
		<text>
			<textPath href="#MyPath">
				Quick brown fox jumps over the lazy dog.
			</textPath>
		</text>
		*/
		const txt = document.createElementNS(svgNS, 'text');
		const txtPath = document.createElementNS(svgNS, 'textPath');
		txtPath.setAttributeNS(null, 'href', '#PricePath');
		const text_node = document.createTextNode('emissions from the past 11 hours');
		txtPath.appendChild(text_node);
		txt.appendChild(txtPath);
		
		group.appendChild(txt);
		
		document.getElementById('clock-space').appendChild(group);
	}
	
	updateEmissions() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		// Start by removing ALL emissions.
		let wrap = document.getElementById('clock-emissions');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const mAngle = 360/12; // angle for one hour
		//const label = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		const group = document.createElementNS(svgNS, "g");
		group.id = 'clock-emissions';
		
		Object.keys(this.emissionAverages).forEach(key => {
			// key = HN  where N = 0 ... 23
			//
			let kk = parseInt(key.slice(1));
			// map kk to 0...11
			if (kk > 11) { kk -= 12; }
			
			const sa = 180-kk*mAngle;
			const ea = sa - mAngle;
			const span = mAngle; // The "length" of sector.
			let fill = this.colors.SECTOR_FILL_DARK_GREY;
			
			const val = this.emissionAverages[key];
			if (typeof val !== 'undefined' &&  
				typeof val.fiveDayAve !== 'undefined' &&  val.fiveDayAve > 0 &&
				typeof val.oneHourAve !== 'undefined' &&  val.oneHourAve > 0) {
				
				const upper_limit = val.fiveDayAve + val.fiveDayAve*0.05; // upper
				const lower_limit = val.fiveDayAve - val.fiveDayAve*0.05; // lower
				
				if (val.oneHourAve > upper_limit) {
					console.log('UPDATE EMISSIONS key='+key+' RED!');
					fill = this.colors.SECTOR_FILL_RED;
					
				} else if (val.oneHourAve < lower_limit) {
					console.log('UPDATE EMISSIONS key='+key+' GREEN!');
					fill = this.colors.SECTOR_FILL_GREEN;
					
				} else {
					console.log('UPDATE EMISSIONS key='+key+' ORANGE!');
					fill = this.colors.SECTOR_FILL_ORANGE;
				}
			} else {
				console.log('UPDATE EMISSIONS key='+key+' NO VALUES!');
			}
			// SECTOR
			this.appendSector({
				group: group,
				innerRadius: r,
				outerRadius: r + r*0.3,
				startAngle: sa,
				endAngle: ea,
				span: span,
				//label: label[i],
				fill: fill
			});
		});
		document.getElementById('clock-space').appendChild(group);
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
		c.style.strokeWidth = 1;
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
		document.getElementById('clock-space').appendChild(group);
	}
	
	
	populatePriceValues(data) {
		
		this.priceAverages = {};
		// data is an array of {date: timestamp.toDate(), price: price} objects.
		
		// Fetched from ENTSOE data we get result in 
		// timeInterval object with two arrays, for example: start "2021-12-01T23:00Z" and end "2021-12-02T23:00Z"
		// From now-120 hours to now+36 hours
		let startMom = moment().subtract(119, 'hours');
		let endMom = moment().add(1, 'hours');
		
		let startTwoA = moment().add(1, 'hours');
		startTwoA.minutes(0);
		let startTwoB = moment().add(1, 'hours');
		startTwoB.minutes(0);
		
		startTwoA.subtract(5, 'minutes');
		startTwoB.add(5, 'minutes');
		
		if (data.length > 0) {
			for (let i=0; i<11; i++) {
				const key = 'H'+startMom.hours();
				endMom.add(1, 'hours');
				
				let sum = 0;
				let count = 0;
				let val = 0;
				
				data.forEach(r=>{
					const c = moment(r.date);
					if (c.isBetween(startMom, endMom)) {
						sum += r.price;
						count++;
					}
					if (c.isBetween(startTwoA, startTwoB)) {
						val = r.price;
					}
				});
				let ave = 0;
				if (count > 0) {
					ave = sum / count;
				}
				this.priceAverages[key] = {fiveDayAve:ave, oneHourAve:val};
				console.log(['POPULATE key=',key,' sum=',sum,' count=',count,' ave=',ave,' val=',val]);
				startMom.add(1, 'hours');
				
				startTwoA.add(1, 'hours');
				startTwoB.add(1, 'hours');
			}
		}
	}
	
	populateEmissionValues() {
		const resuArray = [];
		this.emissionAverages = {};
		
		const timerange_start_subtract_hours = this.models['EmpoEmissionsFiveDays'].timerange_start_subtract_hours;
		let startMom = moment().subtract(timerange_start_subtract_hours, 'hours'); // timerange_start_subtract_hours = 131 (120 + 11 hours)
		let endMom = moment().subtract(11, 'hours');
		let startTwo = moment().subtract(11, 'hours');
		
		const res = this.models['EmpoEmissionsFiveDays'].results;
		//console.log(['res length=',res.length]);
		if (res.length > 0) {
			// Create a Date Object from date_time:
			res.forEach(r=>{
				if (Number.isFinite(r.em_cons)) {
					const d = new Date(r.date_time);
					resuArray.push({date:d, consumed:r.em_cons});
				}
			});
		}
		if (resuArray.length > 0) {
			// Then sort array based according to time, oldest entry first.
			resuArray.sort(function(a,b){
				return a.date - b.date;
			});
			// Take a slice of resuArray and calculate average value for each hour.
			// First slice is from A to B.
			//
			// A             A - B = 5 days = 120 hours           B          C
			// |--------------------------------------------------|----------|
			// |                                                  | 11 hours |
			for (let i=0; i<11; i++) {
				const key = 'H'+startMom.hours();
				endMom.add(1, 'hours');
				
				let sum = 0;
				let count = 0;
				let sum2 = 0;
				let count2 = 0;
				resuArray.forEach(r=>{
					const c = moment(r.date);
					if (c.isBetween(startMom, endMom)) {
						sum += r.consumed;
						count++;
					}
					if (c.isBetween(startTwo, endMom)) {
						sum2 += r.consumed;
						count2++;
					}
				});
				let ave = 0;
				if (count > 0) {
					ave = sum / count;
				}
				let ave2 = 0;
				if (count2 > 0) {
					ave2 = sum2 / count2;
				}
				this.emissionAverages[key] = {fiveDayAve:ave, oneHourAve:ave2};
				console.log(['POPULATE key=',key,' sum=',sum,' count=',count,' ave=',ave,' sum2=',sum2,' count2=',count2,' ave2=',ave2]);
				startMom.add(1, 'hours');
				startTwo.add(1, 'hours');
			}
			
		} else {
			console.log('POPULATE resuArray is EMPTY!');
		}
	}
	
	addSeries(m) {
		var series = this.chart.series.push(new am4charts.ColumnSeries());
		series.columns.template.width = am4core.percent(50);
		series.columns.template.tooltipText = "{name}: {valueY.formatNumber('#.')}MW";
		series.name = this.table_labels[m].shortname;
		
		series.dataFields.categoryX = "category";
		series.dataFields.valueY = m;
		//series.dataFields.valueYShow = "totalPercent";
		series.dataItems.template.locations.categoryX = 0.5;
		series.stacked = true;
		series.tooltip.pointerOrientation = "vertical";
		
		var bullet = series.bullets.push(new am4charts.LabelBullet());
		bullet.interactionsEnabled = false;
		//bullet.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
		bullet.label.text = "{valueY.formatNumber('#.')}";
		bullet.label.fill = am4core.color("#ffffff");
		bullet.locationY = 0.5;
	}
	
	renderPriceChart() {
		const self = this;
		
		const currency = 'snt';
		const price_unit = 'kWh';
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_price = LM['translation'][sel]['GRID_PAGE_PRICE'];
		
		am4core.ready(function() {
			
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			
			//am4core.options.autoSetClassName = true;
			// Create chart
			self.price_chart = am4core.create("price-chart", am4charts.XYChart);
			self.price_chart.padding(30, 15, 30, 15);
			//self.chart.colors.step = 3;
			
			self.price_chart.numberFormatter.numberFormat = "#.##";
			self.price_chart.data = self.convertPriceData();
			
			const dateAxis = self.price_chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {
				"timeUnit": "hour",
				"count": 1
			};
			dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
			
			var valueAxis = self.price_chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " " + currency + '/' + price_unit;
			});
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_price + ': ' + currency + '/' + price_unit;
			
			var series = self.price_chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "date";
			series.dataFields.valueY = "price";
			series.tooltipText = localized_string_price + ": [bold]{valueY} "+currency+ '/' +price_unit;
			series.fillOpacity = 0.3;
			
			self.price_chart.cursor = new am4charts.XYCursor();
			self.price_chart.cursor.lineY.opacity = 0;
			self.price_chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.price_chart.scrollbarX.series.push(series);
			//dateAxis.start = 0.8;
			dateAxis.keepSelection = true;
		}); // end am4core.ready()
	}
	
	renderChart() {
		const self = this;
		am4core.ready(function() {
			
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			
			//am4core.options.autoSetClassName = true;
			// Create chart
			self.chart = am4core.create("fingrid-chart", am4charts.XYChart);
			
			// SEE: https://www.amcharts.com/demos/100-stacked-column-chart/
			
			//self.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
			
			/*
			'Fingrid192Model':{'label':'Electricity production in Finland','shortname':'Electricity Production'},
			'Fingrid193Model':{'label':'Electricity consumption in Finland','shortname':'Electricity Consumption'},
			'Fingrid188Model':{'label':'Nuclear power production','shortname':'Nuclear'},
			'Fingrid191Model':{'label':'Hydro power production','shortname':'Hydro'},
			'Fingrid181Model':{'label':'Wind power production','shortname':'Wind'},
			'Fingrid205Model':{'label':'Other production','shortname':'Other'},
			'Fingrid202Model':{'label':'Industrial co-generation','shortname':'Co-generation'},
			'Fingrid201Model':{'label':'Co-generation of district heating','shortname':'Co-generation DH'},
			'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Fin Central Swe'},
			'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Fin Estonia'},
			'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Fin Northern Swe'},
			'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Fin Rus'},
			'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Fin Norway'}
			*/
			
			// ToDo: Calculate import/export amounts at notify() and put sums into charts!
			self.chart.data = [
				{
					'category': self.category_Production,
					'none': 0
				},
				{
					'category': self.category_Production_and_Import,
					'none': 0
				},
				{
					'category': self.category_Consumption_and_Export,
					'none': 0
				}
			];
			//self.chart.colors.step = 2;
			self.chart.padding(30, 30, 10, 30);
			self.chart.legend = new am4charts.Legend();
			var categoryAxis = self.chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.grid.template.location = 0;
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			//valueAxis.max = 2000;
			//valueAxis.strictMinMax = true;
			valueAxis.extraMax = 0.1;
			valueAxis.calculateTotals = true;
			valueAxis.renderer.minWidth = 50;
			
			// SEE: https://sashamaps.net/docs/resources/20-colors/
			
			const colors = [
				'#911eb4', // Purple Production 
				'#f58231', // Orange Consumption
				
				// Prod components:
				'#4363d8', // Blue 
				'#42d4f4', // Cyan
				'#000075', // Navy 
				'#f032e6', // Magenta
				'#dcbeff', // Lavender
				'#469990', // Teal
				
				// Transfer colors (5)
				'#9a6324', // Brown
				'#3cb44b', // Green
				'#cce119', // Yellow
				'#808000', // Olive
				'#aaffc3', // Mint
				'#333333'  // Dark grey for the Total "series"
			];
			var am4colors = [];
			colors.forEach(function(hex) {
				am4colors.push(am4core.color(hex)); 
			});
			self.chart.colors.list = am4colors;
			
			Object.keys(self.table_labels).forEach(key => {
				if (key !== 'FingridPowerSystemStateModel') {
					self.addSeries(key);
				}
			});
			
			// Create series for total
			var totalSeries = self.chart.series.push(new am4charts.ColumnSeries());
			totalSeries.dataFields.valueY = "none";
			totalSeries.dataFields.categoryX = "category";
			totalSeries.stacked = true;
			totalSeries.hiddenInLegend = true;
			totalSeries.columns.template.strokeOpacity = 0;
			
			var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
			totalBullet.dy = -20;
			totalBullet.label.text = "{valueY.total.formatNumber('#.')}";
			//totalBullet.label.text = "{valueY.total}";
			totalBullet.label.hideOversized = false;
			totalBullet.label.fontSize = 18;
			
			totalBullet.label.background.fill = totalSeries.stroke;
			totalBullet.label.background.fillOpacity = 0.2;
			totalBullet.label.padding(5, 10, 5, 10);
		}); // end am4core.ready()
	}
	/*
	updateTable(mname) {
		const value = this.models[mname].value;
		// Use Moment.js to automatically change Zulu-timestamp to local time.
		const start_time = moment(this.models[mname].start_time);
		const local_start_time = start_time.format('DD.MM.YYYY HH:mm');
		
		if (mname === 'FingridPowerSystemStateModel') {
			this.createTrafficLight(mname, value);
			$('#'+mname+'-timestamp').empty().append(local_start_time);
		} else {
			$('#'+mname+'-value').empty().append(value);
			$('#'+mname+'-timestamp').empty().append(local_start_time);
		}
	}
	*/
	/*
	createTable(fid) {
		let html = '<table class="striped">'+
			'<thead>'+
				'<tr>'+
					'<th>Data</th>'+
					'<th>Value (MW)</th>'+
					'<th>Timestamp</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>';
		
		Object.keys(this.table_labels).forEach(key => {
			
			//if (key === 'FingridSolarPowerFinlandModel') {
			//	
			//}
			if (key === 'FingridPowerSystemStateModel') {
				html += '<tr>'+
					'<td>'+this.table_labels[key].label+'</td>'+
					'<td id="'+key+'-value">'+
						'<svg id="'+key+'-value-svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="-15 -15 30 30">'+
							'<circle cx="0" cy="0" r="12" fill="#fff" />'+
						'</svg>'+
					'</td>'+
					'<td id="'+key+'-timestamp"></td>'+
				'</tr>';
			} else {
				html += '<tr>'+
					'<td>'+this.table_labels[key].label+'</td>'+
					'<td id="'+key+'-value"></td>'+
					'<td id="'+key+'-timestamp"></td>'+
				'</tr>';
			}
		});
		html += '</tbody></table>';
		$(html).appendTo(fid);
	}*/
	
	/*
		Transmission can be either in to the country (import) or out of the country (export).
		The sign is negative in case of import and positive for export.
		Therefore data is dynamically generated everytime there is a new measurement.
		
		
		FIRST GROUP ('category': 'Prod'):
		'Fingrid188Model':{'label':'Nuclear power production','shortname':'Nuclear'},
		'Fingrid191Model':{'label':'Hydro power production','shortname':'Hydro'},
		'Fingrid181Model':{'label':'Wind power production','shortname':'Wind'},
		'Fingrid205Model':{'label':'Other production','shortname':'Other'},
		'Fingrid202Model':{'label':'Industrial co-generation','shortname':'Co-generation'},
		'Fingrid201Model':{'label':'Co-generation of district heating','shortname':'Co-generation DH'},
		
		
		SECOND GROUP ('category': 'Prod+import'):
		'Fingrid192Model':{'label':'Electricity production in Finland','shortname':'Electricity Production'},
		
		+ Any of the following where sign is negative:
		
		'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Fin Central Swe'},
		'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Fin Estonia'},
		'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Fin Northern Swe'},
		'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Fin Rus'},
		'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Fin Norway'}
		
		THIRD GROUP ('category': 'Cons+export'):
		'Fingrid193Model':{'label':'Electricity consumption in Finland','shortname':'Electricity Consumption'},
		
		+ Any of the following where sign is positive:
		
		'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Fin Central Swe'},
		'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Fin Estonia'},
		'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Fin Northern Swe'},
		'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Fin Rus'},
		'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Fin Norway'}
	*/
	
	/*
		p.timeInterval object with two arrays: start "2021-12-01T23:00Z" and end "2021-12-02T23:00Z"
		p.resolution array with one item "PT60M"
		
		p.Point array with 24 items
		position "1"
		price "99.12"
	*/
	convertPriceData() {
		// array of {date:..., price: ... } objects.
		const ts = this.models['EntsoeEnergyPriceModel'].timeseries;
		
		// At ENTSOE price_unit is 'MWH' and currency is 'EUR', we want to convert this to snt/kWh (c/kWh)
		// 'EUR' => 'snt' and 'MWH' => 'kWh' multiply with 100 and divide by 1000 => MULTIPLY BY 0.1!
		let currency = 'EUR';
		if (this.models['EntsoeEnergyPriceModel'].currency !== 'undefined') {
			currency = this.models['EntsoeEnergyPriceModel'].currency;
		}
		let price_unit = 'MWH';
		if (this.models['EntsoeEnergyPriceModel'].price_unit !== 'undefined') {
			price_unit = this.models['EntsoeEnergyPriceModel'].price_unit;
		}
		let factor = 1;
		if (price_unit === 'MWH') {
			factor = 0.1; // 300 EUR/MWH => 30 snt/kWh
		}
		
		const newdata = [];
		ts.forEach(t=>{
			let timestamp = moment(t.timeInterval.start);
			const reso = moment.duration(t.resolution);
			t.Point.forEach(p=>{
				const price = p.price*factor;
				newdata.push({date: timestamp.toDate(), price: price});
				// Do we need to handle the +p.position when stepping from start to end?
				timestamp.add(reso);
			});
		});
		return newdata;
	}
	
	updateChart(model_name) {
		if (typeof this.models[model_name].end_time !== 'undefined') {
			// Update the timestamp:
			const mom = moment(this.models[model_name].end_time);
			$("#update-timestamp").empty().append(mom.format('DD.MM.YYYY HH:mm:ss'));
		}
		// 'category': 'Prod':
		//'Fingrid188Model':{'label':'Nuclear power production','shortname':'Nuclear'},
		//'Fingrid191Model':{'label':'Hydro power production','shortname':'Hydro'},
		//'Fingrid181Model':{'label':'Wind power production','shortname':'Wind'},
		//'Fingrid205Model':{'label':'Other production','shortname':'Other'},
		//'Fingrid202Model':{'label':'Industrial co-generation','shortname':'Co-generation'},
		//'Fingrid201Model':{'label':'Co-generation of district heating','shortname':'Co-generation DH'},
		if (model_name === 'Fingrid188Model' ||
			model_name === 'Fingrid191Model' ||
			model_name === 'Fingrid181Model' ||
			model_name === 'Fingrid205Model' ||
			model_name === 'Fingrid202Model' ||
			model_name === 'Fingrid201Model') {
			if (typeof this.chart !== 'undefined') {
				this.chart.data.forEach(d=>{
					if (this.models[model_name].value == 0) {
						// Not included.
						delete d[model_name];
						
					} else if (this.models[model_name].value > 0) {
						if (d.category === this.category_Production) {
							d[model_name] = this.models[model_name].value;
						}
					}
				});
				this.chart.invalidateRawData();
			}
			
		// category': 'Prod+import':
		//'Fingrid192Model':{'label':'Electricity production in Finland','shortname':'Electricity Production'},
		} else if (model_name === 'Fingrid192Model') {
			
			if (typeof this.chart !== 'undefined') {
				this.chart.data.forEach(d=>{
					if (this.models[model_name].value == 0) {
						
						// Not included.
						delete d[model_name];
						
					} else if (this.models[model_name].value > 0) {
						if (d.category === this.category_Production_and_Import) {
							d[model_name] = this.models[model_name].value;
						}
					}
				});
				this.chart.invalidateRawData();
			}
			
		// category': 'Cons+export':
		//'Fingrid193Model':{'label':'Electricity consumption in Finland','shortname':'Electricity Consumption'},
		} else if (model_name === 'Fingrid193Model') {
			if (typeof this.chart !== 'undefined') {
				this.chart.data.forEach(d=>{
					if (this.models[model_name].value == 0) {
						
						// Not included.
						delete d[model_name];
						
					} else if (this.models[model_name].value > 0) {
						if (d.category === this.category_Consumption_and_Export) {
							d[model_name] = this.models[model_name].value;
						}
					}
				});
				this.chart.invalidateRawData();
			}
			
		//'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Fin Central Swe'},
		//'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Fin Estonia'},
		//'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Fin Northern Swe'},
		//'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Fin Rus'},
		//'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Fin Norway'}
		} else if (model_name === 'Fingrid89Model' || 
					model_name === 'Fingrid180Model' || 
					model_name === 'Fingrid87Model' || 
					model_name === 'Fingrid195Model' || 
					model_name === 'Fingrid187Model') {
			if (typeof this.chart !== 'undefined') {
				// SEE: https://www.amcharts.com/docs/v4/concepts/data/
				// Manipulating existing data points
				this.chart.data.forEach(d=>{
					if (this.models[model_name].value == 0) {
						
						// Not included.
						delete d[model_name];
						
					} else if (this.models[model_name].value < 0) {
						if (d.category === this.category_Production_and_Import) {
							d[model_name] = -this.models[model_name].value;
						}
						
					} else {
						if (d.category === this.category_Consumption_and_Export) {
							d[model_name] = this.models[model_name].value;
						}
					}
				});
				this.chart.invalidateRawData();
			}
		}
	}
	
	notify(options) {
		const key_array = Object.keys(this.table_labels);
		if (this.controller.visible) {
			
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				
				
				//console.log("GridPageView resize => update all models!!!!!!!!!!!!!!");
				//this.render();
				/*Object.keys(this.models).forEach(key => {
					if (key !== 'MenuModel') {
						this.updateChart(key);
					}
				});*/
				//this.renderChart();
				//this.render();
				
				console.log('ResizeEventObserver resize => SHOW()!');
				this.show();
				
				
				
				
			} else if (key_array.includes(options.model) && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						//this.updateTable(options.model);
						this.updateChart(options.model);
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					} else {
						this.render();
					}
				}
			} else if (options.model === 'EntsoeEnergyPriceModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						
						const newdata = this.convertPriceData();
						this.populatePriceValues(newdata);
						
						//console.log(['newdata=',newdata]);
						this.updatePriceForecast();
						this.updatePriceText();
						
						if (typeof this.price_chart !== 'undefined') {
							// SEE: https://www.amcharts.com/docs/v4/concepts/data/
							// Manipulating existing data points
							/*const name = options.model;
							this.chart.data.forEach(d=>{
								if (d.name === name) {
									Here we have an array of values instead of one value
									this.values = [];
									d.value = this.models[name].value;
								}
							});
							*/
							this.price_chart.data = newdata;
							this.price_chart.invalidateRawData();
							
						} else {
							console.log('RENDER CHART!');
							this.renderPriceChart();
						}
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					} else {
						this.render();
					}
				}
				
			} else if (options.model==='EmpoEmissionsFiveDays' && options.method==='fetched') {
				if (options.status === 200) {
					//const res = this.models[options.model].results;
					//console.log(['FIVE DAYS PLUS ELEVEN HOURS results=',res]);
					this.populateEmissionValues();
					this.updateEmissions();
					
				} else {
					console.log(['EmpoEmissionsFiveDays fetched status=',options.status]);
				}
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Do something with each TICK!
				
				Object.keys(this.models).forEach(key => {
					//console.log(['FETCH MODEL key=',key]);
					// Fingrid model does not need token but EntsoeModel needs token
					const UM = this.controller.master.modelRepo.get('UserModel');
					this.models[key].fetch(UM.token);
				});
				
				this.updateHands();
				//this.updateDateNumberInMonth();
				//this.updateMonth();
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
			
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_title = LM['translation'][sel]['GRID_PAGE_TITLE'];
		const localized_string_description = LM['translation'][sel]['GRID_PAGE_DESCRIPTION'];
		const localized_string_updated_header = LM['translation'][sel]['UPDATED_HEADER_TEXT'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="clock-placeholder">'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="fingrid-chart" class="extra-large-chart"></div>'+ // height = 600px
				'</div>'+
				'<div class="col s12"><p class="grid-timestamp">'+localized_string_updated_header+'<span id="update-timestamp"></span></p></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="price-chart" class="medium-chart"></div>'+ // height = 400px
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$('#back').on('click',function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		//this.createTable('#table-wrapper');
		this.renderChart();
		
		this.createClockSpace();
		this.appendClock();
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			this.handleErrorMessages(this.FELID);
			Object.keys(this.models).forEach(key => {
				if (key !== 'MenuModel') {
					this.updateChart(key);
				}
			});
			this.renderPriceChart();
		}
	}
}