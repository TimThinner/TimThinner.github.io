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
		this.FELID = 'location-message';
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
					// NOTE: We also automatically set the USER_MODEL
					this.USER_MODEL.profile['Country'] = selected_country_id;
					sel_prop = 'selected="selected"';
					
				} else if (r.id === selected_country_id) {
					// <option selected="selected">orange</option>
					sel_prop = 'selected="selected"';
				}
				html += '<option value="'+r.id+'" '+sel_prop+'>'+r.name+'</option>';
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
		this.models['RegionsModel'].fetch(selected_country_id);
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
				// If there is no selection => set FIRST region as selected.
				if (typeof selected_region_id === 'undefined') {
					
					selected_region_id = r.id;
					// NOTE: We also automatically set the USER_MODEL
					this.USER_MODEL.profile['NUTS3'] = selected_region_id;
					sel_prop = 'selected="selected"';
					
				} else if (r.id === selected_region_id) {
					sel_prop = 'selected="selected"';
				}
				html += '<option value="'+r.id+'" '+sel_prop+'>'+r.name+'</option>';
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
						
						$('#'+this.FELID).empty();
						console.log(options.model+' fetched OK!');
						this.resetCountrySelect();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					
					
				}
				
			} else if (options.model==='RegionsModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						
						$('#'+this.FELID).empty();
						console.log(options.model+' fetched OK!');
						this.resetRegionSelect();
						
					} else {
						this.render();
					}
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					
					
					
					
				}
				
			} else if (options.model==='UserModel' && options.method==='updateUserProfile') {
				if (options.status === 200) {
					
					$('#'+this.FELID).empty();
					// Show Toast: Saved OK!
					const LM = this.controller.master.modelRepo.get('LanguageModel');
					const sel = LM.selected;
					const save_ok = LM['translation'][sel]['PROFILE_SAVE_OK'];
					M.toast({
						displayLength:500, 
						html: save_ok,
						classes: 'green darken-1'
					});
					// After 1 second go back to FARM-page automatically.
					setTimeout(() => this.controller.models['MenuModel'].setSelected('farm'), 1000);
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					// After 2 seconds go back to FARM-page automatically.
					setTimeout(() => this.controller.models['MenuModel'].setSelected('farm'), 2000);
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
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_location_query = LM['translation'][sel]['location_query'];
		const ll_region_query = LM['translation'][sel]['region_query'];
		const ll_distance_small_query = LM['translation'][sel]['distance_drive_small_query'];
		const ll_distance_major_query = LM['translation'][sel]['distance_drive_major_query'];
		
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
					'<div class="col s12 m10 offset-m1 center">'+
						'<h6 class="required">'+ll_location_query+'</h6>'+
						'<div id="countries-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1 center">'+
						'<h6 class="required">'+ll_region_query+'</h6>'+
						'<div id="regions-wrapper"></div>'+
					'</div>'+
					'<div class="input-field col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_distance_small_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="distance-bigger-town-slider"></div>'+
					'</div>'+
					'<div class="input-field col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_distance_major_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="distance-major-city-slider"></div>'+
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
		
		// Restore current selection:
		const distance_to_town = this.USER_MODEL.profile.Distance_Drive_small;
		const distance_to_city = this.USER_MODEL.profile.Distance_Drive_major;
		
		const distanceTownSlider = document.getElementById('distance-bigger-town-slider');
		noUiSlider.create(distanceTownSlider, {
			start: [distance_to_town],
			connect: 'lower',
			tooltips: [wNumb({decimals:0,suffix:' km'})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 5,  // Default 5
			keyboardMultiplier: 5,      // Default 1
			range: {
				'min': [0],
				'max': [1000]
			}
		});
		distanceTownSlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.Distance_Drive_small = Math.round(values[0]);
			}
		});
		
		const distanceCitySlider = document.getElementById('distance-major-city-slider');
		noUiSlider.create(distanceCitySlider, {
			start: [distance_to_city],
			connect: 'lower',
			tooltips: [wNumb({decimals:0,suffix:' km'})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 5,  // Default 5
			keyboardMultiplier: 5,      // Default 1
			range: {
				'min': [0],
				'max': [1000]
			}
		});
		distanceCitySlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.Distance_Drive_major = Math.round(values[0]);
			}
		});
		
		$("#location-ok").on('click', function() {
			// Save all
			const data = [
				{propName:'Country', value:self.USER_MODEL.profile['Country']},
				{propName:'NUTS3', value:self.USER_MODEL.profile['NUTS3']},
				{propName:'Distance_Drive_small', value:self.USER_MODEL.profile.Distance_Drive_small},
				{propName:'Distance_Drive_major', value:self.USER_MODEL.profile.Distance_Drive_major}
			];
			console.log(['About to save data=',data]);
			
			self.USER_MODEL.updateUserProfile(data, "prod_nl_1");
		});
		this.rendered = true;
	}
}
