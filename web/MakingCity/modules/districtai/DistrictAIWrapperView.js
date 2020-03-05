
import WrapperView from '../common/WrapperView.js';
import GeothermalPowerChartView from './GeothermalPowerChartView.js';
import GeothermalEnergyChartView from './GeothermalEnergyChartView.js';

export default class DistrictAIWrapperView extends WrapperView {
	
	constructor(controller) {
		super(controller);
		
		// This is a wrapper for two different "subviews":
		//   - Chart which contains Geothermal POWER for current day
		//   - Chart which contains Geothermal ENERGY for current day
		this.subviews.push(new GeothermalPowerChartView(this, '#subview-1'));
		this.subviews.push(new GeothermalEnergyChartView(this, '#subview-2'));
		this.selected = "b1d";
	}
	
	resetButtonClass() {
		const elems = document.getElementsByClassName("my-range-button");
		for(let i = 0; i < elems.length; i++) {
			$(elems[i]).removeClass("selected");
		}
		$('#'+this.selected).addClass("selected");
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_dai_title = LM['translation'][sel]['DAI_TITLE'];
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		
		let extra = '';
		const um = this.controller.master.modelRepo.get('UserModel');
		const token = um ? um.token : undefined;
		if (typeof token !== 'undefined') {
			extra = '<div class="row">'+
				'<div class="col s12 center">'+
					'<p style="color:#aaa;margin-top:-16px;padding:0;">Select timerange for database query:</p>'+
					'<a href="javascript:void(0);" id="b1d" class="my-range-button" style="float:right;">1d</a>'+
					'<a href="javascript:void(0);" id="b2d" class="my-range-button" style="float:right;">2d</a>'+
					'<a href="javascript:void(0);" id="b3d" class="my-range-button" style="float:right;">3d</a>'+
					'<a href="javascript:void(0);" id="b4d" class="my-range-button" style="float:right;">4d</a>'+
					'<a href="javascript:void(0);" id="b5d" class="my-range-button" style="float:right;">5d</a>'+
					'<a href="javascript:void(0);" id="b6d" class="my-range-button" style="float:right;">6d</a>'+
					'<a href="javascript:void(0);" id="b7d" class="my-range-button" style="float:right;">7d</a>'+
				'</div>'+
			'</div>';
		}
		
		
		
		const html = 
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h3 class="da-wrapper-title">'+localized_string_dai_title+'</h3>'+
				'</div>'+
			'</div>' + extra +
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
		
		$('#'+self.selected).addClass("selected");
		
		$('#b1d').on('click',function() {
			self.selected = "b1d";
			self.resetButtonClass();
			self.controller.models['GeothermalModel'].timerange = 1;
			//	dateAxis.zoom({start:0, end:1});
			//	self.controller.changeFetchParams('AB', 'b1m');
		});
		
		$('#b2d').on('click',function() {
			self.selected = "b2d";
			self.resetButtonClass();
			self.controller.models['GeothermalModel'].timerange = 2;
			//	dateAxis.zoom({start:0, end:1});
			//	self.controller.changeFetchParams('AB', 'b1m');
		});
		
		$('#b3d').on('click',function() {
			self.selected = "b3d";
			self.resetButtonClass();
			self.controller.models['GeothermalModel'].timerange = 3;
			//	dateAxis.zoom({start:0, end:1});
			//	self.controller.changeFetchParams('AB', 'b1m');
		});
		
		$('#b4d').on('click',function() {
			self.selected = "b4d";
			self.resetButtonClass();
			self.controller.models['GeothermalModel'].timerange = 4;
			//	dateAxis.zoom({start:0, end:1});
			//	self.controller.changeFetchParams('AB', 'b1m');
		});
		
		$('#b5d').on('click',function() {
			self.selected = "b5d";
			self.resetButtonClass();
			self.controller.models['GeothermalModel'].timerange = 5;
			//	dateAxis.zoom({start:0, end:1});
			//	self.controller.changeFetchParams('AB', 'b1m');
		});
		
		$('#b6d').on('click',function() {
			self.selected = "b6d";
			self.resetButtonClass();
			self.controller.models['GeothermalModel'].timerange = 6;
			//	dateAxis.zoom({start:0, end:1});
			//	self.controller.changeFetchParams('AB', 'b1m');
		});
		
		$('#b7d').on('click',function() {
			self.selected = "b7d";
			self.resetButtonClass();
			self.controller.models['GeothermalModel'].timerange = 7;
			//	dateAxis.zoom({start:0, end:1});
			//	self.controller.changeFetchParams('AB', 'b1m');
		});
		
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
