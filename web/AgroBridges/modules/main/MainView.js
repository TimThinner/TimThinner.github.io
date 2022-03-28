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
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).empty();
		let wrap = document.getElementById(this.el.slice(1));
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		}
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		//this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		// Vanilla JS equivalents of jQuery methods SEE: https://gist.github.com/joyrexus/7307312
		//$(this.el).empty();
		let wrap = document.getElementById(this.el.slice(1));
		if (wrap) {
			while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		}
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
		const r = this.sunRadius();
		
		const r2 = r-r*0.1;
		const r3 = r-r*0.3;
		
		// All SVG images are 400 x 300 => w=r, h=r*0.75
		const w = r;
		const wper2 = w*0.5;
		const h = r*0.75;
		const hper2 = h*0.5;
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		if (type === 'BUILDING') {
			tx = ty = -12*r/5;
		} else if (type === 'LOGOUT') {
			tx = 12*r/5;
			ty = -12*r/5;
		} else if (type === 'HEATING') {
			tx = -12*r/5;
			ty = 12*r/5;
		} else if (type === 'FEEDBACK') {
			tx = ty = 12*r/5;
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
		ca.style.fillOpacity = 0.5;
		ca.style.stroke = this.colors.DARK_GREEN;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
		const cb = document.createElementNS(svgNS, "circle");
		cb.setAttribute('cx', 0);
		cb.setAttribute('cy', 0);
		cb.setAttribute('r', r3);
		cb.style.fill = this.colors.WHITE;
		cb.style.fillOpacity = 1;
		cb.style.stroke = this.colors.DARK_GREEN;
		cb.style.strokeWidth = 0.5;
		group.appendChild(cb);
		
		if (type === 'USER') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/user.svg');
			group.appendChild(img);
		} else if (type === 'BUILDING') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/building.svg');
			group.appendChild(img);
		} else if (type === 'LOGOUT') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/logout.svg');
			group.appendChild(img);
		} else if (type === 'HEATING') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/radiator.svg');
			group.appendChild(img);
		} else if (type === 'FEEDBACK') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', -wper2);
			img.setAttribute('y', -hper2);
			img.setAttribute('width', w);
			img.setAttribute('height', h);
			img.setAttribute('href', './svg/feedback.svg');
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
		if (type === 'USER') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('USERPROPS');
			}, false);
		} else if (type === 'BUILDING') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('menu');
			}, false);
		} else if (type === 'LOGOUT') {
			surface.addEventListener("click", function(){
				//const UM = self.controller.master.modelRepo.get('UserModel');
				//if (UM) {
					//UM.logout();
				//}
				self.models['MenuModel'].setSelected('menu');
				
				
			}, false);
		} else if (type === 'HEATING') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('USERHEATING');
			}, false);
		} else if (type === 'FEEDBACK') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('USERFEEDBACK');
			}, false);
		}
		
		surface.addEventListener("mouseover", function(event){ 
			border.style.fill = this.colors.DARK_GREEN;
		}, false);
		surface.addEventListener("mouseout", function(event){ 
			border.style.fill = this.colors.WHITE;
		}, false);
		
		group.appendChild(surface);
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
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
