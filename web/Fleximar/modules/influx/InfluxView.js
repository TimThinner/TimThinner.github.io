export default class InfluxView {
	
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.userModel = controller.master.modelRepo.get('UserModel');
		if (this.userModel) {
			this.userModel.subscribe(this);
		}
	}
	
	hide() {
		$(this.el).empty();
	}
	
	remove() {
		if (this.userModel) {
			this.userModel.unsubscribe(this);
		}
		$(this.el).empty();
	}
	
	notify(options) {
		
	}
	
	render() {
		
		$(this.el).empty();
		
		let html = '<div class="influx-content">';
		html += '<h2 style="text-align:center">MARKET INFO</h2>';
		html += "<p>Cheese and biscuits cauliflower cheese cheesy feet. Halloumi taleggio gouda when the cheese comes out everybody's happy fromage smelly cheese fondue jarlsberg. Caerphilly macaroni cheese cheesy grin lancashire pecorino parmesan cheese triangles pecorino. Caerphilly edam taleggio jarlsberg cauliflower cheese blue castello camembert de normandie manchego. Emmental cheeseburger.</p>";
		html += "<p>Boursin dolcelatte fromage. Port-salut mozzarella monterey jack melted cheese boursin bavarian bergkase port-salut camembert de normandie. Babybel port-salut mascarpone fromage blue castello pecorino cream cheese cheddar. Cheddar fromage cheesy feet.</p>";
		html += "<p>Squirty cheese swiss cheeseburger. Emmental taleggio cheese on toast jarlsberg camembert de normandie fromage frais the big cheese squirty cheese. Chalk and cheese cheesecake cheddar fondue roquefort when the cheese comes out everybody's happy cheese slices cut the cheese. Cheese slices feta croque monsieur.</p>";
		html += "<p>Jarlsberg fondue pepper jack. Monterey jack cheese and wine queso cream cheese fondue caerphilly rubber cheese taleggio. Smelly cheese squirty cheese fondue say cheese halloumi chalk and cheese port-salut who moved my cheese. Roquefort st. agur blue cheese monterey jack swiss when the cheese comes out everybody's happy brie melted cheese cheese on toast. Cheesecake.</p>";
		html += '</div>'
		$(html).appendTo(this.el);
	}
}
