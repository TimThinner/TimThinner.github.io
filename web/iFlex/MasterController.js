import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';

import MenuController from './modules/menu/MenuController.js';
import AController from './modules/a/AController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		
		
	}
	
	notify(options) {
		console.log(['MasterController NOTIFY: model=',options.model,' method=',options.method]);
		
		
		
	}
	
	init() {
		console.log('MasterController init!');
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		
		console.log('Create Controllers...');
		// Menu controller MUST be first!
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		
		this.controllers['A'] = new AController({name:'A', master:this, el:'#content', visible:false});
		this.controllers['A'].init();
		
		
		
		
		
		
		
		REO.start(); // Start tracking resize events => will also do the initial "resize" for MenuView (View which is visible).
	}
}
new MasterController().init();
