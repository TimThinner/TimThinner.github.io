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
			SECTOR_DATENUMBER_FILL_INACTIVE: '#eee',
			SECTOR_DATENUMBER_FILL_ACTIVE: '#8f8',
			SECTOR_MONTH_FILL_INACTIVE: '#eee',
			SECTOR_MONTH_FILL_ACTIVE: '#ff8',
			SECTOR_EMISS_TXT_COLOR: '#484',
			SECTOR_PRICE_TXT_COLOR: '#844',
			FRAME_STROKE: '#000', // outer thick frame color
			// And also these from MakingCity code:
			SECTOR_FILL_GREEN: '#8f8',
			SECTOR_FILL_ORANGE: '#fc0',
			SECTOR_FILL_RED: '#f44',
			SECTOR_FILL_GREY: '#eee',
			SECTOR_FILL_DARK_GREY: '#ccc'
		}
		
		this.emissionAverages = {
			/*
			'H0': {fiveDayAve: 20, oneHourAve: 3 },
			'H1': {fiveDayAve: 20, oneHourAve: 3 },
			'H2': {fiveDayAve: 20, oneHourAve: 3 },
			'H3': {fiveDayAve: 20, oneHourAve: 3 },
			'H4': {fiveDayAve: 20, oneHourAve: 33 },
			'H5': {fiveDayAve: 20, oneHourAve: 43 },
			'H6': {fiveDayAve: 20, oneHourAve: 3 },
			'H7': {fiveDayAve: 20, oneHourAve: 3 },
			'H8': {fiveDayAve: 20, oneHourAve: 21 },
			'H9': {fiveDayAve: 20, oneHourAve: 3 },
			'H10': {fiveDayAve: 20, oneHourAve: 33 },
			'H11': {fiveDayAve: 20, oneHourAve: 3 },
			'H12': {fiveDayAve: 20, oneHourAve: 3 },
			'H13': {fiveDayAve: 20, oneHourAve: 3 },
			'H14': {fiveDayAve: 20, oneHourAve: 3 },
			'H15': {fiveDayAve: 20, oneHourAve: 3 },
			'H16': {fiveDayAve: 20, oneHourAve: 3 },
			'H17': {fiveDayAve: 20, oneHourAve: 33 },
			'H18': {fiveDayAve: 20, oneHourAve: 43 },
			'H19': {fiveDayAve: 20, oneHourAve: 3 },
			'H20': {fiveDayAve: 20, oneHourAve: 3 },
			'H21': {fiveDayAve: 20, oneHourAve: 21 },
			'H22': {fiveDayAve: 20, oneHourAve: 3 },
			'H23': {fiveDayAve: 20, oneHourAve: 33 }
			*/
		};
		this.priceAverages = {
			/*
			'H0': {fiveDayAve: 20, oneHourAve: 3 },
			'H1': {fiveDayAve: 20, oneHourAve: 3 },
			'H2': {fiveDayAve: 20, oneHourAve: 3 },
			'H3': {fiveDayAve: 20, oneHourAve: 3 },
			'H4': {fiveDayAve: 20, oneHourAve: 33 },
			'H5': {fiveDayAve: 20, oneHourAve: 43 },
			'H6': {fiveDayAve: 20, oneHourAve: 3 },
			'H7': {fiveDayAve: 20, oneHourAve: 3 },
			'H8': {fiveDayAve: 20, oneHourAve: 21 },
			'H9': {fiveDayAve: 20, oneHourAve: 3 },
			'H10': {fiveDayAve: 20, oneHourAve: 33 },
			'H11': {fiveDayAve: 20, oneHourAve: 3 },
			'H12': {fiveDayAve: 20, oneHourAve: 3 },
			'H13': {fiveDayAve: 20, oneHourAve: 3 },
			'H14': {fiveDayAve: 20, oneHourAve: 3 },
			'H15': {fiveDayAve: 20, oneHourAve: 3 },
			'H16': {fiveDayAve: 20, oneHourAve: 3 },
			'H17': {fiveDayAve: 20, oneHourAve: 33 },
			'H18': {fiveDayAve: 20, oneHourAve: 43 },
			'H19': {fiveDayAve: 20, oneHourAve: 3 },
			'H20': {fiveDayAve: 20, oneHourAve: 3 },
			'H21': {fiveDayAve: 20, oneHourAve: 21 },
			'H22': {fiveDayAve: 20, oneHourAve: 3 },
			'H23': {fiveDayAve: 20, oneHourAve: 33 }
			*/
		};
		
		this.showValues = false;
		this.rendered = false;
	}
	
	show() {
		//console.log('MenuView show()');
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
			//console.log(['t.resolution=',t.resolution]);
			// Daylight savings adjustment:
			// If there are 25 points (time moved back one hour) remove the third in the list!
			// If there are 23 points (time moved forward one hour) duplicate the third in the list!
			
			//console.log(['TIMEINTERVAL START=',t.timeInterval.start]);
			
			if (t.Point.length === 24) { // Normal case!
				//console.log(['t.Point=',t.Point]);
				let timestamp = moment(t.timeInterval.start);
				const reso = moment.duration(t.resolution);
				t.Point.forEach(p => {
					const price = p.price*factor;
					newdata.push({date: timestamp.toDate(), price: price});
					// Do we need to handle the +p.position when stepping from start to end?
					timestamp.add(reso);
				});
			} else if (t.Point.length === 25) {
				console.log('25 POINTS => REMOVE THE THIRD ONE.');
				let timestamp = moment(t.timeInterval.start);
				const reso = moment.duration(t.resolution);
				t.Point.forEach((p,i) => {
					if (i===2) {
						// Skip the third point
						timestamp.add(reso);
					} else {
						const price = p.price*factor;
						newdata.push({date: timestamp.toDate(), price: price});
						// Do we need to handle the +p.position when stepping from start to end?
						timestamp.add(reso);
					}
				});
			} else if (t.Point.length === 23) {
				console.log('23 POINTS => DUPLICATE THE THIRD ONE.');
				let timestamp = moment(t.timeInterval.start);
				const reso = moment.duration(t.resolution);
				t.Point.forEach((p,i) => {
					if (i===2) {
						const price = p.price*factor;
						newdata.push({date: timestamp.toDate(), price: price});
						timestamp.add(reso);
						// Duplicate THIRD point.
						newdata.push({date: timestamp.toDate(), price: price});
						timestamp.add(reso);
					} else {
						const price = p.price*factor;
						newdata.push({date: timestamp.toDate(), price: price});
						timestamp.add(reso);
					}
				});
			} else {
				console.log('Not a full day to process!');
			}
		});
		console.log(['newdata=',newdata]);
		return newdata;
	}
	
	populatePriceValues(data) {
		
		this.priceAverages = {};
		// data is an array of {date: timestamp.toDate(), price: price} objects.
		
		// Fetched from ENTSOE data we get result in 
		// timeInterval object with two arrays, for example: start "2021-12-01T23:00Z" and end "2021-12-02T23:00Z"
		// From now-120 hours to now+36 hours
		let startMom = moment().subtract(119, 'hours'); // 119
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
				//console.log(['startMom=',startMom.format(),'endMom=',endMom.format()]);
				data.forEach(r=>{
					//console.log(['r.date=',r.date]);
					const c = moment(r.date);
					if (c.isBetween(startMom, endMom)) {
						//console.log(['isBetween start end r.date=',r.date]);
						sum += r.price;
						count++;
					}
					if (c.isBetween(startTwoA, startTwoB)) {
						val = r.price;
						//console.log(['val=',val]);
					}
				});
				
				//console.log(['count=',count,' sum=',sum]);
				let ave = 0;
				if (count > 0) {
					ave = sum / count;
				}
				this.priceAverages[key] = {fiveDayAve:ave, oneHourAve:val};
				console.log(['PRICE POPULATE key=',key,' sum=',sum,' count=',count,' ave=',ave,' val=',val]);
				startMom.add(1, 'hours');
				
				startTwoA.add(1, 'hours');
				startTwoB.add(1, 'hours');
			}
		}
	}
	
	/*
	NOTE:
	The date given in response JSON is UTC time, even though it is like this: "date_time": "2022-04-07 21:55:25". 
	Add necessary missing elements (T and Z) to timestamp, if they are not there: "2022-04-07T22:00:55Z"
	*/
	
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
					let ds = r.date_time;
					if (r.date_time.indexOf('T') === 0) {
						ds = r.date_time.replace(' ', 'T');
					}
					if (r.date_time.endsWith('Z')===false) {
						ds += 'Z';
					}
					const d = new Date(ds);
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
		document.getElementById(this.el.slice(1)).appendChild(svg);
		//$('#clock-wrapper').append(svg);
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
		cc.setAttributeNS(null, 'r', 4);
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
		
		<defs>
			<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
				<polygon points="0 0, 10 3.5, 0 7" />
			</marker>
		</defs>
		<line x1="0" y1="50" x2="250" y2="50" stroke="#000" stroke-width="8" marker-end="url(#arrowhead)" />
	*/
	appendArrow(params) {
		
		const group = params.group;
		const ra = (params.outerRadius + params.innerRadius)*0.53; // center;
		
		const ab = params.startAngle;
		const ae = params.endAngle;
		const span = params.span;
		//const fill = params.fill;
		const direction = params.direction;
		
		//const centerAngle = ab-span/2;
		//const centerRadius = (ri+ro)/2;
		//const xTxt = Math.sin(centerAngle*Math.PI/180) * centerRadius;
		//const yTxt = Math.cos(centerAngle*Math.PI/180) * centerRadius;
		
		const svgNS = 'http://www.w3.org/2000/svg';
		const xab = Math.sin(ab*Math.PI/180) * ra;
		const yab = Math.cos(ab*Math.PI/180) * ra;
		
		const xae = Math.sin(ae*Math.PI/180) * ra;
		const yae = Math.cos(ae*Math.PI/180) * ra;
		
		const defs = document.createElementNS(svgNS, 'defs');
		const marker = document.createElementNS(svgNS, "marker");
		marker.id = 'arrowhead';
		marker.setAttributeNS(null, 'markerWidth', 10);
		marker.setAttributeNS(null, 'markerHeight', 7);
		marker.setAttributeNS(null, 'refX', 10);
		marker.setAttributeNS(null, 'refY', 3.5);
		marker.setAttributeNS(null, 'orient', 'auto');
		const polygon = document.createElementNS(svgNS, "polygon");
		polygon.setAttributeNS(null, 'points', '0 0, 10 3.5, 0 7, 0 0');
		polygon.setAttributeNS(null, 'stroke', '#777');
		polygon.setAttributeNS(null, 'fill', '#777');
		
		marker.appendChild(polygon);
		
		defs.appendChild(marker);
		group.appendChild(defs);
		
		let d='M '+xab+','+yab+' '+ 'A '+ra+','+ra+' 0,0,1 '+xae+','+yae;
		if (direction === 'clockwise') {
			// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
			d='M '+xab+','+yab+' '+ 'A '+ra+','+ra+' 0,0,1 '+xae+','+yae;
		} else {
			d='M '+xae+','+yae+' '+ 'A '+ra+','+ra+' 0,0,0 '+xab+','+yab;
		}
		const p = document.createElementNS(svgNS, "path");
		p.setAttributeNS(null, 'd', d);
		p.style.stroke = '#777';
		p.style.strokeWidth = 1.5;
		p.style.fill = 'none';
		p.setAttributeNS(null,'marker-end','url(#arrowhead)');
		
		group.appendChild(p);
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
		const txtcolor = params.txtcolor;
		
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
		p.style.fillOpacity = 0.5;
		group.appendChild(p);
		
		// Text (label) is wrapped inside SVG-element.
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttributeNS(null, 'x', xTxt-32);
		svg.setAttributeNS(null, 'y', yTxt-10);
		svg.setAttributeNS(null, 'width', 64);
		svg.setAttributeNS(null, 'height', 16);
		
		if (this.showValues) {
			let fontSize = '8px';
			if (this.REO.width > 600) {
				fontSize = '12px';
			}
			
			const txt = document.createElementNS(svgNS, 'text');
			txt.setAttribute('x','50%');
			txt.setAttribute('y','50%');
			//txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
			txt.style.fontFamily = "'Open Sans', sans-serif";
			txt.style.fontSize = fontSize; //'12px';
			//txt.setAttribute('font-weight','bold');
			txt.setAttribute('dominant-baseline','middle');
			txt.setAttribute('text-anchor','middle');
			txt.style.fill = txtcolor;
			txt.style.stroke = txtcolor;
			txt.style.strokeWidth = 0.25;
			const text_node = document.createTextNode(label);
			txt.appendChild(text_node);
			svg.appendChild(txt);
		}
		group.appendChild(svg);
	}
	
	updateEmissions() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		// Start by removing ALL emissions.
		let wrap = document.getElementById('emissions');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const mAngle = 360/12; // angle for one hour (30)
		//const label = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		const group = document.createElementNS(svgNS, "g");
		group.id = 'emissions';
		
		const last_sample_index = Object.keys(this.emissionAverages).length-1;
		//console.log(['last_sample_index=',last_sample_index]);
		
		Object.keys(this.emissionAverages).forEach((key,index) => {
			// key = HN  where N = 0 ... 23
			//
			
			//console.log(['index=',index]);
			
			let kk = parseInt(key.slice(1));
			// map kk to 0...11
			if (kk > 11) { kk -= 12; }
			
			const sa = 180-kk*mAngle;
			const ea = sa - mAngle;
			
			const span = mAngle; // The "length" of sector.
			let fill = this.colors.SECTOR_FILL_DARK_GREY;
			let label = "0/0";
			
			const val = this.emissionAverages[key];
			if (typeof val !== 'undefined' &&  
				typeof val.fiveDayAve !== 'undefined' &&  val.fiveDayAve > 0 &&
				typeof val.oneHourAve !== 'undefined' &&  val.oneHourAve > 0) {
				
				label = val.oneHourAve.toFixed(1)+'/'+val.fiveDayAve.toFixed(1);
				
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
				label: label, //label[i],
				fill: fill,
				txtcolor: this.colors.SECTOR_EMISS_TXT_COLOR
			});
			if (index === last_sample_index) {
				this.appendArrow({
					group: group,
					innerRadius: r,
					outerRadius: r + r*0.3,
					startAngle: sa,
					endAngle: ea,
					span: span,
					direction: 'counter-clockwise'
					//label: label[i],
					//fill: fill
				});
			}
		});
		document.getElementById('space').appendChild(group);
	}
	
	updateText(p) {
		/*
			gid = 'price-text' or 'emissions-text'
			txt = 'price for the next 11 hours' or 'emissions from the past 11 hours'
			factor = 0.43 or 0.12 (radius = r+r*factor;)
			pid = 'PricePath' or 'EmissionsPath'
			color = SECTOR_PRICE_TXT_COLOR or this.colors.SECTOR_EMISS_TXT_COLOR
		*/
		const gid = p.gid;
		const txt = p.txt;
		const factor = p.factor;
		const pid = p.pid;
		const color = p.color;
		
		// Start by removing old element.
		let wrap = document.getElementById(gid);
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		if (this.showValues) {
			// values are shown => don't show the Texts.
		} else {
			const svgNS = 'http://www.w3.org/2000/svg';
			const r = this.sunRadius();
			
			//const LM = this.controller.master.modelRepo.get('LanguageModel');
			//const sel = LM.selected;
			//const localized_string_clock_price = LM['translation'][sel]['GRID_CLOCK_PRICE_TEXT']; // 'price prediction for the next 11 hours'
			//const localized_string_clock_price = txt;
			
			// Price sectors are positioned:
			// 		innerRadius: r + r*0.3,
			//		outerRadius: r + r*0.6,
			// => text path has ARC with r + r*0.45
			const radius = r+r*factor;
			
			const b_x = -Math.sin(88*Math.PI/180) * radius;
			const b_y = -Math.cos(88*Math.PI/180) * radius;
			//const b_x = -radius;
			//const b_y = 0;
			const r_x = radius;
			const r_y = radius;
			const e_x = radius;
			const e_y = 0;
			
			
			const group = document.createElementNS(svgNS, "g");
			group.id = gid;
			const defs = document.createElementNS(svgNS, 'defs');
			/*
			<defs>
			<path id="MyPath" fill="none" stroke="red" d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
			</defs>*/
			// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
			
			//<path d="M-140,140 A140,140 0 0,1 140,140 Z" style="stroke:#aaa;stroke-width:12;fill:#ccc;opacity:1;" />
			const d='M '+b_x+','+b_y+' A '+r_x+','+r_y+' 0,0,1 '+e_x+','+e_y;
			const path = document.createElementNS(svgNS, "path");
			path.id = pid;
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
			const svg_txt = document.createElementNS(svgNS, 'text');
			if (this.REO.width > 600) {
				svg_txt.style.fontSize = '18px';
			} else {
				svg_txt.style.fontSize = '14px';
			}
			svg_txt.style.strokeWidth = 0.25;
			svg_txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
			svg_txt.setAttribute('fill','#844');
			svg_txt.setAttribute('stroke','#844');
			
			const txtPath = document.createElementNS(svgNS, 'textPath');
			txtPath.setAttributeNS(null, 'href', '#'+pid);
			const text_node = document.createTextNode(txt);//localized_string_clock_price);
			txtPath.appendChild(text_node);
			svg_txt.appendChild(txtPath);
			
			group.appendChild(svg_txt);
			
			document.getElementById('space').appendChild(group);
		}
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
		let wrap = document.getElementById('price-forecast');
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
			wrap.remove(); // Finally remove group.
		}
		
		const mAngle = 360/12; // angle for one hour
		//const label = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		const group = document.createElementNS(svgNS, "g");
		group.id = 'price-forecast';
		
		Object.keys(this.priceAverages).forEach((key,index) => {
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
			
			let label = '0/0';
			
			if (typeof val !== 'undefined' &&  
				typeof val.fiveDayAve !== 'undefined' &&  val.fiveDayAve > 0 &&
				typeof val.oneHourAve !== 'undefined' &&  val.oneHourAve > 0) {
				
				label = val.oneHourAve.toFixed(1)+'/'+val.fiveDayAve.toFixed(1);
				
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
				label: label, //label[i],
				fill: fill,
				txtcolor: this.colors.SECTOR_PRICE_TXT_COLOR
			});
			if (index === 0) {
				this.appendArrow({
					group: group,
					innerRadius: r + r*0.3,
					outerRadius: r + r*0.6,
					startAngle: sa,
					endAngle: ea,
					span: span,
					direction: 'clockwise'
					//label: label[i],
					//fill: fill
				});
			}
		});
		// The most outer black frame!
		const frameWidth = 7;
		const cf = document.createElementNS(svgNS, "circle");
		cf.setAttributeNS(null, 'cx', 0);
		cf.setAttributeNS(null, 'cy', 0);
		cf.setAttributeNS(null, 'r', r+r*0.6+frameWidth/2);
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
		c.id = 'svg-clock-face';
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = this.colors.CLOCK_FACE_CIRCLE_STROKE;
		c.style.strokeWidth = 3;
		c.style.fill = this.colors.CLOCK_FACE_CIRCLE_FILL;
		group.appendChild(c);
		
		
		const cc = document.createElementNS(svgNS, "circle");
		cc.setAttributeNS(null, 'cx', 0);
		cc.setAttributeNS(null, 'cy', 0);
		cc.setAttributeNS(null, 'r', 6);
		cc.style.stroke = this.colors.CLOCK_FACE_CENTER_DOT_STROKE;
		cc.style.strokeWidth = 5;
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
	
	appendTitle() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		let fontsize = 24;
		
		// r ranges from approx. 100 to 260
		if (r <= 120) {
			fontsize = 18;
		} else if (r > 120 && r <= 170) {
			fontsize = 20;
		} else if (r > 170 && r <= 220) {
			fontsize = 22;
		} else {
			fontsize = 24;
		}
		
		// 'PORTRAIT','SQUARE','LANDSCAPE'
		let ypos = -1.95*r;
		if (this.REO.mode === 'PORTRAIT') {
			ypos = -2.15*r;
		}
		console.log(['r=',r,' fontsize=',fontsize]);
		
		const labelWidth = 5*r; //r + r*0.75;
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-labelWidth*0.5);
		svg.setAttribute('y', ypos);
		svg.setAttributeNS(null,'width',labelWidth);
		svg.setAttributeNS(null,'height',2*fontsize);
		
		const title = document.createElementNS(svgNS, 'text');
		title.setAttribute('x','50%');
		title.setAttribute('y','50%');
		title.setAttribute('font-family','Arial, Helvetica, sans-serif');
		title.setAttribute('font-size',fontsize);
		title.setAttribute('dominant-baseline','middle');
		title.setAttribute('text-anchor','middle');
		title.setAttribute('fill','#555');
		title.style.opacity = 1;
		title.appendChild(document.createTextNode('Electricity Emissions vs Price'));
		svg.appendChild(title);
		
		document.getElementById('space').appendChild(svg);
	}
	
	appendInfo() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		let fontsize = 18;
		
		// r ranges from approx. 100 to 260
		if (r <= 120) {
			fontsize = 12;
		} else if (r > 120 && r <= 170) {
			fontsize = 14;
		} else if (r > 170 && r <= 220) {
			fontsize = 16;
		} else {
			fontsize = 18;
		}
		
		// 'PORTRAIT','SQUARE','LANDSCAPE'
		let ypos = 1.7*r;
		if (this.REO.mode === 'PORTRAIT') {
			ypos = 1.7*r;
		}
		//console.log(['r=',r,' fontsize=',fontsize]);
		
		const labelWidth = 5*r; //r + r*0.75;
		const svg_a = document.createElementNS(svgNS, "svg");
		svg_a.setAttribute('x',-labelWidth*0.5);
		svg_a.setAttribute('y', ypos);
		svg_a.setAttributeNS(null,'width',labelWidth);
		svg_a.setAttributeNS(null,'height',2*fontsize);
		
		const text_a = document.createElementNS(svgNS, 'text');
		text_a.setAttribute('x','50%');
		text_a.setAttribute('y','50%');
		text_a.setAttribute('font-family','Arial, Helvetica, sans-serif');
		text_a.setAttribute('font-size',fontsize);
		text_a.setAttribute('dominant-baseline','middle');
		text_a.setAttribute('text-anchor','middle');
		text_a.setAttribute('fill','#555');
		text_a.style.opacity = 1;
		text_a.appendChild(document.createTextNode('The clock visualizes the amount of emissions for the past 11 hours'));
		svg_a.appendChild(text_a);
		
		const svg_b = document.createElementNS(svgNS, "svg");
		svg_b.setAttribute('x',-labelWidth*0.5);
		svg_b.setAttribute('y', ypos+1.2*fontsize);
		svg_b.setAttributeNS(null,'width',labelWidth);
		svg_b.setAttributeNS(null,'height',2*fontsize);
		
		const text_b = document.createElementNS(svgNS, 'text');
		text_b.setAttribute('x','50%');
		text_b.setAttribute('y','50%');
		text_b.setAttribute('font-family','Arial, Helvetica, sans-serif');
		text_b.setAttribute('font-size',fontsize);
		text_b.setAttribute('dominant-baseline','middle');
		text_b.setAttribute('text-anchor','middle');
		text_b.setAttribute('fill','#555');
		text_b.style.opacity = 1;
		text_b.appendChild(document.createTextNode('(counterclockwise) and price for the next 11 hours (clockwise).'));
		svg_b.appendChild(text_b);
		
		//title.appendChild(document.createTextNode('(counterclockwise) and price prediction for next 11 hours (clockwise).'));
		
		//title.appendChild(document.createTextNode('Color coding: Green = emissions and price smaller.'));
		//title.appendChild(document.createTextNode('Orange = emissions and price same.'));
		//title.appendChild(document.createTextNode('Red = emissions and price bigger.'));
		
		document.getElementById('space').appendChild(svg_a);
		document.getElementById('space').appendChild(svg_b);
	}
	
	appendColorBox(r, index, fontsize, color, txt) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const ypos = -0.5*r;
		const labelWidth = 5*r; //r + r*0.75;
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-labelWidth*0.5);
		svg.setAttribute('y', ypos+index*fontsize);
		svg.setAttributeNS(null,'width',labelWidth);
		svg.setAttributeNS(null,'height',2*fontsize);
		
		const rect = document.createElementNS(svgNS, 'rect');
		// Setup the <rect> element.
		rect.setAttribute('x',labelWidth/2-r/2);
		rect.setAttribute('y',0);
		rect.setAttribute('width',labelWidth/4-r/4);
		rect.setAttribute('height',2*fontsize);
		rect.setAttribute('fill', color);
		rect.style.fillOpacity = 0.25;
		svg.appendChild(rect);
		
		const _text = document.createElementNS(svgNS, 'text');
		_text.setAttribute('x','50%');
		_text.setAttribute('y','50%');
		_text.setAttribute('font-family','Arial, Helvetica, sans-serif');
		_text.setAttribute('font-size',fontsize);
		_text.setAttribute('dominant-baseline','middle');
		_text.setAttribute('text-anchor','middle');
		_text.setAttribute('fill','#555');
		_text.style.opacity = 1;
		_text.appendChild(document.createTextNode(txt));
		svg.appendChild(_text);
		
		document.getElementById('space').appendChild(svg);
	}
	
	appendText(r, index, fontsize, txt) {
		const svgNS = 'http://www.w3.org/2000/svg';
		const ypos = -0.5*r;
		const labelWidth = 5*r; //r + r*0.75;
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-labelWidth*0.5);
		svg.setAttribute('y', ypos+index*fontsize);
		svg.setAttributeNS(null,'width',labelWidth);
		svg.setAttributeNS(null,'height',2*fontsize);
		
		const _text = document.createElementNS(svgNS, 'text');
		_text.setAttribute('x','50%');
		_text.setAttribute('y','50%');
		_text.setAttribute('font-family','Arial, Helvetica, sans-serif');
		_text.setAttribute('font-size',fontsize);
		_text.setAttribute('dominant-baseline','middle');
		_text.setAttribute('text-anchor','middle');
		_text.setAttribute('fill','#555');
		_text.style.opacity = 1;
		_text.appendChild(document.createTextNode(txt));
		svg.appendChild(_text);
		
		document.getElementById('space').appendChild(svg);
	}
	
	appendColorCoding() {
		/*
		fill = this.colors.SECTOR_FILL_RED;
		fill = this.colors.SECTOR_FILL_GREEN;
		fill = this.colors.SECTOR_FILL_ORANGE;
		*/
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		let fontsize = 16;
		
		// r ranges from approx. 100 to 260
		if (r <= 120) {
			fontsize = 8;
		} else if (r > 120 && r <= 170) {
			fontsize = 10;
		} else if (r > 170 && r <= 220) {
			fontsize = 12;
		} else {
			fontsize = 14;
		}
		
			//SECTOR_FILL_GREEN: '#8f8', (136, 255, 136)
			//SECTOR_FILL_ORANGE: '#fc0', (255, 204, 0)
			//SECTOR_FILL_RED: '#f44',  (255, 68, 68)
		this.appendColorBox(
			r,
			-2,
			fontsize,
			this.colors.SECTOR_FILL_GREEN,
			'emissions and price smaller *');
		
		this.appendColorBox(
			r,
			0,
			fontsize,
			this.colors.SECTOR_FILL_ORANGE,
			'emissions and price same *');
		
		this.appendColorBox(
			r,
			2,
			fontsize,
			this.colors.SECTOR_FILL_RED,
			'emissions and price bigger *');
			
		this.appendText(r, 4, fontsize, '* compared to 5 day average.');
	}
	
	updatePriceData() {
		
		this.updatePriceForecast();
		this.updateText({
			gid: 'price-text',
			txt: 'price for the next 11 hours',
			factor: 0.43,
			pid: 'PricePath',
			color: this.colors.SECTOR_PRICE_TXT_COLOR
		});
	}
	
	updateEmissionsData() {
		
		this.updateEmissions();
		this.updateText({
			gid: 'emissions-text',
			txt: 'emissions from the past 11 hours',
			factor: 0.12,
			pid: 'EmissionsPath',
			color: this.colors.SECTOR_EMISS_TXT_COLOR
		});
	}
	
	renderALL() {
		const self = this;
		//console.log('renderALL() START v6!');
		let wrap = document.getElementById(this.el.slice(1));
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		}
		
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		//const sel = LM.selected;
		
		const localized_string_clock_title = 'Electricity Emissions vs Price'; //LM['translation'][sel]['GRID_PAGE_CLOCK_TITLE'];
		const localized_string_clock_description = 'The clock visualizes the amount of emissions for past 11 hours (counterclockwise) and price prediction for next 11 hours (clockwise).';//LM['translation'][sel]['GRID_PAGE_CLOCK_DESCRIPTION'];
		const localized_string_clock_colors = 'Color coding: Green = emissions and price smaller. Orange = emissions and price same. Red = emissions and price bigger';//LM['translation'][sel]['GRID_PAGE_CLOCK_COLORS'];
		/*
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_clock_title+'</h4>'+
					'<p>'+localized_string_clock_description+'</p>'+
					'<p>'+localized_string_clock_colors+'</p>'+
					'<div class="col s12 center" id="clock-wrapper"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		
		$(html).appendTo(this.el);
		*/
		
		this.createSpace();
		this.appendClock();
		this.appendTitle();
		this.appendInfo();
		this.appendColorCoding();
		
		const face = document.getElementById('svg-clock-face');
		face.addEventListener("click", function(){
			if (self.showValues) {
				self.showValues = false;
			} else {
				self.showValues = true;
			}
			self.updateEmissionsData();
			self.updatePriceData();
		}, false);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				//console.log('ResizeEventObserver resize => SHOW()!');
				this.show();
				
				
			} else if (options.model === 'EntsoeEnergyPriceModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						//$('#'+this.FELID).empty();
						
						const newdata = this.convertPriceData();
						this.populatePriceValues(newdata);
						this.updatePriceData();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					console.log(['Error in fetching',options.message]);
					/*
					if (this.rendered) {
						//$('#'+this.FELID).empty();
						//const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						//$(html).appendTo('#'+this.FELID);
					} else {
						this.render();
					}
					*/
				}
				
				
			} else if (options.model==='EmpoEmissionsFiveDays' && options.method==='fetched') {
				if (options.status === 200) {
					//const res = this.models[options.model].results;
					//console.log(['FIVE DAYS PLUS ELEVEN HOURS results=',res]);
					this.populateEmissionValues();
					this.updateEmissionsData();
					
				} else {
					console.log(['EmpoEmissionsFiveDays fetched status=',options.status]);
				}
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				if (options.name==='second') {
					//console.log('PeriodicTimeoutObserver one second has elapsed!');
					if (this.rendered) {
						this.updateHands();
					}
				} else if (options.name==='minute') {
					//console.log('PeriodicTimeoutObserver one minute has elapsed!');
					// Do something with each TICK!
					Object.keys(this.models).forEach(key => {
						//console.log(['FETCH MODEL key=',key]);
						this.models[key].fetch();
					});
					if (this.rendered) {
						// NOTE: Here we don't show datenumber and month in sectors,
						// but instead show data.
						this.updateEmissionsData();
						this.updatePriceData();
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
