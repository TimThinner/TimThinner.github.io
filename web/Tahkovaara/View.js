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
	
	
	setDashArrayLength(svgObject, path) {
		const p = svgObject.getElementById(path);
		if (p) {
			const len = p.getTotalLength();
			console.log(['len=',len]);
			p.style.strokeDasharray = len+'px '+len+'px';
			p.style.strokeWidth = 10;
			const anim = svgObject.getElementById(path+'-animate');
			anim.setAttributeNS(null, 'from', len);
		} else {
			console.log('p is null!!!!!');
		}
	}
	
	setStroke(svgObject, path, strokeColor, strokeWidth) {
		const p = svgObject.getElementById(path);
		if (p) {
			p.style.stroke = strokeColor;
			p.style.strokeWidth = strokeWidth;
		} else {
			console.log('p is null!!!!!');
		}
	}
	
	
	
	
	addSVGEventHandlers() {
		const self = this;
		
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
/*
Animated line drawing in SVG:
http://bkaprt.com/psvg/07-17/
http://bkaprt.com/psvg/07-18/
NOTE: Values stroke-dasharray set to 0px 0px and animate from to 0 in SVG-file.
These are filled with correct values in here:
*/
			/*const path = svgObject.getElementById('first-building-path');
			var len = path.getTotalLength();
			console.log(['len=',len]);
			//stroke-dasharray:700px 700px
			path.style.strokeDasharray = len+'px '+len+'px';
			const anim = svgObject.getElementById('first-building-path-animate');
			anim.setAttributeNS(null, 'from', len);
			
			first  = #51b0ce
			second = #73d3ae
			third  = #1fac78
			*/
			
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'first-letter-path');
			}, 1000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'second-letter-path');
			}, 1000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'sixth-letter-path');
			}, 2000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'seventh-letter-path');
			}, 2000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'eight-letter-path');
			}, 3000);
			setTimeout(() => { 
				this.setDashArrayLength(svgObject, 'tenth-letter-path');
			}, 4000);
			
			setTimeout(() => { 
				this.setStroke(svgObject, 'c5', '#888', '5px');
			}, 1250);
			setTimeout(() => { 
				this.setStroke(svgObject, 'c4', '#888', '5px');
			}, 2000);
			setTimeout(() => { 
				this.setStroke(svgObject, 'c3', '#888', '5px');
			}, 2500);
			setTimeout(() => { 
				this.setStroke(svgObject, 'c2', '#888', '5px');
			}, 3000);
			setTimeout(() => { 
				this.setStroke(svgObject, 'c1', '#888', '5px');
			}, 3500);
			
			//this.setDashArrayLength(svgObject, 'third-building-path');
			
			//setTimeout(() => { 
				//this.setStroke(svgObject, 'first-painting-path', '#51b0ce', '50px');
				//this.setStroke(svgObject, 'second-painting-path', '#73d3ae', '10px');
				//this.setStroke(svgObject, 'third-painting-path', '#1fac78', '10px');
			//}, 4000);
			//this.setDashArrayLength(svgObject, 'first-painting-path');
			//this.setDashArrayLength(svgObject, 'second-painting-path');
			//this.setDashArrayLength(svgObject, 'third-painting-path');
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
