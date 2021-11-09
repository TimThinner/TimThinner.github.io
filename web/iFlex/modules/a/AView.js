import TimeRangeView from '../common/TimeRangeView.js';

export default class AView extends TimeRangeView {
	
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
		this.FELID = 'building-electricity-view-failure';
		this.CHARTID = 'building-electricity-chart';
		
		this.values = [];
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
	
	calculateSum() {
		
		// CALL THIS FOR EVERY MODEL, BUT NOTE THAT SUM IS CALCULATED ONLY WHEN ALL 3 MODELS ARE READY AND FILLED WITH VALUES!
		
		if (this.models['BuildingElectricityPL1Model'].values.length > 0 && 
			this.models['BuildingElectricityPL2Model'].values.length > 0 &&
			this.models['BuildingElectricityPL3Model'].values.length > 0) {
			
			// Calculate the sum of models like before.
			// and assign that to self.values array {timestamp => value}
			const sumbucket = {};
			this.values = [];
			
			this.models['BuildingElectricityPL1Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				
				//if (val > 1000) { val = val/1000; }
				
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['BuildingElectricityPL1Model'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['BuildingElectricityPL1Model'] = val; // update
				}
			});
			
			this.models['BuildingElectricityPL2Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				
				//if (val > 1000) { val = val/1000; }
				
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['BuildingElectricityPL2Model'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['BuildingElectricityPL2Model'] = val; // update
				}
			});
			
