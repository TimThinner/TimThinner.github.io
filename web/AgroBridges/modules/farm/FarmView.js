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
	
	appendBackButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		const w = this.REO.width;
		const h = this.REO.height;
		// Position back-button left and below horizontal line in Making City logo.
		let bw;
		if (w <= 600) {
			bw = 60;
		} else if (w > 600 && w <= 992) {
			bw = 70;
		} else if (w > 992 && w <= 1200) {
			bw = 80;
		} else {
			bw = 90;
		}
		
		const bh = bw * 0.667 ; // bw * 100/150
		const bx = -bw*0.5;
		const by = h*0.5 - bh;
		
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
