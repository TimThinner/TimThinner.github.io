import View from './View.js';
export default class WrapperView extends View {
	
	constructor(controller) {
		super(controller);
		this.subviews = [];
		this.selected = "b1d";
	}
	hide() {
		this.subviews.forEach(view => {
			view.hide();
		});
		$(this.el).empty();
	}
	remove() {
		this.subviews.forEach(view => {
			view.remove();
		});
		$(this.el).empty();
	}
	show() {
		console.log('NOW RENDER THE WRAPPER!');
		this.render();
	}
	/*
		Called by subviews.
	*/
	handlePollingInterval(id, name) {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_auto_update_msg_1 = LM['translation'][sel]['AUTO_UPDATE_MSG_1'];
		const localized_string_auto_update_msg_2 = LM['translation'][sel]['AUTO_UPDATE_MSG_2'];
		const localized_string_auto_update_msg_3 = LM['translation'][sel]['AUTO_UPDATE_MSG_3'];
		
		const initialPollingInterval = this.controller.getPollingInterval(name)/1000;
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
			self.controller.changePollingInterval(name, vali);
		});
	}
	
	resetButtonClass() {
		const elems = document.getElementsByClassName("my-range-button");
		for(let i = 0; i < elems.length; i++) {
			$(elems[i]).removeClass("selected");
		}
		$('#'+this.selected).addClass("selected");
	}
	
	/*
		Timerange is set with buttons.
	*/
	setTimerangeHandlers() {
		const self = this;
		
		$('#'+this.selected).addClass("selected");
		
		$('#b1d').on('click',function() {
			self.selected = "b1d";
			self.resetButtonClass();
			// Controller has all needed models + menumodel, which we ignore here.
			Object.keys(self.controller.models).forEach(key => {
				if (key !== 'MenuModel') {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=1 for model.name=',model.name]);
					model.timerange = 1;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b2d').on('click',function() {
			self.selected = "b2d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (key !== 'MenuModel') {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=2 for model.name=',model.name]);
					model.timerange = 2;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b3d').on('click',function() {
			self.selected = "b3d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (key !== 'MenuModel') {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=3 for model.name=',model.name]);
					model.timerange = 3;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b4d').on('click',function() {
			self.selected = "b4d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (key !== 'MenuModel') {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=4 for model.name=',model.name]);
					model.timerange = 4;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b5d').on('click',function() {
			self.selected = "b5d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (key !== 'MenuModel') {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=5 for model.name=',model.name]);
					model.timerange = 5;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b6d').on('click',function() {
			self.selected = "b6d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (key !== 'MenuModel') {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=6 for model.name=',model.name]);
					model.timerange = 6;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b7d').on('click',function() {
			self.selected = "b7d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (key !== 'MenuModel') {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=7 for model.name=',model.name]);
					model.timerange = 7;
				}
			});
			self.controller.refreshTimerange();
		});
	}
	
	render() {
		console.log('THIS SHOULD NEVER HAPPEN!!!!!!?');
	}
}
