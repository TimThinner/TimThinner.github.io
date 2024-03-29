import View from '../common/View.js';
/*
	UserModel:
		this.profile = {
			Dummy_livestock: undefined, // 'No', // 'Yes'
			
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
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_yes = LM['translation'][sel]['dummy_yes'];
		const ll_no = LM['translation'][sel]['dummy_no'];
		const ll_offering_query = LM['translation'][sel]['products_offering_query'];
		const ll_animals_query = LM['translation'][sel]['animals_query'];
		const ll_dairy_query = LM['translation'][sel]['dairy_products_query'];
		
		const anim_a_Options = [
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
		];
		
		const anim_b_Options = [
			{prop:'Dummy_Milk',id:'milk',label:''},
			{prop:'Dummy_cheese_normal',id:'cheese',label:''},
			{prop:'Dummy_cheese_reg_special',id:'cheese-special',label:''},
			{prop:'Dummy_Dairy_Products',id:'diary-prod',label:''},
			{prop:'Dummy_Beef',id:'steaks',label:''},
			{prop:'Dummy_special_Beef',id:'high-quality-meat',label:''},
			{prop:'Dummy_raw_milk_only',id:'milk-only',label:''}
		];
		
		// Fill in the labels:
		anim_a_Options.forEach(o=>{
			o.label = LM['translation'][sel][o.prop];
		});
		anim_b_Options.forEach(o=>{
			o.label = LM['translation'][sel][o.prop];
		});
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = '<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM ANIMALS</h3>'+
						'<p><img src="./img/animals.png" height="150"/></p>'+
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
					'<div class="input-field col s12 m10 offset-m1">'+
						'<h6>'+ll_animals_query+'</h6>'+
						'<div id="anim-a-options-wrapper"></div>'+
					'</div>'+
					'<div class="input-field col s12 m10 offset-m1">'+
						'<h6>'+ll_dairy_query+'</h6>'+
						'<div id="anim-b-options-wrapper"></div>'+
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
		if (this.USER_MODEL.profile.Dummy_livestock === 'No') {
			$("#animals-no").prop("checked", true);
		} else if (this.USER_MODEL.profile.Dummy_livestock === 'Yes') {
			$("#animals-yes").prop("checked", true);
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
		
		$('input[type=radio][name=animalsStatus]').change(function() {
			if (this.value == 'no') {
				console.log('Dummy_livestock No'); // Dummy_veggie_farm NO
				self.USER_MODEL.profile.Dummy_livestock = 'No';
				// DATABASE Update USER_MODEL
				
			} else if (this.value == 'yes') {
				console.log('Dummy_livestock Yes');
				self.USER_MODEL.profile.Dummy_livestock = 'Yes';
				// DATABASE Update USER_MODEL
			}
		});
		
		// Set checkbox change -handlers:
		anim_a_Options.forEach(o=>{
			$("#"+o.id).change(function() {
				if(this.checked) {
					self.USER_MODEL.profile[o.prop] = true;
					// DATABASE Update USER_MODEL
				} else {
					self.USER_MODEL.profile[o.prop] = false;
					// DATABASE Update USER_MODEL
				}
			});
		});
		
		anim_b_Options.forEach(o=>{
			$("#"+o.id).change(function() {
				if(this.checked) {
					self.USER_MODEL.profile[o.prop] = true;
					// DATABASE Update USER_MODEL
				} else {
					self.USER_MODEL.profile[o.prop] = false;
					// DATABASE Update USER_MODEL
				}
			});
		});
		
		$("#animals-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('farm');
		});
		this.rendered = true;
	}
}
