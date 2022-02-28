import View from '../common/View.js';

/*
#f3e5f5 purple lighten-5
#e1bee7 purple lighten-4
#ce93d8 purple lighten-3
#ba68c8 purple lighten-2
#ab47bc purple lighten-1
#9c27b0 purple
#8e24aa purple darken-1
#7b1fa2 purple darken-2
#6a1b9a purple darken-3
#4a148c purple darken-4

#e8f5e9 green lighten-5
#c8e6c9 green lighten-4
#a5d6a7 green lighten-3
#81c784 green lighten-2
#66bb6a green lighten-1
#4caf50 green
#43a047 green darken-1
#388e3c green darken-2
#2e7d32 green darken-3
#1b5e20 green darken-4

#fbe9e7 deep-orange lighten-5
#ffccbc deep-orange lighten-4
#ffab91 deep-orange lighten-3
#ff8a65 deep-orange lighten-2
#ff7043 deep-orange lighten-1
#ff5722 deep-orange
#f4511e deep-orange darken-1
#e64a19 deep-orange darken-2
#d84315 deep-orange darken-3
#bf360c deep-orange darken-4

#e1f5fe light-blue lighten-5
#b3e5fc light-blue lighten-4
#81d4fa light-blue lighten-3
#4fc3f7 light-blue lighten-2
#29b6f6 light-blue lighten-1
#03a9f4 light-blue
#039be5 light-blue darken-1
#0288d1 light-blue darken-2
#0277bd light-blue darken-3
#01579b light-blue darken-4

#e0f2f1 teal lighten-5
#b2dfdb teal lighten-4
#80cbc4 teal lighten-3
#4db6ac teal lighten-2
#26a69a teal lighten-1
#009688 teal
#00897b teal darken-1
#00796b teal darken-2
#00695c teal darken-3
#004d40 teal darken-4
*/

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
		this.selectedColor = 'deep-orange';
	}
	
	show() {
		console.log('MenuView show()');
		this.render();
	}
	
	hide() {
		console.log('MenuView hide()');
		this.rendered = false;
		
		let wrap = document.getElementById(this.el.slice(1));
		while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		//$(this.el).empty();
	}
	
	remove() {
		console.log('MenuView remove()');
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		
		let wrap = document.getElementById(this.el.slice(1));
		while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		//$(this.el).empty();
	}
	
	appendButton(type) {
		const self = this;
		const w = this.REO.width;
		const h = this.REO.height;
		const bw = w*0.45;
		const bh = h*0.45;
		
		const svgNS = 'http://www.w3.org/2000/svg';
		
		const BLACK = '#000';
		const WHITE = '#fff';
		const DARK_BLUE = '#1a488b'; // ( 26,  72, 139)
		const GREEN = '#0f0';
		
		const TEAL_LIGHTEN_4 = '#b2dfdb';
		const TEAL_LIGHTEN_3 = '#80cbc4';
		const TEAL_LIGHTEN_2 = '#4db6ac';
		const TEAL_LIGHTEN_1 = '#26a69a';
		const TEAL = '#009688';
		const TEAL_DARKEN_1 = '#00897b';
		const TEAL_DARKEN_2 = '#00796b';
		const TEAL_DARKEN_3 = '#00695c';
		const TEAL_DARKEN_4 = '#004d40';
		
		let tx = 0, ty = 0; // 'transform' => 'translate('+tx+','+ty+')'
		if (type === 'TL') {
			tx = -w*0.25;
			ty = -h*0.25;
		} else if (type === 'TR') {
			tx = w*0.25;
			ty = -h*0.25;
		} else if (type === 'BL') {
			tx = -w*0.25;
			ty = h*0.25;
		} else if (type === 'BR') {
			tx = w*0.25;
			ty = h*0.25;
		}
		
		const group = document.createElementNS(svgNS, "g");
		
		const border = document.createElementNS(svgNS, "rect");
		border.setAttributeNS(null, 'x', -bw*0.5);
		border.setAttributeNS(null, 'y', -bh*0.5);
		border.setAttributeNS(null, 'width', bw);
		border.setAttributeNS(null, 'height', bh);
		border.setAttributeNS(null, 'rx', 10);
		border.style.fill = TEAL_DARKEN_2;
		border.style.fillOpacity = 0.5;
		border.style.stroke = TEAL_DARKEN_4;
		border.style.strokeWidth = 5;
		group.appendChild(border);
		
		/*
		<svg x="-100" y="410" width="200px" height="32px">
			<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" id="version" class="version-info"></text>
		</svg>
		*/
		// TEXT is wrapped inside SVG-element.
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttributeNS(null, 'x', -bw*0.5);
		svg.setAttributeNS(null, 'y', -bh*0.5);
		svg.setAttributeNS(null, 'width', bw);
		svg.setAttributeNS(null, 'height', bh);
		
		const txt = document.createElementNS(svgNS, 'text');
		txt.setAttribute('x','50%');
		txt.setAttribute('y','50%');
		txt.setAttribute('font-family','Arial, Helvetica, sans-serif');
		txt.setAttribute('font-size','42px');
		txt.setAttribute('font-weight','bold');
		txt.setAttribute('dominant-baseline','middle');
		txt.setAttribute('text-anchor','middle');
		txt.style.fill = '#fff';
		txt.style.stroke = '#000';
		txt.style.strokeWidth = 1;
		const text_node = document.createTextNode(type);
		txt.appendChild(text_node);
		svg.appendChild(txt);
		group.appendChild(svg);
		
		const surface = document.createElementNS(svgNS, "rect");
		surface.setAttributeNS(null, 'x', -bw*0.5);
		surface.setAttributeNS(null, 'y', -bh*0.5);
		surface.setAttributeNS(null, 'width', bw);
		surface.setAttributeNS(null, 'height', bh);
		surface.style.opacity = 0;
		surface.style.fillOpacity = 0;
		surface.style.cursor = 'pointer';
		
		// If button is clicked:
		surface.addEventListener("click", function(){
			console.log('Button is clicked!');
		}, false);
		
		surface.addEventListener("mouseover", function(event){ 
			border.style.stroke = TEAL_LIGHTEN_4;
			border.style.fill = TEAL_LIGHTEN_2;
		}, false);
		surface.addEventListener("mouseout", function(event){ 
			border.style.stroke = TEAL_DARKEN_4;
			border.style.fill = TEAL_DARKEN_2;
		}, false);
		
		group.appendChild(surface);
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		document.getElementById('space').appendChild(group);
		//$('#space').append(group);
	}
	
	/*
	<defs>
	<radialGradient id="grad" cx="50%" cy="50%" r="100%">
		<stop offset="10%" style="stop-color:#fff; stop-opacity:1" />
		<stop offset="50%" style="stop-color:#eee; stop-opacity:1" />
		<stop offset="90%" style="stop-color:#ddd; stop-opacity:1" />
	</radialGradient>
	</defs>
	<rect x="-900" y="-500" width="1800" height="900" fill="url(#grad)" stroke-width="0" stroke="#000" />
	
	https://stackoverflow.com/questions/13760299/dynamic-svg-linear-gradient-when-using-javascript
	
	*/
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
		rect.setAttribute('fill', '#fff');
		
		svg.appendChild(rect);
		document.getElementById(this.el.slice(1)).appendChild(svg);
		//$(this.el).append(svg);
	}
	
	renderALL() {
		console.log('renderALL()!!!! VANILLA ');
		//$(this.el).empty();
		// Vanilla
		let wrap = document.getElementById(this.el.slice(1));
		while(wrap.firstChild) wrap.removeChild(wrap.firstChild);
		
		this.createSpace();
		this.appendButton('TL');
		this.appendButton('TR');
		this.appendButton('BL');
		this.appendButton('BR');
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
		console.log('MenuView render()');
		this.renderALL();
		this.rendered = true;
	}
}
