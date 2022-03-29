import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import MenuController from './modules/menu/MenuController.js';
import MainController from './modules/main/MainController.js';
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
	}
	
	init() {
		console.log('MasterController init! Version 22.03.29-G');
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		
		// Start tracking resize events => will also notify initial "resize" (with small delay) 
		// for MenuView (View which is visible after delay timeout).
		REO.start();
		
		console.log('Create Controllers...');
		
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		this.controllers['main'] = new MainController({name:'main', master:this, el:'#content', visible:false});
		this.controllers['main'].init();
	}
}
new MasterController().init();
