import Controller from '../common/Controller.js';
import SolarModel from  './SolarModel.js';
import FooModel from  './FooModel.js';
import DistrictAAWrapperView from './DistrictAAWrapperView.js';

export default class DistrictAAController extends Controller {
	
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
		const smodel = new SolarModel();
		smodel.subscribe(this);
		//smodel.subscribe(this.master);
		this.master.modelRepo.add('SolarModel',smodel);
		this.models['SolarModel'] = smodel;
		smodel.fetch();
		
		const fmodel = new FooModel();
		fmodel.subscribe(this);
		//fmodel.subscribe(this.master);
		this.master.modelRepo.add('FooModel',fmodel);
		this.models['FooModel'] = fmodel;
		fmodel.fetch();
		
		this.timers['SolarChartView'] = {timer: undefined, interval: 10000, models:['SolarModel']};
		this.timers['FooChartView'] = {timer: undefined, interval: 10000, models:['FooModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictAAWrapperView(this);
		this.show();
	}
}
