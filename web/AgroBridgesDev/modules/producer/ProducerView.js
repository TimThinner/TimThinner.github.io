import View from '../common/View.js';

export default class ProducerView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'producer-message';
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
		this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserModel' && options.method==='updateUserProfile') {
				if (options.status === 200) {
					
					$('#'+this.FELID).empty();
					// const msg = 'Feedback submitted OK';
					// Show Toast: Saved OK!
					const LM = this.controller.master.modelRepo.get('LanguageModel');
					const sel = LM.selected;
					//const save_ok = LM['translation'][sel]['PROFILE_SAVE_OK'];
					const save_ok = LM['translation'][sel]['status_profiled_save'];
					M.toast({
						displayLength:500, 
						html: save_ok,
						classes: 'teal darken-1'
					});
					
					// After 1 second go back to MAIN-page automatically.
					setTimeout(() => this.controller.models['MenuModel'].setSelected('main'), 1000);
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					// If we do not go back we must remove the "disabled" -class..
					// OR we must allow some kind of BACK-button way to solve this "stalemate".
					// $('#producer-ok').removeClass('disabled');
					
					// After 1 second go back to MAIN-page automatically.
					setTimeout(() => this.controller.models['MenuModel'].setSelected('main'), 1000);
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_self_desc_query = LM['translation'][sel]['self_desc_query'];
		const ll_likert_welcome = LM['translation'][sel]['Likert_welcome_farm'];
		const ll_likert_consumer = LM['translation'][sel]['Likert_consumer_con'];
		
		// "fully_agree": "I fully agree",
		// "agree": "I agree",
		// "do_not_know": "I do not know ",
		// "slightly_disagree": "I slightly disagree",
		// "fully_disagree": "I fully disagree",
		//const ll_likert_value_1 = LM['translation'][sel]['Self_desc_likert_value_1'];
		//const ll_likert_value_2 = LM['translation'][sel]['Self_desc_likert_value_2'];
		//const ll_likert_value_3 = LM['translation'][sel]['Self_desc_likert_value_3'];
		//const ll_likert_value_4 = LM['translation'][sel]['Self_desc_likert_value_4'];
		//const ll_likert_value_5 = LM['translation'][sel]['Self_desc_likert_value_5'];
		const ll_likert_value_1 = LM['translation'][sel]['fully_agree'];
		const ll_likert_value_2 = LM['translation'][sel]['agree'];
		const ll_likert_value_3 = LM['translation'][sel]['do_not_know'];
		const ll_likert_value_4 = LM['translation'][sel]['slightly_disagree'];
		const ll_likert_value_5 = LM['translation'][sel]['fully_disagree'];
		
		//const ll_no_database_message = LM['translation'][sel]['no_database_message'];
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">PRODUCER</h3>'+
						'<p><img src="./img/photo-farmer.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6>'+ll_self_desc_query+'</h6>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_likert_welcome+'</h6>'+
						'<p><label><input class="with-gap" name="welcomeStatus" id="welcome-1" type="radio" value="1" /><span>'+ll_likert_value_1+'</span></label></p>'+
						'<p><label><input class="with-gap" name="welcomeStatus" id="welcome-2" type="radio" value="2" /><span>'+ll_likert_value_2+'</span></label></p>'+
						'<p><label><input class="with-gap" name="welcomeStatus" id="welcome-3" type="radio" value="3" /><span>'+ll_likert_value_3+'</span></label></p>'+
						'<p><label><input class="with-gap" name="welcomeStatus" id="welcome-4" type="radio" value="4" /><span>'+ll_likert_value_4+'</span></label></p>'+
						'<p><label><input class="with-gap" name="welcomeStatus" id="welcome-5" type="radio" value="5" /><span>'+ll_likert_value_5+'</span></label></p>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_likert_consumer+'</h6>'+
						'<p><label><input class="with-gap" name="consumerStatus" id="consumer-1" type="radio" value="1" /><span>'+ll_likert_value_1+'</span></label></p>'+
						'<p><label><input class="with-gap" name="consumerStatus" id="consumer-2" type="radio" value="2" /><span>'+ll_likert_value_2+'</span></label></p>'+
						'<p><label><input class="with-gap" name="consumerStatus" id="consumer-3" type="radio" value="3" /><span>'+ll_likert_value_3+'</span></label></p>'+
						'<p><label><input class="with-gap" name="consumerStatus" id="consumer-4" type="radio" value="4" /><span>'+ll_likert_value_4+'</span></label></p>'+
						'<p><label><input class="with-gap" name="consumerStatus" id="consumer-5" type="radio" value="5" /><span>'+ll_likert_value_5+'</span></label></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1" id="'+this.FELID+'">'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="producer-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		// Restore current selection:
		// Only one of these can be true at any one time (radio buttons).
		if (typeof self.USER_MODEL.profile.Likert_welcome_farm !== 'undefined') {
			$("#welcome-"+this.USER_MODEL.profile.Likert_welcome_farm).prop("checked", true);
		}
		
		if (typeof self.USER_MODEL.profile.Likert_consumer_con !== 'undefined') {
			$("#consumer-"+this.USER_MODEL.profile.Likert_consumer_con).prop("checked", true);
		}
		
		if (typeof self.USER_MODEL.profile.Likert_consumer_con !== 'undefined' && typeof self.USER_MODEL.profile.Likert_welcome_farm !== 'undefined') {
			// OK.
		} else {
			$('#producer-ok').addClass('disabled');
		}
		
		$('input[type=radio][name=welcomeStatus]').change(function() {
			const val = parseInt(this.value);
			self.USER_MODEL.profile.Likert_welcome_farm = val;
			
			if (typeof self.USER_MODEL.profile.Likert_consumer_con !== 'undefined' && 
				typeof self.USER_MODEL.profile.Likert_welcome_farm !== 'undefined') {
				$('#producer-ok').removeClass('disabled');
			} else {
				$('#producer-ok').addClass('disabled');
			}
		});
		
		$('input[type=radio][name=consumerStatus]').change(function() {
			const val = parseInt(this.value);
			self.USER_MODEL.profile.Likert_consumer_con = val;
			
			if (typeof self.USER_MODEL.profile.Likert_consumer_con !== 'undefined' && 
				typeof self.USER_MODEL.profile.Likert_welcome_farm !== 'undefined') {
				$('#producer-ok').removeClass('disabled');
			} else {
				$('#producer-ok').addClass('disabled');
			}
		});
		
		$("#producer-ok").on('click', function() {
			
			$('#producer-ok').addClass('disabled');
			/*
			if (self.USER_MODEL.MOCKUP === false) {
				// Tell user that this might take some time...
				const html = '<div class="highlighted-message"><p>'+ll_no_database_message+'</p></div>';
				$('#'+self.FELID).empty().append(html);
			}
			*/
			// Save all
			const data = [
				{propName:'Likert_welcome_farm', value:self.USER_MODEL.profile.Likert_welcome_farm},
				{propName:'Likert_consumer_con', value:self.USER_MODEL.profile.Likert_consumer_con}
			];
			console.log(['About to save data=',data]);
			self.USER_MODEL.updateUserProfile(data);
		});
		this.rendered = true;
	}
}
