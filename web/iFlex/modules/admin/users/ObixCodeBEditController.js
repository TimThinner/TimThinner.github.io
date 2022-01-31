import Controller from '../../common/Controller.js';
import ObixCodeBEditView from './ObixCodeBEditView.js';

export default class ObixCodeBEditController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		this.models = {};
	}
	
	initialize() {
		
		
		this.models['UserModel'] = this.master.modelRepo.get('UserModel');
		this.models['UserModel'].subscribe(this);
		
		this.models['UsersModel'] = this.master.modelRepo.get('UsersModel');
		this.models['UsersModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new ObixCodeBEditView(this);
	}
	
	clean() {
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
