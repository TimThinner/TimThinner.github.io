import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super();
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		this.models  = {};
		//this.timers  = {};
		this.view    = undefined;
	}
	
	/*
		NOTE: remove is not called because there is no LOGIN, LOGOUT.
		But it is defined here just in case this implementation includes 
		authentication.
	*/
	remove() {
		super.remove(); // Handles the timer stuff.
		
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
			this.models[key].unsubscribe(this.master);
		});
	}
	
	show() {
		if (this.visible && this.view) {
			this.view.show();
			this.poller('MenuModel'); // Start the timer poller
		}
	}
	
	hide() {
		super.hide(); // Handles the timer stuff.
		if (this.view) {
			this.view.hide();
		}
	}
	
	notify(options) {
		if (options.model==='MenuModel' && options.method==='selected') {
			//console.log(['Selected = ',options.selected]);
			if (this.name === options.selected) {
				setTimeout(() => {
					this.visible = true;
					this.restore();
					this.show();
				}, 100);
			} else {
				this.visible = false;
				this.hide();
			}
		}
	}
	
	restore() {
		console.log('MenuController restore');
	}
	
	init() {
		const model = new MenuModel();
		model.subscribe(this);
		model.subscribe(this.master);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		this.timers['MenuModel'] = {timer: undefined, interval: 10000};
		
		model.fetch();
		
		//setTimeout(() => model.fetch(), 2000);
		
		this.view = new MenuView(this);
		
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
