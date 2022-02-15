import View from '../../common/View.js';
/*
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
*/
export default class RegCodeEditView extends View {
	constructor(controller) {
		
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'RegCodeModel' || key === 'MenuModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.serviceDates = {'start':'','end':''};
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
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='RegCodeModel' && options.method==='updateOne') {
				
				const context = this.models['RegCodeModel'].getContext();
				const caller = context.caller;
				
				$('#failed').empty();
				$('#success').empty();
				if (options.status === 200) {
					// RegCode added OK, show OK message and go back to RegCodeList (after 1 second delay).
					const html = '<div class="success-message"><p>'+options.message+'</p></div>';
					$(html).appendTo('#success');
					setTimeout(() => {
						this.models['MenuModel'].setSelected(caller);
					}, 1000);
					
				} else {
					// Something went wrong, stay in this view (page).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$(html).appendTo('#failed');
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
		
		const localized_string_title = 'RegCode';
		const localized_string_description = 'Modify RegCodes validity period.';
		const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
		const localized_string_apartment_id = 'Apartment Id';
		const localized_string_da_cancel = LM['translation'][sel]['DA_CANCEL'];
		const localized_string_update_regcode = 'Update RegCode';
		
		
		const localized_string_active_period_start = 'Start';
		const localized_string_active_period_end = 'End';
		let display_start_datetime = '';
		let display_end_datetime = '';
		
		
		console.log(['this.models[RegCodeModel]=',this.models['RegCodeModel']]);
		
		// Should we reset this everytime we render the FORM?
		//this.serviceDates = {'start':'','end':''};
		const context = this.models['RegCodeModel'].getContext();
		const sid = context.id;
		const caller = context.caller;
		let email = '';
		let apaId = '';
		this.models['RegCodeModel'].regcodes.forEach(code => {
			if (code._id === sid) {
				email = code.email;
				apaId = code.apartmentId;
				this.serviceDates.start = code.startdate;
				this.serviceDates.end = code.enddate;
			}
		});
		/*
			_id: doc._id,
			email: doc.email,
			apartmentId: doc.apartmentId,
			code: doc.code,
			startdate: doc.startdate,     "2020-09-22T21:00:00.000Z"
			enddate: doc.enddate          "2020-10-22T21:00:00.000Z"
		*/
		//When admin wants to edit dates, these are needed:
		if (this.serviceDates.start !== '') {
			var dt = new Date(this.serviceDates.start);
			display_start_datetime = this.dateTimeWithTimezoneOffset(dt);
		}
		
		if (this.serviceDates.end !== '') {
			var dt = new Date(this.serviceDates.end);
			display_end_datetime = this.dateTimeWithTimezoneOffset(dt);
		}
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
					/*
					'<div class="input-field col s12 m6">'+
						'<input id="regcode-email" type="email" class="validate" required="" aria-required="true" />'+
						'<label for="regcode-email">'+localized_string_user_email+'</label>'+
					'</div>'+
					'<div class="input-field col s12 m6">'+
						'<input id="regcode-apartment-id" type="text" class="validate" required="" aria-required="true" />'+
						'<label for="regcode-apartment-id">'+localized_string_apartment_id+'</label>'+
					'</div>'+
					*/
					'<div class="col s12 m6">'+
						'<p>'+email+'</p>'+
					'</div>'+
					'<div class="col s12 m6">'+
						'<p>'+apaId+'</p>'+
					'</div>'+
					
					'<div class="input-field col s12 m6" id="active-period-start-wrapper">'+
						'<input id="active-period-start" type="text" value="'+display_start_datetime+'">'+
						'<label class="active" for="active-period-start">'+localized_string_active_period_start+'</label>'+
					'</div>'+
					'<div class="input-field col s12 m6" id="active-period-end-wrapper">'+
						'<input id="active-period-end" type="text" value="'+display_end_datetime+'">'+
						'<label class="active" for="active-period-end">'+localized_string_active_period_end+'</label>'+
					'</div>'+
					
					'<div class="col s12 center" id="failed"></div>'+
					'<div class="col s12 center" id="success"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+localized_string_da_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" id="update-regcode">'+localized_string_update_regcode+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#cancel").on('click', function() {
			console.log(['CANCEL caller=',caller]);
			self.models['MenuModel'].setSelected(caller);
		});
		
		// https://xdsoft.net/jqplugins/datetimepicker/
		// Format MUST be: 2018-12-13 08:35:00
		// format 	Y-m-d H:i:s
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
		
		$('#update-regcode').on('click',function() {
			const startdate = self.serviceDates.start;	// This is a Date object!
			const enddate = self.serviceDates.end;		// This is a Date object!
			
			// Validate dates with moment()!
			/*const nowMoment = moment();
			nowMoment.second(0);
			nowMoment.minute(0);
			nowMoment.hour(0);
			*/
			const staMoment = moment(startdate);
			const endMoment = moment(enddate);
			//console.log(['NOW=',nowMoment.format()]);
			//console.log(['STA=',staMoment.format()]);
			//console.log(['END=',endMoment.format()]);
			
			const date_errors = [];
			if (staMoment.format() === 'Invalid date') {
				date_errors.push('Invalid start date');
			}
			if (endMoment.format() === 'Invalid date') {
				date_errors.push('Invalid end date');
			}
			/*if (endMoment.isBefore(nowMoment)) {
				date_errors.push('End must be now or in the future.');
			}*/
			if (endMoment.isSameOrBefore(staMoment)) {
				date_errors.push('End must be after the start.');
			}
			
			if (date_errors.length > 0) {
				const localized_message = date_errors.join(' ');
				$('#failed').empty();
				const html = '<div class="error-message"><p>'+localized_message+'</p></div>';
				$(html).appendTo('#failed');
				
			} else {
				const authToken = UM.token;
				const data = [
					{propName:'startdate', value:startdate},
					{propName:'enddate', value:enddate}
				];
				self.models['RegCodeModel'].updateOne(sid, data, authToken);
			}
		});
	}
}
