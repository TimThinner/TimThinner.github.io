import Controller from '../../common/Controller.js';
import FeedbacksModel from  './FeedbacksModel.js';
import FeedbacksView from './FeedbacksView.js';

export default class FeedbacksController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		
		Object.keys(this.models).forEach(key => {
			if (key === 'FeedbacksModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
	}
	
	clean() {
		console.log('FeedbacksController is now REALLY cleaned!');
		this.remove();
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		this.init();
	}
	
	
	init() {
		const model = new FeedbacksModel({name:'FeedbacksModel',src:'to-be-added-in-the-future'});
		model.subscribe(this);
		this.master.modelRepo.add('FeedbacksModel',model);
		this.models['FeedbacksModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new FeedbacksView(this);
	}
}
