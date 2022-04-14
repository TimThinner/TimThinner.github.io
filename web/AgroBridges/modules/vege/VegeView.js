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
		console.log('VegeView NOTHING to Notify!');
	}
	/*
	handleRangeChange(id) {
		$("#"+id).val(0);
		$("#"+id+"-count").empty().append('0');
		
		$("#"+id).change(function() {
			const val = $(this).val(); // "20"
			const vali = parseInt(val, 10);
			if (vali > 0) {
				$("#"+id+"-count").empty().append(val);
			} else {
				$("#"+id+"-count").empty().append('0');
			}
		});
	}
	*/
	
	
	
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
	
	render() {
		const self = this;
		$(this.el).empty();
		
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
						'<h6>Are you offering these products?</h6>'+
						'<p><label><input class="with-gap" name="vegeStatus" id="vege-no" type="radio" value="no" /><span>No</span></label></p>'+
						'<p><label><input class="with-gap" name="vegeStatus" id="vege-yes" type="radio" value="yes" /><span>Yes</span></label></p>'+
						/*'<label for="vegeStatus" class="toggle-switchy">'+
							'<input checked type="checkbox" id="vegeStatus">'+
							'<span class="toggle">'+
								'<span class="switch"></span>'+
							'</span>'+
						'</label>'+
						*/
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6>Which of these vegetables do you grow?</h6>'+
						'<p><label><input type="checkbox" class="filled-in" id="lettuce" /><span>Lettuce (Cut lettuce, Argula, Spinach, Swiss chard, Endivie...)</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="fruitlike" /><span>Fruitlike vegetables (Tomatoes, Peppers, Eggplant...)</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="pumpkins" /><span>Pumpkins and Courgettes</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="bulb" /><span>Bulb vegetables (Celeric and Fennel)</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="root" /><span>Root vegetables and Onions (Potatos, Carrots, Parsnip, Root Parsley, Black Salsify...)</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="cabbages" /><span>Cabbages (Broccoli, Kohlrabi, red and white cabbage...)</span></label></p>'+
						'<p><label><input type="checkbox" class="filled-in" id="specialities" /><span>Specialities (Asparagus, Olives, Truffel....)</span></label></p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6>How many different vegetables do you grow in total?</h6>'+
						'<p>&nbsp;</p>'+
						//'<p style="font-size:20px;text-align:center;color:#555;" id="vegetables-total-count">0</p>'+
						'<div id="vegetables-total-slider"></div>'+
						//'<p class="range-field">'+
						//	'<input type="range" id="vegetables-total" min="0" max="20"><span class="thumb"><span class="value"></span></span>'+
						//'</p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<h6>On how many hectares do you grow vegetables?</h6>'+
						'<p>&nbsp;</p>'+
						//'<p style="font-size:20px;text-align:center;color:#555;" id="Hectare-veggies-count">0</p>'+
						'<div id="Hectare-veggies-slider"></div>'+
						//'<p class="range-field">'+
						//	'<input type="range" id="Hectare-veggies" min="0" max="500"><span class="thumb"><span class="value"></span></span>'+
						//'</p>'+
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
		
		const vegeTotalSlider = document.getElementById('vegetables-total-slider');
		noUiSlider.create(vegeTotalSlider, {
			start: [0],
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
				self.USER_MODEL.vegetables_total = Math.round(values[0]);
				// DATABASE Update USER_MODEL
			}
		});
		
		const hectareSlider = document.getElementById('Hectare-veggies-slider');
		noUiSlider.create(hectareSlider, {
			start: [0],
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
				self.USER_MODEL.Hectare_veggies = Math.round(values[0]);
				// DATABASE Update USER_MODEL
			}
		});
		
		$('input[type=radio][name=vegeStatus]').change(function() {
			if (this.value == 'no') {
				console.log('Dummy_veggie_farm No'); // Dummy_veggie_farm NO
				self.USER_MODEL.Dummy_veggie_farm = 'No';
				// DATABASE Update USER_MODEL
				
			} else if (this.value == 'yes') {
				console.log('Dummy_veggie_farm Yes');
				self.USER_MODEL.Dummy_veggie_farm = 'Yes';
				// DATABASE Update USER_MODEL
			}
		});
		
		$("#lettuce").change(function() {
			if(this.checked) {
				console.log('Dummy_lettuce true');
				self.USER_MODEL.Dummy_lettuce = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_lettuce false');
				self.USER_MODEL.Dummy_lettuce = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#fruitlike").change(function() {
			if(this.checked) {
				console.log('Dummy_fruit_vegetables true');
				self.USER_MODEL.Dummy_fruit_vegetables = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_fruit_vegetables false');
				self.USER_MODEL.Dummy_fruit_vegetables = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#pumpkins").change(function() {
			if(this.checked) {
				console.log('Dummy_pumpkin true');
				self.USER_MODEL.Dummy_pumpkin = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_pumpkin false');
				self.USER_MODEL.Dummy_pumpkin = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#bulb").change(function() {
			if(this.checked) {
				console.log('Dummy_bulb true');
				self.USER_MODEL.Dummy_bulb = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_bulb false');
				self.USER_MODEL.Dummy_bulb = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#root").change(function() {
			if(this.checked) {
				console.log('Dummy_Root true');
				self.USER_MODEL.Dummy_Root = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Root false');
				self.USER_MODEL.Dummy_Root = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#cabbages").change(function() {
			if(this.checked) {
				console.log('Dummy_Cabbage true');
				self.USER_MODEL.Dummy_Cabbage = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Cabbage false');
				self.USER_MODEL.Dummy_Cabbage = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#specialities").change(function() {
			if(this.checked) {
				console.log('Dummy_Special true');
				self.USER_MODEL.Dummy_Special = true;
				// DATABASE Update USER_MODEL
				
			} else {
				console.log('Dummy_Special false');
				self.USER_MODEL.Dummy_Special = false;
				// DATABASE Update USER_MODEL
				
			}
		});
		
		$("#vege-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('farm');
		});
		this.rendered = true;
	}
}
