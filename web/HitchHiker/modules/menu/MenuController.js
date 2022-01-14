import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	hide() {
		super.hide();
	}
	
	init() {
		const model = new MenuModel({name:'MenuModel',src:'menu'});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		this.view = new MenuView(this);
		//this.show(); // IF this controller is visible => show it... and start periodic timer with 10 s interval.
	}
}
