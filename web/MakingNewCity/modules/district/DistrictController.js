import Controller from '../common/Controller.js';
import DistrictView from './DistrictView.js';

export default class DistrictController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		// No own models needed.
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictView(this);
	}
}
