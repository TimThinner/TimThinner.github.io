import Controller from '../common/Controller.js';
import TotalModel from  './TotalModel.js';
import DistrictAAWrapperView from './DistrictAAWrapperView.js';

export default class DistrictAAController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	init() {
		const model = new TotalModel({name:'TotalModel',src:'data/arina/iss/feeds.json?meterId=114'});
		model.subscribe(this);
		this.master.modelRepo.add('TotalModel',model);
		this.models['TotalModel'] = model;
		
		setTimeout(() => { model.fetch(); }, 200);
		
		this.timers['TotalChartView'] = {timer: undefined, interval: 30000, models:['TotalModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAAWrapperView(this);
		this.show();
	}
}
