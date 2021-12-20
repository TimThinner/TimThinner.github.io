import View from '../common/View.js';

export default class MenuView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
			
		});
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'menuview-message';
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
				this.createBall();
			}
		}
	}
	
	createBall() {
		$(this.el).empty();
		
		console.log('CREATE SVG BALL!');
		const svgNS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(svgNS, "svg");
		
		const w = this.REO.width-10;
		const h = this.REO.height-10;
		const wp2 = Math.round(w/2);
		const hp2 = Math.round(h/2);
		
		const vb = '-'+wp2+' -'+hp2+' '+w+' '+h;
		svg.setAttributeNS(null,'width',w);
		svg.setAttributeNS(null,'height',h);
		svg.setAttributeNS(null,'viewBox',vb);
		
		/*var rect = document.createElementNS(svgNS,'rect');
		rect.setAttribute('x',5);
		rect.setAttribute('y',5);
		rect.setAttribute('width',500);
		rect.setAttribute('height',500);
		rect.setAttribute('fill','#95B3D7');
		svg.appendChild(rect);
		document.body.appendChild(svg);
		
		var h = document.createElement('a');
		h.setAttribute('href', 'http://www.google.com');
		var t=document.createTextNode('Hello World');
		h.appendChild(t);
		document.body.appendChild(h);*/
		const r = Math.min(wp2, hp2);
		
		const uc = document.createElementNS(svgNS, "circle");
		uc.setAttributeNS(null, 'cx', 0);
		uc.setAttributeNS(null, 'cy', 0);
		uc.setAttributeNS(null, 'r', r);
		uc.style.stroke = '#000'; 
		uc.style.fill = '#fff';
		svg.appendChild(uc);
		const BW = document.getElementById('svg-ball-wrapper');
		if (BW) {
			BW.appendChild(svg);
		}
	}
	
	render() {
		$(this.el).empty();
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="row">'+
						'<div class="col s12 center" id="svg-ball-wrapper"></div>'+
						'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
				$(html).appendTo('#'+this.FELID);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				this.createBall();
			}
		} else {
			console.log('MenuView => render models ARE NOT READY!!!!');
			this.showSpinner('#svg-ball-wrapper');
		}
	}
}
