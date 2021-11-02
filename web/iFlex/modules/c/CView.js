import TimeRangeView from '../common/TimeRangeView.js';

/*

When "query" API is used, we get response (from Obix) with default interval. 
For example Electricity will give values with 15 minute intervals:
...
​​"2021-10-12T11:15:00+03:00": Object { PL1: 8, PL2: 6, PL3: 7 }
"2021-10-12T11:30:00+03:00": Object { PL1: 8, PL2: 6, PL3: 7 }
​​...

AND the Electricity Consumption FACTOR will give values with 3 minute intervals:
...
​​"2021-10-12T11:07:00+03:00": Object { factor: 101.85 }
​​"2021-10-12T11:10:00+03:00": Object { factor: 101.74 }
​​"2021-10-12T11:13:00+03:00": Object { factor: 101.46 }
​​"2021-10-12T11:16:00+03:00": Object { factor: 101.81 }
​​"2021-10-12T11:19:00+03:00": Object { factor: 102.16 }
​​"2021-10-12T11:22:00+03:00": Object { factor: 101.78 }
​​"2021-10-12T11:25:00+03:00": Object { factor: 101.62 }
​​"2021-10-12T11:28:00+03:00": Object { factor: 101.66 }
​​​"2021-10-12T11:31:00+03:00": Object { factor: 101.54 }
​​...


But we don't always use "query" API, but "rollup" API instead. There we can set the "interval", but we cannot 
be sure that both measurements will have same timestamps. They are NOT in sync! For example:

FACTOR interval 'PT15M' gives now values with difference, which depends when fetching was started:
...
​​"2021-10-12T10:30:00+03:00": Object { PL1: 8, PL2: 6, PL3: 7 }
​​"2021-10-12T10:31:00+03:00": Object { factor: 102.494 }
​​...
​​
"2021-10-12T10:30:00+03:00": Object { PL1: 8, PL2: 6, PL3: 7 }
​​"2021-10-12T10:34:00+03:00": Object { factor: 102.582 }
​​
NOTE that at ObixModel the start and end times are both truncated to whole minute value 
by setting milliseconds and seconds to 0.
​​	'<abstime name="start" val="'+start+'"/>'+
	'<abstime name="end" val="'+end+'"/>'+
But the point is that we know that values are more likely to be "out-of-sync" than "in-sync".


=> must find closest factor (in time) for each electricity consumption sum.
We propably get close enough approximation when we use same interval and then just 

INTERVAL	TIMERANGE		NUMBER OF SAMPLES		REALITY
3 MIN		1 day (24H)		 480 (24 x 20)			"QUERY" FACTOR: 3 mins, ELECTRICITY: 15 mins
10 MINS		1 week			1008 (7 x 24 x 6)		"
20 MINS		2 weeks			1008 (14 x 24 x 3)		
30 MINS 	1 month			1440 (30 x 48)			
4 HOURS		6 months		1080 (30 x 6 x 6)		
6 HOURS		13 months		1585 					"ROLLUP" 

Old version has number of days to subtract from current time.
this.timerange = {begin:1, end:0} 
But since moment handles dates very flexible, we can change timerange into structure like this:

​​this.timerange = {begin:{value:1,unit:'days'},end:{value:0,unit:'days'}}
using same units as moment.js library:
Key 	Shorthand
years 		y
quarters 	Q
months 		M
weeks 		w
days 		d
hours 		h
minutes 	m
seconds 	s
milliseconds 	ms

For example: moment().subtract(7, 'days');

*/

export default class CView extends TimeRangeView {
	
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
		this.FELID = 'building-emissions-view-failure';
		this.CHARTID = 'building-emissions-chart';
		
		this.calculated_EL_emissions = [];
		this.calculated_DH_emissions = [];
		this.calculated_ALL_emissions = [];
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
	
	/*
	Models used in CView:
	
	BuildingEmissionFactorForElectricityConsumedInFinlandModel
	BuildingElectricityPL1Model
	BuildingElectricityPL2Model
	BuildingElectricityPL3Model
	BuildingHeatingQE01Model
	*/
	
	//return y0*(x1-x) + y1*(x-x0) / (x1-x0);
	
