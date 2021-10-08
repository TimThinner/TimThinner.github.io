import View from '../common/View.js';

export default class CView extends View {
	
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
		this.selected = "b1d";
		
		this.calculated_EL_emissions = [];
		this.calculated_DH_emissions = [];
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
	
	showInfo() {
		const html = '<p class="fetching-info">Timerange is ' + 
			this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].timerange.begin +
			' days and the interval is ' + 
			this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].interval + '</p>';
			
		$('#data-fetching-info').empty().append(html);
		/*
		const html = '<p class="fetching-info">Fetching interval is ' + 
			this.controller.fetching_interval_in_seconds + 
			' seconds. Cache expiration is ' + 
			this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].cache_expiration_in_seconds + ' seconds.</p>';
		$('#data-fetching-info').empty().append(html);
		*/
	}
	
	resetButtonClass() {
		const elems = document.getElementsByClassName("my-range-button");
		for(let i = 0; i < elems.length; i++) {
			$(elems[i]).removeClass("selected");
		}
		$('#'+this.selected).addClass("selected");
	}
	
	/*
		Timerange is set with buttons.
		New param is an array of models 
		
		
		PT30S (30 seconds)
		PT5M (5 minutes)
		PT1H (1 hour)
		PT24H (24 hours)
		
		INTERVAL	TIMERANGE		NUMBER OF SAMPLES
		3 MIN		1 day (24H)		 480 (24 x 20)
		10 MINS		1 week			1008 (7 x 24 x 6)
		20 MINS		2 weeks			1008 (14 x 24 x 3)
		30 MINS 	1 month			1440 (30 x 48)
		4 HOURS		6 months		1080 (30 x 6 x 6)
		6 HOURS		1 year			1460 (4 x 365)
		
		
		"b1d"	1D
		"b1w"	1W
		"b2w"	2W
		"b1m"	1M
		"b6m"	6M
		"b1y"	1Y
	*/
	setTimerangeHandlers(models) {
		const self = this;
		
		$('#'+this.selected).addClass("selected");
		
		$('#b1d').on('click',function() {
			self.selected = "b1d";
			self.resetButtonClass();
			// Controller has all needed models + menumodel, which we ignore here.
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=1 for model.name=',model.name]);
					model.timerange = { begin: 1, end: 0 };
					model.interval = undefined;//'PT3M';
				}
			});
			self.controller.refreshTimerange();
			self.showInfo();
		});
		
		$('#b1w').on('click',function() {
			self.selected = "b1w";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=2 for model.name=',model.name]);
					model.timerange = { begin: 7, end: 0 };
					model.interval = undefined; //'PT10M';
				}
			});
			self.controller.refreshTimerange();
			self.showInfo();
		});
		
		$('#b2w').on('click',function() {
			self.selected = "b2w";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=3 for model.name=',model.name]);
					model.timerange = { begin: 14, end: 0 };
					model.interval = undefined; //PT20M';
				}
			});
			self.controller.refreshTimerange();
			self.showInfo();
		});
		
		$('#b1m').on('click',function() {
			self.selected = "b1m";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=4 for model.name=',model.name]);
					model.timerange = { begin: 30, end: 0 };
					model.interval = 'PT30M';
				}
			});
			self.controller.refreshTimerange();
			self.showInfo();
		});
		
		$('#b6m').on('click',function() {
			self.selected = "b6m";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=5 for model.name=',model.name]);
					model.timerange = { begin: 180, end: 0 };
					model.interval = 'PT4H';
				}
			});
			self.controller.refreshTimerange();
			self.showInfo();
		});
		
		$('#b1y').on('click',function() {
			self.selected = "b1y";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=6 for model.name=',model.name]);
					model.timerange = { begin: 364, end: 0 };
					model.interval = 'PT6H';
				}
			});
			self.controller.refreshTimerange();
			self.showInfo();
		});
	}
	
	calculate_DH_Sum() {
		
		
		if (this.models['BuildingHeatingQE01Model'].values.length > 0) {
			
			this.calculated_DH_emissions = [];
			
			this.models['BuildingHeatingQE01Model'].values.forEach(v=>{
				const val = v.value * 220; // Converts string to number.
				this.calculated_DH_emissions.push({timestamp: moment(v.timestamp).toDate(), value:val});
			});
		}
	}
	
	calculateSum() {
		
		// CALL THIS FOR EVERY MODEL, BUT NOTE THAT SUM IS CALCULATED ONLY WHEN ALL 3 MODELS ARE READY AND FILLED WITH VALUES!
		
		if (this.models['BuildingElectricityPL1Model'].values.length > 0 && 
			this.models['BuildingElectricityPL2Model'].values.length > 0 &&
			this.models['BuildingElectricityPL3Model'].values.length > 0) {
			
			// Calculate the sum of models like before.
			// and assign that to self.values array {timestamp => value}
			const sumbucket = {};
			this.calculated_EL_emissions = [];
			
			this.models['BuildingElectricityPL1Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				
				if (val > 1000) { val = val/1000; }
				
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
				
				if (val > 1000) { val = val/1000; }
				
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
				
				if (val > 1000) { val = val/1000; }
				
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
					sum += sumbucket[key][m] * 100;
				});
				
				
				
				this.calculated_EL_emissions.push({timestamp: moment(key).toDate(), value:sum});
			});
			
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
				
				
				// series1.name = "ELEMISSIONS";
				//series2.name = "DHEMISSIONS";
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						/*
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							//console.log('fetched ..... CView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								if (s.name === 'ELEMISSIONS') {
									s.data = self.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values;
								}
							});
						} else {
							//console.log('fetched ..... render CView()');
							this.renderChart();
						}
						*/
						
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
							// Maybe we shoud remove the spinner?
							//$('#'+this.CHARTID).empty();
						}
					}
				} else { // This should never be the case, but render anyway if we get here.
					this.render();
				}
			/*
				'BuildingElectricityPL1Model',
				'BuildingElectricityPL2Model',
				'BuildingElectricityPL3Model',
				'BuildingHeatingQE01Model'
			*/
			
			} else if (options.model==='BuildingElectricityPL1Model' && options.method==='fetched') {
				console.log('NOTIFY BuildingElectricityPL1Model fetched!');
				console.log(['options.status=',options.status]);
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.calculateSum();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								
								//if (s.name === 'L1') {
								//	s.data = self.models['BuildingElectricityPL1Model'].values;
								//} else if (s.name === 'SUM') {
								//	s.data = self.values;
								//}
								if (s.name === 'ELEMISSIONS') {
									s.data = self.calculated_EL_emissions;
								}
								
							});
						}
						
						
						
					} else { // Error in fetching.
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					}
				}
			} else if (options.model==='BuildingElectricityPL2Model' && options.method==='fetched') {
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.calculateSum();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								
								//if (s.name === 'L2') {
								//	s.data = self.models['BuildingElectricityPL2Model'].values;
								//} else if (s.name === 'SUM') {
								//	s.data = self.values;
								//}
								
								if (s.name === 'ELEMISSIONS') {
									s.data = self.calculated_EL_emissions;
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
			} else if (options.model==='BuildingElectricityPL3Model' && options.method==='fetched') {
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.calculateSum();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								
								//if (s.name === 'L3') {
								//	s.data = self.models['BuildingElectricityPL3Model'].values;
								//} else if (s.name === 'SUM') {
								//	s.data = self.values;
								//}
								
								if (s.name === 'ELEMISSIONS') {
									s.data = self.calculated_EL_emissions;
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
				
				
				
			} else if (options.model==='BuildingHeatingQE01Model' && options.method==='fetched') {
				console.log('NOTIFY BuildingHeatingQE01Model fetched!');
				console.log(['options.status=',options.status]);
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						this.calculate_DH_Sum();
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								if (s.name === 'DHEMISSIONS') {
									s.data = self.calculated_DH_emissions;
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
		const localized_string_emission = LM['translation'][sel]['BUILDING_EMISSION'];
		const localized_string_emission_axis = LM['translation'][sel]['BUILDING_EMISSION_AXIS_LABEL'];
		const localized_string_emission_legend = LM['translation'][sel]['BUILDING_EMISSION_LEGEND'];
		
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
			dateAxis.baseInterval = {
				"timeUnit": "minute",
				"count": 3
				//"timeUnit": "second",
				//"count": 5
			};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_emission_axis;
			valueAxis.min = 0;
			
			var series1 = self.chart.series.push(new am4charts.LineSeries());
			series1.data = self.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values;
			series1.dataFields.dateX = "timestamp"; // "date";
			series1.dataFields.valueY = "value"; // "visits";
			series1.tooltipText = localized_string_emission + ": [bold]{valueY}[/] gCO2/h";
			series1.fillOpacity = 0.2;
			series1.name = "ELEMISSIONS";
			series1.customname = localized_string_emission_legend;
			series1.stroke = am4core.color("#ff0");
			series1.fill = "#ff0";
			series1.legendSettings.labelText = "{customname}";
			
			var series2 = self.chart.series.push(new am4charts.LineSeries());
			series2.data = self.calculated_DH_emissions; 
			series2.dataFields.dateX = "timestamp"; // "date";
			series2.dataFields.valueY = "value"; // "visits";
			series2.tooltipText = "Value: [bold]{valueY}[/]"; //"Visits: [bold]{valueY}[/]";
			series2.fillOpacity = 0.2;
			series2.name = "DHEMISSIONS";//localized_string_production;
			series2.stroke = am4core.color("#0f0");
			series2.fill = "#0f0";
			
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
					'<div id="'+this.CHARTID+'" class="large-chart"></div>'+
					'<div id="data-fetching-info"></div>'+
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
			'</div>';
		$(html).appendTo(this.el);
		
		//this.setTimerangeHandlers(['BuildingEmissionFactorForElectricityConsumedInFinlandModel','BuildingEmissionFactorOfElectricityProductionInFinlandModel']);
		this.setTimerangeHandlers(['BuildingEmissionFactorForElectricityConsumedInFinlandModel',
				'BuildingElectricityPL1Model','BuildingElectricityPL2Model','BuildingElectricityPL3Model',
				'BuildingHeatingQE01Model']);
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('menu');
		});
		this.showInfo();
		this.rendered = true;
		
		if (this.areModelsReady()) {
			//console.log('CView => render models READY!!!!');
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
				$(html).appendTo('#'+this.FELID);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				this.renderChart();
			}
		} else {
			//console.log('CView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
