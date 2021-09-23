import View from '../../common/View.js';
import Validator from '../../common/Validator.js';
/*
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
*/
export default class RegCodeCreateView extends View {
	constructor(controller) {
		
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'RegCodeModel' || key === 'MenuModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.serviceDates = {'start':'','end':''};
		this.FELID = 'reg-code-create-response';
		this.rendered = false;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		super.hide();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		super.remove();
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	
	randomString(length, chars) {
		let result = '';
		for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='RegCodeModel' && options.method==='addOne') {
				if (options.status === 201) {
					// RegCode added OK, show OK message and go back to RegCodeList (after 1 second delay).
					const html = '<div class="success-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					setTimeout(() => {
						this.models['MenuModel'].setSelected('REGCODES');
					}, 1000);
					
				} else {
					// Something went wrong, stay in this view (page).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
				}
			}
		}
	}
	/*
	dateToYYYYMMDDString(date) {
		var sd = "";
		if (date) {
			var number_year = date.getFullYear();
			var number_month = date.getMonth()+1;
			var number_date = date.getDate();
			
			sd += number_year.toString();
			if (number_month < 10) {
				sd += '0'+number_month.toString();
			} else {
				sd += number_month.toString();
			}
			if (number_date < 10) {
				sd += '0'+number_date.toString();
			} else {
				sd += number_date.toString();
			}
		}
		return sd;
	}*/
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
		current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;
		
		return current_datetime + timezone_standard;
	}
	*/
	changeActivePeriod(obj) {
		// obj = {'key':'start', 'value':newdt} or obj = {'key':'end', 'value':newdt}
		if (obj.key === 'start') {
			this.serviceDates.start = obj.value;
			console.log(['this.serviceDates.start=',this.serviceDates.start]);
		} else {
			this.serviceDates.end = obj.value;
			console.log(['this.serviceDates.end=',this.serviceDates.end]);
		}
	}
	
	render() {
		var self = this;
		$(this.el).empty();
		
		const UM = this.controller.master.modelRepo.get('UserModel')
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const localized_string_title = LM['translation'][sel]['ADMIN_CREATE_NEW_REGCODE_TITLE'];
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_apartment_id = LM['translation'][sel]['ADMIN_CREATE_NEW_REGCODE_APA_ID'];
		const localized_string_cancel = LM['translation'][sel]['CANCEL'];
		const localized_string_create_regcode = LM['translation'][sel]['ADMIN_CREATE_NEW_REGCODE_BTN_TXT'];
		
		const localized_string_invalid_start_date = LM['translation'][sel]['ADMIN_CREATE_NEW_REGCODE_INVALID_START_DATE'];
		const localized_string_invalid_end_date = LM['translation'][sel]['ADMIN_CREATE_NEW_REGCODE_INVALID_END_DATE'];
		const localized_string_invalid_date_order = LM['translation'][sel]['ADMIN_CREATE_NEW_REGCODE_INVALID_DATE_ORDER'];
		
		const localized_string_active_period_start = LM['translation'][sel]['ADMIN_CREATE_NEW_REGCODE_START_LABEL'];
		const localized_string_active_period_end = LM['translation'][sel]['ADMIN_CREATE_NEW_REGCODE_END_LABEL'];
		
		let display_start_datetime = '';
		let display_end_datetime = '';
		
		// Should we reset this everytime we render the FORM?
		this.serviceDates = {'start':'','end':''};
		
		
		/*
		When admin wants to edit dates, these are needed:
		if (this.serviceDates.start !== '') {
			var dt = new Date(this.serviceDates.start);
			display_start_datetime = this.dateTimeWithTimezoneOffset(dt);
		}
		if (this.serviceDates.end !== '') {
			var dt = new Date(this.serviceDates.end);
			display_end_datetime = this.dateTimeWithTimezoneOffset(dt);
		}
		*/
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'</div>'+
					'<div class="input-field col s12 m6">'+
						'<input id="regcode-email" type="email" class="validate" required="" aria-required="true" />'+
						'<label for="regcode-email">'+localized_string_user_email+'</label>'+
					'</div>'+
					'<div class="input-field col s12 m6">'+
						'<input id="regcode-apartment-id" type="text" class="validate" required="" aria-required="true" />'+
						'<label for="regcode-apartment-id">'+localized_string_apartment_id+'</label>'+
					'</div>'+
					
					'<div class="input-field col s12 m6" id="active-period-start-wrapper">'+
						'<input id="active-period-start" type="text" value="'+display_start_datetime+'">'+
						'<label class="active" for="active-period-start">'+localized_string_active_period_start+'</label>'+
					'</div>'+
					'<div class="input-field col s12 m6" id="active-period-end-wrapper">'+
						'<input id="active-period-end" type="text" value="'+display_end_datetime+'">'+
						'<label class="active" for="active-period-end">'+localized_string_active_period_end+'</label>'+
					'</div>'+
					
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+localized_string_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" id="create-regcode">'+localized_string_create_regcode+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#cancel").on('click', function() {
			
			self.models['MenuModel'].setSelected('REGCODES');
		});
		
		// https://xdsoft.net/jqplugins/datetimepicker/
		// Format MUST be: 2018-12-13 08:35:00
		// format 	Y-m-d H:i:s
		
		
		/*
			ONE RULE ONLY:
			Startdate MUST be BEFORE Enddate!
		*/
		
		$('#active-period-start').datetimepicker({
			format:'Y-m-d',
			onShow:function( ct ){
				this.setOptions({
					maxDate:$('#active-period-end').val()?$('#active-period-end').val():false
				})
			},
			timepicker:false,
			onChangeDateTime:function(dp,$input){
				self.changeActivePeriod({'key':'start', 'value':dp});
			}
		});
		$('#active-period-end').datetimepicker({
			format:'Y-m-d',
			onShow:function( ct ){
				this.setOptions({
					minDate:$('#active-period-start').val()?$('#active-period-start').val():false
				})
			},
			timepicker:false,
			onChangeDateTime:function(dp,$input){
				self.changeActivePeriod({'key':'end', 'value':dp});
			}
		});
		
		$('#create-regcode').on('click',function() {
			const _email = $('#regcode-email').val();
			const _apaid = $('#regcode-apartment-id').val();
			
			const startDate = self.serviceDates.start;	// This is a Date object!
			const endDate = self.serviceDates.end;		// This is a Date object!
			
			
			// Validate dates with moment()!
			/*const nowMoment = moment();
			nowMoment.second(0);
			nowMoment.minute(0);
			nowMoment.hour(0);
			*/
			const staMoment = moment(startDate);
			const endMoment = moment(endDate);
			//console.log(['NOW=',nowMoment.format()]);
			//console.log(['STA=',staMoment.format()]);
			//console.log(['END=',endMoment.format()]);
			
			const date_errors = [];
			if (staMoment.format() === 'Invalid date') {
				
				date_errors.push(localized_string_invalid_start_date);
				
			}
			if (endMoment.format() === 'Invalid date') {
				
				date_errors.push(localized_string_invalid_end_date);
				
			}
			/*if (endMoment.isBefore(nowMoment)) {
				date_errors.push('End must be now or in the future.');
			}*/
			if (endMoment.isSameOrBefore(staMoment)) {
				date_errors.push(localized_string_invalid_date_order);
			}
			
			const validateArray = [
				{test:"email",name:localized_string_user_email,value:_email},
				{test:"exist",name:localized_string_apartment_id,value:_apaid}
			];
			const v = new Validator({languagemodel:LM});
			const errors = v.validate(validateArray); // returns an array of errors.
			
			const all_errors = date_errors.concat(errors);
			
			if (all_errors.length > 0) {
				const localized_message = all_errors.join(' ');
				
				const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
				$('#'+self.FELID).empty().append(html);
				
				
			} else {
				const authToken = UM.token;
				// remove 0 and o, 1 and l, and q  
				const _code = self.randomString(6, '23456789abcdefghijkmnprstuvwxyz');
				const data = {
					email: _email,
					apartmentId: _apaid,
					code: _code,
					startdate: startDate,
					enddate: endDate
				};
				self.models['RegCodeModel'].addOne(data, authToken);
			}
		});
	}
}
