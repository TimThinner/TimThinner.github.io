import Controller from '../common/Controller.js';
import EnvironmentPageView from './EnvironmentPageView.js';

//import obixModel from '../energydata/obixModel.js';
/*
import EntsoeModel from '../energydata/EntsoeModel.js';
import RussiaModel from '../energydata/RussiaModel.js';
import SwedenModel from '../energydata/SwedenModel.js';
import FinlandPowerPlantsModel from './FinlandPowerPlantsModel.js';
import EmissionsSummaryModel from './EmissionsSummaryModel.js';
import ElectricitymapEmissionsModel from './ElectricitymapEmissionsModel.js';
import { EmissionsCHPModel, EmissionsSeparateModel, EmissionsETModel, EmissionsFingridCoeffModel } from  './EmissionsMiscModels.js';
*/
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
		
		
		/*
		EntsoeA65NorwayNO4Model: SyntaxError: JSON.parse: unexpected character at line 1 column 2 of the JSON data
		
		
		https://transparency.entsoe.eu/api?securityToken=9f2496b9-6f5e-4396-a1af-263ffccd597a&documentType=A65&processType=A16&outBiddingZone_Domain=10YNO-4--------9&periodStart=202106210700&periodEnd=202106210900
		
		<Acknowledgement_MarketDocument>
			<mRID>14812aa9-2a1b-4</mRID>
			<createdDateTime>2021-06-21T09:17:42Z</createdDateTime>
			<sender_MarketParticipant.mRID codingScheme="A01">10X1001A1001A450</sender_MarketParticipant.mRID>
			<sender_MarketParticipant.marketRole.type>A32</sender_MarketParticipant.marketRole.type>
			<receiver_MarketParticipant.mRID codingScheme="A01">10X1001A1001A450</receiver_MarketParticipant.mRID>
			<receiver_MarketParticipant.marketRole.type>A39</receiver_MarketParticipant.marketRole.type>
			<received_MarketDocument.createdDateTime>2021-06-21T09:17:42Z</received_MarketDocument.createdDateTime>
			<Reason>
				<code>999</code>
				<text>
					No matching data found for Data item Actual Total Load [6.1.A] (10YNO-4--------9) and interval 2021-06-21T07:00:00.000Z/2021-06-21T09:00:00.000Z.
				</text>
			</Reason>
		</Acknowledgement_MarketDocument>
		*/
		
		
		/*
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
		];*/
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		 /*'obixModel'*/
		/*
		const model_names = ['RussiaModel','SwedenModel',
			'FinlandPowerPlantsModel','EmissionsSummaryModel','ElectricitymapEmissionsModel',
			'EmissionsCHPModel','EmissionsSeparateModel','EmissionsETModel','EmissionsFingridCoeffModel'];
		
		this.sources.forEach(src=> {
			model_names.push('Entsoe'+src.type+src.area_name+src.psr_type+'Model');
		});
		Object.keys(this.models).forEach(key => {
			if (model_names.includes(key)) {
				this.master.modelRepo.remove(key);
			}
		});
		*/
		
	}
	
	init() {
		// Testing!
		/*
		const m2 = new obixModel({name:'obixModel',src:''});
		m2.subscribe(this);
		this.master.modelRepo.add('obixModel',m2);
		this.models['obixModel'] = m2;
		*/
		
		/*
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
		
		
		const FINPPM = new FinlandPowerPlantsModel({name:'FinlandPowerPlantsModel',src:''});
		FINPPM.subscribe(this);
		this.master.modelRepo.add('FinlandPowerPlantsModel',FINPPM);
		this.models['FinlandPowerPlantsModel'] = FINPPM;
		
		const ESM = new EmissionsSummaryModel({name:'EmissionsSummaryModel',src:''});
		ESM.subscribe(this);
		this.master.modelRepo.add('EmissionsSummaryModel',ESM);
		this.models['EmissionsSummaryModel'] = ESM;
		
		const EMEM = new ElectricitymapEmissionsModel({name:'ElectricitymapEmissionsModel',src:''});
		EMEM.subscribe(this);
		this.master.modelRepo.add('ElectricitymapEmissionsModel',EMEM);
		this.models['ElectricitymapEmissionsModel'] = EMEM;
		*/
		/*
		Energiaviraston voimalaitosrekisteri.xlsx
		Emissions_Summary.csv
		electricitymap_Emissions.csv
		
		And 4 more:
		
		Fetch and process:
			"chp.csv"
			"separate.csv"
			"Emissions_ET.csv"
			"Fingrid_coeff.csv"
		*/
		/*
		const eCHPm = new EmissionsCHPModel({name:'EmissionsCHPModel',src:''});
		eCHPm.subscribe(this);
		this.master.modelRepo.add('EmissionsCHPModel',eCHPm);
		this.models['EmissionsCHPModel'] = eCHPm;
		
		const eSepm = new EmissionsSeparateModel({name:'EmissionsSeparateModel',src:''});
		eSepm.subscribe(this);
		this.master.modelRepo.add('EmissionsSeparateModel',eSepm);
		this.models['EmissionsSeparateModel'] = eSepm;
		
		const eETm = new EmissionsETModel({name:'EmissionsETModel',src:''});
		eETm.subscribe(this);
		this.master.modelRepo.add('EmissionsETModel',eETm);
		this.models['EmissionsETModel'] = eETm;
		
		const eFinCoeffm = new EmissionsFingridCoeffModel({name:'EmissionsFingridCoeffModel',src:''});
		eFinCoeffm.subscribe(this);
		this.master.modelRepo.add('EmissionsFingridCoeffModel',eFinCoeffm);
		this.models['EmissionsFingridCoeffModel'] = eFinCoeffm;
		
		// Fingrid models are created at GridPageController (13 kpl) except 'FingridPowerSystemStateModel' which is created at MenuController.
		//this.variable_ids = ['192','193','188','191','181','205','202','201','89','180','87','195','187']; // 13
		
		this.models['Fingrid192Model'] = this.master.modelRepo.get('Fingrid192Model');
		this.models['Fingrid192Model'].subscribe(this);
		this.models['Fingrid193Model'] = this.master.modelRepo.get('Fingrid193Model');
		this.models['Fingrid193Model'].subscribe(this);
		
		this.models['Fingrid188Model'] = this.master.modelRepo.get('Fingrid188Model');
		this.models['Fingrid188Model'].subscribe(this);
		this.models['Fingrid191Model'] = this.master.modelRepo.get('Fingrid191Model');
		this.models['Fingrid191Model'].subscribe(this);
		
		this.models['Fingrid181Model'] = this.master.modelRepo.get('Fingrid181Model');
		this.models['Fingrid181Model'].subscribe(this);
		this.models['Fingrid205Model'] = this.master.modelRepo.get('Fingrid205Model');
		this.models['Fingrid205Model'].subscribe(this);
		
		this.models['Fingrid202Model'] = this.master.modelRepo.get('Fingrid202Model');
		this.models['Fingrid202Model'].subscribe(this);
		this.models['Fingrid201Model'] = this.master.modelRepo.get('Fingrid201Model');
		this.models['Fingrid201Model'].subscribe(this);
		
		this.models['Fingrid89Model'] = this.master.modelRepo.get('Fingrid89Model');
		this.models['Fingrid89Model'].subscribe(this);
		this.models['Fingrid180Model'] = this.master.modelRepo.get('Fingrid180Model');
		this.models['Fingrid180Model'].subscribe(this);
		
		this.models['Fingrid87Model'] = this.master.modelRepo.get('Fingrid87Model');
		this.models['Fingrid87Model'].subscribe(this);
		this.models['Fingrid195Model'] = this.master.modelRepo.get('Fingrid195Model');
		this.models['Fingrid195Model'].subscribe(this);
		this.models['Fingrid187Model'] = this.master.modelRepo.get('Fingrid187Model');
		this.models['Fingrid187Model'].subscribe(this);
		
		this.models['FingridPowerSystemStateModel'] = this.master.modelRepo.get('FingridPowerSystemStateModel');
		this.models['FingridPowerSystemStateModel'].subscribe(this);
		*/
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		// interval 3600 s = 1 hour
		/*'obixModel',*/
		
		/*
		const model_names = ['RussiaModel','SwedenModel',
			'FinlandPowerPlantsModel','EmissionsSummaryModel','ElectricitymapEmissionsModel',
			'EmissionsCHPModel','EmissionsSeparateModel','EmissionsETModel','EmissionsFingridCoeffModel',
			'Fingrid192Model','Fingrid193Model',
			'Fingrid188Model','Fingrid191Model',
			'Fingrid181Model','Fingrid205Model',
			'Fingrid202Model','Fingrid201Model',
			'Fingrid89Model','Fingrid180Model',
			'Fingrid87Model','Fingrid195Model',
			'Fingrid187Model',
			'FingridPowerSystemStateModel'
		];
		
		this.sources.forEach(src=> {
			model_names.push('Entsoe'+src.type+src.area_name+src.psr_type+'Model');
		});
		this.timers['EnvironmentPageChartView'] = {timer: undefined, interval: 180000, models:model_names}; // interval 1 hour
		*/
		this.view = new EnvironmentPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
