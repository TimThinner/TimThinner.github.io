import ModelRepo from './modules/common/ModelRepo.js';
import ResizeObserverModel from './modules/common/ResizeObserverModel.js';
import MenuController from './modules/menu/MenuController.js';
import DistrictAController from './modules/districta/DistrictAController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		this.model = undefined;
	}
	
	restore() {
		console.log('MasterController restore!');
	}
	
	notify(options) {
		console.log(['MasterController NOTIFY: model=',options.model,' method=',options.method]);
	}
	
	init() {
		console.log('MasterController init!');
		
		this.model = new ResizeObserverModel();
		this.modelRepo.add('ResizeObserverModel',this.model);
		this.model.start();
		
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		this.controllers['menu'].restore();
		
		this.controllers['DA'] = new DistrictAController({name:'DA', master:this, el:'#content', visible:false});
		this.controllers['DA'].init();
		this.controllers['DA'].restore();
	}
}
new MasterController().init();
