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
	
	appendSun(type) {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius(); // Radius 12,5%
		// Minimum diameter of LOGOUT-button is 60 pixels!
		// Maximum diameter of LOGOUT-button is 100 pixels!
		if (type === 'LOGOUT') {
			if (r < 30) {
				r = 30;
			} else if (r > 50) {
				r = 50;
			}
		}
		
		// All SVG images are 400 x 300 => w=1.8*r, h=w*0.75
		const w = 1.8*r;
		const wper2 = w*0.5;
		const h = w*0.75;
		const hper2 = h*0.5;
		
		// Four circles (three visible):
		// 1. outer border (opacity=0.5)
		// 2. 10% smaller inner circle (opacity=0.5)
		// 3. 30% smaller inner circle (opacity=1)
		// 4. surface, same size as bordr (opacity=0)
		const r2 = r-r*0.2;
		//const r2 = r-r*0.1;
		//const r3 = r-r*0.3;
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		if (type === 'LOGOUT') {
			// Move LOGOUT-button to upper-right corner.
			tx = this.REO.width*0.5 - w;
			ty = -this.REO.height*0.5 + h;
		}
		
		const group = document.createElementNS(svgNS, "g");
		
		const border = document.createElementNS(svgNS, "circle");
		border.setAttributeNS(null, 'cx', 0);
		border.setAttributeNS(null, 'cy', 0);
		border.setAttributeNS(null, 'r', r);
		border.style.fill = this.colors.WHITE;
		border.style.fillOpacity = 0.5;
		border.style.stroke = this.colors.DARK_GREEN;
		border.style.strokeWidth = 2;
		group.appendChild(border);
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', 0);
		ca.setAttributeNS(null, 'r', r2);
		ca.style.fill = this.colors.WHITE;
		ca.style.fillOpacity = 1;//0.5;
		ca.style.stroke = this.colors.DARK_GREEN;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
		if (type === 'LOGOUT') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/logout.svg');
			group.appendChild(img);
		}
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', 0);
		surface.setAttributeNS(null, 'r', r);
		surface.style.stroke = this.colors.DARK_GREEN;
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		
		// Select which pages open...
		if (type === 'LOGOUT') {
			surface.addEventListener("click", function(){
				//const UM = self.controller.master.modelRepo.get('UserModel');
				//if (UM) {
					//UM.logout();
				//}
				self.models['MenuModel'].setSelected('menu');
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
		let r = this.sunRadius()*2; // r = 25% => d = 50%
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
		this.appendSun('LOGOUT');
		
		
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
