
import WrapperView from '../common/WrapperView.js';
import KitchenPowerChartView from './KitchenPowerChartView.js';
import KitchenEnergyChartView from './KitchenEnergyChartView.js';

export default class DistrictADWrapperView extends WrapperView {
	
	constructor(controller) {
		super(controller);
		
		// This is a wrapper for two different "subviews":
		//   - Chart which contains Kitchen appliances POWER for current day
		//   - Chart which contains Kitchen appliances ENERGY for current day
		
		this.subviews.push(new KitchenPowerChartView(this, '#subview-1'));
		this.subviews.push(new KitchenEnergyChartView(this, '#subview-2'));
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_dad_title = LM['translation'][sel]['DAD_TITLE'];
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
			this.controller.models['Kitchen106Model'].timerange = 1;
			this.controller.models['Kitchen107Model'].timerange = 1;
			this.controller.models['Kitchen108Model'].timerange = 1;
		}
		
		const html = 
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h3 class="da-wrapper-title">'+localized_string_dad_title+'</h3>'+
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
		
		this.setTimerangeHandlers(['Kitchen106Model','Kitchen107Model','Kitchen108Model']);
		
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
