import UserModel from '../user/UserModel.js';
import AView from './AView.js';

export default class AController {
	
	constructor(options) {
		this.name      = options.name;
		this.master    = options.master;
		this.el        = options.el;
		this.visible   = options.visible;
		
		// No AModel, View uses UserModel, which is created in MasterController.
		// MenuModel is created in MenuController. 
		this.models = {};
		this.view   = undefined;
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		Object.keys(this.models).forEach(key => {
			//if (key === 'OwnCreatedHereModel') {
			//	this.master.modelRepo.remove(key);
			//}
			this.models[key].unsubscribe(this);
		});
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
	
	activate(tab) {
		if (this.name === tab) {
			setTimeout(() => {
				console.log(['Open tab ',tab]);
				this.visible = true;
				this.show();
			}, 100);
		} else {
			this.visible = false;
			this.hide();
		}
	}
	
	notify(options){
			
		if (options.model==='MenuModel' && options.method==='restored') {
			this.activate(options.tab);
			
		} else if (options.model==='MenuModel' && options.method==='selected') {
			this.activate(options.tab);
		}
	}
	
	init() {
		const menuModel = this.master.modelRepo.get('MenuModel');
		if (menuModel) {
			menuModel.subscribe(this);
			this.models['MenuModel'] = menuModel;
		}
		
		this.view = new AView(this);
	}
}
