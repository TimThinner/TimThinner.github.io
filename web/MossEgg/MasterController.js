import ModelRepo from './modules/ModelRepo.js';
import ResizeEventObserver from './modules/ResizeEventObserver.js';
import EggController from './modules/EggController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
	}
	notify(options) {
		console.log('MasterController notify!');
	}
	init() {
		console.log('MasterController init!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		REO.start(); // Start tracking resize events
		this.controllers['EGG'] = new EggController({name:'EGG', master:this, el:'#content', visible:true});
		this.controllers['EGG'].init();
	}
}
new MasterController().init();
