import View from '../common/View.js';

/*
	UserModel:
		this.profile = {
			Dummy_veggie_farm: 'No', // 'Yes'
			
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
		
		const ll_lettuce = 'Lettuce (Cut lettuce, Argula, Spinach, Swiss chard, Endivie...)';
		const ll_fruitlike = 'Fruitlike vegetables (Tomatoes, Peppers, Eggplant...)';
		const ll_pumpkins = 'Pumpkins and Courgettes';
		const ll_bulb = 'Bulb vegetables (Celeric and Fennel)';
		const ll_root = 'Root vegetables and Onions (Potatos, Carrots, Parsnip, Root Parsley, Black Salsify...)';
		const ll_cabbages = 'Cabbages (Broccoli, Kohlrabi, red and white cabbage...)';
		const ll_specialities = 'Specialities (Asparagus, Olives, Truffel....)'; 
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM VEGETABLES</h3>'+
						'<p><img src="./img/vege.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h6 class="required">Are you offering these products?</h6>'+
						'<p><label><input class="with-gap" name="vegeStatus" id="vege-no" type="radio" value="no" /><span>No</span></label></p>'+
						'<p><label><input class="with-gap" name="vegeStatus" id="vege-yes" type="radio" value="yes" /><span>Yes</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6>Which of these vegetables do you grow?</h6>'+
						'<p><label><input type="checkbox" class="filled-in" id="lettuce" /><span>'+ll_lettuce+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="fruitlike" /><span>'+ll_fruitlike+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="pumpkins" /><span>'+ll_pumpkins+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="bulb" /><span>'+ll_bulb+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="root" /><span>'+ll_root+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="cabbages" /><span>'+ll_cabbages+'</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="specialities" /><span>'+ll_specialities+'</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6 class="required">How many different vegetables do you grow in total?</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="vegetables-total-slider"></div>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6 class="required">On how many hectares do you grow vegetables?</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="Hectare-veggies-slider"></div>'+
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
		
		// Restore current selection:
		const vegetables_total  = this.USER_MODEL.profile.vegetables_total;
		const Hectare_veggies = this.USER_MODEL.profile.Hectare_veggies;
		
		if (this.USER_MODEL.profile.Dummy_veggie_farm === 'No') {
			$("#vege-no").prop("checked", true);
		} else if (this.USER_MODEL.profile.Dummy_veggie_farm === 'Yes') {
			$("#vege-yes").prop("checked", true);
		}
		
		if (this.USER_MODEL.profile.Dummy_lettuce) {
			$("#lettuce").prop("checked", true);
		} else {
			$("#lettuce").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_fruit_vegetables) {
			$("#fruitlike").prop("checked", true);
		} else {
			$("#fruitlike").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_pumpkin) {
			$("#pumpkins").prop("checked", true);
		} else {
			$("#pumpkins").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_bulb) {
			$("#bulb").prop("checked", true);
		} else {
			$("#bulb").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_Root) {
			$("#root").prop("checked", true);
		} else {
			$("#root").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_Cabbage) {
			$("#cabbages").prop("checked", true);
		} else {
			$("#cabbages").prop("checked", false);
		}
		
		if (this.USER_MODEL.profile.Dummy_Special) {
			$("#specialities").prop("checked", true);
		} else {
			$("#specialities").prop("checked", false);
		}
		
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
				'max': [20]
			}
		});
		vegeTotalSlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.vegetables_total = Math.round(values[0]);
				// DATABASE Update USER_MODEL
			}
		});
		
		const hectareSlider = document.getElementById('Hectare-veggies-slider');
		noUiSlider.create(hectareSlider, {
			start: [Hectare_veggies],
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
				self.USER_MODEL.profile.Hectare_veggies = Math.round(values[0]);
				// DATABASE Update USER_MODEL
			}
		});
		
		$('input[type=radio][name=vegeStatus]').change(function() {
			if (this.value == 'no') {
				console.log('Dummy_veggie_farm No'); // Dummy_veggie_farm NO
				self.USER_MODEL.profile.Dummy_veggie_farm = 'No';
				// DATABASE Update USER_MODEL
				
			} else if (this.value == 'yes') {
				console.log('Dummy_veggie_farm Yes');
				self.USER_MODEL.profile.Dummy_veggie_farm = 'Yes';
				// DATABASE Update USER_MODEL
			}
		});
		
		$("#lettuce").change(function() {
			if(this.checked) {
				console.log('Dummy_lettuce true');
				self.USER_MODEL.profile.Dummy_lettuce = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_lettuce false');
				self.USER_MODEL.profile.Dummy_lettuce = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#fruitlike").change(function() {
			if(this.checked) {
				console.log('Dummy_fruit_vegetables true');
				self.USER_MODEL.profile.Dummy_fruit_vegetables = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_fruit_vegetables false');
				self.USER_MODEL.profile.Dummy_fruit_vegetables = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#pumpkins").change(function() {
			if(this.checked) {
				console.log('Dummy_pumpkin true');
				self.USER_MODEL.profile.Dummy_pumpkin = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_pumpkin false');
				self.USER_MODEL.profile.Dummy_pumpkin = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#bulb").change(function() {
			if(this.checked) {
				console.log('Dummy_bulb true');
				self.USER_MODEL.profile.Dummy_bulb = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_bulb false');
				self.USER_MODEL.profile.Dummy_bulb = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#root").change(function() {
			if(this.checked) {
				console.log('Dummy_Root true');
				self.USER_MODEL.profile.Dummy_Root = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Root false');
				self.USER_MODEL.profile.Dummy_Root = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#cabbages").change(function() {
			if(this.checked) {
				console.log('Dummy_Cabbage true');
				self.USER_MODEL.profile.Dummy_Cabbage = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Cabbage false');
				self.USER_MODEL.profile.Dummy_Cabbage = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#specialities").change(function() {
			if(this.checked) {
				console.log('Dummy_Special true');
				self.USER_MODEL.profile.Dummy_Special = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Special false');
				self.USER_MODEL.profile.Dummy_Special = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#vege-ok").on('click', function() {
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
									'<td>Dummy_veggie_farm (No, Yes)</td>'+
								'</tr>'+
								'<tr>'+
									'<td>Which of these vegetables do you grow?</td>'+
									'<td>Dummy_lettuce, Dummy_fruit_vegetables, Dummy_pumpkin, Dummy_bulb, Dummy_Root, Dummy_Cabbage,Dummy_Special</td>'+
								'</tr>'+
								'<tr>'+
									'<td>How many different vegetables do you grow in total?</td>'+
									'<td>vegetables_total</td>'+
								'</tr>'+
								'<tr>'+
									'<td>On how many hectares do you grow vegetables?</td>'+
									'<td>Hectare_veggies</td>'+
								'</tr>'+
							'</tbody>'+
						'</table>'+
						*/
