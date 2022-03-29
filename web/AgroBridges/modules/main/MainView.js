import View from '../common/View.js';

export default class MainView extends View {
	
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
	
	appendLogoutButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		
		// Minimum diameter of LOGOUT-button is 60 pixels!
		// Maximum diameter of LOGOUT-button is 80 pixels!
		let r = this.sunRadius(); // Radius 12,5%
		if (r < 30) {
			r = 30;
		} else if (r > 40) {
			r = 40;
		}
		// All SVG images are 400 x 300 => w=1.8*r, h=w*0.75
		const image_w = 2*r;
		const image_h = image_w*0.75;
		const image_x = this.REO.width*0.5 - image_w;
		const image_y = -this.REO.height*0.5 + image_h;
		
		const img = document.createElementNS(svgNS, "image");
		img.setAttribute('x', image_x);
		img.setAttribute('y', image_y);
		img.setAttribute('width', image_w);
		img.setAttribute('height', image_h);
		img.setAttribute('href', './svg/logout.svg');
		img.style.cursor = 'pointer';
		img.addEventListener("click", function(){
			self.controller.master.forceLogout();
		}, false);
		$('#space').append(img);
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
		
		if (type === 'FARM') {
			
			ty = -2.5*r;
			
		} else if (type === 'ACTIVITIES') {
			
			const ss = 180 - 120;
			tx = Math.sin(ss*Math.PI/180) * 2.5 * r;
			ty = Math.cos(ss*Math.PI/180) * 2.5 * r;
			
		} else if (type === 'PRODUCER') {
			
			const ss = 180 - 240;
			tx = Math.sin(ss*Math.PI/180) * 2.5 * r;
			ty = Math.cos(ss*Math.PI/180) * 2.5 * r;
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
		if (type === 'FARM') {
			
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('farm');
			}, false);
		}
		
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
	
	appendProgress() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius()*2.5; // r = 31,25% => d = 62,5%
		let ro = r+r*0.1;
		let ri = r-r*0.1;
		const group = document.createElementNS(svgNS, "g");
		
		const outer = document.createElementNS(svgNS, "circle");
		outer.setAttributeNS(null, 'cx', 0);
		outer.setAttributeNS(null, 'cy', 0);
		outer.setAttributeNS(null, 'r', ro);
		outer.style.fill = 'none';
		outer.style.fillOpacity = 0;
		outer.style.stroke = this.colors.DARK_GREEN;
		outer.style.strokeWidth = 3;
		group.appendChild(outer);
		
		const inner = document.createElementNS(svgNS, "circle");
		inner.setAttributeNS(null, 'cx', 0);
		inner.setAttributeNS(null, 'cy', 0);
		inner.setAttributeNS(null, 'r', ri);
		inner.style.fill = 'none';
		inner.style.fillOpacity = 0;
		inner.style.stroke = this.colors.DARK_GREEN;
		inner.style.strokeWidth = 3;
		group.appendChild(inner);
		
		$('#space').append(group);
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
		this.appendProgress();
		
		this.appendSun('FARM');
		this.appendSun('ACTIVITIES');
		this.appendSun('PRODUCER');
		
		this.appendLogoutButton();
		
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
