import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import UserModel from './modules/user/UserModel.js';

import MenuController from './modules/menu/MenuController.js';
import MainController from './modules/main/MainController.js';
import FarmController from './modules/farm/FarmController.js';
import LocationController from './modules/location/LocationController.js';
/*
EventObserver	Model					MenuModel
				ResizeEventObserver		
				PeriodicTimeoutObserver	
ModelRepo		
Controller		MenuController
View			MenuView
*/
class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
	}
	
	notify(options) {
		console.log(['MasterController notify options=',options]);
		
		if (options.model==='UserModel' && options.method==='logout') {
			
			console.log('MasterController USER LOGOUT!');
			const mm = this.modelRepo.get('MenuModel');
			if (mm) {
				mm.setSelected('menu');
			}
			/*
				cleaning removes all user specific data from app. 
				Default implementation does nothing.
			*/
			Object.keys(this.controllers).forEach(key => {
				this.controllers[key].clean();
			});
			
		} else if (options.model==='UserModel' && options.method==='login') {
			console.log('MasterController LOGIN !!!!');
		}
	}
	
	
	
	init() {
		console.log('MasterController init! Version 22.03.31-A');
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		
		console.log('Create UserModel!');
		const UM = new UserModel({name:'UserModel'});
		UM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.modelRepo.add('UserModel',UM);
		UM.restore(); // Try to restore previous "session" stored into LocalStorage.
		
		// Start tracking resize events => will also notify initial "resize" (with small delay) 
		// for MenuView (View which is visible after delay timeout).
		REO.start();
		
		console.log('Create Controllers...');
		// - MENU
		// - MAIN
		//   - Farm
		//     - Location
		//     - Info
		//     - Vegetables
		//     - Animals
		//     - Fruits
		//   - Activities
		//   - Producer
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		this.controllers['main'] = new MainController({name:'main', master:this, el:'#content', visible:false});
		this.controllers['main'].init();
		
		this.controllers['farm'] = new FarmController({name:'farm', master:this, el:'#content', visible:false});
		this.controllers['farm'].init();
		this.controllers['location'] = new LocationController({name:'location', master:this, el:'#content', visible:false});
		this.controllers['location'].init();
	}
	
	forceLogout() {
		console.log('MasterController FORCE LOGOUT');
		const UM = this.modelRepo.get('UserModel');
		if (UM) {
			UM.logout(); // which will do the reset(), store() and finally send 'logout' notification.
		}
	}
}
new MasterController().init();
