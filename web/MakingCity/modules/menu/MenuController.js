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
		//model.subscribe(this.master);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		model.fetch();
		
		//this.timers['MenuView'] = {timer: undefined, interval: 10000, models:['MenuModel']};
		
		this.view = new MenuView(this);
		
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
