import MenuModel from './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController {
	
	constructor(options) {
		this.name      = options.name;
		this.master    = options.master;
		this.el        = options.el;
		this.visible   = options.visible;
		this.menuitems = options.menuitems;
		
		this.view      = undefined;
		this.menuModel = undefined;
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		this.menuModel.unsubscribe(this);
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
		this.menuModel.restore();
	}
	
	notify(options){
		if (options.model==='MenuModel' && options.method==='restored') {
			this.show();
		}
	}
	
	init() {
		this.menuModel = new MenuModel(this.menuitems);
		this.menuModel.subscribe(this);
		this.master.modelRepo.add('MenuModel',this.menuModel);
		this.view = new MenuView(this);
	}
}
