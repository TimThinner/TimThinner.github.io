import View from '../common/View.js';

export default class FlexOptionsView extends View {
	
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
		const sel = LM.selected; // 'fi' or 'en'
		const cancel = LM['translation'][sel]['CANCEL'];
		const ok = 'OK'; //LM['translation'][sel]['CANCEL'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h4>Flexibility Options</h4>'+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<p><label><input class="with-gap" name="flexStatus" id="days-30" type="radio" value="d30" /><span>30 days</span></label></p>'+
						'<p><label><input class="with-gap" name="flexStatus" id="days-40" type="radio" value="d40" /><span>40 days</span></label></p>'+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s6 center" style="margin-top:16px;margin-bottom:16px;">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000; width:120px;" id="cancel">'+cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:16px;margin-bottom:16px;">'+
						//'<button class="btn waves-effect waves-light disabled" id="ok">'+ok+
							//'<i class="material-icons">send</i>'+
						//'</button>'+
						'<button class="btn waves-effect waves-light" id="ok" style="width:120px">'+ok+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#days-30").prop("checked", true);
		
		$('input[type=radio][name=flexStatus]').change(function() {
			
			if (this.value == 'd30') {
				console.log('30 days');
				//self.controller.setNewTimerange(30);
				
			} else if (this.value == 'd40') {
				console.log('40 days');
				//self.controller.setNewTimerange(40);
			}
		});
		
		
		$("#ok").on('click', function() {
			//console.log('OK');
			self.controller.models['MenuModel'].setSelected('menu');
		});
		$("#cancel").on('click', function() {
			//console.log('cancel');
			self.controller.models['MenuModel'].setSelected('menu');
		});
	}
}
