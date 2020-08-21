import UserModel from '../user/UserModel.js';
import MenuModel from './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController {
	
	constructor(options) {
		this.name      = options.name;
		this.master    = options.master;
		this.el        = options.el;
		this.visible   = options.visible;
		this.menuitems = options.menuitems;
		
		this.menuModel = undefined;
		this.view      = undefined;
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
	}
	
	hide() {
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		if (this.visible) {
			if (this.view) {
				this.view.render();
			}
		}
	}
	
	notify(options){
		//console.log(['MenuController NOTIFY: model=',options.model,' method=',options.method, 'NO ACTIONS']);
	}
	
	getActiveTab() {
		return this.menuModel.activeTab;
	}
	
	restore() {
		const um = this.master.modelRepo.get('UserModel');
		if (um) {
			this.menuModel.restore(um.id);
		} else {
			this.menuModel.restore();
		}
	}
	
	init() {
		// MenuModel is created here. It is a "persistent" model, which means 
		// it is never deleted. MenuController and MenuView are always visible.
		this.menuModel = new MenuModel(this.menuitems);
		this.master.modelRepo.add('MenuModel',this.menuModel);
		this.view = new MenuView(this);
	}
}
