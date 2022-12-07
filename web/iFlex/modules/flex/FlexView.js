//import TimeRangeView from '../common/TimeRangeView.js';

import View from '../common//View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js'

export default class FlexView extends View {//TimeRangeView {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.PTO = new PeriodicTimeoutObserver({interval:this.controller.fetching_interval_in_seconds*1000});
		this.PTO.subscribe(this);
		
		this.chart = undefined;
		this.rendered = false;
		this.FELID = 'flex-view-failure';
		this.CHARTID = 'flex-chart';
		
		this.values = [];
		this.elecons = [];
		this.prices = [];
	}
	
	show() {
		// NOTE: FIRST render and then restart the timer.
		this.render();
		this.PTO.restart();
		//super.show();
	}
	
	hide() {
		//super.hide();
		this.PTO.stop();
		
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		//super.remove();
		this.PTO.stop();
		this.PTO.unsubscribe(this);
		
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
		p.timeInterval object with two arrays: start "2021-12-01T23:00Z" and end "2021-12-02T23:00Z"
		p.resolution array with one item "PT60M"
		
		p.Point array with 24 items
		position "1"
		price "99.12"
	*/
	convertPriceData() {
		// array of {date:..., price: ... } objects.
		const ts = this.models['EntsoeEnergyPriceModel'].timeseries;
		
		// At ENTSOE price_unit is 'MWH' and currency is 'EUR', we want to convert this to snt/kWh (c/kWh)
		// 'EUR' => 'snt' and 'MWH' => 'kWh' multiply with 100 and divide by 1000 => MULTIPLY BY 0.1!
		let currency = 'EUR';
		if (this.models['EntsoeEnergyPriceModel'].currency !== 'undefined') {
			currency = this.models['EntsoeEnergyPriceModel'].currency;
		}
		let price_unit = 'MWH';
		if (this.models['EntsoeEnergyPriceModel'].price_unit !== 'undefined') {
			price_unit = this.models['EntsoeEnergyPriceModel'].price_unit;
		}
		let factor = 1;
		if (price_unit === 'MWH') {
			// Convert values to EUR/kWh, we have to divide by 1000 (multiply by 1/1000).
			factor = 0.001; // 300 EUR/MWH => 30 EUR/kWh
		}
		console.log(['currency=',currency,' price_unit=',price_unit,' factor=',factor]);
		const newdata = [];
		ts.forEach(t=>{
			let timestamp = moment(t.timeInterval.start);
			const reso = moment.duration(t.resolution);
			t.Point.forEach(p=>{
				const price = p.price*factor;
				newdata.push({date: timestamp.toDate(), price: price});
				// Do we need to handle the +p.position when stepping from start to end?
				timestamp.add(reso);
			});
		});
		return newdata;
	}
	
	calculateSum() {
		// CALL THIS FOR EVERY MODEL, BUT NOTE THAT SUM IS CALCULATED ONLY WHEN ALL 3 MODELS ARE READY AND FILLED WITH VALUES!
		const val_array = [];
		if (this.models['MenuBuildingElectricityPL1Model'].values.length > 0 && 
			this.models['MenuBuildingElectricityPL2Model'].values.length > 0 &&
			this.models['MenuBuildingElectricityPL3Model'].values.length > 0) {
			
			// Calculate the sum of models like before.
			// and assign that to self.values array {timestamp => value}
			const sumbucket = {};
			
			this.models['MenuBuildingElectricityPL1Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL1'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL1'] = val; // update
				}
			});
			
			this.models['MenuBuildingElectricityPL2Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL2'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL2'] = val; // update
				}
			});
			
			this.models['MenuBuildingElectricityPL3Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
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
				val_array.push({timestamp: moment(key).toDate(), value:sum});
			});
			// NEW: Sort values by the timestamp Date: oldest first.
			// sort by string (created is a string, for example: "2021-04-21T07:40:50.965Z")
			val_array.sort(function(a, b) {
				if (a.timestamp < b.timestamp) {
					return -1;
				}
				if (a.timestamp > b.timestamp) {
					return 1;
				}
				return 0; // dates must be equal
			});
		} else {
			console.log('NOT ALL ELECTRICITY MODELS ARE READY... WAIT!');
		}
		console.log(['val_array=',val_array]);
		return val_array;
	}
	
	merge() {
		const sum_bucket = {};
		if (this.elecons.length > 0 && this.prices.length > 0) {
			console.log('======== MERGE! =========');
			const bucket = {};
			// For all consumption timestamps, check if price exist.
			this.elecons.forEach(e=>{
				const ds = moment(e.timestamp).format(); // timestamp is a Date object => convert to string.
				console.log(['ELECONS ds=',ds]);
				bucket[ds] = {};
				bucket[ds]['elecons'] = e.value;
			});
			this.prices.forEach(p=>{
				const ds = moment(p.date).format(); // date is a Date object => convert to string.
				if (bucket.hasOwnProperty(ds)) {
					bucket[ds]['price'] = p.price;
				} else {
					// DISCARD THIS!
					console.log(['DISCARD PRICE ds=',ds]);
				}
			});
			// How many entries?
			const len = Object.keys(bucket).length;
			console.log(['AFTER MERGE bucket=',bucket,' length=',len]);
			// Calculate sums starting from today-7 days to today-1 day (7 days data)
			for (let i=7; i>0; i--) {
				const m_date = moment().subtract(i,'days');
				m_date.set({'h':12,'m':0,'s':0,'ms':0});
				
				const s_date = moment().subtract(i,'days').format('YYYY-MM-DD');
				console.log(['initializing sum_bucket s_date=',s_date]);
				sum_bucket[s_date] = {timestamp:m_date.toDate(), value:0};
			}
			Object.keys(bucket).forEach(key=>{
				const yyyymmdd = key.slice(0,10);
				if (sum_bucket.hasOwnProperty(yyyymmdd)) {
					sum_bucket[yyyymmdd].value += bucket[key].elecons*bucket[key].price;
				}
			});
		} else {
			console.log('======== NOT READY TO MERGE YET! =========');
		}
		console.log(['sum_bucket=',sum_bucket]);
		return sum_bucket;
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
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				
				//super.notify(options);
				// Reset data arrays.
				this.elecons = [];
				this.prices = [];
				
				console.log('PeriodicTimeoutObserver timeout!');
				Object.keys(this.models).forEach(key => {
					if (key === 'EntsoeEnergyPriceModel') {
						console.log(['FETCH MODEL key=',key]);
						this.models[key].fetch();
					} else if (key.indexOf('MenuBuildingElectricityPL') === 0) {
						//key === 'MenuBuildingElectricityPL1Model' || key === 'MenuBuildingElectricityPL2Model' || key === 'MenuBuildingElectricityPL3Model') {
						// See if these params are enough?
						this.models[key].interval = 'PT60M';
						this.models[key].timerange = {begin:{value:8,unit:'days'},end:{value:0,unit:'days'}};
						// Add empty object as dummy parameter.
						
						// See: adjustSyncMinute() and adjustSyncHour() at TimeRangeView.js
						const sync_minute = 0;
						const sync_hour = moment().hour();
						console.log(['FETCH key=',key,' sync_minute=',sync_minute,' sync_hour=',sync_hour]);
						this.models[key].fetch({}, sync_minute, sync_hour);
					}
				});
			} else if (options.model==='EntsoeEnergyPriceModel' && options.method==='fetched') {
				
				console.log('NOTIFY '+options.model+' '+options.status+' fetched!');
				
				if (options.status === 200) {
					this.prices = this.convertPriceData();
					console.log('==================================');
					console.log(['this.prices=',this.prices]);
					console.log('==================================');
					// If both datasets are fetched and ready, merge returns an object with data.
					const resu = this.merge();
					if (Object.keys(resu).length > 0) {
						this.values = [];
						Object.keys(resu).forEach(key=>{
							this.values.push({timestamp:resu[key].timestamp, value:resu[key].value});
						});
						console.log(['UPDATE THE CHART! resu=',resu,' this.values=',this.values]);
						
						
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... FlexView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								if (s.name === 'SUM') {
									s.data = self.values;
								}
							});
						} else {
							this.renderChart();
						}
						
					}
					
				} else { // Error in fetching.
					
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model.indexOf('MenuBuildingElectricityPL') === 0 && options.method==='fetched') {
				
				console.log('NOTIFY '+options.model+' '+options.status+' fetched!');
				
				if (options.status === 200 || options.status === '200') {
					if (this.models[options.model].values.length > 0) {
						
						console.log(['values=',this.models[options.model].values]);
						this.elecons = this.calculateSum();
						if (this.elecons.length > 0) {
							// If both datasets are fetched and ready, merge returns an object with data.
							const resu = this.merge();
							
							if (Object.keys(resu).length > 0) {
								this.values = [];
								Object.keys(resu).forEach(key=>{
									this.values.push({timestamp:resu[key].timestamp, value:resu[key].value});
								});
								console.log(['UPDATE THE CHART! resu=',resu,' this.values=',this.values]);
								
								
								$('#'+this.FELID).empty();
								if (typeof this.chart !== 'undefined') {
									console.log('fetched ..... FlexView CHART UPDATED!');
									am4core.iter.each(this.chart.series.iterator(), function (s) {
										if (s.name === 'SUM') {
											s.data = self.values;
										}
									});
								} else {
									this.renderChart();
								}
							}
						}
					} else {
						console.log('NO values!!!');
					}
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
			}
		}
	}
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_power = 'Price';//LM['translation'][sel]['BUILDING_POWER'];
		const localized_string_power_axis = 'Price (€)'; //LM['translation'][sel]['BUILDING_POWER_AXIS_LABEL'];
		const localized_string_power_legend = 'Daily cost (€)';//LM['translation'][sel]['BUILDING_POWER_LEGEND']; // Instantaneous power
		
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
			dateAxis.baseInterval = {"timeUnit": "minute","count": 60};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_power_axis;
			
			const seri = self.chart.series.push(new am4charts.LineSeries());
			seri.data = self.values;
			seri.dataFields.dateX = "timestamp";
			seri.dataFields.valueY = "value";
			seri.tooltipText = localized_string_power + ": [bold]{valueY}[/] €";
			seri.fillOpacity = 0.2;
			seri.name = 'SUM';
			seri.customname = localized_string_power_legend;
			seri.stroke = am4core.color("#0ff");
			seri.fill = "#0ff";
			seri.legendSettings.labelText = "{customname}";
			
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
			self.chart.scrollbarX.series.push(seri);
			
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
		const localized_string_title = 'Flexibility'; //LM['translation'][sel]['BUILDING_ELECTRICITY_TITLE'];
		const localized_string_back = LM['translation'][sel]['BACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/flex.svg" height="80"/></p>'+
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
		
		//this.setTimerangeButtons('timerange-buttons-wrapper');
		
		//const myModels = ['BuildingElectricityPL1Model','BuildingElectricityPL2Model','BuildingElectricityPL3Model'];
		//this.setTimerangeHandlers(myModels); // implemented in TimeRangeView
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		//this.showInfo(myModels); // implemented in TimeRangeView
		this.rendered = true;
		
		if (this.areModelsReady()) {
			
			console.log('FlexView => render models READY!!!!');
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
				$(html).appendTo('#'+this.FELID);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				//this.calculateSum();
				this.renderChart();
				//myModels.forEach(m=>{
					//this.updateInfoModelValues(m, this.models[m].values.length); // implemented in TimeRangeView
				//});
			}
		} else {
			console.log('FlexView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
