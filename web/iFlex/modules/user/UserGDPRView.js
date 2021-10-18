import View from '../common/View.js';

export default class UserGDPRView extends View {
	
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
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_ok = LM['translation'][sel]['OK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">GDPR</h4>'+
						"<p>Babybel smelly cheese pecorino. When the cheese comes out everybody's happy cheese strings cheese on toast babybel cheese strings when the cheese comes out everybody's happy halloumi caerphilly. Caerphilly boursin fondue cheesy feet pecorino edam mozzarella cow. Manchego.</p>"+
						"<p>Fromage red leicester red leicester. Jarlsberg stinking bishop taleggio cow stinking bishop bocconcini cottage cheese chalk and cheese. Roquefort squirty cheese lancashire cut the cheese cheese strings stinking bishop roquefort squirty cheese. Goat cheese and wine halloumi jarlsberg dolcelatte cheesecake boursin caerphilly. Cottage cheese fondue cheese strings fromage.</p>"+
						"<p>Caerphilly cottage cheese taleggio. Babybel camembert de normandie red leicester mascarpone queso goat fromage squirty cheese. Cottage cheese cheesy feet cheese and wine mascarpone when the cheese comes out everybody's happy stilton cow cheese and biscuits. Hard cheese fromage frais cream cheese cheeseburger feta goat monterey jack stinking bishop. Monterey jack cream cheese.</p>"+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="input-field col s12">'+
						'<p><label><input type="checkbox" class="filled-in" id="consent-one" /><span>CONSENT ONE</span></label></p>'+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						"<p>Cheesy feet pepper jack ricotta. Cheese and biscuits cheddar red leicester cauliflower cheese ricotta lancashire paneer rubber cheese. Cheeseburger cheesy feet cheddar brie st. agur blue cheese pepper jack stinking bishop dolcelatte. Melted cheese queso pepper jack everyone loves say cheese paneer edam pepper jack. Melted cheese chalk and cheese macaroni cheese halloumi.</p>"+					
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="input-field col s12">'+
						'<p><label><input type="checkbox" class="filled-in" id="consent-two" /><span>CONSENT TWO</span></label></p>'+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						"<p>Blue castello when the cheese comes out everybody's happy fondue. Who moved my cheese say cheese croque monsieur the big cheese monterey jack fromage frais cheese strings cheesy feet. Mascarpone fondue cream cheese cheese and biscuits cheese strings cheesecake feta cheese triangles. Who moved my cheese red leicester st. agur blue cheese taleggio cheesy grin who moved my cheese croque monsieur.</p>"+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_ok+
							//'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		if (this.models['UserGDPRModel'].consent_one === true) {
			$('#consent-one').attr('checked','checked');
		}
		if (this.models['UserGDPRModel'].consent_two === true) {
			$('#consent-two').attr('checked','checked');
		}
		
		$("#consent-one").change(function() {
			 if (this.checked) {
				self.models['UserGDPRModel'].consent_one = true;
			} else {
				self.models['UserGDPRModel'].consent_one = false;
			}
		});
		
		$("#consent-two").change(function() {
			 if (this.checked) {
				self.models['UserGDPRModel'].consent_two = true;
			} else {
				self.models['UserGDPRModel'].consent_two = false;
			}
		});
		
		$("#back").on('click', function() {
			const caller = self.controller.models['UserGDPRModel'].caller;
			if (typeof caller !== 'undefined') {
				self.controller.models['MenuModel'].setSelected(caller);
			} else {
				self.controller.models['MenuModel'].setSelected('usersignup');
			}
		});
		
	}
}
