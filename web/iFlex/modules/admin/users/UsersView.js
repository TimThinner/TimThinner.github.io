/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../../common/View.js';

export default class UsersView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
			
		});
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'view-failure';
		this.layout = 'Table';
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
	
	
	showUsers() {
		const self = this;
		
		if (this.layout === 'Table') {
			$('#users-table').empty();
		} else {
			$('#users-placeholder').empty();
		}
		
		if (typeof this.models['UsersModel'].users !== 'undefined') {
			
			this.models['UsersModel'].users.forEach(user => {
				//console.log(['user=',user]);
				
				// A way to edit Obix codes:
				const id = user._id;
				let obix_code = user.obix_code;
				if (typeof obix_code === 'undefined' || obix_code.length === 0) {
					obix_code = 'UNDEF'; // Must be something for the link text
				}
				const obix_code_link = '<a href="javascript:void(0);" id="edit-obixcode-'+id+'">'+obix_code+'</a>';
				
				let obix_code_b = user.obix_code_b;
				if (typeof obix_code_b === 'undefined' || obix_code_b.length === 0) {
					obix_code_b = 'UNDEF'; // Must be something for the link text
				}
				const obix_code_b_link = '<a href="javascript:void(0);" id="edit-obixcode-b-'+id+'">'+obix_code_b+'</a>';
				
				let obix_code_c = user.obix_code_c;
				if (typeof obix_code_c === 'undefined' || obix_code_c.length === 0) {
					obix_code_c = 'UNDEF'; // Must be something for the link text
				}
				const obix_code_c_link = '<a href="javascript:void(0);" id="edit-obixcode-c-'+id+'">'+obix_code_c+'</a>';
				
				let regcode_apaid = '-';
				let regcode_code = '-';
				let regcode_validity = '&nbsp;';
				let readkey = '-';
				let readkey_validity = '&nbsp;';
				
				let consent_a_validity = '<i style="color:red;vertical-align:middle;" class="material-icons small">brightness_1</i>';
				let consent_b_validity = '<i style="color:red;vertical-align:middle;" class="material-icons small">brightness_1</i>';
				if (user.consent_a) {
					consent_a_validity = '<i style="color:green;vertical-align:middle;" class="material-icons small">brightness_1</i>';
				}
				if (user.consent_b) {
					consent_b_validity = '<i style="color:green;vertical-align:middle;" class="material-icons small">brightness_1</i>';
				}
				
				if (typeof user.regcode !== 'undefined') {
					regcode_apaid = user.regcode.apartmentId;
					regcode_code = '<a href="javascript:void(0);" id="edit-regcode-'+user.regcode._id+'">'+user.regcode.code+'</a>';
					//regcode_validity = '<i style="color:green" class="material-icons small">brightness_1</i>';
					const ts = Date.now();
					const sTS = new Date(user.regcode.startdate);
					const eTS  = new Date(user.regcode.enddate);
					//console.log(['Now=',ts]);
					//console.log(['Start=',sTS.getTime()]);
					//console.log(['End=',eTS.getTime()]);
					if (ts > sTS.getTime() && ts < eTS.getTime()) {
						regcode_validity = '<i style="color:green;vertical-align:middle;" class="material-icons small">brightness_1</i>';
					} else {
						regcode_validity = '<i style="color:red;vertical-align:middle;" class="material-icons small">brightness_1</i>';
					}
				}
				if (typeof user.readkey !== 'undefined') {
					readkey = '<a href="javascript:void(0);" id="edit-readkey-'+user.readkey._id+'">'+user.readkey._id+'</a>';
					//readkey_validity = '<i style="color:green" class="material-icons small">brightness_1</i>';
					const ts = Date.now();
					const sTS = new Date(user.readkey.startdate);
					const eTS  = new Date(user.readkey.enddate);
					//console.log(['Now=',ts]);
					//console.log(['Start=',sTS.getTime()]);
					//console.log(['End=',eTS.getTime()]);
					if (ts > sTS.getTime() && ts < eTS.getTime()) {
						readkey_validity = '<i style="color:green;vertical-align:middle;" class="material-icons small">brightness_1</i>';
					} else {
						readkey_validity = '<i style="color:red;vertical-align:middle;" class="material-icons small">brightness_1</i>';
					}
				}
				if (this.layout === 'Table') {
					const html = '<tr>'+
						'<td>'+user.email+'</td>'+
						'<td>'+user.created+'</td>'+
						'<td>'+regcode_apaid+'</td>'+
						'<td>'+obix_code_link+'</td>'+
						'<td>'+obix_code_b_link+'</td>'+
						'<td>'+obix_code_c_link+'</td>'+
						'<td>'+user.request_for_sensors+'</td>'+
						'<td>'+consent_a_validity+'</td>'+
						'<td>'+consent_b_validity+'</td>'+
						'<td>'+regcode_code+'</td>'+
						'<td>'+regcode_validity+'</td>'+
						'<td>'+readkey+'</td>'+
						'<td>'+readkey_validity+'</td>'+
						'</tr>';
					$(html).appendTo("#users-table");
				} else {
					const html = '<div class="row">'+
						'<div class="col s12 user-item">'+
							'<p>Email: '+user.email+'<br/>'+
							'Created: '+user.created+'<br/>'+
							'ApartmentId: '+regcode_apaid+'<br/>'+
							'ObixCode: '+obix_code_link+'<br/>'+
							'ObixCodeB: '+obix_code_b_link+'<br/>'+
							'ObixCodeC: '+obix_code_c_link+'<br/>'+
							'Sensors: '+user.request_for_sensors+'<br/>'+
							'Consent A: '+consent_a_validity+'<br/>'+
							'Consent B: '+consent_b_validity+'<br/>'+
							'RegCode: '+regcode_code+' '+regcode_validity+'<br/>'+
							'ReadKey: '+readkey+' '+readkey_validity+'</p>'+
						'</div>'+
					'</div>';
					$(html).appendTo("#users-placeholder");
				}
			});
			
			
			this.models['UsersModel'].users.forEach(user => {
				
				const uid = user._id;
				$('#edit-obixcode-'+uid).on('click', function(){
					self.models['UsersModel'].setSelected({'id':uid,'caller':'USERS'});
					self.models['MenuModel'].setSelected('OBIXCODEEDIT');
				});
				$('#edit-obixcode-b-'+uid).on('click', function(){
					self.models['UsersModel'].setSelected({'id':uid,'caller':'USERS'});
					self.models['MenuModel'].setSelected('OBIXCODEBEDIT');
				});
				$('#edit-obixcode-c-'+uid).on('click', function(){
					self.models['UsersModel'].setSelected({'id':uid,'caller':'USERS'});
					self.models['MenuModel'].setSelected('OBIXCODECEDIT');
				});
				
				if (typeof user.regcode !== 'undefined') {
					const id = user.regcode._id;
					$('#edit-regcode-'+id).on('click', function(){
						//console.log(['SET RegCodeModel selected id=',id]);
						self.models['RegCodeModel'].setSelected({'id':id,'caller':'USERS'});
						self.menuModel.setSelected('REGCODEEDIT');
					});
				}
				if (typeof user.readkey !== 'undefined') {
					const id = user.readkey._id;
					$('#edit-readkey-'+id).on('click', function(){
						//console.log(['SET ReadkeyModel selected id=',id]);
						self.models['ReadKeyModel'].setSelected({'id':id,'caller':'USERS'});
						self.menuModel.setSelected('READKEYEDIT');
					});
				}
				
				
			});
		}
	}
	
	
	
	
	
	
	
	
	/*
		if (typeof this.models['ReadKeyModel'].readkeys !== 'undefined') {
			
			this.models['ReadKeyModel'].readkeys.forEach(key => {
				const id = key._id;
				const title = '<a href="javascript:void(0);" id="edit-readkey-'+id+'">'+id+'</a>';
				const startDateStringLocalTZ = this.dateTimeWithTimezoneOffset(new Date(key.startdate));
				const endDateStringLocalTZ = this.dateTimeWithTimezoneOffset(new Date(key.enddate));
				
				
				
				
				
				//console.log(['key._id=',id]);
				const html = '<tr class="readkey-item">'+
					'<td>'+title+'</td>'+
					'<td>'+startDateStringLocalTZ+'</td>'+
					'<td>'+endDateStringLocalTZ+'</td></tr>';
				
				$(html).appendTo("#readkeys-table");
				$('#edit-readkey-'+id).on('click', function(){
					self.models['ReadKeyModel'].setSelected({'id':id,'caller':'READKEYS'});
					self.models['MenuModel'].setSelected('READKEYEDIT');
				});
			});
		}
	*/
	
	
	notify(options) {
		if (this.controller.visible) {
			if ((options.model==='UsersModel'||options.model==='RegCodeModel'||options.model==='ReadKeyModel') && options.method==='fetched') {
				if (options.status === 200) {
					if (this.areModelsReady()) {
						
						console.log('UsersView => UsersModel fetched!');
						if (this.rendered) {
							$('#'+this.FELID).empty();
							this.showUsers();
						} else {
							this.render();
						}
					} else {
						console.log('WAIT...');
					}
					
					
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
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
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_back = LM['translation'][sel]['BACK'];
			const localized_string_title = LM['translation'][sel]['USER_PROPS_ADMIN_USERS'];
			//const localized_string_description = 'Admin can list all Users and see RegCode and ReadKey information.';
			/*
				regcode:
				apartmentId: { type:String, required:true },
				code:        { type:String, required:true },
				startdate:   { type:Date, default: Date.now },
				enddate:     { type:Date, default: Date.now }
				
				readkey:
				_id: mongoose.Schema.Types.ObjectId,
				startdate:   { type:Date, default: Date.now },
				enddate:     { type:Date, default: Date.now }
			*/
			let placeholder = 
				'<div class="col s12">'+
					'<table class="striped">'+
						'<thead>'+
							'<tr>'+
								'<th>Email</th>'+
								'<th>Created</th>'+
								'<th>Apartment</th>'+
								'<th>ObixCode</th>'+
								'<th>ObixCodeB</th>'+
								'<th>ObixCodeC</th>'+
								'<th>Sensors</th>'+
								'<th>Cons A</th>'+
								'<th>Cons B</th>'+
								'<th>RegCode</th>'+
								'<th>&nbsp;</th>'+
								'<th>ReadKey</th>'+
								'<th>&nbsp;</th>'+
							'</tr>'+
						'</thead>'+
						'<tbody id="users-table">'+
						'</tbody>'+
					'</table>'+
				'</div>';
			if (this.layout !== 'Table') {
				placeholder = '<div class="col s12" id="users-placeholder" style="padding: 0 24px;"></div>';
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
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_back+
							'<i class="material-icons left">arrow_back</i>'+
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
			
			this.showUsers();
			
			$('#back').on('click',function() {
				self.menuModel.setSelected('USERPROPS');
			});
			
			this.handleErrorMessages(this.FELID);
			
			this.rendered = true;
			
		} else {
			console.log('UsersView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}