import Controller from '../common/Controller.js';
import DModel from  './DModel.js';
import DView from './DView.js';
//import FeedbackModel from '../common/FeedbackModel.js';

export default class DController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove(); // NOTE: Controller super.remove() unsubscribes all this.models
		Object.keys(this.models).forEach(key => {
			if (key==='DModel') { //||key==='FeedbackModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	init() {
		const mname = 'DModel';
		const model = new DModel({name:mname,src:''});
		model.subscribe(this);
		this.master.modelRepo.add(mname,model);
		this.models[mname] = model;
		/*
		const model_Feedback = new FeedbackModel({name:'FeedbackModel',src:''});
		model_Feedback.subscribe(this);
		this.master.modelRepo.add('FeedbackModel',model_Feedback);
		this.models['FeedbackModel'] = model_Feedback;
		*/
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		//const m = new FingridModel({name:'FingridPowerSystemStateModel',src:'https://api.fingrid.fi/v1/variable/209/event/json'});
		//m.subscribe(this);
		//this.master.modelRepo.add('FingridPowerSystemStateModel',m);
		//this.models['FingridPowerSystemStateModel'] = m;
		
		// 180000
		//this.timers['MenuView'] = {timer: undefined, interval: 180000, models:['FingridPowerSystemStateModel']}; // once per 3 minutes.
		
		this.view = new DView(this);
		
		// At init() there is ALWAYS only one controller with visible=true, this controller.
		// and also the ResizeEventObserver is started at init() => this controller is shown 
		// TWICE in init() if this.show() is called here!!!
		
		//this.startPollers();
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		
		//this.show(); // Try if this view can be shown right now!
		/*
			NOTE: this.show() calls this.view.show(); and 
			this.startPollers(); but there are no timers defined, so no polling is actually performed.
		*/
	}
}
