import Controller from '../common/Controller.js';
import LocationModel from './LocationModel.js';
import LocationView from './LocationView.js';

export default class LocationController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		const model = new LocationModel({name:'LocationModel',src:'./data/NUTS_LB_2021_3035.json'});
		model.subscribe(this);
		this.master.modelRepo.add('LocationModel',model);
		this.models['LocationModel'] = model;
		
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new LocationView(this);
	}
}
