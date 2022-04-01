import View from '../common/View.js';

export default class AnimalsView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
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
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = '<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM ANIMALS</h3>'+
						'<p><img src="./img/animals.png" height="150"/></p>'+
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
						'<p>&nbsp;</p>'+
						'<button class="btn waves-effect waves-light" id="location-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		$("#location-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('farm');
		});
		this.rendered = true;
	}
}