	/*
	linearInterpolation(x, x0, y0, x1, y1) {
		var y = y0*(x1-x) + y1*(x-x0) / (x1-x0);
		return y;
		//var a = (y1 - y0) / (x1 - x0)
		//var b = -a * x0 + y0
		//return a * x + b
	}*/
	
	/*
	
	Factor is sampled with 3 mins interval.
	Values can be found in here:
	
	this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values;
	
	
	Electricity is sampled with 15 mins interval.
	The sum power can be calculated from 3 components:
	
	this.models['BuildingElectricityPL1Model'].values
	this.models['BuildingElectricityPL2Model'].values
	this.models['BuildingElectricityPL3Model'].values
	
	const start = moment().subtract(this.timerange.begin, 'days').format();
	const end = moment().subtract(this.timerange.end, 'days').format();
	
	
	findClosestFactor(key)
	key is a timestamp, 
	we look from FACTOR array, which time-value is the closest (in time) for this given key
	and return that value.
	
	*/
	findClosestFactor(key) {
		const emm = moment(key);
		let retval = 100; // Default return value is 100.
		let distance = 604800; //7 * 24 * 60 * 60; // Just a very large number, a starting point for our comparison (604 800 = 1 week).
		//let dc = 0;
		this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values.forEach(v=>{
			const val = +v.value; // convert value to number
			const m = moment(v.timestamp);
			//m.milliseconds(0);
			//m.seconds(0);
			
			//const dist = Math.abs(moment.duration(emm.diff(m)).asMinutes());
			
			//moment().unix(); // moment#unix outputs a Unix timestamp (the number of seconds since the Unix Epoch).
			const dist = Math.abs(m.unix() - emm.unix());
			if (dist < distance) {
				//dc++;
				//console.log(['dist=',dist]);
				distance = dist;
				retval = val;
			}
		});
		//console.log(['dist count=',dc]);
		//console.log(['FACTOR=',retval]);
		return retval;
	}
	
	
	calculate_ALL_Sum() {
		if (this.calculated_EL_emissions.length > 0 && this.calculated_DH_emissions.length > 0) {
			
			const sumbucket = {};
			this.calculated_ALL_emissions = [];
			
			this.calculated_EL_emissions.forEach(v=>{
				const ds = moment(v.timestamp).format();//.slice(0,-6);
				//console.log(['EL ds=',ds]);
				const val = v.value;
				sumbucket[ds] = val;
			});
			//console.log(['sumbucket=',sumbucket]);
			
			let miss = 0;
			let hit = 0;
			let total = 0;
			this.calculated_DH_emissions.forEach(v=>{
				total++;
				const ds = moment(v.timestamp).format();//.slice(0,-6);
				//console.log(['DH ds=',ds]);
				const val = v.value;
				if (sumbucket.hasOwnProperty(ds)) {
					
					hit++;
					//console.log(['HIT ds=',ds,' hit=',hit]);
					
					sumbucket[ds] += val;
					this.calculated_ALL_emissions.push({timestamp: v.timestamp, value:sumbucket[ds]});
				} else {
					miss++;
					//console.log('=====================================================');
					//console.log(['CALCULATE ALL NOT MATCHING ELEMENT ds=',ds,' miss=',miss]);
					//console.log('=====================================================');
				}
			});
			console.log(['hit=',hit,' miss=',miss,' total=',total]);
			if (miss > 0) {
				for (let i=0; i<10; i++) {
					console.log(['calculated_EL_emissions ',i,' =',this.calculated_EL_emissions[i]]);
					console.log(['calculated_DH_emissions ',i,' =',this.calculated_DH_emissions[i]]);
				}
			}
		}
	}
	
	calculate_DH_Sum() {
		//if (this.models['CControllerBuildingHeatingQE01Model'].values.length > 0) {
			this.calculated_DH_emissions = [];
			this.models['CControllerBuildingHeatingQE01Model'].values.forEach(v=>{
				const val = v.value * 220; // Converts string to number.
				this.calculated_DH_emissions.push({timestamp: moment(v.timestamp).toDate(), value:val});
			});
		//}
	}
	
