import Controller from '../common/Controller.js';
import GeothermalModel from  './GeothermalModel.js';
import DistrictAIWrapperView from './DistrictAIWrapperView.js';

export default class DistrictAIController extends Controller {
	
	constructor(options) {
		super(options);
		this.menuModel = undefined;
	}
	
	remove() {
		super.remove();
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
	}
	
	init() {
		const model = new GeothermalModel({name:'GeothermalModel',src:'data/arina/iss/feeds.json?meterId=115&limit=1440'});
		model.subscribe(this);
		//model.subscribe(this.master);
		this.master.modelRepo.add('GeothermalModel',model);
		this.models['GeothermalModel'] = model;
		
		setTimeout(() => { model.fetch(); }, 1700);
		
		this.timers['GeothermalChartView'] = {timer: undefined, interval: 30000, models:['GeothermalModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictAIWrapperView(this);
		this.show();
	}
}
