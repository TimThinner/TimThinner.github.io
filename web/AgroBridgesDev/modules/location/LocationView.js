import View from '../common/View.js';
/*

<31       (Distance_Drive_minor_kat1)
31-60   (Distance_Drive_minor_kat2)
61-90   (Distance_Drive_minor_kat3)
91-120  (Distance_Drive_minor_kat4)
>120  (Distance_Drive_minor_kat5)

<31       (Distance_Drive_major_kat1)
31-60   (Distance_Drive_major_kat2)
61-90   (Distance_Drive_major_kat3)
91-120  (Distance_Drive_major_kat4)
>120  (Distance_Drive_major_kat5)

*/
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
					
					// After 1 second go back to FARM-page automatically.
					setTimeout(() => this.controller.models['MenuModel'].setSelected('farm'), 1000);
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
		const ll_no_database_message = LM['translation'][sel]['no_database_message'];
		
		const ll_minor_kat1 = LM['translation'][sel]['Distance_Drive_minor_kat1'];
		const ll_minor_kat2 = LM['translation'][sel]['Distance_Drive_minor_kat2'];
		const ll_minor_kat3 = LM['translation'][sel]['Distance_Drive_minor_kat3'];
		const ll_minor_kat4 = LM['translation'][sel]['Distance_Drive_minor_kat4'];
		const ll_minor_kat5 = LM['translation'][sel]['Distance_Drive_minor_kat5'];
		
		const ll_major_kat1 = LM['translation'][sel]['Distance_Drive_major_kat1'];
		const ll_major_kat2 = LM['translation'][sel]['Distance_Drive_major_kat2'];
		const ll_major_kat3 = LM['translation'][sel]['Distance_Drive_major_kat3'];
		const ll_major_kat4 = LM['translation'][sel]['Distance_Drive_major_kat4'];
		const ll_major_kat5 = LM['translation'][sel]['Distance_Drive_major_kat5'];
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM LOCATION</h3>'+
						'<p><img src="./img/photo-location.png" height="150"/></p>'+
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
					'<div class="col s12 m10 offset-m1">'+
						'<h6>'+ll_distance_small_query+'</h6>'+
						'<p><label><input class="with-gap" name="minorDistance" id="minor-kat1" type="radio" value="minorkat1" /><span>'+ll_minor_kat1+'</span></label></p>'+
						'<p><label><input class="with-gap" name="minorDistance" id="minor-kat2" type="radio" value="minorkat2" /><span>'+ll_minor_kat2+'</span></label></p>'+
						'<p><label><input class="with-gap" name="minorDistance" id="minor-kat3" type="radio" value="minorkat3" /><span>'+ll_minor_kat3+'</span></label></p>'+
						'<p><label><input class="with-gap" name="minorDistance" id="minor-kat4" type="radio" value="minorkat4" /><span>'+ll_minor_kat4+'</span></label></p>'+
						'<p><label><input class="with-gap" name="minorDistance" id="minor-kat5" type="radio" value="minorkat5" /><span>'+ll_minor_kat5+'</span></label></p>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6>'+ll_distance_major_query+'</h6>'+
						'<p><label><input class="with-gap" name="majorDistance" id="major-kat1" type="radio" value="majorkat1" /><span>'+ll_major_kat1+'</span></label></p>'+
						'<p><label><input class="with-gap" name="majorDistance" id="major-kat2" type="radio" value="majorkat2" /><span>'+ll_major_kat2+'</span></label></p>'+
						'<p><label><input class="with-gap" name="majorDistance" id="major-kat3" type="radio" value="majorkat3" /><span>'+ll_major_kat3+'</span></label></p>'+
						'<p><label><input class="with-gap" name="majorDistance" id="major-kat4" type="radio" value="majorkat4" /><span>'+ll_major_kat4+'</span></label></p>'+
						'<p><label><input class="with-gap" name="majorDistance" id="major-kat5" type="radio" value="majorkat5" /><span>'+ll_major_kat5+'</span></label></p>'+
					'</div>'+
					/*
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
					*/
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
		/*
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
		*/
		
		// Only one of these can be true at any one time (radio buttons).
		if (this.USER_MODEL.profile.Distance_Drive_minor_kat1 === true) {
			$("#minor-kat1").prop("checked", true);
		} else if (this.USER_MODEL.profile.Distance_Drive_minor_kat2 === true) {
			$("#minor-kat2").prop("checked", true);
		} else if (this.USER_MODEL.profile.Distance_Drive_minor_kat3 === true) {
			$("#minor-kat3").prop("checked", true);
		} else if (this.USER_MODEL.profile.Distance_Drive_minor_kat4 === true) {
			$("#minor-kat4").prop("checked", true);
		} else {
			$("#minor-kat5").prop("checked", true);
		}
		
		if (this.USER_MODEL.profile.Distance_Drive_major_kat1 === true) {
			$("#major-kat1").prop("checked", true);
		} else if (this.USER_MODEL.profile.Distance_Drive_major_kat2 === true) {
			$("#major-kat2").prop("checked", true);
		} else if (this.USER_MODEL.profile.Distance_Drive_major_kat3 === true) {
			$("#major-kat3").prop("checked", true);
		} else if (this.USER_MODEL.profile.Distance_Drive_major_kat4 === true) {
			$("#major-kat4").prop("checked", true);
		} else {
			$("#major-kat5").prop("checked", true);
		}
		
		$('input[type=radio][name=minorDistance]').change(function() {
			if (this.value === 'minorkat1') {
				self.USER_MODEL.profile.Distance_Drive_minor_kat1 = true;
				self.USER_MODEL.profile.Distance_Drive_minor_kat2 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat3 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat4 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat5 = false;
			} else if (this.value === 'minorkat2') {
				self.USER_MODEL.profile.Distance_Drive_minor_kat1 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat2 = true;
				self.USER_MODEL.profile.Distance_Drive_minor_kat3 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat4 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat5 = false;
			} else if (this.value === 'minorkat3') {
				self.USER_MODEL.profile.Distance_Drive_minor_kat1 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat2 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat3 = true;
				self.USER_MODEL.profile.Distance_Drive_minor_kat4 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat5 = false;
			} else if (this.value === 'minorkat4') {
				self.USER_MODEL.profile.Distance_Drive_minor_kat1 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat2 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat3 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat4 = true;
				self.USER_MODEL.profile.Distance_Drive_minor_kat5 = false;
			} else {
				self.USER_MODEL.profile.Distance_Drive_minor_kat1 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat2 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat3 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat4 = false;
				self.USER_MODEL.profile.Distance_Drive_minor_kat5 = true;
			}
		});
		
		$('input[type=radio][name=majorDistance]').change(function() {
			if (this.value === 'majorkat1') {
				self.USER_MODEL.profile.Distance_Drive_major_kat1 = true;
				self.USER_MODEL.profile.Distance_Drive_major_kat2 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat3 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat4 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat5 = false;
			} else if (this.value === 'majorkat2') {
				self.USER_MODEL.profile.Distance_Drive_major_kat1 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat2 = true;
				self.USER_MODEL.profile.Distance_Drive_major_kat3 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat4 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat5 = false;
			} else if (this.value === 'majorkat3') {
				self.USER_MODEL.profile.Distance_Drive_major_kat1 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat2 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat3 = true;
				self.USER_MODEL.profile.Distance_Drive_major_kat4 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat5 = false;
			} else if (this.value === 'majorkat4') {
				self.USER_MODEL.profile.Distance_Drive_major_kat1 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat2 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat3 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat4 = true;
				self.USER_MODEL.profile.Distance_Drive_major_kat5 = false;
			} else {
				self.USER_MODEL.profile.Distance_Drive_major_kat1 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat2 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat3 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat4 = false;
				self.USER_MODEL.profile.Distance_Drive_major_kat5 = true;
			}
		});
		
		$("#location-ok").on('click', function() {
			if (self.USER_MODEL.MOCKUP === false) {
				// Tell user that this might take some time...
				const html = '<div class="highlighted-message"><p>'+ll_no_database_message+'</p></div>';
				$('#'+self.FELID).empty().append(html);
			}
			// Save all
			const data = [
				{propName:'Country', value:self.USER_MODEL.profile['Country']},
				{propName:'NUTS3', value:self.USER_MODEL.profile['NUTS3']}
				//{propName:'Distance_Drive_small', value:self.USER_MODEL.profile.Distance_Drive_small},
				//{propName:'Distance_Drive_major', value:self.USER_MODEL.profile.Distance_Drive_major}
			];
			
			if (self.USER_MODEL.profile.Distance_Drive_minor_kat1 === true) {
				data.push({propName:'Distance_Drive_minor_kat1', value:1});
			} else {
				data.push({propName:'Distance_Drive_minor_kat1', value:0});
			}
			if (self.USER_MODEL.profile.Distance_Drive_minor_kat2 === true) {
				data.push({propName:'Distance_Drive_minor_kat2', value:1});
			} else {
				data.push({propName:'Distance_Drive_minor_kat2', value:0});
			}
			if (self.USER_MODEL.profile.Distance_Drive_minor_kat3 === true) {
				data.push({propName:'Distance_Drive_minor_kat3', value:1});
			} else {
				data.push({propName:'Distance_Drive_minor_kat3', value:0});
			}
			if (self.USER_MODEL.profile.Distance_Drive_minor_kat4 === true) {
				data.push({propName:'Distance_Drive_minor_kat4', value:1});
			} else {
				data.push({propName:'Distance_Drive_minor_kat4', value:0});
			}
			if (self.USER_MODEL.profile.Distance_Drive_minor_kat5 === true) {
				data.push({propName:'Distance_Drive_minor_kat5', value:1});
			} else {
				data.push({propName:'Distance_Drive_minor_kat5', value:0});
			}
			
			if (self.USER_MODEL.profile.Distance_Drive_major_kat1 === true) {
				data.push({propName:'Distance_Drive_major_kat1', value:1});
			} else {
				data.push({propName:'Distance_Drive_major_kat1', value:0});
			}
			if (self.USER_MODEL.profile.Distance_Drive_major_kat2 === true) {
				data.push({propName:'Distance_Drive_major_kat2', value:1});
			} else {
				data.push({propName:'Distance_Drive_major_kat2', value:0});
			}
			if (self.USER_MODEL.profile.Distance_Drive_major_kat3 === true) {
				data.push({propName:'Distance_Drive_major_kat3', value:1});
			} else {
				data.push({propName:'Distance_Drive_major_kat3', value:0});
			}
			if (self.USER_MODEL.profile.Distance_Drive_major_kat4 === true) {
				data.push({propName:'Distance_Drive_major_kat4', value:1});
			} else {
				data.push({propName:'Distance_Drive_major_kat4', value:0});
			}
			if (self.USER_MODEL.profile.Distance_Drive_major_kat5 === true) {
				data.push({propName:'Distance_Drive_major_kat5', value:1});
			} else {
				data.push({propName:'Distance_Drive_major_kat5', value:0});
			}
			
			console.log(['About to save data=',data]);
			self.USER_MODEL.updateUserProfile(data, "prod_nl_1");
		});
		this.rendered = true;
	}
}
