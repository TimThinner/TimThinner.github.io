/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';

export default class UserHeatingView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			/*
				'UserHeatingMonthModel'
				'FeedbackModel'
				'MenuModel'
			*/
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.PTO = new PeriodicTimeoutObserver({interval:180000}); // interval 3 minutes.
		this.PTO.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'user-heating-view-failure';
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
			
			
			console.log(['values=',self.models['UserHeatingMonthModel'].values]);
			
			// Create chart
			self.chart = am4core.create("user-heating-chart", am4charts.XYChart);
			self.chart.padding(30, 15, 30, 15);
			//self.chart.colors.step = 3;
			
			self.chart.numberFormatter.numberFormat = "#.#";
			//self.chart.data = [];
			
			//const values = self.models['UserHeatingMonthModel'].values;
			
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
				return text + " FOO";
			});
			valueAxis.tooltip.disabled = true;
			valueAxis.title.text = localized_string_heating;
			
			const series1 = self.chart.series.push(new am4charts.LineSeries());
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
			series1.data = self.models['UserHeatingMonthModel'].values;
			series1.dataFields.dateX = "time";
			series1.dataFields.valueY = "temperature";
			series1.name = localized_string_temperature;
			series1.yAxis = valueAxis;
			
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
			self.chart.scrollbarX = new am4charts.XYChartScrollbar();
			self.chart.scrollbarX.series.push(series1);
			//dateAxis.start = 0.8;
			//dateAxis.keepSelection = true;
		}); // end am4core.ready()
	}
	
	updateLatestValues() {
		console.log('UserHeatingView updateLatestValues');
		const heat_month = this.controller.master.modelRepo.get('UserHeatingMonthModel');
		if (heat_month) {
			const values = heat_month.values;
			if (Array.isArray(values)) { // && values.length > 0) {
				
				// values, like this:
				// {	time: Date Sun Nov 08 2020 08:00:00 GMT+0200 (Eastern European Standard Time), 
				//		temperature: 20.12833333333333, 
				//		humidity: 30.536666666666683 
				//	}
				// Calculate averages for last 30 days, last 7 days and finally last 24 hours.
				// toFixed(1)
				console.log(['values=',values]);
			}
		}
	}
	/*
		Use class "selected" to reduce processing.
	*/
	resetSelectedSmiley() {
		for (let i=1; i<6; i++) {
			if ($('#fb-smiley-'+i).hasClass('selected')) {
				$('#fb-smiley-'+i).removeClass('selected');
				$('#fb-smiley-'+i+' > img').attr('src','./img/UX_F2F_faces-'+i+'.png');
			}
		}
	}
	
	notify(options) {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_feedback_ok = LM['translation'][sel]['USER_HEATING_FEEDBACK_OK'];
		
		if (this.controller.visible) {
			
			if (options.model==='UserHeatingMonthModel' && options.method==='fetched') {
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 200) {
						this.updateLatestValues();
					}
				} else {
					this.render();
				}
			} else if (options.model==='FeedbackModel' && options.method==='fetched') {
				if (this.rendered) {
					$('#'+this.FELID).empty();
					this.handleErrorMessages(this.FELID); // If errors in ANY of Models => Print to UI.
					if (options.status === 200) {
						console.log('FeedbackModels fetched OK.');
					}
				} else {
					this.render();
				}
				
			} else if (options.model==='FeedbackModel' && options.method==='send') {
				if (options.status === 200) {
					// const msg = 'Feedback submitted OK';
					// Show Toast: Saved OK!
					M.toast({displayLength:1000, html: localized_string_feedback_ok});
					
					// Now let's clear the Feedback input!
					this.resetSelectedSmiley();
					//this.resetAllSmileys();
					$('#submit-feedback').removeClass('teal lighten-1');
					$('#submit-feedback').addClass('disabled');
				}
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Models are 'MenuModel', 'UserHeatingMonthModel', 'FeedbackModel'.
				Object.keys(this.models).forEach(key => {
					// Do NOT fetch 'FeedbackModel'
					if (key !== 'FeedbackModel') {
						console.log(['FETCH MODEL key=',key]);
						const UM = this.controller.master.modelRepo.get('UserModel');
						if (UM) {
							this.models[key].fetch(UM.token, UM.readkey);
						}
					}
				});
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			const localized_string_title = LM['translation'][sel]['USER_HEATING_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_HEATING_DESCRIPTION'];
			const localized_string_feedback_prompt = LM['translation'][sel]['USER_HEATING_FEEDBACK_PROMPT'];
			const localized_string_send_feedback = LM['translation'][sel]['USER_HEATING_SEND_FEEDBACK'];
			
			const html =
				'<div class="row">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						'<p style="text-align:center;"><img src="./svg/radiator.svg" height="80"/></p>'+
						'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
					'<div class="col s12 center">'+
						'<p style="text-align:center;">'+localized_string_feedback_prompt+'</p>'+
						//'<p style="text-align:center;"><img src="./svg/userpage/SmileyHappy.svg" height="60"/></p>'+
						'<a href="javascript:void(0);" id="fb-smiley-1" class="feedback-smiley"><img src="./img/UX_F2F_faces-1.png" height="60"/></a>'+
						'<a href="javascript:void(0);" id="fb-smiley-2" class="feedback-smiley"><img src="./img/UX_F2F_faces-2.png" height="60"/></a>'+
						'<a href="javascript:void(0);" id="fb-smiley-3" class="feedback-smiley"><img src="./img/UX_F2F_faces-3.png" height="60"/></a>'+
						'<a href="javascript:void(0);" id="fb-smiley-4" class="feedback-smiley"><img src="./img/UX_F2F_faces-4.png" height="60"/></a>'+
						'<a href="javascript:void(0);" id="fb-smiley-5" class="feedback-smiley"><img src="./img/UX_F2F_faces-5.png" height="60"/></a>'+
					'</div>'+
					'<div class="col s12 center" style="margin-top:16px;margin-bottom:16px;">'+
						'<button class="btn waves-effect waves-light disabled" id="submit-feedback">'+localized_string_send_feedback+'</button>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 chart-wrapper dark-theme">'+
						'<div id="user-heating-chart" class="medium-chart"></div>'+
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
			
			// Smileys act like radio buttons, only one can be selected at any one time.
			// The last selection is shown. Can user just de-select?
			for (let i=1; i<6; i++) {
				$('#fb-smiley-'+i).on('click',function() {
					// If this smiley was already "selected" => de-select it and disable submit-feedback -button.
					if ($('#fb-smiley-'+i).hasClass('selected')) {
						$('#fb-smiley-'+i).removeClass('selected');
						$('#fb-smiley-'+i+' > img').attr('src','./img/UX_F2F_faces-'+i+'.png');
						$('#submit-feedback').removeClass('teal lighten-1');
						$('#submit-feedback').addClass('disabled');
						
					} else {
						self.resetSelectedSmiley();
						$('#fb-smiley-'+i).addClass('selected');
						$('#fb-smiley-'+i+' > img').attr('src','./img/UX_F2F_faces-'+i+'-grey.png');
						$('#submit-feedback').removeClass('disabled');
						$('#submit-feedback').addClass('teal lighten-1');
					}
				});
			}
			// 'UX_F2F_faces-1.png'
			// 'UX_F2F_faces-1-grey.png'
			$('#submit-feedback').on('click',function() {
				for (let i=1; i<6; i++) {
					if ($('#fb-smiley-'+i).hasClass('selected')) {
						const selected = i;
						// FeedbackModel send (data, token) 
							//const refToUser = req.body.refToUser;
							//const fbType = req.body.feedbackType;
							//const fb = req.body.feedback;
						const UM = self.controller.master.modelRepo.get('UserModel');
						if (UM) {
							console.log(['Sending Feedback ',selected]);
							const data = {
								refToUser: UM.id, // UserModel id
								feedbackType: 'Heating',
								feedback: selected
							}
							self.models['FeedbackModel'].send(data, UM.token); // see notify for the response...
						}
					}
				}
			});
			
			$('#back').on('click',function() {
				self.models['MenuModel'].setSelected('userpage');
			});
			
			this.handleErrorMessages(this.FELID);
			this.renderChart();
			//this.updateLatestValues();
			this.rendered = true;
			
		} else {
			console.log('UserHeatingView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}