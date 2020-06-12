import View from '../common/View.js';

export default class InfoView extends View {
	
	constructor(controller) {
		super(controller);
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
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		
	}
	
	render() {
		$(this.el).empty();
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">Info View</h4>'+
					"<p>Croque monsieur cheese and wine red leicester. Say cheese cheesecake cheese on toast cut the cheese cream cheese danish fontina who moved my cheese parmesan. Hard cheese who moved my cheese cheddar monterey jack say cheese caerphilly the big cheese cheese triangles. Stilton cheese and biscuits cut the cheese cut the cheese paneer stinking bishop blue castello mascarpone. Camembert de normandie cream cheese bocconcini.</p>"+
					"<p>Cow cow cheese slices. Croque monsieur caerphilly cheesecake cheeseburger bavarian bergkase emmental emmental paneer. Halloumi fondue st. agur blue cheese mascarpone stinking bishop goat manchego when the cheese comes out everybody's happy. Goat chalk and cheese swiss.</p>"+
					"<p>Halloumi roquefort stinking bishop. Smelly cheese cheese strings jarlsberg cottage cheese the big cheese boursin mascarpone gouda. Manchego macaroni cheese airedale feta caerphilly port-salut goat babybel. Cheesy grin cream cheese hard cheese airedale airedale cheesy feet pecorino cottage cheese. Melted cheese cream cheese.</p>"+
					'<p>&nbsp;</p>'+
					'<p>&nbsp;</p>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		this.rendered = true;
	}
}
