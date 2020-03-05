
import WrapperView from '../common/WrapperView.js';
import LightPowerChartView from './LightPowerChartView.js';
import LightEnergyChartView from './LightEnergyChartView.js';

export default class DistrictACWrapperView extends WrapperView {
	
	constructor(controller) {
		super(controller);
		
		// This is a wrapper for two different "subviews":
		//   - Chart which contains LIGHTS & APPLIANCES POWER for current day
		//   - Chart which contains LIGHTS & APPLIANCES ENERGY for current day
		
		this.subviews.push(new LightPowerChartView(this, '#subview-1'));
		this.subviews.push(new LightEnergyChartView(this, '#subview-2'));
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_dac_title = LM['translation'][sel]['DAC_TITLE'];
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		
		const html = 
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h3 class="da-wrapper-title">'+localized_string_dac_title+'</h3>'+
				'</div>'+
			'</div>'+
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
