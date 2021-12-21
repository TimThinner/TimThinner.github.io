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
		this.BALLID = 'svg-ball-wrapper';
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
				if (this.rendered===true) {
					this.createBall();
				} else {
					this.render();
				}
			}
		}
	}
	
	createBall() {
		$('#'+this.BALLID).empty();
		
		console.log('CREATE SVG BALL!');
		const svgNS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(svgNS, "svg");
		
		const w = Math.round(this.REO.width*0.75);
		const h = Math.round(this.REO.height*0.75);
		const wp2 = Math.round(w*0.5);
		const hp2 = Math.round(h*0.5);
		
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
		
		const c = document.createElementNS(svgNS, "circle");
		c.setAttributeNS(null, 'cx', 0);
		c.setAttributeNS(null, 'cy', 0);
		c.setAttributeNS(null, 'r', r);
		c.style.stroke = '#000'; 
		c.style.fill = '#fff';
		svg.appendChild(c);
		
		const BALLWRAPPER = document.getElementById(this.BALLID);
		if (BALLWRAPPER) {
			console.log('APPEND SVG AND BALL!!!!!');
			BALLWRAPPER.appendChild(svg);
		}
	}
	
	render() {
		$(this.el).empty();
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.BALLID+'"></div>'+
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
			this.showSpinner('#'+this.BALLID);
		}
	}
}
