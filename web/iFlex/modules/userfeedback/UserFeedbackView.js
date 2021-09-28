import View from '../common/View.js';

export default class UserFeedbackView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
			
		});
		// NOTE: Do NOT use ResizeEventObserver, this is not SVG BASED VIEW!
		//this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		//this.REO.subscribe(this);
		
		this.FBM = this.controller.master.modelRepo.get('FeedbackModel');
		this.FBM.subscribe(this);
		
		this.isFreeText = false;
		this.isSmileySelected = false;
		this.rendered = false;
		this.FELID = 'feedback-response';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.isFreeText = false;
		this.isSmileySelected = false;
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		//this.REO.unsubscribe(this);
		this.FBM.unsubscribe(this);
		
		this.isFreeText = false;
		this.isSmileySelected = false;
		this.rendered = false;
		$(this.el).empty();
	}
	
	submitState() {
		if (this.isSmileySelected || this.isFreeText) {
			$('#submit-feedback').removeClass('disabled');
			$('#submit-feedback').addClass('teal lighten-1');
		} else {
			$('#submit-feedback').removeClass('teal lighten-1');
			$('#submit-feedback').addClass('disabled');
		}
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
			if (options.model==='FeedbackModel' && options.method==='send') {
				if (options.status === 200) {
					
					$('#'+this.FELID).empty();
					// const msg = 'Feedback submitted OK';
					// Show Toast: Saved OK!
					const LM = this.controller.master.modelRepo.get('LanguageModel');
					const sel = LM.selected;
					const localized_string_feedback_ok = LM['translation'][sel]['FEEDBACK_SENT_OK'];
					
					M.toast({
						displayLength:1000, 
						html: localized_string_feedback_ok,
						classes: 'green darken-1'
					});
					// Now let's clear the Feedback input!
					this.resetSelectedSmiley();
					$('#submit-feedback').removeClass('teal lighten-1');
					$('#submit-feedback').addClass('disabled');
					// and reset flags.
					this.isFreeText = false;
					this.isSmileySelected = false;
					
					$('#feedback-text-placeholder').empty();
					$('#free-text').val('');
				} else {
					// Report error.
					if (options.status === 401) {
						// This status code must be caught and wired to controller forceLogout() action.
						// Force LOGOUT if Auth failed!
						// Call View-class method to handle error.
						this.forceLogout(this.FELID);
					} else {
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$('#'+this.FELID).empty().append(html);
					}
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_feedback_title = LM['translation'][sel]['FEEDBACK_APARTMENT_TITLE'];
		const localized_string_feedback_description = LM['translation'][sel]['FEEDBACK_APARTMENT_DESCRIPTION'];
		const localized_string_feedback_text_cold = LM['translation'][sel]['FEEDBACK_TEXT_COLD'];
		const localized_string_feedback_text_cool = LM['translation'][sel]['FEEDBACK_TEXT_COOL'];
		const localized_string_feedback_text_slightly_cool = LM['translation'][sel]['FEEDBACK_TEXT_SLIGHTLY_COOL'];
		const localized_string_feedback_text_happy = LM['translation'][sel]['FEEDBACK_TEXT_HAPPY'];
		const localized_string_feedback_text_slightly_warm = LM['translation'][sel]['FEEDBACK_TEXT_SLIGHTLY_WARM'];
		const localized_string_feedback_text_warm = LM['translation'][sel]['FEEDBACK_TEXT_WARM'];
		const localized_string_feedback_text_hot = LM['translation'][sel]['FEEDBACK_TEXT_HOT'];
		const localized_string_feedback_free_text_label = LM['translation'][sel]['FEEDBACK_FREE_TEXT_LABEL'];
		const localized_string_back = LM['translation'][sel]['BACK'];
		const localized_string_send_feedback = LM['translation'][sel]['FEEDBACK_SEND_FEEDBACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_feedback_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/feedback.svg" height="80"/></p>'+
					'<p style="text-align:center;">'+localized_string_feedback_description+'</p>'+
					'<a href="javascript:void(0);" id="fb-smiley-1" class="feedback-smiley"><img src="./svg/smiley-1.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-2" class="feedback-smiley"><img src="./svg/smiley-2.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-3" class="feedback-smiley"><img src="./svg/smiley-3.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-4" class="feedback-smiley"><img src="./svg/smiley-4.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-5" class="feedback-smiley"><img src="./svg/smiley-5.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-6" class="feedback-smiley"><img src="./svg/smiley-6.svg" height="50"/></a>'+
					'<a href="javascript:void(0);" id="fb-smiley-7" class="feedback-smiley"><img src="./svg/smiley-7.svg" height="50"/></a>'+
				'</div>'+
				'<div class="col s12 center">'+
					'<p class="feedback-text" id="feedback-text-placeholder"></p>'+
				'</div>'+
				'<div class="col s12 center">'+
					'<div class="input-field col s12">'+
						'<textarea id="free-text" class="materialize-textarea"></textarea>'+
						'<label for="free-text">'+localized_string_feedback_free_text_label+'</label>'+
					'</div>'+
				'</div>'+
				'<div class="col s6 center" style="margin-top:16px;margin-bottom:16px;">'+
					'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="back">'+localized_string_back+'</button>'+
				'</div>'+
				'<div class="col s6 center" style="margin-top:16px;margin-bottom:16px;">'+
					'<button class="btn waves-effect waves-light disabled" id="submit-feedback">'+localized_string_send_feedback+
						//'<i class="material-icons">send</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$('#free-text').on('keyup', function(){
			const v = $('#free-text').val();
			//console.log(['free-text changed v=',v]);
			if (v.length > 0) {
				self.isFreeText = true;
			} else {
				self.isFreeText = false;
			}
			self.submitState();
		});
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('USERPAGE');
		});
		
		// Smileys act like radio buttons, only one can be selected at any one time.
		// The last selection is shown. Can user just de-select?
		for (let i=1; i<8; i++) {
			$('#fb-smiley-'+i).on('click',function() {
				// If this smiley was already "selected" => de-select it and disable submit-feedback -button.
				if ($('#fb-smiley-'+i).hasClass('selected')) {
					$('#fb-smiley-'+i).removeClass('selected');
					$('#fb-smiley-'+i+' > img').attr('src','./svg/smiley-'+i+'.svg');
					
					self.isSmileySelected = false;
					self.submitState();
					$('#feedback-text-placeholder').empty();
					
				} else {
					self.resetSelectedSmiley();
					$('#fb-smiley-'+i).addClass('selected');
					$('#fb-smiley-'+i+' > img').attr('src','./svg/smiley-'+i+'-frame.svg');
					self.isSmileySelected = true;
					self.submitState();
					
					if (i===1) {
						$('#feedback-text-placeholder').empty().append(localized_string_feedback_text_cold);
					} else if (i===2) {
						$('#feedback-text-placeholder').empty().append(localized_string_feedback_text_cool);
					} else if (i===3) {
						$('#feedback-text-placeholder').empty().append(localized_string_feedback_text_slightly_cool);
					} else if (i===4) {
						$('#feedback-text-placeholder').empty().append(localized_string_feedback_text_happy);
					} else if (i===5) {
						$('#feedback-text-placeholder').empty().append(localized_string_feedback_text_slightly_warm);
					} else if (i===6) {
						$('#feedback-text-placeholder').empty().append(localized_string_feedback_text_warm);
					} else {
						$('#feedback-text-placeholder').empty().append(localized_string_feedback_text_hot);
					}
				}
			});
		}
		
		$('#submit-feedback').on('click',function() {
			const ft = $('#free-text').val();
			let selected = -1;
			for (let i=1; i<8; i++) {
				if ($('#fb-smiley-'+i).hasClass('selected')) {
					selected = i;
				}
			}
			// FeedbackModel send (data, token) 
			const UM = self.controller.master.modelRepo.get('UserModel');
			if (UM) {
				console.log(['Sending Feedback ',selected]);
				const data = {
					refToUser: UM.id, // UserModel id
					feedbackType: 'Apartment',
					feedback: selected,
					feedbackText: ft
				}
				self.FBM.send(data, UM.token); // see notify for the response...
			}
		});
		
		this.rendered = true;
	}
}
