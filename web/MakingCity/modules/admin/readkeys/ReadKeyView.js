/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../../common/View.js';

export default class ReadKeyView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'ReadKeyModel' || key === 'MenuModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.rendered = false;
		this.FELID = 'view-failure';
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
	
	showReadKeys() {
		const self = this;
		//console.log('UPDATE !!!!!!');
		$('#readkeys-table').empty();
		
		
		if (typeof this.models['ReadKeyModel'].readkeys !== 'undefined') {
			
			this.models['ReadKeyModel'].readkeys.forEach(key => {
				const id = key._id;
				const title = '<a href="javascript:void(0);" id="edit-readkey-'+id+'">'+id+'</a>';
				const startDateStringLocalTZ = this.dateTimeWithTimezoneOffset(new Date(key.startdate));
				const endDateStringLocalTZ = this.dateTimeWithTimezoneOffset(new Date(key.enddate));
				/*
					_id: doc._id,
					startdate: doc.startdate,     "2020-09-22T21:00:00.000Z"
					enddate: doc.enddate          "2020-10-22T21:00:00.000Z"
				*/
				//console.log(['key._id=',id]);
				const html = '<tr class="readkey-item">'+
					'<td>'+title+'</td>'+
					'<td>'+startDateStringLocalTZ+'</td>'+
					'<td>'+endDateStringLocalTZ+'</td></tr>';
				
				$(html).appendTo("#readkeys-table");
				$('#edit-readkey-'+id).on('click', function(){
					self.models['ReadKeyModel'].selected = {'id':id,'caller':'READKEYS'};
					self.models['MenuModel'].setSelected('READKEYEDIT');
				});
			});
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ReadKeyModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('ReadKeyView => ReadKeyModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.showReadKeys();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const UM = this.controller.master.modelRepo.get('UserModel')
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			//const localized_string_title = LM['translation'][sel]['USER_ELECTRICITY_TITLE'];
			//const localized_string_description = LM['translation'][sel]['USER_ELECTRICITY_DESCRIPTION'];
			
			const localized_string_title = 'ReadKeys';
			const localized_string_description = 'Admin can list all ReadKeys and edit dates.';
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					this.forceLogout(this.FELID);
				}
				
			} else {
				const html =
					'<div class="row">'+
						'<div class="col s12">'+
							'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
							'<p style="text-align:center;">'+localized_string_description+'</p>'+
						'</div>'+
						'<div class="col s12">'+
							'<table class="striped">'+
								'<thead>'+
									'<tr>'+
										'<th>Id</th>'+
										'<th>Start Date</th>'+
										'<th>End Date</th>'+
									'</tr>'+
								'</thead>'+
								'<tbody id="readkeys-table">'+
								'</tbody>'+
							'</table>'+
						'</div>'+
						'<div class="col s6 center" style="margin-top:16px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				this.showReadKeys();
			}
			$('#back').on('click',function() {
				
				self.models['MenuModel'].setSelected('USERPROPS');
				
			});
			this.rendered = true;
		} else {
			console.log('ReadKeyView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}