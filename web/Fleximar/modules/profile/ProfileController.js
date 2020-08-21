import UserModel from '../user/UserModel.js';
//import ProfileModel from './ProfileModel.js';
import ProfileView from './ProfileView.js';

export default class ProfileController {
	
	constructor(options) {
		this.name      = options.name;
		this.master    = options.master;
		this.el        = options.el;
		this.visible   = options.visible;
		this.view      = undefined;
		
		// No ProfileModel, View uses UserModel, which is created in MasterController.
		// MenuModel is created in MenuController. 
		this.menuModel = undefined;
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
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
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		
		this.view = new ProfileView(this);
	}
}
