/*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

*/
import View from '../../common/View.js';
export default class UHCHeatingChartView extends View {
	
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
			if (key === 'UserHeatingALLModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.chart = undefined;
		this.rendered = false;
		this.FELID = 'uhc-heating-chart-view-failure';
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
	
	appendAverage() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_average = LM['translation'][sel]['USER_HEATING_CHART_AVERAGE'];
		
		const values = this.models['UserHeatingALLModel'].values;
		if (Array.isArray(values) && values.length > 0) {
			let sum_temp = 0;
			let sum_humi = 0;
			values.forEach(v => {
				sum_temp += v.temperature;
				sum_humi += v.humidity;
			});
			const ave_temp = sum_temp/values.length;
			const ave_humi = sum_humi/values.length;
			
			const html = '<p>'+localized_string_average+': <span style="color:#f00">'+ave_temp.toFixed(1)+' °C&nbsp;&nbsp;&nbsp;</span><span style="color:#0ff">'+ave_humi.toFixed(1)+' %</span></p>';
			$('#uhc-heating-average').empty().append(html);
		} else {
			const html = '<p>'+localized_string_average+': <span style="color:#f00">- °C&nbsp;&nbsp;&nbsp;</span><span style="color:#0ff"> - %</span></p>';
			$('#uhc-heating-average').empty().append(html);
		}
	}
	
	
	notify(options) {
		const self = this;
		if (this.controller.visible) {
			if (options.model==='UserHeatingALLModel' && options.method==='fetched') {
				if (this.rendered===true) {
					if (options.status === 200) {
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							//console.log('fetched ..... UHCHeatingChartView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								s.data = self.models['UserHeatingALLModel'].values;
							});
							this.appendAverage();
							
						} else {
							console.log('fetched ..... render UHCHeatingChartView()');
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
			}
		}
	}
	
	/*
	humidity: 37.7
	meterId: 201​​​​
	residentId: 1
	temperature: 22.8
	*/
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_heating = LM['translation'][sel]['USER_PAGE_HEATING'];
		const localized_string_temperature = LM['translation'][sel]['USER_HEATING_CHART_LEGEND_TEMPERATURE'];
		const localized_string_humidity = LM['translation'][sel]['USER_HEATING_CHART_LEGEND_HUMIDITY'];
		const localized_string_target = LM['translation'][sel]['USER_DATA_TARGET'].toUpperCase();
		const localized_string_upper_limit = LM['translation'][sel]['USER_DATA_UPPER_LIMIT'].toUpperCase();
		const localized_string_lower_limit = LM['translation'][sel]['USER_DATA_LOWER_LIMIT'].toUpperCase();
		
		const refreshId = this.el.slice(1);
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			console.log(['values=',self.models['UserHeatingALLModel'].values]);
			
			// Create chart
			self.chart = am4core.create("uhc-heating-chart", am4charts.XYChart);
			self.chart.padding(0, 15, 0, 15);
			self.chart.colors.step = 3;
			
			// the following line makes value axes to be arranged vertically.
			self.chart.leftAxesContainer.layout = "vertical";
			
			// uncomment this line if you want to change order of axes
			//chart.bottomAxesContainer.reverseOrder = true;
			
