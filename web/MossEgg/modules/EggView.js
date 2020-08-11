export default class EggView {
	
	constructor(controller) {
		this.controller = controller;
		this.el = '#content';
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		if (options.model==='ResizeEventObserver' && options.method==='resize') {
			console.log("EggView ResizeEventObserver resize!!!!!!!!!!!!!!");
			this.render();
		}
	}
	
	addSVGEventHandlers() {
		console.log('DO NOTHING!');
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
		let svgFile, svgClass;
		
		if (mode === 'LANDSCAPE') {
			console.log('LANDSCAPE');
			svgFile = './svg/EggLandscape.svg';
			svgClass = 'svg-landscape-container';
			
		} else if (mode === 'PORTRAIT') {
			console.log('PORTRAIT');
			svgFile = './svg/EggPortrait.svg';
			svgClass = 'svg-portrait-container';
			
		} else {
			console.log('SQUARE');
			svgFile = './svg/EggSquare.svg';
			svgClass = 'svg-square-container';
		}
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="'+svgClass+'">'+
						'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		/*
		const svgFile = './egg.svg';
		const svgClass = 'svg-square-container';
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="'+svgClass+'">'+
						'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		*/
		
		// AND WAIT for SVG object to fully load, before assigning event handlers!
		const svgObj = document.getElementById("svg-object");
		svgObj.addEventListener('load', function(){
			console.log('ADD SVG EVENT HANDLERS!');
			self.addSVGEventHandlers();
		});
	}
}
