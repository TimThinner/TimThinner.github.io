import Controller from '../common/Controller.js';
import AModel from  './AModel.js';
import AView from './AView.js';

export default class AController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		const model = new AModel({name:'AModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('AModel',model);
		this.models['AModel'] = model;
		
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		
		//const m = new FingridModel({name:'FingridPowerSystemStateModel',src:'https://api.fingrid.fi/v1/variable/209/event/json'});
		//m.subscribe(this);
		//this.master.modelRepo.add('FingridPowerSystemStateModel',m);
		//this.models['FingridPowerSystemStateModel'] = m;
		
		// 180000
		//this.timers['MenuView'] = {timer: undefined, interval: 180000, models:['FingridPowerSystemStateModel']}; // once per 3 minutes.
		
		this.view = new AView(this);
		
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
