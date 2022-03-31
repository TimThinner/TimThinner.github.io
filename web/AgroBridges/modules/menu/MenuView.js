import View from '../common/View.js';

export default class MenuView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
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
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		console.log('MenuView Notify');
		if (this.controller.visible) {
			console.log('MenuView is visible');
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const html = '<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						//'<h2>AgroBridges</h2>'+
						'<p>&nbsp;</p>'+
						'<p><img src="./img/logo2.png" height="108"/></p>'+ // Original logo is 960 x 540 pixels.
						'<p>&nbsp;</p>'+
						'<button class="btn waves-effect waves-light" id="login">Login</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s2 center">'+
						'<p><img src="./img/640px-Flag_of_Europe.svg.png" height="54"/></p>'+ // Original logo is 640 x 427 pixels.
					'</div>'+
					'<div class="col s8 center">'+
						"<p>THIS PROJECT HAS RECEIVED FUNDING FROM THE EUROPEAN UNION'S HORIZON 2020 RESEARCH AND INNOVATION PROGRAMME UNDER GRANT AGREEMENT N&deg; 101000788</p>"+
					'</div>'+
					'<div class="col s2 center">'+
						'<p><img src="./img/logo2.png" height="54"/></p>'+ // Original logo is 960 x 540 pixels.
					'</div>'+
				'</div>'+
			'</div>'+
			
			
		$(this.el).append(html);
		
		$("#login").on('click', function() {
			self.controller.models['MenuModel'].setSelected('main');
		});
		this.rendered = true;
	}
}
