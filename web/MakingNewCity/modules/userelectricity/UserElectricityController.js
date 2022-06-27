import Controller from '../common/Controller.js';
import UserElectricityModel from './UserElectricityModel.js';
import UserElectricityView from './UserElectricityView.js';

export default class UserElectricityController extends Controller {
	
	constructor(options) {
		super(options);
		// NOTE: Put one extra day, because days consumption is always 
		// calculated by subtracting previous days total from "todays" total.
		//this.numOfDays = 31;
		this.numOfDays = 30;
	}
	
	remove() {
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		super.remove();
		// We must remove all models that were created here at the init-method.
		// NOTE: UserElectricity0Model (todays electricity) is created at UserPageController.
		for (let i=1; i<this.numOfDays; i++) {
			const key = 'UserElectricity'+i+'Model';
			console.log(['remove ',key,' from the REPO']);
			this.master.modelRepo.remove(key);
		}
		this.models = {};
	}
	
	clean() {
		console.log('UserElectricityController is now REALLY cleaned!');
		this.remove();
		this.init();
	}
	
	init() {
		// NOTE: Range is created dynamically at each fetching cycle.
		// NOTE: 'UserElectricity0Model' is already created at UserPageController
		this.models['UserElectricity0Model'] = this.master.modelRepo.get('UserElectricity0Model');
		this.models['UserElectricity0Model'].subscribe(this);
		
		const model_data = [];
		for (let i=1; i<this.numOfDays; i++) {
			model_data.push({name:'UserElectricity'+i+'Model',index:i});
		}
		model_data.forEach(md => {
			const m = new UserElectricityModel({
				name: md.name,
				//src: 'data/sivakka/apartments/feeds.json',
				src: 'data/sivakka/house_energy_data/feeds.json',
				limit: 0,
				index: md.index
			});
			m.subscribe(this);
			this.master.modelRepo.add(md.name, m);
			this.models[md.name] = m;
		});
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		//this.view = new UserElectricityView(this);
		//this.view = new NewUserElectricityView(this);
		this.view = new UserElectricityView(this);
	}
}
