import Controller from '../common/Controller.js';
import FarmModel from  './FarmModel.js';
import FarmView from './FarmView.js';

export default class FarmController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	notify(options) {
		console.log(['FarmController notify options=',options]);
		super.notify(options);
	}
	
	init() {
		const model = new FarmModel({name:'FarmModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('FarmModel',model);
		this.models['FarmModel'] = model;
		
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new FarmView(this);
	}
}
