import View from '../common/View.js';

export default class VegeView extends View {
	
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
		console.log('VegeView NOTHING to Notify!');
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = '<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM VEGETABLES</h3>'+
						'<p><img src="./img/vege.png" height="150"/></p>'+
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
						'<p>&nbsp;</p>'+
						'<button class="btn waves-effect waves-light" id="vege-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		$("#vege-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('farm');
		});
		this.rendered = true;
	}
}
