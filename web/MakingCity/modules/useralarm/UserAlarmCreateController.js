import Controller from '../common/Controller.js';
import UserAlarmCreateView from './UserAlarmCreateView.js';

export default class UserAlarmCreateController extends Controller {
	
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
		
		this.view = new UserAlarmCreateView(this);
	}
	
	clean() {
		console.log('UserAlarmCreateController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
