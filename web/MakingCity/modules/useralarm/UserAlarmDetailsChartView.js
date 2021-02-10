import View from '../common/View.js';

/*
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
*/
export default class UserAlarmDetailsView extends View {
	
	constructor(wrapper, el) {
		super(wrapper.controller);
		
		this.wrapper = wrapper;
		// NOTE: Each view inside wrapperview is rendered within its own element, therefore 
		// we must deliver that element as separate variable. For example this el is #subview-1
		// 
		this.el = el;
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserAlarmModel' || key === 'MenuModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.chart = undefined;
		this.rendered = false;
		this.CHARTID = 'user-alarm-details-chart';
		this.FELID = this.CHARTID + '-view-failure';
	}
	
	show() {
		console.log('ALARM DETAILS SHOW CALLED!!!!!!!!!!!!!!');
		this.render();
	}
	
	hide() {
		console.log('ALARM DETAILS HIDE CALLED!!!!!!!!!!!!!!');
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		$(this.el).empty();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		console.log('ALARM DETAILS REMOVE CALLED!!!!!!!!!!!!!!');
		if (typeof this.chart !== 'undefined') {
			this.chart.dispose();
			this.chart = undefined;
		}
		$(this.el).empty();
		this.rendered = false;
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
	}
	
	notify(options) {
		if (this.controller.visible) {
			console.log('ALARM DETAILS NOTIFY CALLED!!!!!!!!!!!!!!');
		}
	}
	
