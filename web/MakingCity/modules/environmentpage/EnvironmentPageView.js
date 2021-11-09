/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);


Use node csv-parser at backend:
https://www.npmjs.com/package/csv-parser




When all data is read into member variables, we can calculate 
All power plants are gathered in 3 categories and detailed for 6 fuels. the equivalence table is as follow. The 3 categories of powerplant are: District heating, Industry CHP, separate powerplant.


		this.POWER_CHP_DH = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};
		this.POWER_CHP_Ind = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};
		this.POWER_SEP = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};

those 2 files contains the fuel quantity used by power plants. 6 fuels are accounted for: peat, biomass, gas (as natural gas), others, oil, coal.
For each sample, the CHP_DH and CHP_Ind can be




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
		/*
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
		};*/
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
7: consumption
*/
//'RussiaModel':{'label':'','shortname':''},
//'SwedenModel':{'label':'','shortname':''}
		
		/*
		// The emission factor [unit/MWh] is taken from the 
		// Emissions_Summary.csv which 
		// compiles data for EcoInvent, characterised with the ReCiPe 2016 midpoint I method.
		this.emission_factors = [];
		
		// electricitymap_Emissions.csv
		this.elemap_factors = [];
		
		// Power production from Excel sheet:
		// Energiaviraston voimalaitosrekisteri.xlsx
		this.finpower = {
			"District heating CHP":[],
			"Industry CHP":[],
			"Separate electricity production":[],
			"Nuclear energy":[],
			"Hydro power":[],
			"Wind power":[],
			"Solar":[]
		};
		this.POWER_CHP_DH = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};
		this.POWER_CHP_Ind = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};
		this.POWER_SEP = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};
		this.NUCLEAR_TOTAL = 0;
		this.HYDRO_TOTAL = 0;
		this.WIND_TOTAL = 0;
		this.SOLAR_TOTAL = 0;
		
		// Emissions_ET.csv
		this.EMISSIONS_ET = {'coal':0,'oil':0,'gas':0,'peat':0,'other_biogas':0,'biomass':0,'coal_chp':0,'oil_chp':0,'gas_chp':0};
		// chp.csv
		this.EMISSIONS_CHP = {'total':0,'coal':0,'oil':0,'gas':0,'peat':0,'biomass':0,'others':0};
		// separate.csv
		this.EMISSIONS_SEP = {'total':0,'coal':0,'oil':0,'gas':0,'peat':0,'biomass':0,'others':0};
		// Fingrid_coeff.csv
		this.FINGRID_COEFF = {'Hydro':0,'Nuclear':0,'Wind':0,'Solar':0,'DH_CHP':0,'Ind_CHP':0,'Other':0,'Reserve':0};
		*/
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
	/*
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
	*/
	/*
	createTable(fid) {
		let html = '<h3>ENTSOE</h3>'+
		'<table class="striped">'+
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
	*/
	
	
		/*
		self.values.push({
				'technology': tech,
				'time': moment(i.x).format(),
				'value': i.y
		});
		*/
	/*
	updateSweden() {
		const values = this.models['SwedenModel'].values;
		let html = '<h3>Sweden</h3>';
		values.forEach(v=>{
			html += '<p>technology: ' + v.technology + 
				' time: ' + v.time + 
				' value: '+ v.value + '</p>';
		});
		
		$('#sweden-wrapper').empty().append(html);
	}
	*/
		/*
			self.values.push({
				'nuclear': i.P_AES,
				'solar': i.P_REN,
				'stock': i.P_BS,
				'chp': i.P_TES,
				'hydropower': i.P_GES
			});
		*/
	/*
	updateRussia() {
		//self.averages['nuclear'] = SUM_P_AES/count;
		//self.averages['solar'] = SUM_P_REN/count;
		//self.averages['stock'] = SUM_P_BS/count;
		//self.averages['chp'] = SUM_P_TES/count;
		//self.averages['hydropower'] = SUM_P_GES/count;
		const aves = this.models['RussiaModel'].averages;
		//console.log(['updateRussia values=',values]);
		let html = '<h3>Russia</h3>';
		Object.keys(aves).forEach(key => {
			html += '<p>' + key + ': ' + aves[key] + '</p>';
		});
		$('#russia-wrapper').empty().append(html);
	}*/
