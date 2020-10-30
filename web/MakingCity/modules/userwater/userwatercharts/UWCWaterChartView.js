/*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

*/
import View from '../../common/View.js';
export default class UWCWaterChartView extends View {
	
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
			if (key === 'UserWaterALLModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.chart = undefined;
		this.rendered = false;
		this.FELID = 'uwc-water-chart-view-failure';
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
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_hot = LM['translation'][sel]['USER_WATER_CHART_LEGEND_HOT'];
		const localized_string_cold = LM['translation'][sel]['USER_WATER_CHART_LEGEND_COLD'];
		
		const minmax = this.models['UserWaterALLModel'].waterMinMax;
		
		const hot = minmax.hotmax - minmax.hotmin;
		const cold = minmax.coldmax - minmax.coldmin;
		
		const html = '<p>TOTAL: <span style="color:#f00">'+localized_string_hot+': '+hot.toFixed(0)+' L</span><span style="color:#0ff">&nbsp;'+localized_string_cold+': '+cold.toFixed(0)+' L</span></p>';
		$('#uwc-water-total').empty().append(html);
	}
	
	notify(options) {
		const self = this;
		if (this.controller.visible) {
			if (options.model==='UserWaterALLModel' && options.method==='fetched') {
				if (this.rendered===true) {
					if (options.status === 200) {
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							//console.log('fetched ..... UWCWaterChartView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								s.data = self.models['UserWaterALLModel'].waterValues;
							});
							this.appendTotal();
							
						} else {
							console.log('fetched ..... render UWCWaterChartView()');
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
		const localized_string_water = LM['translation'][sel]['USER_PAGE_WATER'];
		const localized_string_hot = LM['translation'][sel]['USER_WATER_CHART_LEGEND_HOT'];
		const localized_string_cold = LM['translation'][sel]['USER_WATER_CHART_LEGEND_COLD'];
		
		const refreshId = this.el.slice(1);
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			console.log(['values=',self.models['UserWaterALLModel'].waterValues]);
			
			// Create chart
			self.chart = am4core.create("uwc-water-chart", am4charts.XYChart);
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
			valueAxis.title.text = localized_string_water;
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " L";
			});
			
			//valueAxis.min = 0;
			//valueAxis.max = 200;
			//const series1 = self.chart.series.push(new am4charts.ColumnSeries());
			//const series1 = self.chart.series.push(new am4charts.LineSeries());
			const series1 = self.chart.series.push(new am4charts.StepLineSeries());
			series1.defaultState.transitionDuration = 0;
			series1.tooltipText = "{valueY.value} L";
			
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.stroke = am4core.color("#f00");
			series1.strokeWidth = 3;
			series1.fill = series1.stroke;
			series1.fillOpacity = 0;
			
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			series1.tooltip.label.fill = series1.stroke;
			
			series1.data = self.models['UserWaterALLModel'].waterValues;
			series1.dataFields.dateX = "time";
			series1.dataFields.valueY = "hot";
			series1.name = localized_string_hot;
			series1.yAxis = valueAxis;
			
			
			//const series2 = self.chart.series.push(new am4charts.ColumnSeries());
			//const series2 = self.chart.series.push(new am4charts.LineSeries());
			const series2 = self.chart.series.push(new am4charts.StepLineSeries());
			series2.defaultState.transitionDuration = 0;
			series2.tooltipText = "{valueY.value} L";
			
			series2.tooltip.getFillFromObject = false;
			series2.tooltip.getStrokeFromObject = true;
			series2.stroke = am4core.color("#0ff");
			series2.strokeWidth = 3;
			series2.fill = series2.stroke;
			series2.fillOpacity = 0;
			
			series2.tooltip.background.fill = am4core.color("#000");
			series2.tooltip.background.strokeWidth = 1;
			series2.tooltip.label.fill = series2.stroke;
			
			series2.data = self.models['UserWaterALLModel'].waterValues;
			series2.dataFields.dateX = "time";
			series2.dataFields.valueY = "cold";
			series2.name = localized_string_cold;
			series2.yAxis = valueAxis;
			
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
			console.log('UWC WATER RENDER CHART END =====================');
		}); // end am4core.ready()
		
		
		this.appendTotal();
		
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
					'<div id="uwc-water-chart" class="medium-chart"></div>'+
					
					
					'<div id="uwc-water-total"></div>'+
					
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
			console.log('UWCWaterChartView => render models READY!!!!');
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
			console.log('UWCWaterChartView => render models ARE NOT READY!!!!');
			this.showSpinner('#uwc-water-chart');
		}
	}
}
