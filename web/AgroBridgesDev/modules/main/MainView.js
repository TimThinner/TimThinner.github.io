import View from '../common/View.js';

/*

Experiment with curved text

https://developer.mozilla.org/en-US/docs/Web/SVG/Element/textPath


<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

<!-- to hide the path, it is usually wrapped in a <defs> element -->
<!-- <defs> -->
<path id="MyPath" fill="none" stroke="red"
      d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
<!-- </defs> -->

<text>
  <textPath href="#MyPath">
    Quick brown fox jumps over the lazy dog.
  </textPath>
</text>
</svg>


Flag_of_the_United_Kingdom.svg.png		255 x 128
Flag_of_Denmark.svg.png					255 x 193
Flag_of_Greece.svg.png					255 x 170
Bandera_de_España.svg.png				255 x 170
Flag_of_France.svg.png					255 x 170
Flag_of_Italy.svg.png					255 x 170
Flag_of_Latvia.svg.png					255 x 128
Flag_of_Lithuania.svg.png				255 x 153
Flag_of_the_Netherlands.svg.png			255 x 170
Flag_of_Poland.svg.png					255 x 159
Flag_of_Finland.svg.png					255 x 156
Flag_of_Turkey.svg.png					255 x 170
*/

export default class MainView extends View {
	
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
		const wp2 = w*0.12; // w*0.125;
		const hp2 = h*0.12; // h*0.125;
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
		const image_w = 1.5*r;//2*r;
		const image_h = image_w*0.75;
		const image_x = this.REO.width*0.5 - image_w;
		const image_y = -this.REO.height*0.5 + image_h*2;
		
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
		
