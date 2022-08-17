


class MasterController {
	
	constructor() {
		this.selected_language = 'en';
		this.selected_country = 'IE';
	}
	
	init() {
		const self = this;
		console.log('MasterController init!');
		
		const ll_lang_en = '<img src="../img/en.png" width="60"/> English';
		const ll_lang_da = '<img src="../img/da.png" width="60"/> Dansk';
		const ll_lang_el = '<img src="../img/el.png" width="60"/> Ελληνικά';
		
		const ll_lang_es = '<img src="../img/es.png" width="60"/> Español';
		const ll_lang_fr = '<img src="../img/fr.png" width="60"/> Français';
		const ll_lang_it = '<img src="../img/it.png" width="60"/> Italiano';
		
		const ll_lang_lv = '<img src="../img/lv.png" width="60"/> Latviešu';
		const ll_lang_lt = '<img src="../img/lt.png" width="60"/> Lietuvių';
		const ll_lang_nl = '<img src="../img/nl.png" width="60"/> Nederlands';
		
		const ll_lang_pl = '<img src="../img/pl.png" width="60"/> Polski';
		const ll_lang_fi = '<img src="../img/fi.png" width="60"/> Suomi';
		const ll_lang_tr = '<img src="../img/tr.png" width="60"/> Türkçe';
		
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h4>AgroBridges TEST Launcher</h4>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h5>SELECT COUNTRY</h5>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<table>'+
						'<tbody>'+
							'<tr>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-IE" type="radio" value="IE" /><span>Éire/Ireland</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-DK" type="radio" value="DK" /><span>Danmark</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-EL" type="radio" value="EL" /><span>Ελλάδα</span></label></td>'+
							'</tr>'+
							'<tr>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-ES" type="radio" value="ES" /><span>España</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-FR" type="radio" value="FR" /><span>France</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-IT" type="radio" value="IT" /><span>Italia</span></label></td>'+
							'</tr>'+
							'<tr>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-LV" type="radio" value="LV" /><span>Latvija</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-LT" type="radio" value="LT" /><span>Lietuva</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-NL" type="radio" value="NL" /><span>Nederland</span></label></td>'+
							'</tr>'+
							'<tr>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-PL" type="radio" value="PL" /><span>Polska</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-FI" type="radio" value="FI" /><span>Suomi/Finland</span></label></td>'+
								'<td><label><input class="with-gap" name="selectedCountry" id="country-TR" type="radio" value="TR" /><span>Türkiye</span></label></td>'+
							'</tr>'+
						'</tbody>'+
						'</table>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h5>SELECT LANGUAGE</h5>'+
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
					'<div class="input-field col s6">'+
						'<p><label><input type="checkbox" class="filled-in" id="isMockup" /><span>MOCKUP</span></label></p>'+
					'</div>'+
					'<div class="input-field col s6">'+
						'<input value="" id="user_id" type="text" class="validate">'+
						'<label class="active" for="user_id">User id:</label>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="launch">LAUNCH UI</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$('#content').append(html);
		
		// Start with empty values.
		$("#user_id").val('');
		$("#isMockup").prop("checked", true);
		$("#lang-"+this.selected_language).prop("checked", true); // 'en' as default language
		$("#country-"+this.selected_country).prop("checked", true); // IE" Éire/Ireland as default language
		
		$('input[type=radio][name=selectedLanguage]').change(function() {
			self.selected_language = this.value;
		});
		
		$('input[type=radio][name=selectedCountry]').change(function() {
			self.selected_country = this.value;
		});
		
		$("#launch").on('click', function() {
			const uid = $("#user_id").val();
			let mockup = false;
			if($("#isMockup").is(':checked')) {
				mockup = true;
			}
			const query_string = '?userid='+uid+'&country='+self.selected_country+'&language='+self.selected_language+'&MOCKUP='+mockup;
			window.open("http://mars1.collab-cloud.eu/agrobridges/index.html"+query_string, "_blank");
		});
	}
}
new MasterController().init();
