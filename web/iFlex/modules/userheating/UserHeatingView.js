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
		
		// TODO: Create 3 separate charts instead of putting Temperature, Humidity and CO2 levels into one chart.
		this.chart_temperature = undefined;
		this.chart_humidity = undefined;
		this.chart_co2 = undefined;
		
		this.rendered = false;
		this.FELID = 'user-heating-view-failure';
		
		this.CHARTID_TEMPERATURE = 'user-temperature-chart';
		this.CHARTID_HUMIDITY = 'user-humidity-chart';
		this.CHARTID_CO2 = 'user-co2-chart';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		if (typeof this.chart_temperature !== 'undefined') {
			this.chart_temperature.dispose();
			this.chart_temperature = undefined;
		}
		if (typeof this.chart_humidity !== 'undefined') {
			this.chart_humidity.dispose();
			this.chart_humidity = undefined;
		}
		if (typeof this.chart_co2 !== 'undefined') {
			this.chart_co2.dispose();
			this.chart_co2 = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		if (typeof this.chart_temperature !== 'undefined') {
			this.chart_temperature.dispose();
			this.chart_temperature = undefined;
		}
		if (typeof this.chart_humidity !== 'undefined') {
			this.chart_humidity.dispose();
			this.chart_humidity = undefined;
		}
		if (typeof this.chart_co2 !== 'undefined') {
			this.chart_co2.dispose();
			this.chart_co2 = undefined;
		}
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateTemperatureNow() {
		const len = this.models['UserTemperatureModel'].values.length;
		if (len > 0) {
			const value = +this.models['UserTemperatureModel'].values[len-1].value;
			//console.log(['value=',value]);
			// The Number.EPSILON property represents the difference between 1 and the smallest floating point number greater than 1.
			const val = Math.round((value + Number.EPSILON) * 100) / 100;
			$("#temperature-now-value").empty().append(val);
		}
	}
	
	updateHumidityNow() {
		const len = this.models['UserHumidityModel'].values.length;
		if (len > 0) {
			const value = +this.models['UserHumidityModel'].values[len-1].value;
			const val = Math.round((value + Number.EPSILON) * 100) / 100;
			$("#humidity-now-value").empty().append(val);
		}
	}
	
	updateCO2Now() {
		const len = this.models['UserCO2Model'].values.length;
		if (len > 0) {
			const value = +this.models['UserCO2Model'].values[len-1].value;
			const val = Math.round((value + Number.EPSILON) * 100) / 100;
			$("#co2-now-value").empty().append(val);
		}
	}
	
	notify(options) {
		const self = this;
		
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				if (typeof this.chart_temperature !== 'undefined') {
					this.chart_temperature.dispose();
					this.chart_temperature = undefined;
				}
				if (typeof this.chart_humidity !== 'undefined') {
					this.chart_humidity.dispose();
					this.chart_humidity = undefined;
				}
				if (typeof this.chart_co2 !== 'undefined') {
					this.chart_co2.dispose();
					this.chart_co2 = undefined;
				}
				this.render();
				
			} else if (options.model==='UserTemperatureModel' && options.method==='fetched') {
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						$('#'+this.FELID).empty();
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.updateTemperatureNow();
						
						if (typeof this.chart_temperature !== 'undefined') {
							//console.log('fetched ..... UserHeatingView CHART UPDATED!');
							am4core.iter.each(this.chart_temperature.series.iterator(), function (s) {
								if (s.name === 'TEMPERATURE') {
									s.data = self.models['UserTemperatureModel'].values;
								}
							});
							
						} else {
							//console.log('fetched ..... render UserHeatingView()');
							this.renderChartTemperature();
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
							$('#data-error-temperature-info').empty().append(html);
							$('#'+this.CHARTID_TEMPERATURE).empty();
							
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
						this.updateHumidityNow();
						
						if (typeof this.chart_humidity !== 'undefined') {
							//console.log('fetched ..... UserHeatingView CHART UPDATED!');
							am4core.iter.each(this.chart_humidity.series.iterator(), function (s) {
								if (s.name === 'HUMIDITY') {
									s.data = self.models['UserHumidityModel'].values;
								}
							});
							
						} else {
							//console.log('fetched ..... render UserHeatingView()');
							this.renderChartHumidity();
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
							$('#data-error-humidity-info').empty().append(html);
							$('#'+this.CHARTID_HUMIDITY).empty();
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$('#'+this.FELID).empty().append(html);
						}
					}
				}
			} else if (options.model==='UserCO2Model' && options.method==='fetched') {
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						$('#'+this.FELID).empty();
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.updateCO2Now();
						
						if (typeof this.chart_co2 !== 'undefined') {
							am4core.iter.each(this.chart_co2.series.iterator(), function (s) {
								if (s.name === 'CO2') {
									s.data = self.models['UserCO2Model'].values;
								}
							});
							
						} else {
							this.renderChartCO2();
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
							$('#data-error-co2-info').empty().append(html);
							// Remove the Spinner:
							$('#'+this.CHARTID_CO2).empty();
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$('#'+this.FELID).empty().append(html);
						}
					}
				}
				
			}
		}
	}
	
	renderChartTemperature() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_temperature_tooltip = LM['translation'][sel]['APARTMENT_TEMPERATURE_TOOLTIP'];
		const localized_string_temperature_axis_label = LM['translation'][sel]['APARTMENT_TEMPERATURE_AXIS_LABEL'];
		const localized_string_temperature_legend = LM['translation'][sel]['APARTMENT_TEMPERATURE_LEGEND'];
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			// Create chart
			self.chart_temperature = am4core.create(self.CHARTID_TEMPERATURE, am4charts.XYChart);
			self.paddingRight = 20;
			
			// {'timestamp':...,'value':...}
			
			const dateAxis = self.chart_temperature.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 3};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			const valueAxis = self.chart_temperature.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_temperature_axis_label;
			valueAxis.min = 0;
			
			const series = self.chart_temperature.series.push(new am4charts.LineSeries());
			series.data = self.models['UserTemperatureModel'].values;
			series.dataFields.dateX = "timestamp";
			series.dataFields.valueY = "value";
			series.tooltipText = localized_string_temperature_tooltip + ": [bold]{valueY}[/] °C";
			series.fillOpacity = 0;
			series.name = 'TEMPERATURE';
			series.customname = localized_string_temperature_legend;
			series.stroke = am4core.color("#f77");
			series.fill = "#f77";
			series.legendSettings.labelText = "{customname}";
			
			// Legend:
			self.chart_temperature.legend = new am4charts.Legend();
			self.chart_temperature.legend.useDefaultMarker = true;
			const marker = self.chart_temperature.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
			self.chart_temperature.cursor = new am4charts.XYCursor();
			self.chart_temperature.cursor.lineY.opacity = 0;
			self.chart_temperature.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart_temperature.scrollbarX.series.push(series);
			
			dateAxis.start = 0.0;
			dateAxis.end = 1.0;
			dateAxis.keepSelection = true;
			
		}); // end am4core.ready()
	}
	
	renderChartHumidity() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_humidity_tooltip = LM['translation'][sel]['APARTMENT_HUMIDITY_TOOLTIP'];
		const localized_string_humidity_axis_label = LM['translation'][sel]['APARTMENT_HUMIDITY_AXIS_LABEL'];
		const localized_string_humidity_legend = LM['translation'][sel]['APARTMENT_HUMIDITY_LEGEND'];
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			// Create chart
			self.chart_humidity = am4core.create(self.CHARTID_HUMIDITY, am4charts.XYChart);
			self.paddingRight = 20;
			
			// {'timestamp':...,'value':...}
			
			const dateAxis = self.chart_humidity.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 3};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			const valueAxis = self.chart_humidity.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_humidity_axis_label;
			valueAxis.min = 0;
			
			const series = self.chart_humidity.series.push(new am4charts.LineSeries());
			series.data = self.models['UserHumidityModel'].values;
			series.dataFields.dateX = "timestamp";
			series.dataFields.valueY = "value";
			series.tooltipText = localized_string_humidity_tooltip + ": [bold]{valueY}[/] %";
			series.fillOpacity = 0;
			series.name = 'HUMIDITY';
			series.customname = localized_string_humidity_legend;
			series.stroke = am4core.color("#0ff");
			series.fill = "#0ff";
			series.legendSettings.labelText = "{customname}";
			
			// Legend:
			self.chart_humidity.legend = new am4charts.Legend();
			self.chart_humidity.legend.useDefaultMarker = true;
			const marker = self.chart_humidity.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
			self.chart_humidity.cursor = new am4charts.XYCursor();
			self.chart_humidity.cursor.lineY.opacity = 0;
			self.chart_humidity.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart_humidity.scrollbarX.series.push(series);
			
			dateAxis.start = 0.0;
			dateAxis.end = 1.0;
			dateAxis.keepSelection = true;
			
		}); // end am4core.ready()
	}
	
	renderChartCO2() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_co2_tooltip = 'CO2';
		const localized_string_co2_axis_label = 'CO2';
		const localized_string_co2_legend = 'CO2';
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			// Create chart
			self.chart_co2 = am4core.create(self.CHARTID_CO2, am4charts.XYChart);
			self.paddingRight = 20;
			
			// {'timestamp':...,'value':...}
			
			const dateAxis = self.chart_co2.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 3};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			const valueAxis = self.chart_co2.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_co2_axis_label;
			valueAxis.min = 0;
			
			const series = self.chart_co2.series.push(new am4charts.LineSeries());
			series.data = self.models['UserCO2Model'].values;
			series.dataFields.dateX = "timestamp";
			series.dataFields.valueY = "value";
			series.tooltipText = localized_string_co2_tooltip + ": [bold]{valueY}[/] ppm";
			series.fillOpacity = 0;
			series.name = 'CO2';
			series.customname = localized_string_co2_legend;
			series.stroke = am4core.color("#ff0");
			series.fill = "#ff0";
			series.legendSettings.labelText = "{customname}";
			
			// Legend:
			self.chart_co2.legend = new am4charts.Legend();
			self.chart_co2.legend.useDefaultMarker = true;
			const marker = self.chart_co2.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
			self.chart_co2.cursor = new am4charts.XYCursor();
			self.chart_co2.cursor.lineY.opacity = 0;
			self.chart_co2.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart_co2.scrollbarX.series.push(series);
			
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
		const localized_string_temperature_now_title = LM['translation'][sel]['USER_HEATING_TEMPERATURE_NOW_TITLE'];
		const localized_string_humidity_now_title = LM['translation'][sel]['USER_HEATING_HUMIDITY_NOW_TITLE'];
		const localized_string_co2_now_title = LM['translation'][sel]['USER_HEATING_CO2_NOW_TITLE'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/radiator.svg" height="80"/></p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<div class="col s4 center">'+
						'<div id="scroll-down-to-temperature" class="value-now-box temperature-now">'+
							'<p><span class="value-now-title">'+localized_string_temperature_now_title+'</span><br/>'+
							'<span class="value-now-text" id="temperature-now-value">&nbsp;-&nbsp;</span></p>'+
						'</div>'+
					'</div>'+
					'<div class="col s4 center">'+
						'<div id="scroll-down-to-humidity" class="value-now-box humidity-now">'+
							'<p><span class="value-now-title">'+localized_string_humidity_now_title+'</span><br/>'+
							'<span class="value-now-text" id="humidity-now-value">&nbsp;-&nbsp;</span></p>'+
						'</div>'+
					'</div>'+
					'<div class="col s4 center">'+
						'<div id="scroll-down-to-co2" class="value-now-box co2-now">'+
							'<p><span class="value-now-title">'+localized_string_co2_now_title+'</span><br/>'+
							'<span class="value-now-text" id="co2-now-value">&nbsp;-&nbsp;</span></p>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="timerange-buttons-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="data-error-temperature-info"></div>'+
					'<div id="'+this.CHARTID_TEMPERATURE+'" class="medium-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="data-error-humidity-info"></div>'+
					'<div id="'+this.CHARTID_HUMIDITY+'" class="medium-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="data-error-co2-info"></div>'+
					'<div id="'+this.CHARTID_CO2+'" class="medium-chart"></div>'+ // medium-chart = height 400px
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
		
		this.setTimerangeButtons('timerange-buttons-wrapper');
		
		const myModels = ['UserTemperatureModel','UserHumidityModel','UserCO2Model'];
		this.setTimerangeHandlers(myModels);
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('USERPAGE');
		});
		
		/*
		$("#scroll-down-to-temperature").on('click', function() {
			// Always scroll to top when next (or previous) page is entered.
			const target = $('#'+self.CHARTID_TEMPERATURE);
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 500);
		});
		
		$("#scroll-down-to-humidity").on('click', function() {
			// Always scroll to top when next (or previous) page is entered.
			const target = $('#'+self.CHARTID_HUMIDITY);
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 500);
		});
		
		$("#scroll-down-to-co2").on('click', function() {
			// Always scroll to top when next (or previous) page is entered.
			const target = $('#'+self.CHARTID_CO2);
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 500);
		});
		*/
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
				this.renderChartTemperature();
				this.renderChartHumidity();
				this.renderChartCO2();
				
				this.updateTemperatureNow();
				this.updateHumidityNow();
				this.updateCO2Now();
				
				myModels.forEach(m=>{
					this.updateInfoModelValues(m, this.models[m].values.length); // implemented in TimeRangeView
				});
				
			}
		} else {
			console.log('UserHeatingView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID_TEMPERATURE);
			this.showSpinner('#'+this.CHARTID_HUMIDITY);
			this.showSpinner('#'+this.CHARTID_CO2);
		}
	}
}
