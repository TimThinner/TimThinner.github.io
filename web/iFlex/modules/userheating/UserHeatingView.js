import View from '../common/View.js';

export default class UserHeatingView extends View {
	
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
		this.FELID = 'user-heating-view-failure';
		this.CHARTID = 'user-heating-chart';
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
			this.models['UserHeatingModel'].cache_expiration_in_seconds + ' seconds.</p>';
		$('#user-heating-info').empty().append(html);
	}
	
	showDataError(msg) {
		const html = '<p class="error-info">' + msg + '. Data access not available anymore.</p>';
		$('#data-error-info').empty().append(html);
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
				
			} else if (options.model==='UserHeatingModel' && options.method==='fetched') {
				
				console.log('NOTIFY UserHeatingModel fetched!');
				console.log(['options.status=',options.status]);
				
				if (this.rendered) {
					if (options.status === 200 || options.status === '200') {
						
						$('#'+this.FELID).empty();
						if (typeof this.chart !== 'undefined') {
							console.log('fetched ..... UserHeatingView CHART UPDATED!');
							am4core.iter.each(this.chart.series.iterator(), function (s) {
								s.data = self.models['UserHeatingModel'].values;
							});
							
						} else {
							console.log('fetched ..... render UserHeatingView()');
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
							if (options.status === 403) {
								this.showDataError(options.message);
							}
						}
					}
				} else {
					console.log('WTF?! rendered is NOT true BUT Model is FETCHED NOW... UserHeatingView RENDER?!?!');
				}
			}
		}
	}
	
	renderChart() {
		const self = this;
		
		am4core.ready(function() {
			/*
			function generateChartData() {
				var chartData = [];
				// current date
				var firstDate = new Date();
				// now set 500 minutes back
				firstDate.setMinutes(firstDate.getDate() - 500);
				
				// and generate 500 data items
				var visits = 500;
				for (var i = 0; i < 500; i++) {
					var newDate = new Date(firstDate);
					// each time we add one minute
					newDate.setMinutes(newDate.getMinutes() + i);
					// some random number
					visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
					// add data item to the array
					chartData.push({
						date: newDate,
						visits: visits
					});
				}
				return chartData;
			}*/
			
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			// Create chart
			self.chart = am4core.create(self.CHARTID, am4charts.XYChart);
			self.paddingRight = 20;
			//self.chart.data = generateChartData();
			
			// {'timestamp':...,'value':...}
			self.chart.data = self.models['UserHeatingModel'].values;
			console.log(['self.chart.data=',self.chart.data]);
			
			var dateAxis = self.chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.baseInterval = {
				//"timeUnit": "minute",
				//"count": 1
				"timeUnit": "second",
				"count": 5
			};
			dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = "Value";//"Unique visitors";
			
			var series = self.chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = "timestamp"; // "date";
			series.dataFields.valueY = "value"; // "visits";
			series.tooltipText = "Value: [bold]{valueY}[/]"; //"Visits: [bold]{valueY}[/]";
			series.fillOpacity = 0.3;
			
			self.chart.cursor = new am4charts.XYCursor();
			self.chart.cursor.lineY.opacity = 0;
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series);
			
			dateAxis.start = 0.8;
			dateAxis.keepSelection = true;
			
		}); // end am4core.ready()
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		const html =
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>Apartment temperature and humidity</h4>'+
					'<p style="text-align:center;"><img src="./svg/radiator.svg" height="80"/></p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="data-error-info"></div>'+
					'<div id="'+this.CHARTID+'" class="large-chart"></div>'+
					'<div id="user-heating-info"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light grey lighten-2" style="color:#000" id="back">BACK</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$("#back").on('click', function() {
			self.models['MenuModel'].setSelected('USERPAGE');
		});
		
		this.showInfo();
		this.rendered = true;
		
		if (this.areModelsReady()) {
			console.log('UserHeatingView => render models READY!!!!');
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
			console.log('UserHeatingView => render models ARE NOT READY!!!!');
			this.showSpinner('#'+this.CHARTID);
		}
	}
}
