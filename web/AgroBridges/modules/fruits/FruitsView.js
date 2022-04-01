import View from '../common/View.js';

export default class FruitsView extends View {
	
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
						'<h3 style="color:'+color+'">FARM FRUITS</h3>'+
						'<p><img src="./img/fruits.png" height="150"/></p>'+
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
