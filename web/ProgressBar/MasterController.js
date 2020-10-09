import ModelRepo from './modules/ModelRepo.js';
import ResizeEventObserver from './modules/ResizeEventObserver.js';
import Controller from './modules/Controller.js';

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
		this.controllers['PROG'] = new Controller({name:'PROG', master:this, el:'#content', visible:true});
		this.controllers['PROG'].init();
		this.controllers['PROG'].show();
	}
}
new MasterController().init();
