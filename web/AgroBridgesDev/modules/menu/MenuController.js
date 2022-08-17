/*import Controller from '../common/Controller.js';
import MainModel from  './MainModel.js';
import MainView from './MainView.js';

export default class MainController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	notify(options) {
		console.log(['MainController notify options=',options]);
		super.notify(options);
	}
	
	init() {
		const model = new MainModel({name:'MainModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('MainModel',model);
		this.models['MainModel'] = model;
		
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new MainView(this);
	}
}
*/

import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		const model = new MenuModel({name:'MenuModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		this.view = new MenuView(this);
		
		// NOTE: If View does NOT have ResizeEventObserver, we try to show it.
		// If view is listening to ResizeEventObserver, initial resize event will trigger "show()".
		if (typeof this.view.REO === 'undefined') {
			this.show(); // IF this controller is visible => show it...
		}
	}
}
