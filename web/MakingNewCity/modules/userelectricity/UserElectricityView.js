/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

export default class UserElectricityView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.PTO = new PeriodicTimeoutObserver({interval:180000}); // interval 3 minutes.
		this.PTO.subscribe(this);
		
		/*
			Note: IT TAKES time to fecth electricity values (totalEnergy), even if we are fetching 
			only one value from short period of time.
			
			2022-02-25:
			
			https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=energy&limit=1&start=2022-02-23T23:50&end=2022-02-24T00:00
			...
			https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=energy&limit=1&start=2022-01-25T23:50&end=2022-01-26T00:00
		*/
		
		this.fetchQueue = [];
		this.rendered = false;
		this.FELID = 'user-electricity-view-failure';
		this.chart = undefined; // We have a chart!
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
	
	updateFoo() {
		
		
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
	*/
	
	convertResults() {
		const temp_a = [];
		const resuArray = [];
		Object.keys(this.models).forEach(key => {
			if (key.indexOf('UserElectricity') === 0) {
				const meas = this.models[key].measurement; // is in normal situation an array.
				if (Array.isArray(meas) && meas.length > 0) {
					const total = meas[0].totalEnergy;
					const d = new Date(meas[0].created_at);
					temp_a.push({date:d, total:total});
				}
			}
		});
		const len = temp_a.length;
		if (len > 1) {
			// Then sort array based according to date, oldest entry first.
			temp_a.sort(function(a,b){
				var bb = moment(b.date);
				var aa = moment(a.date);
				return aa - bb;
			});
			console.log(['SORTED temp_a=',temp_a]);
			for (let i=0; i<len-1; i++) {
				const d = temp_a[i+1].date;
				const tot = temp_a[i+1].total - temp_a[i].total;
				resuArray.push({date:d, total:tot});
			}
			console.log(['resuArray=',resuArray]);
		}
		return resuArray;
	}
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_heating = LM['translation'][sel]['USER_PAGE_HEATING'];
		const localized_string_temperature = LM['translation'][sel]['USER_HEATING_CHART_LEGEND_TEMPERATURE'];
		const localized_string_humidity = LM['translation'][sel]['USER_HEATING_CHART_LEGEND_HUMIDITY'];
		
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			
			
			const resuArray = self.convertResults();
			console.log(['resuArray=',resuArray]);
			
			// Create chart
			self.chart = am4core.create("user-electricity-chart", am4charts.XYChart);
			self.chart.padding(30, 15, 30, 15);
			//self.chart.colors.step = 3;
			
			self.chart.numberFormatter.numberFormat = "#.#";
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
			dateAxis.baseInterval = {
				"timeUnit": "hour",
				"count": 1
			};
			//dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
			dateAxis.keepSelection = true;
			dateAxis.tooltipDateFormat = "dd.MM.yyyy - HH:mm";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " °C/%";
			});
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_heating;
			
			//const series1 = self.chart.series.push(new am4charts.LineSeries());
			const series1 = self.chart.series.push(new am4charts.ColumnSeries());
			series1.defaultState.transitionDuration = 0;
			series1.tooltipText = "{valueY.value} °C";
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.stroke = am4core.color("#f00");
			series1.strokeWidth = 2;
			series1.fill = series1.stroke;
			series1.fillOpacity = 0;
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			series1.tooltip.label.fill = series1.stroke;
			series1.data = resuArray;
			series1.dataFields.dateX = "date"; //"time";
			series1.dataFields.valueY = "total"; //"temperature";
			series1.name = localized_string_temperature;
			series1.yAxis = valueAxis;
			/*
			const series2 = self.chart.series.push(new am4charts.LineSeries());
			series2.defaultState.transitionDuration = 0;
			series2.tooltipText = "{valueY.value} %";
			series2.tooltip.getFillFromObject = false;
			series2.tooltip.getStrokeFromObject = true;
			series2.stroke = am4core.color("#0ff");
			series2.strokeWidth = 2;
			series2.fill = series2.stroke;
			series2.fillOpacity = 0;
			series2.tooltip.background.fill = am4core.color("#000");
			series2.tooltip.background.strokeWidth = 1;
			series2.tooltip.label.fill = series2.stroke;
			series2.data = self.models['UserHeatingMonthModel'].values;
			series2.dataFields.dateX = "time";
			series2.dataFields.valueY = "humidity";
			series2.name = localized_string_humidity;
			series2.yAxis = valueAxis;
			*/
			// Legend:
			self.chart.legend = new am4charts.Legend();
			self.chart.legend.useDefaultMarker = true;
			var marker = self.chart.legend.markers.template.children.getIndex(0);
			marker.cornerRadius(12, 12, 12, 12);
			marker.strokeWidth = 2;
			marker.strokeOpacity = 1;
			marker.stroke = am4core.color("#000");
			
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
				// Calculate averages based on this new selection.
				self.updateFoo();
				//console.log(["ev.target._start: ", ev.target._start]); // 0
				//console.log(["ev.target._end: ", ev.target._end]); // 1
			});
			self.chart.zoomOutButton.events.on("hit", function(ev) {
				// Reset of ZoomIn => start = 0 and end = 1.
				// console.log('zoomOutButton hit event!');
				self.chartRangeStart = 0;
				self.chartRangeEnd = 1;
				self.updateFoo();
			})
		}); // end am4core.ready()
		
		this.updateFoo();
	}
	
	/*
	foo(model_name) {
		
		const ele = this.models[model_name];
		const meas = ele.measurement; // is in normal situation an array.
		if (Array.isArray(meas) && meas.length > 0) {
			const energy = meas[0].totalEnergy;
			console.log(['energy=',energy]);
		}
	}*/
	
	/*
	foo() {
		
		const ele_now = this.models['UserElectricityNowModel'];
		const ele_day = this.models['UserElectricityDayModel'];
		const ele_week = this.models['UserElectricityWeekModel'];
		const ele_month = this.models['UserElectricityMonthModel'];
		
		const UM = this.controller.master.modelRepo.get('UserModel');
		
		//const dim = moment().daysInMonth();
		
		
		//UM.price_energy_monthly
		//UM.price_energy_basic
		//UM.price_energy_transfer
		
		const meas_now = ele_now.measurement; // is in normal situation an array.
		const meas_day = ele_day.measurement; // is in normal situation an array.
		const meas_week = ele_week.measurement; // is in normal situation an array.
		const meas_month = ele_month.measurement; // is in normal situation an array.
		
		if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_day) && meas_day.length > 0) {
			const energy_now = meas_now[0].totalEnergy;
			const energy_day = meas_day[0].totalEnergy;
			if (typeof energy_now !== 'undefined' && typeof energy_day !== 'undefined') {
				
				const energy_diffe = energy_now - energy_day;
				console.log(['Electricity for day = ',energy_diffe]);
				
			}
		}
		if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_week) && meas_week.length > 0) {
			const energy_now = meas_now[0].totalEnergy;
			const energy_week = meas_week[0].totalEnergy;
			if (typeof energy_now !== 'undefined' && typeof energy_week !== 'undefined') {
				
				const energy_diffe = energy_now - energy_week;
				console.log(['Electricity for week = ',energy_diffe]);
			}
		}
		if (Array.isArray(meas_now) && meas_now.length > 0 && Array.isArray(meas_month) && meas_month.length > 0) {
			const energy_now = meas_now[0].totalEnergy;
			const energy_month = meas_month[0].totalEnergy;
			if (typeof energy_now !== 'undefined' && typeof energy_month !== 'undefined') {
				
				const energy_diffe = energy_now - energy_month;
				console.log(['Electricity for month = ',energy_diffe]);
			}
		}
	}
	*/
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model.indexOf('UserElectricity') === 0 && options.method==='fetched') {
				
				
				//.. and start the fetching process with NEXT model:
				const f = this.fetchQueue.shift();
				if (typeof f !== 'undefined') {
					this.models[f.key].fetch(f.token, f.readkey);
				}
				
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 200) {
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							
							const resuArray = this.convertResults();
							//console.log(['resuArray.length = ',resuArray.length, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!']);
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								s.data = resuArray;
							});
							this.updateFoo();
							
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
				Object.keys(this.models).forEach(key => {
					console.log(['FETCH MODEL key=',key]);
					const UM = this.controller.master.modelRepo.get('UserModel');
					if (UM) {
						this.fetchQueue.push({'key':key,'token':UM.token,'readkey':UM.readkey});
						//this.models[key].fetch(UM.token, UM.readkey);
					}
				});
				//.. and start the fetching process with FIRST model:
				const f = this.fetchQueue.shift();
				if (typeof f !== 'undefined') {
					this.models[f.key].fetch(f.token, f.readkey);
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
		const localized_string_title = LM['translation'][sel]['USER_ELECTRICITY_TITLE'];
		const localized_string_description = LM['translation'][sel]['USER_ELECTRICITY_DESCRIPTION'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'<p style="text-align:center;"><img src="./svg/radiator.svg" height="80"/></p>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="user-electricity-chart" class="medium-chart"></div>'+
					'<div style="text-align:center;" id="user-electricity-chart-average"></div>'+
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
			this.updateFoo();
		}
	}
}