/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class EnvironmentPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			// Subscribe to all models from Controller:
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
			//console.log(['key=',key]);
		});
		this.table_labels = {
			'EntsoeA65NorwayNO4Model':{'label':'Total Load Norway NO4','shortname':'Norway NO4'},
			'EntsoeA65EstoniaModel':{'label':'Total Load Estonia','shortname':'Estonia'},
			'EntsoeA65FinlandModel':{'label':'Total Load Finland','shortname':'Finland'},
			'EntsoeA65SwedenSE1Model':{'label':'Total Load Sweden SE1','shortname':'Sweden SE1'},
			'EntsoeA65SwedenSE3Model':{'label':'Total Load Sweden SE3','shortname':'Sweden SE3'},
			
			'EntsoeA75EstoniaB01Model':{'label':'Estonia Biomass','shortname':''},
			'EntsoeA75EstoniaB03Model':{'label':'Estonia Fossil Coal-derived gas','shortname':''},
			'EntsoeA75EstoniaB04Model':{'label':'Estonia Fossil Gas','shortname':''},
			'EntsoeA75EstoniaB07Model':{'label':'Estonia Fossil Oil shale','shortname':''},
			'EntsoeA75EstoniaB08Model':{'label':'Estonia Fossil Peat','shortname':''},
			'EntsoeA75EstoniaB11Model':{'label':'Estonia Hydro Run-of-river and poundage','shortname':''},
			'EntsoeA75EstoniaB15Model':{'label':'Estonia Other renewable','shortname':''},
			'EntsoeA75EstoniaB16Model':{'label':'Estonia Solar','shortname':''},
			'EntsoeA75EstoniaB17Model':{'label':'Estonia Waste','shortname':''},
			'EntsoeA75EstoniaB19Model':{'label':'Estonia Wind Onshore','shortname':''},
			'EntsoeA75EstoniaB20Model':{'label':'Estonia Other','shortname':''},
			
			'EntsoeA75FinlandB01Model':{'label':'Finland Biomass','shortname':''},
			'EntsoeA75FinlandB04Model':{'label':'Finland Fossil Gas','shortname':''},
			'EntsoeA75FinlandB05Model':{'label':'Finland Fossil Hard coal','shortname':''},
			'EntsoeA75FinlandB06Model':{'label':'Finland Fossil Oil','shortname':''},
			'EntsoeA75FinlandB08Model':{'label':'Finland Fossil Peat','shortname':''},
			'EntsoeA75FinlandB11Model':{'label':'Finland Hydro Run-of-river and poundage','shortname':''},
			'EntsoeA75FinlandB14Model':{'label':'Finland Nuclear','shortname':''},
			'EntsoeA75FinlandB15Model':{'label':'Finland Other renewable','shortname':''},
			'EntsoeA75FinlandB17Model':{'label':'Finland Waste','shortname':''},
			'EntsoeA75FinlandB19Model':{'label':'Finland Wind Onshore','shortname':''},
			'EntsoeA75FinlandB20Model':{'label':'Finland Other','shortname':''},
			
			'EntsoeA75SwedenSE1B19Model':{'label':'Sweden SE1 Wind Onshore','shortname':''},
			'EntsoeA75SwedenSE3B19Model':{'label':'Sweden SE3 Wind Onshore','shortname':''},
			'EntsoeA75NorwayNO4B04Model':{'label':'Norway NO4 Fossil Gas','shortname':''},
			'EntsoeA75NorwayNO4B11Model':{'label':'Norway NO4 Hydro Run-of-river and poundage','shortname':''},
			'EntsoeA75NorwayNO4B12Model':{'label':'Norway NO4 Hydro Water Reservoir','shortname':''},
			'EntsoeA75NorwayNO4B15Model':{'label':'Norway NO4 Other renewable','shortname':''},
			'EntsoeA75NorwayNO4B19Model':{'label':'Norway NO4 Wind Onshore','shortname':''}
			/*
RussiaModel (5)
P_AES		nuclear power
P_REN		solar
P_BS		stock (mainly pulp and paper factories)
P_TES		CHP units 
P_GES		hydropower stations

SwedenModel (7)
1: production
2: nuclear
3: thermal
4: unknown
5: wind
6: hydro
7: consumption*/
			
			//'RussiaModel':{'label':'','shortname':''},
			//'SwedenModel':{'label':'','shortname':''}
		};
		this.rendered = false;
		this.FELID = 'environment-page-view-failure';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	/*
	{ resolution: "PT60M", timeInterval: {start:'',end:''}, Point: [{ position: "1", quantity: "19"}, ...]
​​​	*/
	updateTable(mname) {
		let last_quantity = 'NOT AVAILABLE';
		const ts = this.models[mname].timeseries; // timeseries is an array
		ts.forEach(t=>{
			if (typeof t.Point !== 'undefined' && Array.isArray(t.Point)) {
				t.Point.forEach(p=>{
					last_quantity = p.quantity;
				});
			}
		});
		$('#'+mname+'-quantity').empty().append(last_quantity);
	}
	
	createTable(fid) {
		let html = '<table class="striped">'+
			'<thead>'+
				'<tr>'+
					'<th>Name</th>'+
					'<th>Quantity</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>';
			
		Object.keys(this.table_labels).forEach(key => {
			html += '<tr>'+
				'<td>'+this.table_labels[key].label+'</td>'+
				'<td id="'+key+'-quantity"></td>'+
			'</tr>';
		});
		html += '</tbody></table>';
		$(html).appendTo(fid);
	}
	
	updateSweden() {
		const values = this.models['SwedenModel'].values;
		/*
		self.values.push({
				'technology': tech,
				'time': moment(i.x).format(),
				'value': i.y
		});
		*/
		let html = '';
		values.forEach(v=>{
			html += '<p>technology: ' + v.technology + 
				' time: ' + v.time + 
				' value: '+ v.value + '</p>';
		});
		
		$('#sweden-wrapper').empty().append(html);
	}
	
	updateRussia() {
		
						//self.averages['nuclear'] = SUM_P_AES/count;
						//self.averages['solar'] = SUM_P_REN/count;
						//self.averages['stock'] = SUM_P_BS/count;
						//self.averages['chp'] = SUM_P_TES/count;
						//self.averages['hydropower'] = SUM_P_GES/count;
		
		const aves = this.models['RussiaModel'].averages;
		/*
			self.values.push({
				'nuclear': i.P_AES,
				'solar': i.P_REN,
				'stock': i.P_BS,
				'chp': i.P_TES,
				'hydropower': i.P_GES
			});
		*/
		//console.log(['updateRussia values=',values]);
		let html = '';
		Object.keys(aves).forEach(key => {
			html += '<p>' + key + ': ' + aves[key] + '</p>';
		});
		$('#russia-wrapper').empty().append(html);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model.indexOf('Entsoe')===0 && options.method==='fetched') {
				if (options.status === 200) {
					//console.log('EnvironmentPageView => ' + options.model + ' fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateTable(options.model);
						
					} else {
						this.render();
					}
					
				} else { // Error in fetching.
					console.log(['ERROR IN FETCHING ENTSOE MODEL=',options.model]);
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
			} else if (options.model==='SwedenModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateSweden();
						
					} else {
						this.render();
					}
					
				} else { // Error in fetching.
					console.log(['ERROR IN FETCHING SWEDEN MODEL=',options.model]);
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
			} else if (options.model==='RussiaModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateRussia();
						
					} else {
						this.render();
					}
					
				} else { // Error in fetching.
					console.log(['ERROR IN FETCHING RUSSIA MODEL=',options.model]);
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
		const localized_string_title = LM['translation'][sel]['ENVIRONMENT_PAGE_TITLE'];
		const localized_string_description = LM['translation'][sel]['ENVIRONMENT_PAGE_DESCRIPTION'];
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
				'<div class="col s12" id="table-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="sweden-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="russia-wrapper"></div>'+
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
			//this.renderChart();
		}
	}
}