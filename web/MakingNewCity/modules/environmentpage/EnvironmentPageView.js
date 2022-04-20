/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

export default class EnvironmentPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			// Subscribe to all models from Controller:
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.PTO = new PeriodicTimeoutObserver({interval:180000}); // interval 3 minutes.
		this.PTO.subscribe(this);
		
		this.fetchQueue = [];
		
		this.rendered = false;
		this.FELID = 'environment-page-view-failure';
		this.chart = undefined;
		this.timestamp_latest = undefined;
		this.consumption_latest = undefined;
		this.consumption_average = undefined;
		this.production_latest = undefined;
		
		this.MAXIMUM_VALUE = 1000; // If value is greater than this, it can be flagged as ERROR.
		this.valueOutOfRangeCounter = 0;
		this.valueCounter = 0;
	}
	
	show() {
		this.render();
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
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
	
	updateConsumptionNow() {
		if (typeof this.consumption_latest !== 'undefined') {
			// The Number.EPSILON property represents the difference between 1 and the smallest floating point number greater than 1.
			//const val = Math.round((this.consumption_latest + Number.EPSILON) * 100) / 100;
			const val = this.consumption_latest.toFixed(0);
			$("#consumption-now-value").empty().append(val + ' gCO2/kWh');
			
			if (typeof this.consumption_average !== 'undefined') {
				const val = this.consumption_average.toFixed(0);
				$("#average-now-value").empty().append(val + ' gCO2/kWh');
			}
			
			if (typeof this.timestamp_latest !== 'undefined') {
				// Format the timestamp:
				const mom = moment(this.timestamp_latest);
				$("#timestamp-now-value").empty().append(mom.format('DD.MM.YYYY HH:mm:ss'));
			}
		}
		if (this.valueOutOfRangeCounter > 0) {
			
			const style = "padding:16px; border:1px solid #800; background-color:#fee; color:#a55;";
			const outOfRageText = '<p style="'+style+'">Received '+this.valueCounter+' values. '+
				this.valueOutOfRangeCounter+' values were not taken into account as they were OUT OF RANGE (MAXIMUM VALUE='+this.MAXIMUM_VALUE+')</p>';
			$("#out-of-range-wrapper").empty().append(outOfRageText);
		} else {
			$("#out-of-range-wrapper").empty();
		}
	}
	//const aves = '('+ave.toFixed(0)+')';
	/*
	updateProductionNow() {
		if (typeof this.production_latest !== 'undefined') {
			// The Number.EPSILON property represents the difference between 1 and the smallest floating point number greater than 1.
			const val = Math.round((this.production_latest + Number.EPSILON) * 100) / 100;
			$("#production-now-value").empty().append(val);
		}
	}*/
	
	/*
		Try to reduce the CHART doing repaint 30 times when result come one-by-one.
		
		
				let sum = 0;
				const resuArray = [];
				
				const numOfModels = this.controller.numOfEmpoModels;
				for (let i=1; i<numOfModels+1; i++) {
					const res = this.models['EmpoEmissions'+i+'Model'].results;
					res.forEach(r=>{
						if (Number.isFinite(r.em_cons)) {
							const d = new Date(r.date_time);
							resuArray.push({date:d, cons:r.em_cons});
							sum += r.em_cons;
						}
					});
				}
				if (resuArray.length > 0) {
					// Get the last value:
					// Then sort array based according to time, oldest entry first.
					resuArray.sort(function(a,b){
						return a.date - b.date;
					});
					const last = resuArray[resuArray.length-1].cons;
					// Average:
					const ave = sum/resuArray.length;
					const s = last.toFixed(0)+' ('+ave.toFixed(0)+')';
					this.fillSVGTextElement(svgObject, 'emissions-value', s);
					this.updateSVGLeafPathColor(ave, last);
				}
		
		
	*/
	convertResults() {
		const resuArray = [];
		const aveArray = [];
		this.valueOutOfRangeCounter = 0;
		this.valueCounter = 0;
		
		Object.keys(this.models).forEach(key => {
			if (key.indexOf('EmpoEmissions') === 0) {
				const res = this.models[key].results;
				this.valueCounter += res.length;
				
				//console.log(['res length=',res.length]);
				if (res.length > 0) {
					// Create a Date Object from date_time:
					res.forEach(r=>{
						if (Number.isFinite(r.em_cons) && r.em_cons > 0 && r.em_cons < this.MAXIMUM_VALUE) {
							//Number.isFinite(r.em_prod) && r.em_prod > 0 && r.em_prod < this.MAXIMUM_VALUE) {
							//const d = new Date(r.date_time);
							let ds = r.date_time;
							if (r.date_time.indexOf('T') === 0) {
								ds = r.date_time.replace(' ', 'T');
							}
							if (r.date_time.endsWith('Z')===false) {
								ds += 'Z';
							}
							const d = new Date(ds);
							resuArray.push({date:d, consumed:r.em_cons, produced:r.em_prod});
						} else {
							//console.log(['r.em_cons OUT OF RANGE! ',r.em_cons,' r.date_time=',r.date_time]);
							this.valueOutOfRangeCounter++;
						}
					});
				}
			}
		});
		if (resuArray.length > 0) {
			// Then sort array based according to time, oldest entry first.
			resuArray.sort(function(a,b){
				return a.date - b.date;
			});
			// Currently "EmpoEmissions" values are produced with 3 minute interval => resample to 1 hour averages:
			// 20 values grouped so that date is taken from the middle (10th element).
			// shift()  Remove an item from the beginning of an array
			
			// Save the lastest values and timestamp in member variables
			this.timestamp_latest = resuArray[resuArray.length-1].date;
			this.consumption_latest = resuArray[resuArray.length-1].consumed;
			this.production_latest = resuArray[resuArray.length-1].produced;
			
			const nBATCH = 20;
			let batches = [];
			let counter = 0;
			let batch = 0;
			while (resuArray.length > 0) {
				if (counter === 0) {
					batches[batch] = {count:0,items:[]};
				}
				const e = resuArray.shift();
				counter++;
				batches[batch].count = counter;
				batches[batch].items.push(e);
				if (counter === nBATCH) {
					batch++;
					counter = 0;
				}
			}
			batches.forEach(b=>{
				if (b.count > 0) {
					let c_sum = 0;
					let p_sum = 0;
					
					b.items.forEach(i=>{
						c_sum += i.consumed;
						p_sum += i.produced;
					});
					const c_ave = c_sum/b.count;
					const p_ave = p_sum/b.count;
					const half = Math.floor(b.items.length/2);
					const date = b.items[half].date;
					aveArray.push({date:date, consumed:c_ave, produced:p_ave});
				}
			});
		}
		
		// CHECK THE AVERAGE of values in aveArray
		if (aveArray.length > 0) {
			let ave_sum = 0;
			aveArray.forEach(v=>{
				ave_sum += v.consumed;
			});
			this.consumption_average = ave_sum/aveArray.length;
		}
		return aveArray;
	}
	
	renderChart() {
		const self = this;
		
		am4core.ready(function() {
			
			const LM = self.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_axis_title = LM['translation'][sel]['ENVIRONMENT_PAGE_AXIS_TITLE'];
			const localized_string_cons_tooltip = LM['translation'][sel]['ENVIRONMENT_PAGE_CONS_TOOLTIP'];
			//const localized_string_prod_tooltip = LM['translation'][sel]['ENVIRONMENT_PAGE_PROD_TOOLTIP'];
			const localized_string_cons_legend_label = LM['translation'][sel]['ENVIRONMENT_PAGE_CONS_LEGEND_LABEL'];
			//const localized_string_prod_legend_label = LM['translation'][sel]['ENVIRONMENT_PAGE_PROD_LEGEND_LABEL'];
			
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
			// See: https://www.amcharts.com/docs/v4/concepts/locales/#Numbers
			self.chart.language.locale["_thousandSeparator"] = " "; 
			
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
			
			/*
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
			*/
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
		console.log(['ERROR IN FETCHING model=',options.model,' message=',options.message]);
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
				const f = this.fetchQueue.shift();
				if (typeof f !== 'undefined') {
					//console.log('Fetch NEXT EmpoEmissions MODEL.');
					this.models[f.key].fetch();
				}
				if (options.status === 200) {
					//if (this.areModelsReady()) {
						if (this.rendered) {
							$('#'+this.FELID).empty();
							if (typeof this.chart !== 'undefined') {
								const resuArray = this.convertResults();
								
								//console.log(['resuArray.length = ',resuArray.length, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!']);
								am4core.iter.each(this.chart.series.iterator(), function (s) {
									s.data = resuArray;
								});
								this.updateConsumptionNow();
								
								
								
							} else {
								this.renderChart();
							}
						} else {
							this.render();
						}
					//}
				} else { // Error in fetching.
					this.notifyError(options);
				}
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Do something with each TICK!
				//
				// 'MenuModel'
				// 'EmpoEmissions1Model'
				// ...
				// 'EmpoEmissions30Model'
				/*
				Object.keys(this.models).forEach(key => {
					//console.log(['FETCH MODEL key=',key]);
					this.models[key].fetch();
				});
				*/
				this.fetchQueue = [];
				
				Object.keys(this.models).forEach(key => {
					if (key.indexOf('EmpoEmissions') === 0) {
						this.fetchQueue.push({'key':key});
					}
				});
				//.. and start the fetching process with FIRST EmpoEmissions... model:
				const f = this.fetchQueue.shift();
				if (typeof f !== 'undefined') {
					console.log('Fetch FIRST EmpoEmissions MODEL.');
					this.models[f.key].fetch();
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
		const localized_string_title = LM['translation'][sel]['ENVIRONMENT_PAGE_TITLE'];
		const localized_string_description = LM['translation'][sel]['ENVIRONMENT_PAGE_DESCRIPTION'];
		const localized_string_consumption_now_title = LM['translation'][sel]['ENVIRONMENT_PAGE_LATEST_CONSUMPTION'];
		const localized_string_average_now_title = LM['translation'][sel]['ENVIRONMENT_PAGE_AVERAGE_CONSUMPTION'];
		//const localized_string_production_now_title = 'Production';
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<div class="col s12 center">'+
						'<div class="value-now-box consumption-now">'+
							'<p><span class="value-now-title">'+localized_string_consumption_now_title+'</span><br/>'+
							'<span class="value-now-text" id="consumption-now-value">&nbsp;-&nbsp;</span><br/>'+
							'<span class="average-now-text">'+localized_string_average_now_title+':</span>'+
							'<span class="average-now-text" id="average-now-value">&nbsp;&nbsp;-&nbsp;</span><br/>'+
							'<span class="timestamp-now-text" id="timestamp-now-value">&nbsp;-&nbsp;</span></p>'+
						'</div>'+
					'</div>'+
					//'<div class="col s6 center">'+
					//	'<div class="value-now-box production-now">'+
					//		'<p><span class="value-now-title">'+localized_string_production_now_title+'</span><br/>'+
					//		'<span class="value-now-text" id="production-now-value">&nbsp;-&nbsp;</span></p>'+
					//	'</div>'+
					//'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="emissions-chart" class="medium-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<div id="out-of-range-wrapper"></div>'+
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
			this.updateConsumptionNow();
		}
	}
}