/*


3 categories: 
	District heating
	Industry CHP
	separate powerplant
6 fuels:
	peat
	biomass
	gas
	others
	coal
	oil

MAPPING:
{
'peat' 'Peat'
'biomass' 'Industrial wood residues'
'gas' 'Natural gas'
'others' 'Other by-products and wastes used as fuel'
'biomass' 'Forest fuelwood'
'biomass' 'Black liquor and concentrated liquors'
'coal' 'Hard coal and anthracite'
'biomass' 'By-products from wood processing industry'
'oil' 'Heavy distillates'
'others' 'Exothermic heat from industry'
'oil' 'Light distillates'
'others' 'Biogas'
'oil' 'Medium heavy distillates'
'oil' 'Heavy distillates'
'coal' 'Blast furnace gas'
}

0: "Kaukopää"
​​​​1: "Stora Enso Oyj"
​​​​2: "1039050-8"
​​​​3: "Imatran tehtaat"
​​​​4: "Imatra"
​​​​5: 55800
​​​​6: "Kaukopää"
​​​​7: "Industry CHP"
​​​​8: 0
​​​​9: 0
​​​​10: 0
​​​​11: 134
​​​​12: 105
​​​​13: 0
​​​​14: 0
​​​​15: 0
​​​​16: 0
​​​​17: 134
​​​​18: 105
​​​​19: 0
​​​​20: "Black liquor and concentrated liquors"
​​​​21: "Industrial wood residues"
​​​​22: "Natural gas"
​​​​*/
/*
	updateFinlandPowerPlants() {
		
		// values is an array of arrays.
		// 441 arrays (powerplants) with 23 properties each.
		// we read and store properties at index 0, 7 and 18
		this.finpower = {
			"District heating CHP":[],
			"Industry CHP":[],
			"Separate electricity production":[],
			"Nuclear energy":[],
			"Hydro power":[],
			"Wind power":[],
			"Solar":[]
		};
		this.POWER_CHP_DH = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};
		this.POWER_CHP_Ind = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};
		this.POWER_SEP = {'peat':0,'biomass':0,'gas':0,'others':0,'coal':0,'oil':0};
		
		this.NUCLEAR_TOTAL = 0;
		this.HYDRO_TOTAL = 0;
		this.WIND_TOTAL = 0;
		this.SOLAR_TOTAL = 0;
		
		// NOTE: SKIP ROWS 1 and 2, they contain HEADER data.
		const values = this.models['FinlandPowerPlantsModel'].values.slice(2);
		
		console.log('================================================================');
		console.log(['values=',values]);
		console.log('================================================================');
		*/
		// index 0 is name, index 7 is type, index 17 is Maximum total MW and index 18 is Hour total MW.
		// index 20 is the Main Fuel.
		//let type_hash = {};
		/*
		values.forEach(v=>{
			let fuel = '';
			const name = v[0]; // Name
			const type = v[7]; // Type
			let energy = v[18]; // Hour total MW
			if (energy == 0) {
				// if Hour total MW is zero => try Maximum total MW
				energy = v[17];
			}
			const mf = v[20]; // Main fuel
			
			//if (typeof type_hash[type] === 'undefined') {
			//	type_hash[type] = type;
			//}
			
			//"Wind power"
			//"Hydro power"
			//"Nuclear energy"
			//"Solar"
			
			if (mf) { // IF main fuel is listed.
				
				//All power plants are gathered in 3 categories:
				//	"District heating CHP"
				//	"Separate electricity production"
				//	"Industry CHP"
				
				if (mf === 'Peat') { fuel = 'peat'; }
				else if (mf === 'Industrial wood residues') { fuel = 'biomass'; }
				else if (mf === 'Natural gas') { fuel = 'gas'; }
				else if (mf === 'Other by-products and wastes used as fuel') { fuel = 'others' }
				else if (mf === 'Forest fuelwood') { fuel = 'biomass'; }
				else if (mf === 'Black liquor and concentrated liquors') { fuel = 'biomass'; }
				else if (mf === 'Hard coal and anthracite') { fuel = 'coal'; }
				else if (mf === 'By-products from wood processing industry') { fuel = 'biomass'; }
				else if (mf === 'Heavy distillates') { fuel = 'oil'; }
				else if (mf === 'Exothermic heat from industry') { fuel = 'others'; }
				else if (mf === 'Light distillates') { fuel = 'oil'; }
				else if (mf === 'Biogas') { fuel = 'others'; }
				else if (mf === 'Medium heavy distillates') { fuel = 'oil'; }
				else if (mf === 'Blast furnace gas') { fuel = 'coal'; }
				// 14 so far.
				// My additions from Excel:
				else if (mf === 'Other non-specified energy sources') { fuel = 'others'; }
				else if (mf === 'Mixed fuels') { fuel = 'others'; }
				else if (mf === 'Gasified waste') { fuel = 'others'; }
				else if (mf === 'Nuclear energy') { fuel = 'nuclear energy'; }
			}*/
			/*
				"Peat"
				"Industrial wood residues"
				"Natural gas"
				"Other by-products and wastes used as fuel"
				"Forest fuelwood"
				"Black liquor and concentrated liquors"
				"Hard coal and anthracite"
				"By-products from wood processing industry"
				"Heavy distillates"
				"Exothermic heat from industry"
				"Light distillates"
				"Biogas"
				"Medium heavy distillates"
				"Blast furnace gas"
				
				"Other non-specified energy sources"
				"Mixed fuels"
				"Gasified waste"
				"Nuclear energy"
			*/
			/*
			this.finpower = {
				'District heating CHP':[],
				'Industry CHP':[],
				'Separate electricity production':[],
				'Nuclear energy':[],
				'Hydro power':[],
				'Wind power':[],
				'Solar':[]
			};*/
			//this.finpower[type].push({'name':name,'energy':energy,'fuel':fuel});
		//});
		/*
		const types = Object.keys(type_hash);
		console.log('==========================================================');
		console.log(['types LENGTH=',types.length]);
		console.log('==========================================================');
		types.forEach(t=>{
			console.log(['t=',t]);
		});*/
		
		// Type clusters:
		/*
		const fuels = Object.keys(this.POWER_CHP_DH);
		
		this.finpower["District heating CHP"].forEach(v => {
			if (fuels.includes(v.fuel)) {
				this.POWER_CHP_DH[v.fuel] += v.energy;
			}
		});
		this.finpower["Industry CHP"].forEach(v => {
			if (fuels.includes(v.fuel)) {
				this.POWER_CHP_Ind[v.fuel] += v.energy;
			}
		});
		this.finpower["Separate electricity production"].forEach(v => {
			if (fuels.includes(v.fuel)) {
				this.POWER_SEP[v.fuel] += v.energy;
			}
		});
		
		this.finpower["Nuclear energy"].forEach(v => {
			this.NUCLEAR_TOTAL += v.energy;
		});
		this.finpower["Hydro power"].forEach(v => {
			this.HYDRO_TOTAL += v.energy;
		});
		this.finpower["Wind power"].forEach(v => {
			this.WIND_TOTAL += v.energy;
		});
		this.finpower["Solar"].forEach(v => {
			this.SOLAR_TOTAL += v.energy;
		});
		
		let html = '';
		html += '<h3>Energiaviraston voimalaitosrekisteri (Excel)</h3>';
		html += '<h4>District heating CHP</h4>';
		fuels.forEach(f=>{
			html += '<p>fuel=' + f + ' Total=' + this.POWER_CHP_DH[f].toFixed(0) + 'MW</p>';
		});
		html += '<h4>Industry CHP</h4>';
		fuels.forEach(f=>{
			html += '<p>fuel=' + f + ' Total=' + this.POWER_CHP_Ind[f].toFixed(0) + 'MW</p>';
		});
		html += '<h4>Separate electricity production</h4>';
		fuels.forEach(f=>{
			html += '<p>fuel=' + f + ' Total=' + this.POWER_SEP[f].toFixed(0) + 'MW</p>';
		});
		
		html += '<h4>Nuclear energy</h4>';
		html += '<p>Total='+this.NUCLEAR_TOTAL.toFixed(0)+'MW</p>';
		
		html += '<h4>Hydro power</h4>';
		html += '<p>Total='+this.HYDRO_TOTAL.toFixed(0)+'MW</p>';
		
		html += '<h4>Wind power</h4>';
		html += '<p>Total='+this.WIND_TOTAL.toFixed(0)+'MW</p>';
		
		html += '<h4>Solar</h4>';
		html += '<p>Total='+this.SOLAR_TOTAL.toFixed(0)+'MW</p>';
		*/
		
		/*
		let html = '';
		html += '<h3>District heating CHP</h3>';
		this.finpower["District heating CHP"].forEach(v => {
			html += '<p>Name=' + v.name + ' Energy=' + v.energy + ' Fuel='+v.fuel+'</p>';
		});
		
		html += '<h3>Industry CHP</h3>';
		this.finpower["Industry CHP"].forEach(v => {
			html += '<p>Name=' + v.name + ' Energy=' + v.energy + ' Fuel='+v.fuel+'</p>';
		});
		
		html += '<h3>Separate electricity production</h3>';
		this.finpower["Separate electricity production"].forEach(v => {
			html += '<p>Name=' + v.name + ' Energy=' + v.energy + ' Fuel='+v.fuel+'</p>';
		});
		
		html += '<h3>Wind power</h3>';
		this.finpower["Wind power"].forEach(v => {
			html += '<p>Name=' + v.name + ' Energy=' + v.energy + ' Fuel='+v.fuel+'</p>';
		});
		
		html += '<h3>Hydro power</h3>';
		this.finpower["Hydro power"].forEach(v => {
			html += '<p>Name=' + v.name + ' Energy=' + v.energy + ' Fuel='+v.fuel+'</p>';
		});
		
		html += '<h3>Solar</h3>';
		this.finpower["Solar"].forEach(v => {
			html += '<p>Name=' + v.name + ' Energy=' + v.energy + ' Fuel='+v.fuel+'</p>';
		});
			
		html += '<h3>Nuclear energy</h3>';
		this.finpower["Nuclear energy"].forEach(v => {
			html += '<p>Name=' + v.name + ' Energy=' + v.energy + ' Fuel='+v.fuel+'</p>';
		});
		*/
		
		
		//$('#finpower-wrapper').empty().append(html);
	//}
	
	/*
	5.1.3. Load Emissions data
	Emissions from EcoInvent are gathered and stored in a .csv file associated to this file Emissions_Summary.csv. 
	The data are gathered from EcoInvent 3.6 and characterised with the ReCiPe 2016 method. 
	All categories are reported therefore, it is possible to choose from any of the 18 categories 
	EmissionsCategory = 'GlobalWarming' ;
	Emissions = load_emissions ; [IndCHP, DHCHP, Sep, Windpower] = extract2stat ;
	
	Object { 
		"\ufeffTechnology;Country;Global warming;Stratospheric ozone depletion;Ionizing radiation;Ozone formation": 
		"other_biogas;NO;345.37598;0.00129608;7.379338814;0.651773879;0.08656705;0.660963345;9.008573734;0.402944846;0.084247227;138.3859614;36.46999029;10.67224709;0.106596896;4.925282142;44.29541411;0.455656374;32.9793508;3.52948134"
	}
	*/
	
	
			/*
			v is an object with key value pair.
			Key is always the same: "\ufeffTechnology;Country;Global warming;Stratospheric ozone depletion;Ionizing radiation;Ozone formation": 
			and value contains one row from CSV file:
			"other_biogas;NO;345.37598;0.00129608;7.379338814;0.651773879;0.08656705;0.660963345;9.008573734;0.402944846;0.084247227;138.3859614;36.46999029;10.67224709;0.106596896;4.925282142;44.29541411;0.455656374;32.9793508;3.52948134" }
			
			We need only 3 first values from "value" (Technology;Country;Global warming;)
				biomass;EE;50.75278775;
				coal;EE;1285.968615;
				coal_chp;EE;1285.968615;
				...
			*/
	/*
	updateEmissionsSummary() {
		const values = this.models['EmissionsSummaryModel'].values;
		//console.log(['values LENGTH = ',values.length]);
		this.emission_factors = [];
		values.forEach(v=>{
			Object.keys(v).forEach(key => {
				const arr = v[key].split(';');
				if (typeof arr !== 'undefined' && Array.isArray(arr)) {
					//console.log(['0=',arr[0],' 1=',arr[1],' 2=',arr[2]]);
					this.emission_factors.push({'technology':arr[0],'country':arr[1],'factor':arr[2]});
				}
			});
		});
		let html = '';
		html += '<h3>Emissions Summary (csv)</h3>';
		this.emission_factors.forEach(f => {
			html += '<p>Technology=' + f.technology + ' Country=' + f.country + ' Factor=' + f.factor + '</p>';
		});
		$('#factor-wrapper').empty().append(html);
	}*/
	/*
	updateElemapEmissions() {
		const values = this.models['ElectricitymapEmissionsModel'].values;
		this.elemap_factors = [];
		values.forEach(v=>{
			//0: Object { "\ufeffTechnology": "biomass", Country: "EE", "Global warming": "230" }
			let t='';
			let c='';
			let f='';
			Object.keys(v).forEach(key => {
				if (key.indexOf('Technology') >= 0) {
					t = v[key];
				} else if (key.indexOf('Country') >= 0) {
					c = v[key];
				} else if (key.indexOf('Global') >= 0) {
					f = v[key];
				}
			});
			this.elemap_factors.push({'technology':t,'country':c,'factor':f});
		});
		let html = '';
		html += '<h3>Electricitymap Emissions (csv)</h3>';
		this.elemap_factors.forEach(f => {
			html += '<p>Technology=' + f.technology + ' Country=' + f.country + ' Factor=' + f.factor + '</p>';
		});
		$('#elemap-wrapper').empty().append(html);
	}*/
	/*
		biomass: "4624"​​​
		coal: "1401"
		gas: "3016"
		oil: "75"
		others: "283"
		peat: "1218"
		total: "10617"
	*/
	/*
	updateEmissionsCHP() {
		
		this.EMISSIONS_CHP = {'total':0,'coal':0,'oil':0,'gas':0,'peat':0,'biomass':0,'others':0};
		
		const values = this.models['EmissionsCHPModel'].values;
		console.log('========================================');
		console.log(['EmissionsCHPModel values=',values]);
		console.log('========================================');
		
		// An array of 182 values, last one is the one we need:
		const tail = values.slice(-1); // returns an array with only last item in it.
		const lastitem = tail[0];
		let year = '';
		let month = '';
		
		Object.keys(lastitem).forEach(k=>{
			if (k.indexOf('Year') >= 0) {
				year = lastitem[k];
			} else if (k.indexOf('Month') >= 0) {
				month = lastitem[k];
			} else if (typeof this.EMISSIONS_CHP[k] !== 'undefined') {
				this.EMISSIONS_CHP[k] = lastitem[k];
			}
		});
		let html = '<h3>Emissions CHP Model</h3>';
		html += '<h5>Year '+year+' Month '+month+'</h5>';
		Object.keys(this.EMISSIONS_CHP).forEach( k=> {
			html += '<p>'+k+': '+this.EMISSIONS_CHP[k]+'</p>';
		});
		$('#emissions-chp-wrapper').empty().append(html);
	}*/
	/*
	updateEmissionsSeparate() {
		
		this.EMISSIONS_SEP = {'total':0,'coal':0,'oil':0,'gas':0,'peat':0,'biomass':0,'others':0};
		
		const values = this.models['EmissionsSeparateModel'].values;
		console.log('========================================');
		console.log(['EmissionsSeparateModel values=',values]);
		console.log('========================================');
		
		// An array of 182 values, last one is the one we need:
		const tail = values.slice(-1); // returns an array with only last item in it.
		const lastitem = tail[0];
		let year = '';
		let month = '';
		
		Object.keys(lastitem).forEach(k=>{
			//console.log(['k=',k]);
			// k="\ufeffYear"
			// k="Month"
			if (k.indexOf('Year') >= 0) {
				year = lastitem[k];
			} else if (k.indexOf('Month') >= 0) {
				month = lastitem[k];
			} else if (typeof this.EMISSIONS_SEP[k] !== 'undefined') {
				this.EMISSIONS_SEP[k] = lastitem[k];
			}
		});
		
		let html = '<h3>Emissions Separate Model</h3>';
		html += '<h5>Year '+year+' Month '+month+'</h5>';
		Object.keys(this.EMISSIONS_SEP).forEach( k=> {
			html += '<p>'+k+': '+this.EMISSIONS_SEP[k]+'</p>';
		});
		$('#emissions-separate-wrapper').empty().append(html);
	}*/
	
	/*
		hydro_runof		0
		nuclear_BWR		0
		nuclear_PWR		0
		waste			0
		solar			0
		windon			0
	*/
	/*
	updateEmissionsET() {
		
		this.EMISSIONS_ET = {'coal':0,'oil':0,'gas':0,'peat':0,'other_biogas':0,'biomass':0,'coal_chp':0,'oil_chp':0,'gas_chp':0};
		const values = this.models['EmissionsETModel'].values;
		console.log('========================================');
		console.log(['EmissionsETModel values=',values]);
		console.log('========================================');
		
		if (typeof values !== 'undefined' && Array.isArray(values)) {
			values.forEach(v => {
				let t='';
				let c='';
				let f='';
				Object.keys(v).forEach(key => {
					if (key.indexOf('Technology') >= 0) {
						t = v[key];
					} else if (key.indexOf('Country') >= 0) {
						c = v[key];
					} else if (key.indexOf('Global') >= 0) {
						f = v[key];
					}
				});
				if (typeof this.EMISSIONS_ET[t] !== 'undefined') {
					this.EMISSIONS_ET[t] = f;
				}
			});
		}
		
		let html = '<h3>Emissions ET Model</h3>';
		Object.keys(this.EMISSIONS_ET).forEach(k=>{
			html += '<p>'+k+': '+ this.EMISSIONS_ET[k]+'</p>';
		});
		$('#emissions-et-wrapper').empty().append(html);
	}*/
	/*
		DH_CHP: "340"
		​​​Ind_CHP: "180"
		​​​Nuclear: "0"
		​​​Other: "114"
		​​​Reserve: "814"
		​​​Solar: "0"
		​​​Wind: "0"
		​​​"\ufeffHydro": "0"
	*/
	/*
	updateEmissionsFingridCoeff() {
		
		this.FINGRID_COEFF = {'Hydro':0,'Nuclear':0,'Wind':0,'Solar':0,'DH_CHP':0,'Ind_CHP':0,'Other':0,'Reserve':0};
		
		const values = this.models['EmissionsFingridCoeffModel'].values;
		console.log('========================================');
		console.log(['EmissionsFingridCoeffModel values=',values]);
		console.log('========================================');
		if (typeof values !== 'undefined' && Array.isArray(values)) {
			values.forEach(v => {
				Object.keys(v).forEach(k=>{
					let kk = k;
					if (k.indexOf('Hydro') >= 0) {
						kk = 'Hydro';
					}
					if (typeof this.FINGRID_COEFF[kk] !== 'undefined') {
						this.FINGRID_COEFF[kk] = v[k];
					}
				});
			});
		}
		let html = '<h3>Emissions Fingrid Coeff Model</h3>';
		Object.keys(this.FINGRID_COEFF).forEach(k=>{
			html += '<p>'+k+': '+ this.FINGRID_COEFF[k]+'</p>';
		});
		$('#emissions-fingrid-coeff-wrapper').empty().append(html);
	}*/
	
	notifyError(options) {
		console.log(['ERROR IN FETCHING ',options.model]);
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
	
	notify(options) {
		if (this.controller.visible) {
			
			/*
			
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
					this.notifyError(options);
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
					this.notifyError(options);
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
					this.notifyError(options);
				}
			} else if (options.model==='EmissionsSummaryModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateEmissionsSummary();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			} else if (options.model==='ElectricitymapEmissionsModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateElemapEmissions();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			} else if (options.model==='FinlandPowerPlantsModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateFinlandPowerPlants();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			} else if (options.model==='EmissionsCHPModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateEmissionsCHP();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			} else if (options.model==='EmissionsSeparateModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateEmissionsSeparate();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			} else if (options.model==='EmissionsETModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateEmissionsET();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			} else if (options.model==='EmissionsFingridCoeffModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateEmissionsFingridCoeff();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			}
			*/
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
			
			
			/*
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
				'<div class="col s12" id="factor-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="elemap-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="finpower-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="emissions-chp-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="emissions-separate-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="emissions-et-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12" id="emissions-fingrid-coeff-wrapper"></div>'+
			'</div>'+
			
			*/
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
		//this.createTable('#table-wrapper');
		this.rendered = true;
		
		if (this.areModelsReady()) {
			this.handleErrorMessages(this.FELID);
			//this.renderChart();
		}
	}
}