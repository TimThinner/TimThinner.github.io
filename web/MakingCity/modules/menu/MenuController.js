import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
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
		
		//this.timers['MenuView'] = {timer: undefined, interval: 10000, models:['MenuModel']};
		
		this.view = new MenuView(this);
		
		// At init() there is ALWAYS only one controller with visible=true, this controller.
		// and also the ResizeObserverModel is started at init() => this controller is shown 
		// TWICE in init() if this.show() is called here!!!
		
		
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
