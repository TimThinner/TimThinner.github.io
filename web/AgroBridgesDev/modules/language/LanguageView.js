import View from '../common/View.js';

export default class LanguageView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'language-message';
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
		this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const ll_lang_a = '<img src="./img/GB.png" width="65"/> English';
		const ll_lang_b = '<img src="./img/DK.png" width="65"/> Dansk';
		const ll_lang_c = '<img src="./img/GR.png" width="65"/> Ελληνικά';
		const ll_lang_d = '<img src="./img/ES.png" width="65"/> Español';
		const ll_lang_e = '<img src="./img/FR.png" width="65"/> Français';
		
		const ll_lang_f = '<img src="./img/IT.png" width="65"/> Italiano';
		const ll_lang_g = '<img src="./img/LV.png" width="65"/> Latviešu';
		const ll_lang_h = '<img src="./img/LT.png" width="65"/> Lietuvių';
		const ll_lang_i = '<img src="./img/NL.png" width="65"/> Nederlands';
		const ll_lang_j = '<img src="./img/PL.png" width="65"/> Polski';
		
		const ll_lang_k = '<img src="./img/FI.png" width="65"/> Suomi';
		const ll_lang_l = '<img src="./img/TR.png" width="65"/> Türkçe';
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">SELECT LANGUAGE</h3>'+
						//'<p><img src="./img/help.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-A" type="radio" value="langA" /><span>'+ll_lang_a+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-B" type="radio" value="langB" /><span>'+ll_lang_b+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-C" type="radio" value="langC" /><span>'+ll_lang_c+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-D" type="radio" value="langD" /><span>'+ll_lang_d+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-E" type="radio" value="langE" /><span>'+ll_lang_e+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-F" type="radio" value="langF" /><span>'+ll_lang_f+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-G" type="radio" value="langG" /><span>'+ll_lang_g+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-H" type="radio" value="langH" /><span>'+ll_lang_h+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-I" type="radio" value="langI" /><span>'+ll_lang_i+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-J" type="radio" value="langJ" /><span>'+ll_lang_j+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-K" type="radio" value="langK" /><span>'+ll_lang_k+'</span></label></p>'+
						'<p><label><input class="with-gap" name="selectedLanguage" id="lang-L" type="radio" value="langL" /><span>'+ll_lang_l+'</span></label></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1" id="'+this.FELID+'">'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="lang-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		/*
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		LanguageModel
		this.languages = ['en'];
		this.selected = 'en';
		*/
		
		// Only one of these can be true at any one time (radio buttons).
		/*
		if (this.USER_MODEL.profile.Language === true) {
			$("#lang-A").prop("checked", true);
		} ...
		
		*/
		
		
		
		$('input[type=radio][name=selectedLanguage]').change(function() {
			
			const sel = this.value;
			console.log(['selected=',sel]);
			
		});
		
		$("#lang-ok").on('click', function() {
			self.models['MenuModel'].setSelected('main');
		});
		
		this.rendered = true;
	}
}
