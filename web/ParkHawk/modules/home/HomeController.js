//import HomeModel from './HomeModel.js';
import HomeView from './HomeView.js';
export default class HomeController {
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.el      = options.el;
		this.visible = options.visible;
		
		this.appDataModel = this.master.modelRepo.get('AppDataModel');
		this.appDataModel.subscribe(this);
		
		this.view = undefined;
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		this.appDataModel.unsubscribe(this);
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
		
	}
	
	notify(options) {
		if (options.model==='AppDataModel' && (options.method==='tabselected' || options.method==='restored')) {
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
		console.log('HomeController Init');
		this.view = new HomeView(this);
	}
}
