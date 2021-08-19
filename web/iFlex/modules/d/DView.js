import View from '../common/View.js';

export default class DView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'DModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
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
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	/*
		Use class "selected" to reduce processing.
	*/
	resetSelectedSmiley() {
		for (let i=1; i<8; i++) {
			if ($('#fb-smiley-'+i).hasClass('selected')) {
				$('#fb-smiley-'+i).removeClass('selected');
				$('#fb-smiley-'+i+' > img').attr('src','./svg/smiley-'+i+'.svg');
			}
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				this.render();
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>Building feedback</h4>'+
					'<p style="text-align:center;"><img src="./svg/feedback.svg" height="80"/></p>'+
//'<p>Stinking bishop macaroni cheese boursin. Who moved my cheese macaroni cheese queso cheese and wine cheese and biscuits the big cheese airedale gouda. Cheesy grin fondue stilton roquefort danish fontina cheeseburger mascarpone paneer. The big cheese cheese slices squirty cheese hard cheese cottage cheese.</p>'+
//'<p>Gouda cheese and biscuits cheesecake. Emmental taleggio cauliflower cheese cheesy grin mascarpone who moved my cheese parmesan croque monsieur. Cheese strings port-salut halloumi babybel mascarpone cheese and wine blue castello cheddar. Monterey jack cottage cheese monterey jack fromage cheese slices monterey jack blue castello cheddar. Queso.</p>'+
//'<p>Cheese and biscuits pecorino cheesy grin. Ricotta cheese and wine pecorino fromage feta gouda cauliflower cheese parmesan. Cheddar caerphilly fondue camembert de normandie st. agur blue cheese st. agur blue cheese st. agur blue cheese ricotta. Cheese and biscuits cheese and wine monterey jack cottage cheese caerphilly stilton goat halloumi. Swiss.</p>'+
//'<p>Blue castello cheese and biscuits say cheese. Melted cheese mozzarella bavarian bergkase pecorino taleggio lancashire cheddar stilton. Cheeseburger stilton cheese on toast blue castello fondue squirty cheese mascarpone cheese strings. Pepper jack mascarpone bocconcini.</p>'+
//"<p>When the cheese comes out everybody's happy cheesy feet edam. Monterey jack cheesecake pecorino cheese strings cheese and wine croque monsieur danish fontina queso. Port-salut cheesy feet jarlsberg bavarian bergkase the big cheese paneer cheese slices cut the cheese. Emmental who moved my cheese lancashire cow roquefort stilton.</p>"+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<p style="text-align:center;">Give feedback: how do you feel about the apartment temperature today? Select smiley and send feedback.</p>'+
					'<a href="javascript:void(0);" id="fb-smiley-1" class="feedback-smiley"><img src="./svg/smiley-1.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-2" class="feedback-smiley"><img src="./svg/smiley-2.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-3" class="feedback-smiley"><img src="./svg/smiley-3.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-4" class="feedback-smiley"><img src="./svg/smiley-4.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-5" class="feedback-smiley"><img src="./svg/smiley-5.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-6" class="feedback-smiley"><img src="./svg/smiley-6.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-7" class="feedback-smiley"><img src="./svg/smiley-7.svg" height="50"/></a>'+
				'</div>'+
				'<div class="col s12 center" style="margin-top:16px;margin-bottom:16px;">'+
					'<button class="btn waves-effect waves-light disabled" id="submit-feedback">SEND FEEDBACK'+
						//'<i class="material-icons">send</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="back">BACK</button>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$("#back").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		
		// Smileys act like radio buttons, only one can be selected at any one time.
		// The last selection is shown. Can user just de-select?
		for (let i=1; i<8; i++) {
			$('#fb-smiley-'+i).on('click',function() {
				// If this smiley was already "selected" => de-select it and disable submit-feedback -button.
				if ($('#fb-smiley-'+i).hasClass('selected')) {
					$('#fb-smiley-'+i).removeClass('selected');
					$('#fb-smiley-'+i+' > img').attr('src','./svg/smiley-'+i+'.svg');
					$('#submit-feedback').removeClass('teal lighten-1');
					$('#submit-feedback').addClass('disabled');
					
				} else {
					self.resetSelectedSmiley();
					$('#fb-smiley-'+i).addClass('selected');
					$('#fb-smiley-'+i+' > img').attr('src','./svg/smiley-'+i+'-frame.svg');
					$('#submit-feedback').removeClass('disabled');
					$('#submit-feedback').addClass('teal lighten-1');
				}
			});
		}
		
		
		
		this.rendered = true;
	}
}
