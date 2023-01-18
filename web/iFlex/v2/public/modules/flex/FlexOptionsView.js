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
		const s_title = LM['translation'][sel]['FLEXIBILITY_OPTIONS_TITLE'];
		const s_descr = LM['translation'][sel]['FLEXIBILITY_OPTIONS_DESCRIPTION'];
		const s_days =  LM['translation'][sel]['BUILDING_SAVINGS_DAYS'];
		const s_cancel = LM['translation'][sel]['CANCEL'];
		const s_ok = LM['translation'][sel]['OK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h4>'+s_title+'</h4>'+
						'<p>'+s_descr+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<p><label><input class="with-gap" name="flexStatus" id="days-30" type="radio" value="30" /><span>30 '+s_days+'</span></label></p>'+
						'<p><label><input class="with-gap" name="flexStatus" id="days-40" type="radio" value="40" /><span>40 '+s_days+'</span></label></p>'+
						'<p><label><input class="with-gap" name="flexStatus" id="days-50" type="radio" value="50" /><span>50 '+s_days+'</span></label></p>'+
						'<p><label><input class="with-gap" name="flexStatus" id="days-60" type="radio" value="60" /><span>60 '+s_days+'</span></label></p>'+
					'</div>'+
				'</div>'+
				'<div class="col s12">'+
					'<div class="col s6 center" style="margin-top:16px;margin-bottom:16px;">'+
						'<button class="btn waves-effect waves-light grey lighten-2 iflex-button" style="color:#000;" id="cancel">'+s_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:16px;margin-bottom:16px;">'+
						'<button class="btn waves-effect waves-light iflex-button" id="ok">'+s_ok+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		if (this.models['FlexResultModel'].numberOfDays === 30) {
			$("#days-30").prop("checked", true);
			
		} else if (this.models['FlexResultModel'].numberOfDays === 40) {
			$("#days-40").prop("checked", true);
			
		} else if (this.models['FlexResultModel'].numberOfDays === 50) {
			$("#days-50").prop("checked", true);
			
		} else {
			$("#days-60").prop("checked", true);
		}
		
		$("#ok").on('click', function() {
			//console.log('OK');
			const val = $('input[name="flexStatus"]:checked').val()
			const ival = parseInt(val);
			self.models['FlexResultModel'].numberOfDays = ival;
			self.controller.models['MenuModel'].setSelected('menu');
		});
		$("#cancel").on('click', function() {
			self.controller.models['MenuModel'].setSelected('menu');
		});
	}
}
