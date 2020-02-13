import Controller from '../common/Controller.js';
import TotalModel from  './TotalModel.js';
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
		const model = new TotalModel({name:'TotalModel',src:'data/arina/iss/feeds.json?meterId=114&limit=1440'});
		model.subscribe(this);
		//model.subscribe(this.master);
		this.master.modelRepo.add('TotalModel',model);
		this.models['TotalModel'] = model;
		model.fetch();
		
		this.timers['TotalChartView'] = {timer: undefined, interval: 30000, models:['TotalModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictAAWrapperView(this);
		this.show();
	}
}
