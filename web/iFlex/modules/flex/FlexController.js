import Controller from '../common/Controller.js';
import FlexView from './FlexView.js';

export default class AController extends Controller {
	
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
		this.models['EntsoeEnergyPriceModel'] = this.master.modelRepo.get('EntsoeEnergyPriceModel');
		this.models['EntsoeEnergyPriceModel'].subscribe(this);
		this.models['MenuBuildingElectricityPL1Model'] = this.master.modelRepo.get('MenuBuildingElectricityPL1Model');
		this.models['MenuBuildingElectricityPL1Model'].subscribe(this);
		this.models['MenuBuildingElectricityPL2Model'] = this.master.modelRepo.get('MenuBuildingElectricityPL2Model');
		this.models['MenuBuildingElectricityPL2Model'].subscribe(this);
		this.models['MenuBuildingElectricityPL3Model'] = this.master.modelRepo.get('MenuBuildingElectricityPL3Model');
		this.models['MenuBuildingElectricityPL3Model'].subscribe(this);
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new FlexView(this);
	}
}
