import Controller from '../../common/Controller.js';
import ReadKeyEditView from './ReadKeyEditView.js';

export default class ReadKeyEditController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		this.models = {};
	}
	
	initialize() {
		this.models['ReadKeyModel'] = this.master.modelRepo.get('ReadKeyModel');
		this.models['ReadKeyModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new ReadKeyEditView(this);
	}
	
	clean() {
		console.log('ReadKeyEditController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
