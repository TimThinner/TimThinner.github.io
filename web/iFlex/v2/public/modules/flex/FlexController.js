import Controller from '../common/Controller.js';
import EntsoeModel from '../common/EntsoeModel.js';
import ObixModel from  '../common/ObixModel.js';
import FlexView from './FlexView.js';

export default class FlexController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 1800; // 1800 = 30 x 60 Twice per hour 
		
		// These models listed below are created at MenuController.
		// We can use same models here.
		this.modelnames = [
			'FlexResultModel',
			'MenuBuildingElectricityPL1Model',
			'MenuBuildingElectricityPL2Model',
			'MenuBuildingElectricityPL3Model',
			'MenuEmissionFactorForElectricityConsumedInFinlandModel',
			'MenuBuildingHeatingQE01Model',
			'EntsoeEnergyPriceModel',
			'OptimizationModel'
		];
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
		this.modelnames.forEach(name => {
			this.models[name] = this.master.modelRepo.get(name);
			this.models[name].subscribe(this);
		});
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new FlexView(this);
	}
}
