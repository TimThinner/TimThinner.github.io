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
		const html = '<p class="fetching-info">Fetching interval is ' + 
			this.controller.fetching_interval_in_seconds + 
			' seconds. Cache expiration is ' + 
			this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].cache_expiration_in_seconds + ' seconds.</p>';
		$('#data-fetching-info').empty().append(html);
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
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b2d').on('click',function() {
			self.selected = "b2d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=2 for model.name=',model.name]);
					model.timerange = { begin: 2, end: 0 };
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b3d').on('click',function() {
			self.selected = "b3d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=3 for model.name=',model.name]);
					model.timerange = { begin: 3, end: 0 };
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b4d').on('click',function() {
			self.selected = "b4d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=4 for model.name=',model.name]);
					model.timerange = { begin: 4, end: 0 };
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b5d').on('click',function() {
			self.selected = "b5d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=5 for model.name=',model.name]);
					model.timerange = { begin: 5, end: 0 };
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b6d').on('click',function() {
			self.selected = "b6d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=6 for model.name=',model.name]);
					model.timerange = { begin: 6, end: 0 };
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b7d').on('click',function() {
			self.selected = "b7d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=7 for model.name=',model.name]);
					model.timerange = { begin: 7, end: 0 };
				}
			});
			self.controller.refreshTimerange();
		});
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
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							//console.log('fetched ..... CView CHART UPDATED!');
							
							const LM = this.controller.master.modelRepo.get('LanguageModel');
							const sel = LM.selected;
							const localized_string_consumption = LM['translation'][sel]['BUILDING_CO2_CONSUMPTION'];
							
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								if (s.name === localized_string_consumption) {
									s.data = self.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values;
								}
							});
						} else {
							//console.log('fetched ..... render CView()');
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
							// Maybe we shoud remove the spinner?
							//$('#'+this.CHARTID).empty();
						}
					}
				} else { // This should never be the case, but render anyway if we get here.
					this.render();
				}
				
			} else if (options.model==='BuildingEmissionFactorOfElectricityProductionInFinlandModel' && options.method==='fetched') {
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							//console.log('fetched ..... CView CHART UPDATED!');
							
							const LM = this.controller.master.modelRepo.get('LanguageModel');
							const sel = LM.selected;
							const localized_string_production = LM['translation'][sel]['BUILDING_CO2_PRODUCTION'];
							
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								if (s.name === localized_string_production) {
									s.data = self.models['BuildingEmissionFactorOfElectricityProductionInFinlandModel'].values;
								}
							});
						} else {
							//console.log('fetched ..... render CView()');
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
							// Maybe we shoud remove the spinner?
							//$('#'+this.CHARTID).empty();
						}
					}
				} else { // This should never be the case, but render anyway if we get here.
					this.render();
				}
			}
		}
	}
	
	renderChart() {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_consumption = LM['translation'][sel]['BUILDING_CO2_CONSUMPTION'];
		const localized_string_production = LM['translation'][sel]['BUILDING_CO2_PRODUCTION'];
		
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
			valueAxis.title.text = "Value";//"Unique visitors";
			valueAxis.min = 0;
			
			var series1 = self.chart.series.push(new am4charts.LineSeries());
			series1.data = self.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'].values;
			series1.dataFields.dateX = "timestamp"; // "date";
			series1.dataFields.valueY = "value"; // "visits";
			series1.tooltipText = "Value: [bold]{valueY}[/]"; //"Visits: [bold]{valueY}[/]";
			series1.fillOpacity = 0.2;
			series1.name = localized_string_consumption;
			series1.stroke = am4core.color("#ff0");
			series1.fill = "#ff0";
			
			var series2 = self.chart.series.push(new am4charts.LineSeries());
			series2.data = self.models['BuildingEmissionFactorOfElectricityProductionInFinlandModel'].values;
			series2.dataFields.dateX = "timestamp"; // "date";
			series2.dataFields.valueY = "value"; // "visits";
			series2.tooltipText = "Value: [bold]{valueY}[/]"; //"Visits: [bold]{valueY}[/]";
			series2.fillOpacity = 0.2;
			series2.name = localized_string_production;
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
					'<a href="javascript:void(0);" id="b1d" class="my-range-button" style="float:right;">1d</a>'+
					'<a href="javascript:void(0);" id="b2d" class="my-range-button" style="float:right;">2d</a>'+
					'<a href="javascript:void(0);" id="b3d" class="my-range-button" style="float:right;">3d</a>'+
					'<a href="javascript:void(0);" id="b4d" class="my-range-button" style="float:right;">4d</a>'+
					'<a href="javascript:void(0);" id="b5d" class="my-range-button" style="float:right;">5d</a>'+
					'<a href="javascript:void(0);" id="b6d" class="my-range-button" style="float:right;">6d</a>'+
					'<a href="javascript:void(0);" id="b7d" class="my-range-button" style="float:right;">7d</a>'+
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
					'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="back">'+localized_string_back+'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.setTimerangeHandlers(['BuildingEmissionFactorForElectricityConsumedInFinlandModel','BuildingEmissionFactorOfElectricityProductionInFinlandModel']);
		
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
