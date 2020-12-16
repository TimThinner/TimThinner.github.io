import View from '../common/View.js';

/*
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
*/
export default class UserAlarmCreateView extends View {
	constructor(controller) {
		
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserAlarmModel' || key === 'MenuModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
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
			if (options.model==='UserAlarmModel' && options.method==='addOne') {
				$('#failed').empty();
				$('#success').empty();
				if (options.status === 201) {
					// Alarm added OK, show OK message and go back to AlarmList (after 1 second delay).
					const html = '<div class="success-message"><p>'+options.message+'</p></div>';
					$(html).appendTo('#success');
					setTimeout(() => {
						this.models['MenuModel'].setSelected('USERALARM');
					}, 1000);
					
				} else {
					// Something went wrong, stay in this view (page).
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$(html).appendTo('#failed');
				}
			}
		}
	}
	
	render() {
		var self = this;
		$(this.el).empty();
		
		const UM = this.controller.master.modelRepo.get('UserModel')
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const localized_string_title = 'Create a new Alarm';
		const localized_string_da_cancel = LM['translation'][sel]['DA_CANCEL'];
		const localized_string_create_alarm = 'Create Alarm';
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						'<p style="text-align:center;">This is ONLY for testing purposes!</p>'+
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
						'<button class="btn waves-effect waves-light" id="create-alarm">'+localized_string_create_alarm+'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#cancel").on('click', function() {
			self.models['MenuModel'].setSelected('USERALARM');
		});
		
		$('#create-alarm').on('click',function() {
			//const _email = $('#regcode-email').val();
			//const _apaid = $('#regcode-apartment-id').val();
			const authToken = UM.token;
			const data = {
				refToUser: UM.id,
				alarmType: 'Temperature Upper Limit',
				alarmTimestamp: '2020-12-12T12:00',
				severity: 3
			};
			self.models['UserAlarmModel'].addOne(data, authToken);
		});
	}
}
