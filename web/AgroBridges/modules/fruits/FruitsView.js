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
		
		const ll_stonefruits = 'Stonefruits (Peach, Nectarine, Apricot, Cherries...)';
		const ll_pomefruits = 'Pome fruits (Apple, Pear, Quince...)';
		const ll_berries = 'Berries (Rapsberries, Strawberries, Blueberries...)';
		const ll_citrus = 'Citrus (Orange, Tangerine, Lemon...)';
		const ll_exotic = 'Other exotic fruits (banana, date, kiwi, mango...)';
		
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
					'<div class="col s12">'+
						'<h6 class="required">Are you offering these products?</h6>'+
						'<p><label><input class="with-gap" name="fruitsStatus" id="fruits-no" type="radio" value="no" /><span>No</span></label></p>'+
						'<p><label><input class="with-gap" name="fruitsStatus" id="fruits-yes" type="radio" value="yes" /><span>Yes</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6>Which of these fruits do you grow?</h6>'+
						'<p><label><input type="checkbox" class="filled-in" id="stonefruits" /><span>'+ll_stonefruits+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="pomefruits" /><span>'+ll_pomefruits+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="berries" /><span>'+ll_berries+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="citrus" /><span>'+ll_citrus+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="exotic" /><span>'+ll_exotic+'</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6 class="required">How many different fruits do you approximately grow in total?</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="fruits-total-slider"></div>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6 class="required">On how many hectares do you grow fruits?</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="Hectare-fruits-slider"></div>'+
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
		
		
		// Restore current selection:
		const fruits_total = this.USER_MODEL.profile.fruits_total;
		const Hectare_fruits = this.USER_MODEL.profile.Hectare_fruits;
		
		if (this.USER_MODEL.profile.Dummy_fruit_farm === 'No') {
			$("#fruits-no").prop("checked", true);
		} else if (this.USER_MODEL.profile.Dummy_fruit_farm === 'Yes') {
			$("#fruits-yes").prop("checked", true);
		}
		
		if (this.USER_MODEL.profile.Dummy_Stonefruits) {
			$("#stonefruits").prop("checked", true);
		} else {
			$("#stonefruits").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_Pomefruits) {
			$("#pomefruits").prop("checked", true);
		} else {
			$("#pomefruits").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_Berries) {
			$("#berries").prop("checked", true);
		} else {
			$("#berries").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_Citrus) {
			$("#citrus").prop("checked", true);
		} else {
			$("#citrus").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_exotic_fruits) {
			$("#exotic").prop("checked", true);
		} else {
			$("#exotic").prop("checked", false);
		}
		
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
				// DATABASE Update USER_MODEL
			}
		});
		
		
		const hectareSlider = document.getElementById('Hectare-fruits-slider');
		noUiSlider.create(hectareSlider, {
			start: [Hectare_fruits],
			connect: 'lower',
			tooltips: [wNumb({decimals: 0})],
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
				// DATABASE Update USER_MODEL
			}
		});
		
		$('input[type=radio][name=fruitsStatus]').change(function() {
			if (this.value == 'no') {
				console.log('Dummy_fruit_farm No'); // Dummy_fruit_farm NO
				self.USER_MODEL.profile.Dummy_fruit_farm = 'No';
				// DATABASE Update USER_MODEL
				
			} else if (this.value == 'yes') {
				console.log('Dummy_fruit_farm Yes');
				self.USER_MODEL.profile.Dummy_fruit_farm = 'Yes';
				// DATABASE Update USER_MODEL
			}
		});
		
		/*
		'<p><label><input type="checkbox" class="filled-in" id="stonefruits" /><span>'+ll_stonefruits+'</span></label></p>'+
		'<p><label><input type="checkbox" class="filled-in" id="pomefruits" /><span>'+ll_pomefruits+'</span></label></p>'+
		'<p><label><input type="checkbox" class="filled-in" id="berries" /><span>'+ll_berries+'</span></label></p>'+
		'<p><label><input type="checkbox" class="filled-in" id="citrus" /><span>'+ll_citrus+'</span></label></p>'+
		'<p><label><input type="checkbox" class="filled-in" id="exotic" /><span>'+ll_exotic+'</span></label></p>'+
		*/
		$("#stonefruits").change(function() {
			if(this.checked) {
				console.log('Dummy_Stonefruits true');
				self.USER_MODEL.profile.Dummy_Stonefruits = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Stonefruits false');
				self.USER_MODEL.profile.Dummy_Stonefruits = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#pomefruits").change(function() {
			if(this.checked) {
				console.log('Dummy_Pomefruits true');
				self.USER_MODEL.profile.Dummy_Pomefruits = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Pomefruits false');
				self.USER_MODEL.profile.Dummy_Pomefruits = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#berries").change(function() {
			if(this.checked) {
				console.log('Dummy_Berries true');
				self.USER_MODEL.profile.Dummy_Berries = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Berries false');
				self.USER_MODEL.profile.Dummy_Berries = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#citrus").change(function() {
			if(this.checked) {
				console.log('Dummy_Citrus true');
				self.USER_MODEL.profile.Dummy_Citrus = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Citrus false');
				self.USER_MODEL.profile.Dummy_Citrus = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#exotic").change(function() {
			if(this.checked) {
				console.log('Dummy_exotic_fruits true');
				self.USER_MODEL.profile.Dummy_exotic_fruits = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_exotic_fruits false');
				self.USER_MODEL.profile.Dummy_exotic_fruits = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#fruits-ok").on('click', function() {
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
									'<td>Dummy_fruit_farm (No, Yes)</td>'+
								'</tr>'+
								'<tr>'+
									'<td>Which of these fruits do you grow?</td>'+
									'<td>Dummy_Stonefruits, Dummy_Pomefruits, Dummy_Berries, Dummy_Citrus, Dummy_exotic_fruits</td>'+
								'</tr>'+
								'<tr>'+
									'<td>How many different fruits do you approximately grow in total?</td>'+
									'<td>fruits_total</td>'+
								'</tr>'+
								'<tr>'+
									'<td>On how many hectares do you grow fruits?</td>'+
									'<td>Hectare_fruits</td>'+
								'</tr>'+
							'</tbody>'+
						'</table>'+
*/