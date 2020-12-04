import WrapperView from '../../common/WrapperView.js';
import UWCWaterChartView from './UWCWaterChartView.js';
import UWCWaterTSChartView from './UWCWaterTSChartView.js';
export default class UWCWrapperView extends WrapperView {
	
	constructor(controller) {
		super(controller);
		// This is a wrapper for "subviews":
		this.subviews.push(new UWCWaterChartView(this, '#subview-1'));
		this.subviews.push(new UWCWaterTSChartView(this, '#subview-2'));
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_title = LM['translation'][sel]['USER_WATER_CHART_TITLE'];
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_daw_sel_timerange = LM['translation'][sel]['DAW_SEL_TIMERANGE']; // Select timerange for database query:
		const localized_string_x_days_info = LM['translation'][sel]['USER_CHART_X_DAYS_INFO'];
		
		const html = 
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h3 class="da-wrapper-title">'+localized_string_title+'</h3>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<p style="color:#aaa;margin-top:-16px;padding:0;">'+localized_string_daw_sel_timerange+'</p>'+
					'<a href="javascript:void(0);" id="b1d" class="my-range-button" style="float:right;">1d</a>'+
					'<a href="javascript:void(0);" id="b2d" class="my-range-button" style="float:right;">2d</a>'+
					'<a href="javascript:void(0);" id="b3d" class="my-range-button" style="float:right;">3d</a>'+
					'<a href="javascript:void(0);" id="b4d" class="my-range-button" style="float:right;">4d</a>'+
					'<a href="javascript:void(0);" id="b5d" class="my-range-button" style="float:right;">5d</a>'+
					'<a href="javascript:void(0);" id="b6d" class="my-range-button" style="float:right;">6d</a>'+
					'<a href="javascript:void(0);" id="b7d" class="my-range-button" style="float:right;">7d</a>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="subview-1">'+
				'</div>'+
				'<div class="col s12 center" style="margin-top:-16px;">'+
					'<h5 class="da-wrapper-title" id="time-series-title"></h5>'+
					'<p id="time-series-progress-info">'+localized_string_x_days_info+'</p>'+
				'</div>'+
				'<div class="col s12 center" id="subview-2">'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s6 center">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.setTimerangeHandlers();
		/*
		this.startSwipeEventListeners(
			()=>{this.menuModel.setSelected('USERWATER');},
			()=>{this.menuModel.setSelected('USERWATERTARGETS');}
		);*/
		
		// Assign back-button handler.
		$('#back').on('click',function() {
			self.menuModel.setSelected('USERWATER');
		});
		
		this.showSpinner('#subview-1');
		this.showSpinner('#subview-2');
		
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
