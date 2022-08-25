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
		
		this.LM = this.controller.master.modelRepo.get('LanguageModel');
		this.LM.subscribe(this);
		this.selected_language = this.LM.selected; // This is 'en', or 'fi', or
		
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
		this.LM.unsubscribe(this);
		
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='LanguageModel' && options.method==='loadTranslation') {
				if (options.status === 200) {
					// OK.
					const html = '<div class="success-message"><p>Translation loaded OK.</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					// After 1 second remove the OK message automatically.
					setTimeout(() => {
						$('#'+this.FELID).empty();
						//$('#lang-ok').removeClass('disabled');
						// GO BACK TO MAIN VIEW!
						this.models['MenuModel'].setSelected('menu');
					},1000);
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
				}
			}
		}
	}
	
	
	/*
	
	*/
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const ll_lang_en = '<img src="./img/en.png" width="60"/> English';
		const ll_lang_da = '<img src="./img/da.png" width="60"/> Dansk';
		const ll_lang_el = '<img src="./img/el.png" width="60"/> Ελληνικά';
		
		const ll_lang_es = '<img src="./img/es.png" width="60"/> Español';
		const ll_lang_fr = '<img src="./img/fr.png" width="60"/> Français';
		const ll_lang_it = '<img src="./img/it.png" width="60"/> Italiano';
		
		const ll_lang_lv = '<img src="./img/lv.png" width="60"/> Latviešu';
		const ll_lang_lt = '<img src="./img/lt.png" width="60"/> Lietuvių';
		const ll_lang_nl = '<img src="./img/nl.png" width="60"/> Nederlands';
		
		const ll_lang_pl = '<img src="./img/pl.png" width="60"/> Polski';
		const ll_lang_fi = '<img src="./img/fi.png" width="60"/> Suomi';
		const ll_lang_tr = '<img src="./img/tr.png" width="60"/> Türkçe';
		
		
		const sel = this.LM.selected;
		const ll_select_language = this.LM['translation'][sel]['language_title'];
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">'+ll_select_language+'</h3>'+
						//'<p><img src="./img/help.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<table>'+
						/*
						'<thead>'+
							'<tr>'+
								'<th>Name</th>'+
								'<th>Item Name</th>'+
								'<th>Item Price</th>'+
							'</tr>'+
						'</thead>'+
						*/
						'<tbody>'+
							'<tr>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-en" type="radio" value="en" /><span>'+ll_lang_en+'</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-da" type="radio" value="da" /><span>'+ll_lang_da+'</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-el" type="radio" value="el" /><span>'+ll_lang_el+'</span></label></td>'+
							'</tr>'+
							'<tr>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-es" type="radio" value="es" /><span>'+ll_lang_es+'</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-fr" type="radio" value="fr" /><span>'+ll_lang_fr+'</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-it" type="radio" value="it" /><span>'+ll_lang_it+'</span></label></td>'+
							'</tr>'+
							'<tr>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-lv" type="radio" value="lv" /><span>'+ll_lang_lv+'</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-lt" type="radio" value="lt" /><span>'+ll_lang_lt+'</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-nl" type="radio" value="nl" /><span>'+ll_lang_nl+'</span></label></td>'+
							'</tr>'+
							'<tr>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-pl" type="radio" value="pl" /><span>'+ll_lang_pl+'</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-fi" type="radio" value="fi" /><span>'+ll_lang_fi+'</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedLanguage" id="lang-tr" type="radio" value="tr" /><span>'+ll_lang_tr+'</span></label></td>'+
							'</tr>'+
						'</tbody>'+
						'</table>'+
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
		
		//const sel = this.LM.selected; // This is 'en', or 'fi', or
		//const sel_flag_href = './img/'+sel+'.png';
		
		$("#lang-"+this.LM.selected).prop("checked", true);
		
/*
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
		
		$('input[type=radio][name=selectedLanguage]').change(function() {
			self.selected_language = this.value;
		});
		
		$("#lang-ok").on('click', function() {
			// Confirm the change.
			$('#lang-ok').addClass('disabled');
			self.LM.selected = self.selected_language;
			self.LM.loadTranslation();
		});
		
		this.rendered = true;
	}
}
