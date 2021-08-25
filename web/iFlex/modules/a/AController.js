import Controller from '../common/Controller.js';
import AModel from  './AModel.js';
import AView from './AView.js';

export default class AController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='AModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		
		const AM = new AModel({name:'AModel',src:''});
		AM.subscribe(this);
		this.master.modelRepo.add('AModel',AM);
		this.models['AModel'] = AM;
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new AView(this);
	}
	
	init() {
		this.initialize();
		
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
