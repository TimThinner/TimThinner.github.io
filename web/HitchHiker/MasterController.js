import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		
		
	}
	
	notify(options) {
		console.log(['MasterController notify options=',options]);
	}
	
	init() {
		console.log('MasterController init!');
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		REO.start(); // Start tracking resize events => will also do the initial "resize" for MenuView (View which is visible).
	}
	
	forceLogout() {
		console.log('MasterController FORCE LOGOUT');
		/*
		const UM = this.modelRepo.get('UserModel');
		if (UM) {
			UM.logout(); // which will do the reset(), store() and finally send 'logout' notification.
		}*/
	}
}
new MasterController().init();
