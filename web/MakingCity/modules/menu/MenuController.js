import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import { FingridPowerSystemStateModel } from  '../energydata/FingridModels.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	
	
	
	init() {
		const model = new MenuModel({name:'MenuModel',src:'menu'});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		const m = new FingridPowerSystemStateModel({name:'FingridPowerSystemStateModel',src:'https://api.fingrid.fi/v1/variable/209/event/json'});
		m.subscribe(this);
		this.master.modelRepo.add('FingridPowerSystemStateModel',m);
		this.models['FingridPowerSystemStateModel'] = m;
		
		// 180000
		this.timers['MenuView'] = {timer: undefined, interval: 180000, models:['FingridPowerSystemStateModel']}; // once per 3 minutes.
		
		this.view = new MenuView(this);
		
		// At init() there is ALWAYS only one controller with visible=true, this controller.
		// and also the ResizeEventObserver is started at init() => this controller is shown 
		// TWICE in init() if this.show() is called here!!!
		
		
		
		this.startPollers();
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
