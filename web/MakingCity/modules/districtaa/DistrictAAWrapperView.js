
import WrapperView from '../common/WrapperView.js';
import SolarChartView from './SolarChartView.js';
import FooChartView from './FooChartView.js';

export default class DistrictAAWrapperView extends WrapperView {
	
	constructor(controller) {
		super(controller);
		
		// This is a wrapper for two different "subviews":
		//   - Chart which contains SOLAR POWER AND ENERGY for current day
		//   - Chart which contains FOO? for last month
		
		this.subviews.push(new SolarChartView(this, '#subview-1'));
		this.subviews.push(new FooChartView(this, '#subview-2'));
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		
		const html = 
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h3 style="margin-top:0;">CHARTS</h3>'+
					'<h5 style="color:#aaa">These are only simulated views with random numbers</h5>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="subview-1">'+
				//'<p>CHART IS LOADING...</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="subview-2">'+
				//'<p>CHART IS LOADING...</p>'+
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
			self.controller.menuModel.setSelected('DA');
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
