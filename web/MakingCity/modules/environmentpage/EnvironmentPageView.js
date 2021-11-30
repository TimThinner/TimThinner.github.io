/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class EnvironmentPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			// Subscribe to all models from Controller:
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.rendered = false;
		this.FELID = 'environment-page-view-failure';
		this.chart = undefined;
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
	
	/*
		Try to reduce the CHART doing repaint 30 times when result come one-by-one.
	*/
	convertResults() {
		const resuArray = [];
		
		Object.keys(this.models).forEach(key => {
			if (key.indexOf('EmpoEmissions') === 0) {
				const res = this.models[key].results;
				//console.log(['res length=',res.length]);
				if (res.length > 0) {
					// Create a Date Object from date_time:
					res.forEach(r=>{
						const d = new Date(r.date_time);
						resuArray.push({date:d, consumed:r.em_cons, produced:r.em_prod});
					});
				}
			}
		});
		
		if (resuArray.length > 0) {
			// Then sort array based according to time, oldest entry first.
			resuArray.sort(function(a,b){
				return a.date - b.date;
			});
		}
		return resuArray;
	}
	
	renderChart() {
		const self = this;
		
		am4core.ready(function() {
			
			const LM = self.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_axis_title = LM['translation'][sel]['ENVIRONMENT_PAGE_AXIS_TITLE'];
			const localized_string_cons_tooltip = LM['translation'][sel]['ENVIRONMENT_PAGE_CONS_TOOLTIP'];
			const localized_string_prod_tooltip = LM['translation'][sel]['ENVIRONMENT_PAGE_PROD_TOOLTIP'];
			const localized_string_cons_legend_label = LM['translation'][sel]['ENVIRONMENT_PAGE_CONS_LEGEND_LABEL'];
			const localized_string_prod_legend_label = LM['translation'][sel]['ENVIRONMENT_PAGE_PROD_LEGEND_LABEL'];
			
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			//const res = self.models['EmpoEmissionsModel'].results;
			//console.log(['res length=',res.length]);
			
			const resuArray = self.convertResults();
			// Create chart
			self.chart = am4core.create('emissions-chart', am4charts.XYChart);
			self.paddingRight = 20;
			
			var dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 3};
			//dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_axis_title;
			//valueAxis.min = 0;
			
			var series1 = self.chart.series.push(new am4charts.LineSeries());
			series1.data = resuArray;
			series1.dataFields.dateX = "date";
			series1.dataFields.valueY = "consumed";
			series1.tooltipText = localized_string_cons_tooltip + ": [bold]{valueY.formatNumber('#.#')}[/] gCO2/kWh";
			series1.fillOpacity = 0.1;
			series1.name = "CONSUMED";
			series1.customname = localized_string_cons_legend_label;
			series1.stroke = am4core.color("#f80");
			series1.fill = "#f80";
			series1.legendSettings.labelText = "{customname}";
			
			var series2 = self.chart.series.push(new am4charts.LineSeries());
			series2.data = resuArray;
			series2.dataFields.dateX = "date";
			series2.dataFields.valueY = "produced";
			series2.tooltipText = localized_string_prod_tooltip + ": [bold]{valueY.formatNumber('#.#')}[/] gCO2/kWh";
			series2.fillOpacity = 0.1;
			series2.name = 'PRODUCED';
			series2.customname = localized_string_prod_legend_label;
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
			self.chart.scrollbarX.series.push(series1);
			
			dateAxis.start = 0.0;
			dateAxis.end = 1.0;
			dateAxis.keepSelection = true;
		}); // end am4core.ready()
	}
	
	notifyError(options) {
		console.log(['ERROR IN FETCHING ',options.model]);
		if (this.rendered) {
			
			$('#'+this.FELID).empty();
			const html = '<div class="error-message"><p>'+options.message+'</p></div>';
			$(html).appendTo('#'+this.FELID);
			
		} else {
			this.render();
		}
	}
	
	/*
{ "results": [ 
{ "country": "FI", "date_time": "2021-11-15 15:27:49", "em_cons": 138.5389, "em_prod": 139.6106, "emdb": "EcoInvent", "id": 154805 },
{ "country": "FI", "date_time": "2021-11-15 15:01:03", "em_cons": 140.5014, "em_prod": 141.0444, "emdb": "EcoInvent", "id": 154697 }, 
{ "country": "FI", "date_time": "2021-11-15 15:03:51", "em_cons": 140.0652, "em_prod": 140.3119, "emdb": "EcoInvent", "id": 154709 }, 
{ "country": "FI", "date_time": "2021-11-15 15:06:50", "em_cons": 139.1719, "em_prod": 140.0983, "emdb": "EcoInvent", "id": 154721 }, 
*/
	/*
	updateResults() {
		//{ "results": [ { "country": "FI", "date_time": "2021-11-16 10:31:06", "em_cons": 160.305, "em_prod": 148.0854, "emdb": "EcoInvent", "id": 159293 } ] }
		const res = this.models['EmpoEmissionsModel'].results;
		console.log(['res length=',res.length]);
		if (res.length > 0) {
			
			const resuArray = [];
			
			// Create a Date Object from date_time:
			res.forEach(r=>{
				const d = new Date(r.date_time);
				resuArray.push({date:d, consumed:r.em_cons, produced:r.em_prod});
			});
			
			// Then sort array based according to time, oldest entry first.
			resuArray.sort(function(a,b){
				return a.date - b.date;
			});
			
			let html = '';
			resuArray.forEach(r=>{
				const line = '<p>datetime: '+r.date+' consumed: '+r.consumed+' produced: '+r.produced+'</p>';
				html += line;
			});
			$('#results-wrapper').empty().append(html);
		}
	}*/
	
	notify(options) {
		if (this.controller.visible) {
			
			if (options.model.indexOf('EmpoEmissions') === 0 && options.method==='fetched') {
				if (options.status === 200) {
					if (this.areModelsReady()) {
						if (this.rendered) {
							
							$('#'+this.FELID).empty();
							if (typeof this.chart !== 'undefined') {
								const resuArray = this.convertResults();
								am4core.iter.each(this.chart.series.iterator(), function (s) {
									s.data = resuArray;
								});
							} else {
								this.renderChart();
							}
						} else {
							this.render();
						}
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			}
			/*
			if (options.model === 'EmpoEmissionsModel' && options.method==='fetched') {
				if (options.status === 200) {
					//console.log('EnvironmentPageView => ' + options.model + ' fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						//this.updateResults();
						if (typeof this.chart !== 'undefined') {
							const resuArray = this.convertResults();
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								s.data = resuArray;
							});
						} else {
							this.renderChart();
						}
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			}
			*/
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_title = LM['translation'][sel]['ENVIRONMENT_PAGE_TITLE'];
		const localized_string_description = LM['translation'][sel]['ENVIRONMENT_PAGE_DESCRIPTION'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="emissions-chart" class="medium-chart"></div>'+
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
			//this.updateResults();
			this.renderChart();
		}
	}
}