import Controller from '../common/Controller.js';
import EntsoeModel from '../common/EntsoeModel.js';
import ObixModel from  '../common/ObixModel.js';
import FlexView from './FlexView.js';

export default class FlexController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 1800; // 30 x 60 Twice per hour 
	}
	
	remove() {
		super.remove();
		this.models = {};
	}
	
	clean() {
		this.remove();
		this.init();
	}
	
	init() {
		// These models are created at MenuController.
		/*
		this.models['EntsoeEnergyPriceModel'] = this.master.modelRepo.get('EntsoeEnergyPriceModel');
		this.models['EntsoeEnergyPriceModel'].subscribe(this);
		this.models['MenuBuildingElectricityPL1Model'] = this.master.modelRepo.get('MenuBuildingElectricityPL1Model');
		this.models['MenuBuildingElectricityPL1Model'].subscribe(this);
		this.models['MenuBuildingElectricityPL2Model'] = this.master.modelRepo.get('MenuBuildingElectricityPL2Model');
		this.models['MenuBuildingElectricityPL2Model'].subscribe(this);
		this.models['MenuBuildingElectricityPL3Model'] = this.master.modelRepo.get('MenuBuildingElectricityPL3Model');
		this.models['MenuBuildingElectricityPL3Model'].subscribe(this);
		*/
		const m3 = new EntsoeModel({
			name:'FlexEntsoeEnergyPriceModel',
			src:'https://transparency.entsoe.eu/api',
			document_type:'A44',
			area_name:'Finland',
			cache_expiration_in_seconds:3600 // 1 hour
		});
		m3.subscribe(this);
		this.master.modelRepo.add('FlexEntsoeEnergyPriceModel',m3);
		this.models['FlexEntsoeEnergyPriceModel'] = m3;
		
		// These three models will get Electricity consumption for building (with fixed interval and timerange).
		const m4 = new ObixModel({
			name:'FlexBuildingElectricityPL1Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L1/', // Power of L1
			access:'PUBLIC'
		});
		m4.subscribe(this);
		this.master.modelRepo.add('FlexBuildingElectricityPL1Model',m4);
		this.models['FlexBuildingElectricityPL1Model'] = m4;
		
		const m5 = new ObixModel({
			name:'FlexBuildingElectricityPL2Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L2/', // Power of L2
			access:'PUBLIC'
		});
		m5.subscribe(this);
		this.master.modelRepo.add('FlexBuildingElectricityPL2Model',m5);
		this.models['FlexBuildingElectricityPL2Model'] = m5;
		
		const m6 = new ObixModel({
			name:'FlexBuildingElectricityPL3Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L3/', // Power of L3
			access:'PUBLIC'
		});
		m6.subscribe(this);
		this.master.modelRepo.add('FlexBuildingElectricityPL3Model',m6);
		this.models['FlexBuildingElectricityPL3Model'] = m6;
		
		//These must be set somewhere (before calling fetch on these models):
		//interval: 'PT60M',
		//timerange: {begin:{value:5,unit:'days'},end:{value:0,unit:'days'}}
		
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new FlexView(this);
	}
}
