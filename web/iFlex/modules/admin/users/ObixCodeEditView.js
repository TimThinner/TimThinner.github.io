import View from '../../common/View.js';
/*
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
*/
export default class ObixCodeEditView extends View {
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
				
				const ctx = this.models['UsersModel'].getContext();
				const caller = ctx.caller;
				
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
		
		const localized_string_title = LM['translation'][sel]['ADMIN_EDIT_OBIXCODE_TITLE'];
		const localized_string_description = LM['translation'][sel]['ADMIN_EDIT_OBIXCODE_DESCRIPTION'];
		const localized_string_obixcode_label = LM['translation'][sel]['ADMIN_EDIT_OBIXCODE_LABEL'];
		const localized_string_cancel = LM['translation'][sel]['CANCEL'];
		const localized_string_update = LM['translation'][sel]['UPDATE'];
		
		// Should we reset this everytime we render the FORM?
		//this.serviceDates = {'start':'','end':''};
		// Get the selected ReadKey (model) to see the old dates.
		const ctx = this.models['UsersModel'].getContext();
		const sid = ctx.id;
		const caller = ctx.caller;
		const obid = context.obid; // 'obix_code', 'obix_code_b' or 'obix_code_c'
		let obix_code = '';
		
		this.models['UsersModel'].users.forEach(user=>{
			if (user._id === sid) {
				obix_code = user[obid]; // Selects the correct property.
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
						'<input id="obix-code" type="text" class="validate">'+
						'<label for="obix-code">'+localized_string_obixcode_label+': ('+obid+')</label>'+
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
						'<button class="btn waves-effect waves-light" id="update-obix-code">'+localized_string_update+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		if (obix_code.length > 0) {
			$('label[for="obix-code"]').addClass('active');
			$('#obix-code').val(obix_code);
		}
		
		this.rendered = true;
		
		$("#cancel").on('click', function() {
			self.models['MenuModel'].setSelected(caller);
		});
		
		$('#update-obix-code').on('click',function() {
			const _code = $('#obix-code').val();
			console.log(['SET THE OBIX CODE val=',_code]);
			const authToken = self.models['UserModel'].token;
			const data = [
				{propName:obid, value:_code}
			];
			self.models['UserModel'].updateUserData(sid, data, authToken);
		});
	}
}
