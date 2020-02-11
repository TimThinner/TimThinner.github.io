import View from './View.js';
export default class WrapperView extends View {
	
	constructor(controller) {
		super(controller);
		this.subviews = [];
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
	render() {
		console.log('THIS SHOULD NEVER HAPPEN!!!!!!?');
	}
}
