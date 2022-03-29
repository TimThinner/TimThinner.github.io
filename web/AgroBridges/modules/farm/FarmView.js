import View from '../common/View.js';

export default class FarmView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		//this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		//this.USER_MODEL.subscribe(this);
		
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
		//this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	/*
	The radius of circle is 12,5% of H or W (smaller dimension).
	=> circle diameter is 25% of H or W.
	*/
	sunRadius() {
		const w = this.REO.width; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height;
		const wp2 = w*0.125;
		const hp2 = h*0.125;
		const r = Math.min(wp2, hp2); // r = 0,125 x W or H, whichever is smallest (d=0,25 x W or H)
		return r;
	}
	
	appendSun(type) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius(); // Radius 12,5%
		
		let fontsize;
		if (r <= 75) {
			fontsize = 14;
		} else if (r > 75 && r <= 124) {
			fontsize = 16;
		} else if (r > 124 && r <= 150) {
			fontsize = 18;
		} else {
			fontsize = 20;
		}
		const titleSVGHeight = fontsize;
		
		// All SVG images are 400 x 300 => w=1.8*r, h=w*0.75
		const image_w = 1.8*r;
		const image_h = image_w*0.75;
		
		// Three circles (two visible):
		// 1. outer border (opacity=0.75)
		// 2. 20% smaller inner circle (opacity=1)
		// 3. surface, same size as outer border (opacity=0)
		const r2 = r-r*0.2;
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		if (type === 'LOCATION') {
			
			tx = -1.5*r;
			ty = -1.5*r;
			
		} else if (type === 'INFO') {
			
			tx = 1.5*r;
			ty = -1.5*r;
			
		} else if (type === 'VEGETABLES') {
			
			tx = -2.5*r;
			ty = r;
			
		} else if (type === 'ANIMALS') {
			
			tx = 0;
			ty = r;
			
		} else if (type === 'FRUITS') {
			
			tx = 2.5*r;
			ty = r;
		}
		
		const group = document.createElementNS(svgNS, "g");
		
		const border = document.createElementNS(svgNS, "circle");
		border.setAttributeNS(null, 'cx', 0);
		border.setAttributeNS(null, 'cy', 0);
		border.setAttributeNS(null, 'r', r);
		border.style.fill = this.colors.WHITE;
		border.style.fillOpacity = 0.75;
		border.style.stroke = this.colors.DARK_GREEN;
		border.style.strokeWidth = 2;
		group.appendChild(border);
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', 0);
		ca.setAttributeNS(null, 'r', r2);
		ca.style.fill = this.colors.WHITE;
		ca.style.fillOpacity = 1;
		ca.style.stroke = this.colors.DARK_GREEN;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
			// Text, which will be replaced with an image soon.
			const svg = document.createElementNS(svgNS, "svg");
			svg.setAttribute('x',-image_w*0.5);
			svg.setAttribute('y',-titleSVGHeight*0.5);
			svg.setAttributeNS(null,'width',image_w);
			svg.setAttributeNS(null,'height',titleSVGHeight);
			
			const title = document.createElementNS(svgNS, 'text');
			title.setAttribute('x','50%');
			title.setAttribute('y','50%');
			title.setAttribute('font-family','Arial, Helvetica, sans-serif');
			title.setAttribute('font-size',fontsize);
			title.setAttribute('dominant-baseline','middle');
			title.setAttribute('text-anchor','middle');
			title.setAttribute('fill',this.colors.DARK_GREEN);
			title.style.opacity = 1;
			title.appendChild(document.createTextNode(type));
			svg.appendChild(title);
			group.appendChild(svg);
			
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', 0);
		surface.setAttributeNS(null, 'r', r);
		surface.style.stroke = this.colors.DARK_GREEN;
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		
		// Select which pages open...
		
			surface.addEventListener("click", function(){
				
				//self.models['MenuModel'].setSelected('main');
				console.log('SELECTED: '+type);
				
			}, false);
			
			
			
		
		
		surface.addEventListener("mouseover", function(event){ 
			border.style.fill = self.colors.DARK_GREEN;
		}, false);
		surface.addEventListener("mouseout", function(event){ 
			border.style.fill = self.colors.WHITE;
		}, false);
		
		group.appendChild(surface);
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(group);
	}
	
	appendBackButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const w = this.REO.width;
		const h = this.REO.height;
		// Position back-button left and below horizontal line in Making City logo.
		let bw;
		if (w <= 600) {
			bw = 80;
		} else if (w > 600 && w <= 992) {
			bw = 90;
		} else if (w > 992 && w <= 1200) {
			bw = 100;
		} else {
			bw = 110;
		}
		
		const bh = bw * 0.5; // "okbutton" is 200 x 100 pixels
		const bx = -bw*0.5;
		const by = h*0.5 - 1.5*bh;
		
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', bx);
		img.setAttribute('y', by);
		img.setAttribute('width', bw);
		img.setAttribute('height', bh);
		img.setAttribute('href', './svg/okbutton.svg');
		img.style.cursor = 'pointer';
		img.addEventListener("click", function(){
			self.models['MenuModel'].setSelected('main');
		}, false);
		$('#space').append(img);
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
		$(this.el).append(svg);
	}
	
	renderALL() {
		$(this.el).empty();
		this.createSpace();
		
		this.appendSun('LOCATION');
		this.appendSun('INFO');
		this.appendSun('VEGETABLES');
		this.appendSun('ANIMALS');
		this.appendSun('FRUITS');
		
		this.appendBackButton();
		console.log('renderALL() END!');
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
		this.renderALL();
		this.rendered = true;
	}
}
