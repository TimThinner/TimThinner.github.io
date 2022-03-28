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
						'<h1>This is the Menu page for AgroBridges</h1>'+
						'<p>&nbsp;</p>'+
						'<button class="btn waves-effect waves-light" id="login">Login</button>'+
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
