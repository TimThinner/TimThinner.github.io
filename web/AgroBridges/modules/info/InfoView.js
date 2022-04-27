import View from '../common/View.js';

export default class InfoView extends View {
	
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
		
		const ll_farm_size_query = LM['translation'][sel]['farm_hectare_query'];
		const ll_deliver_months_query = LM['translation'][sel]['delivery_month_total_query'];
		const ll_quality_query = LM['translation'][sel]['quality_cert_query'];
		const ll_harvest_query = LM['translation'][sel]['harvest_query'];
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM INFO</h3>'+
						'<p><img src="./img/info.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="input-field col s10 offset-s1">'+ // s12 => s10 offset-s1
						'<h6 class="required">'+ll_farm_size_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="farm-size-slider"></div>'+
					'</div>'+
					'<div class="input-field col s10 offset-s1">'+ // s12 => s10 offset-s1
						'<h6 class="required">'+ll_deliver_months_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="deliver-months-slider"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="info-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		
		// Restore current selection:
		const farm_size = this.USER_MODEL.profile.Hectare_farm;
		const delivery_month_total = this.USER_MODEL.profile.Delivery_month_total;
		
		const farmSizeSlider = document.getElementById('farm-size-slider');
		noUiSlider.create(farmSizeSlider, {
			start: [farm_size],
			connect: 'lower',
			tooltips: [wNumb({decimals:0})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 5,  // Default 5
			keyboardMultiplier: 5,      // Default 1
			range: {
				'min': [0],
				'max': [500]
			}
		});
		farmSizeSlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.Hectare_farm = Math.round(values[0]);
				// DATABASE Update USER_MODEL
			}
		});
		
		const deliverySlider = document.getElementById('deliver-months-slider');
		noUiSlider.create(deliverySlider, {
			start: [delivery_month_total],
			connect: 'lower',
			tooltips: [wNumb({decimals:0})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 5,  // Default 5
			keyboardMultiplier: 5,      // Default 1
			range: {
				'min': [0],
				'max': [12]
			}
		});
		deliverySlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.Delivery_month_total = Math.round(values[0]);
				// DATABASE Update USER_MODEL
			}
		});
		
		$("#info-ok").on('click', function() {
			self.models['MenuModel'].setSelected('farm');
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
									'<td>How large is your farm in total?</td>'+
									'<td>Hectare_farm</td>'+
								'</tr>'+
								'<tr>'+
									'<td>How long could you deliver fresh products (months)?</td>'+
									'<td>Delivery_month_total</td>'+
								'</tr>'+
								'<tr>'+
									'<td>I am an organic farmer</td>'+
									'<td>Dummy_organic (No, Yes)</td>'+
								'</tr>'+
								'<tr>'+
									'<td>Which quality certification standards do you fulfil?</td>'+
									'<td>Cert_Min, Cert_High, Cert_uncertified</td>'+
								'</tr>'+
								'<tr>'+
									'<td>How do you handle your products after the harvest?</td>'+
									'<td>Harv_farmers_org, Harv_Clean_Sort_Ref</td>'+
								'</tr>'+
							'</tbody>'+
						'</table>'+
*/