	calculateSum() {
		/*if (this.models['CControllerBuildingElectricityPL1Model'].values.length > 0 && 
			this.models['CControllerBuildingElectricityPL2Model'].values.length > 0 && 
			this.models['CControllerBuildingElectricityPL3Model'].values.length > 0 && 
			this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values.length > 0) {
			*/
			// Calculate the sum of models like before.
			// and assign that to self.values array {timestamp => value}
			const sumbucket = {};
			this.calculated_EL_emissions = [];
			
			this.models['CControllerBuildingElectricityPL1Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				
				//if (val > 1000) { val = val/1000; }
				//val = val/1000;
				
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL1'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL1'] = val; // update
				}
			});
			
			this.models['CControllerBuildingElectricityPL2Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				
				//if (val > 1000) { val = val/1000; }
				//val = val/1000;
				
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL2'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL2'] = val; // update
				}
			});
			
			this.models['CControllerBuildingElectricityPL3Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				
				//if (val > 1000) { val = val/1000; }
				//val = val/1000;
				
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL3'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL3'] = val; // update
				}
			});
			Object.keys(sumbucket).forEach(key => {
				let sum = 0;
				Object.keys(sumbucket[key]).forEach(m => {
					sum += sumbucket[key][m];
				});
				sum *= this.findClosestFactor(key);
				this.calculated_EL_emissions.push({timestamp: moment(key).toDate(), value:sum});
			});
		//}
	}
	
	calculate_ALL() {
		if (this.models['CControllerBuildingElectricityPL1Model'].values.length > 0 && 
			this.models['CControllerBuildingElectricityPL2Model'].values.length > 0 && 
			this.models['CControllerBuildingElectricityPL3Model'].values.length > 0 && 
			this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values.length > 0 &&
			this.models['CControllerBuildingHeatingQE01Model'].values.length > 0) {
			
			// WHAT IS THE PERFORMANCE?
			// Measure how many milliseconds it takes to calculate all values.
			const start = moment();
			
			this.calculateSum();
			this.calculate_DH_Sum();
			this.calculate_ALL_Sum();
			
			const stop = moment();
			 // moment#valueOf simply outputs the number of milliseconds since the Unix Epoch.
			const dms = stop.valueOf() - start.valueOf();
			//console.log(['Performance: ',dms,'ms']);
			$('#performance').empty().append('Performance: '+dms+'ms');
		}
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
				
			} else if (options.model==='BuildingEmissionFactorForElectricityConsumedInFinlandModel' && options.method==='fetched') {
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.calculate_ALL();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*if (s.name === 'ELEMISSIONS') {
									s.data = self.calculated_EL_emissions;
								} else if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}*/
								
								
								
								if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}
								
							});
						} else {
							this.renderChart();
						}
						
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					}
				} else { // This should never be the case, but render anyway if we get here.
					this.render();
				}
			} else if (options.model==='CControllerBuildingElectricityPL1Model' && options.method==='fetched') {
				//console.log('NOTIFY BuildingElectricityPL1Model fetched!');
				//console.log(['options.status=',options.status]);
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.calculate_ALL();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*
								if (s.name === 'ELEMISSIONS') {
									s.data = self.calculated_EL_emissions;
								} else if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}*/
								if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}
								
							});
						} else {
							this.renderChart();
						}
						
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					}
				}
			} else if (options.model==='CControllerBuildingElectricityPL2Model' && options.method==='fetched') {
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.calculate_ALL();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*if (s.name === 'ELEMISSIONS') {
									s.data = self.calculated_EL_emissions;
								} else if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}*/
								if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}
							});
						} else {
							this.renderChart();
						}
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					}
				}
			} else if (options.model==='CControllerBuildingElectricityPL3Model' && options.method==='fetched') {
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.calculate_ALL();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*if (s.name === 'ELEMISSIONS') {
									s.data = self.calculated_EL_emissions;
								} else if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}*/
								if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}
							});
						} else {
							this.renderChart();
						}
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					}
				}
			} else if (options.model==='CControllerBuildingHeatingQE01Model' && options.method==='fetched') {
				//console.log('NOTIFY BuildingHeatingQE01Model fetched!');
				//console.log(['options.status=',options.status]);
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.calculate_ALL();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*if (s.name === 'DHEMISSIONS') {
									s.data = self.calculated_DH_emissions;
								} else if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}*/
								if (s.name === 'ALLEMISSIONS') {
									s.data = self.calculated_ALL_emissions;
								}
							});
							
						} else {
							this.renderChart();
						}
						
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					}
				}
			}
		}
	}
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_emission_el = LM['translation'][sel]['BUILDING_EMISSION_EL'];
		const localized_string_emission_dh = LM['translation'][sel]['BUILDING_EMISSION_DH'];
		const localized_string_emission_axis = LM['translation'][sel]['BUILDING_EMISSION_AXIS_LABEL'];
		const localized_string_emission_el_legend = LM['translation'][sel]['BUILDING_EMISSION_EL_LEGEND'];
		const localized_string_emission_dh_legend = LM['translation'][sel]['BUILDING_EMISSION_DH_LEGEND'];
		const localized_string_emission_all = LM['translation'][sel]['BUILDING_EMISSION_ALL'];
		const localized_string_emission_all_legend = LM['translation'][sel]['BUILDING_EMISSION_ALL_LEGEND'];
		
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
			//self.chart.data = self.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values;
			//console.log(['self.chart.data=',self.chart.data]);
			
			var dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 3};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_emission_axis;
			valueAxis.min = 0;
			
			/*
			var series1 = self.chart.series.push(new am4charts.LineSeries());
			series1.data = self.calculated_EL_emissions; 
			series1.dataFields.dateX = "timestamp";
			series1.dataFields.valueY = "value";
			series1.tooltipText = localized_string_emission_el + ": [bold]{valueY.formatNumber('#.')}[/] kgCO2/h";
			series1.fillOpacity = 0;
			series1.name = "ELEMISSIONS";
			series1.customname = localized_string_emission_el_legend;
			series1.stroke = am4core.color("#ff0");
			series1.fill = "#ff0";
			series1.legendSettings.labelText = "{customname}";
			
			var series2 = self.chart.series.push(new am4charts.LineSeries());
			series2.data = self.calculated_DH_emissions; 
			series2.dataFields.dateX = "timestamp";
			series2.dataFields.valueY = "value";
			series2.tooltipText = localized_string_emission_dh + ": [bold]{valueY.formatNumber('#.')}[/] kgCO2/h";
			series2.fillOpacity = 0;
			series2.name = 'DHEMISSIONS';
			series2.customname = localized_string_emission_dh_legend;
			series2.stroke = am4core.color("#0f0");
			series2.fill = "#0f0";
			series2.legendSettings.labelText = "{customname}";
			*/
			
			var series3 = self.chart.series.push(new am4charts.LineSeries());
			series3.data = self.calculated_ALL_emissions; 
			series3.dataFields.dateX = "timestamp";
			series3.dataFields.valueY = "value";
			series3.tooltipText = localized_string_emission_all + ": [bold]{valueY.formatNumber('#.')}[/] gCO2";
			series3.fillOpacity = 0.25;
			series3.name = 'ALLEMISSIONS';
			series3.customname = localized_string_emission_all_legend;
			series3.stroke = am4core.color("#fff");
			series3.fill = "#fff";
			series3.legendSettings.labelText = "{customname}";
			
			
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
			self.chart.scrollbarX.series.push(series3);
			
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
		const localized_string_title = LM['translation'][sel]['BUILDING_CO2_TITLE'];
		const localized_string_descr = LM['translation'][sel]['BUILDING_CO2_DESCRIPTION'];
		const localized_string_back = LM['translation'][sel]['BACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/leaf.svg" height="80"/></p>'+
					'<p style="text-align:center;">'+localized_string_descr+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="timerange-buttons-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="'+this.CHARTID+'" class="large-chart"></div>'+
					'<div id="performance" class="performance"></div>'+
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
		
		const myModels = this.controller.modelnames;
		this.setTimerangeHandlers(myModels);
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('menu');
		});
		this.showInfo(myModels); // Lists models with parameters at #data-fetching-info
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('CView => render models READY!!!!');
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
				$(html).appendTo('#'+this.FELID);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				this.calculate_ALL();
				this.renderChart();
				myModels.forEach(m=>{
					this.updateInfoModelValues(m, this.models[m].values.length); // implemented in TimeRangeView
				});
			}
		} else {
			//console.log('CView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
