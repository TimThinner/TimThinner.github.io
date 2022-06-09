import View from '../common/View.js';

/*
	UserModel:
		this.profile = {
			Dummy_fruit_farm: undefined, //'No', // 'Yes'
			
			Dummy_Stonefruits: false,
			Dummy_Pomefruits: false,
			Dummy_Berries: false,
			Dummy_Citrus: false,
			Dummy_exotic_fruits: false,
			
			fruits_total: 0,
			Hectare_fruits: 0,
*/

export default class FruitsView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'fruits-message';
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
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_offering_query = LM['translation'][sel]['products_offering_query'];
		const ll_yes = LM['translation'][sel]['dummy_yes'];
		const ll_no = LM['translation'][sel]['dummy_no'];
		const ll_fruits_query = LM['translation'][sel]['fruits_query'];
		const ll_how_many_query = LM['translation'][sel]['fruits_how_many_query'];
		const ll_hectares_query = LM['translation'][sel]['fruit_hectare_query'];
		
		const fruitOptions = [
			{prop:'Dummy_Stonefruits',id:'stonefruits',label:''},
			{prop:'Dummy_Pomefruits',id:'pomefruits',label:''},
			{prop:'Dummy_Berries',id:'berries',label:''},
			{prop:'Dummy_Citrus',id:'citrus',label:''},
			{prop:'Dummy_exotic_fruits',id:'exotic',label:''},
		];
		// Fill in the labels:
		fruitOptions.forEach(o=>{
			o.label = LM['translation'][sel][o.prop];
		});
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM FRUITS</h3>'+
						'<p><img src="./img/fruits.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_offering_query+'</h6>'+
						'<p><label><input class="with-gap" name="fruitsStatus" id="fruits-no" type="radio" value="no" /><span>'+ll_no+'</span></label></p>'+
						'<p><label><input class="with-gap" name="fruitsStatus" id="fruits-yes" type="radio" value="yes" /><span>'+ll_yes+'</span></label></p>'+
					'</div>'+
					'<div id="fruits-query-1" class="input-field col s12 m10 offset-m1">'+
						'<h6 id="required-A">'+ll_fruits_query+'</h6>'+
						'<div id="fruit-options-wrapper"></div>'+
					'</div>'+
					'<div id="fruits-query-2" class="input-field col s12 m10 offset-m1">'+
						'<h6 id="required-B">'+ll_how_many_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="fruits-total-slider"></div>'+
					'</div>'+
					'<div id="fruits-query-3" class="input-field col s12 m10 offset-m1">'+
						'<h6 id="required-C">'+ll_hectares_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="Hectare-fruits-slider"></div>'+
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
						'<button class="btn waves-effect waves-light" id="fruits-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		// Insert checkbox markup for options:
		fruitOptions.forEach(o=>{
			const html = '<p><label><input type="checkbox" class="filled-in" id="'+o.id+'" /><span>'+o.label+'</span></label></p>';
			$('#fruit-options-wrapper').append(html);
		});
		
		// Restore current selection:
		const fruits_total = this.USER_MODEL.profile.fruits_total;
		const Hectare_fruits = this.USER_MODEL.profile.Hectare_fruits;
		
		if (this.USER_MODEL.profile.Dummy_fruit_farm === 'No') {
			$("#fruits-no").prop("checked", true);
			$("#fruits-query-1").hide();
			$("#fruits-query-2").hide();
			$("#fruits-query-3").hide();
			
		} else if (this.USER_MODEL.profile.Dummy_fruit_farm === 'Yes') {
			$("#fruits-yes").prop("checked", true);
			
			$("#fruits-query-1").show();
			$("#fruits-query-2").show();
			$("#fruits-query-3").show();
			
			// Add class="required" to all 3 other questions:
			$('#required-A').addClass('required');
			$('#required-B').addClass('required');
			$('#required-C').addClass('required');
		}
		fruitOptions.forEach(o=>{
			if (this.USER_MODEL.profile[o.prop]===true) {
				$("#"+o.id).prop("checked", true);
			} else {
				$("#"+o.id).prop("checked", false);
			}
		});
		
		const fruitsTotalSlider = document.getElementById('fruits-total-slider');
		noUiSlider.create(fruitsTotalSlider, {
			start: [fruits_total],
			connect: 'lower',
			tooltips: [wNumb({decimals: 0})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 5,  // Default 5
			keyboardMultiplier: 5,      // Default 1
			range: {
				'min': [0],
				'max': [20]
			}
		});
		fruitsTotalSlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.fruits_total = Math.round(values[0]);
			}
		});
		
		const hectareSlider = document.getElementById('Hectare-fruits-slider');
		noUiSlider.create(hectareSlider, {
			start: [Hectare_fruits],
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
				self.USER_MODEL.profile.Hectare_fruits = Math.round(values[0]);
			}
		});
		
		$('input[type=radio][name=fruitsStatus]').change(function() {
			if (this.value == 'no') {
				console.log('Dummy_fruit_farm No'); // Dummy_fruit_farm NO
				self.USER_MODEL.profile.Dummy_fruit_farm = 'No';
				
				$("#fruits-query-1").hide();
				$("#fruits-query-2").hide();
				$("#fruits-query-3").hide();
				
				// Must reset all properties;
				fruitOptions.forEach(o=>{
					self.USER_MODEL.profile[o.prop] = false;
					$("#"+o.id).prop("checked", false);
				});
				
				// Remove class="required" from all 3 other questions:
				if ($("#required-A").hasClass("required")) { $('#required-A').removeClass('required'); }
				if ($("#required-B").hasClass("required")) { $('#required-B').removeClass('required'); }
				if ($("#required-C").hasClass("required")) { $('#required-C').removeClass('required'); }
				
			} else if (this.value == 'yes') {
				console.log('Dummy_fruit_farm Yes');
				self.USER_MODEL.profile.Dummy_fruit_farm = 'Yes';
				
				$("#fruits-query-1").show();
				$("#fruits-query-2").show();
				$("#fruits-query-3").show();
				
				// Add class="required" to all 3 other questions:
				if (!$("#required-A").hasClass("required")) { $('#required-A').addClass('required'); }
				if (!$("#required-B").hasClass("required")) { $('#required-B').addClass('required'); }
				if (!$("#required-C").hasClass("required")) { $('#required-C').addClass('required'); }
			}
		});
		
		// Set checkbox change -handlers:
		fruitOptions.forEach(o=>{
			$("#"+o.id).change(function() {
				if(this.checked) {
					self.USER_MODEL.profile[o.prop] = true;
				} else {
					self.USER_MODEL.profile[o.prop] = false;
				}
			});
		});
		
		$("#fruits-ok").on('click', function() {
			// Save all
			// Note: change all boolean values (true => 1 and false => 0)
			// and 'Yes' => 1 and 'No' => 0 if indicated that way.
			const data = [];
			if (self.USER_MODEL.profile.Dummy_fruit_farm === 'Yes') {
				data.push({propName:'Dummy_fruit_farm', value:1});
			} else {
				data.push({propName:'Dummy_fruit_farm', value:0});
			}
			data.push({propName:'fruits_total', value:self.USER_MODEL.profile.fruits_total});
			data.push({propName:'Hectare_fruits', value:self.USER_MODEL.profile.Hectare_fruits});
			
			fruitOptions.forEach(o=>{
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
