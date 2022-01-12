import Controller from '../common/Controller.js';
import PeriodicTimeoutObserver from '../common/PeriodicTimeoutObserver.js';
import MenuModel from  './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
		this.PTO = undefined;
	}
	
	remove() {
		if (this.PTO) {
			this.PTO.stop();
		}
		super.remove();
	}
	
	hide() {
		if (this.PTO) {
			this.PTO.stop();
		}
		super.hide();
	}
	
	show() {
		if (this.PTO) {
			this.PTO.start();
		}
		super.show();
	}
	
	init() {
		const model = new MenuModel({name:'MenuModel',src:'menu'});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		console.log('Create PeriodicTimeoutObserver!');
		this.PTO = new PeriodicTimeoutObserver({interval:10000}); // interval 10 seconds
		this.view = new MenuView(this);
	}
}
