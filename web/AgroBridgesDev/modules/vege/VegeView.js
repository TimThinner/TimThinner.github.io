import View from '../common/View.js';

/*
	UserModel:
		this.profile = {
			Dummy_veggie_farm: undefined; //'No','Yes'
			
			Dummy_lettuce: false,
			Dummy_fruit_vegetables: false,
			Dummy_pumpkin: false,
			Dummy_bulb: false,
			Dummy_Root: false,
			Dummy_Cabbage: false,
			Dummy_Special: false,
			
			vegetables_total: 0,
			Hectare_veggies: 0,
*/

export default class VegeView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'vege-message';
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
		if (this.controller.visible) {
			if (options.model==='UserModel' && options.method==='updateUserProfile') {
				if (options.status === 200) {
					
					$('#'+this.FELID).empty();
					// const msg = 'Feedback submitted OK';
					// Show Toast: Saved OK!
					const LM = this.controller.master.modelRepo.get('LanguageModel');
					const sel = LM.selected;
					//const save_ok = LM['translation'][sel]['PROFILE_SAVE_OK'];
					const save_ok = LM['translation'][sel]['status_profiled_save'];
					M.toast({
						displayLength:500, 
						html: save_ok,
						classes: 'teal darken-1'
					});
					
					// After 1 second go back to FARM-page automatically.
					setTimeout(() => this.controller.models['MenuModel'].setSelected('farm'), 1000);
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					// After 1 second go back to FARM-page automatically.
					// $('#vege-ok').removeClass('disabled');
					
					setTimeout(() => this.controller.models['MenuModel'].setSelected('farm'), 1000);
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_yes = LM['translation'][sel]['dummy_yes'];
		const ll_no = LM['translation'][sel]['dummy_no'];
		const ll_offering_query = LM['translation'][sel]['products_offering_query'];
		const ll_vege_query = LM['translation'][sel]['vegetables_query'];
		const ll_how_many_query = LM['translation'][sel]['vegetables_how_many_query'];
		const ll_farm_vegetables_title = LM['translation'][sel]['farm_vegetables_title'];
		
		//const ll_hectares_query = LM['translation'][sel]['vege_hectare_query'];
		//const ll_no_database_message = LM['translation'][sel]['no_database_message'];
		
		const vegeOptions = [
			{prop:'Dummy_lettuce',id:'lettuce',label:''},
			{prop:'Dummy_fruit_vegetables',id:'fruitlike',label:''},
			{prop:'Dummy_pumpkin',id:'pumpkins',label:''},
			{prop:'Dummy_bulb',id:'bulb',label:''},
			{prop:'Dummy_Root',id:'root',label:''},
			{prop:'Dummy_Cabbage',id:'cabbages',label:''},
			{prop:'Dummy_Special',id:'specialities',label:''}
		];
		// Fill in the labels:
		vegeOptions.forEach(o=>{
			o.label = LM['translation'][sel][o.prop];
		});
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">'+ll_farm_vegetables_title+'</h3>'+
						'<p><img src="./img/photo-veges.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_offering_query+'</h6>'+
						'<p><label><input class="with-gap" name="vegeStatus" id="vege-no" type="radio" value="no" /><span>'+ll_no+'</span></label></p>'+
						'<p><label><input class="with-gap" name="vegeStatus" id="vege-yes" type="radio" value="yes" /><span>'+ll_yes+'</span></label></p>'+
					'</div>'+
					'<div id="vege-query-1" class="input-field col s12 m10 offset-m1">'+
						'<h6 id="required-A">'+ll_vege_query+'</h6>'+
						'<div id="vege-options-wrapper"></div>'+
					'</div>'+
					// NOTE: Make all sliders 16,6667% narrower than "full" width => margin is one column to the left and right.
					// But not in mobile => do it from Tablet devices and higher resolution screens. 
					'<div id="vege-query-2" class="input-field col s12 m10 offset-m1">'+ // s12 => s10 offset-s1
						'<h6 id="required-B">'+ll_how_many_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="vegetables-total-slider"></div>'+
					'</div>'+
					/*
					'<div id="vege-query-3" class="input-field col s12 m10 offset-m1">'+
						'<h6 id="required-C">'+ll_hectares_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="Hectare-veggies-slider"></div>'+
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
						'<button class="btn waves-effect waves-light" id="vege-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		// Insert checkbox markup for options:
		vegeOptions.forEach(o=>{
			const html = '<p><label><input type="checkbox" class="filled-in" id="'+o.id+'" /><span>'+o.label+'</span></label></p>';
			$('#vege-options-wrapper').append(html);
		});
		
		// Restore current selection:
		const vegetables_total  = this.USER_MODEL.profile.vegetables_total;
		//const Hectare_veggies = this.USER_MODEL.profile.Hectare_veggies;
		
		if (typeof this.USER_MODEL.profile.Dummy_veggie_farm === 'undefined') {
			
			$('#vege-ok').addClass('disabled');
			
		} else if (this.USER_MODEL.profile.Dummy_veggie_farm === 'No') {
			$("#vege-no").prop("checked", true);
			$("#vege-query-1").hide();
			$("#vege-query-2").hide();
			//$("#vege-query-3").hide();
			
		} else if (this.USER_MODEL.profile.Dummy_veggie_farm === 'Yes') {
			$("#vege-yes").prop("checked", true);
			
			//$("#vege-query-1").show(); These are already shown
			//$("#vege-query-2").show();
			//$("#vege-query-3").show();
			
			// Add class="required" to all 3 other questions:
			$('#required-A').addClass('required');
			$('#required-B').addClass('required');
			$('#required-C').addClass('required');
		}
		vegeOptions.forEach(o=>{
			if (this.USER_MODEL.profile[o.prop]===true) {
				$("#"+o.id).prop("checked", true);
			} else {
				$("#"+o.id).prop("checked", false);
			}
		});
		
		const vegeTotalSlider = document.getElementById('vegetables-total-slider');
		noUiSlider.create(vegeTotalSlider, {
			start: [vegetables_total],
			connect: 'lower',
			tooltips: [wNumb({decimals: 0})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 5,  // Default 5
			keyboardMultiplier: 5,      // Default 1
			range: {
				'min': [0],
				'max': [40]
			}
		});
		vegeTotalSlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.vegetables_total = Math.round(values[0]);
			}
		});
		/*
		const hectareSlider = document.getElementById('Hectare-veggies-slider');
		noUiSlider.create(hectareSlider, {
			start: [Hectare_veggies],
			connect: 'lower',
			tooltips: [wNumb({decimals:0,suffix:' ha'})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 50, // Default 5
			keyboardMultiplier: 50,     // Default 1
			range: {
				'min': [0],
				'max': [500]
			}
		});
		hectareSlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]); // values is an array with one value, for example ["20.00"].
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.Hectare_veggies = Math.round(values[0]);
			}
		});
		*/
		$('input[type=radio][name=vegeStatus]').change(function() {
			
			// Enable the OK-button.
			if ($('#vege-ok').hasClass('disabled')) {
				$('#vege-ok').removeClass('disabled');
			}
			
			if (this.value == 'no') {
				console.log('Dummy_veggie_farm No'); // Dummy_veggie_farm NO
				self.USER_MODEL.profile.Dummy_veggie_farm = 'No';
				
				$("#vege-query-1").hide();
				$("#vege-query-2").hide();
				//$("#vege-query-3").hide();
				
				// Must reset all properties;
				vegeOptions.forEach(o=>{
					self.USER_MODEL.profile[o.prop] = false;
					$("#"+o.id).prop("checked", false);
				});
				self.USER_MODEL.profile.vegetables_total = 0;
				//self.USER_MODEL.profile.Hectare_veggies = 0;
				
				// Remove class="required" from all 3 other questions:
				if ($("#required-A").hasClass("required")) { $('#required-A').removeClass('required'); }
				if ($("#required-B").hasClass("required")) { $('#required-B').removeClass('required'); }
				if ($("#required-C").hasClass("required")) { $('#required-C').removeClass('required'); }
				
			} else if (this.value == 'yes') {
				console.log('Dummy_veggie_farm Yes');
				self.USER_MODEL.profile.Dummy_veggie_farm = 'Yes';
				
				$("#vege-query-1").show();
				$("#vege-query-2").show();
				//$("#vege-query-3").show();
				
				// Add class="required" to all 3 other questions:
				if (!$("#required-A").hasClass("required")) { $('#required-A').addClass('required'); }
				if (!$("#required-B").hasClass("required")) { $('#required-B').addClass('required'); }
				if (!$("#required-C").hasClass("required")) { $('#required-C').addClass('required'); }
			}
		});
		
		// Set checkbox change -handlers:
		vegeOptions.forEach(o=>{
			$("#"+o.id).change(function() {
				if(this.checked) {
					self.USER_MODEL.profile[o.prop] = true;
				} else {
					self.USER_MODEL.profile[o.prop] = false;
				}
			});
		});
		
		$("#vege-ok").on('click', function() {
			// Save all
			// Note: change all boolean values (true => 1 and false => 0)
			// and 'Yes' => 1 and 'No' => 0 if indicated that way.
			
			$('#vege-ok').addClass('disabled');
			/*
			if (self.USER_MODEL.MOCKUP === false) {
				// Tell user that this might take some time...
				const html = '<div class="highlighted-message"><p>'+ll_no_database_message+'</p></div>';
				$('#'+self.FELID).empty().append(html);
			}
			*/
			const data = [];
			if (self.USER_MODEL.profile.Dummy_veggie_farm === 'Yes') {
				data.push({propName:'Dummy_veggie_farm', value:1});
			} else {
				data.push({propName:'Dummy_veggie_farm', value:0});
			}
			data.push({propName:'vegetables_total', value:self.USER_MODEL.profile.vegetables_total});
			//data.push({propName:'Hectare_veggies', value:self.USER_MODEL.profile.Hectare_veggies});
			
			vegeOptions.forEach(o=>{
				if (self.USER_MODEL.profile[o.prop]) {
					data.push({propName:o.prop, value:1});
				} else {
					data.push({propName:o.prop, value:0});
				}
			});
			console.log(['About to save data=',data]);
			self.USER_MODEL.updateUserProfile(data);
		});
		this.rendered = true;
	}
}
