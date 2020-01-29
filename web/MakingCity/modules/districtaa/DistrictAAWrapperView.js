
/*
import ClosedDealsChartView from './ClosedDealsChartView.js';
import AsksBidsChartView from './AsksBidsChartView.js';
import LatenciesChartView from './LatenciesChartView.js';
*/
import View from '../common/View.js';
import TestChartView from './TestChartView.js';

export default class DistrictAAWrapperView extends View {
	
	constructor(controller) {
		super(controller);
		//this.controller = controller;
		//this.el = controller.el;
		// This is a wrapper for four different "subviews":
		//   - Chart which contains CLOSED DEALS
		//   - Chart which contains BIDS and ASKS
		//   - Chart which contains LATENCY
		
		this.subviews = [];
		this.subviews.push(new TestChartView(this, '#subview-1'));
		//this.subviews.push(new AsksBidsChartView(this, '#subview-2'));
		//this.subviews.push(new LatenciesChartView(this, '#subview-3'));
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
	handlePollingInterval(name) {
		const self = this;
		const initialPollingInterval = this.controller.getPollingInterval(name)/1000;
		$("#"+name+"-chart-refresh-interval").val(initialPollingInterval);
		if (initialPollingInterval > 0) {
			$("#"+name+"-chart-refresh-note").empty().append('chart is automatically updated once every '+initialPollingInterval+' seconds');
		} else {
			$("#"+name+"-chart-refresh-note").empty().append('chart is NOT automatically updated.');
		}
		$("#"+name+"-chart-refresh-interval").change(function(){
			const val = $(this).val(); // "20"
			const vali = parseInt(val, 10) * 1000;
			if (vali > 0) {
				$("#"+name+"-chart-refresh-note").empty().append('chart is automatically updated once every '+val+' seconds');
			} else {
				$("#"+name+"-chart-refresh-note").empty().append('chart is NOT automatically updated.');
			}
			self.controller.changePollingInterval(name, vali);
		});
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
					'<h3 style="margin-top:0;">TESTING D-A-A CHARTVIEW</h3>'+
					'<h5 style="color:#aaa">This is only a simulated view with random numbers</h5>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="subview-1">'+
				'</div>'+
			'</div>'+
			/*
			'<div class="row">'+
				'<div class="col s12 center" id="subview-2">'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="subview-3">'+
				'</div>'+
			'</div>';*/
			'<div class="row">'+
				'<div class="col s6 center">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$('#back').on('click',function() {
			self.controller.menuModel.setSelected('DA');
		});
		
		// Finally render all subviews.
		this.subviews.forEach(view => {
			view.render();
		});
		
		// Init the "Adjust the update interval:" -range input in ALL three charts:
		
		
		M.Range.init(document.querySelectorAll("input[type=range]"));
		
	}
}
