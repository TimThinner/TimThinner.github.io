import TimeRangeView from '../common/TimeRangeView.js';

export default class UserHeatingView extends TimeRangeView {
	
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
		this.FELID = 'user-heating-view-failure';
		this.CHARTID = 'user-heating-chart';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
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
				
			} else if (options.model==='UserTemperatureModel' && options.method==='fetched') {
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						$('#'+this.FELID).empty();
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... UserHeatingView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								//s.data = self.models['UserHeatingModel'].values;
							});
							
						} else {
							console.log('fetched ..... render UserHeatingView()');
							this.renderChart();
						}
						
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to controller forceLogout() action.
							// Force LOGOUT if Auth failed!
							// Call View-class method to handle error.
							this.forceLogout(this.FELID);
						} else if (options.status === 403) {
							const html = '<p class="error-info">' + options.message + '. Data access not available anymore.</p>';
							$('#data-error-info').empty().append(html);
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$('#'+this.FELID).empty().append(html);
						}
					}
				}
			} else if (options.model==='UserHumidityModel' && options.method==='fetched') {
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						$('#'+this.FELID).empty();
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... UserHeatingView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								//s.data = self.models['UserHeatingModel'].values;
							});
							
						} else {
							console.log('fetched ..... render UserHeatingView()');
							this.renderChart();
						}
						
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to controller forceLogout() action.
							// Force LOGOUT if Auth failed!
							// Call View-class method to handle error.
							this.forceLogout(this.FELID);
						} else if (options.status === 403) {
							const html = '<p class="error-info">' + options.message + '. Data access not available anymore.</p>';
							$('#data-error-info').empty().append(html);
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$('#'+this.FELID).empty().append(html);
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
		const localized_string_temperature_tooltip = LM['translation'][sel]['APARTMENT_TEMPERATURE_TOOLTIP'];
		const localized_string_temperature_axis_label = LM['translation'][sel]['APARTMENT_TEMPERATURE_AXIS_LABEL'];
		const localized_string_temperature_legend = LM['translation'][sel]['APARTMENT_TEMPERATURE_LEGEND'];
		const localized_string_humidity_tooltip = LM['translation'][sel]['APARTMENT_HUMIDITY_TOOLTIP'];
		const localized_string_humidity_axis_label = LM['translation'][sel]['APARTMENT_HUMIDITY_AXIS_LABEL'];
		const localized_string_humidity_legend = LM['translation'][sel]['APARTMENT_HUMIDITY_LEGEND'];
		
		am4core.ready(function() {
			
			function generateChartData(offs) {
				var chartData = [];
				// current date
				var firstDate = new Date();
				// now set 500 minutes back (1 day is 24 x 60 minutes = 1440 minutes
				firstDate.setMinutes(firstDate.getDate() - 1440);
				
				// and generate 1440 data items
				var temp = 0;
				for (var i = 0; i < 1440; i++) {
					var newDate = new Date(firstDate);
					// each time we add one minute
					newDate.setMinutes(newDate.getMinutes() + i);
					// some random number
					//visits = Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
					//temp = 20 + Math.round((Math.random()<0.5?1:-1)*Math.random()*2);
					
					temp = offs + 5*Math.sin(i*Math.PI/180);
					
					// add data item to the array
					chartData.push({
						//date: newDate,
						//visits: visits
						timestamp: newDate,
						value: temp
					});
				}
				return chartData;
			}
			
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			// Create chart
			self.chart = am4core.create(self.CHARTID, am4charts.XYChart);
			self.paddingRight = 20;
			
			// {'timestamp':...,'value':...}
			
			var dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 3};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_temperature_axis_label + ', ' + localized_string_humidity_axis_label;
			valueAxis.min = 0;
			
			var series1 = self.chart.series.push(new am4charts.LineSeries());
			series1.data = generateChartData(20);
			series1.dataFields.dateX = "timestamp"; // "date";
			series1.dataFields.valueY = "value"; // "visits";
			series1.tooltipText = localized_string_temperature_tooltip + ": [bold]{valueY}[/] °C";
			series1.fillOpacity = 0;
			series1.name = 'TEMPERATURE';
			series1.customname = localized_string_temperature_legend;
			series1.stroke = am4core.color("#f77");
			series1.fill = "#f77";
			series1.legendSettings.labelText = "{customname}";
			
			
			//series1.tooltipText = localized_string_emission_el + ": [bold]{valueY}[/] gCO2/h";
			//series1.fillOpacity = 0.2;
			//series1.name = "ELEMISSIONS";
			//series1.customname = localized_string_emission_el_legend;
			//series1.stroke = am4core.color("#ff0");
			//series1.fill = "#ff0";
			//series1.legendSettings.labelText = "{customname}";
			
			
			var series2 = self.chart.series.push(new am4charts.LineSeries());
			series2.data = generateChartData(40);
			series2.dataFields.dateX = "timestamp"; // "date";
			series2.dataFields.valueY = "value"; // "visits";
			series2.tooltipText = localized_string_humidity_tooltip + ": [bold]{valueY}[/] %";
			series2.fillOpacity = 0;
			series2.name = 'HUMIDITY';
			series2.customname = localized_string_humidity_legend;
			series2.stroke = am4core.color("#0ff");
			series2.fill = "#0ff";
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
			self.chart.scrollbarX.series.push(series1);
			
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
		const localized_string_title = LM['translation'][sel]['USER_HEATING_TITLE'];
		const localized_string_back = LM['translation'][sel]['BACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/radiator.svg" height="80"/></p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					//'<p style="color:#aaa;margin-top:-16px;padding:0;">'+localized_string_daw_sel_timerange+'</p>'+
					'<a href="javascript:void(0);" id="b1d" class="my-range-button" style="float:right;">1D</a>'+
					'<a href="javascript:void(0);" id="b1w" class="my-range-button" style="float:right;">1W</a>'+
					'<a href="javascript:void(0);" id="b2w" class="my-range-button" style="float:right;">2W</a>'+
					'<a href="javascript:void(0);" id="b1m" class="my-range-button" style="float:right;">1M</a>'+
					'<a href="javascript:void(0);" id="b6m" class="my-range-button" style="float:right;">6M</a>'+
					'<a href="javascript:void(0);" id="b1y" class="my-range-button" style="float:right;">1Y</a>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="data-error-info"></div>'+
					'<div id="'+this.CHARTID+'" class="large-chart"></div>'+
					'<div id="user-heating-info"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_back+
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
		
		const myModels = ['UserTemperatureModel','UserHumidityModel'];
		this.setTimerangeHandlers(myModels);
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('USERPAGE');
		});
		
		this.showInfo(myModels);
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('UserHeatingView => render models READY!!!!');
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
			console.log('UserHeatingView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
