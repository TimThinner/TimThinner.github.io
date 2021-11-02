import View from './View.js';

export default class TimeRangeView extends View {
	
	constructor(controller) {
		super(controller);
		this.selected = "TR1D";
	}
	
	resetButtonClass() {
		const elems = document.getElementsByClassName("my-range-button");
		for(let i = 0; i < elems.length; i++) {
			$(elems[i]).removeClass("selected");
		}
		$('#'+this.selected).addClass("selected");
	}
	
	/*
	AView:
		BuildingElectricityPL1Model
		BuildingElectricityPL2Model
		BuildingElectricityPL3Model
		MenuModel
	BView:
		BuildingHeatingQE01Model
		MenuModel
	CView:
		BuildingElectricityPL1Model
		BuildingElectricityPL2Model
		BuildingElectricityPL3Model
		BuildingHeatingQE01Model
		BuildingEmissionFactorForElectricityConsumedInFinlandModel
		MenuModel
	UserHeatingView.js
		UserTemperatureModel	(NOT YET AVAILABLE)
		UserHumidityModel		(NOT YET AVAILABLE)
		MenuModel
	*/
	showInfo(models) {
		//console.log('======================================================');
		//console.log(['this.models=',this.models]);
		//console.log('======================================================');
		let html = '<p class="fetching-info">';
		Object.keys(this.controller.models).forEach(key => {
			if (models.includes(key)) {
					const model = this.controller.models[key];
					html += 'NAME: ' + model.name;
					html += ' TIMERANGE: '  + model.timerange.begin.value + ' ' + model.timerange.begin.unit; 
					html += ' INTERVAL: ' + model.interval;
					html += ' RESPONSE: <span id="'+model.name+'-values-len"></span> values';
					html += ' Fetching interval: '+ this.controller.fetching_interval_in_seconds + ' s Cache expiration: ' + model.cache_expiration_in_seconds + ' s<br/>';
			}
		});
		html += '<p>';
		$('#data-fetching-info').empty().append(html);
	}
	
	updateInfoModelValues(modelname, len) {
		$('#'+modelname+'-values-len').empty().append(len);
	}
	
	/*
		Timerange is set with buttons.
		New param is an array of models 
		
		PT30S (30 seconds)
		PT5M (5 minutes)
		PT1H (1 hour)
		PT24H (24 hours)
		
		INTERVAL	TIMERANGE		NUMBER OF SAMPLES
		3 MIN		1 day (24H)		 480 (24 x 20)
		10 MINS		1 week			1008 (7 x 24 x 6)
		20 MINS		2 weeks			1008 (14 x 24 x 3)
		30 MINS 	1 month			1440 (30 x 48)
		4 HOURS		6 months		1080 (30 x 6 x 6)
		6 HOURS		1 year			1460 (4 x 365)
		
		
		TIMERANGE		INTERVAL			NUMBER OF SAMPLES
		1 day 			3 mins				24x20			=  480 values
						15 mins				24x4			=   96 values
		7 days			3 mins				7x24x20			= 3360 values
						15 mins				7x24x4			=  672 values
		14 days			3 mins				14x24x20		= 6720 values
						15 mins				14x24x4			= 1344 values
		1 month			30 mins				approx 30x24x2	= 1440 values
		6 months		4 hours				approx 6x30x6	= 1080 values
		13 months		6 hours				approx 13x30x4	= 1560 values
		
		When new Obix measurement points are included, we need to know the "base" update frequency.
		That is the interval in "query" API.
		Here it is 3 mins for the FACTORS and 15 mins for the ELECTRICITY and DISTRICT HEATING values.
		
		Basically "base" sets a limit, there is no point in using "rollup" API with equal or below "base" frequency.
		In "rollup" we define "interval", which in this case has minimum of 30 mins ('PT30M') which is used 
		when one month of measurement data is requested.
		
		To be able to monitor these frequncies and number of samples, we show some info at the bottom of the page.
		
		"TR1D"	1D
		"TR1W"	1W
		"TR2W"	2W
		"TR1M"	1M
		"TR6M"	6M
		"TR13M"	13M
	*/
	
	setTR(models) { //, timerange, interval) {
		Object.keys(this.controller.models).forEach(key => {
			// Controller has all needed models + menumodel, which we ignore here (models are listed in function call).
			if (models.includes(key)) {
				const model = this.controller.models[key];
				// Set timerange and interval from Configuration (Model inherits Configuration)
				model.setConfigurationDefaults(key, this.selected); // key is modelname.
				model.values = [];
			}
		});
	}
	
	setTimerangeButtons(id) {
		const html = '<a href="javascript:void(0);" id="TR1D" class="my-range-button" style="float:right;">1D</a>'+
			'<a href="javascript:void(0);" id="TR1W" class="my-range-button" style="float:right;">1W</a>'+
			'<a href="javascript:void(0);" id="TR2W" class="my-range-button" style="float:right;">2W</a>'+
			'<a href="javascript:void(0);" id="TR1M" class="my-range-button" style="float:right;">1M</a>'+
			'<a href="javascript:void(0);" id="TR6M" class="my-range-button" style="float:right;">6M</a>'+
			'<a href="javascript:void(0);" id="TR13M" class="my-range-button" style="float:right;">13M</a>';
		$('#'+id).empty().append(html);
	}
	
	setTimerangeHandlers(models) {
		const self = this;
		//console.log('========================================');
		//console.log(['this.selected=',this.selected]);
		//console.log('========================================');
		
		$('#'+this.selected).addClass("selected");
		
		// THEN SET CLICK HANDLERS!
		// timerange 1 day interval = 15 mins (24x4 = 96 values)
		$('#TR1D').on('click',function() {
			if (self.selected !== "TR1D") {
				self.selected = "TR1D";
				self.resetButtonClass();
				self.setTR(models);
				self.controller.refreshTimerange();
				self.showInfo(models);
			}
		});
		
		// timerange 7 days interval = 30 mins (7x24x2 =  336 values)
		$('#TR1W').on('click',function() {
			if (self.selected !== "TR1W") {
				self.selected = "TR1W";
				self.resetButtonClass();
				self.setTR(models);
				self.controller.refreshTimerange();
				self.showInfo(models);
			}
		});
		
		// timerange 14 days interval = 60 mins (14x24 =  336 values)
		$('#TR2W').on('click',function() {
			if (self.selected !== "TR2W") {
				self.selected = "TR2W";
				self.resetButtonClass();
				self.setTR(models);
				self.controller.refreshTimerange();
				self.showInfo(models);
			}
		});
		
		// timerange 1 month interval = 120 MINUTES (approx 30x12 = 360 values)
		$('#TR1M').on('click',function() {
			if (self.selected !== "TR1M") {
				self.selected = "TR1M";
				self.resetButtonClass();
				self.setTR(models);
				self.controller.refreshTimerange();
				self.showInfo(models);
			}
		});
		
		// timerange 6 months interval = 12 HOURS (approx 6x30x2 =  360 values)
		$('#TR6M').on('click',function() {
			if (self.selected !== "TR6M") {
				self.selected = "TR6M";
				self.resetButtonClass();
				self.setTR(models);
				self.controller.refreshTimerange();
				self.showInfo(models);
			}
		});
		
		// timerange 13 months interval = 24 HOURS (approx 13x30 = 390 values)
		$('#TR13M').on('click',function() {
			if (self.selected !== "TR13M") {
				self.selected = "TR13M";
				self.resetButtonClass();
				self.setTR(models);
				self.controller.refreshTimerange();
				self.showInfo(models);
			}
		});
	}
}
