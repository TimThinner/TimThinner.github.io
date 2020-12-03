import Controller from '../../common/Controller.js';
import UserElectricityTargetsView from './UserElectricityTargetsView.js';

export default class UserElectricityTargetsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		this.models = {};
	}
	
	initialize() {
		/*
		NOTE: Every Controller must subscribe for "MenuModel" notifications.
		After that all view changes are driven by code in BASE CLASS Controller notify(options)
		*/
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		this.view = new UserElectricityTargetsView(this);
	}
	
	clean() {
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
