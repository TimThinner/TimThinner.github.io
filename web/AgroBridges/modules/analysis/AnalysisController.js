import Controller from '../common/Controller.js';
import AnalysisView from './AnalysisView.js';

export default class AnalysisController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new AnalysisView(this);
	}
}
