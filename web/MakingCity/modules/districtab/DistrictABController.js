import Controller from '../common/Controller.js';
import SolarModel from  './SolarModel.js';
import DistrictABWrapperView from './DistrictABWrapperView.js';

export default class DistrictABController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	init() {
		const model = new SolarModel({name:'SolarModel',src:'data/arina/iss/feeds.json?meterId=116'});
		model.subscribe(this);
		
		this.master.modelRepo.add('SolarModel',model);
		this.models['SolarModel'] = model;
		
		setTimeout(() => { model.fetch(); }, 300);
		
		this.timers['SolarChartView'] = {timer: undefined, interval: 30000, models:['SolarModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictABWrapperView(this);
		this.show();
	}
}
