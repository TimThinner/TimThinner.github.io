/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../../common/View.js';

export default class UserWaterTargetsView extends View {
	
	constructor(controller) {
		super(controller);
		
		this.userModel = this.controller.master.modelRepo.get('UserModel');
		this.userModel.subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-water-view-failure';
		
		// Always fill the targets-object with values from UserModel.
		/*
		this.water_hot_upper   = 400;
		this.water_hot_target  = 300;
		this.water_hot_lower   = 100;
		this.water_cold_upper  = 500;
		this.water_cold_target = 400;
		this.water_cold_lower  = 200;
		*/
		this.targets = {
			water_hot_upper: 0,
			water_hot_target: 0,
			water_hot_lower: 0,
			
			water_cold_upper: 0,
			water_cold_target: 0,
			water_cold_lower: 0
		};
	}
	
	show() {
		this.render();
	}
	
	hide() {
		super.hide();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		super.remove();
		this.userModel.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	fillTargetsFromUM() {
		// Fill the targets-object with values from UserModel.
		const UM = this.userModel;
		
		this.targets.water_hot_upper  = UM.water_hot_upper;
		this.targets.water_hot_target = UM.water_hot_target;
		this.targets.water_hot_lower  = UM.water_hot_lower;
		
		this.targets.water_cold_upper  = UM.water_cold_upper;
		this.targets.water_cold_target = UM.water_cold_target;
		this.targets.water_cold_lower  = UM.water_cold_lower;
	}
	
	notify(options) {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_target_saved = LM['translation'][sel]['USER_TARGET_SAVED'];
		
		if (this.controller.visible) {
			if (options.model==='UserModel' && options.method==='updateWaterTargets') {
				if (options.status === 200) {
					
					// Show Toast: SAVED!
					M.toast({displayLength:1000, html: localized_string_target_saved});
					
					this.fillTargetsFromUM();
				}
			}
		}
	}
	
	updateHotWater(values) {
		const UM = this.userModel;
		const id = UM.id;
		const authToken = UM.token;
		
		// values = ["123L", "234L", "456L"]
		// if any value is really changed => update model.
		const v0 = parseFloat(values[0]);
		const v1 = parseFloat(values[1]);
		const v2 = parseFloat(values[2]);
		if (this.targets.water_hot_lower!==v0||this.targets.water_hot_target!== v1||this.targets.water_hot_upper!==v2) {
			const data = [
				{propName:'water_hot_lower', value:v0},
				{propName:'water_hot_target', value:v1},
				{propName:'water_hot_upper', value:v2}
			];
			UM.updateWaterTargets(id, data, authToken);
		}
	}
	
	updateColdWater(values) {
		const UM = this.userModel;
		const id = UM.id;
		const authToken = UM.token;
		
		// values = ["123L", "234L", "456L"]
		// if any value is really changed => update model.
		const v0 = parseFloat(values[0]);
		const v1 = parseFloat(values[1]);
		const v2 = parseFloat(values[2]);
		if (this.targets.water_cold_lower!==v0||this.targets.water_cold_target!== v1||this.targets.water_cold_upper!==v2) {
			const data = [
				{propName:'water_cold_lower', value:v0},
				{propName:'water_cold_target', value:v1},
				{propName:'water_cold_upper', value:v2}
			];
			UM.updateWaterTargets(id, data, authToken);
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_title = LM['translation'][sel]['USER_WATER_TARGETS_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_WATER_TARGETS_BOTH_DESCRIPTION'];
			
			const localized_string_subtitle_1 = LM['translation'][sel]['USER_WATER_CHART_LEGEND_HOT'];
			const localized_string_subtitle_2 = LM['translation'][sel]['USER_WATER_CHART_LEGEND_COLD'];
			
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			
			const localized_string_target = LM['translation'][sel]['USER_TARGET'];
			const localized_string_upper_limit = LM['translation'][sel]['USER_UPPER_LIMIT'];
			const localized_string_lower_limit = LM['translation'][sel]['USER_LOWER_LIMIT'];
			
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<h4>'+localized_string_title+'</h4>'+
						'<p>'+localized_string_description+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s2 center">'+
						'<p>&nbsp;</p>'+
					'</div>'+
					'<div class="col s5 center">'+
						'<h5>'+localized_string_subtitle_1+':</h5><p>&nbsp;</p>'+
						'<div id="water-hot-slider"></div>'+
					'</div>'+
					'<div class="col s5 center">'+
						'<h5>'+localized_string_subtitle_2+':</h5><p>&nbsp;</p>'+
						'<div id="water-cold-slider"></div>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center" style="margin-top:32px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
							'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			// Fill the targets-object with values from UserModel.
			this.fillTargetsFromUM();
			
			//this.startSwipeEventListeners(
			//	()=>{this.menuModel.setSelected('USERWATER');},
			//	()=>{this.menuModel.setSelected('USERWATERCOMPENSATE');}
			//);
			
			$('#back').on('click',function() {
				self.menuModel.setSelected('USERWATER');
			});
			
			this.handleErrorMessages(this.FELID);
			
			const start_water_hot = [
				this.targets.water_hot_lower,
				this.targets.water_hot_target,
				this.targets.water_hot_upper
			];
			
			const hot_range_max = this.targets.water_hot_upper + 100;
			
			var hots = document.getElementById('water-hot-slider');
			noUiSlider.create(hots, {
				range: {
					'min': 0,
					'max': hot_range_max
				},
				step: 0.1,
				// Handles start at ...
				start: [start_water_hot[0], start_water_hot[1], start_water_hot[2]],
				connect: [true, true, true, true],
				// Put '0' at the bottom of the slider
				direction: 'rtl',
				orientation: 'vertical',
				// Move handle on tap, bars are draggable
				behaviour: 'tap-drag',
				tooltips: [wNumb({decimals:0, suffix:'L', prefix:localized_string_lower_limit}), wNumb({decimals:0, suffix:'L',prefix:localized_string_target}), wNumb({decimals:0, suffix:'L', prefix:localized_string_upper_limit})]
				//tooltips: [true, true, true],
				/*format: wNumb({
					decimals: 1,
					suffix: '°C'
				})*/
			});
			// Give the slider dimensions
			hots.style.height = '300px';
			hots.style.margin = '0 auto 30px';
			hots.noUiSlider.on('change', function (values) {
				console.log(['values=',values]);
				self.updateHotWater(values);
			});
			
			const start_water_cold = [
				this.targets.water_cold_lower,
				this.targets.water_cold_target,
				this.targets.water_cold_upper
			];
			const cold_range_max = this.targets.water_cold_upper + 100;
			
			var colds = document.getElementById('water-cold-slider');
			noUiSlider.create(colds, {
				range: {
					'min': 0,
					'max': cold_range_max
				},
				step: 1,
				// Handles start at ...
				start: [start_water_cold[0], start_water_cold[1], start_water_cold[2]],
				connect: [true, true, true, true],
				// Put '0' at the bottom of the slider
				direction: 'rtl',
				orientation: 'vertical',
				// Move handle on tap, bars are draggable
				behaviour: 'tap-drag',
				//tooltips: [true, true, true],
				tooltips: [wNumb({decimals:0, suffix: 'L', prefix:localized_string_lower_limit}), wNumb({decimals:0, suffix: 'L',prefix:localized_string_target}), wNumb({decimals:0, suffix: 'L', prefix:localized_string_upper_limit})]
				/*
				format: wNumb({
					decimals: 1,
					suffix: '%'
				})*/
			});
			// Give the slider dimensions
			colds.style.height = '300px';
			colds.style.margin = '0 auto 30px';
			colds.noUiSlider.on('change', function (values) {
				// values = ['20.0%','30.0%','40.0%']
				console.log(['values=',values]);
				self.updateColdWater(values);
			});
			
			this.rendered = true;
			
		} else {
			console.log('UserWaterTargetsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}