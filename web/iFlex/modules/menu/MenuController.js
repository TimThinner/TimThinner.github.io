import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import ObixModel from '../common/ObixModel.js';
import EntsoeModel from '../common/EntsoeModel.js';
import { BuildingElectricityPL1Model, BuildingElectricityPL2Model, BuildingElectricityPL3Model } from  '../a/BuildingElectricityModels.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
		// Interval for fetching ENTSOE Electricity day-ahead price and 
		// fetching building electricity consumption with "PT60M".
		this.fetching_interval_in_seconds = 1800; // 30 x 60 Twice per hour 
	}
	/*
	NOTE: Menumodel is NEVER removed!
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key === 'MenuModel' || key === 'ProxesCleanerModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	*/
	init() {
		const model = new MenuModel({name:'MenuModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		const m2 = new ObixModel({name:'ProxesCleanerModel',src:'',access:'PUBLIC'});
		m2.subscribe(this);
		this.master.modelRepo.add('ProxesCleanerModel',m2);
		this.models['ProxesCleanerModel'] = m2;
		
		const m3 = new EntsoeModel({name:'EntsoeEnergyPriceModel',src:'https://transparency.entsoe.eu/api', document_type:'A44', area_name:'Finland'});
		m3.subscribe(this);
		this.master.modelRepo.add('EntsoeEnergyPriceModel',m3);
		this.models['EntsoeEnergyPriceModel'] = m3;
		
		
		// These three models will get Electricity consumption for building (with fixed interval and timerange).
		
		const m4 = new BuildingElectricityPL1Model({
			name:'MenuBuildingElectricityPL1Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L1/', // Power of L1
			access:'PUBLIC'
		});
		m4.subscribe(this);
		this.master.modelRepo.add('MenuBuildingElectricityPL1Model',m4);
		this.models['MenuBuildingElectricityPL1Model'] = m4;
		
		const m5 = new BuildingElectricityPL2Model({
			name:'MenuBuildingElectricityPL2Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L2/', // Power of L2
			access:'PUBLIC'
		});
		m5.subscribe(this);
		this.master.modelRepo.add('MenuBuildingElectricityPL2Model',m5);
		this.models['MenuBuildingElectricityPL2Model'] = m5;
		
		const m6 = new BuildingElectricityPL3Model({
			name:'MenuBuildingElectricityPL3Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L3/', // Power of L3
			access:'PUBLIC'
		});
		m6.subscribe(this);
		this.master.modelRepo.add('MenuBuildingElectricityPL3Model',m6);
		this.models['MenuBuildingElectricityPL3Model'] = m6;
		
		//These must be set somewhere (before calling fetch on these models):
		//interval: 'PT60M',
		//timerange: {begin:{value:5,unit:'days'},end:{value:0,unit:'days'}}
		
		
		this.view = new MenuView(this);
		// NOTE: If View does NOT have ResizeEventObserver, we try to show it.
		// If view is listening to ResizeEventObserver, initial resize event will trigger "show()".
		if (typeof this.view.REO === 'undefined') {
			this.show(); // IF this controller is visible => show it.
		}
	}
}
