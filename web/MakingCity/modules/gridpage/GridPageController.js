import Controller from '../common/Controller.js';
import GridPageView from './GridPageView.js';
import { FingridElectricityProductionFinlandModel, FingridElectricityConsumptionFinlandModel, FingridNuclearPowerProductionFinlandModel } from  '../fingrid/FingridModels.js';

export default class GridPageController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		Object.keys(this.models).forEach(key => {
			if (key === 'FingridElectricityProductionFinlandModel' || 
				key === 'FingridElectricityConsumptionFinlandModel' || 
				key === 'FingridNuclearPowerProductionFinlandModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		const m = new FingridElectricityProductionFinlandModel({name:'FingridElectricityProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/192/event/json'});
		m.subscribe(this);
		this.master.modelRepo.add('FingridElectricityProductionFinlandModel',m);
		this.models['FingridElectricityProductionFinlandModel'] = m;
		
		const m2 = new FingridElectricityConsumptionFinlandModel({name:'FingridElectricityConsumptionFinlandModel',src:'https://api.fingrid.fi/v1/variable/193/event/json'});
		m2.subscribe(this);
		this.master.modelRepo.add('FingridElectricityConsumptionFinlandModel',m2);
		this.models['FingridElectricityConsumptionFinlandModel'] = m2;
		
		const m3 = new FingridNuclearPowerProductionFinlandModel({name:'FingridNuclearPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/188/event/json'});
		m3.subscribe(this);
		this.master.modelRepo.add('FingridNuclearPowerProductionFinlandModel',m3);
		this.models['FingridNuclearPowerProductionFinlandModel'] = m3;
		
		this.models['FingridPowerSystemStateModel'] = this.master.modelRepo.get('FingridPowerSystemStateModel');
		this.models['FingridPowerSystemStateModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.timers['GridPageChartView'] = {timer: undefined, interval: 180000, 
			models:[
				'FingridPowerSystemStateModel',
				'FingridElectricityProductionFinlandModel',
				'FingridElectricityConsumptionFinlandModel',
				'FingridNuclearPowerProductionFinlandModel'
			]};
		this.view = new GridPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
