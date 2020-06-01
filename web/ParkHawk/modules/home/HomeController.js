import HomeModel from './HomeModel.js';
import HomeView from './HomeView.js';

export default class HomeController {
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.el      = options.el;
		this.visible = options.visible;
		this.targets = options.targets;
		
		this.models = {};
		this.view      = undefined;
		this.menuModel = undefined;
	}
	
	remove() {
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
	
	show() {
		if (this.visible && this.view) {
			this.view.show();
		}
	}
	
	hide() {
		if (this.view) {
			this.view.hide();
		}
	}
	
	restore() {
		Object.keys(this.models).forEach(key => {
			if (key === 'HomeModel') {
				this.models[key].restore();
			}
		});
	}
	
	notify(options) {
		if (options.model==='MenuModel' && options.method==='selected') {
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
		} else if (options.model==='HomeModel' && options.method==='selected') {
			//console.log('HomeModel selected .. no action!');
			// Switch to Map...
			
			
			
		}
	}
	
	init() {
		const model = new HomeModel(this.targets);
		model.subscribe(this);
		this.master.modelRepo.add('HomeModel',model);
		this.models['HomeModel'] = model;
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new HomeView(this);
	}
}
