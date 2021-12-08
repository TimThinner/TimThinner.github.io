import View from '../common/View.js';

export default class DView extends View {
	
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
		
		this.feedbackRefTimeDate = undefined;
		this.feedbackRefTimeHour = undefined;
		this.feedbackRefTimeMinute = undefined;
		
		this.isFreeText = false;
		this.isSmileySelected = false;
		this.rendered = false;
		this.FELID = 'feedback-response';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		$('#refdate').datepicker('destroy');
		$('#reftime').datepicker('destroy');
		
		this.feedbackRefTimeDate = undefined;
		this.feedbackRefTimeHour = undefined;
		this.feedbackRefTimeMinute = undefined;
		
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
		
		$('#refdate').datepicker('destroy');
		$('#reftime').datepicker('destroy');
		
		this.feedbackRefTimeDate = undefined;
		this.feedbackRefTimeHour = undefined;
		this.feedbackRefTimeMinute = undefined;
		
		this.isFreeText = false;
		this.isSmileySelected = false;
		this.rendered = false;
		$(this.el).empty();
	}
	/*
	dateTimeWithTimezoneOffset(dt) {
		// See: http://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
		var timezone_offset_min = new Date().getTimezoneOffset(),
			offset_hrs = parseInt(Math.abs(timezone_offset_min/60)),
			offset_min = Math.abs(timezone_offset_min%60),
			timezone_standard;
		
		if(offset_hrs < 10)
			offset_hrs = '0' + offset_hrs;
		if(offset_min < 10)
			offset_min = '0' + offset_min;
		
		// Add an opposite sign to the offset
		// If offset is 0, it means timezone is UTC
		if(timezone_offset_min < 0)
			timezone_standard = '+' + offset_hrs + ':' + offset_min;
		else if(timezone_offset_min > 0)
			timezone_standard = '-' + offset_hrs + ':' + offset_min;
		else if(timezone_offset_min == 0)
			timezone_standard = 'Z';
		// Timezone difference in hours and minutes
		// String such as +5:30 or -6:00 or Z
		//console.log(timezone_standard);
		var current_date = dt.getDate(),
			current_month = dt.getMonth() + 1,
			current_year = dt.getFullYear(),
			current_hrs = dt.getHours(),
			current_mins = dt.getMinutes(),
			current_secs = dt.getSeconds(),
			current_datetime;
		
		// Add 0 before date, month, hrs, mins or secs if they are less than 0
		current_date = current_date < 10 ? '0' + current_date : current_date;
		current_month = current_month < 10 ? '0' + current_month : current_month;
		current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
		current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
		current_secs = current_secs < 10 ? '0' + current_secs : current_secs;
		
		// Current datetime
		// String such as 2016-07-16T19:20:30
		//current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;
		current_datetime = current_date+'.'+current_month+'.'+current_year+' '+current_hrs+':00';
		return current_datetime;// + timezone_standard;
	}
	
	changeActivePeriod(dp) {
		this.feedbackTimestamp = dp;
		console.log(['this.feedbackTimestamp=',this.feedbackTimestamp]);
	}*/
	
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
					const feedback_ok = LM['translation'][sel]['FEEDBACK_SENT_OK'];
					
					M.toast({
						displayLength:1000, 
						html: feedback_ok,
						classes: 'green darken-1'
					});
					/*
					// Now let's clear the Feedback input!
					this.resetSelectedSmiley();
					$('#submit-feedback').removeClass('teal lighten-1');
					$('#submit-feedback').addClass('disabled');
					// and reset flags.
					this.isFreeText = false;
					this.isSmileySelected = false;
					
					$('#feedback-text-placeholder').empty();
					$('#free-text').val('');
					*/
					// Return back to menu...
					setTimeout(() => {
						this.models['MenuModel'].setSelected('menu');
					}, 1000);
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const title = LM['translation'][sel]['FEEDBACK_BUILDING_TITLE'];
		const description_1 = LM['translation'][sel]['FEEDBACK_BUILDING_DESCRIPTION_1'];
		const description_2 = LM['translation'][sel]['FEEDBACK_BUILDING_DESCRIPTION_2'];
		const text_cold = LM['translation'][sel]['FEEDBACK_TEXT_COLD'];
		const text_cool = LM['translation'][sel]['FEEDBACK_TEXT_COOL'];
		const text_slightly_cool = LM['translation'][sel]['FEEDBACK_TEXT_SLIGHTLY_COOL'];
		const text_happy = LM['translation'][sel]['FEEDBACK_TEXT_HAPPY'];
		const text_slightly_warm = LM['translation'][sel]['FEEDBACK_TEXT_SLIGHTLY_WARM'];
		const text_warm = LM['translation'][sel]['FEEDBACK_TEXT_WARM'];
		const text_hot = LM['translation'][sel]['FEEDBACK_TEXT_HOT'];
		const free_text_label = LM['translation'][sel]['FEEDBACK_FREE_TEXT_LABEL'];
		const active_period_date = LM['translation'][sel]['FEEDBACK_ACTIVE_PERIOD_DATE'];
		const active_period_time = LM['translation'][sel]['FEEDBACK_ACTIVE_PERIOD_TIME'];
		const cancel = LM['translation'][sel]['CANCEL'];
		const send_feedback = LM['translation'][sel]['FEEDBACK_SEND_FEEDBACK'];
		
		//const display_start_datetime = this.dateTimeWithTimezoneOffset(new Date());
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/feedback.svg" height="80"/></p>'+
					'<p style="text-align:center;">'+description_1+'<br/>'+description_2+'</p>'+
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
						'<label for="free-text">'+free_text_label+'</label>'+
					'</div>'+
				'</div>'+
				
				'<div class="col s6 center">'+
					'<div class="input-field col s12">'+
						'<input id="refdate" type="text" class="datepicker">'+
						'<label class="active" for="refdate">'+active_period_date+'</label>'+
					'</div>'+
				'</div>'+
				'<div class="col s6 center">'+
					'<div class="input-field col s12">'+
						'<input id="reftime" type="text" class="timepicker">'+
						'<label class="active" for="reftime">'+active_period_time+'</label>'+
					'</div>'+
				'</div>'+
				
				/*
				'<div class="col s12 center">'+
					'<div class="input-field col s12">'+
						'<input id="active-period-start" type="text" value="'+display_start_datetime+'">'+
						'<label class="active" for="active-period-start">'+active_period_start+'</label>'+
					'</div>'+
				'</div>'+
				*/
				'<div class="col s6 center" style="margin-top:16px;margin-bottom:16px;">'+
					'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+cancel+'</button>'+
				'</div>'+
				'<div class="col s6 center" style="margin-top:16px;margin-bottom:16px;">'+
					'<button class="btn waves-effect waves-light disabled" id="submit-feedback">'+send_feedback+
						//'<i class="material-icons">send</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		// Initialize Picker plugins:
		$('#refdate').datepicker({
			autoClose: true,
			firstDay:1,
			maxDate: new Date(), // The latest date that can be selected.
			defaultDate: new Date(), // The initial date to view when first opened.
			setDefaultDate: true,
			format: 'dddd dd.mm.yyyy',
			i18n: {
				cancel:'Cancel',
				clear:'Clear',
				done:'Ok',
				months:['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
				monthsShort:['Tammi','Helmi','Maalis','Huhti','Touko','Kesä','Heinä','Elo','Syys','Loka','Marras','Joulu'],
				weekdays:['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'],
				weekdaysShort:['Su','Ma','Ti','Ke','To','Pe','La'],
				weekdaysAbbrev:['Su','Ma','Ti','Ke','To','Pe','La']
			},
			onSelect: function(date){
				self.feedbackRefTimeDate = date;
				
				
				// NOTE: self.feedbackRefTimeDate is now just a Date object with local timezone:
				// and when it is converted in DATABASE to Zulu-timezone it will be actually 
				// two hours before midnight (=yesterday)!!!
				
				// Date Tue Dec 07 2021 00:00:00 GMT+0200 (Eastern European Standard Time) => 
				// "refTime" : ISODate("2021-12-06T22:00:00Z")
			}
		});
		
		// Initialize Picker plugins:
		$('#reftime').timepicker({
			autoClose: true,
			twelveHour: false,
			onSelect: function(hour, minute){
				self.feedbackRefTimeHour = hour;
				self.feedbackRefTimeMinute = minute;
			}
		});
		
		$("#cancel").on('click', function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
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
		/*
		$('#active-period-start').datetimepicker({
			format:'Y-m-d H:00',
			//format:'Y-m-d',
			onShow:function( ct ){
				this.setOptions({
					maxDate: 0, // today
					maxTime: 0 // this hour
				})
			},
			//timepicker:false,
			onChangeDateTime:function(dp,$input){
				self.changeActivePeriod(dp);
			}
		});
		*/
		
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
						$('#feedback-text-placeholder').empty().append(text_cold);
					} else if (i===2) {
						$('#feedback-text-placeholder').empty().append(text_cool);
					} else if (i===3) {
						$('#feedback-text-placeholder').empty().append(text_slightly_cool);
					} else if (i===4) {
						$('#feedback-text-placeholder').empty().append(text_happy);
					} else if (i===5) {
						$('#feedback-text-placeholder').empty().append(text_slightly_warm);
					} else if (i===6) {
						$('#feedback-text-placeholder').empty().append(text_warm);
					} else {
						$('#feedback-text-placeholder').empty().append(text_hot);
					}
				}
			});
		}
		
		$('#submit-feedback').on('click',function() {
			
			$('#submit-feedback').addClass('disabled');
			
			let refTime = self.feedbackRefTimeDate;
			if (typeof refTime === 'undefined') {
				refTime = moment().toDate(); // Now!
			} else {
				// Date is already set, add hour and minute values set by timepicker:
				refTime.setHours(self.feedbackRefTimeHour, self.feedbackRefTimeMinute);
			}
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
					feedbackType: 'Building',
					refTime: refTime,
					feedback: selected,
					feedbackText: ft
				}
				self.FBM.send(data, UM.token); // see notify for the response...
			}
		});
		
		this.rendered = true;
	}
}
