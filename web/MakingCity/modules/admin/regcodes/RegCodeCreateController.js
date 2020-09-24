import Controller from '../../common/Controller.js';
import RegCodeCreateView from './RegCodeCreateView.js';

export default class RegCodeCreateController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		this.models['RegCodeModel'] = this.master.modelRepo.get('RegCodeModel');
		this.models['RegCodeModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new RegCodeCreateView(this);
	}
}
