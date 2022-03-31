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
				this.show();
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const w = this.REO.width; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height;
		
		let fontsize;
		if (w <= 600) {
			fontsize = '12px';
		} else if (w > 600 && w <= 992) {
			fontsize = '13px';
		} else if (w > 992 && w <= 1200) {
			fontsize = '14px';
		} else {
			fontsize = '16px';
		}
		
				<div class="row" style="margin-bottom:0.5em;">
					<div class="large-12 columns hero" id="top">
						<h1 style="margin-top:-0.25em"><img src="./img/herotext.png" /></h1>
					</div>
				</div>
		
		
		const html = 
			// Title:
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h2 style="color:'+this.colors.DARK_ORANGE+'">Welcome to promote short supply food chain!</h2>'+
					'</div>'+
				'</div>'+
			'</div>'+
			// Description:
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 hero">'+
						'<p style="padding:16px; background-color:rgba(255,255,255,0.5);color:'+this.colors.DARK_ORANGE+'">Some descriptoin here...</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="login">Login</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
			// FOOTER:
				//padding: 2em;
				//margin-top: 2em;
				//text-align: center;
				//border-top: 1px solid #0B7938;
			'<div class="row">'+
				'<div class="col s12 footer">'+
					'<div class="col s2 center">'+
						'<p><img src="./img/640px-Flag_of_Europe.svg.png" height="54"/></p>'+ // Original logo is 640 x 427 pixels.
					'</div>'+
					'<div class="col s8 center" style="color:'+this.colors.DARK_GREEN+'; font-size:'+fontsize+'">'+
						"<p>THIS PROJECT HAS RECEIVED FUNDING FROM THE EUROPEAN UNION'S HORIZON 2020 RESEARCH AND INNOVATION PROGRAMME UNDER GRANT AGREEMENT N&deg; 101000788</p>"+
					'</div>'+
					'<div class="col s2 center">'+
						'<p><img src="./img/logo2.png" height="54"/></p>'+ // Original logo is 960 x 540 pixels.
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		$("#login").on('click', function() {
			self.controller.models['MenuModel'].setSelected('main');
		});
		this.rendered = true;
	}
}
