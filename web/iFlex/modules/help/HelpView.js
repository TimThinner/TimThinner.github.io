import View from '../common/View.js';

export default class HelpView extends View {
	
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
		
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const help_title = LM['translation'][sel]['HELP_INFO_TITLE'];
		const help_ok = LM['translation'][sel]['OK'];
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4>'+help_title+'</h4>'+
						//'<p>'+gdpr_description+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+help_ok+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#back").on('click', function() {
			//const caller = self.controller.models['HelpModel'].caller;
			self.controller.models['MenuModel'].setSelected('menu');
		});
	}
}
