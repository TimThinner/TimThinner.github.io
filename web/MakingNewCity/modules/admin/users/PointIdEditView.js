import View from '../../common/View.js';
/*
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
*/
export default class PointIdEditView extends View {
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
			if (options.model==='UserModel' && options.method==='updateUserData') {
				
				const context = this.models['UsersModel'].getContext();
				const caller = context.caller;
				
				if (options.status === 200) {
					// ReadKey updated OK, show OK message and go back to ReadKeyList (after 1 second delay).
					const html = '<div class="success-message"><p>'+options.message+'</p></div>';
					$('#response').empty().append(html);
					setTimeout(() => {
						this.models['MenuModel'].setSelected(caller);
					}, 1000);
				} else {
					// Something went wrong, stay in this view (page).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#response').empty().append(html);
				}
			}
		}
	}
	
	render() {
		var self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const localized_string_title = LM['translation'][sel]['ADMIN_EDIT_POINT_ID_TITLE'];
		const localized_string_description = LM['translation'][sel]['ADMIN_EDIT_POINT_ID_DESCRIPTION'];
		const localized_string_label = LM['translation'][sel]['ADMIN_EDIT_POINT_ID_LABEL'];
		const localized_string_cancel = LM['translation'][sel]['CANCEL'];
		const localized_string_update = LM['translation'][sel]['UPDATE'];
		
		// Should we reset this everytime we render the FORM?
		//this.serviceDates = {'start':'','end':''};
		const context = this.models['UsersModel'].getContext();
		const sid = context.id;
		const caller = context.caller;
		const pid = context.pid; // 'point_id_a', 'point_id_b' or 'point_id_c'
		let point_id = '';
		
		this.models['UsersModel'].users.forEach(user=>{
			if (user._id === sid) {
				point_id = user[pid]; // Selects the correct property.
			}
		});
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
					'<div class="input-field col s12">'+
						'<input id="point-id" type="text" class="validate">'+
						'<label for="point-id">'+localized_string_label+': ('+pid+')</label>'+
					'</div>'+
					'<div class="col s12 center" id="response"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="cancel">'+localized_string_cancel+'</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" id="update-point-id">'+localized_string_update+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		if (point_id.length > 0) {
			$('label[for="point-id"]').addClass('active');
			$('#point-id').val(point_id);
		}
		
		this.rendered = true;
		
		$("#cancel").on('click', function() {
			self.models['MenuModel'].setSelected(caller);
		});
		
		$('#update-point-id').on('click',function() {
			const _code = $('#point-id').val();
			const authToken = self.models['UserModel'].token;
			const data = [
				{propName:pid, value:_code}
			];
			self.models['UserModel'].updateUserData(sid, data, authToken);
		});
	}
}
