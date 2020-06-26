export default class View {
	
	constructor() {
		
		this.el = '#content';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	
	setDashArrayLength(svgObject, path, strokeColor, strokeWidth) {
		const p = svgObject.getElementById(path);
		if (p) {
			const len = p.getTotalLength();
			console.log(['len=',len]);
			p.style.strokeDasharray = len+'px '+len+'px';
			p.style.stroke = strokeColor;
			const anim = svgObject.getElementById(path+'-animate');
			anim.setAttributeNS(null, 'from', len);
			
			// Set stroke-width LAST!
			
			p.style.strokeWidth = strokeWidth;
			
			
		} else {
			console.log('p is null!!!!!');
		}
	}
	
	setStroke(svgObject, path, strokeColor, strokeWidth, fill) {
		const p = svgObject.getElementById(path);
		if (p) {
			p.style.stroke = strokeColor;
			// Optional params:
			if (typeof strokeWidth !== 'undefined') {
				p.style.strokeWidth = strokeWidth;
			}
			if (typeof fill !== 'undefined') {
				p.style.fill = fill;
			}
		} else {
			console.log('p is null!!!!!');
		}
	}
	
	addSVGEventHandlers() {
		const self = this;
		
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'first-letter-path', '#000', 10);
			}, 1000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'first-letter-addpath', '#000', 5);
			}, 2000);
			
			setTimeout(() => { 
				this.setStroke(svgObject, 'c5', '#000', 5, '#eee');
			}, 2000);
			setTimeout(() => { 
				this.setStroke(svgObject, 'c4', '#000', 5, '#eee');
			}, 3000);
			setTimeout(() => { 
				this.setStroke(svgObject, 'c3', '#000', 5, '#eee');
			}, 4000);
			setTimeout(() => { 
				this.setStroke(svgObject, 'c2', '#000', 5, '#eee');
			}, 5000);
			setTimeout(() => { 
				this.setStroke(svgObject, 'c1', '#000', 5, '#eee');
			}, 6000);
			
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'second-letter-path', '#000', 10);
			}, 3000);
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'third-letter-path', '#000', 10);
			}, 4000);
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'fourth-letter-path', '#000', 10);
			}, 5000);
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'fifth-letter-outerpath', '#000', 10);
			}, 6000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'fifth-letter-innerpath', '#000', 7);
			}, 7000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'fifth-letter-fill', '#f80', 7);
			}, 14000);
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'sixth-letter-path', '#000', 10);
			}, 9000);
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'seventh-letter-path', '#000', 10);
			}, 9000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'eight-letter-path', '#000', 10);
			}, 9000);
			
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'ninth-letter-outerpath', '#000', 10);
			}, 9000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'ninth-letter-innerpath', '#000', 7);
			}, 9000);
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'tenth-letter-path', '#000', 10);
			}, 9000);
			/*
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'overline-path', '#484', 400);
			}, 15000);
			setTimeout(() => { 
				this.setStroke(svgObject, 'first-letter-path', '#fff');
				this.setStroke(svgObject, 'first-letter-addpath', '#fff');
				this.setStroke(svgObject, 'second-letter-path', '#fff');
				this.setStroke(svgObject, 'third-letter-path', '#fff');
				this.setStroke(svgObject, 'fourth-letter-path', '#fff');
				//this.setStroke(svgObject, 'fifth-letter-outerpath', '#fff');
				//this.setStroke(svgObject, 'fifth-letter-innerpath', '#fff');
				this.setStroke(svgObject, 'sixth-letter-path', '#fff');
				this.setStroke(svgObject, 'seventh-letter-path', '#fff');
				this.setStroke(svgObject, 'eight-letter-path', '#fff');
				this.setStroke(svgObject, 'ninth-letter-outerpath', '#fff');
				this.setStroke(svgObject, 'ninth-letter-innerpath', '#fff');
				this.setStroke(svgObject, 'tenth-letter-path', '#fff');
			}, 19000);
			*/
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const svgFile = './head.svg';
		const svgClass = 'svg-landscape-container';
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+ // style="padding-left:0;padding-right:0;">'+
					'<div class="'+svgClass+'">'+
						'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		// AND WAIT for SVG object to fully load, before assigning event handlers!
		const svgObj = document.getElementById("svg-object");
		svgObj.addEventListener('load', function(){
			console.log('ADD SVG EVENT HANDLERS!');
			self.addSVGEventHandlers();
		});
	}
}
