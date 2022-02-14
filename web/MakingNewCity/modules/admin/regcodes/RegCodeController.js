import Controller from '../../common/Controller.js';
//import RegCodeModel from  './RegCodeModel.js';
import RegCodeView from './RegCodeView.js';

export default class RegCodeController extends Controller {
	
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
		this.models = {};
	}
	
	initialize() {
		// RegCodeModel is now created at UsersController.
		this.models['RegCodeModel'] = this.master.modelRepo.get('RegCodeModel');
		this.models['RegCodeModel'].subscribe(this);
		/*
		const model = new RegCodeModel({name:'RegCodeModel',src:'to-be-added-in-the-future'});
		model.subscribe(this);
		this.master.modelRepo.add('RegCodeModel',model);
		this.models['RegCodeModel'] = model;
		*/
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new RegCodeView(this);
	}
	
	clean() {
		console.log('RegCodeController is now REALLY cleaned!');
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
		// AND in this.remove finally all models created here is removed.
		// So we need to do init() almost in its entirety again ... timers are NOT deleted in remove, 
		// so there is no need to redefine them.
		this.initialize();
	}
	
	init() {
		this.initialize();
		//this.timers['RegCodeModel'] = {timer: undefined, interval: -1, models:['RegCodeModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