			self.chart.numberFormatter.numberFormat = "#.#";
			
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
			dateAxis.tooltipDateFormat = "dd.MM.yyyy - HH:mm";
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
			valueAxis.title.text = localized_string_heating;
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text; // + " L";
			});
			
			//valueAxis.min = 0;
			//valueAxis.max = 200;
			//const series1 = self.chart.series.push(new am4charts.ColumnSeries());
			const series1 = self.chart.series.push(new am4charts.LineSeries());
			//const series1 = self.chart.series.push(new am4charts.StepLineSeries());
			series1.defaultState.transitionDuration = 0;
			series1.tooltipText = "{valueY.value} °C";
			
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.stroke = am4core.color("#f00");
			series1.strokeWidth = 2;
			series1.fill = series1.stroke;
			series1.fillOpacity = 0;
			
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			series1.tooltip.label.fill = series1.stroke;
			
			series1.data = self.models['UserHeatingALLModel'].values;
			series1.dataFields.dateX = "time";
			series1.dataFields.valueY = "temperature";
			series1.name = localized_string_temperature;
			series1.yAxis = valueAxis;
			
			
			//const series2 = self.chart.series.push(new am4charts.ColumnSeries());
			const series2 = self.chart.series.push(new am4charts.LineSeries());
			//const series2 = self.chart.series.push(new am4charts.StepLineSeries());
			series2.defaultState.transitionDuration = 0;
			series2.tooltipText = "{valueY.value} %";
			
			series2.tooltip.getFillFromObject = false;
			series2.tooltip.getStrokeFromObject = true;
			series2.stroke = am4core.color("#0ff");
			series2.strokeWidth = 2;
			series2.fill = series2.stroke;
			series2.fillOpacity = 0;
			
			series2.tooltip.background.fill = am4core.color("#000");
			series2.tooltip.background.strokeWidth = 1;
			series2.tooltip.label.fill = series2.stroke;
			
			series2.data = self.models['UserHeatingALLModel'].values;
			series2.dataFields.dateX = "time";
			series2.dataFields.valueY = "humidity";
			series2.name = localized_string_humidity;
			series2.yAxis = valueAxis;
			
			
			
			// TARGETS AND UPPER AND LOWER LIMITS
			var target = valueAxis.axisRanges.create();
			target.value = 22;
			target.grid.stroke = am4core.color("#f88");
			target.grid.strokeWidth = 1;
			target.grid.strokeOpacity = 0.5;
			//target.grid.above = true;
			target.label.inside = true;
			target.label.text = localized_string_target + ' ' + target.value;
			target.label.fill = target.grid.stroke;
			target.label.fillOpacity = target.grid.strokeOpacity;
			//target.label.align = "right";
			target.label.verticalCenter = "bottom";
			
			var range = valueAxis.axisRanges.create();
			range.value = 26;
			range.grid.stroke = am4core.color("#f88");
			range.grid.strokeWidth = 1;
			range.grid.strokeOpacity = 0.5;
			//range.grid.above = true;
			range.label.inside = true;
			range.label.text = localized_string_upper_limit + ' ' + range.value;
			range.label.fill = range.grid.stroke;
			range.label.fillOpacity = range.grid.strokeOpacity;
			//range.label.align = "right";
			range.label.verticalCenter = "bottom";
			
			var range2 = valueAxis.axisRanges.create();
			range2.value = 18;
			range2.grid.stroke = am4core.color("#f88");
			range2.grid.strokeWidth = 1;
			range2.grid.strokeOpacity = 0.5;
			//range2.grid.above = true;
			range2.label.inside = true;
			range2.label.text = localized_string_lower_limit + ' ' + range2.value;
			range2.label.fill = range2.grid.stroke;
			range2.label.fillOpacity = range2.grid.strokeOpacity;
			//range2.label.align = "right";
			range2.label.verticalCenter = "top";
			
			
			
			var target2 = valueAxis.axisRanges.create();
			target2.value = 40;
			target2.grid.stroke = am4core.color("#8ff");
			target2.grid.strokeWidth = 1;
			target2.grid.strokeOpacity = 0.5;
			//target2.grid.above = true;
			target2.label.inside = true;
			target2.label.text = localized_string_target + ' ' + target2.value;
			target2.label.fill = target2.grid.stroke;
			target2.label.fillOpacity = target2.grid.strokeOpacity;
			target2.label.align = "right";
			target2.label.verticalCenter = "bottom";
			
			
			var range3 = valueAxis.axisRanges.create();
			range3.value = 45;
			range3.grid.stroke = am4core.color("#8ff");
			range3.grid.strokeWidth = 1;
			range3.grid.strokeOpacity = 0.5;
			//range3.grid.above = true;
			range3.label.inside = true;
			range3.label.text = localized_string_upper_limit + ' ' + range3.value;
			range3.label.fill = range3.grid.stroke;
			range3.label.fillOpacity = range3.grid.strokeOpacity;
			range3.label.align = "right";
			range3.label.verticalCenter = "bottom";
			
			var range4 = valueAxis.axisRanges.create();
			range4.value = 35;
			range4.grid.stroke = am4core.color("#8ff");
			range4.grid.strokeWidth = 1;
			range4.grid.strokeOpacity = 0.5;
			//range4.grid.above = true;
			range4.label.inside = true;
			range4.label.text = localized_string_lower_limit + ' ' + range4.value;
			range4.label.fill = range4.grid.stroke;
			range4.label.fillOpacity = range4.grid.strokeOpacity;
			range4.label.align = "right";
			range4.label.verticalCenter = "top";
			
			
			// Create value axis range
			/*
			var range = valueAxis.axisRanges.create();
			range.value = 16;
			range.endValue = 28;
			range.axisFill.fill = am4core.color("#f00");
			range.axisFill.fillOpacity = 0.2;
			range.grid.strokeOpacity = 0;
			
			var range2 = valueAxis.axisRanges.create();
			range2.value = 32;
			range2.endValue = 42;
			range2.axisFill.fill = am4core.color("#0ff");
			range2.axisFill.fillOpacity = 0.2;
			range2.grid.strokeOpacity = 1;
			*/
			
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
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series1);
			self.chart.scrollbarX.marginBottom = 20;
			self.chart.scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
			
			
			/**
 			* Set up external controls
 			*/
			
			// Date format to be used in input fields
			/*
			const inputFieldFormat = "yyyy-MM-dd HH:mm";
			
			dateAxis.events.on("selectionextremeschanged", function() {
				updateFields();
			});
			
			dateAxis.events.on("extremeschanged", updateFields);
			
			function updateFields() {
				const minZoomed = dateAxis.minZoomed + am4core.time.getDuration(dateAxis.mainBaseInterval.timeUnit, dateAxis.mainBaseInterval.count) * 0.5;
				document.getElementById(refreshId+"-fromfield").value = self.chart.dateFormatter.format(minZoomed, inputFieldFormat);
				document.getElementById(refreshId+"-tofield").value = self.chart.dateFormatter.format(new Date(dateAxis.maxZoomed), inputFieldFormat);
			}
			
			document.getElementById(refreshId+"-fromfield").addEventListener("keyup", updateZoom);
			document.getElementById(refreshId+"-tofield").addEventListener("keyup", updateZoom);
			
			let zoomTimeout;
			function updateZoom() {
				if (zoomTimeout) {
					clearTimeout(zoomTimeout);
				}
				zoomTimeout = setTimeout(function() {
					const start = document.getElementById(refreshId+"-fromfield").value;
					const end = document.getElementById(refreshId+"-tofield").value;
					if ((start.length < inputFieldFormat.length) || (end.length < inputFieldFormat.length)) {
						return;
					}
					const startDate = self.chart.dateFormatter.parse(start, inputFieldFormat);
					const endDate = self.chart.dateFormatter.parse(end, inputFieldFormat);
					
					if (startDate && endDate) {
						dateAxis.zoomToDates(startDate, endDate);
					}
				}, 500);
				
			}*/
			console.log('UWC HEATING RENDER CHART END =====================');
		}); // end am4core.ready()
		
		this.appendAverage();
	}
	
	
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const refreshId = this.el.slice(1);
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		//const sel = LM.selected;
		//const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					/*
					'<div style="width: 100%; overflow: hidden;">'+ // id="controls"
						'<div class="input-field col s6">'+
							'<input id="'+refreshId+'-fromfield" type="text" class="amcharts-input">'+
							'<label for="'+refreshId+'-fromfield" class="active">From</label>'+
						'</div>'+
						'<div class="input-field col s6">'+
							'<input id="'+refreshId+'-tofield" type="text" class="amcharts-input">'+
							'<label for="'+refreshId+'-tofield" class="active">To</label>'+
						'</div>'+
					'</div>'+
					*/
					'<div id="uhc-heating-chart" class="large-chart"></div>'+
					'<div id="uhc-heating-average"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
/*.energy-chart {
	width: 100%;
	height: 300px;
	max-width: 100%;
}*/
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('UHCHeatingChartView => render models READY!!!!');
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
			console.log('UHCHeatingChartView => render models ARE NOT READY!!!!');
			this.showSpinner('#uhc-heating-chart');
		}
	}
}
