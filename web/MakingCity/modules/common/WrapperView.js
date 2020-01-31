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
		const initialPollingInterval = this.controller.getPollingInterval(name)/1000;
		$("#"+id+"-chart-refresh-interval").val(initialPollingInterval);
		if (initialPollingInterval > 0) {
			$("#"+id+"-chart-refresh-note").empty().append('chart is automatically updated once every '+initialPollingInterval+' seconds');
		} else {
			$("#"+id+"-chart-refresh-note").empty().append('chart is NOT automatically updated.');
		}
		$("#"+id+"-chart-refresh-interval").change(function(){
			const val = $(this).val(); // "20"
			const vali = parseInt(val, 10) * 1000;
			if (vali > 0) {
				$("#"+id+"-chart-refresh-note").empty().append('chart is automatically updated once every '+val+' seconds');
			} else {
				$("#"+id+"-chart-refresh-note").empty().append('chart is NOT automatically updated.');
			}
			self.controller.changePollingInterval(name, vali);
		});
	}
	render() {
		console.log('THIS SHOULD NEVER HAPPEN!!!!!!?');
	}
}