	renderChart() {
		const self = this;
		console.log('ALARM DETAILS RENDER CHART!!!!!!!!!!!!!!!!!!!!!!');
		
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_energy = 'KESKEN...'; //LM['translation'][sel]['USER_ELECTRICITY_CHART_TITLE'];
		
		const alarms = [];
		const alarm_sel = this.models['UserAlarmModel'].selected;
		this.models['UserAlarmModel'].alarms.forEach(a => {
			//console.log(['alarmTimestamp=',a.alarmTimestamp,' alarmType=',a.alarmType,' refToUser=',a.refToUser,' severity=',a.severity]);
			if (a.alarmType === alarm_sel) {
				alarms.push(a);
			}
		});
		
		
		/*
		this.models['UserAlarmModel'].alarms is an array of Alarm-objects each containing:
		const data = {
			refToUser: UM.id,
			alarmType: 'HeatingTemperatureUpperLimit',
			alarmTimestamp: '2020-12-12T12:00',
			severity: 3
		};
		
		this.models['UserAlarmModel'].selected
		is the alarmType selected to display in the chart.
		
		
		
		
		
		TODO:
		
		Create the chart so that each minute/hour (check the resolution) contains total number of alarms 
		for that time period.
		
		
		
		
		var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.baseInterval = {
			"timeUnit": "minute",
			"count": 1
		};
		dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
		
		See:
		https://www.amcharts.com/demos/area-with-time-based-data/
		
		*/
		am4core.ready(function() {
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			//console.log(['values=',self.models['UserElectricityTSModel'].energyValues]);
			
			// Create chart
			self.chart = am4core.create(self.CHARTID, am4charts.XYChart);
			self.chart.padding(0, 15, 0, 15);
			self.chart.colors.step = 3;
			
			// the following line makes value axes to be arranged vertically.
			self.chart.leftAxesContainer.layout = "vertical";
			
			// uncomment this line if you want to change order of axes
			//chart.bottomAxesContainer.reverseOrder = true;
			// Round all numbers to integer
			self.chart.numberFormatter.numberFormat = "#.";
			
			const dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			
			dateAxis.renderer.grid.template.location = 0;
			dateAxis.renderer.ticks.template.length = 8;
			dateAxis.renderer.ticks.template.strokeOpacity = 0.3;
			dateAxis.renderer.grid.template.disabled = false;
			dateAxis.renderer.ticks.template.disabled = false;
			//dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
			dateAxis.renderer.minLabelPosition = 0.1; //0.01;
			dateAxis.renderer.maxLabelPosition = 0.9; //0.99;
			dateAxis.minHeight = 30;
			
			// these two lines makes the axis to be initially zoomed-in
			//dateAxis.start = 0.5;
			dateAxis.keepSelection = true;
			dateAxis.tooltipDateFormat = "dd.MM.yyyy"; // - HH:mm";
			// Axis for 
			//			this.influxModel.dealsBidsAppKey.forEach(item => {
			//				this.sumBids += item.totalprice;
			//			});
			// and 
			//			this.influxModel.dealsAsksAppKey.forEach(item => {
			//				this.sumAsks += item.totalprice;
			//			});
			const valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			
			valueAxis.min = 0;
			valueAxis.max = 5;
			valueAxis.strictMinMax = true;
			// Pad values by 20%
			valueAxis.extraMin = 0.2;
			valueAxis.extraMax = 0.2;
			
			valueAxis.zIndex = 1;
			valueAxis.marginTop = 0;
			valueAxis.renderer.baseGrid.disabled = true;
			// height of axis
			valueAxis.height = am4core.percent(100);
			
			valueAxis.renderer.gridContainer.background.fill = am4core.color("#000");
			valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
			valueAxis.renderer.inside = false;
			valueAxis.renderer.labels.template.verticalCenter = "bottom";
			valueAxis.renderer.labels.template.padding(2, 2, 2, 2);
			
			valueAxis.renderer.maxLabelPosition = 0.95;
			valueAxis.renderer.fontSize = "0.75em";
			valueAxis.title.text = localized_string_energy;
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " FUB";
			});
			
			//valueAxis.min = 0;
			//valueAxis.max = 200;
			const series1 = self.chart.series.push(new am4charts.ColumnSeries());
			//const series1 = self.chart.series.push(new am4charts.LineSeries());
			//const series1 = self.chart.series.push(new am4charts.StepLineSeries());
			series1.defaultState.transitionDuration = 0;
			series1.tooltipText = "{valueY.value} FUB";
			
			series1.tooltip.getFillFromObject = false;
			series1.tooltip.getStrokeFromObject = true;
			series1.stroke = am4core.color("#0f0");
			series1.strokeWidth = 1;
			series1.fill = series1.stroke;
			series1.fillOpacity = 0.2;
			
			series1.tooltip.background.fill = am4core.color("#000");
			series1.tooltip.background.strokeWidth = 1;
			series1.tooltip.label.fill = series1.stroke;
			
			series1.data = alarms;
			series1.dataFields.dateX = "alarmTimestamp";
			series1.dataFields.valueY = "severity";
			series1.name = "ALARMS";
			series1.yAxis = valueAxis;
			
			
			// Cursor
			self.chart.cursor = new am4charts.XYCursor();
			
			//console.log(['series1.data=',series1.data]);
			
			// Scrollbar
			//const scrollbarX = new am4charts.XYChartScrollbar();
			/*
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series1);
			self.chart.scrollbarX.marginBottom = 20;
			self.chart.scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
			*/
			console.log('ALARM DETAILS RENDER CHART END =====================');
		}); // end am4core.ready()
	}
	
	render() {
		var self = this;
		$(this.el).empty();
		
		const UM = this.controller.master.modelRepo.get('UserModel')
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const localized_string_title = 'Alarm Details';
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		
		const html = 
		/*
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+localized_string_title+'</h4>'+
					'<p>Details for selected AlarmType</p>'+
					'<p>'+this.models['UserAlarmModel'].selected+'</p>'+
				'</div>'+
				'<div class="col s12 center" id="failed"></div>'+
				'<div class="col s12 center" id="success"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" style="margin-top:16px;">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>';
			*/
			
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<p>'+this.models['UserAlarmModel'].selected+'  KESKEN.... Tähän tulee hälytysten lukumäärä per aikayksikkö koko kuukauden ajalta...</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="'+this.CHARTID+'" class="medium-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('UserAlarmDetailsView render models READY!!!!');
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				if (errorMessages.indexOf('Auth failed') >= 0) {
					this.forceLogout(this.FELID);
				}
			} else {
				this.renderChart();
			}
		} else {
			console.log('UserAlarmDetailsView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
		
		
	}
}
