import Controller from '../common/Controller.js';
import MainModel from  './MainModel.js';
import MainView from './MainView.js';

export default class MainController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		const model = new MainModel({name:'MainModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('MainModel',model);
		this.models['MainModel'] = model;
		
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new MainView(this);
	}
}
