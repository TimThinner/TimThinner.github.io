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
		
		//this.chart = undefined;
		this.chartOne = undefined;
		this.chartTwo = undefined;
		
		this.rendered = false;
		this.FELID = 'flex-view-failure';
		//this.CHARTID = 'flex-chart';
		this.CHART_ONE_ID = 'flex-chart-one';
		this.CHART_TWO_ID = 'flex-chart-two';
		
		this.numberOfDays = this.models['FlexResultModel'].numberOfDays;
		this.valuesELE = [];
		this.valuesDH = [];
		
		this.sums = {
			ele_ene: 0,
			ele_pri: 0,
			ele_emi: 0,
			dh_ene: 0,
			dh_pri: 0,
			dh_emi: 0
		}
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
		
		if (typeof this.chartOne !== 'undefined') {
			this.chartOne.dispose();
			this.chartOne = undefined;
		}
		if (typeof this.chartTwo !== 'undefined') {
			this.chartTwo.dispose();
			this.chartTwo = undefined;
		}
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		//super.remove();
		this.PTO.stop();
		this.PTO.unsubscribe(this);
		
		if (typeof this.chartOne !== 'undefined') {
			this.chartOne.dispose();
			this.chartOne = undefined;
		}
		if (typeof this.chartTwo !== 'undefined') {
			this.chartTwo.dispose();
			this.chartTwo = undefined;
		}
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	percentage(propA, propB) {
		const retval = {
			'A': 0,
			'B': 0
		}
		const sum = this.sums[propA] + this.sums[propB];
		if (sum > 0) {
			retval.A = this.sums[propA]*100/sum;
			retval.B = this.sums[propB]*100/sum;
		}
		return retval;
	}
	
	/*
	Fill class property 
		this.sums = {
			ele_ene: 0,
			ele_pri: 0,
			ele_emi: 0,
			dh_ene: 0,
			dh_pri: 0,
			dh_emi: 0
		}
	and print out both texts to view.
	*/
	fillSums() {
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
			const dh_ene = this.models['FlexResultModel'].dailyBaskets[key].dh_energy;
			const dh_pri = this.models['FlexResultModel'].dailyBaskets[key].dh_price;
			const dh_emi = this.models['FlexResultModel'].dailyBaskets[key].dh_emissions;
			
			ele_ene_sum += ele_ene;
			ele_pri_sum += ele_pri;
			ele_emi_sum += ele_emi;
			
			dh_ene_sum += dh_ene;
			dh_pri_sum += dh_pri;
			dh_emi_sum += dh_emi;
		});
		
		this.sums.ele_ene = ele_ene_sum;
		this.sums.ele_pri = ele_pri_sum;
		this.sums.ele_emi = ele_emi_sum;
		
		this.sums.dh_ene = dh_ene_sum;
		this.sums.dh_pri = dh_pri_sum;
		this.sums.dh_emi = dh_emi_sum;
		
		const e_ene = this.percentage('ele_ene', 'dh_ene');
		const e_pri = this.percentage('ele_pri', 'dh_pri');
		const e_emi = this.percentage('ele_emi', 'dh_emi');
		
		const d_ene = this.percentage('dh_ene', 'ele_ene');
		const d_pri = this.percentage('dh_pri', 'ele_pri');
		const d_emi = this.percentage('dh_emi', 'ele_emi');
		
		const e_txt = '<span style="color:#0ff">'+e_ene.A.toFixed(0)+'%</span> <span style="color:#aaa"> ('+ele_ene_sum.toFixed(0)+'kWh)</span> '+
					'<span style="color:#ff0">'+e_pri.A.toFixed(0)+'%</span> <span style="color:#aaa"> ('+ele_pri_sum.toFixed(0)+'€)</span> '+
					'<span style="color:#0f0">'+e_emi.A.toFixed(0)+'%</span> <span style="color:#aaa"> ('+ele_emi_sum.toFixed(0)+'kg)</span>';
		$('#ele-sums').empty().append(e_txt);
		
		const d_txt = '<span style="color:#0ff">'+d_ene.A.toFixed(0)+'%</span> <span style="color:#aaa">('+dh_ene_sum.toFixed(0)+'kWh)</span> '+
					'<span style="color:#ff0">'+d_pri.A.toFixed(0)+'%</span> <span style="color:#aaa"> ('+dh_pri_sum.toFixed(0)+'€)</span> '+
					'<span style="color:#0f0">'+d_emi.A.toFixed(0)+'%</span> <span style="color:#aaa"> ('+dh_emi_sum.toFixed(0)+'kg)</span>';
		$('#dh-sums').empty().append(d_txt);
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
	fillValuesELE() {
		console.log('============ FILL VALUES ELE =================');
		this.valuesELE = [];
		
		Object.keys(this.models['FlexResultModel'].dailyBaskets).forEach(key => {
			const ele_ene = this.models['FlexResultModel'].dailyBaskets[key].ele_energy;
			const ele_pri = this.models['FlexResultModel'].dailyBaskets[key].ele_price;
			const ele_emi = this.models['FlexResultModel'].dailyBaskets[key].ele_emissions;
			const opt = this.models['FlexResultModel'].dailyBaskets[key].optimization;
			this.valuesELE.push({
				timestamp: moment(key).toDate(),
				ene: ele_ene,
				pri: ele_pri,
				emi: ele_emi,
				opt: opt*20
			});
		});
	}
	
	fillValuesDH() {
		console.log('============ FILL VALUES DH =================');
		this.valuesDH = [];
		
		Object.keys(this.models['FlexResultModel'].dailyBaskets).forEach(key => {
			const dh_ene = this.models['FlexResultModel'].dailyBaskets[key].dh_energy;
			const dh_pri = this.models['FlexResultModel'].dailyBaskets[key].dh_price;
			const dh_emi = this.models['FlexResultModel'].dailyBaskets[key].dh_emissions;
			const opt = this.models['FlexResultModel'].dailyBaskets[key].optimization;
			this.valuesDH.push({
				timestamp: moment(key).toDate(),
				ene: dh_ene,
				pri: dh_pri,
				emi: dh_emi,
				opt: opt*100
			});
		});
	}
	
	
	updateTheChartOne() {
		const self = this;
		this.fillValuesELE();
		console.log('UPDATE THE CHART ONE!');
		$('#'+this.FELID).empty();
		if (typeof this.chartOne !== 'undefined') {
			console.log('fetched ..... FlexView CHART UPDATED!');
			am4core.iter.each(this.chartOne.series.iterator(), function (s) {
				//if (s.name === 'SUM') {
				s.data = self.valuesELE;
				self.chartOne.invalidateData();
				//}
			});
		} else {
			this.renderChartOne();
		}
	}
	
	/*
	You can also manipulate and change data in data array.
	However, the chart itself won't detect such direct changes.
	To take in the changes, you will need to call chart's method invalidateData() or invalidateRawData().
	https://www.amcharts.com/docs/v4/concepts/data/
	*/
	updateTheChartTwo() {
		const self = this;
		this.fillValuesDH();
		console.log('UPDATE THE CHART TWO!');
		$('#'+this.FELID).empty();
		if (typeof this.chartTwo !== 'undefined') {
			console.log('fetched ..... FlexView CHART UPDATED!');
			am4core.iter.each(this.chartTwo.series.iterator(), function (s) {
				//if (s.name === 'SUM') {
				s.data = self.valuesDH;
				self.chartTwo.invalidateData();
				//}
			});
		} else {
			this.renderChartTwo();
		}
	}
	
	notify(options) {
		const self = this;
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				if (typeof this.chartOne !== 'undefined') {
					this.chartOne.dispose();
					this.chartOne = undefined;
				}
				if (typeof this.chartTwo !== 'undefined') {
					this.chartTwo.dispose();
					this.chartTwo = undefined;
				}
				this.render();
				this.fillSums();
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				
				// Reset data arrays.
				this.models['FlexResultModel'].reset();
				
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
					this.updateTheChartOne();
					this.fillSums();
					
				} else { // Error in fetching.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
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
						
						this.updateTheChartOne();
						this.updateTheChartTwo();
						this.fillSums();
					}
				} else { // Error in fetching.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
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
							this.updateTheChartOne();
							this.fillSums();
						}
					}
				} else { // Error in fetching.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
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
							
							this.updateTheChartTwo();
							this.fillSums();
						}
					}
					
				} else { // Error in fetching.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
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
							
							this.updateTheChartOne();
							this.fillSums();
						}
					}
				} else { // Error in fetching.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					console.log('ERROR in fetching '+options.model+'.');
				}
			}
		}
	}
	
	isDateOptimized(yyyy_mm_dd) {
		//console.log(['==================== isDateOptimized yyyy_mm_dd=',yyyy_mm_dd]);
		let retval = false;
		this.valuesELE.forEach(v=>{
			//console.log(['v=',v]);
			const date = v.timestamp;
			const dd = date.getDate();
			const mm = date.getMonth()+1;
			const yyyy = date.getFullYear();
			let s = yyyy + '-';
			if (mm < 10) {
				s += '0' + mm + '-';
			} else {
				s += mm + '-';
			}
			if (dd < 10) {
				s += '0' + dd;
			} else {
				s += dd;
			}
			if (yyyy_mm_dd === s) {
				if (v.opt === 0) {
					retval = false;
				} else {
					retval = true;
				}
			}
		});
		/*
		if (this.models['FlexResultModel'].dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
			if (this.models['FlexResultModel'].dailyBaskets[yyyy_mm_dd].optimization === 0) {
				retval = false;
			} else {
				retval = true;
			}
		}
		*/
		//console.log(['==================== isDateOptimized retval=',retval]);
		return retval;
	}
	
	renderChartOne() {
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
			self.chartOne = am4core.create(self.CHART_ONE_ID, am4charts.XYChart);
			self.paddingRight = 20;
			self.chartOne.numberFormatter.numberFormat = "#.##";
			//self.chart.data = generateChartData();
			
			// {'timestamp':...,'value':...}
			//self.chart.data = self.models['BuildingElectricityPL1Model'].values;
			//console.log(['self.chart.data=',self.chart.data]);
			
			var dateAxis = self.chartOne.xAxes.push(new am4charts.DateAxis());
			//dateAxis.baseInterval = {"timeUnit": "minute","count": 60};
			dateAxis.baseInterval = {"timeUnit": "hour","count":24};
			//dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
			//dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			//dateAxis.tooltipDateFormat = "d MMMM";
			dateAxis.tooltipDateFormat = "dd.MM.yyyy";
			//dateAxis.dateFormatter = new am4core.DateFormatter();
			//dateAxis.dateFormatter.dateFormat = "dd.MM.yyyy";
			
			// Show dates with optimization "ON" with different background color.
			// SEE: https://www.amcharts.com/docs/v4/tutorials/using-axis-ranges-to-highlight-weekends/
			dateAxis.events.on("datavalidated", function(ev) {
				var axis = ev.target;
				var start = axis.positionToDate(0);
				var end = axis.positionToDate(1);
				// Get weekends
				var current = new Date(start);
				while (current < end) {
					// Get weekend start and end dates
					
					//var weekendStart = getWeekend(current);
					//var weekendEnd = new Date(weekendStart);
					//weekendEnd.setDate(weekendEnd.getDate() + 1);
					if (isWeekend(current)) {
						// Create a range
						//console.log('!!!!!!!!!!!!!!!!!!!! ========= CREATE A RANGE =============!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
						var range = axis.axisRanges.create();
						
						var begin = new Date(current);
						range.date = begin;
						var ende = new Date(current);
						ende.setDate(begin.getDate() + 1);
						range.endDate = ende;
						
						range.axisFill.fill = am4core.color("#f80");
						range.axisFill.fillOpacity = 0.25;
						range.grid.strokeOpacity = 0;
					}
					// Iterate
					current.setDate(current.getDate() + 1);
				}
				function isWeekend(date) {
					const dd = date.getDate();
					const mm = date.getMonth()+1;
					const yyyy = date.getFullYear();
					let s = yyyy + '-';
					if (mm < 10) {
						s += '0' + mm + '-';
					} else {
						s += mm + '-';
					}
					if (dd < 10) {
						s += '0' + dd;
					} else {
						s += dd;
					}
					return self.isDateOptimized(s);
					//var lastday = date.getDate() - (date.getDay() || 7) + 6;
					//var lastdate = new Date(date);
					//lastdate.setDate(lastday);
					//return lastdate;
				}
			});
			
			
			
			// https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Formatting_date_and_time
			//dateAxis.dateFormats.setKey("day", "dd");
			//dateAxis.periodChangeDateFormats.setKey("day", "dd");
/*
Type DateFormatter
Inherited from Sprite
A DateFormatter instance.
This is used to format dates, e.g. on a date axes, balloons, etc.
chart.dateFormatter.dateFormat = "yyyy-MM-dd";
*/
			var valueAxis = self.chartOne.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_power_axis;
			
			const seri = self.chartOne.series.push(new am4charts.LineSeries());
			seri.data = self.valuesELE;
			seri.dataFields.dateX = "timestamp";
			seri.dataFields.valueY = "ene";
			seri.tooltipText = tooltip_ele_ene + ": [bold]{valueY}[/] kWh";
			//seri.tooltipText = "el energy: [bold]{valueY}[/] kWh";
			seri.fillOpacity = 0.2;
			seri.name = 'ELENERGY';
			seri.customname = legend_ele_ene;
			seri.stroke = am4core.color("#0ff");
			seri.fill = "#0ff";
			seri.legendSettings.labelText = "{customname}";
			
			const seri2 = self.chartOne.series.push(new am4charts.LineSeries());
			seri2.data = self.valuesELE;
			seri2.dataFields.dateX = "timestamp";
			seri2.dataFields.valueY = "pri";
			//seri2.tooltipText = localized_string_price + ": [bold]{valueY}[/] cent/kWh";
			seri2.tooltipText = tooltip_ele_pri + ": [bold]{valueY}[/] €";
			seri2.fillOpacity = 0.2;
			seri2.name = 'ELPRICE';
			seri2.customname = legend_ele_pri;
			seri2.stroke = am4core.color("#ff0");
			seri2.fill = "#ff0";
			seri2.legendSettings.labelText = "{customname}";
			
			const seri3 = self.chartOne.series.push(new am4charts.LineSeries());
			seri3.data = self.valuesELE;
			seri3.dataFields.dateX = "timestamp";
			seri3.dataFields.valueY = "emi";
			seri3.tooltipText = tooltip_ele_emi + ": [bold]{valueY}[/] kg";
			seri3.fillOpacity = 0.2;
			seri3.name = 'ELEMISSIONS';
			seri3.customname = legend_ele_emi;
			seri3.stroke = am4core.color("#0f0");
			seri3.fill = "#0f0";
			seri3.legendSettings.labelText = "{customname}";
			
			/*
			const seri4 = self.chartOne.series.push(new am4charts.ColumnSeries());
			seri4.data = self.valuesELE;
			//seri4.columns.template.width = am4core.percent(70);
			//seri4.columns.template.maxWidth = 50;
			seri4.columns.template.minWidth = 50;
			seri4.dataFields.dateX = "timestamp";
			seri4.dataFields.valueY = "opt";
			seri4.tooltipText = tooltip_ele_opt + ": [bold]{valueY}[/]";
			seri4.fillOpacity = 0.5;
			seri4.name = 'OPTIMIZATION';
			seri4.customname = legend_ele_opt;
			seri4.stroke = am4core.color("#f80");
			seri4.fill = "#f80";
			seri4.legendSettings.labelText = "{customname}";
			*/
			// Legend:
			self.chartOne.legend = new am4charts.Legend();
			self.chartOne.legend.useDefaultMarker = true;
			var marker = self.chartOne.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
			self.chartOne.cursor = new am4charts.XYCursor();
			self.chartOne.cursor.lineY.opacity = 0;
			self.chartOne.scrollbarX = new am4charts.XYChartScrollbar();
			self.chartOne.scrollbarX.series.push(seri);
			
			dateAxis.start = 0.0;
			dateAxis.end = 1.0;
			dateAxis.keepSelection = true;
			
		}); // end am4core.ready()
	}
	
	renderChartTwo() {
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
			self.chartTwo = am4core.create(self.CHART_TWO_ID, am4charts.XYChart);
			self.paddingRight = 20;
			self.chartTwo.numberFormatter.numberFormat = "#.##";
			//self.chart.data = generateChartData();
			
			// {'timestamp':...,'value':...}
			//self.chart.data = self.models['BuildingElectricityPL1Model'].values;
			//console.log(['self.chart.data=',self.chart.data]);
			
			var dateAxis = self.chartTwo.xAxes.push(new am4charts.DateAxis());
			//dateAxis.baseInterval = {"timeUnit": "minute","count": 60};
			dateAxis.baseInterval = {"timeUnit": "hour","count":24};
			//dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
			//dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			dateAxis.tooltipDateFormat = "d MMMM";
			
			var valueAxis = self.chartTwo.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_power_axis;
			
			const seri = self.chartTwo.series.push(new am4charts.LineSeries());
			seri.data = self.valuesDH;
			seri.dataFields.dateX = "timestamp";
			seri.dataFields.valueY = "ene";
			seri.tooltipText = tooltip_ele_ene + ": [bold]{valueY}[/] kWh";
			//seri.tooltipText = "el energy: [bold]{valueY}[/] kWh";
			seri.fillOpacity = 0.2;
			seri.name = 'DHENERGY';
			seri.customname = legend_ele_ene;
			seri.stroke = am4core.color("#0ff");
			seri.fill = "#0ff";
			seri.legendSettings.labelText = "{customname}";
			
			const seri2 = self.chartTwo.series.push(new am4charts.LineSeries());
			seri2.data = self.valuesDH;
			seri2.dataFields.dateX = "timestamp";
			seri2.dataFields.valueY = "pri";
			//seri2.tooltipText = localized_string_price + ": [bold]{valueY}[/] cent/kWh";
			seri2.tooltipText = tooltip_ele_pri + ": [bold]{valueY}[/] €";
			seri2.fillOpacity = 0.2;
			seri2.name = 'DHPRICE';
			seri2.customname = legend_ele_pri;
			seri2.stroke = am4core.color("#ff0");
			seri2.fill = "#ff0";
			seri2.legendSettings.labelText = "{customname}";
			
			const seri3 = self.chartTwo.series.push(new am4charts.LineSeries());
			seri3.data = self.valuesDH;
			seri3.dataFields.dateX = "timestamp";
			seri3.dataFields.valueY = "emi";
			seri3.tooltipText = tooltip_ele_emi + ": [bold]{valueY}[/] kg";
			seri3.fillOpacity = 0.2;
			seri3.name = 'DHEMISSIONS';
			seri3.customname = legend_ele_emi;
			seri3.stroke = am4core.color("#0f0");
			seri3.fill = "#0f0";
			seri3.legendSettings.labelText = "{customname}";
			
			const seri4 = self.chartTwo.series.push(new am4charts.ColumnSeries());
			seri4.data = self.valuesDH;
			//seri4.columns.template.width = am4core.percent(70);
			//seri4.columns.template.maxWidth = 50;
			seri4.columns.template.minWidth = 50;
			seri4.dataFields.dateX = "timestamp";
			seri4.dataFields.valueY = "opt";
			seri4.tooltipText = tooltip_ele_opt + ": [bold]{valueY}[/]";
			seri4.fillOpacity = 0.5;
			seri4.name = 'OPTIMIZATION';
			seri4.customname = legend_ele_opt;
			seri4.stroke = am4core.color("#f80");
			seri4.fill = "#f80";
			seri4.legendSettings.labelText = "{customname}";
			
			// Legend:
			self.chartTwo.legend = new am4charts.Legend();
			self.chartTwo.legend.useDefaultMarker = true;
			var marker = self.chartTwo.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
			self.chartTwo.cursor = new am4charts.XYCursor();
			self.chartTwo.cursor.lineY.opacity = 0;
			self.chartTwo.scrollbarX = new am4charts.XYChartScrollbar();
			self.chartTwo.scrollbarX.series.push(seri);
			
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
		const ele_descr = LM['translation'][sel]['BUILDING_FLEXIBILITY_ELE_DESCRIPTION'];
		const dh_descr = LM['translation'][sel]['BUILDING_FLEXIBILITY_DH_DESCRIPTION'];
		const localized_string_back = LM['translation'][sel]['BACK'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/flex.svg" height="80"/></p>'+
				'</div>'+
			'</div>'+
			//'<div class="row">'+
			//	'<div class="col s12 center" id="timerange-buttons-wrapper"></div>'+
			//'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<p style="color:#fff;text-align:center;">'+ele_descr+'</p>'+
					'<p id="ele-sums" style="color:#fff;text-align:center;" ></p>'+
					'<div id="'+this.CHART_ONE_ID+'" class="medium-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<p style="color:#fff;text-align:center;">'+dh_descr+'</p>'+
					'<p id="dh-sums" style="color:#fff;text-align:center;" ></p>'+
					'<div id="'+this.CHART_TWO_ID+'" class="medium-chart"></div>'+
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
				this.fillValuesELE();
				this.renderChartOne();
				this.fillValuesDH();
				this.renderChartTwo();
				this.fillSums();
			}
		} else {
			console.log('FlexView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHART_ONE_ID);
			this.showSpinner('#'+this.CHART_TWO_ID);
		}
	}
}
