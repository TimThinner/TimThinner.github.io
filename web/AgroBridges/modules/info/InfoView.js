import View from '../common/View.js';

export default class InfoView extends View {
	
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
						'<h3 style="color:'+color+'">FARM INFO</h3>'+
						'<p><img src="./img/info.png" height="150"/></p>'+
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
