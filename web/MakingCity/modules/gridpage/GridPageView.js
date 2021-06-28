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
	
	addSeries(m) {
		var series = this.chart.series.push(new am4charts.ColumnSeries());
		series.columns.template.width = am4core.percent(50);
		series.columns.template.tooltipText = "{name}: {valueY.formatNumber('#.')}MW";
		series.name = this.table_labels[m].shortname;
		
		series.dataFields.categoryX = "category";
		series.dataFields.valueY = m;
		//series.dataFields.valueYShow = "totalPercent";
		series.dataItems.template.locations.categoryX = 0.5;
		series.stacked = true;
		series.tooltip.pointerOrientation = "vertical";
		
		var bullet = series.bullets.push(new am4charts.LabelBullet());
		bullet.interactionsEnabled = false;
		//bullet.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
		bullet.label.text = "{valueY.formatNumber('#.')}";
		bullet.label.fill = am4core.color("#ffffff");
		bullet.locationY = 0.5;
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
			
			//self.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
			
			/*
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
			*/
			
			
			// ToDo: Calculate import/export amounts at notify() and put sums into charts!
			
			self.chart.data = [
				{
					'category': 'Prod',
					'none': 0
				},
				{
					'category': 'Prod+imp',
					'none': 0
				},
				{
					'category': 'Cons+exp',
					'none': 0
				}
			];
			//self.chart.colors.step = 2;
			self.chart.padding(30, 30, 10, 30);
			self.chart.legend = new am4charts.Legend();
			var categoryAxis = self.chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.grid.template.location = 0;
			
			var valueAxis = self.chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			//valueAxis.max = 2000;
			//valueAxis.strictMinMax = true;
			valueAxis.extraMax = 0.1;
			valueAxis.calculateTotals = true;
			valueAxis.renderer.minWidth = 50;
			
			// SEE: https://sashamaps.net/docs/resources/20-colors/
			
			const colors = [
				'#911eb4', // Purple Production 
				'#f58231', // Orange Consumption
				
				// Prod components:
				'#4363d8', // Blue 
				'#42d4f4', // Cyan
				'#000075', // Navy 
				'#f032e6', // Magenta
				'#dcbeff', // Lavender
				'#469990', // Teal
				
				// Transfer colors (5)
				'#9a6324', // Brown
				'#3cb44b', // Green
				'#cce119', // Yellow
				'#808000', // Olive
				'#aaffc3', // Mint
			];
			var am4colors = [];
			colors.forEach(function(hex) {
				am4colors.push(am4core.color(hex)); 
			});
			self.chart.colors.list = am4colors;
			
			Object.keys(self.table_labels).forEach(key => {
				if (key !== 'FingridPowerSystemStateModel') {
					self.addSeries(key);
				}
			});
			
			// Create series for total
			var totalSeries = self.chart.series.push(new am4charts.ColumnSeries());
			totalSeries.dataFields.valueY = "none";
			totalSeries.dataFields.categoryX = "category";
			totalSeries.stacked = true;
			totalSeries.hiddenInLegend = true;
			totalSeries.columns.template.strokeOpacity = 0;
			
			var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
			totalBullet.dy = -20;
			totalBullet.label.text = "{valueY.total.formatNumber('#.')}";
			//totalBullet.label.text = "{valueY.total}";
			totalBullet.label.hideOversized = false;
			totalBullet.label.fontSize = 18;
			
			totalBullet.label.background.fill = totalSeries.stroke;
			totalBullet.label.background.fillOpacity = 0.2;
			totalBullet.label.padding(5, 10, 5, 10);
			
			
			
			
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
	
	/*
		Transmission can be either in to the country (import) or out of the country (export).
		The sign is negative in case of import and positive for export.
		Therefore data is dynamically generated everytime there is a new measurement.
		
		
		FIRST GROUP ('category': 'Prod'):
		'Fingrid188Model':{'label':'Nuclear power production','shortname':'Nuclear'},
		'Fingrid191Model':{'label':'Hydro power production','shortname':'Hydro'},
		'Fingrid181Model':{'label':'Wind power production','shortname':'Wind'},
		'Fingrid205Model':{'label':'Other production','shortname':'Other'},
		'Fingrid202Model':{'label':'Industrial cogeneration','shortname':'Cogeneration'},
		'Fingrid201Model':{'label':'Cogeneration of district heating','shortname':'Cogeneration DH'},
		
		+ Any of the following where sign is negative:
		
		'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Fin Central Swe'},
		'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Fin Estonia'},
		'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Fin Northern Swe'},
		'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Fin Rus'},
		'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Fin Norway'}
		
		
		SECOND GROUP ('category': 'Prod+imp'):
		'Fingrid192Model':{'label':'Electricity production in Finland','shortname':'Electricity Production'},
		
		
		THIRD GROUP ('category': 'Cons+exp'):
		'Fingrid193Model':{'label':'Electricity consumption in Finland','shortname':'Electricity Consumption'},
		
		+ Any of the following where sign is positive:
		
		'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Fin Central Swe'},
		'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Fin Estonia'},
		'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Fin Northern Swe'},
		'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Fin Rus'},
		'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Fin Norway'}
	*/
	
	
	
	updateChart(model_name) {
		// 'category': 'Prod':
		//'Fingrid188Model':{'label':'Nuclear power production','shortname':'Nuclear'},
		//'Fingrid191Model':{'label':'Hydro power production','shortname':'Hydro'},
		//'Fingrid181Model':{'label':'Wind power production','shortname':'Wind'},
		//'Fingrid205Model':{'label':'Other production','shortname':'Other'},
		//'Fingrid202Model':{'label':'Industrial cogeneration','shortname':'Cogeneration'},
		//'Fingrid201Model':{'label':'Cogeneration of district heating','shortname':'Cogeneration DH'},
		if (model_name === 'Fingrid188Model' ||
			model_name === 'Fingrid191Model' ||
			model_name === 'Fingrid181Model' ||
			model_name === 'Fingrid205Model' ||
			model_name === 'Fingrid202Model' ||
			model_name === 'Fingrid201Model') {
			if (typeof this.chart !== 'undefined') {
				this.chart.data.forEach(d=>{
					if (this.models[model_name].value == 0) {
						
						// Not included.
						delete d[model_name];
						
					} else if (this.models[model_name].value > 0) {
						if (d.category === 'Prod') {
							d[model_name] = this.models[model_name].value;
						}
					}
				});
				this.chart.invalidateRawData();
			}
		// category': 'Prod+imp':
		//'Fingrid192Model':{'label':'Electricity production in Finland','shortname':'Electricity Production'},
		} else if (model_name === 'Fingrid192Model') {
			
			if (typeof this.chart !== 'undefined') {
				this.chart.data.forEach(d=>{
					if (this.models[model_name].value == 0) {
						
						// Not included.
						delete d[model_name];
						
					} else if (this.models[model_name].value > 0) {
						if (d.category === 'Prod+imp') {
							d[model_name] = this.models[model_name].value;
						}
					}
				});
				this.chart.invalidateRawData();
			}
		// category': 'Cons+exp':
		//'Fingrid193Model':{'label':'Electricity consumption in Finland','shortname':'Electricity Consumption'},
		} else if (model_name === 'Fingrid193Model') {
			if (typeof this.chart !== 'undefined') {
				this.chart.data.forEach(d=>{
					if (this.models[model_name].value == 0) {
						
						// Not included.
						delete d[model_name];
						
					} else if (this.models[model_name].value > 0) {
						if (d.category === 'Cons+exp') {
							d[model_name] = this.models[model_name].value;
						}
					}
				});
				this.chart.invalidateRawData();
			}
		//'Fingrid89Model':{'label':'Transmission between Finland and Central Sweden','shortname':'Fin Central Swe'},
		//'Fingrid180Model':{'label':'Transmission between Finland and Estonia','shortname':'Fin Estonia'},
		//'Fingrid87Model':{'label':'Transmission between Finland and Northern Sweden','shortname':'Fin Northern Swe'},
		//'Fingrid195Model':{'label':'Transmission between Finland and Russia','shortname':'Fin Rus'},
		//'Fingrid187Model':{'label':'Transmission between Finland and Norway','shortname':'Fin Norway'}
		} else if (model_name === 'Fingrid89Model' || 
					model_name === 'Fingrid180Model' || 
					model_name === 'Fingrid87Model' || 
					model_name === 'Fingrid195Model' || 
					model_name === 'Fingrid187Model') {
			if (typeof this.chart !== 'undefined') {
				// SEE: https://www.amcharts.com/docs/v4/concepts/data/
				// Manipulating existing data points
				this.chart.data.forEach(d=>{
					if (this.models[model_name].value == 0) {
						
						// Not included.
						delete d[model_name];
						
					} else if (this.models[model_name].value < 0) {
						if (d.category === 'Prod+imp') {
							d[model_name] = -this.models[model_name].value;
						}
						
					} else {
						if (d.category === 'Cons+exp') {
							d[model_name] = this.models[model_name].value;
						}
					}
				});
				this.chart.invalidateRawData();
			}
		}
	}
	
	notify(options) {
		const key_array = Object.keys(this.table_labels);
		if (this.controller.visible) {
			if (key_array.includes(options.model) && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						
						this.updateTable(options.model);
						this.updateChart(options.model);
						
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
					'<div id="fingrid-chart" class="extra-large-chart"></div>'+
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
		this.renderChart();
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