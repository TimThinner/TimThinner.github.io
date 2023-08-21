import TimeRangeView from '../common/TimeRangeView.js';

export default class BView extends TimeRangeView {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.chart = undefined;
		this.rendered = false;
		this.FELID = 'building-heating-view-failure';
		this.CHARTID = 'building-heating-chart';
		
		this.values = [];
	}
	
	show() {
		// NOTE: FIRST render and then restart the timer.
		this.render();
		super.show();
	}
	
	hide() {
		super.hide();
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		super.remove(); 
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		const self = this;
		
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				if (typeof this.chart !== 'undefined') {
					this.chart.dispose();
					this.chart = undefined;
				}
				this.render();
				
			} else if (options.model==='BuildingHeatingQE01Model' && options.method==='fetched') {
				//console.log('NOTIFY BuildingHeatingQE01Model fetched!');
				//console.log(['options.status=',options.status]);
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						$('#'+this.FELID).empty();
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						
						if (typeof this.chart !== 'undefined') {
							//console.log('fetched ..... BuildingHeatingView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								if (s.name === 'QE') {
									s.data = self.models['BuildingHeatingQE01Model'].values;
								}
							});
							
						} else {
							console.log('fetched ..... render BuildingHeatingView()');
							this.renderChart();
						}
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					}
				} else {
					this.render();
				}
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				//console.log('PTO notification came here! RELAY IT TO TimeRangeView!');
				super.notify(options);
			}
		}
	}
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const localized_string_power = LM['translation'][sel]['BUILDING_POWER'];
		const localized_string_power_axis = LM['translation'][sel]['BUILDING_POWER_AXIS_LABEL'];
		const localized_string_power_legend = LM['translation'][sel]['BUILDING_POWER_LEGEND']; // Instantaneous power
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			// Create chart
			self.chart = am4core.create(self.CHARTID, am4charts.XYChart);
			self.paddingRight = 20;
			//self.chart.data = generateChartData();
			
			// {'timestamp':...,'value':...}
			//self.chart.data = self.models['BuildingHeatingModel'].values;
			//console.log(['self.chart.data=',self.chart.data]);
			
			var dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 3};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_power_axis;
			/*
			var series1 = self.chart.series.push(new am4charts.LineSeries());
			series1.data = self.models['BuildingHeatingFE01Model'].values;
			series1.dataFields.dateX = "timestamp"; // "date";
			series1.dataFields.valueY = "value"; // "visits";
			series1.tooltipText = "Value: [bold]{valueY}[/]"; //"Visits: [bold]{valueY}[/]";
			series1.fillOpacity = 0;// 0.2;
			series1.name = 'FE';
			series1.stroke = am4core.color("#ff0");
			series1.fill = "#ff0";*/
			
			var series2 = self.chart.series.push(new am4charts.LineSeries());
			series2.data = self.models['BuildingHeatingQE01Model'].values;
			series2.dataFields.dateX = "timestamp"; // "date";
			series2.dataFields.valueY = "value"; // "visits";
			series2.tooltipText = localized_string_power + ": [bold]{valueY.formatNumber('#.##')}[/] kW"; // NOTE: [/] is a closing bracket for [bold]
			series2.fillOpacity = 0.25;
			series2.name = 'QE';
			series2.customname = localized_string_power_legend;
			series2.stroke = am4core.color("#0f0");
			series2.fill = "#0f0";
			series2.legendSettings.labelText = "{customname}";
			
			// Legend:
			self.chart.legend = new am4charts.Legend();
			self.chart.legend.useDefaultMarker = true;
			var marker = self.chart.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
			
			self.chart.cursor = new am4charts.XYCursor();
			self.chart.cursor.lineY.opacity = 0;
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series2);
			
			dateAxis.start = 0.0;
			dateAxis.end = 1.0;
			dateAxis.keepSelection = true;
			
		}); // end am4core.ready()
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_title = LM['translation'][sel]['BUILDING_HEATING_TITLE'];
		const localized_string_back = LM['translation'][sel]['BACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/radiator.svg" height="80"/></p>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12 center" id="timerange-buttons-wrapper"></div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					//'<div id="data-error-info"></div>'+
					'<div id="'+this.CHARTID+'" class="large-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light iflex-button" id="back">'+localized_string_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<div id="data-fetching-info"></div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.setTimerangeButtons('timerange-buttons-wrapper');
		
		const myModels = ['BuildingHeatingQE01Model'];
		this.setTimerangeHandlers(myModels);
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		this.showInfo(myModels);
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('BView => render models READY!!!!');
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
				$(html).appendTo('#'+this.FELID);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				this.renderChart();
				myModels.forEach(m=>{
					this.updateInfoModelValues(m, this.models[m].values.length); // implemented in TimeRangeView
				});
			}
		} else {
			console.log('BView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
