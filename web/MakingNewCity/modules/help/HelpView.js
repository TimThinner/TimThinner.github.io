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
		const sel = LM.selected; // 'fi' or 'en'
		const help_title = LM['translation'][sel]['HELP_INFO_TITLE'];
		const help_thanks = LM['translation'][sel]['HELP_INFO_THANKS'];
		const help_1 = LM['translation'][sel]['HELP_INFO_1'];
		const help_2 = LM['translation'][sel]['HELP_INFO_2'];
		//const help_3 = LM['translation'][sel]['HELP_INFO_3'];
		//const help_4 = LM['translation'][sel]['HELP_INFO_4'];
		//const help_5 = LM['translation'][sel]['HELP_INFO_5'];
		const version = LM['translation'][sel]['MENU_VERSION'];
		
		const help_ok = LM['translation'][sel]['OK'];
		let thanks_message = '';
		const HM = this.controller.master.modelRepo.get('HelpModel');
		if (HM) {
			if (HM.caller === 'signup') {
				thanks_message = '<div class="success-message"><p>'+help_thanks+'</p></div>';
			}
		}
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<img src="./img/MC.png" width="100" height="100" />'+
						'<h4>'+help_title+'</h4>'+
						thanks_message+
						'<p>'+help_1+'</p>'+
						'<p>'+help_2+'</p>'+
						'<p style="color:#aaa">'+version+'</p>'+
					'</div>'+
				'</div>'+
				/*
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<p class="success-message" style="padding-top:8px;padding-bottom:8px">'+help_5+'</p>'+
						'<p style="color:#aaa">'+version+'</p>'+
					'</div>'+
				'</div>'+
				*/
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
			// Safe to reset HelpModel caller => This is set to 'signup' in signup -phase.
			HM.caller = undefined;
			self.models['MenuModel'].setSelected('menu');
		});
	}
}
