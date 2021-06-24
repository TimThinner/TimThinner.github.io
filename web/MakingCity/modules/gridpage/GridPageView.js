/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class GridPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			// Subscribe to all models from Controller:
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.rendered = false;
		this.FELID = 'grid-page-view-failure';
		
		this.chart = undefined; // We have a chart!
		
		this.table_labels = {
			'FingridPowerSystemStateModel':{'label':'Power system state','shortname':'Power State'},
			'Fingrid192Model':{'label':'Electricity production in Finland','shortname':'Electricity Production'},
			'Fingrid193Model':{'label':'Electricity consumption in Finland','shortname':'Electricity Consumption'},
			'Fingrid188Model':{'label':'Nuclear power production','shortname':'Nuclear'},
			'Fingrid191Model':{'label':'Hydro power production','shortname':'Hydro'},
			'Fingrid181Model':{'label':'Wind power production','shortname':'Wind'},
			'Fingrid205Model':{'label':'Other production','shortname':'Other'},
			'Fingrid202Model':{'label':'Industrial cogeneration','shortname':'Cogeneration'},
			'Fingrid201Model':{'label':'Cogeneration of district heating','shortname':'Cogeneration DH'},
			'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Fin Central Swe'},
			'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Fin Estonia'},
			'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Fin Northern Swe'},
			'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Fin Rus'},
			'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Fin Norway'}
		};
		/*
		Other production inc. estimated small-scale production and reserve power plants
		*/
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
		this.rendered = false;
		$(this.el).empty();
	}
	
	getFingridPowerSystemStateColor(value) {
		let color = '#fff';
		if (typeof value !== 'undefined') {
			if (value === 1) {
				color = '#0f0';
			} else if (value === 2) {
				color = '#ff0';
			} else if (value === 3) {
				color = '#f00';
			} else if (value === 4) {
				color = '#000';
			} else if (value === 5) {
				color = '#00f';
			}
		}
		return color;
	}
	
	createTrafficLight(mname, value) {
		// Draw the state of the Grid indicator:
		// Circle with color
		const svg = document.querySelector('#'+mname+'-value-svg');
		const uc = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		uc.setAttributeNS(null, 'cx', 0);
		uc.setAttributeNS(null, 'cy', 0);
		uc.setAttributeNS(null, 'r', 12);
		uc.setAttributeNS(null, 'stroke', '#555');
		uc.setAttributeNS(null, 'stroke-width', 1);
		const fc = this.getFingridPowerSystemStateColor(value);
		uc.setAttributeNS(null, 'fill', fc);
		// append the new circle to the svg
		svg.appendChild(uc);
	}
	
	renderChart() {
		const self = this;
		am4core.ready(function() {
			
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			
			//am4core.options.autoSetClassName = true;
			// Create chart
			self.chart = am4core.create("fingrid-chart", am4charts.XYChart);
			
			// SEE: https://www.amcharts.com/demos/100-stacked-column-chart/
			
			self.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
			self.chart.data = [
				{
				category: "Production",
				value1: 6625.7
				//value2: 5
				//value3: 0,
				//value4: 0
				},
				{
				category: "Production + import",
				//value1: 6625.7,
				//value2: 5
				value3: 2722.8,
				value4: 2126.5
				},
				{
				category: "Consumption",
				//value1: 0,
				value2: 8817
				//value3: ,
				//value4: 0
				},
				{
				category: "Consumption + export",
				//value1: 0,
				value2: 8817
				//value3: ,
				//value4: 0
				}
			];
			self.chart.colors.step = 2;
			self.chart.padding(30, 30, 10, 30);
			self.chart.legend = new am4charts.Legend();
			var categoryAxis = self.chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.grid.template.location = 0;
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.max = 9000;
			valueAxis.strictMinMax = true;
			valueAxis.calculateTotals = true;
			valueAxis.renderer.minWidth = 50;
			
			var series1 = self.chart.series.push(new am4charts.ColumnSeries());
			series1.columns.template.width = am4core.percent(50);
			series1.columns.template.tooltipText = "{name}: {valueY.formatNumber('#.')}MW";
			series1.name = "Total";
			series1.dataFields.categoryX = "category";
			series1.dataFields.valueY = "value1";
			//series1.dataFields.valueYShow = "totalPercent";
			series1.dataItems.template.locations.categoryX = 0.5;
			series1.stacked = true;
			series1.tooltip.pointerOrientation = "vertical";
			
			var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
			bullet1.interactionsEnabled = false;
			//bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
			bullet1.label.text = "{valueY.formatNumber('#.')}";
			bullet1.label.fill = am4core.color("#ffffff");
			bullet1.locationY = 0.5;
			
			var series2 = self.chart.series.push(new am4charts.ColumnSeries());
			series2.columns.template.width = am4core.percent(50);
			//series2.columns.template.tooltipText = "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
			series2.columns.template.tooltipText = "{name}: {valueY.formatNumber('#.')}MW";
			series2.name = "Consumption";
			series2.dataFields.categoryX = "category";
			series2.dataFields.valueY = "value2";
			//series2.dataFields.valueYShow = "totalPercent";
			series2.dataItems.template.locations.categoryX = 0.5;
			series2.stacked = true;
			series2.tooltip.pointerOrientation = "vertical";
			
			var bullet2 = series2.bullets.push(new am4charts.LabelBullet());
			bullet2.interactionsEnabled = false;
			//bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
			bullet2.label.text = "{valueY.formatNumber('#.')}";
			bullet2.locationY = 0.5;
			bullet2.label.fill = am4core.color("#ffffff");
			
			
			var series3 = self.chart.series.push(new am4charts.ColumnSeries());
			series3.columns.template.width = am4core.percent(50);
			series3.columns.template.tooltipText = "{name}: {valueY.formatNumber('#.')}MW";
			series3.name = "Nuclear";
			series3.dataFields.categoryX = "category";
			series3.dataFields.valueY = "value3";
			//series3.dataFields.valueYShow = "totalPercent";
			series3.dataItems.template.locations.categoryX = 0.5;
			series3.stacked = true;
			series3.tooltip.pointerOrientation = "vertical";
			
			var bullet3 = series3.bullets.push(new am4charts.LabelBullet());
			bullet3.interactionsEnabled = false;
			//bullet3.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
			bullet3.label.text = "{valueY.formatNumber('#.')}";
			bullet3.locationY = 0.5;
			bullet3.label.fill = am4core.color("#ffffff");
			
			var series4 = self.chart.series.push(new am4charts.ColumnSeries());
			series4.columns.template.width = am4core.percent(50);
			series4.columns.template.tooltipText = "{name}: {valueY.formatNumber('#.')}MW";
			series4.name = "Hydro";
			series4.dataFields.categoryX = "category";
			series4.dataFields.valueY = "value4";
			//series4.dataFields.valueYShow = "totalPercent";
			series4.dataItems.template.locations.categoryX = 0.5;
			series4.stacked = true;
			series4.tooltip.pointerOrientation = "vertical";
			
			var bullet4 = series4.bullets.push(new am4charts.LabelBullet());
			bullet4.interactionsEnabled = false;
			//bullet4.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
			bullet4.label.text = "{valueY.formatNumber('#.')}";
			bullet4.locationY = 0.5;
			bullet4.label.fill = am4core.color("#ffffff");
			//self.chart.scrollbarX = new am4core.Scrollbar();
		}); // end am4core.ready()
	}
	
	updateTable(mname) {
		const value = this.models[mname].value;
		// Use Moment.js to automatically change Zulu-timestamp to local time.
		const start_time = moment(this.models[mname].start_time);
		const local_start_time = start_time.format('DD.MM.YYYY HH:mm');
		
		if (mname === 'FingridPowerSystemStateModel') {
			this.createTrafficLight(mname, value);
			$('#'+mname+'-timestamp').empty().append(local_start_time);
		} else {
			$('#'+mname+'-value').empty().append(value);
			$('#'+mname+'-timestamp').empty().append(local_start_time);
		}
	}
	
	/*
	renderChart() {
		const self = this;
		am4core.ready(function() {
			
			// Themes begin
			am4core.useTheme(am4themes_dark);
			//am4core.useTheme(am4themes_animated);
			// Themes end
			
			am4core.options.autoSetClassName = true;
			am4core.options.autoDispose = true;
			
			//am4core.options.autoSetClassName = true;
			// Create chart
			self.chart = am4core.create("fingrid-chart", am4charts.XYChart);
			self.chart.padding(30, 15, 30, 15);
			//self.chart.colors.step = 3;
			
			self.chart.numberFormatter.numberFormat = "#.##";
			
			
			// Create chart instance
			self.chart.data = [];
			
			Object.keys(self.table_labels).forEach(key => {
				if (key === 'FingridPowerSystemStateModel') {
					
				} else {
					self.chart.data.push({
						"name": key,
						"shortname": self.table_labels[key].shortname,
						"value":self.models[key].value
					});
				}
			});
			
			// Create axes
			var categoryAxis = self.chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "shortname";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			
			categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
				if (target.dataItem && target.dataItem.index & 2 == 2) {
					return dy + 25;
				}
				return dy;
			});
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			
			valueAxis.renderer.labels.template.adapter.add("text", function(text) {
				return text + " MW";
			});
			
			// Create series
			var series = self.chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "shortname";
			series.name = "Values";
			series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
			series.columns.template.fillOpacity = .8;
			
			var columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
		}); // end am4core.ready()
	}
	*/
	createTable(fid) {
		let html = '<table class="striped">'+
			'<thead>'+
				'<tr>'+
					'<th>Data</th>'+
					'<th>Value (MW)</th>'+
					'<th>Timestamp</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>';
		
		Object.keys(this.table_labels).forEach(key => {
			
			//if (key === 'FingridSolarPowerFinlandModel') {
			//	
			//}
			if (key === 'FingridPowerSystemStateModel') {
				html += '<tr>'+
					'<td>'+this.table_labels[key].label+'</td>'+
					'<td id="'+key+'-value">'+
						'<svg id="'+key+'-value-svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="-15 -15 30 30">'+
							'<circle cx="0" cy="0" r="12" fill="#fff" />'+
						'</svg>'+
					'</td>'+
					'<td id="'+key+'-timestamp"></td>'+
				'</tr>';
			} else {
				html += '<tr>'+
					'<td>'+this.table_labels[key].label+'</td>'+
					'<td id="'+key+'-value"></td>'+
					'<td id="'+key+'-timestamp"></td>'+
				'</tr>';
			}
		});
		html += '</tbody></table>';
		$(html).appendTo(fid);
	}
	
	notify(options) {
		
		const key_array = Object.keys(this.table_labels);
		
		if (this.controller.visible) {
			
			if (key_array.includes(options.model) && options.method==='fetched') {
				
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						
						this.updateTable(options.model);
						
						if (typeof this.chart !== 'undefined') {
							// SEE: https://www.amcharts.com/docs/v4/concepts/data/
							// Manipulating existing data points
							const name = options.model;
							this.chart.data.forEach(d=>{
								if (d.name === name) {
									d.value = this.models[name].value;
								}
							});
							this.chart.invalidateRawData();
							
						} else {
							this.renderChart();
						}
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
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
		const localized_string_title = LM['translation'][sel]['GRID_PAGE_TITLE'];
		const localized_string_description = LM['translation'][sel]['GRID_PAGE_DESCRIPTION'];
		//const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					//'<p class="coming-soon">'+localized_string_coming_soon+'</p>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 chart-wrapper dark-theme">'+
					'<div id="fingrid-chart" class="medium-chart"></div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="table-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$('#back').on('click',function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		this.createTable('#table-wrapper');
		this.rendered = true;
		
		if (this.areModelsReady()) {
			this.handleErrorMessages(this.FELID);
			Object.keys(this.models).forEach(key => {
				if (key !== 'MenuModel') {
					this.updateTable(key);
				}
			});
			this.renderChart();
		}
	}
}