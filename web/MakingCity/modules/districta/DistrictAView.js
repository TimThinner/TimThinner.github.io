/*

*/
export default class DistrictAView {
	
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.model = controller.master.modelRepo.get('DistrictAModel');
	}
	
	hide() {
		$(this.el).empty();
	}
	
	remove() {
		$(this.el).empty();
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.model.ready) {
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h3>DISTRICT A</h3>'+
						"<p>Lancashire babybel melted cheese. Cheesy feet airedale feta pepper jack cheesy feet cheese triangles cheese on toast mozzarella. Edam babybel dolcelatte brie everyone loves fromage gouda cheesy grin. Bocconcini pecorino blue castello bavarian bergkase when the cheese comes out everybody's happy fromage frais cheeseburger fromage frais. Stinking bishop mascarpone st. agur blue cheese queso.</p>"+
						'<p>Swiss fondue the big cheese. Cauliflower cheese red leicester swiss fondue smelly cheese cheese and biscuits cream cheese lancashire. Cauliflower cheese camembert de normandie croque monsieur goat boursin caerphilly taleggio cauliflower cheese. Emmental edam cheesy feet squirty cheese stinking bishop swiss smelly cheese the big cheese. Everyone loves fromage frais.</p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
					'</div>'+
				'</div>';
			$(html).appendTo(this.el);
			$('#back').on('click',function() {
				self.controller.menuModel.setSelected('menu');
			});
		}
	}
}
