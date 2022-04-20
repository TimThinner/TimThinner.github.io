/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

New:
The "raw" data is:
	...
	[
	{"created_at":"2022-04-07T00:26:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":720,"totalEnergy":20871.153,"impulseLastCtr":12,"impulseTotalCtr":20871153},
	{"created_at":"2022-04-07T00:27:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":660,"totalEnergy":20871.164,"impulseLastCtr":11,"impulseTotalCtr":20871164},
	{"created_at":"2022-04-07T00:28:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":720,"totalEnergy":20871.176,"impulseLastCtr":12,"impulseTotalCtr":20871176},
	{"created_at":"2022-04-07T00:29:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":660,"totalEnergy":20871.187,"impulseLastCtr":11,"impulseTotalCtr":20871187},
	...
	]
	Extract:
		created_at
		averagePower
		totalEnergy

We can show "averagePower" as one minute precision for for example 7 days.
7 x 1440 values = 10 080 values (4 weeks equals 40 320 values)
We can calculate also averages of any timeperiod... for example 1 hour, 1 day.

this.power[YYYYMMDDHH] = {};
this.power[YYYYMMDD] = {};

or extract hourly energy using "totalEnergy" and subtract (from end of hour and start of hour).

this.energy[YYYYMMDDHH] = {};
this.energy[YYYYMMDD] = {};


	this.power[YYYYMMDD] = {sum:0, count:0, average:0, values:[]}
	this.power[YYYYMMDDHH] = {sum:0, count:0, average:0}
	this.energy[YYYYMMDD] = { day:0, hour:{}};
	
	power:
		daily average
		hourly average
		minutely values (1440) in values array
	
	energy:
		daily totals
		hourly totals
*/
import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

