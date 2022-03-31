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
			fontsize = '11px';
		} else if (w > 600 && w <= 992) {
			fontsize = '12px';
		} else if (w > 992 && w <= 1200) {
			fontsize = '13px';
		} else {
			fontsize = '14px';
		}
		const title = 'Welcome to promote short supply food chain!';
		const descr_A = 'Decision Support Tool for producers';
		const descr_B = 'You will be able to evaluate the most suitable business models for Short Supply Food Chains.';
		const descr_C = 'Evaluations and recommendations are based on information about your farm, products and activities.';
		// LIGHT_GREEN:'#EEF8EB', R=238, G=248, B=235
		const frameStyle = 'padding:32px 16px 32px 16px; background-color:rgba(238,248,235,0.8);border-radius:10%;border:1px solid '+this.colors.DARK_GREEN;
		const html = 
			// Title:
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h2 style="color:'+this.colors.DARK_ORANGE+'">'+title+'</h2>'+
					'</div>'+
				'</div>'+
			'</div>'+
			// Description:
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 hero" style="margin-top:32px;">'+
						'<div class="col s12" style="'+frameStyle+'">'+
							'<h4 style="color:'+this.colors.DARK_ORANGE+'">'+descr_A+'</h4>'+
							'<p style="color:'+this.colors.DARK_GREEN+'">'+descr_B+'</p>'+
							'<p style="color:'+this.colors.DARK_GREEN+'">'+descr_C+'</p>'+
						'</div>'+
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
						'<p><img src="./img/640px-Flag_of_Europe.svg.png" class="responsive-img"/></p>'+ // Original logo is 640 x 427 pixels.
					'</div>'+
					'<div class="col s8 center" style="color:'+this.colors.DARK_GREEN+'; font-size:'+fontsize+'">'+
						"<p>THIS PROJECT HAS RECEIVED FUNDING FROM THE EUROPEAN UNION'S HORIZON 2020 RESEARCH AND INNOVATION PROGRAMME UNDER GRANT AGREEMENT N&deg; 101000788</p>"+
					'</div>'+
					'<div class="col s2 center">'+
						'<p><img src="./img/logo2.png" class="responsive-img" /></p>'+ // Original logo is 960 x 540 pixels.
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
