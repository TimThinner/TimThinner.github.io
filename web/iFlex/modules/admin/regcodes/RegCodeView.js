/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../../common/View.js';
import PeriodicTimeoutObserver from '../../common/PeriodicTimeoutObserver.js'

export default class RegCodeView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.PTO = new PeriodicTimeoutObserver({interval:-1});
		this.PTO.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'view-failure';
		this.layout = 'Table';
	}
	
	show() {
		this.render();
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
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
	
	showRegcodes() {
		const self = this;
		console.log('UPDATE !!!!!!');
		if (this.layout === 'Table') {
			$('#regcodes-table').empty();
		} else {
			$('#regcodes-placeholder').empty();
		}
		if (typeof this.models['RegCodeModel'].regcodes !== 'undefined') {
			
			this.models['RegCodeModel'].regcodes.forEach(code => {
				const id = code._id;
				const title = '<a href="javascript:void(0);" id="edit-regcode-'+id+'">'+code.email+'</a>';
				const startDateStringLocalTZ = this.dateTimeWithTimezoneOffset(new Date(code.startdate));
				const endDateStringLocalTZ = this.dateTimeWithTimezoneOffset(new Date(code.enddate));
				let regcode_validity = '&nbsp;';
				
				const ts = Date.now();
				const sTS = new Date(code.startdate);
				const eTS  = new Date(code.enddate);
				//console.log(['Now=',ts]);
				//console.log(['Start=',sTS.getTime()]);
				//console.log(['End=',eTS.getTime()]);
				if (ts > sTS.getTime() && ts < eTS.getTime()) {
					regcode_validity = '<i style="color:green;vertical-align:middle;" class="material-icons small">brightness_1</i>';
				} else {
					regcode_validity = '<i style="color:red;vertical-align:middle;" class="material-icons small">brightness_1</i>';
				}
				/*
					_id: doc._id,
					email: doc.email,
					apartmentId: doc.apartmentId,
					code: doc.code,
					startdate: doc.startdate,     "2020-09-22T21:00:00.000Z"
					enddate: doc.enddate          "2020-10-22T21:00:00.000Z"
				*/
				//console.log(['code._id=',id]);
				
				if (this.layout === 'Table') {
					const html = '<tr>'+
						'<td>'+title+'</td>'+
						'<td>'+code.apartmentId+'</td>'+
						'<td>'+code.code+'</td>'+
						'<td>'+startDateStringLocalTZ+'</td>'+
						'<td>'+endDateStringLocalTZ+'</td>'+
						'<td>'+regcode_validity+'</td>'+
						'</tr>';
					$(html).appendTo("#regcodes-table");
				} else {
					const html = '<div class="row">'+
						'<div class="col s12 regcode-item">'+
							'<p>Email: '+title+'<br/>'+
							'Apartment Id: '+code.apartmentId+'<br/>'+
							'Code: '+code.code+'<br/>'+
							'Start Date: '+startDateStringLocalTZ+' '+regcode_validity+'<br/>'+
							'End Date: '+endDateStringLocalTZ+'</p>'+
						'</div>'+
					'</div>';
					$(html).appendTo("#regcodes-placeholder");
				}
			});
			
			this.models['RegCodeModel'].regcodes.forEach(code => {
				const id = code._id;
				$('#edit-regcode-'+id).on('click', function(){
					console.log(['SET RegCodeModel selected id=',id]);
					self.models['RegCodeModel'].setSelected({'id':id,'caller':'REGCODES'});
					//console.log(['Edit code=',code]);
					self.models['MenuModel'].setSelected('REGCODEEDIT');
				});
			});
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='RegCodeModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('RegCodeView => RegCodeModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.showRegcodes();
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
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Do something with each TICK!
				// Feed the UserModel parameters into fetch call.
				const UM = this.controller.master.modelRepo.get('UserModel');
				const token = UM ? UM.token : undefined;
				Object.keys(this.models).forEach(key => {
					console.log(['FETCH MODEL key=',key]);
					this.models[key].fetch({token: token});
				});
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
			const localized_string_back = LM['translation'][sel]['BACK'];
			const localized_string_title = LM['translation'][sel]['USER_PROPS_ADMIN_REGCODES'];
			const localized_string_create_new_regcode  = LM['translation'][sel]['USER_PROPS_ADMIN_REGCODES_CREATE_BTN_TXT'];
			
			
			let placeholder = 
				'<div class="col s12">'+
					'<table class="striped">'+
						'<thead>'+
							'<tr>'+
								'<th>Email</th>'+
								'<th>Apartment Id</th>'+
								'<th>Code</th>'+
								'<th>Start Date</th>'+
								'<th>End Date</th>'+
								'<th>&nbsp;</th>'+
							'</tr>'+
						'</thead>'+
						'<tbody id="regcodes-table">'+
						'</tbody>'+
					'</table>'+
				'</div>';
			
			if (this.layout !== 'Table') {
				placeholder = '<div class="col s12" id="regcodes-placeholder" style="padding: 0 24px;"></div>';
			}
			const html =
				'<div class="row">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						//'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
					'<div class="col s12" style="padding: 0 24px;">'+
					'<form action="#">'+
						'<p>'+
							'<label>'+
								'<input name="layout" type="radio" value="Table" />'+
								'<span>Table</span>'+
							'</label>'+
						'</p>'+
						'<p>'+
							'<label>'+
								'<input name="layout" type="radio" value="Cards" />'+
								'<span>Cards</span>'+
							'</label>'+
						'</p>'+
					'</form></div>'+ placeholder +
					'<div class="col s6 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_back+
							'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="create-regcode">'+localized_string_create_new_regcode+
						'</button>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			if (this.layout === 'Table') {
				$("input[value='Table']").prop('checked', true);
			} else {
				$("input[value='Cards']").prop('checked', true);
			}
			
			$("input[type='radio']").click(function(){
				var radioValue = $("input[name='layout']:checked").val();
				if(radioValue){
					self.layout = radioValue;
					self.render();
				}
			});
			
			this.showRegcodes();
			
			$('#create-regcode').on('click',function() {
				self.models['MenuModel'].setSelected('REGCODECREATE');
			});
			
			$('#back').on('click',function() {
				self.models['MenuModel'].setSelected('USERPROPS');
			});
			
			this.handleErrorMessages(this.FELID);
			
			this.rendered = true;
			
		} else {
			console.log('RegCodeView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}