import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import ObixModel from '../common/ObixModel.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
	}
	/*
	NOTE: Menumodel is NEVER removed!
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key === 'MenuModel' || key === 'ProxesCleanerModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	*/
	init() {
		const model = new MenuModel({name:'MenuModel',src:'menu'});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		const m2 = new ObixModel({name:'ProxesCleanerModel',src:'',access:'PUBLIC'});
		m2.subscribe(this);
		this.master.modelRepo.add('ProxesCleanerModel',m2);
		this.models['ProxesCleanerModel'] = m2;
		
		this.view = new MenuView(this);
		
		//const m = new FingridModel({name:'FingridPowerSystemStateModel',src:'https://api.fingrid.fi/v1/variable/209/event/json'});
		//m.subscribe(this);
		//this.master.modelRepo.add('FingridPowerSystemStateModel',m);
		//this.models['FingridPowerSystemStateModel'] = m;
		
		// 180000
		//this.timers['MenuView'] = {timer: undefined, interval: 180000, models:['FingridPowerSystemStateModel']}; // once per 3 minutes.
		
		
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
