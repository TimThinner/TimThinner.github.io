import View from '../common/View.js';

export default class LocationView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			// 'CountriesModel', 'RegionsModel' and 'MenuModel' are added to View models.
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
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
		this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	resetCountrySelect() {
		const self = this;
		$('#countries-wrapper').empty(); // Clear old select, if any.
		
		let selected_country_id = this.USER_MODEL.profile['Country'];
		
		let html = '<select class="select-country" style="width:75%">';
		const countries = this.models['CountriesModel'].countries;
		if (Array.isArray(countries) && countries.length > 0) {
			countries.forEach(r=> {
				let sel_prop = '';
				// If there is no selection => set FIRST country as selected.
				if (typeof selected_country_id === 'undefined') {
					
					selected_country_id = r.id;
					sel_prop = 'selected="selected"';
					
				} else if (r.id === selected_country_id) {
					// <option selected="selected">orange</option>
					sel_prop = 'selected="selected"';
				}
				if (r.name === r.name_latn) {
					html += '<option value="'+r.id+'" '+sel_prop+'>'+r.name+'</option>';
				} else {
					html += '<option value="'+r.id+'" '+sel_prop+'>'+r.name+' / '+r.name_latn+'</option>';
				}
			});
		}
		html += '</select>';
		$('#countries-wrapper').append(html);
		
		// Initialize the "plugin"
		$('.select-country').select2({
			width: 'resolve' // need to override the changed default
		});
		
		$('.select-country').on("select2:select", function (e) { 
			const value = $(this).val();
			console.log(["select2:select value=", value]);
			self.USER_MODEL.profile['Country'] = value;
			self.models['RegionsModel'].fetch(value);
		});
		// Finally initialize also the REGIONS with old selection or FIRST COUNTRY'S regions.
		this.models['RegionsModel'].fetch(value);
	}
	
	resetRegionSelect() {
		const self = this;
		$('#regions-wrapper').empty(); // Clear old select, if any.
		
		let selected_region_id = this.USER_MODEL.profile['NUTS3'];
		
		let html = '<select class="select-region" style="width:75%">';
		const regions = this.models['RegionsModel'].regions;
		if (Array.isArray(regions) && regions.length > 0) {
			regions.forEach(r=> {
				let sel_prop = '';
				// If there is no selection => set FIRST country as selected.
				if (typeof selected_region_id === 'undefined') {
					
					selected_region_id = r.id;
					sel_prop = 'selected="selected"';
					
				} else if (r.id === selected_region_id) {
					sel_prop = 'selected="selected"';
				}
				if (r.name === r.name_latn) {
					html += '<option value="'+r.id+'" '+sel_prop+'>'+r.name+'</option>';
				} else {
					html += '<option value="'+r.id+'" '+sel_prop+'>'+r.name+' / '+r.name_latn+'</option>';
				}
			});
		}
		html += '</select>';
		$('#regions-wrapper').append(html);
		
		// Initialize the "plugin"
		$('.select-region').select2({
			width: 'resolve' // need to override the changed default
		});
		
		$('.select-region').on("select2:select", function (e) { 
			const value = $(this).val();
			console.log(["select2:select region value=", value]);
			self.USER_MODEL.profile['NUTS3'] = value;
		});
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='CountriesModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						
						console.log(options.model+' fetched OK!');
						this.resetCountrySelect();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					//this.notifyError(options);
					console.log('ERROR in '+options.model+' fetching...');
				}
				
			} else if (options.model==='RegionsModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						
						//$('#'+this.FELID).empty();
						console.log(options.model+' fetched OK!');
						this.resetRegionSelect();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					//this.notifyError(options);
					console.log('ERROR in '+options.model+' fetching...');
				}
			}
		}
	}
	
	/*
	1. Select a country.
	2. Based on that we extract NUTS-3 regions => notification when ready.
	3. Create a new select with regions.
	*/
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM LOCATION</h3>'+
						'<p><img src="./img/location.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h6 class="required">In which country is your farm located?</h6>'+
						'<div id="countries-wrapper"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h6 class="required">In which region is your farm located?</h6>'+
						'<div id="regions-wrapper"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="location-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		// If countries are already fetched => render the select.
		const countries = this.models['CountriesModel'].countries;
		if (Array.isArray(countries) && countries.length > 0) {
			this.resetCountrySelect();
		}
		
		$("#location-ok").on('click', function() {
			self.models['MenuModel'].setSelected('farm');
		});
		this.rendered = true;
	}
}
/*
						'<table class="striped">'+
							'<thead>'+
								'<tr>'+
									'<th>Question</th>'+
									'<th>Variables</th>'+
								'</tr>'+
							'</thead>'+
							'<tbody>'+
								'<tr>'+
									'<td>In which country is your farm located?</td>'+
									'<td>Country, NUTS3</td>'+
								'</tr>'+
								'<tr>'+
									'<td>How long is the driving distance to the next bigger town?</td>'+
									'<td>Distance_Drive_small</td>'+
								'</tr>'+
								'<tr>'+
									'<td>How long is the driving distance to the major city?</td>'+
									'<td>Distance_Drive_major</td>'+
								'</tr>'+
							'</tbody>'+
						'</table>'+
*/

/*
						'<select class="select-country" style="width:75%">'+ // id="id-select-country">'+
							'<option value="BE">Belgique/België</option>'+
							'<option value="BG">България</option>'+
							'<option value="CZ">Česko</option>'+
							'<option value="DK">Danmark</option>'+
							'<option value="DE">Deutschland</option>'+
							'<option value="EE">Eesti</option>'+
							'<option value="IE">Éire/Ireland</option>'+
							'<option value="EL">Ελλάδα</option>'+
							'<option value="ES">España</option>'+
							'<option value="FR">France</option>'+
							'<option value="HR">Hrvatska</option>'+
							'<option value="IT">Italia</option>'+
							'<option value="CY">Κύπρος</option>'+
							'<option value="LV">Latvija</option>'+
							'<option value="LT">Lietuva</option>'+
							'<option value="LU">Luxembourg</option>'+
							'<option value="HU">Magyarország</option>'+
							'<option value="MT">Malta</option>'+
							'<option value="NL">Nederland</option>'+
							'<option value="AT">Österreich</option>'+
							'<option value="PL">Polska</option>'+
							'<option value="PT">Portugal</option>'+
							'<option value="RO">România</option>'+
							'<option value="SI">Slovenija</option>'+
							'<option value="SK">Slovensko</option>'+
							'<option value="FI">Suomi/Finland</option>'+
							'<option value="SE">Sverige</option>'+
							'<option value="UK">United Kingdom</option>'+
							'<option value="IS">Ísland</option>'+
							'<option value="LI">Liechtenstein</option>'+
							'<option value="NO">Norge</option>'+
							'<option value="CH">Schweiz/Suisse/Svizzera</option>'+
							'<option value="ME">Црна Гора</option>'+
							'<option value="MK">Северна Македонија</option>'+
							'<option value="AL">Shqipëria</option>'+
							'<option value="RS">Srbija/Сpбија</option>'+
							'<option value="TR">Türkiye</option>'+
						'</select>'+
*/

		/*
		// See: https://select2.org/programmatic-control/events
		$('.select-country').on("select2:open", function (e) { 
			console.log(["select2:open e=", e]);
		});
		$('.select-country').on("select2:close", function (e) { 
			console.log(["select2:close e=", e]);
		});
		*/
		/*$('.select-country').on("select2:unselect", function (e) { 
			console.log(["select2:unselect e=", e]);
		});
		$('.select-country').on("change", function (e) { 
			console.log(["select2:change e=", e]);
		});
		*/
