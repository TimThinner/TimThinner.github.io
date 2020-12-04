/*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

*/
import View from '../../common/View.js';
export default class UECEnergyTSChartView extends View {
	
	// One CHART can have ONLY one timer.
	// Its name is given in constructor.
	// That timer can control 0,1, n models.
	constructor(wrapper, el) {
		super(wrapper.controller);
		
		this.wrapper = wrapper;
		// NOTE: Each view inside wrapperview is rendered within its own element, therefore 
		// we must deliver that element as separate variable. For example this el is #subview-1
		// 
		this.el = el;
		
		// Which models I have to listen? Select which ones to use here:
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserElectricityTSModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.chart = undefined;
		this.rendered = false;
		this.FELID = 'uec-energy-ts-chart-view-failure';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		$(this.el).empty();
		this.rendered = false;
	}
	
	remove() {
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		$(this.el).empty();
		this.rendered = false;
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
	}
	
	notify(options) {
		const self = this;
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_title = LM['translation'][sel]['USER_ELECTRICITY_CHART_TITLE'];
		const localized_string_x_days = LM['translation'][sel]['USER_CHART_X_DAYS'];
		
		if (this.controller.visible) {
			if (options.model==='UserElectricityTSModel' && options.method==='fetched') {
				if (this.rendered===true) {
					if (options.status === 200) {
						//console.log(['Notify: ',options.model,' fetched!']);
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							
							//am4core.iter.each(this.chart.series.iterator(), function (s) {
								//s.data = self.models['UserElectricityTSModel'].energyValues;
							//});
							
							// This placeholder is defined in UECWrapperView.
							const len = self.models['UserElectricityTSModel'].energyValues.length;
							$('#time-series-title').empty().append(localized_string_title+' '+len+' '+localized_string_x_days);
							
						} else {
							this.renderChart();
						}
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to controller forceLogout() action.
							// Force LOGOUT if Auth failed!
							// Call View-class method to handle error.
							this.forceLogout(this.FELID);
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					}
				}
				
				
			} else if (options.model==='UserElectricityTSModel' && options.method==='fetched-all') {
				$("#time-series-progress-info").empty();
				this.render();
			}
		}
	}
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_energy = LM['translation'][sel]['USER_ELECTRICITY_CHART_TITLE'];
		const localized_string_target = LM['translation'][sel]['USER_DATA_TARGET'].toUpperCase();
		const localized_string_upper_limit = LM['translation'][sel]['USER_DATA_UPPER_LIMIT'].toUpperCase();
		const localized_string_lower_limit = LM['translation'][sel]['USER_DATA_LOWER_LIMIT'].toUpperCase();
		
		
		// Fill the targets-object with values from UserModel.
		
		const UM = this.controller.master.modelRepo.get('UserModel');
		
		const EU = UM.energy_upper;
		const ET = UM.energy_target;
		const EL = UM.energy_lower;
		
		const refreshId = this.el.slice(1);
		
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			console.log(['values=',self.models['UserElectricityTSModel'].energyValues]);
			
			// Create chart
			self.chart = am4core.create("uec-energy-ts-chart", am4charts.XYChart);
			self.chart.padding(0, 15, 0, 15);
			self.chart.colors.step = 3;
			
			// the following line makes value axes to be arranged vertically.
			self.chart.leftAxesContainer.layout = "vertical";
			
			// uncomment this line if you want to change order of axes
			//chart.bottomAxesContainer.reverseOrder = true;
			// Round all numbers to integer
			self.chart.numberFormatter.numberFormat = "#.";
			
			const dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			
			dateAxis.renderer.grid.template.location = 0;
			dateAxis.renderer.ticks.template.length = 8;
			dateAxis.renderer.ticks.template.strokeOpacity = 0.3;
			dateAxis.renderer.grid.template.disabled = false;
			dateAxis.renderer.ticks.template.disabled = false;
			//dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
			dateAxis.renderer.minLabelPosition = 0.1; //0.01;
			dateAxis.renderer.maxLabelPosition = 0.9; //0.99;
			dateAxis.minHeight = 30;
			
			// these two lines makes the axis to be initially zoomed-in
			//dateAxis.start = 0.5;
			dateAxis.keepSelection = true;
			dateAxis.tooltipDateFormat = "dd.MM.yyyy"; // - HH:mm";
			// Axis for 
			//			this.influxModel.dealsBidsAppKey.forEach(item => {
			//				this.sumBids += item.totalprice;
			//			});
			// and 
			//			this.influxModel.dealsAsksAppKey.forEach(item => {
			//				this.sumAsks += item.totalprice;
			//			});
			const valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			
			valueAxis.min = 0;
			valueAxis.max = EU;
			valueAxis.strictMinMax = true;
			// Pad values by 10%
			valueAxis.extraMin = 0.1;
			valueAxis.extraMax = 0.1; 
			
			valueAxis.zIndex = 1;
			valueAxis.marginTop = 0;
			valueAxis.renderer.baseGrid.disabled = true;
			// height of axis
			valueAxis.height = am4core.percent(50);
			
			valueAxis.renderer.gridContainer.background.fill = am4core.color("#000");
			valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
			valueAxis.renderer.inside = false;
			valueAxis.renderer.labels.template.verticalCenter = "bottom";
			valueAxis.renderer.labels.template.padding(2, 2, 2, 2);
			
			valueAxis.renderer.maxLabelPosition = 0.95;
			valueAxis.renderer.fontSize = "0.75em";
			valueAxis.title.text = localized_string_energy;
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " kWh";
			});
			
			//valueAxis.min = 0;
			//valueAxis.max = 200;
			const series1 = self.chart.series.push(new am4charts.ColumnSeries());
			//const series1 = self.chart.series.push(new am4charts.LineSeries());
			//const series1 = self.chart.series.push(new am4charts.StepLineSeries());
			series1.defaultState.transitionDuration = 0;
			series1.tooltipText = "{valueY.value} kWh";
			
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.stroke = am4core.color("#0f0");
			series1.strokeWidth = 1;
			series1.fill = series1.stroke;
			series1.fillOpacity = 0.2;
			
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			series1.tooltip.label.fill = series1.stroke;
			
			series1.data = self.models['UserElectricityTSModel'].energyValues;
			series1.dataFields.dateX = "time";
			series1.dataFields.valueY = "energy";
			series1.name = "ENERGY";
			series1.yAxis = valueAxis;
			
			
			
			
			// TARGETS AND UPPER AND LOWER LIMITS
			var target = valueAxis.axisRanges.create();
			target.value = ET;
			target.grid.stroke = am4core.color("#8f8");
			target.grid.strokeWidth = 1;
			target.grid.strokeOpacity = 0.5;
			//target.grid.above = true;
			target.label.inside = true;
			target.label.text = localized_string_target + ' ' + target.value.toFixed(0);
			target.label.fill = target.grid.stroke;
			target.label.fillOpacity = target.grid.strokeOpacity;
			//target.label.align = "right";
			target.label.verticalCenter = "bottom";
			
			var range = valueAxis.axisRanges.create();
			range.value = EU;
			range.grid.stroke = am4core.color("#8f8");
			range.grid.strokeWidth = 1;
			range.grid.strokeOpacity = 0.5;
			//range.grid.above = true;
			range.label.inside = true;
			range.label.text = localized_string_upper_limit + ' ' + range.value.toFixed(0);
			range.label.fill = range.grid.stroke;
			range.label.fillOpacity = range.grid.strokeOpacity;
			//range.label.align = "right";
			range.label.verticalCenter = "bottom";
			
			var range2 = valueAxis.axisRanges.create();
			range2.value = EL;
			range2.grid.stroke = am4core.color("#8f8");
			range2.grid.strokeWidth = 1;
			range2.grid.strokeOpacity = 0.5;
			//range2.grid.above = true;
			range2.label.inside = true;
			range2.label.text = localized_string_lower_limit + ' ' + range2.value.toFixed(0);
			range2.label.fill = range2.grid.stroke;
			range2.label.fillOpacity = range2.grid.strokeOpacity;
			//range2.label.align = "right";
			range2.label.verticalCenter = "top";
			
			/*
			self.chart.legend = new am4charts.Legend();
			self.chart.legend.useDefaultMarker = true;
			var marker = self.chart.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			*/
			
			// Cursor
			self.chart.cursor = new am4charts.XYCursor();
			
			//console.log(['series1.data=',series1.data]);
			
			// Scrollbar
			//const scrollbarX = new am4charts.XYChartScrollbar();
			/*
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series1);
			self.chart.scrollbarX.marginBottom = 20;
			self.chart.scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
			*/
			console.log('UEC ENERGY TS RENDER CHART END =====================');
		}); // end am4core.ready()
		
		
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const refreshId = this.el.slice(1);
		
		const html =
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="uec-energy-ts-chart" class="medium-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('UECEnergyTSChartView => render models READY!!!!');
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				this.renderChart();
			}
		} else {
			console.log('UECEnergyTSChartView => render models ARE NOT READY!!!!');
			this.showSpinner('#uec-energy-ts-chart');
		}
	}
}
