import Controller from '../common/Controller.js';
import SolarModel from  './SolarModel.js';
import DistrictABWrapperView from './DistrictABWrapperView.js';

export default class DistrictABController extends Controller {
	
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
		const model = new SolarModel({name:'SolarModel',src:'data/arina/iss/feeds.json?meterId=116&limit=1440'});
		model.subscribe(this);
		//model.subscribe(this.master);
		this.master.modelRepo.add('SolarModel',model);
		this.models['SolarModel'] = model;
		model.fetch();
		
		this.timers['SolarChartView'] = {timer: undefined, interval: 30000, models:['SolarModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictABWrapperView(this);
		this.show();
	}
}
