import View from './View.js';
import PeriodicTimeoutObserver from './PeriodicTimeoutObserver.js'

export default class WrapperView extends View {
	
	constructor(controller) {
		super(controller);
		
		this.subviews = [];
		this.selected = "b1d";
		
		this.PTO = new PeriodicTimeoutObserver({interval:30000}); // interval 30 seconds.
		this.PTO.subscribe(this);
	}
	
	show() {
		console.log('NOW RENDER THE WRAPPER!');
		this.render();
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		this.subviews.forEach(view => {
			view.hide();
		});
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
		this.subviews.forEach(view => {
			view.remove();
		});
		$(this.el).empty();
	}
	
	resetButtonClass() {
		const elems = document.getElementsByClassName("my-range-button");
		for(let i = 0; i < elems.length; i++) {
			$(elems[i]).removeClass("selected");
		}
		$('#'+this.selected).addClass("selected");
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Do something with each TICK!
				
				console.log('PeriodicTimeoutObserver TICK');
				
				const um = this.controller.master.modelRepo.get('UserModel');
				const token = um ? um.token : undefined;
				console.log(['User token=',token]);
				
				Object.keys(this.controller.models).forEach(key => {
					console.log(['FETCH MODEL key=',key]);
					this.controller.models[key].fetch(token);
				});
			}
		}
	}
	
	/*
		Timerange is set with buttons.
		New param is an array of models 
	*/
	setTimerangeHandlers(models) {
		const self = this;
		
		$('#'+this.selected).addClass("selected");
		
		$('#b1d').on('click',function() {
			self.selected = "b1d";
			self.resetButtonClass();
			// Controller has all needed models + menumodel, which we ignore here.
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=1 for model.name=',model.name]);
					model.timerange = 1;
				}
			});
			self.PTO.restart();
		});
		
		$('#b2d').on('click',function() {
			self.selected = "b2d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=2 for model.name=',model.name]);
					model.timerange = 2;
				}
			});
			self.PTO.restart();
		});
		
		$('#b3d').on('click',function() {
			self.selected = "b3d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=3 for model.name=',model.name]);
					model.timerange = 3;
				}
			});
			self.PTO.restart();
		});
		
		$('#b4d').on('click',function() {
			self.selected = "b4d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=4 for model.name=',model.name]);
					model.timerange = 4;
				}
			});
			self.PTO.restart();
		});
		
		$('#b5d').on('click',function() {
			self.selected = "b5d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=5 for model.name=',model.name]);
					model.timerange = 5;
				}
			});
			self.PTO.restart();
		});
		
		$('#b6d').on('click',function() {
			self.selected = "b6d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=6 for model.name=',model.name]);
					model.timerange = 6;
				}
			});
			self.PTO.restart();
		});
		
		$('#b7d').on('click',function() {
			self.selected = "b7d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=7 for model.name=',model.name]);
					model.timerange = 7;
				}
			});
			self.PTO.restart();
		});
	}
	
	/*
		Called by View.
	*/
	handlePollingInterval(id) {
		const self = this;
		
		console.log(['handlePollingInterval id=',id]);
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_auto_update_msg_1 = LM['translation'][sel]['AUTO_UPDATE_MSG_1'];
		const localized_string_auto_update_msg_2 = LM['translation'][sel]['AUTO_UPDATE_MSG_2'];
		const localized_string_auto_update_msg_3 = LM['translation'][sel]['AUTO_UPDATE_MSG_3'];
		
		const initialPollingInterval = this.PTO.interval/1000;
		
		$("#"+id+"-chart-refresh-interval").val(initialPollingInterval);
		if (initialPollingInterval > 0) {
			$("#"+id+"-chart-refresh-note").empty().append(localized_string_auto_update_msg_1+' '+initialPollingInterval+' '+localized_string_auto_update_msg_2);
		} else {
			$("#"+id+"-chart-refresh-note").empty().append(localized_string_auto_update_msg_3);
		}
		$("#"+id+"-chart-refresh-interval").change(function(){
			const val = $(this).val(); // "20"
			const vali = parseInt(val, 10) * 1000;
			if (vali > 0) {
				$("#"+id+"-chart-refresh-note").empty().append(localized_string_auto_update_msg_1+' '+val+' '+localized_string_auto_update_msg_2);
			} else {
				$("#"+id+"-chart-refresh-note").empty().append(localized_string_auto_update_msg_3);
			}
			self.PTO.restart(vali);
		});
	}
	
	render() {
		console.log('THIS SHOULD NEVER HAPPEN!!!!!!?');
	}
}
