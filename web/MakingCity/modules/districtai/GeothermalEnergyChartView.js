/*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

*/
import View from '../common/View.js';
export default class GeothermalEnergyChartView extends View {
	
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
			if (key === 'GeothermalModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.chart = undefined;
		this.rendered = false;
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
			if (options.model==='GeothermalModel' && options.method==='fetched') {
				if (this.rendered===true) {
					if (options.status === 200) {
						$('#geothermal-energy-chart-view-failure').empty();
						
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... GeothermalEnergyChartView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								s.data = self.models['GeothermalModel'].energyValues;
							});
						} else {
							console.log('fetched ..... render GeothermalEnergyChartView()');
							this.renderChart();
						}
					} else { // Error in fetching.
						$('#geothermal-energy-chart-view-failure').empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#geothermal-energy-chart-view-failure');
					}
				}
			}
		}
	}
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_energy = LM['translation'][sel]['DAA_ENERGY'];
		
		const refreshId = this.el.slice(1);
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			console.log(['values=',self.models['GeothermalModel'].energyValues]);
			
			// Create chart
			self.chart = am4core.create("geothermal-energy-chart", am4charts.XYChart);
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
			
			//valueAxis.min = 0;
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
			//series1.tooltipText = "{name}: {valueY.value} kWh";
			series1.tooltipText = localized_string_energy + ": {valueY.value} kWh";
			
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.stroke = am4core.color("#000");
			series1.fill = series1.stroke;
			series1.fillOpacity = 0.2;
			
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			//series1.tooltip.label.fill = series1.stroke;
			
			series1.data = self.models['GeothermalModel'].energyValues;
			series1.dataFields.dateX = "time";
			series1.dataFields.valueY = "energy";
			series1.name = "ENERGY";
			series1.yAxis = valueAxis;
			
			/*
			series1.tooltip.adapter.add("fill", function(fill, target) {
				console.log(['target=',target]);
				console.log(['target.tooltipDataItem=',target.tooltipDataItem]);
				console.log(['target.tooltipDataItem.values=',target.tooltipDataItem.values]);
				console.log(['target.tooltipDataItem.values.valueY=',target.tooltipDataItem.values.valueY]);
				console.log(['target.tooltipDataItem.valueY=',target.tooltipDataItem.valueY]);
				if (target.tooltipDataItem && (target.tooltipDataItem.valueY < 0)) {
					return am4core.color("#f77");
				} else {
					return fill;
				}
			});*/
			
			
			series1.adapter.add("tooltipText", function(tooltipText) {
				if (series1.tooltipDataItem.dataContext) {
					if (series1.tooltipDataItem.dataContext.energy < 0) {
						series1.tooltip.stroke = am4core.color("#f77");
						series1.tooltip.label.fill = series1.tooltip.stroke;
					} else {
						series1.tooltip.stroke = am4core.color("#0f0");
						series1.tooltip.label.fill = series1.tooltip.stroke;
					}
				}
				return tooltipText;
			});
			
			const columnTemplate = series1.columns.template;
			console.log(['columnTemplate=',columnTemplate]);
			//columnTemplate.tooltipText = "{categoryX}: [bold]{valueY}[/]";
			columnTemplate.fillOpacity = 0.8;
			columnTemplate.strokeOpacity = 1; // 0
			columnTemplate.fill = am4core.color("#0f0");
			
			columnTemplate.adapter.add("fill", function(fill, target) {
				if (target.dataItem && (target.dataItem.valueY < 0)) {
					return am4core.color("#f77");
				} else {
					return fill;
				}
			});
			/*
			columnTemplate.adapter.add("stroke", function(stroke, target) {
				if (target.dataItem && (target.dataItem.valueY < 0)) {
					return am4core.color("#f77");
				} else {
					return am4core.color("#0f0");
				}
			});
			*/
			
			// Cursor
			self.chart.cursor = new am4charts.XYCursor();
			
			
			console.log(['series1.data=',series1.data]);
			
			// Scrollbar
			//const scrollbarX = new am4charts.XYChartScrollbar();
			
			//self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			//self.chart.scrollbarX.series.push(series1);
			//self.chart.scrollbarX.marginBottom = 20;
			//self.chart.scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
			
			
			
			var scrollbarX = new am4charts.XYChartScrollbar();
			scrollbarX.series.push(series1);
			scrollbarX.marginBottom = 20;
			scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
			self.chart.scrollbarX = scrollbarX;
			
			
			
			// When you add a series to an XYChartScrollbar by pushing it into its series list, scrollbar makes an exact copy and places it into series list of its child element: scrollbarChart, which is a separate copy of XYChart.
			//console.log(['self.chart.scrollbarX=',self.chart.scrollbarX]);
			//console.log(['self.chart.scrollbarX.background=',self.chart.scrollbarX.background]);
			//self.chart.scrollbarX.background.fill = am4core.color("#017acd");
			
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
			console.log('Geothermal Energy RENDER CHART END =====================');
		}); // end am4core.ready()
	}
	
	
	
	render() {
		const self = this;
		$(this.el).empty();
		
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
					'<div id="geothermal-energy-chart" class="energy-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="geothermal-energy-chart-view-failure"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('GeothermalEnergyChartView => render models READY!!!!');
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="geothermal-energy-chart-view-failure">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
			} else {
				this.renderChart();
			}
		} else {
			console.log('GeothermalEnergyChartView => render models ARE NOT READY!!!!');
			this.showSpinner('#geothermal-energy-chart');
		}
	}
}