export default class NewUserElectricityView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.PTO = new PeriodicTimeoutObserver({interval:60000}); // interval 1 minute.
		this.PTO.subscribe(this);
		
		this.fetchQueue = [];
		this.rendered = false;
		this.FELID = 'user-electricity-view-failure';
		this.chart = undefined; // We have a chart!
		
		this.resuArray = [];// { date: , value: }
		
		this.viewMode = {range:'MONTH', target:undefined}; // // 'MONTH', 'DAY' or 'HOUR'
		// Range is from 0 to 1.
		this.chartRangeStart = 0;
		this.chartRangeEnd = 1;
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
	
	resetChart() {
		
		// Use the first Electricity Model to generate "reset" notification.
		if (typeof this.models['UserElectricity0Model'] !== 'undefined') {
			this.models['UserElectricity0Model'].resetChart();
		}
	}
	
	/*
		const UM = this.controller.master.modelRepo.get('UserModel');
		
		const dim = moment().daysInMonth();
		
		
		
		
				const energy_now = meas_now[0].totalEnergy;
				const energy_day = meas_day[0].totalEnergy;
				
				
				const energy_diffe = energy_now - energy_day;
				const dayprice = UM.price_energy_monthly/dim + (UM.price_energy_basic*energy_diffe)/100 + (UM.price_energy_transfer*energy_diffe)/100;
				$('#day-price').empty().append(dayprice.toFixed(2));
				
	*/
	
	updateTotal() {
		
		const localized_string_total = 'Total';
		const localized_string_price = 'Price';
		// this.chartRangeStart = 0;
		// this.chartRangeEnd = 1;
		// This is where we select only part of timerange to be included into calculation.
		//
		const len = this.resuArray.length;
		const begin = Math.round(this.chartRangeStart * len);
		const end = Math.round(this.chartRangeEnd * len);
		//The Math.round() function returns the value of a number rounded to the nearest integer. 
		const selection = [];
		this.resuArray.forEach((v,i)=>{
			if (i >= begin && i <= end) {
				selection.push(v);
			}
		});
		
		const slen = selection.length;
		if (slen > 0) {
			let range_title = 'Range: ';
			if (slen < len) {
				range_title = 'Zoomed: ';
			}
			
			let sum = 0;
			// Use moment because it has nice formatting functions.
			const s_date = moment(selection[0].date); // Date of first value.
			const e_date = moment(selection[slen-1].date); // Date of last value.
			let timerange_number;
			let timerange_units;
			let timerange_days;
			
			if (this.viewMode.range === 'MONTH') {
				timerange_number = slen;
				timerange_units = 'days';
				timerange_days = slen;
				
			} else if (this.viewMode.range === 'DAY') {
				timerange_number = 24;
				timerange_units = 'hours';
				timerange_days = 1;
				
			} else {
				timerange_number = 60;
				timerange_units = 'minutes';
				timerange_days = 1/24;
			}
			
			selection.forEach(v=>{
				sum += v.value;
			});
			
			// UM.price_energy_monthly		euros/month
			// UM.price_energy_basic		eurocent/kWh
			// UM.price_energy_transfer		eurocent/kWh
			
			const UM = this.controller.master.modelRepo.get('UserModel');
			const dim = moment().daysInMonth();
			const price = timerange_days * UM.price_energy_monthly/dim + (UM.price_energy_basic*sum)/100 + (UM.price_energy_transfer*sum)/100;
			
			const html = '<p>'+localized_string_total+
				': <span style="color:#0f0">'+sum.toFixed(1)+' kWh</span> '+
				localized_string_price+
				': <span style="color:#0f0">'+price.toFixed(2)+'&euro;</span><br/>'+
				'<span style="color:#ccc">'+range_title + s_date.format('DD.MM.YYYY HH:mm')+' - '+e_date.format('DD.MM.YYYY HH:mm')+'</span><br/>'+
				'<span style="color:#aaa">('+timerange_number+' '+timerange_units+')</span>'+
				'</p>';
			$('#user-electricity-chart-total').empty().append(html);
		} else {
			const html = '<p>'+localized_string_total+': <span style="color:#0f0">- kWh</span></p>';
			$('#user-electricity-chart-total').empty().append(html);
		}
	}
	
	/*
		apartmentId: 101
​​​		averagePower: 1200
​​​		created_at: "2022-02-14T23:59:35"
​​​		impulseLastCtr: 20
​​​		impulseTotalCtr: 18797376
​​​		meterId: 1001
​​​		residentId: 1
​​​		totalEnergy: 18797.376
		
		The UserElectricityController has this.numOfDays and each model is named like this:
			'UserElectricity'+i+'Model', where i = 0,...,numOfDays-1
	*/
	
	mergeValues() {
		
		// Reproduce this.resuArray
		this.resuArray = [];
		
		if (this.viewMode.range === 'MONTH') {
			//this.viewMode.target is undefined;
			// Go through all models and get one value per day 
			// NOTE: Start from the oldest 
			const last_index = this.controller.numOfDays-1;
			for (let i=last_index; i>=0; i--) {
				const key = 'UserElectricity'+i+'Model';
				if (typeof this.models[key].energy_day.date !== 'undefined') {
					this.resuArray.push(this.models[key].energy_day);
				}
			}
		} else if (this.viewMode.range === 'DAY') {
			//this.viewMode.target // is the date
			const selected_date = moment(this.viewMode.target).format('YYYY-MM-DD');
			const last_index = this.controller.numOfDays-1;
			for (let i=0; i<last_index; i++) {
				const key = 'UserElectricity'+i+'Model';
				if (this.models[key].dateYYYYMMDD === selected_date) {
					if (this.models[key].energy_hours.length > 0) {
						this.resuArray = this.models[key].energy_hours;
					}
				}
			}
		} else {
			//this.viewMode.target // contains the hour
			const selected_date = moment(this.viewMode.target).format('YYYY-MM-DD');
			const selected_hour = moment(this.viewMode.target).format('HH');
			const last_index = this.controller.numOfDays-1;
			for (let i=0; i<last_index; i++) {
				const key = 'UserElectricity'+i+'Model';
				if (this.models[key].dateYYYYMMDD === selected_date) {
					this.resuArray = this.models[key].getEnergyMinutes(selected_hour);
				}
			}
		}
	}
	
	/*
	NOTE:
	
	Fetch one-day-at-a-time.
	
	this.power[YYYYMMDD] = {sum:0, count:0, average:0, values:[]}
	this.energy[YYYYMMDD] = { day:0, hour:{}}; hour has key HH for example: '00', '01', ... '23'
	
	power:
		daily average
		hourly average
		minutely values (1440) in values array
	
	energy:
		daily totals
		hourly totals
		
	*/
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_energy = LM['translation'][sel]['USER_ELECTRICITY_CHART_TITLE'];
		
		this.mergeValues();
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			
			// Create chart
			self.chart = am4core.create("user-electricity-chart", am4charts.XYChart);
			self.chart.padding(30, 15, 30, 15);
			//self.chart.colors.step = 3;
			//self.chart.numberFormatter.numberFormat = "#.#";
			
			if (self.viewMode.range === 'MONTH') {
				self.chart.numberFormatter.numberFormat = "#.#";
			} else if (self.viewMode.range === 'DAY') {
				self.chart.numberFormatter.numberFormat = "#.##";
			} else {
				self.chart.numberFormatter.numberFormat = "#.###";
			}
			
			//self.chart.data = [];
			
			// [{"value":207.483000,"start_time":"2021-05-17T08:00:00+0000","end_time":"2021-05-17T09:00:00+0000"},...]
			/*console.log(['values=',values]);
			values.forEach(v=>{
				self.chart.data.push({
					//date: moment(v.time).toDate(),
					date: v.time,
					temperature: v.temperature,
					humidity: v.humidity
				});
			});*/
			/*
			self.chart.data.push({
				date: newDate,
				values: values
			});
			const values = this.models['FingridSolarPowerFinlandModel'].values;
			*/
			const dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			//dateAxis.baseInterval = {
			//	"timeUnit": "day",
			//	"count": 1
			//};
			dateAxis.renderer.grid.template.location = 0;
			dateAxis.renderer.ticks.template.length = 8;
			dateAxis.renderer.ticks.template.strokeOpacity = 0.3;
			dateAxis.renderer.grid.template.disabled = false;
			dateAxis.renderer.ticks.template.disabled = false;
			//dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
			dateAxis.renderer.minLabelPosition = 0.1; //0.01;
			dateAxis.renderer.maxLabelPosition = 0.9; //0.99;
			dateAxis.minHeight = 30;
			
			
			//dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
			dateAxis.keepSelection = true;
			
			if (self.viewMode.range === 'MONTH') {
				dateAxis.tooltipDateFormat = "dd.MM.yyyy";
			} else if (self.viewMode.range === 'DAY') {
				dateAxis.tooltipDateFormat = "HH:mm";
			} else {
				dateAxis.tooltipDateFormat = "HH:mm";
			}
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.renderer.fontSize = "0.75em";
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " kWh";
			});
			
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_energy;
			valueAxis.min = 0;
			
			//const series1 = self.chart.series.push(new am4charts.LineSeries());
			const series1 = self.chart.series.push(new am4charts.ColumnSeries());
			series1.defaultState.transitionDuration = 0;
			series1.tooltipText = "{valueY.value} kWh";
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.stroke = am4core.color("#0f0");
			series1.strokeWidth = 1;
			series1.fill = series1.stroke;
			series1.fillOpacity = 0.25;
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			series1.tooltip.label.fill = series1.stroke;
			series1.data = self.resuArray;
			series1.dataFields.dateX = "date";
			series1.dataFields.valueY = "value";
			series1.name = "ENERGY";
			series1.yAxis = valueAxis;
			
			// Legend:
			/*
			self.chart.legend = new am4charts.Legend();
			self.chart.legend.useDefaultMarker = true;
			var marker = self.chart.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			*/
			
			// Cursor:
			self.chart.cursor = new am4charts.XYCursor();
			self.chart.cursor.lineY.opacity = 0;
			// ScrollbarX to limit selection:
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series1);
			self.chart.scrollbarX.events.on("rangechanged", function(ev) {
				// Range is from 0 to 1.
				self.chartRangeStart = ev.target._start;
				self.chartRangeEnd = ev.target._end;
				// Calculate total based on this new selection.
				self.updateTotal();
				//console.log(["ev.target._start: ", ev.target._start]); // 0
				//console.log(["ev.target._end: ", ev.target._end]); // 1
			});
			self.chart.zoomOutButton.events.on("hit", function(ev) {
				// Reset of ZoomIn => start = 0 and end = 1.
				// console.log('zoomOutButton hit event!');
				self.chartRangeStart = 0;
				self.chartRangeEnd = 1;
				self.updateTotal();
			});
			
			series1.columns.template.events.on("hit", function(ev) {
				//console.log(["clicked on ",ev.target,"date=",ev.target._dataItem._dataContext.date]);
				
				console.log(['date=',ev.target.dataItem.dataContext.date]);
				// Rotate 'MONTH' => 'DAY' => 'HOUR' => 'MONTH'
				
				if (self.viewMode.range === 'MONTH') {
					// Date object can be used to switch to "DAY" view ... 24 hours
					self.viewMode.range = 'DAY';
					self.viewMode.target = ev.target.dataItem.dataContext.date;
					
					// Reset the chart. But DON'T do it directly within this eventhandler!
					// To prevent "Uncaught Error: EventDispatcher is disposed", we must 
					// work with MODEL and delayed "reset" notification.
					
					self.resetChart();
					
				} else if (self.viewMode.range === 'DAY') {
					// Date object can be used to switch to "HOUR" view ... 60 minutes
					self.viewMode.range = 'HOUR';
					self.viewMode.target = ev.target.dataItem.dataContext.date;
					
					// Reset the chart. But DON'T do it directly within this eventhandler!
					// To prevent "Uncaught Error: EventDispatcher is disposed", we must 
					// work with MODEL and delayed "reset" notification.
					
					self.resetChart();
					
				} else { // From HOUR view we go back to MONTH view.
					self.viewMode.target = undefined;
					self.viewMode.range = 'MONTH';
					
					// Reset the chart. But DON'T do it directly within this eventhandler!
					// To prevent "Uncaught Error: EventDispatcher is disposed", we must 
					// work with MODEL and delayed "reset" notification.
					
					self.resetChart();
				}
			}, this);
			
		}); // end am4core.ready()
		this.updateTotal();
	}
	
	notify(options) {
		const self = this;
		if (this.controller.visible) {
			if (options.model.indexOf('UserElectricity') === 0 && options.method==='fetched') {
				//.. and start the fetching process with NEXT model:
				const f = this.fetchQueue.shift();
				if (typeof f !== 'undefined') {
					this.models[f.key].fetch(f.token, f.readkey, f.pid);
				}
				
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 200) {
						$('#'+this.FELID).empty();
						this.mergeValues();
						if (typeof this.chart !== 'undefined') {
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								s.data = self.resuArray;
							});
							this.updateTotal();
						} else {
							this.renderChart();
						}
					}
				} else {
					this.render();
				}
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Models are 'MenuModel', 'UserElectricityNowModel', ...
				this.fetchQueue = [];
				const UM = this.controller.master.modelRepo.get('UserModel');
				if (UM) {
					Object.keys(this.models).forEach(key => {
						this.fetchQueue.push({'key':key,'token':UM.token,'readkey':UM.readkey,'pid':UM.point_id_b});
						//this.models[key].fetch(UM.token, UM.readkey);
					});
					//.. and start the fetching process with FIRST model:
					const f = this.fetchQueue.shift();
					if (typeof f !== 'undefined') {
						this.models[f.key].fetch(f.token, f.readkey, f.pid);
					}
				}
				
			} else if (options.model==='UserElectricity0Model' && options.method==='reset') {
				// Remove old chart and add a new one with different parameters.
				// Uncaught Error: EventDispatcher is disposed   core.js  
				this.hide();
				this.show();
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_title = LM['translation'][sel]['USER_ELECTRICITY_TITLE'];
		const localized_string_description = LM['translation'][sel]['USER_ELECTRICITY_DESCRIPTION'];
		const localized_string_zooming_tip = LM['translation'][sel]['USER_ELECTRICITY_ZOOMING_TIP'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/electricity.svg" height="80"/></p>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<p style="text-align:center; padding:16px; border:1px solid #8f8; background-color:#efe;">'+localized_string_zooming_tip+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="user-electricity-chart" class="medium-chart"></div>'+
					'<div style="text-align:center;" id="user-electricity-chart-total"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" style="margin-top:16px;">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$('#back').on('click',function() {
			self.models['MenuModel'].setSelected('userpage');
		});
		if (this.areModelsReady()) {
			this.handleErrorMessages(this.FELID);
			this.renderChart();
		}
	}
}