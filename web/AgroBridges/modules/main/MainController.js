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
		this.view = new MainView(this);
	}
}
