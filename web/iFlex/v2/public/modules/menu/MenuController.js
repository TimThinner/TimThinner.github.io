import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import ObixModel from '../common/ObixModel.js';
import EntsoeModel from '../common/EntsoeModel.js';
import FlexResultModel from '../common/FlexResultModel.js';
import MenuView from './MenuView.js';

/*
Electricity power consumption of the building
/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L1		Power phase L1
/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L2		Power phase L2
/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L3		Power phase L3

CO2 emissions factor for electricity
/obixStore/store/Fingrid/emissionFactorForElectricityConsumedInFinland/

District heating Instantaneous power
/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_QE01		District heating Instantaneous power

CO2 emissions factor for District heating 
CONSTANT	182

Price for Ele:
https://transparency.entsoe.eu/api 24 values for each day.

Price for DH:
CONSTANT 1.10. - 31.12. 10,74 c/kWh
          1.1. - 28.2.  11,35 c/kWh

OPTIMIZATION METHOD:
/obixStore/store/VainoAuerinKatu13/control/optimization/	Optimization method		currently two values v==0 or v>0


What models we need to setup for this:
1. MenuBuildingElectricityPL1Model
2. MenuBuildingElectricityPL2Model
3. MenuBuildingElectricityPL3Model
4. MenuEmissionFactorForElectricityConsumedInFinlandModel
5. MenuBuildingHeatingQE01Model
5. EntsoeEnergyPriceModel
6. OptimizationModel




SAVINGS (CALCULATED SEPARATELY FOR DH AND ELE):

Energy Cost (DH + Ele):
10 €
17% decrease

Energy Consumption (DH + Ele):
25kWh
21% decrease

CO2 Emissions (DH + Ele):
5 kg
1% decrease
*/
export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
		// Interval for fetching ENTSOE Electricity day-ahead price and 
		// fetching building electricity consumption with "PT60M".
		this.fetching_interval_in_seconds = 1800; // 1800   (30 x 60) Twice per hour 
		
		// These are the models that are created in this Controller:
		
		// MenuModel + ProxesCleanerModel + 7 models as listed below:
		this.modelnames = [
			'MenuBuildingElectricityPL1Model',
			'MenuBuildingElectricityPL2Model',
			'MenuBuildingElectricityPL3Model',
			'MenuEmissionFactorForElectricityConsumedInFinlandModel',
			'MenuBuildingHeatingQE01Model',
			'EntsoeEnergyPriceModel',
			'OptimizationModel'
		];
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
		
		const model2 = new ObixModel({name:'ProxesCleanerModel',src:'',access:'PUBLIC'});
		model2.subscribe(this);
		this.master.modelRepo.add('ProxesCleanerModel',model2);
		this.models['ProxesCleanerModel'] = model2;
		
		// Inject CONSTANTS to model:
		// DH emissions factor: 
		// DH price: 
		
		const model3 = new FlexResultModel({
			name:'FlexResultModel',
			src:'',
			dhEmissionsFactor: 182,
			dhPrice: 0.1135 // in e/kWh
		});
		model3.subscribe(this);
		this.master.modelRepo.add('FlexResultModel',model3);
		this.models['FlexResultModel'] = model3;
		
		// These three models will get Electricity consumption for building (with fixed interval and timerange).
		//These must be set somewhere (before calling fetch on these models):
		//interval: 'PT60M',
		//timerange: {begin:{value:5,unit:'days'},end:{value:0,unit:'days'}}
		
		const m1 = new ObixModel({
			name:this.modelnames[0],
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L1/', // Power of L1
			access:'PUBLIC',
			cache_expiration_in_seconds:1800 // 30 minutes
		});
		m1.subscribe(this);
		this.master.modelRepo.add(this.modelnames[0],m1);
		this.models[this.modelnames[0]] = m1;
		
		const m2 = new ObixModel({
			name:this.modelnames[1],
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L2/', // Power of L2
			access:'PUBLIC',
			cache_expiration_in_seconds:1800 // 30 minutes
		});
		m2.subscribe(this);
		this.master.modelRepo.add(this.modelnames[1],m2);
		this.models[this.modelnames[1]] = m2;
		
		const m3 = new ObixModel({
			name:this.modelnames[2],
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L3/', // Power of L3
			access:'PUBLIC',
			cache_expiration_in_seconds:1800 // 30 minutes
		});
		m3.subscribe(this);
		this.master.modelRepo.add(this.modelnames[2],m3);
		this.models[this.modelnames[2]] = m3;
		
		const m4 = new ObixModel({
			name: this.modelnames[3],
			src:'/obixStore/store/Fingrid/emissionFactorForElectricityConsumedInFinland/',
			access:'PUBLIC',
			cache_expiration_in_seconds:1800 // 30 minutes
		});
		m4.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add(this.modelnames[3], m4);
		this.models[this.modelnames[3]] = m4;
		
		const m5 = new ObixModel({
			name: this.modelnames[4],
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_QE01/', // FI_H_H160_DH_QE01 = District heating Instantaneous power
			access:'PUBLIC',
			cache_expiration_in_seconds:1800 // 30 minutes
		});
		m5.subscribe(this);
		this.master.modelRepo.add(this.modelnames[4], m5);
		this.models[this.modelnames[4]] = m5;
		
		const m6 = new EntsoeModel({
			name: this.modelnames[5],
			src:'https://transparency.entsoe.eu/api',
			document_type:'A44',
			area_name:'Finland',
			cache_expiration_in_seconds:1800 // 30 minutes
		});
		m6.subscribe(this);
		this.master.modelRepo.add(this.modelnames[5], m6);
		this.models[this.modelnames[5]] = m6;
		
		const m7 = new ObixModel({
			name:this.modelnames[6],
			src:'/obixStore/store/VainoAuerinKatu13/control/optimization/',
			access:'PUBLIC',
			cache_expiration_in_seconds:1800 // 30 minutes
		});
		m7.subscribe(this);
		this.master.modelRepo.add(this.modelnames[6],m7);
		this.models[this.modelnames[6]] = m7;
		
		
		this.view = new MenuView(this);
		// NOTE: If View does NOT have ResizeEventObserver, we try to show it.
		// If view is listening to ResizeEventObserver, initial resize event will trigger "show()".
		if (typeof this.view.REO === 'undefined') {
			this.show(); // IF this controller is visible => show it.
		}
	}
}
