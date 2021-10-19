import View from '../common/View.js';

export default class UserGDPRView extends View {
	
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
		
		const localized_string_gdpr_title = LM['translation'][sel]['GDPR_TITLE'];
		const localized_string_gdpr_description = LM['translation'][sel]['GDPR_DESCRIPTION'];
		const localized_string_gdpr_chapter_1 = LM['translation'][sel]['GDPR_CHAPTER_1'];
		const localized_string_gdpr_chapter_1a  = LM['translation'][sel]['GDPR_CHAPTER_1A'];
		const localized_string_gdpr_chapter_1b  = LM['translation'][sel]['GDPR_CHAPTER_1B'];
		const localized_string_gdpr_chapter_2 = LM['translation'][sel]['GDPR_CHAPTER_2'];
		const localized_string_gdpr_chapter_2a  = LM['translation'][sel]['GDPR_CHAPTER_2A'];
		const localized_string_gdpr_chapter_2aa  = LM['translation'][sel]['GDPR_CHAPTER_2AA'];
		const localized_string_gdpr_chapter_2aaa  = LM['translation'][sel]['GDPR_CHAPTER_2AAA'];
		const localized_string_gdpr_chapter_2aab  = LM['translation'][sel]['GDPR_CHAPTER_2AAB'];
		const localized_string_gdpr_chapter_2aac  = LM['translation'][sel]['GDPR_CHAPTER_2AAC'];
		const localized_string_gdpr_chapter_2ab  = LM['translation'][sel]['GDPR_CHAPTER_2AB'];
		const localized_string_gdpr_chapter_2aba  = LM['translation'][sel]['GDPR_CHAPTER_2ABA'];
		const localized_string_gdpr_chapter_2abb  = LM['translation'][sel]['GDPR_CHAPTER_2ABB'];
		const localized_string_gdpr_chapter_2abc  = LM['translation'][sel]['GDPR_CHAPTER_2ABC'];
		const localized_string_gdpr_chapter_2b  = LM['translation'][sel]['GDPR_CHAPTER_2B'];
		
		const localized_string_ok = LM['translation'][sel]['OK'];
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4>'+localized_string_gdpr_title+'</h4>'+
						'<p>'+localized_string_gdpr_description+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+localized_string_gdpr_chapter_1+'</h5>'+
						'<p>'+localized_string_gdpr_chapter_1a+'<br/>'+localized_string_gdpr_chapter_1b+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+localized_string_gdpr_chapter_2+'</h5>'+
						'<p>'+localized_string_gdpr_chapter_2a+'</p>'+
						'<div class="row">'+
							'<div class="col s1">&nbsp;</div>'+
							'<div class="col s11">'+
								'<p><b>'+localized_string_gdpr_chapter_2aa+'</b><br/>'+
								localized_string_gdpr_chapter_2aaa+'<br/>'+
								localized_string_gdpr_chapter_2aab+'<br/>'+
								localized_string_gdpr_chapter_2aac+'</p>'+
							'</div>'+
							'<div class="col s1">&nbsp;</div>'+
							'<div class="col s11">'+
								'<p><b>'+localized_string_gdpr_chapter_2ab+'</b><br/>'+
								localized_string_gdpr_chapter_2aba+'<br/>'+
								localized_string_gdpr_chapter_2abb+'<br/>'+
								localized_string_gdpr_chapter_2abc+'</p>'+
							'</div>'+
						'</div>'+
						'<p>'+localized_string_gdpr_chapter_2b+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_ok+
							//'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#back").on('click', function() {
			const caller = self.controller.models['UserGDPRModel'].caller;
			if (typeof caller !== 'undefined') {
				self.controller.models['MenuModel'].setSelected(caller);
			} else {
				self.controller.models['MenuModel'].setSelected('usersignup');
			}
		});
		
	}
}
