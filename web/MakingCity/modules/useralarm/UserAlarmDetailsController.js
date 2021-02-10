import Controller from '../common/Controller.js';
import UserAlarmDetailsWrapperView from './UserAlarmDetailsWrapperView.js';

export default class UserAlarmDetailsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		this.models = {}; 
	}
	
	initialize() {
		this.models['UserAlarmModel'] = this.master.modelRepo.get('UserAlarmModel');
		this.models['UserAlarmModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserAlarmDetailsWrapperView(this);
	}
	
	clean() {
		console.log('UserAlarmDetailsController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
