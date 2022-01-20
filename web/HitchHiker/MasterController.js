import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import LanguageModel from './modules/common/LanguageModel.js';
import MenuController from './modules/menu/MenuController.js';
import GalaxyController from './modules/galaxy/GalaxyController.js';
/*
EventObserver	Model					ConfigurationModel
										MenuModel
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
	}
	
	init() {
		console.log('MasterController init! Version 22.01.20A');
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		
		// Start tracking resize events => will also notify initial "resize" (with small delay) 
		// for MenuView (View which is visible after delay timeout).
		REO.start();
		
		console.log('Create LanguageModel!');
		const LM = new LanguageModel();
		this.modelRepo.add('LanguageModel',LM);
		
		console.log('Create Controllers...');
		// Menu controller MUST be first!
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		
		this.controllers['galaxy'] = new GalaxyController({name:'galaxy', master:this, el:'#content', visible:false});
		this.controllers['galaxy'].init();
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
