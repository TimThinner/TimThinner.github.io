import Controller from '../common/Controller.js';
import EnvironmentPageView from './EnvironmentPageView.js';
//import obixModel from '../energydata/obixModel.js';
import EntsoeModel from '../energydata/EntsoeModel.js';
import RussiaModel from '../energydata/RussiaModel.js';
import SwedenModel from '../energydata/SwedenModel.js';

export default class EnvironmentPageController extends Controller {
	
	constructor(options) {
		super(options);
		
		/*
		Number of document types: 2 => 
			'A65'				System total load
			'A75'				Actual generation per type
		
		Number of areas: 6 when Sweden is counted as 2 different areas => 
			case 'NorwayNO4'	idomain = '10YNO-4--------9'	NO4 BZ / MBA
			case 'Estonia'		idomain = '10Y1001A1001A39I'	Estonia, Elering BZ / CA / MBA
			case 'Finland'		idomain = '10YFI-1--------U'	Finland, Fingrid BZ / CA / MBA
			case 'SwedenSE1'	idomain = '10Y1001A1001A44P'	SE1 BZ / MBA
			case 'SwedenSE3'	idomain = '10Y1001A1001A46L'	SE3 BZ / MBA
			case 'Russia'		idomain = '10Y1001A1001A49F'	Russia BZ / CA / MBA
		
		Number of technologies: 20 => (psrType used only when document type = 'A75')
			'B01' 'Biomass'
			'B02' 'Fossil Brown coal/Lignite'
			'B03' 'Fossil Coal-derived gas'
			'B04' 'Fossil Gas'
			'B05' 'Fossil Hard coal'
			'B06' 'Fossil Oil'
			'B07' 'Fossil Oil shale'
			'B08' 'Fossil Peat'
			'B09' 'Geothermal'
			'B10' 'Hydro Pumped Storage'
			'B11' 'Hydro Run-of-river and poundage'
			'B12' 'Hydro Water Reservoir'
			'B13' 'Marine'
			'B14' 'Nuclear'
			'B15' 'Other renewable'
			'B16' 'Solar'
			'B17' 'Waste'
			'B18' 'Wind Offshore'
			'B19' 'Wind Onshore'
			'B20' 'Other'
		*/
		this.sources = [
			{ type: 'A65', area_name: 'NorwayNO4', psr_type:''},
			{ type: 'A65', area_name: 'Estonia', psr_type:''},
			{ type: 'A65', area_name: 'Finland', psr_type:''},
			{ type: 'A65', area_name: 'SwedenSE1', psr_type:''},
			{ type: 'A65', area_name: 'SwedenSE3', psr_type:''},
			
			{ type: 'A75', area_name: 'Estonia', psr_type:'B01'},
			{ type: 'A75', area_name: 'Estonia', psr_type:'B03'},
			{ type: 'A75', area_name: 'Estonia', psr_type:'B04'},
			{ type: 'A75', area_name: 'Estonia', psr_type:'B07'},
			{ type: 'A75', area_name: 'Estonia', psr_type:'B08'},
			
			{ type: 'A75', area_name: 'Estonia', psr_type:'B11'},
			{ type: 'A75', area_name: 'Estonia', psr_type:'B15'},
			{ type: 'A75', area_name: 'Estonia', psr_type:'B16'},
			{ type: 'A75', area_name: 'Estonia', psr_type:'B17'},
			{ type: 'A75', area_name: 'Estonia', psr_type:'B19'},
			
			{ type: 'A75', area_name: 'Estonia', psr_type:'B20'},
			{ type: 'A75', area_name: 'Finland', psr_type:'B01'}, // 'Biomass'
			{ type: 'A75', area_name: 'Finland', psr_type:'B04'}, // 'Fossil Gas'
			{ type: 'A75', area_name: 'Finland', psr_type:'B05'}, // 'Fossil Hard coal'
			{ type: 'A75', area_name: 'Finland', psr_type:'B06'}, // 'Fossil Oil'
			
			{ type: 'A75', area_name: 'Finland', psr_type:'B08'}, // 'Fossil Peat'
			{ type: 'A75', area_name: 'Finland', psr_type:'B11'}, // 'Hydro Run-of-river and poundage'
			{ type: 'A75', area_name: 'Finland', psr_type:'B14'}, // 'Nuclear'
			{ type: 'A75', area_name: 'Finland', psr_type:'B15'}, // 'Other renewable'
			{ type: 'A75', area_name: 'Finland', psr_type:'B17'}, // 'Waste'
			
			{ type: 'A75', area_name: 'Finland', psr_type:'B19'}, // 'Wind Onshore'
			{ type: 'A75', area_name: 'Finland', psr_type:'B20'}, // 'Other'
			{ type: 'A75', area_name: 'SwedenSE1', psr_type:'B19'},
			{ type: 'A75', area_name: 'SwedenSE3', psr_type:'B19'},
			{ type: 'A75', area_name: 'NorwayNO4', psr_type:'B04'}, // 'Fossil Gas'
			
			{ type: 'A75', area_name: 'NorwayNO4', psr_type:'B11'}, // 'Hydro Run-of-river and poundage'
			{ type: 'A75', area_name: 'NorwayNO4', psr_type:'B12'}, // 'Hydro Water Reservoir'
			{ type: 'A75', area_name: 'NorwayNO4', psr_type:'B15'}, // 'Other renewable'
			{ type: 'A75', area_name: 'NorwayNO4', psr_type:'B19'} // 'Wind Onshore'
		];
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		const model_names = ['RussiaModel','SwedenModel']; /*'obixModel',*/
		this.sources.forEach(src=> {
			model_names.push('Entsoe'+src.type+src.area_name+src.psr_type+'Model');
		});
		Object.keys(this.models).forEach(key => {
			if (model_names.includes(key)) {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		// Testing!
		/*
		const m2 = new obixModel({name:'obixModel',src:''});
		m2.subscribe(this);
		this.master.modelRepo.add('obixModel',m2);
		this.models['obixModel'] = m2;
		*/
		
		this.sources.forEach(src=> {
			const model_name = 'Entsoe'+src.type+src.area_name+src.psr_type+'Model';
			const m = new EntsoeModel({name:model_name,src:'https://transparency.entsoe.eu/api', document_type: src.type, area_name: src.area_name, psr_type:src.psr_type});
			m.subscribe(this);
			this.master.modelRepo.add(model_name,m);
			this.models[model_name] = m;
		});
		
		const m4 = new RussiaModel({name:'RussiaModel',src:'http://br.so-ups.ru/webapi/api/CommonInfo/PowerGeneration?priceZone[]=1'});
		m4.subscribe(this);
		this.master.modelRepo.add('RussiaModel',m4);
		this.models['RussiaModel'] = m4;
		
		const m5 = new SwedenModel({name:'SwedenModel',src:'https://www.svk.se/ControlRoom/GetProductionHistory/'});
		m5.subscribe(this);
		this.master.modelRepo.add('SwedenModel',m5);
		this.models['SwedenModel'] = m5;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		// interval 3600 s = 1 hour
		
		const model_names = ['RussiaModel','SwedenModel']; /*'obixModel',*/
		this.sources.forEach(src=> {
			model_names.push('Entsoe'+src.type+src.area_name+src.psr_type+'Model');
		});
		this.timers['EnvironmentPageChartView'] = {timer: undefined, interval: 3600000, models:model_names}; // interval 1 hour
		
		this.view = new EnvironmentPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
