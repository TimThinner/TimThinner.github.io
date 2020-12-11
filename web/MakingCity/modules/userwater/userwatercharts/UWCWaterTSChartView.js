/*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

*/
import View from '../../common/View.js';
export default class UWCWaterTSChartView extends View {
	
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
			if (key==='UserWaterTSModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.chart = undefined;
		this.rendered = false;
		this.CHARTID = 'uwc-water-ts-chart';
		this.FELID = this.CHARTID + '-view-failure';
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
	
	appendTotal() {
		let hot = 0;
		let cold = 0;
		if (this.models['UserWaterTSModel'].waterValues.length > 0) {
			this.models['UserWaterTSModel'].waterValues.forEach(e=>{
				hot += e.hot;
				cold += e.cold;
			});
		}
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_hot = LM['translation'][sel]['USER_WATER_CHART_LEGEND_HOT'];
		const localized_string_cold = LM['translation'][sel]['USER_WATER_CHART_LEGEND_COLD'];
		
		const html = '<p>TOTAL: <span style="color:#f00">'+localized_string_hot+': '+hot.toFixed(0)+' L</span><span style="color:#0ff">&nbsp;'+localized_string_cold+': '+cold.toFixed(0)+' L</span></p>';
		$('#'+this.CHARTID+'-total').empty().append(html);
	}
	
	notify(options) {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_title = LM['translation'][sel]['USER_WATER_CHART_TITLE'];
		const localized_string_x_days = LM['translation'][sel]['USER_CHART_X_DAYS'];
		
		if (this.controller.visible) {
			if (options.model==='UserWaterTSModel' && options.method==='fetched') {
				if (this.rendered===true) {
					if (options.status === 200) {
						//console.log(['Notify: ',options.model,' fetched!']);
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							//am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*if (s.name === localized_string_hot) {
									console.log('NOTIFY HOT');
									s.columns.template.dx++;
								} else {
									console.log('NOTIFY COLD');
									s.columns.template.dx--;
								}*/
								
								
								//s.data = self.models['UserWaterTSModel'].waterValues;
								
								
							//});
							
							this.appendTotal();
							
							// This placeholder is defined in UECWrapperView.
							const len = self.models['UserWaterTSModel'].waterValues.length;
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
			} else if (options.model==='UserWaterTSModel' && options.method==='fetched-all') {
				//$("#time-series-progress-info").empty();
				this.render();
			}
		}
	}
	
	renderChart() {
		const self = this;
		
		/*
		console.log('RENDER CHARTTTRRRRTTTT!');
		Object.keys(this.models).forEach(key => {
			
			console.log(['key=',key]);
			
			const name = this.models[key].name;
			
			if (this.models[key].measurement.length > 0) {
				const hot = this.models[key].measurement[0].hotTotal;
				const cold = this.models[key].measurement[0].coldTotal;
				const created = this.models[key].measurement[0].created;
				console.log(['name=',name,' created=',created,' hotTotal=',hot,' coldTotal=',cold]);
			}
			
		});
		
		*/
		
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_water = LM['translation'][sel]['USER_WATER_CHART_TITLE'];
		const localized_string_hot = LM['translation'][sel]['USER_WATER_CHART_LEGEND_HOT'];
		const localized_string_cold = LM['translation'][sel]['USER_WATER_CHART_LEGEND_COLD'];
		const localized_string_target = LM['translation'][sel]['USER_DATA_TARGET'].toUpperCase();
		const localized_string_upper_limit = LM['translation'][sel]['USER_DATA_UPPER_LIMIT'].toUpperCase();
		const localized_string_lower_limit = LM['translation'][sel]['USER_DATA_LOWER_LIMIT'].toUpperCase();
		
		
		// Fill the targets-object with values from UserModel.
		const UM = this.controller.master.modelRepo.get('UserModel');
		
		const WHU = UM.water_hot_upper;
		const WHT = UM.water_hot_target;
		const WHL = UM.water_hot_lower;
		
		const WCU = UM.water_cold_upper;
		const WCT = UM.water_cold_target;
		const WCL = UM.water_cold_lower;
		
		const refreshId = this.el.slice(1);
		
		
		//const vallen = self.models['UserWaterTSModel'].waterValues.length;
		//console.log(['vallen=',vallen]);
		
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			console.log(['values=',self.models['UserWaterTSModel'].waterValues]);
			
			// Create chart
			self.chart = am4core.create(self.CHARTID, am4charts.XYChart);
			self.chart.padding(0, 15, 0, 15);
			self.chart.colors.step = 3;
			
			// the following line makes value axes to be arranged vertically.
			self.chart.leftAxesContainer.layout = "vertical";
			
			//self.chart.zoomOutButton.disabled = true;
			
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
			dateAxis.tooltipDateFormat = "dd.MM.yyyy";// - HH:mm";
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
			valueAxis.max = WCU;
			valueAxis.strictMinMax = true;
			// Pad values by 20%
			valueAxis.extraMin = 0.2;
			valueAxis.extraMax = 0.2;
			
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
			valueAxis.title.text = localized_string_water;
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " L";
			});
			
			const series1 = self.chart.series.push(new am4charts.ColumnSeries());
			//const series1 = self.chart.series.push(new am4charts.LineSeries());
			//const series1 = self.chart.series.push(new am4charts.StepLineSeries());
			series1.defaultState.transitionDuration = 0;
			series1.tooltipText = "{valueY.value} L";
			
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.stroke = am4core.color("#f00");
			series1.strokeWidth = 2;
			series1.fill = series1.stroke;
			series1.fillOpacity = 0.5;
			
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			series1.tooltip.label.fill = series1.stroke;
			
			series1.data = self.models['UserWaterTSModel'].waterValues;
			series1.dataFields.dateX = "time";
			series1.dataFields.valueY = "hot";
			series1.name = localized_string_hot; // 'HOOT'; 
			series1.yAxis = valueAxis;
			
			series1.columns.template.width = am4core.percent(50);
			series1.clustered = false;
			series1.columns.template.dx = -5;
			
			
			const series2 = self.chart.series.push(new am4charts.ColumnSeries());
			//const series2 = self.chart.series.push(new am4charts.LineSeries());
			//const series2 = self.chart.series.push(new am4charts.StepLineSeries());
			series2.defaultState.transitionDuration = 0;
			series2.tooltipText = "{valueY.value} L";
			
			series2.tooltip.getFillFromObject = false;
			series2.tooltip.getStrokeFromObject = true;
			series2.stroke = am4core.color("#0ff");
			series2.strokeWidth = 2;
			series2.fill = series2.stroke;
			series2.fillOpacity = 0.25;
			
			series2.tooltip.background.fill = am4core.color("#000");
			series2.tooltip.background.strokeWidth = 1;
			series2.tooltip.label.fill = series2.stroke;
			
			series2.data = self.models['UserWaterTSModel'].waterValues;
			series2.dataFields.dateX = "time";
			series2.dataFields.valueY = "cold";
			series2.name = localized_string_cold; // 'COOLD';
			series2.yAxis = valueAxis;
			
			series2.columns.template.width = am4core.percent(50);
			series2.clustered = false;
			series2.columns.template.dx = 5;
			//series2.columns.template.align = "left";
			
			// TARGETS AND UPPER AND LOWER LIMITS
			var target = valueAxis.axisRanges.create();
			target.value = WHT;
			target.grid.stroke = am4core.color("#f88");
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
			range.value = WHU;
			range.grid.stroke = am4core.color("#f88");
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
			range2.value = WHL;
			range2.grid.stroke = am4core.color("#f88");
			range2.grid.strokeWidth = 1;
			range2.grid.strokeOpacity = 0.5;
			//range2.grid.above = true;
			range2.label.inside = true;
			range2.label.text = localized_string_lower_limit + ' ' + range2.value.toFixed(0);
			range2.label.fill = range2.grid.stroke;
			range2.label.fillOpacity = range2.grid.strokeOpacity;
			//range2.label.align = "right";
			range2.label.verticalCenter = "top";
			
			var target2 = valueAxis.axisRanges.create();
			target2.value = WCT;
			target2.grid.stroke = am4core.color("#8ff");
			target2.grid.strokeWidth = 1;
			target2.grid.strokeOpacity = 0.5;
			//target2.grid.above = true;
			target2.label.inside = true;
			target2.label.text = localized_string_target + ' ' + target2.value.toFixed(0);
			target2.label.fill = target2.grid.stroke;
			target2.label.fillOpacity = target2.grid.strokeOpacity;
			target2.label.align = "right";
			target2.label.verticalCenter = "bottom";
			
			var range3 = valueAxis.axisRanges.create();
			range3.value = WCU;
			range3.grid.stroke = am4core.color("#8ff");
			range3.grid.strokeWidth = 1;
			range3.grid.strokeOpacity = 0.5;
			//range3.grid.above = true;
			range3.label.inside = true;
			range3.label.text = localized_string_upper_limit + ' ' + range3.value.toFixed(0);
			range3.label.fill = range3.grid.stroke;
			range3.label.fillOpacity = range3.grid.strokeOpacity;
			range3.label.align = "right";
			range3.label.verticalCenter = "bottom";
			
			var range4 = valueAxis.axisRanges.create();
			range4.value = WCL;
			range4.grid.stroke = am4core.color("#8ff");
			range4.grid.strokeWidth = 1;
			range4.grid.strokeOpacity = 0.5;
			//range4.grid.above = true;
			range4.label.inside = true;
			range4.label.text = localized_string_lower_limit + ' ' + range4.value.toFixed(0);
			range4.label.fill = range4.grid.stroke;
			range4.label.fillOpacity = range4.grid.strokeOpacity;
			range4.label.align = "right";
			range4.label.verticalCenter = "top";
			
			
			self.chart.legend = new am4charts.Legend();
			self.chart.legend.useDefaultMarker = true;
			var marker = self.chart.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
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
			
			console.log('UWC WATER TS RENDER CHART END =====================');
		}); // end am4core.ready()
		
		this.appendTotal();
		
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const refreshId = this.el.slice(1);
		
		const html =
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="'+this.CHARTID+'" class="medium-chart"></div>'+
					'<div id="'+this.CHARTID+'-total"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('UWCWaterTSChartView => render models READY!!!!');
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
			console.log('UWCWaterTSChartView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
