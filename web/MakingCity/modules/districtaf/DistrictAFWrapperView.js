
import WrapperView from '../common/WrapperView.js';
import OtherPowerChartView from './OtherPowerChartView.js';
import OtherEnergyChartView from './OtherEnergyChartView.js';

export default class DistrictAFWrapperView extends WrapperView {
	
	constructor(controller) {
		super(controller);
		
		// This is a wrapper for two different "subviews":
		//   - Chart which contains Other POWER for current day
		//   - Chart which contains Other ENERGY for current day
		
		this.subviews.push(new OtherPowerChartView(this, '#subview-1'));
		this.subviews.push(new OtherEnergyChartView(this, '#subview-2'));
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_daf_title = LM['translation'][sel]['DAF_TITLE'];
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_daw_sel_timerange = LM['translation'][sel]['DAW_SEL_TIMERANGE']; // Select timerange for database query:
		
		let extra = '';
		const um = this.controller.master.modelRepo.get('UserModel');
		if (um.isLoggedIn()) {
			extra = '<div class="row">'+
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
			'</div>';
		} else {
			// If we are not logged in make sure that model timerange is one day.
			this.controller.models['Other109Model'].timerange = 1;
			this.controller.models['Other111Model'].timerange = 1;
		}
		
		const html = 
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h3 class="da-wrapper-title">'+localized_string_daf_title+'</h3>'+
				'</div>'+
			'</div>'+ extra +
			'<div class="row">'+
				'<div class="col s12 center" id="subview-1">'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
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
		
		this.setTimerangeHandlers(['Other109Model','Other111Model']);
		
		// Assign back-button handler.
		$('#back').on('click',function() {
			self.controller.models['MenuModel'].setSelected('DA');
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
			//view.render();
		});
		// Init the "Adjust the update interval:" -range input in ALL three charts:
		//M.Range.init(document.querySelectorAll("input[type=range]"));
	}
}
