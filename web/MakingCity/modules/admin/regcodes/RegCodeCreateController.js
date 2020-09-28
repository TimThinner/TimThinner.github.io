import Controller from '../../common/Controller.js';
import RegCodeCreateView from './RegCodeCreateView.js';

export default class RegCodeCreateController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		this.models = {}; 
	}
	
	initialize() {
		this.models['RegCodeModel'] = this.master.modelRepo.get('RegCodeModel');
		this.models['RegCodeModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new RegCodeCreateView(this);
	}
	
	clean() {
		console.log('RegCodeCreateController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
