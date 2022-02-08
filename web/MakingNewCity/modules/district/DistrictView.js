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
	
	appendLogo() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const w = this.REO.width;
		const h = this.REO.height;
		
		const FILLCOLOR = '#fff';
		const STROKECOLOR = '#fff';
		/*
		Screen Sizes (in Materialize CSS)
		Mobile Devices		Tablet Devices		Desktop Devices		Large Desktop Devices
		<= 600px 			> 600px 			> 992px 				> 1200px
		*/
		let fontsize;
		if (w <= 600) {
			console.log('Mobile Device.');
			fontsize = 36; // big font 36, small font 12
			
		} else if (w > 600 && w <= 992) {
			console.log('Tablet Device.');
			fontsize = 42; // big font 42, small font 14
			
		} else if (w > 992 && w <= 1200) {
			console.log('Desktop Device.');
			fontsize = 54; // big font 54, small font 18
			
		} else {
			console.log('Large Desktop Device.');
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
	
	appendCenter() {
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius();
		const r2 = r + r*0.2; // outer circle
		const r1 = r + r*0.1; // inner circle
		const stroke_w = (r2 - r)*0.5; // animated "flow" width = half of "pipe" diameter.
		
		console.log(['CENTER r=',r,' r2=',r2,' r1=',r1,' stroke_w=',stroke_w]);
		
		const cx = 0;
		let cy = 0;
		// If view is SQUARE: Put all circles to vertical center.
		// If view is PORTRAIT: Put all circles to vertical center.
		// If view is LANDSCAPE: Move all circles 10% down from vertical center.
		if (this.REO.mode === 'LANDSCAPE') {
			cy = this.REO.height*0.1;
		}
		
		const group = document.createElementNS(svgNS, "g");
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', cx);
		ca.setAttributeNS(null, 'cy', cy);
		ca.setAttributeNS(null, 'r', r2);
		ca.style.fill = 'none';
		ca.style.opacity = 0.75;
		ca.style.stroke = '#fff'
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
		const cb = document.createElementNS(svgNS, "circle");
		cb.setAttributeNS(null, 'cx', cx);
		cb.setAttributeNS(null, 'cy', cy);
		cb.setAttributeNS(null, 'r', r);
		cb.style.fill = 'none';
		cb.style.opacity = 0.75;
		cb.style.stroke = '#fff';
		cb.style.strokeWidth = 1;
		group.appendChild(cb);
		
		const ycy = r1+cy;
		const ycz = r1-cy;
		
		const d='M 0,-'+ycz+' A '+r+','+r+' 0 0,1 0,'+ycy+' A '+r+','+r+' 0 0,1 0,-'+ycz;
		const path = document.createElementNS(svgNS, "path");
		path.setAttributeNS(null, 'd', d);
		path.style.opacity = 0.4;
		path.style.stroke = '#cf0'
		path.style.strokeWidth = stroke_w;
		path.style.strokeDasharray = '30 10';
		path.style.fill = 'none';
		
		const animate = document.createElementNS(svgNS, "animate");
		animate.setAttributeNS(null, 'attributeName', 'stroke-dashoffset');
		animate.setAttributeNS(null, 'from', '40');
		animate.setAttributeNS(null, 'to', '0');
		animate.setAttributeNS(null, 'dur', '1s');
		animate.setAttributeNS(null, 'repeatCount', 'indefinite');
		//<animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
		
		path.appendChild(animate);
		group.appendChild(path);
		/*
	<path d="M 870,390 A 112,102 0 0,1 870,670 A 112,102 0 0,1 870,390" style="opacity:0.75;stroke:#fff;stroke-width:1;stroke-dasharray:none;fill:none;" />
	<path d="M 870,410 A 108,98 0 0,1 870,650 A 108,98 0 0,1 870,410" style="opacity:0.75;stroke:#fff;stroke-width:1;stroke-dasharray:none;fill:none;" />
	
	<path d="M 870,400 A 110,100 0 0,1 870,660 A 110,100 0 0,1 870,400"
		style="opacity:0.4;stroke:#cf0;stroke-width:10px;stroke-dasharray:30px 10px;fill:none;">
		<animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
	</path>
		*/
		$('#space').append(group);
	}
	
	appendPolygon(type) {
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
		
		let icon_w = r*1.5;
		if (type === 'hex-a') {
			icon_w = r*2;
		}
		const icon_x = -icon_w*0.5;
		const icon_h = icon_w*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
		const icon_y = -icon_h*0.5;
		
		const group = document.createElementNS(svgNS, "g");
		
		if (type === 'hex-a') {
			
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/smarket.svg');
			group.appendChild(img);
			
			const img_2 = document.createElementNS(svgNS, "image");
			img_2.setAttribute('x', icon_x+icon_w*0.2);
			img_2.setAttribute('y', icon_y);
			img_2.setAttribute('width', icon_w*0.5);
			img_2.setAttribute('height', icon_h*0.5);
			img_2.setAttribute('href', './svg/S-marketin_logo.svg');
			group.appendChild(img_2);
			
		} else if (type === 'hex-b') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './svg/house.svg');
			group.appendChild(img);
		}
		/*
		<image x="720" y="220" width="300" height="75" xlink:href="smarket.svg" />
		<image x="735" y="230" width="121.43" height="27.14" xlink:href="S-marketin_logo.svg" />
		*/
		
		// sin(60) = 0,866
		// cos(60) = 0,5
		const xx = Math.sin(60*Math.PI/180) * r;
		const yy = Math.cos(60*Math.PI/180) * r;
		
		const p = '0,-'+r+' -'+xx+',-'+yy+' -'+xx+','+yy+' 0,'+r+' '+xx+','+yy+' '+xx+',-'+yy;
		const poly = document.createElementNS(svgNS, "polygon");
		poly.setAttributeNS(null, 'points', p);
		poly.style.stroke = '#fff';
		poly.style.fill = '#012265';
		poly.style.strokeWidth = 1;
		poly.style.fillOpacity = 0.05;
		poly.style.cursor = 'pointer';
		poly.setAttribute('transform', 'rotate(90)');
		
		poly.addEventListener("mouseover", function(event){ 
			poly.style.strokeWidth = 4;
		}, false);
		poly.addEventListener("mouseout", function(event){ 
			poly.style.strokeWidth = 1;
		}, false);
		// Go back to menu from ALL polygon-clicks!
		poly.addEventListener("click", function(){
			self.models['MenuModel'].setSelected('menu');
		}, false);
		
		group.appendChild(poly);
		
		let tx, ty;
		if (type === 'hex-a') {
			tx = 0;
			ty = -2 * r + cy;
			
		} else if (type === 'hex-b') {
			tx = Math.sin(60*Math.PI/180) * 2 * r;
			ty = -Math.cos(60*Math.PI/180) * 2 * r + cy;
			
		} else if (type === 'hex-c') {
			tx = Math.sin(60*Math.PI/180) * 2 * r;
			ty = Math.cos(60*Math.PI/180) * 2 * r + cy;
			
		} else if (type === 'hex-d') {
			tx = 0;
			ty = 2 * r + cy;
			
		} else if (type === 'hex-e') {
			tx = -Math.sin(60*Math.PI/180) * 2 * r;
			ty = Math.cos(60*Math.PI/180) * 2 * r + cy;
			
		} else if (type === 'hex-f') {
			tx = -Math.sin(60*Math.PI/180) * 2 * r;
			ty = -Math.cos(60*Math.PI/180) * 2 * r + cy;
		}
		const transformation = 'translate('+tx+','+ty+')';
		group.setAttribute('transform', transformation);
		$('#space').append(group);
	}
	
	renderALL() {
		console.log('renderALL() Tuesday 8.2.2022!');
		$(this.el).empty();
		this.createSpace();
		this.appendLogo();
		this.appendCenter();
		
		this.appendPolygon("hex-a");
		this.appendPolygon("hex-b");
		this.appendPolygon("hex-c");
		this.appendPolygon("hex-d");
		this.appendPolygon("hex-e");
		this.appendPolygon("hex-f");
		
	}
	
	render() {
		this.renderALL();
		this.rendered = true;
	}
}
