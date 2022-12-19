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
		
		this.numberOfDays = 31;
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
		const ts = this.models['FlexEntsoeEnergyPriceModel'].timeseries;
		
		// At ENTSOE price_unit is 'MWH' and currency is 'EUR', we want to convert this to snt/kWh (c/kWh)
		// 'EUR' => 'snt' and 'MWH' => 'kWh' multiply with 100 and divide by 1000 => MULTIPLY BY 0.1!
		let currency = 'EUR';
		if (this.models['FlexEntsoeEnergyPriceModel'].currency !== 'undefined') {
			currency = this.models['FlexEntsoeEnergyPriceModel'].currency;
		}
		let price_unit = 'MWH';
		if (this.models['FlexEntsoeEnergyPriceModel'].price_unit !== 'undefined') {
			price_unit = this.models['FlexEntsoeEnergyPriceModel'].price_unit;
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
		if (this.models['FlexBuildingElectricityPL1Model'].values.length > 0 && 
			this.models['FlexBuildingElectricityPL2Model'].values.length > 0 &&
			this.models['FlexBuildingElectricityPL3Model'].values.length > 0) {
			
			// Calculate the sum of models like before.
			// and assign that to self.values array {timestamp => value}
			const sumbucket = {};
			
			this.models['FlexBuildingElectricityPL1Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL1'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL1'] = val; // update
				}
			});
			
			this.models['FlexBuildingElectricityPL2Model'].values.forEach(v=>{
				const ds = moment(v.timestamp).format();
				let val = +v.value; // Converts string to number.
				if (sumbucket.hasOwnProperty(ds)) {
					sumbucket[ds]['PL2'] = val; // update
				} else {
					sumbucket[ds] = {}; // create new entry
					sumbucket[ds]['PL2'] = val; // update
				}
			});
			
			this.models['FlexBuildingElectricityPL3Model'].values.forEach(v=>{
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
				//console.log(['ELECONS ds=',ds]);
				bucket[ds] = {};
				bucket[ds]['elecons'] = e.value;
			});
			this.prices.forEach(p=>{
				const ds = moment(p.date).format(); // date is a Date object => convert to string.
				if (bucket.hasOwnProperty(ds)) {
					bucket[ds]['price'] = p.price;
				}
			});
			const daysToShow = this.numberOfDays;
			for (let i=daysToShow; i>0; i--) {
				// Here we fill sum_bucket a day at a time with sum and average values.
				const m_date = moment().subtract(i,'days');
				m_date.set({'h':12,'m':0,'s':0,'ms':0});
				
				const s_date = moment().subtract(i,'days').format('YYYY-MM-DD');
				sum_bucket[s_date] = {timestamp:m_date.toDate(), total:0, elecons:0, price:0};
				
				let count = 0;
				let total = 0;
				let elecons = 0; // We need to calculate average.
				let price = 0; // We need to calculate average.
				Object.keys(bucket).forEach(key=>{
					const yyyymmdd = key.slice(0,10);
					if (yyyymmdd === s_date) {
						count++;
						elecons += bucket[key].elecons;
						price += bucket[key].price;
						total += bucket[key].elecons*bucket[key].price;
					}
				});
				sum_bucket[s_date].total = total;
				if (count > 0) {
					sum_bucket[s_date].elecons = elecons/count;
					sum_bucket[s_date].price = 100*price/count; // euro => cent
				}
			}
		} else {
			console.log('======== NOT READY TO MERGE YET! =========');
		}
		console.log(['sum_bucket=',sum_bucket]);
		return sum_bucket;
	}
	
	updateTheChart() {
		const self = this;
		// If both datasets are fetched and ready, merge returns an object with data.
		const resu = this.merge();
		if (Object.keys(resu).length > 0) {
			this.values = [];
			Object.keys(resu).forEach(key=>{
				this.values.push({
					timestamp:resu[key].timestamp,
					total:resu[key].total,
					elecons: resu[key].elecons,
					price: resu[key].price
				});
			});
			console.log(['UPDATE THE CHART! resu=',resu,' this.values=',this.values]);
				
			$('#'+this.FELID).empty();
			if (typeof this.chart !== 'undefined') {
				console.log('fetched ..... FlexView CHART UPDATED!');
				am4core.iter.each(this.chart.series.iterator(), function (s) {
					//if (s.name === 'SUM') {
					s.data = self.values;
					//}
				});
			} else {
				this.renderChart();
			}
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
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				
				//super.notify(options);
				// Reset data arrays.
				this.elecons = [];
				this.prices = [];
				
				console.log('PeriodicTimeoutObserver timeout!');
				Object.keys(this.models).forEach(key => {
					if (key === 'FlexEntsoeEnergyPriceModel') {
						console.log(['FETCH MODEL key=',key]);
						
						// EntsoeModel used to have hard-coded start at now-192 hours = 8 days
						// Like this:
						// const body_period_start = moment.utc().subtract(192, 'hours').format('YYYYMMDDHH') + '00'; // yyyyMMddHHmm
						// const body_period_end = moment.utc().add(1,'hours').format('YYYYMMDDHH') + '00';   // yyyyMMddHHmm
						// Now lets have those params from function call:
						// const body_period_start = moment.utc().subtract(bv, bu).format('YYYYMMDDHH') + '00'; // yyyyMMddHHmm
						// const body_period_end = moment.utc().format('YYYYMMDDHH') + '00';   // yyyyMMddHHmm
						
						const daysToFetch = this.numberOfDays+1;
						const timerange = {begin:{value:daysToFetch,unit:'days'}};
						this.models[key].fetch(timerange);
						
					} else if (key.indexOf('FlexBuildingElectricityPL') === 0) {
						// See if these params are enough?
						this.models[key].interval = 'PT60M';
						
						const daysToFetch = this.numberOfDays+1;
						this.models[key].timerange = {begin:{value:daysToFetch,unit:'days'},end:{value:0,unit:'days'}};
						// Add empty object as dummy parameter.
						
						// See: adjustSyncMinute() and adjustSyncHour() at TimeRangeView.js
						const sync_minute = 0;
						const sync_hour = moment().hour();
						console.log(['FETCH key=',key,' sync_minute=',sync_minute,' sync_hour=',sync_hour]);
						this.models[key].fetch({}, sync_minute, sync_hour);
					}
				});
			} else if (options.model==='FlexEntsoeEnergyPriceModel' && options.method==='fetched') {
				console.log('NOTIFY '+options.model+' '+options.status+' fetched!');
				if (options.status === 200) {
					this.prices = this.convertPriceData();
					//console.log('==================================');
					//console.log(['this.prices=',this.prices]);
					//console.log('==================================');
					this.updateTheChart();
					
				} else { // Error in fetching.
					
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model.indexOf('FlexBuildingElectricityPL') === 0 && options.method==='fetched') {
				console.log('NOTIFY '+options.model+' '+options.status+' fetched!');
				if (options.status === 200) {
					
					this.elecons = this.calculateSum();
					this.updateTheChart();
					
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
		
		const localized_string_total = 'Total';//LM['translation'][sel]['BUILDING_POWER'];
		const localized_string_price = 'Price';//LM['translation'][sel]['BUILDING_POWER'];
		const localized_string_power = 'Power';//LM['translation'][sel]['BUILDING_POWER'];
		
		const localized_string_power_axis = ''; //LM['translation'][sel]['BUILDING_POWER_AXIS_LABEL'];
		const localized_string_cost_legend = 'Total (€)';//LM['translation'][sel]['BUILDING_POWER_LEGEND']; // Instantaneous power
		const localized_string_ele_legend = 'Price (cent)';//LM['translation'][sel]['BUILDING_POWER_LEGEND']; // Instantaneous power
		const localized_string_power_legend = 'Power (kWh)';//LM['translation'][sel]['BUILDING_POWER_LEGEND']; // Instantaneous power
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			// Create chart
			self.chart = am4core.create(self.CHARTID, am4charts.XYChart);
			self.paddingRight = 20;
			self.chart.numberFormatter.numberFormat = "#.##";
			//self.chart.data = generateChartData();
			
			// {'timestamp':...,'value':...}
			//self.chart.data = self.models['BuildingElectricityPL1Model'].values;
			//console.log(['self.chart.data=',self.chart.data]);
			
			var dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {"timeUnit": "minute","count": 60};
			//dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			dateAxis.tooltipDateFormat = "d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_power_axis;
			
			const seri = self.chart.series.push(new am4charts.LineSeries());
			seri.data = self.values;
			seri.dataFields.dateX = "timestamp";
			seri.dataFields.valueY = "total";
			seri.tooltipText = localized_string_total + ": [bold]{valueY}[/] €";
			seri.fillOpacity = 0.2;
			seri.name = 'TOTAL';
			seri.customname = localized_string_cost_legend;
			seri.stroke = am4core.color("#0ff");
			seri.fill = "#0ff";
			seri.legendSettings.labelText = "{customname}";
			
			const seri2 = self.chart.series.push(new am4charts.LineSeries());
			seri2.data = self.values;
			seri2.dataFields.dateX = "timestamp";
			seri2.dataFields.valueY = "price";
			seri2.tooltipText = localized_string_price + ": [bold]{valueY}[/] cent/kWh";
			seri2.fillOpacity = 0.2;
			seri2.name = 'PRICE';
			seri2.customname = localized_string_ele_legend;
			seri2.stroke = am4core.color("#ff0");
			seri2.fill = "#ff0";
			seri2.legendSettings.labelText = "{customname}";
			
			const seri3 = self.chart.series.push(new am4charts.LineSeries());
			seri3.data = self.values;
			seri3.dataFields.dateX = "timestamp";
			seri3.dataFields.valueY = "elecons";
			seri3.tooltipText = localized_string_power + ": [bold]{valueY}[/] kWh";
			seri3.fillOpacity = 0.2;
			seri3.name = 'POWER';
			seri3.customname = localized_string_power_legend;
			seri3.stroke = am4core.color("#0f0");
			seri3.fill = "#0f0";
			seri3.legendSettings.labelText = "{customname}";
			
			
			
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
		const localized_string_title = LM['translation'][sel]['BUILDING_FLEXIBILITY_TITLE'];
		const localized_string_descr = LM['translation'][sel]['BUILDING_FLEXIBILITY_DESCRIPTION'];
		const localized_string_back = LM['translation'][sel]['BACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/flex.svg" height="80"/></p>'+
					'<p style="text-align:center;">'+localized_string_descr+'</p>'+
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
				this.renderChart();
			}
		} else {
			console.log('FlexView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
