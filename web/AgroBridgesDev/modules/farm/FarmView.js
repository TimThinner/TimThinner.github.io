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
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
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
		this.USER_MODEL.unsubscribe(this);
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
	
	appendLabel(group, type, r) {
		
		const svgNS = 'http://www.w3.org/2000/svg';
		
		let fontsize;
		if (r <= 75) {
			fontsize = 12;
		} else if (r > 75 && r <= 124) {
			fontsize = 14;
		} else if (r > 124 && r <= 150) {
			fontsize = 16;
		} else {
			fontsize = 18;
		}
		
		const labelWidth = r + r*0.75;
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-labelWidth*0.5);
		svg.setAttribute('y',-r);
		svg.setAttributeNS(null,'width',labelWidth);
		svg.setAttributeNS(null,'height',2*fontsize);
		
		const rect = document.createElementNS(svgNS, 'rect');
		// Setup the <rect> element.
		rect.setAttribute('x',0);
		rect.setAttribute('y',0);
		rect.setAttribute('width',labelWidth);
		rect.setAttribute('height',2*fontsize);
		rect.style.fill = this.colors.LIGHT_ORANGE;
		rect.style.fillOpacity = 1;
		rect.style.stroke = this.colors.DARK_ORANGE;
		rect.style.strokeWidth = 2;
		svg.appendChild(rect);
		
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
	}
	
	appendFillStatus(group, type, r) {
		const svgNS = 'http://www.w3.org/2000/svg';
		let fontsize;
		if (r <= 75) {
			fontsize = 12;
		} else if (r > 75 && r <= 124) {
			fontsize = 14;
		} else if (r > 124 && r <= 150) {
			fontsize = 16;
		} else {
			fontsize = 18;
		}
		
		let fillStatus = '4/4';
		let filledColor = this.colors.GREEN;
		let strokeWidth = 2;
		let strokeColor = this.colors.DARK_GREEN;
		
		if (type === 'LOCATION') {
			const state = this.USER_MODEL.profileLocationState();
			fillStatus = state.filled+'/'+state.total;
			if (state.ready===false) {
				filledColor = this.colors.LIGHT_RED;
				strokeWidth = 4;
				strokeColor = this.colors.DARK_RED;
			}
			
		} else if (type === 'INFO') {
			const state = this.USER_MODEL.profileInfoState();
			fillStatus = state.filled+'/'+state.total;
			if (state.ready===false) {
				filledColor = this.colors.LIGHT_RED;
				strokeWidth = 4;
				strokeColor = this.colors.DARK_RED;
			}
			
		} else if (type === 'VEGETABLES') {
			const state = this.USER_MODEL.profileVegeState();
			fillStatus = state.filled+'/'+state.total;
			if (state.ready===false) {
				filledColor = this.colors.LIGHT_RED;
				strokeWidth = 4;
				strokeColor = this.colors.DARK_RED;
			}
			
		} else if (type === 'ANIMALS') {
			const state = this.USER_MODEL.profileAnimalsState();
			fillStatus = state.filled+'/'+state.total;
			if (state.ready===false) {
				filledColor = this.colors.LIGHT_RED;
				strokeWidth = 4;
				strokeColor = this.colors.DARK_RED;
			}
			
		} else if (type === 'FRUITS') {
			const state = this.USER_MODEL.profileFruitsState();
			fillStatus = state.filled+'/'+state.total;
			if (state.ready===false) {
				filledColor = this.colors.LIGHT_RED;
				strokeWidth = 4;
				strokeColor = this.colors.DARK_RED;
			}
		}
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-r*0.5);
		svg.setAttribute('y',r*0.75);
		svg.setAttributeNS(null,'width',r);
		svg.setAttributeNS(null,'height',2*fontsize);
		
		const rect = document.createElementNS(svgNS, 'rect');
		// Setup the <rect> element.
		rect.setAttribute('x',0);
		rect.setAttribute('y',0);
		rect.setAttribute('width',r);
		rect.setAttribute('height',2*fontsize);
		rect.style.fill = filledColor;
		rect.style.fillOpacity = 1;
		rect.style.stroke = strokeColor;
		rect.style.strokeWidth = strokeWidth;
		svg.appendChild(rect);
		
		const title = document.createElementNS(svgNS, 'text');
		title.setAttribute('x','50%');
		title.setAttribute('y','50%');
		title.setAttribute('font-family','Arial, Helvetica, sans-serif');
		title.setAttribute('font-size',fontsize);
		title.setAttribute('dominant-baseline','middle');
		title.setAttribute('text-anchor','middle');
		title.setAttribute('fill',this.colors.DARK_GREEN);
		title.style.opacity = 1;
		title.appendChild(document.createTextNode(fillStatus));
		svg.appendChild(title);
		group.appendChild(svg);
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
		/*
		Use Oranges in "button" circles:
		LIGHT_ORANGE in background and DARK_ORANGE in outline stroke.
		
		LIGHT_ORANGE:'#F4D25A',
		DARK_ORANGE:'#EF8806'
		*/
		let icon_w = 1.5*r;
		let icon_x = -icon_w*0.5;
		//let icon_h = icon_w*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
		let icon_h = icon_w; // NEW: all used photos are square!
		let icon_y = - icon_h*0.5;
		
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
		border.style.fill = this.colors.LIGHT_ORANGE;
		border.style.fillOpacity = 0.75;
		border.style.stroke = this.colors.DARK_ORANGE;
		border.style.strokeWidth = 5;
		group.appendChild(border);
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', 0);
		ca.setAttributeNS(null, 'r', r2);
		ca.style.fill = this.colors.LIGHT_ORANGE;
		ca.style.fillOpacity = 1;
		ca.style.stroke = this.colors.DARK_ORANGE;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
		if (type === 'LOCATION') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './img/photo-location.png');
			group.appendChild(img);
			
		} else if (type === 'INFO') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './img/photo-info.png');
			group.appendChild(img);
			
		} else if (type === 'VEGETABLES') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './img/photo-veges.png');
			group.appendChild(img);
			
		} else if (type === 'ANIMALS') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './img/photo-animals.png');
			group.appendChild(img);
			
		} else if (type === 'FRUITS') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './img/photo-fruits.png');
			group.appendChild(img);
		}
		this.appendLabel(group, type, r);
		this.appendFillStatus(group, type, r);
		
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', 0);
		surface.setAttributeNS(null, 'r', r);
		surface.style.stroke = this.colors.DARK_ORANGE;
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.opacity = 0;
		surface.style.cursor = 'pointer';
		
		if (type === 'LOCATION') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('location');
			}, false);
			
		} else if (type === 'INFO') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('info');
			}, false);
			
		} else if (type === 'VEGETABLES') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('vege');
			}, false);
			
		} else if (type === 'ANIMALS') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('animals');
			}, false);
			
		} else if (type === 'FRUITS') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('fruits');
			}, false);
		}
		// Mouseover and Mouseout handlers
		surface.addEventListener("mouseover", function(event){ 
			border.style.fill = self.colors.DARK_ORANGE;
		}, false);
		surface.addEventListener("mouseout", function(event){ 
			border.style.fill = self.colors.LIGHT_ORANGE;
		}, false);
		
		group.appendChild(surface);
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(group);
	}
	
	appendTitle() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius(); // Radius 12,5%
		const fontsize = r;
		/*if (r <= 75) {
			fontsize = 50;
		} else if (r > 75 && r <= 124) {
			fontsize = 60;
		} else if (r > 124 && r <= 150) {
			fontsize = 80;
		} else {
			fontsize = 100;
		}
		*/
		const group = document.createElementNS(svgNS, "g");
		
		let coeff = -3.5;
		if (this.REO.mode === 'PORTRAIT') {
			coeff = -4;
		}
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-3*r);
		svg.setAttribute('y',coeff*r);
		svg.setAttributeNS(null,'width',6*r);
		svg.setAttributeNS(null,'height',fontsize);
		
		/*
		const rect = document.createElementNS(svgNS, 'rect');
		rect.setAttribute('x',1);
		rect.setAttribute('y',1);
		rect.setAttribute('width',6*r-2);
		rect.setAttribute('height',fontsize-2);
		rect.style.fill = this.colors.DARK_GREEN;
		rect.style.opacity = 0.2;
		svg.appendChild(rect);
		*/
		const title = document.createElementNS(svgNS, 'text');
		title.setAttribute('x','50%');
		title.setAttribute('y','50%');
		title.setAttribute('font-family','Arial, Helvetica, sans-serif');
		title.setAttribute('font-size',fontsize);
		title.setAttribute('dominant-baseline','middle');
		title.setAttribute('text-anchor','middle');
		title.setAttribute('fill',this.colors.DARK_GREEN);
		title.style.opacity = 1;
		title.appendChild(document.createTextNode('FARM'));
		svg.appendChild(title);
		group.appendChild(svg);
		$('#space').append(group);
	}
	
	appendOKButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius(); // Radius 12,5%
		//const w = this.REO.width;
		//const h = this.REO.height;
		
		/*let coeff = 2;
		if (this.REO.mode === 'LANDSCAPE') {
			coeff = 1.5;
		}*/
		const bw = 126;
		const bh = 42;
		/*
		if (w <= 600) {
			bw = 80;
		} else if (w > 600 && w <= 992) {
			bw = 80;
		} else if (w > 992 && w <= 1200) {
			bw = 90;
		} else {
			bw = 100;
		}
		*/
		//const bh = bw * 0.5; // "okbutton" is 200 x 100 pixels
		const bx = -bw*0.5;
		const by = 3*r; // h*0.5 - coeff*bh;
		
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', bx);
		img.setAttribute('y', by);
		img.setAttribute('width', bw);
		img.setAttribute('height', bh);
		//img.setAttribute('href', './svg/okbutton.svg');
		img.setAttribute('href', './img/ok.png');
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
		
		this.appendTitle();
		
		this.appendSun('LOCATION');
		this.appendSun('INFO');
		this.appendSun('VEGETABLES');
		this.appendSun('ANIMALS');
		this.appendSun('FRUITS');
		
		this.appendOKButton();
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
