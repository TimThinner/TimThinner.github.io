import PeriodicPoller from '../common/PeriodicPoller.js';
import HomeModel from './HomeModel.js';
import HomeView from './HomeView.js';

export default class HomeController extends PeriodicPoller {
	
	constructor(options) {
		super();
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.models    = {};
		this.view      = undefined;
		this.menuModel = undefined;
	}
	
	remove() {
		super.remove();
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
	}
	
	hide() {
		super.hide();
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		console.log('HomeView Show!!');
		if (this.visible && this.view) {
			this.view.show();
			this.startPollers(); // Start polling all timers for THIS CONTROLLER
		}
	}
	
	restore() {
		console.log('HomeController restore');
		
		
	}
	
	notify(options) {
		if (options.model==='MenuModel' && options.method==='restore') {
			
			console.log(['Restore Open tab ',options.tab]);
			if (this.name === options.tab) {
				setTimeout(() => {
					this.visible = true;
					this.restore();
					this.show();
				}, 100);
			} else {
				this.visible = false;
				this.hide();
			}
			
		} else if (options.model==='MenuModel' && options.method==='selected') {
			
			console.log(['Open tab ',options.tab]);
			if (this.name === options.tab) {
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
	
	init() {
		const model = new HomeModel({name:'HomeModel',src:'placeholder'});
		model.subscribe(this);
		this.master.modelRepo.add('HomeModel',model);
		this.models['HomeModel'] = model;
		
		this.timers['HomeView'] = {timer: undefined, interval: -1, models:['HomeModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new HomeView(this);
		//this.show(); // Try if this view can be shown right now!
	}
}
