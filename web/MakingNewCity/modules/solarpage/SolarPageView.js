/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class SolarPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			// Subscribe to all models from Controller:
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.rendered = false;
		this.FELID = 'solar-page-view-failure';
		this.chart = undefined; // We have a chart!
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
		this.rendered = false;
		$(this.el).empty();
	}
	
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_solar_energy = LM['translation'][sel]['SOLAR_ENERGY']; //"Solar power", "Aurinkoenergia"
		const localized_string_solar_energy_power = LM['translation'][sel]['SOLAR_ENERGY_POWER'];
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			
			//am4core.options.autoSetClassName = true;
			// Create chart
			self.chart = am4core.create("fingrid-chart", am4charts.XYChart);
			self.chart.padding(30, 15, 30, 15);
			//self.chart.colors.step = 3;
			
			self.chart.numberFormatter.numberFormat = "#.##";
			self.chart.data = [];
			
			const values = self.models['FingridSolarPowerFinlandModel'].values;
			
			// [{"value":207.483000,"start_time":"2021-05-17T08:00:00+0000","end_time":"2021-05-17T09:00:00+0000"},...]
			console.log(['values=',values]);
			values.forEach(v=>{
				self.chart.data.push({
					date: moment(v.start_time).toDate(),
					value: v.value
				});
			});
			/*
			self.chart.data.push({
				date: newDate,
				values: values
			});
			const values = this.models['FingridSolarPowerFinlandModel'].values;
			*/
			const dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {
				"timeUnit": "hour",
				"count": 1
			};
			dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " MW";
			});
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_solar_energy;
			
			var series = self.chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "date";
			series.dataFields.valueY = "value";
			series.tooltipText = localized_string_solar_energy_power + ": [bold]{valueY.value} MW";
			series.fillOpacity = 0.3;
			
			self.chart.cursor = new am4charts.XYCursor();
			self.chart.cursor.lineY.opacity = 0;
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series);
			//dateAxis.start = 0.8;
			dateAxis.keepSelection = true;
		}); // end am4core.ready()
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='FingridSolarPowerFinlandModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						
						$('#'+this.FELID).empty();
						
						if (typeof this.chart !== 'undefined') {
							// SEE: https://www.amcharts.com/docs/v4/concepts/data/
							// Manipulating existing data points
							/*const name = options.model;
							this.chart.data.forEach(d=>{
								if (d.name === name) {
									Here we have an array of values instead of one value
									this.values = [];
									d.value = this.models[name].value;
								}
							});
							*/
							const values = this.models['FingridSolarPowerFinlandModel'].values;
							const newdata = [];
							values.forEach(v=>{
								newdata.push({
									date: moment(v.start_time).toDate(),
									value: v.value
								});
							});
							// [{"value":207.483000,"start_time":"2021-05-17T08:00:00+0000","end_time":"2021-05-17T09:00:00+0000"},...]
							//console.log(['values=',values]);
							this.chart.data = newdata;
							//console.log('invalidateRawData');
							this.chart.invalidateRawData();
						} else {
							this.renderChart();
						}
						
					} else {
						this.render();
					}
					
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_title = LM['translation'][sel]['SOLAR_PAGE_TITLE'];
		const localized_string_description = LM['translation'][sel]['SOLAR_PAGE_DESCRIPTION'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="fingrid-chart" class="medium-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$('#back').on('click',function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			this.handleErrorMessages(this.FELID);
			this.renderChart();
		}
	}
}