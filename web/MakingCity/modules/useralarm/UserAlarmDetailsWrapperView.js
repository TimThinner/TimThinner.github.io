import WrapperView from '../common/WrapperView.js';
import UserAlarmDetailsChartView from './UserAlarmDetailsChartView.js';
export default class UserAlarmDetailsWrapperView extends WrapperView {
	
	constructor(controller) {
		super(controller);
		// This is a wrapper for "subviews":
		this.subviews.push(new UserAlarmDetailsChartView(this, '#subview-1'));
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_title = 'DETAILS';//LM['translation'][sel]['USER_HEATING_CHART_TITLE'];
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		
		const html = 
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h3 class="da-wrapper-title">'+localized_string_title+'</h3>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="subview-1">'+
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
		/*
		const UHMM = this.controller.master.modelRepo.get('UserHeatingMonthModel');
		if (UHMM) {
			const len = UHMM.values.length/24;
			$('#time-series-title').empty().append(localized_string_title+' '+len.toFixed(0)+' '+localized_string_x_days);
		}*/
		
		//this.setTimerangeHandlers(['UserHeatingALLModel']);
		
		//this.startSwipeEventListeners(
		//	()=>{this.menuModel.setSelected('USERWATER');},
		//	()=>{this.menuModel.setSelected('USERWATERTARGETS');}
		//);
		
		// Assign back-button handler.
		$('#back').on('click',function() {
			
		});
		
		$("#back").on('click', function() {
			self.menuModel.setSelected('USERALARM');
		});
		
		this.showSpinner('#subview-1');
		//this.showSpinner('#subview-2');
		
		// Finally render all subviews.
		//setTimeout(() => {
		let timeout = 100;
		this.subviews.forEach(view => {
			setTimeout(() => {
				view.render();
			},timeout);
			timeout += 200;
		});
		// Init the "Adjust the update interval:" -range input in ALL three charts:
		//M.Range.init(document.querySelectorAll("input[type=range]"));
	}
}
