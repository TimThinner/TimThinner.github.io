/*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

*/
import View from '../common/View.js';
export default class KitchenPowerChartView extends View {
	
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
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.chart = undefined;
		this.rendered = false;
		this.FELID = 'kitchen-power-chart-view-failure';
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
		if (this.controller.visible) {
			if ((options.model==='Kitchen106Model'|| 
				options.model==='Kitchen107Model'|| 
				options.model==='Kitchen108Model') && options.method==='fetched') {
				if (this.rendered) {
					if (options.status === 200) {
						
						$('#'+this.FELID).empty();
						
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... KitchenPowerChartView CHART UPDATED!');
							// 106								R3 Owen
							// 107								R4 Owen
							// 108								Dishwasher
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								if (s.name === 'R3 Oven') {
									s.data = self.models['Kitchen106Model'].values;
									
								} else if (s.name === 'R4 Oven') {
									s.data = self.models['Kitchen107Model'].values;
									
								} else {
									s.data = self.models['Kitchen108Model'].values;
								}
							});
							
						} else {
							console.log('fetched ..... KitchenPowerChartView renderChart()');
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
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_power = LM['translation'][sel]['DAA_POWER'];
		
		const refreshId = this.el.slice(1);
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			
			// Create chart
			self.chart = am4core.create("kitchen-power-chart", am4charts.XYChart);
			self.chart.padding(0, 15, 0, 15);
			self.chart.colors.step = 3;
			
			// the following line makes value axes to be arranged vertically.
			self.chart.leftAxesContainer.layout = "vertical";
			
			// uncomment this line if you want to change order of axes
			//chart.bottomAxesContainer.reverseOrder = true;
			
			self.chart.numberFormatter.numberFormat = "#.##";
			
			const dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			
			dateAxis.renderer.grid.template.location = 0;
			dateAxis.renderer.ticks.template.length = 8;
			dateAxis.renderer.ticks.template.strokeOpacity = 0.3;
			dateAxis.renderer.grid.template.disabled = true;
			dateAxis.renderer.ticks.template.disabled = false;
			//dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
			dateAxis.renderer.minLabelPosition = 0.1; //0.01;
			dateAxis.renderer.maxLabelPosition = 0.9; //0.99;
			dateAxis.minHeight = 30;
			
			// these two lines makes the axis to be initially zoomed-in
			//dateAxis.start = 0.5;
			dateAxis.keepSelection = true;
			dateAxis.tooltipDateFormat = "dd.MM.yyyy - HH:mm";
			
			const valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
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
			valueAxis.title.text = localized_string_power;
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " kW";
			});
			
			//valueAxis.min = 0;
			//valueAxis.max = 200;
			
			/*
			NOTE: 
			Use this order:
				R3 Oven 	blue
				R4 Oven 	red
				Dishwasher	orange
			*/
			
			// 106								R3 Oven
			
			const series1 = self.chart.series.push(new am4charts.StepLineSeries());
			//series1.tooltipText = "{name}: {valueY.value} kW";
			series1.tooltipText = "{valueY.value} kW";
			series1.stroke = am4core.color("#0ff");
			series1.fill = series1.stroke;
			//series1.fillOpacity = 0.1;
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			series1.tooltip.label.fill = series1.stroke;
			series1.data = self.models['Kitchen106Model'].values;
			series1.dataFields.dateX = "time";
			series1.dataFields.valueY = "averagePower";
			series1.name = "R3 Oven";
			series1.yAxis = valueAxis;
			
			// 107								R4 Oven
			
			const series2 = self.chart.series.push(new am4charts.StepLineSeries());
			series2.defaultState.transitionDuration = 0;
			series2.tooltipText = "{valueY.value} kW";
			//series2.tooltipText = "{name}: {valueY.value} kW";
			//series2.tooltipText = localized_string_power + ": {valueY.value} kW";
			series2.tooltip.getFillFromObject = false;
			series2.tooltip.getStrokeFromObject = true;
			series2.stroke = am4core.color("#f80");
			series2.fill = series2.stroke;
			//series2.fillOpacity = 0.1;
			series2.tooltip.background.fill = am4core.color("#000");
			series2.tooltip.background.strokeWidth = 1;
			series2.tooltip.label.fill = series2.stroke;
			series2.data = self.models['Kitchen107Model'].values;
			series2.dataFields.dateX = "time";
			series2.dataFields.valueY = "averagePower";
			series2.name = "R4 Oven";
			series2.yAxis = valueAxis;
			
			// 108								Dishwasher
			const series3 = self.chart.series.push(new am4charts.StepLineSeries());
			//series3.tooltipText = "{name}: {valueY.value} kW";
			series3.tooltipText = "{valueY.value} kW";
			series3.stroke = am4core.color("#ff0");
			series3.fill = series3.stroke;
			//series3.fillOpacity = 0.1;
			series3.tooltip.getFillFromObject = false;
			series3.tooltip.getStrokeFromObject = true;
			series3.tooltip.background.fill = am4core.color("#000");
			series3.tooltip.background.strokeWidth = 1;
			series3.tooltip.label.fill = series3.stroke;
			series3.data = self.models['Kitchen108Model'].values;
			series3.dataFields.dateX = "time";
			series3.dataFields.valueY = "averagePower";
			series3.name = "Dishwasher";
			series3.yAxis = valueAxis;
			
			self.chart.legend = new am4charts.Legend();
			self.chart.legend.useDefaultMarker = true;
			var marker = self.chart.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
			//self.chart.legend.labels.template.text = "[font-size: 14px]{name}";
			//createLabel("Hello [font-size: 30px]world[/]!");
			//createLabel("Hello [red bold font-size: 30px]world[/]!");
			
			// Cursor
			self.chart.cursor = new am4charts.XYCursor();
			
			//console.log(['series1.data=',series1.data]);
			
			// Scrollbar
			
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series3);
			self.chart.scrollbarX.marginBottom = 20;
			self.chart.scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
			
			/**
 			* Set up external controls
 			*/
			
			// Date format to be used in input fields
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
			}
			
			console.log('KITCHEN POWER RENDER CHART END =====================');
			
		}); // end am4core.ready()
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_adjust_interval = LM['translation'][sel]['ADJUST_UPDATE_INTERVAL'];
		
		const refreshId = this.el.slice(1);
		const html =
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
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
					
					'<div id="kitchen-power-chart" class="medium-chart"></div>'+
					
					'<p style="font-size:14px;text-align:right;color:#0e9e36;" id="'+refreshId+'-chart-refresh-note"></p>'+
					'<p style="font-size:14px;text-align:left;" class="range-field">'+localized_string_adjust_interval+
						'<input type="range" id="'+refreshId+'-chart-refresh-interval" min="0" max="60"><span class="thumb"><span class="value"></span></span>'+
					'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		this.wrapper.handlePollingInterval(refreshId);
		
		if (this.areModelsReady()) {
			
			console.log('KitchenPowerChartView => render models READY!!!!');
			this.handleErrorMessages(this.FELID);
			this.renderChart();
			
		} else {
			console.log('KitchenPowerChartView => render models ARE NOT READY!!!!');
			this.showSpinner('#kitchen-power-chart');
		}
	}
}