			this.models['BuildingElectricityPL3Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				
				//if (val > 1000) { val = val/1000; }
				
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['BuildingElectricityPL3Model'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['BuildingElectricityPL3Model'] = val; // update
				}
			});
			
			Object.keys(sumbucket).forEach(key => {
				let sum = 0;
				Object.keys(sumbucket[key]).forEach(m => {
					sum += sumbucket[key][m];
				});
				this.values.push({timestamp: moment(key).toDate(), value:sum});
			});
			
			
			// NEW: Sort values by the timestamp Date: oldest first.
			// sort by string (created is a string, for example: "2021-04-21T07:40:50.965Z")
			this.values.sort(function(a, b) {
				if (a.timestamp < b.timestamp) {
					return -1;
				}
				if (a.timestamp > b.timestamp) {
					return 1;
				}
				return 0; // strings must be equal
			});
			console.log(['this.values=',this.values]);
			// sort by timestamp (Date)
			//this.values.sort(function(a,b){
				//return b.timestamp - a.timestamp;
			//});
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
				
			} else if (options.model==='BuildingElectricityPL1Model' && options.method==='fetched') {
				console.log('NOTIFY BuildingElectricityPL1Model fetched!');
				console.log(['options.status=',options.status]);
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.calculateSum();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... BuildingElectricityView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*
								if (s.name === 'L1') {
									s.data = self.models['BuildingElectricityPL1Model'].values;
								} else if (s.name === 'SUM') {
									s.data = self.values;
								}*/
								if (s.name === 'SUM') {
									s.data = self.values;
								}
							});
						} else {
							console.log('fetched ..... render BuildingElectricityView()');
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
			} else if (options.model==='BuildingElectricityPL2Model' && options.method==='fetched') {
				console.log('NOTIFY BuildingElectricityPL2Model fetched!');
				console.log(['options.status=',options.status]);
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.calculateSum();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... BuildingElectricityView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*
								if (s.name === 'L2') {
									s.data = self.models['BuildingElectricityPL2Model'].values;
								} else if (s.name === 'SUM') {
									s.data = self.values;
								}*/
								if (s.name === 'SUM') {
									s.data = self.values;
								}
							});
						} else {
							console.log('fetched ..... render BuildingElectricityView()');
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
			} else if (options.model==='BuildingElectricityPL3Model' && options.method==='fetched') {
				console.log('NOTIFY BuildingElectricityPL3Model fetched!');
				console.log(['options.status=',options.status]);
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.updateInfoModelValues(options.model, this.models[options.model].values.length); // implemented in TimeRangeView
						this.calculateSum();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... BuildingElectricityView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								/*
								if (s.name === 'L3') {
									s.data = self.models['BuildingElectricityPL3Model'].values;
								} else if (s.name === 'SUM') {
									s.data = self.values;
								}*/
								if (s.name === 'SUM') {
									s.data = self.values;
								}
							});
						} else {
							console.log('fetched ..... render BuildingElectricityView()');
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
			//self.chart.data = self.models['BuildingElectricityPL1Model'].values;
			//console.log(['self.chart.data=',self.chart.data]);
			
			var dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 3};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_power_axis;
			/*
			var series1 = self.chart.series.push(new am4charts.LineSeries());
			series1.data = self.models['BuildingElectricityPL1Model'].values;
			series1.dataFields.dateX = "timestamp"; // "date";
			series1.dataFields.valueY = "value"; // "visits";
			series1.tooltipText = "Value: [bold]{valueY}[/]"; //"Visits: [bold]{valueY}[/]";
			series1.fillOpacity = 0;
			series1.name = 'L1';
			series1.stroke = am4core.color("#ff0");
			series1.fill = "#ff0";
			
			var series2 = self.chart.series.push(new am4charts.LineSeries());
			series2.data = self.models['BuildingElectricityPL2Model'].values;
			series2.dataFields.dateX = "timestamp"; // "date";
			series2.dataFields.valueY = "value"; // "visits";
			series2.tooltipText = "Value: [bold]{valueY}[/]"; //"Visits: [bold]{valueY}[/]";
			series2.fillOpacity = 0;
			series2.name = 'L2';
			series2.stroke = am4core.color("#0f0");
			series2.fill = "#0f0";
			
			var series3 = self.chart.series.push(new am4charts.LineSeries());
			series3.data = self.models['BuildingElectricityPL3Model'].values;
			series3.dataFields.dateX = "timestamp"; // "date";
			series3.dataFields.valueY = "value"; // "visits";
			series3.tooltipText = "Value: [bold]{valueY}[/]"; //"Visits: [bold]{valueY}[/]";
			series3.fillOpacity = 0;
			series3.name = 'L3';
			series3.stroke = am4core.color("#f80");
			series3.fill = "#f80";
			*/
			
			var series4 = self.chart.series.push(new am4charts.LineSeries());
			series4.data = self.values;
			series4.dataFields.dateX = "timestamp"; // "date";
			series4.dataFields.valueY = "value"; // "visits";
			series4.tooltipText = localized_string_power + ": [bold]{valueY}[/] kW";
			series4.fillOpacity = 0.2;
			series4.name = 'SUM';
			series4.customname = localized_string_power_legend;
			series4.stroke = am4core.color("#0ff");
			series4.fill = "#0ff";
			series4.legendSettings.labelText = "{customname}";
			
			
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
			self.chart.scrollbarX.series.push(series4);
			
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
		const localized_string_title = LM['translation'][sel]['BUILDING_ELECTRICITY_TITLE'];
		const localized_string_back = LM['translation'][sel]['BACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/electricity.svg" height="80"/></p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="timerange-buttons-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="'+this.CHARTID+'" class="large-chart"></div>'+
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
		
		const myModels = ['BuildingElectricityPL1Model','BuildingElectricityPL2Model','BuildingElectricityPL3Model'];
		this.setTimerangeHandlers(myModels);
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		this.showInfo(myModels);
		this.rendered = true;
		
		if (this.areModelsReady()) {
			
			console.log('AView => render models READY!!!!');
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
				$(html).appendTo('#'+this.FELID);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				this.calculateSum();
				this.renderChart();
				myModels.forEach(m=>{
					this.updateInfoModelValues(m, this.models[m].values.length); // implemented in TimeRangeView
				});
			}
		} else {
			console.log('AView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
