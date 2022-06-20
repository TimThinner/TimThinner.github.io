import View from '../common/View.js';
/*
	UserModel:
		this.profile = {
			Dummy_livestock: undefined, // 'No', // 'Yes'
			
			NEW properties are:
				"Dummy_Cows":"Dairy Cows",
				"Dummy_Layer_Hens":"Layer Hens",
				"Dummy_Fish":"Fish",
				"Other_animals": "Others (pigs, poultry, sheep, and goats)",
				
				
				"Dummy_raw_milk_only":"Only Raw Milk",
				"Dummy_Milk":"Homogenized and pasteurized milk",
				"Dummy_Dairy_Products":"Milk products (cheese and yogurt...)",
				"Dummy_Beef":"Beef",
				"Dummy_animal_welfare":"Beef from an animal kept under higher animal welfare standards",
				"Dummy_spec_beef":"Beef from animal rarer varieties (Wagyu, Angus...)",
				"Dummy_cheese_reg_special":"Other animal products considered regional specialties (Prosciutto di Parma or Bleu d’Auvergne)",
			
			
			Number_cows: false,
			Number_goats: false,
			Number_beef: false,
			Number_other_poultry: false,
			Number_layer_Hens: false,
			Number_hogs: false,
			Dummy_spec_hog: false,
			Number_fish: false,
			Dummy_animal_welfare: false,
			Dummy_Beef_2: false,
			
			Dummy_Milk: false,
			Dummy_cheese_normal: false,
			Dummy_cheese_reg_special: false,
			Dummy_Dairy_Products: false,
			Dummy_Beef: false,
			Dummy_special_Beef: false,
			Dummy_raw_milk_only: false,
*/
export default class AnimalsView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'animals-message';
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
					const save_ok = LM['translation'][sel]['PROFILE_SAVE_OK'];
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
		const ll_animals_query = LM['translation'][sel]['animals_query'];
		const ll_dairy_query = LM['translation'][sel]['dairy_products_query'];
		const ll_no_database_message = LM['translation'][sel]['no_database_message'];
		
		const anim_a_Options = [
			{prop:'Dummy_Cows',id:'cows',label:''},
			{prop:'Dummy_Layer_Hens',id:'hens',label:''},
			{prop:'Dummy_Fish',id:'fish',label:''},
			{prop:'Other_animals',id:'other',label:''}
			/*
			{prop:'Number_cows',id:'cows',label:''},
			{prop:'Number_goats',id:'goats',label:''},
			{prop:'Number_beef',id:'beef',label:''},
			{prop:'Number_other_poultry',id:'poultry',label:''},
			{prop:'Number_layer_Hens',id:'hens',label:''},
			{prop:'Number_hogs',id:'hogs',label:''},
			{prop:'Dummy_spec_hog',id:'spec-hog',label:''},
			{prop:'Number_fish',id:'fish',label:''},
			{prop:'Dummy_animal_welfare',id:'welfare',label:''},
			{prop:'Dummy_Beef_2',id:'beef-2',label:''}
			*/
		];
		
		const anim_b_Options = [
			{prop:'Dummy_raw_milk_only',id:'milk-only',label:''},
			{prop:'Dummy_Milk',id:'milk',label:''},
			{prop:'Dummy_Dairy_Products',id:'diary-prod',label:''},
			{prop:'Dummy_Beef',id:'steaks',label:''},
			{prop:'Dummy_animal_welfare',id:'welfare',label:''},
			{prop:'Dummy_spec_beef',id:'special-beef',label:''},
			{prop:'Dummy_cheese_reg_special',id:'cheese-special',label:''}
			/*
			{prop:'Dummy_Milk',id:'milk',label:''},
			{prop:'Dummy_cheese_normal',id:'cheese',label:''},
			{prop:'Dummy_cheese_reg_special',id:'cheese-special',label:''},
			{prop:'Dummy_Dairy_Products',id:'diary-prod',label:''},
			{prop:'Dummy_Beef',id:'steaks',label:''},
			{prop:'Dummy_special_Beef',id:'high-quality-meat',label:''},
			{prop:'Dummy_raw_milk_only',id:'milk-only',label:''}
			*/
		];
		
		// Fill in the labels:
		anim_a_Options.forEach(o=>{
			o.label = LM['translation'][sel][o.prop];
		});
		anim_b_Options.forEach(o=>{
			o.label = LM['translation'][sel][o.prop];
		});
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM ANIMALS</h3>'+
						'<p><img src="./img/photo-animals.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_offering_query+'</h6>'+
						'<p><label><input class="with-gap" name="animalsStatus" id="animals-no" type="radio" value="no" /><span>'+ll_no+'</span></label></p>'+
						'<p><label><input class="with-gap" name="animalsStatus" id="animals-yes" type="radio" value="yes" /><span>'+ll_yes+'</span></label></p>'+
					'</div>'+
					// Add id for both query sets, so that we can hide/show them depending on "no"/"yes" answer above.
					'<div id="animals-query-1" class="input-field col s12 m10 offset-m1">'+
						'<h6>'+ll_animals_query+'</h6>'+
						'<div id="anim-a-options-wrapper"></div>'+
					'</div>'+
					'<div id="animals-query-2" class="input-field col s12 m10 offset-m1">'+
						'<h6>'+ll_dairy_query+'</h6>'+
						'<div id="anim-b-options-wrapper"></div>'+
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
						'<button class="btn waves-effect waves-light" id="animals-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		// Insert checkbox markup for options:
		anim_a_Options.forEach(o=>{
			const html = '<p><label><input type="checkbox" class="filled-in" id="'+o.id+'" /><span>'+o.label+'</span></label></p>';
			$('#anim-a-options-wrapper').append(html);
		});
		anim_b_Options.forEach(o=>{
			const html = '<p><label><input type="checkbox" class="filled-in" id="'+o.id+'" /><span>'+o.label+'</span></label></p>';
			$('#anim-b-options-wrapper').append(html);
		});
		
		// Restore current selection:
		if (typeof this.USER_MODEL.profile.Dummy_livestock === 'undefined') {
			
			$('#animals-ok').addClass('disabled');
			
		} else if (this.USER_MODEL.profile.Dummy_livestock === 'No') {
			$("#animals-no").prop("checked", true);
			$("#animals-query-1").hide();
			$("#animals-query-2").hide();
			
		} else if (this.USER_MODEL.profile.Dummy_livestock === 'Yes') {
			$("#animals-yes").prop("checked", true);
			$("#animals-query-1").show();
			$("#animals-query-2").show();
		}
		
		anim_a_Options.forEach(o=>{
			if (this.USER_MODEL.profile[o.prop]===true) {
				$("#"+o.id).prop("checked", true);
			} else {
				$("#"+o.id).prop("checked", false);
			}
		});
		
		anim_b_Options.forEach(o=>{
			if (this.USER_MODEL.profile[o.prop]===true) {
				$("#"+o.id).prop("checked", true);
			} else {
				$("#"+o.id).prop("checked", false);
			}
		});
		
		// EVENT HANDLERS:
		// NOTE: jQuery function hide and show are used here.
		// hide() adds style="display:none;" to div element.
		// show() changes style="display:block;" to div element.
		$('input[type=radio][name=animalsStatus]').change(function() {
			
			// Enable the OK-button.
			if ($('#animals-ok').hasClass('disabled')) {
				$('#animals-ok').removeClass('disabled');
			}
			
			if (this.value == 'no') {
				console.log('Dummy_livestock No');
				self.USER_MODEL.profile.Dummy_livestock = 'No';
				
				// Must reset all properties;
				anim_a_Options.forEach(o=>{
					self.USER_MODEL.profile[o.prop] = false;
					$("#"+o.id).prop("checked", false);
				});
				anim_b_Options.forEach(o=>{
					self.USER_MODEL.profile[o.prop] = false;
					$("#"+o.id).prop("checked", false);
				});
				
				$("#animals-query-1").hide();
				$("#animals-query-2").hide();
				
			} else if (this.value == 'yes') {
				console.log('Dummy_livestock Yes');
				self.USER_MODEL.profile.Dummy_livestock = 'Yes';
				$("#animals-query-1").show();
				$("#animals-query-2").show();
			}
		});
		
		// Set checkbox change -handlers:
		anim_a_Options.forEach(o=>{
			$("#"+o.id).change(function() {
				if(this.checked) {
					self.USER_MODEL.profile[o.prop] = true;
				} else {
					self.USER_MODEL.profile[o.prop] = false;
				}
			});
		});
		
		anim_b_Options.forEach(o=>{
			$("#"+o.id).change(function() {
				if(this.checked) {
					self.USER_MODEL.profile[o.prop] = true;
				} else {
					self.USER_MODEL.profile[o.prop] = false;
				}
			});
		});
		
		$("#animals-ok").on('click', function() {
			// Save all
			// Note: change all boolean values (true => 1 and false => 0)
			// and 'Yes' => 1 and 'No' => 0 if indicated that way.
			if (self.USER_MODEL.MOCKUP === false) {
				// Tell user that this might take some time...
				const html = '<div class="highlighted-message"><p>'+ll_no_database_message+'</p></div>';
				$('#'+self.FELID).empty().append(html);
			}
			const data = [];
			if (self.USER_MODEL.profile.Dummy_livestock === 'Yes') {
				data.push({propName:'Dummy_livestock', value:1});
			} else {
				data.push({propName:'Dummy_livestock', value:0});
			}
			anim_a_Options.forEach(o=>{
				if (self.USER_MODEL.profile[o.prop]) {
					data.push({propName:o.prop, value:1});
				} else {
					data.push({propName:o.prop, value:0});
				}
			});
			anim_b_Options.forEach(o=>{
				if (self.USER_MODEL.profile[o.prop]) {
					data.push({propName:o.prop, value:1});
				} else {
					data.push({propName:o.prop, value:0});
				}
			});
			console.log(['About to save data=',data]);
			self.USER_MODEL.updateUserProfile(data, "prod_nl_1");
		});
		this.rendered = true;
	}
}
