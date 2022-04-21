import View from '../common/View.js';

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
		
		const ll_animals_a = ['Dairy Cows',
			'Goats and Sheep',
			'Beef Cattle',
			'Poultry',
			'Layer Hens (more than 1200 hens)',
			'Hogs',
			'Are you keeping fattening pigs know for high qulity meat (such as Mangalitza, Angler Sattelschwein or Iberico)?',
			'Fish',
			'Are offering  a higher animal welfare standard (playing material & increased space & outdoor areas)?',
			'Are you offering meat products such as ham, sausages etc.?'
		];
		const ll_animals_b = ['Milk (pasteurized and homogenized)',
			'Cheese (regular varieties)',
			'Cheese (regional speciality)',
			'Dairy Yoghurt',
			'Beef (Steaks, Sausages, minced meat)',
			'Are you keeping beef cows known to produce high quality meat (such as Charolais, Hereford, Angus or Wagyu)?',
			'Do you only produce raw milk'
		];
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
					'<div class="col s12">'+
						'<h6 class="required">Are you offering these products?</h6>'+
						'<p><label><input class="with-gap" name="animalsStatus" id="animals-no" type="radio" value="no" /><span>No</span></label></p>'+
						'<p><label><input class="with-gap" name="animalsStatus" id="animals-yes" type="radio" value="yes" /><span>Yes</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6>Which animals are you keeping (hobby livestock excluded)?</h6>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-a" /><span>'+ll_animals_a[0]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-b" /><span>'+ll_animals_a[1]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-c" /><span>'+ll_animals_a[2]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-d" /><span>'+ll_animals_a[3]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-e" /><span>'+ll_animals_a[4]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-f" /><span>'+ll_animals_a[5]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-g" /><span>'+ll_animals_a[6]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-h" /><span>'+ll_animals_a[7]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-i" /><span>'+ll_animals_a[8]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-a-j" /><span>'+ll_animals_a[9]+'</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6>Are you selling the following dairy products?</h6>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-b-a" /><span>'+ll_animals_b[0]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-b-b" /><span>'+ll_animals_b[1]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-b-c" /><span>'+ll_animals_b[2]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-b-d" /><span>'+ll_animals_b[3]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-b-e" /><span>'+ll_animals_b[4]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-b-f" /><span>'+ll_animals_b[5]+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="animals-b-g" /><span>'+ll_animals_b[6]+'</span></label></p>'+
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
		
		// Restore current selection:
		if (this.USER_MODEL.profile.Dummy_livestock === 'No') {
			$("#animals-no").prop("checked", true);
		} else if (this.USER_MODEL.profile.Dummy_livestock === 'Yes') {
			$("#animals-yes").prop("checked", true);
		}
		
		if (this.USER_MODEL.profile.Number_cows) {
			$("#animals-a-a").prop("checked", true);
		} else {
			$("#animals-a-a").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Number_goats) {
			$("#animals-a-b").prop("checked", true);
		} else {
			$("#animals-a-b").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Number_beef) {
			$("#animals-a-c").prop("checked", true);
		} else {
			$("#animals-a-c").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Number_other_poultry) {
			$("#animals-a-d").prop("checked", true);
		} else {
			$("#animals-a-d").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Number_layer_Hens) {
			$("#animals-a-e").prop("checked", true);
		} else {
			$("#animals-a-e").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Number_hogs) {
			$("#animals-a-f").prop("checked", true);
		} else {
			$("#animals-a-f").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_spec_hog) {
			$("#animals-a-g").prop("checked", true);
		} else {
			$("#animals-a-g").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Number_fish) {
			$("#animals-a-h").prop("checked", true);
		} else {
			$("#animals-a-h").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_animal_welfare) {
			$("#animals-a-i").prop("checked", true);
		} else {
			$("#animals-a-i").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_Beef_2) {
			$("#animals-a-j").prop("checked", true);
		} else {
			$("#animals-a-j").prop("checked", false);
		}
		
		$("#animals-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('farm');
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
									'<td>Are you offering these products?</td>'+
									'<td>Dummy_livestock (No, Yes)</td>'+
								'</tr>'+
								'<tr>'+
									'<td>Which animals are you keeping (hobby livestock excluded)?</td>'+
									'<td>Number_cows, Number_goats, Number_beef, Number_other_poultry, Number_layer_Hens, Number_hogs, Dummy_spec_hog, Number_fish, Dummy_animal_welfare, Dummy_Beef_2</td>'+
								'</tr>'+
								'<tr>'+
									'<td>Are you offering following dairy products?</td>'+
									'<td>Dummy_Milk, Dummy_cheese_normal, Dummy_cheese_reg_special, Dummy_Dairy _Products, Dummy_Beef, Dummy_special_Beef, Dummy_raw_milk_only</td>'+
								'</tr>'+
							'</tbody>'+
						'</table>'+
*/