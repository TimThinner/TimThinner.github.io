import Controller from '../common/Controller.js';
import GeothermalModel from  './GeothermalModel.js';
import DistrictAIWrapperView from './DistrictAIWrapperView.js';

export default class DistrictAIController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	refreshTimerange() {
		const timerName = 'GeothermalChartView';
		super.doPollingInterval(timerName);
	}
	
	init() {
		const model = new GeothermalModel({name:'GeothermalModel',src:'data/arina/iss/feeds.json?calc=1&meterId=115'});
		model.subscribe(this);
		this.master.modelRepo.add('GeothermalModel',model);
		this.models['GeothermalModel'] = model;
		
		setTimeout(() => { model.fetch(); }, 1700);
		
		this.timers['GeothermalChartView'] = {timer: undefined, interval: 30000, models:['GeothermalModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAIWrapperView(this);
		this.show();
	}
}
