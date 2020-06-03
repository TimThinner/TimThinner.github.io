//import MenuModel from './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController {
	
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
		this.appDataModel.restore();
	}
	
	notify(options){
		if (options.model==='AppDataModel' && options.method==='restored') {
			this.show();
		}
	}
	
	init() {
		console.log('MenuController Init');
		this.view = new MenuView(this);
	}
}
