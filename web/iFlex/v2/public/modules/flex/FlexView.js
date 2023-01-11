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
		/*
		this.values = [];
		this.elecons = [];
		this.prices = [];
		*/
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
	
	extractObixArray(vals) {
		const val_array = [];
		vals.forEach(v => {
			let val = +v.value; // Converts string to number.
			val_array.push({timestamp: moment(v.timestamp).toDate(), value:val});
		});
		// NEW: Sort values by the timestamp: oldest first.
		// Sort by date (timestamp is a Date).
		val_array.sort(function(a, b) {
			if (a.timestamp < b.timestamp) {
				return -1;
			}
			if (a.timestamp > b.timestamp) {
				return 1;
			}
			return 0; // dates must be equal
		});
		return val_array;
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
				newdata.push({timestamp: timestamp.toDate(), value: price});
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
			// NEW: Sort values by the timestamp: oldest first.
			// Sort by date (timestamp is a Date).
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
		//console.log(['val_array=',val_array]);
		return val_array;
	}
	
	/*
	In FlexResultModel we have:
			ele_energy: 0,
			ele_price: 0,
			ele_emissions: 0,
			dh_energy: 0,
			dh_price: 0,
			dh_emissions: 0,
			optimization: 0
	*/
	fillValues() {
		console.log('============ FILL VALUES =================');
		this.values = [];
		//const bas = this.models['FlexResultModel'].hourlyBaskets;
		let ele_ene_sum = 0;
		let ele_pri_sum = 0;
		let ele_emi_sum = 0;
		
		let dh_ene_sum = 0;
		let dh_pri_sum = 0;
		let dh_emi_sum = 0;
		
		Object.keys(this.models['FlexResultModel'].dailyBaskets).forEach(key => {
			const ele_ene = this.models['FlexResultModel'].dailyBaskets[key].ele_energy;
			const ele_pri = this.models['FlexResultModel'].dailyBaskets[key].ele_price;
			const ele_emi = this.models['FlexResultModel'].dailyBaskets[key].ele_emissions;
			
			ele_ene_sum += ele_ene;
			ele_pri_sum += ele_pri;
			ele_emi_sum += ele_emi;
			
			const dh_ene = this.models['FlexResultModel'].dailyBaskets[key].dh_energy;
			const dh_pri = this.models['FlexResultModel'].dailyBaskets[key].dh_price;
			const dh_emi = this.models['FlexResultModel'].dailyBaskets[key].dh_emissions;
			
			const opt = this.models['FlexResultModel'].dailyBaskets[key].optimization;
			
			dh_ene_sum += dh_ene;
			dh_pri_sum += dh_pri;
			dh_emi_sum += dh_emi;
			
			this.values.push({
				timestamp: moment(key).toDate(),
				ele_ene: dh_ene,
				ele_pri: dh_pri,
				ele_emi: dh_emi,
				opt: opt*100
			});
		});
		console.log(['ele_ene_sum=',ele_ene_sum,' ele_pri_sum=',ele_pri_sum,' ele_emi_sum=',ele_emi_sum]);
		console.log(['dh_ene_sum=',dh_ene_sum,' dh_pri_sum=',dh_pri_sum,' dh_emi_sum=',dh_emi_sum]);
		
		const ene_sum = ele_ene_sum + dh_ene_sum;
		const pri_sum = ele_pri_sum + dh_pri_sum;
		const emi_sum = ele_emi_sum + dh_emi_sum;
		
		console.log(['ene_sum=',ene_sum,' pri_sum=',pri_sum,' emi_sum=',emi_sum]);
	}
	
	updateTheChart() {
		const self = this;
		
		this.fillValues();
		
		console.log('UPDATE THE CHART!');
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
				
				this.models['FlexResultModel'].reset();
				//this.elecons = [];
				//this.prices = [];
				
				console.log('PeriodicTimeoutObserver timeout!');
				Object.keys(this.models).forEach(key => {
					if (key === 'EntsoeEnergyPriceModel') {
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
						
					} else { //if (key.indexOf('FlexBuildingElectricityPL') === 0) {
						
						//'MenuBuildingElectricityPL1Model',
						//'MenuBuildingElectricityPL2Model',
						//'MenuBuildingElectricityPL3Model',
						//'MenuEmissionFactorForElectricityConsumedInFinlandModel',
						//'MenuBuildingHeatingQE01Model',
						//'OptimizationModel'
						
						// See if these params are enough?
						const daysToFetch = this.numberOfDays+1;
						this.models[key].interval = 'PT60M';
						this.models[key].timerange = {begin:{value:daysToFetch,unit:'days'},end:{value:0,unit:'days'}};
						// Add empty object as dummy parameter.
						
						// See: adjustSyncMinute() and adjustSyncHour() at TimeRangeView.js
						const sync_minute = 0;
						const sync_hour = moment().hour();
						console.log(['FETCH key=',key,' sync_minute=',sync_minute,' sync_hour=',sync_hour]);
						this.models[key].fetch({}, sync_minute, sync_hour);
					}
				});
				
				
			} else if (options.model==='EntsoeEnergyPriceModel' && options.method==='fetched') {
				if (options.status === 200) {
					const ele_prices = this.convertPriceData(); // An array of {timestamp(Date), value(price)} -objects.
					console.log(['ele_prices=',ele_prices]);
					
					this.models['FlexResultModel'].copy('ele_prices',ele_prices);
					const priceArray = this.models['FlexResultModel'].merge('ele_cons','ele_prices');
					
					this.models['FlexResultModel'].update('ele_price', priceArray);
					this.updateTheChart();
					
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model === 'OptimizationModel' && options.method==='fetched') {
				if (options.status === 200) {
					// timestamp:Date, value: "0.0" or "3.0" (or "2.0")
					const vals = this.models[options.model].values;
					if (vals.length > 0) {
						const optimizations = this.extractObixArray(vals);
						
						this.models['FlexResultModel'].copy('optimizations',optimizations);
						this.models['FlexResultModel'].update('optimization', optimizations);
						
						this.updateTheChart();
					}
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model === 'MenuEmissionFactorForElectricityConsumedInFinlandModel' && options.method==='fetched') {
				if (options.status === 200) {
					const vals = this.models[options.model].values;
					if (vals.length > 0) {
						const ele_emission_factors = this.extractObixArray(vals);
						console.log(['ele_emission_factors=',ele_emission_factors]);
						if (ele_emission_factors.length > 0) {
							
							this.models['FlexResultModel'].copy('ele_emission_factors',ele_emission_factors);
							const emisArray = this.models['FlexResultModel'].merge('ele_cons','ele_emission_factors');
							
							this.models['FlexResultModel'].update('ele_emissions', emisArray);
							this.updateTheChart();
						}
					}
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model === 'MenuBuildingHeatingQE01Model' && options.method==='fetched') {
				if (options.status === 200) {
					const vals = this.models[options.model].values;
					if (vals.length > 0) {
						const dh_cons = this.extractObixArray(vals);
						console.log(['dh_cons=',dh_cons]);
						
						if (dh_cons.length > 0) {
							
							this.models['FlexResultModel'].copy('dh_cons',dh_cons);
							
							// Update FlexResultModel DH indicators.
							this.models['FlexResultModel'].update('dh_energy', dh_cons);
							this.models['FlexResultModel'].update('dh_price', dh_cons);
							this.models['FlexResultModel'].update('dh_emissions', dh_cons);
							
							this.updateTheChart();
						}
					}
					
				} else { // Error in fetching.
					console.log('ERROR in fetching '+options.model+'.');
				}
				
			} else if (options.model.indexOf('MenuBuildingElectricityPL') === 0 && options.method==='fetched') {
				if (options.status === 200) {
					const vals = this.models[options.model].values;
					if (vals.length > 0) {
						const ele_cons = this.calculateSum();
						if (ele_cons.length > 0) {
							this.models['FlexResultModel'].copy('ele_cons',ele_cons);
							
							const priceArray = this.models['FlexResultModel'].merge('ele_cons','ele_prices');
							const emisArray = this.models['FlexResultModel'].merge('ele_cons','ele_emission_factors');
							
							this.models['FlexResultModel'].update('ele_energy', ele_cons);
							this.models['FlexResultModel'].update('ele_price', priceArray);
							this.models['FlexResultModel'].update('ele_emissions', emisArray);
							
							this.updateTheChart();
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
		
		const tooltip_ele_ene = 'Energy';//LM['translation'][sel]['BUILDING_POWER'];
		const tooltip_ele_pri = 'Price';//LM['translation'][sel]['BUILDING_POWER'];
		const tooltip_ele_emi = 'Emissions';//LM['translation'][sel]['BUILDING_POWER'];
		const tooltip_ele_opt = 'Optimization';
		
		const localized_string_power_axis = ''; //LM['translation'][sel]['BUILDING_POWER_AXIS_LABEL'];
		const legend_ele_ene = 'Energy (kWh)';//LM['translation'][sel]['BUILDING_POWER_LEGEND']; // Instantaneous power
		const legend_ele_pri = 'Price (€)';//LM['translation'][sel]['BUILDING_POWER_LEGEND']; // Instantaneous power
		const legend_ele_emi = 'Emissions (kg)';//LM['translation'][sel]['BUILDING_POWER_LEGEND']; // Instantaneous power
		const legend_ele_opt = 'Optimization';
		/*
			const ele_ene = this.models['FlexResultModel'].dailyBaskets[key].ele_energy;
			const ele_pri = this.models['FlexResultModel'].dailyBaskets[key].ele_price;
			const ele_emi = this.models['FlexResultModel'].dailyBaskets[key].ele_emissions;
			
			const dh_ene = this.models['FlexResultModel'].dailyBaskets[key].dh_energy;
			const dh_pri = this.models['FlexResultModel'].dailyBaskets[key].dh_price;
			const dh_emi = this.models['FlexResultModel'].dailyBaskets[key].dh_emissions;
		*/
		
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
			//dateAxis.baseInterval = {"timeUnit": "minute","count": 60};
			dateAxis.baseInterval = {"timeUnit": "hour","count":24};
			//dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
			//dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			dateAxis.tooltipDateFormat = "d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_power_axis;
			
			const seri = self.chart.series.push(new am4charts.LineSeries());
			seri.data = self.values;
			seri.dataFields.dateX = "timestamp";
			seri.dataFields.valueY = "ele_ene";
			seri.tooltipText = tooltip_ele_ene + ": [bold]{valueY}[/] kWh";
			//seri.tooltipText = "el energy: [bold]{valueY}[/] kWh";
			seri.fillOpacity = 0.2;
			seri.name = 'ELENERGY';
			seri.customname = legend_ele_ene;
			seri.stroke = am4core.color("#0ff");
			seri.fill = "#0ff";
			seri.legendSettings.labelText = "{customname}";
			
			const seri2 = self.chart.series.push(new am4charts.LineSeries());
			seri2.data = self.values;
			seri2.dataFields.dateX = "timestamp";
			seri2.dataFields.valueY = "ele_pri";
			//seri2.tooltipText = localized_string_price + ": [bold]{valueY}[/] cent/kWh";
			seri2.tooltipText = tooltip_ele_pri + ": [bold]{valueY}[/] €";
			seri2.fillOpacity = 0.2;
			seri2.name = 'ELPRICE';
			seri2.customname = legend_ele_pri;
			seri2.stroke = am4core.color("#ff0");
			seri2.fill = "#ff0";
			seri2.legendSettings.labelText = "{customname}";
			
			const seri3 = self.chart.series.push(new am4charts.LineSeries());
			seri3.data = self.values;
			seri3.dataFields.dateX = "timestamp";
			seri3.dataFields.valueY = "ele_emi";
			seri3.tooltipText = tooltip_ele_emi + ": [bold]{valueY}[/] kg";
			seri3.fillOpacity = 0.2;
			seri3.name = 'ELEMISSIONS';
			seri3.customname = legend_ele_emi;
			seri3.stroke = am4core.color("#0f0");
			seri3.fill = "#0f0";
			seri3.legendSettings.labelText = "{customname}";
			
			
			
			const seri4 = self.chart.series.push(new am4charts.ColumnSeries());
			seri4.data = self.values;
			//seri4.columns.template.width = am4core.percent(70);
			//seri4.columns.template.maxWidth = 50;
			seri4.columns.template.minWidth = 50;
			seri4.dataFields.dateX = "timestamp";
			seri4.dataFields.valueY = "opt";
			seri4.tooltipText = tooltip_ele_opt + ": [bold]{valueY}[/]";
			seri4.fillOpacity = 0.2;
			seri4.name = 'OPTIMIZATION';
			seri4.customname = legend_ele_opt;
			seri4.stroke = am4core.color("#ccc");
			seri4.fill = "#ccc";
			seri4.legendSettings.labelText = "{customname}";
			
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
				
				
				console.log('================ MODELS ARE READY!!! (FlexView) ==================');
				
				//const arra = this.models['FlexResultModel'].raw_ele_energy;
				//console.log(['raw_ele_energy=',arra]);
				
				this.fillValues();
				this.renderChart();
			}
		} else {
			console.log('FlexView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