		if (type === 'FARM') {
			const aState = this.USER_MODEL.profileFarmState();
			fillStatus = aState.filled+'/'+aState.total;
			if (aState.ready===false) {
				filledColor = this.colors.LIGHT_RED;
				strokeWidth = 4;
				strokeColor = this.colors.DARK_RED;
			}
			
			
		} else if (type === 'ACTIVITIES') {
			const aState = this.USER_MODEL.profileActivitiesState();
			fillStatus = aState.filled+'/'+aState.total;
			if (aState.ready===false) {
				filledColor = this.colors.LIGHT_RED;
				strokeWidth = 4;
				strokeColor = this.colors.DARK_RED;
			}
			
		} else if (type === 'PRODUCER') {
			const aState = this.USER_MODEL.profileProducerState();
			fillStatus = aState.filled+'/'+aState.total;
			if (aState.ready===false) {
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
		
		//const image_w = r;
		//const image_h = image_w*0.75;
		
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
		
		if (type === 'FARM') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './img/photo-farm.png');
			group.appendChild(img);
			
			
		} else if (type === 'ACTIVITIES') {
			
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './img/photo-activities.png');
			group.appendChild(img);
			
			
		} else if (type === 'PRODUCER') {
			const img = document.createElementNS(svgNS, "image");
			img.setAttribute('x', icon_x);
			img.setAttribute('y', icon_y);
			img.setAttribute('width', icon_w);
			img.setAttribute('height', icon_h);
			img.setAttribute('href', './img/photo-farmer.png');
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
		
		// Select which pages open...
		if (type === 'FARM') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('farm');
			}, false);
			
		} else if (type === 'ACTIVITIES') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('activities');
			}, false);
			
		} else if (type === 'PRODUCER') {
			surface.addEventListener("click", function(){
				self.models['MenuModel'].setSelected('producer');
			}, false);
		}
		
		surface.addEventListener("mouseover", function(event){ 
			border.style.fill = self.colors.DARK_ORANGE;
		}, false);
		surface.addEventListener("mouseout", function(event){ 
			border.style.fill = self.colors.LIGHT_ORANGE;
		}, false);
		
		group.appendChild(surface);
		
		// NOTE: Transform all elements 100 pixels down!
		ty += 80;
		
		
		group.setAttribute('transform', 'translate('+tx+','+ty+')');
		$('#space').append(group);
	}
	/*
	
	Note:
	Analysis "button" is always rendered, but it is "active" if all required questions are fllled.
	*/
	appendAnalysisButton() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius(); // Radius 12,5%
		
		const cy = 80;
		
		let fontsize;
		if (r <= 75) {
			fontsize = 14;
		} else if (r > 75 && r <= 124) {
			fontsize = 18;
		} else if (r > 124 && r <= 150) {
			fontsize = 22;
		} else {
			fontsize = 26;
		}
		const mainState = this.USER_MODEL.mainState();
		if (mainState.ready === true) {
			// Analysis "button" is active
			fontsize = fontsize+2;
		}
		const titleSVGHeight = fontsize;
		
		/*
		let icon_w = 2*r;
		let icon_x = -icon_w*0.5;
		let icon_h = icon_w*0.75; // All SVG images are 400 x 300 => w=r, h=r*0.75
		let icon_y = - icon_h*0.5;
		*/
		const image_w = 1.8*r;
		const image_h = image_w*0.75;
		
		// Three circles (two visible):
		// 1. outer border (opacity=0.75)
		// 2. 20% smaller inner circle (opacity=1)
		// 3. surface, same size as outer border (opacity=0)
		const r2 = r-r*0.2;
		
		const group = document.createElementNS(svgNS, "g");
		
		const border = document.createElementNS(svgNS, "circle");
		border.setAttributeNS(null, 'cx', 0);
		border.setAttributeNS(null, 'cy', cy);
		border.setAttributeNS(null, 'r', r);
		if (mainState.ready === true) {
			border.style.fill = this.colors.LIGHT_ORANGE;
			border.style.stroke = this.colors.DARK_ORANGE;
		} else {
			border.style.fill = this.colors.LIGHT_GREY;
			border.style.stroke = this.colors.GREY;
		}
		border.style.fillOpacity = 0.75;
		border.style.strokeWidth = 5;
		group.appendChild(border);
		
		const ca = document.createElementNS(svgNS, "circle");
		ca.setAttributeNS(null, 'cx', 0);
		ca.setAttributeNS(null, 'cy', cy);
		ca.setAttributeNS(null, 'r', r2);
		if (mainState.ready === true) {
			ca.style.fill = this.colors.LIGHT_ORANGE;
			ca.style.stroke = this.colors.DARK_ORANGE;
		} else {
			ca.style.fill = this.colors.LIGHT_GREY;
			ca.style.stroke = this.colors.GREY;
		}
		ca.style.fillOpacity = 1;
		ca.style.strokeWidth = 1;
		group.appendChild(ca);
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-image_w*0.5);
		svg.setAttribute('y',-titleSVGHeight*0.5+cy);
		svg.setAttributeNS(null,'width',image_w);
		svg.setAttributeNS(null,'height',titleSVGHeight);
		
		const title = document.createElementNS(svgNS, 'text');
		title.setAttribute('x','50%');
		title.setAttribute('y','50%');
		title.setAttribute('font-family','Arial, Helvetica, sans-serif');
		title.setAttribute('font-size',fontsize);
		title.setAttribute('dominant-baseline','middle');
		title.setAttribute('text-anchor','middle');
		if (mainState.ready === true) {
			title.setAttribute('fill',this.colors.DARK_ORANGE);
		} else {
			title.setAttribute('fill',this.colors.GREY);
		}
		title.style.opacity = 1;
		title.appendChild(document.createTextNode('ANALYSIS'));
		svg.appendChild(title);
		group.appendChild(svg);
		
		const surface = document.createElementNS(svgNS, "circle");
		surface.setAttributeNS(null, 'cx', 0);
		surface.setAttributeNS(null, 'cy', cy);
		surface.setAttributeNS(null, 'r', r);
		if (mainState.ready === true) {
			surface.style.stroke = this.colors.DARK_ORANGE;
		} else {
			surface.style.stroke = this.colors.GREY;
		}
		surface.style.strokeWidth = 1;
		surface.style.fillOpacity = 0;
		surface.style.opacity = 0;
		surface.style.cursor = 'pointer';
		
		// Select which pages open...
		surface.addEventListener("click", function(){
			if (mainState.ready === true) {
				
				// Start the analysis and open AnalysisView.
				const data = {placeholder:'whatever'};
				self.USER_MODEL.runAnalysis(data);
				self.models['MenuModel'].setSelected('analysis');
			} else {
				console.log('ANALYSIS!');
			}
		}, false);
		
		surface.addEventListener("mouseover", function(event){ 
			if (mainState.ready === true) {
				border.style.fill = self.colors.DARK_ORANGE;
			} else {
				border.style.fill = self.colors.GREY;
			}
		}, false);
		surface.addEventListener("mouseout", function(event){ 
			if (mainState.ready === true) {
				border.style.fill = self.colors.LIGHT_ORANGE;
			} else {
				border.style.fill = self.colors.LIGHT_GREY;
			}
		}, false);
		
		group.appendChild(surface);
		
		$('#space').append(group);
	}
	
	appendProgress() {
		const self = this;
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius()*2.5; // r = 31,25% => d = 62,5%
		let ro = r+r*0.1;
		let ri = r-r*0.1;
		
		const cy=80; 
		
		const group = document.createElementNS(svgNS, "g");
		
		const outer = document.createElementNS(svgNS, "circle");
		outer.setAttributeNS(null, 'cx', 0);
		outer.setAttributeNS(null, 'cy', cy);
		outer.setAttributeNS(null, 'r', ro);
		outer.style.fill = 'none';
		outer.style.fillOpacity = 0;
		outer.style.stroke = this.colors.DARK_GREEN;
		outer.style.opacity = 0.25;
		outer.style.strokeWidth = 3;
		group.appendChild(outer);
		
		const inner = document.createElementNS(svgNS, "circle");
		inner.setAttributeNS(null, 'cx', 0);
		inner.setAttributeNS(null, 'cy', cy);
		inner.setAttributeNS(null, 'r', ri);
		inner.style.fill = 'none';
		inner.style.fillOpacity = 0;
		inner.style.stroke = this.colors.DARK_GREEN;
		inner.style.opacity = 0.25;
		inner.style.strokeWidth = 3;
		group.appendChild(inner);
		
		$('#space').append(group);
	}
	
	
	appendTitle() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		const w = this.REO.width;
		const h = this.REO.height;
		
		// Logo original dimensions are 1920 x 1080 pixels.
		// Set a maximum width for logo: NO MORE THAN 160 px ever.
		let logo_w = w*0.2;
		if (logo_w > 160) {
			logo_w = 160;
		}
		const logo_h = Math.floor(logo_w*108/192);
		
		const txt = 'Decision support tool for farmers';
		let fontsize = Math.floor(logo_h*0.5);
		const group = document.createElementNS(svgNS, "g");
		
		group.appendChild(this.createFooterSVG(
			-w*0.5+logo_w,
			-h*0.5+fontsize*0.5,
			w-logo_w,
			fontsize,
			txt, fontsize)
		);
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
	
	
	
	createFooterSVG(x, y, w, h, txt, fontsize, fill) {
		const svgNS = 'http://www.w3.org/2000/svg';
		
		let fille = this.colors.SPACE_FILL;
		if (typeof fill !== 'undefined') {
			fille = fill;
		}
		
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',x);
		svg.setAttribute('y',y);
		svg.setAttributeNS(null,'width',w);
		svg.setAttributeNS(null,'height',h);
		
		const rect = document.createElementNS(svgNS, 'rect');
		rect.setAttribute('x',0);
		rect.setAttribute('y',0);
		rect.setAttribute('width',w);
		rect.setAttribute('height',h);
		rect.style.stroke = '#ccc';
		rect.style.strokeWidth = 0;
		rect.style.fill = fille;
		svg.appendChild(rect);
		
		const foot_a = document.createElementNS(svgNS, 'text');
		foot_a.setAttribute('x','50%');
		foot_a.setAttribute('y','50%');
		foot_a.setAttribute('font-family','Arial, Helvetica, sans-serif');
		foot_a.setAttribute('font-size',fontsize);
		foot_a.setAttribute('dominant-baseline','middle');
		foot_a.setAttribute('text-anchor','middle');
		foot_a.setAttribute('fill',this.colors.DARK_GREEN);
		foot_a.style.opacity = 1;
		foot_a.appendChild(document.createTextNode(txt));
		svg.appendChild(foot_a);
		
		return svg;
	}
	
	
	
	
	
	appendHeader() {
		
		const self = this;
		
		//appendLogo
		//appendTitle
		//appendLogoutButton
		const svgNS = 'http://www.w3.org/2000/svg';
		
		const w = this.REO.width;
		const h = this.REO.height;
		
		console.log(['w=',w]);
		
		
		
		
		
		
		const group = document.createElementNS(svgNS, "g");
		
		// Logo original dimensions are 1920 x 1080 pixels.
		
		// Set a maximum width for logo: NO MORE THAN 140 px ever.
		let logo_w = w*0.2;
		if (logo_w > 140) {
			logo_w = 140;
		}
		const logo_h = Math.floor(logo_w*108/192);
		//const x_margin = 8;
		//const y_margin = 8;
		
		const logo_x_pos = -w*0.5;//+x_margin;
		const logo_y_pos = -h*0.5;//+y_margin;
		const logo = document.createElementNS(svgNS, "image");
		logo.setAttribute('x', logo_x_pos);
		logo.setAttribute('y', logo_y_pos);
		logo.setAttribute('width', logo_w);
		logo.setAttribute('height', logo_h);
		logo.setAttribute('href', './img/logo.png');
		group.appendChild(logo);
		
		if (w > 1000) {
			/*
			const rx = -w*0.5+logo_w;
			const ry = -h*0.5;
			const rw = w-logo_w*2; // Symmetric!
			const rh = logo_h;
			const rect = document.createElementNS(svgNS, 'rect');
			// Setup the <rect> element.
			rect.setAttribute('x',rx);
			rect.setAttribute('y',ry);
			rect.setAttribute('width',rw);
			rect.setAttribute('height',rh);
			rect.style.fill = this.colors.LIGHT_ORANGE;
			rect.style.fillOpacity = 0.5;
			rect.style.stroke = this.colors.DARK_ORANGE;
			rect.style.strokeWidth = 1;
			group.appendChild(rect);
			*/
			const txt = 'Decision support tool for farmers';
			let fontsize = Math.floor(logo_h*0.4);
			group.appendChild(this.createFooterSVG(
				-w*0.5+logo_w,
				-h*0.5,
				w-logo_w*2, // Symmetric!
				logo_h,
				txt, fontsize, 'none')
			);
			
		} else {
			/*
			const rx = -w*0.5;
			const ry = -h*0.5+logo_h;
			const rw = w;
			const rh = logo_h;
			const rect = document.createElementNS(svgNS, 'rect');
			// Setup the <rect> element.
			rect.setAttribute('x',rx);
			rect.setAttribute('y',ry);
			rect.setAttribute('width',rw);
			rect.setAttribute('height',rh);
			rect.style.fill = this.colors.LIGHT_ORANGE;
			rect.style.fillOpacity = 0.5;
			rect.style.stroke = this.colors.DARK_ORANGE;
			rect.style.strokeWidth = 1;
			group.appendChild(rect);
			*/
			//console.log(['w=',w]);
			
			let hh = -30 + (1000-w)*0.1;
			
			const txt = 'Decision support tool for farmers';
			let fontsize = Math.floor(logo_h*0.4);
			group.appendChild(this.createFooterSVG(
				-w*0.5,
				-h*0.5+logo_h+hh,
				w,
				logo_h,
				txt, fontsize, 'none')
			);
		}
		
		// All SVG images are 400 x 300 => w=1.8*r, h=w*0.75
		const image_w = 50;
		const image_h = image_w*0.75;
		const image_x = w*0.5 - image_w;
		const image_y = -h*0.5 + image_h*0.25;
		
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
		group.appendChild(img);
		
		
		const help_w = 50;
		const help_h = help_w*0.75;
		const help_x = w*0.5 - help_w*2;
		const help_y = -h*0.5 + help_h*0.25;
		
		const help = document.createElementNS(svgNS, "image");
		help.setAttribute('x', help_x);
		help.setAttribute('y', help_y);
		help.setAttribute('width', help_w);
		help.setAttribute('height', help_h);
		help.setAttribute('href', './img/help.png');
		help.style.cursor = 'pointer';
		help.addEventListener("click", function(){
			
			self.models['MenuModel'].setSelected('help');
			
		}, false);
		group.appendChild(help);
		
/*														ISO 3166-1 alpha-2
Flag_of_the_United_Kingdom.svg.png		255 x 128		GB
Flag_of_Denmark.svg.png					255 x 193		DK
Flag_of_Greece.svg.png					255 x 170		GR
Bandera_de_España.svg.png				255 x 170		ES
Flag_of_France.svg.png					255 x 170		FR
Flag_of_Italy.svg.png					255 x 170		IT
Flag_of_Latvia.svg.png					255 x 128		LV
Flag_of_Lithuania.svg.png				255 x 153		LT
Flag_of_the_Netherlands.svg.png			255 x 170		NL
Flag_of_Poland.svg.png					255 x 159		PL
Flag_of_Finland.svg.png					255 x 156		FI
Flag_of_Turkey.svg.png					255 x 170		TR

List of ISO 639-1 codes

English			en
Danish			da
Greek			el
Spanish			es
French			fr
Italian			it
Latvian			lv
Lithuanian		lt
Dutch			nl
Polish			pl
Finnish			fi
Turkish			tr
*/
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected; // This is 'en', or 'fi', or
		const sel_flag_href = './img/'+sel+'.png';
		const flag_w = 50;
		const flag_h = flag_w*0.75;
		const flag_x = w*0.5 - flag_w*3.2;
		const flag_y = -h*0.5 + flag_h*0.25;
		
		const flag = document.createElementNS(svgNS, "image");
		flag.setAttribute('x', flag_x);
		flag.setAttribute('y', flag_y);
		flag.setAttribute('width', flag_w);
		flag.setAttribute('height', flag_h);
		flag.setAttribute('href', sel_flag_href);
		flag.style.cursor = 'pointer';
		flag.addEventListener("click", function(){
			
			self.models['MenuModel'].setSelected('language');
			
		}, false);
		group.appendChild(flag);
		
		$('#space').append(group);
	}
	
	appendLogo() {
		const svgNS = 'http://www.w3.org/2000/svg';
		
		const w = this.REO.width;
		const h = this.REO.height;
		
		console.log(['w=',w]);
		
		const group = document.createElementNS(svgNS, "g");
		
		// Logo original dimensions are 1920 x 1080 pixels.
		
		// Set a maximum width for logo: NO MORE THAN 160 px ever.
		let logo_w = w*0.2;
		if (logo_w > 160) {
			logo_w = 160;
		}
		const logo_h = Math.floor(logo_w*108/192);
		//const x_margin = 8;
		//const y_margin = 8;
		
		const logo_x_pos = -w*0.5;//+x_margin;
		const logo_y_pos = -h*0.5;//+y_margin;
		const logo = document.createElementNS(svgNS, "image");
		logo.setAttribute('x', logo_x_pos);
		logo.setAttribute('y', logo_y_pos);
		logo.setAttribute('width', logo_w);
		logo.setAttribute('height', logo_h);
		logo.setAttribute('href', './img/logo.png');
		group.appendChild(logo);
		
		$('#space').append(group);
	}
	/*
	640px-Flag_of_Europe.svg.png: 640 x 427
	MC.png: 330 x 330 
<rect x="478" y="278" width="104" height="104" style="stroke:#1fac78;stroke-width:2px;fill:none;" />
<image id="project" class="active-district" x="480" y="280" width="100" height="100" xlink:href="MC.png" />
<image x="610" y="280" width="149.88" height="100" xlink:href="640px-Flag_of_Europe.svg.png" />
	*/
	appendEUFlag() {
		const svgNS = 'http://www.w3.org/2000/svg';
		
		const w = this.REO.width;
		const h = this.REO.height;
		
		console.log(['w=',w]);
		
		const group = document.createElementNS(svgNS, "g");
		
		// Flag original dimensions are 640 x 427 pixels.
		const flag_w = 64;
		const flag_h = 43;
		const x_margin = 12;
		
		const flag_x_pos = -w*0.5+x_margin;
		const flag_y_pos = h*0.5-46;
		const flag = document.createElementNS(svgNS, "image");
		flag.setAttribute('x', flag_x_pos);
		flag.setAttribute('y', flag_y_pos);
		flag.setAttribute('width', flag_w);
		flag.setAttribute('height', flag_h);
		flag.setAttribute('href', './img/640px-Flag_of_Europe.svg.png');
		group.appendChild(flag);
		
		//const footer_text_a_b = "THIS PROJECT HAS RECEIVED FUNDING FROM THE EUROPEAN UNION'S HORIZON 2020 RESEARCH AND INNOVATION PROGRAMME UNDER GRANT AGREEMENT N° 101000788";
		const footer_text_a = "THIS PROJECT HAS RECEIVED FUNDING FROM THE EUROPEAN UNION'S HORIZON 2020";
		const footer_text_b = "RESEARCH AND INNOVATION PROGRAMME UNDER GRANT AGREEMENT N° 101000788";
		
		let fontsize = 12;
		// If there is room to put all text to one line => do it.
		if (w > 1200) {
			
			const footer = footer_text_a + ' ' + footer_text_b;
			// 141 characters in total.
			//console.log(['footer.length=',footer.length]);
			
			// Create ONE SVG and put a rect and text under it.
			group.appendChild(this.createFooterSVG(
				flag_x_pos + flag_w + x_margin,
				h*0.5-14,
				w - 3*x_margin - flag_w,
				14,
				footer, fontsize));
			
		} else {
			// If really small ...
			if (w < 500) {
				fontsize = 6;
			} else if (w >= 500 && w < 700) {
				fontsize = 8;
			} else {
				fontsize = 10;
			}
			
			// Create TWO SVGs and put a rect and text under it.
			group.appendChild(this.createFooterSVG(
				flag_x_pos + flag_w + x_margin,
				h*0.5-fontsize*2,
				w - 3*x_margin - flag_w,
				fontsize,
				footer_text_a, fontsize)
			);
			// Create TWO SVGs and put a rect and text under it.
			group.appendChild(this.createFooterSVG(
				flag_x_pos + flag_w + x_margin,
				h*0.5-fontsize,
				w - 3*x_margin - flag_w,
				fontsize,
				footer_text_b, fontsize)
			);
		}
		$('#space').append(group);
	}
	
	renderALL() {
		$(this.el).empty();
		
		this.createSpace();
		this.appendProgress();
		
		this.appendSun('FARM');
		this.appendSun('ACTIVITIES');
		this.appendSun('PRODUCER');
		
		this.appendAnalysisButton();
		
		this.appendHeader(); // Logo, Title and buttons.
		this.appendEUFlag(); // Footer
		
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


/*
<defs>
<path id="MyPath" fill="none" stroke="red"
      d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
</defs>

<text>
  <textPath href="#MyPath">
    Quick brown fox jumps over the lazy dog.
  </textPath>
</text>
*/
/*
	appendTitle() {
		
		const svgNS = 'http://www.w3.org/2000/svg';
		let r = this.sunRadius()*3.5;
		
		//console.log(['r=',r]);
		let fontSize = Math.round(r/6);
		
		
		const group = document.createElementNS(svgNS, "g");
		
		const defs = document.createElementNS(svgNS, 'defs');
		const path = document.createElementNS(svgNS, "path");
		
		const d = 'M-'+r+',0 A '+r+' '+r+' 0 0 1 '+r+' 0';
		
		path.setAttributeNS(null, 'd', d);
		path.id = 'MyPath';
		path.style.stroke = this.colors.DARK_BLUE;
		path.style.strokeWidth = 1;
		path.style.opacity = 0.5;
		path.style.fill = 'none';
		
		defs.appendChild(path);
		group.appendChild(defs);
		//group.appendChild(path);
		
		
		const txt = document.createElementNS(svgNS, 'text');
		txt.style.fontSize = fontSize+'px';
		txt.style.fill = this.colors.DARK_ORANGE;
		txt.style.opacity = 0.5;
		
		const txtPath = document.createElementNS(svgNS, 'textPath');
		txtPath.setAttributeNS(null, 'href', '#MyPath');
		const text_node = document.createTextNode('Decision support tool for farmers'); // for farmers
		txtPath.appendChild(text_node);
		txt.appendChild(txtPath);
		
		group.appendChild(txt);
		
		$('#space').append(group);
	}
	*/
	
	/*
	<svg x="1020" y="390" width="160px" height="40px">
		<rect x="1" y="1" width="158" height="38" stroke="#fff" stroke-width="1" opacity="0.2" fill="#009688" />
		<text id="heating-power" font-family="Arial, Helvetica, sans-serif" font-size="32px" fill="#00a" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"></text>
	</svg>
	*/
	/*
	appendTitle() {
		const svgNS = 'http://www.w3.org/2000/svg';
		const r = this.sunRadius();
		
		const w = this.REO.width;
		const h = this.REO.height;
		
		const fontsize = Math.round(r/3);
		
		const labelWidth = 0.9*w;//7*r;
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('x',-labelWidth*0.5);
		svg.setAttribute('y',-4*r+25);
		svg.setAttributeNS(null,'width',labelWidth);
		svg.setAttributeNS(null,'height',fontsize);
		
		const rect = document.createElementNS(svgNS, 'rect');
		// Setup the <rect> element.
		rect.setAttribute('x',0);
		rect.setAttribute('y',0);
		rect.setAttribute('width',labelWidth);
		rect.setAttribute('height',fontsize);
		rect.style.fill = 'none';//this.colors.LIGHT_ORANGE;
		rect.style.fillOpacity = 0;
		rect.style.stroke = '#ccc';//this.colors.DARK_ORANGE;
		rect.style.strokeWidth = 1;
		svg.appendChild(rect);
		
		const title = document.createElementNS(svgNS, 'text');
		title.setAttribute('x','50%');
		title.setAttribute('y','50%');
		title.setAttribute('font-family','Arial, Helvetica, sans-serif');
		title.setAttribute('font-size',fontsize);
		title.setAttribute('dominant-baseline','middle');
		title.setAttribute('text-anchor','middle');
		title.setAttribute('fill',this.colors.DARK_ORANGE);
		title.style.opacity = 1;
		title.appendChild(document.createTextNode('Decision support tool for farmers'));
		svg.appendChild(title);
		//group.appendChild(svg);
		
		$('#space').append(svg);
	}
	*/
