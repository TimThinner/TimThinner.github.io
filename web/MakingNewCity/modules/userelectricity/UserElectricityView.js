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
		
		this.resuArray = [];
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
			const timerange_days = slen;
			
			
			selection.forEach(v=>{
				sum += v.total;
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
				'<span style="color:#aaa">('+timerange_days+' days)</span>'+
				'</p>';
			$('#user-electricity-chart-total').empty().append(html);
		} else {
			const html = '<p>'+localized_string_total+': <span style="color:#0f0">- kWh</span></p>';
			$('#user-electricity-chart-total').empty().append(html);
		}
		/*
		let total = 0;
		this.resuArray.forEach(e=>{
			total += e.total;
		});
		const html = '<p>TOTAL: <span style="color:#0f0">'+total.toFixed(1)+' kWh</span></p>';
		$('#user-electricity-chart-total').empty().append(html);
		*/
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
		
		this.resuArray = [];
		
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
			//console.log(['SORTED temp_a=',temp_a]);
			for (let i=0; i<len-1; i++) {
				const d = temp_a[i+1].date;
				const tot = temp_a[i+1].total - temp_a[i].total;
				this.resuArray.push({date:d, total:tot});
			}
			//console.log(['resuArray=',this.resuArray]);
		}
	}
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_energy = LM['translation'][sel]['USER_ELECTRICITY_CHART_TITLE'];
		
		this.convertResults();
		
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
			dateAxis.tooltipDateFormat = "dd.MM.yyyy";
			
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
			series1.dataFields.dateX = "date"; //"time";
			series1.dataFields.valueY = "total"; //"temperature";
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
			})
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
					this.models[f.key].fetch(f.token, f.readkey);
				}
				
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 200) {
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							
							this.convertResults();
							//console.log(['resuArray.length = ',resuArray.length, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!']);
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
			this.updateTotal();
		}
	}
}