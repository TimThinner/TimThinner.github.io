import View from '../common/View.js';

export default class ProfileView extends View {
	
	constructor(controller) {
		
		super(controller); 
		
		/*Object.keys(this.controller.models).forEach(key => {
			if (key === 'InfluxModel') {
				this.models[key] = this.controller.models[key];
				console.log(['subscribe ',key,' with InfluxView']);
				this.models[key].subscribe(this);
			}
		});*/
		this.rendered = false;
		this.FELID = 'profile-view-failure';
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		/*Object.keys(this.models).forEach(key => {
			console.log(['UNsubscribe ',key,' with InfluxView!']);
			this.models[key].unsubscribe(this);
		});*/
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		
	}
	
	render() {
		
		$(this.el).empty();
		
		const html =
			'<div class="row">'+
				'<div class="col s12 profile-content">'+
					'<h2 style="text-align:center">PROFILE</h2>'+
					"<p>Cheese and biscuits cauliflower cheese cheesy feet. Halloumi taleggio gouda when the cheese comes out everybody's happy fromage smelly cheese fondue jarlsberg. Caerphilly macaroni cheese cheesy grin lancashire pecorino parmesan cheese triangles pecorino. Caerphilly edam taleggio jarlsberg cauliflower cheese blue castello camembert de normandie manchego. Emmental cheeseburger.</p>"+
					"<p>Boursin dolcelatte fromage. Port-salut mozzarella monterey jack melted cheese boursin bavarian bergkase port-salut camembert de normandie. Babybel port-salut mascarpone fromage blue castello pecorino cream cheese cheddar. Cheddar fromage cheesy feet.</p>"+
					"<p>Squirty cheese swiss cheeseburger. Emmental taleggio cheese on toast jarlsberg camembert de normandie fromage frais the big cheese squirty cheese. Chalk and cheese cheesecake cheddar fondue roquefort when the cheese comes out everybody's happy cheese slices cut the cheese. Cheese slices feta croque monsieur.</p>"+
					"<p>Jarlsberg fondue pepper jack. Monterey jack cheese and wine queso cream cheese fondue caerphilly rubber cheese taleggio. Smelly cheese squirty cheese fondue say cheese halloumi chalk and cheese port-salut who moved my cheese. Roquefort st. agur blue cheese monterey jack swiss when the cheese comes out everybody's happy brie melted cheese cheese on toast. Cheesecake.</p>"+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 profile-content" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		this.rendered = true;
	}
}
