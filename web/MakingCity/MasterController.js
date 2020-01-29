import ModelRepo from './modules/common/ModelRepo.js';
import ResizeObserverModel from './modules/common/ResizeObserverModel.js';
import LanguageModel from './modules/common/LanguageModel.js';

import MenuController from './modules/menu/MenuController.js';
import DistrictAController from './modules/districta/DistrictAController.js';
import DistrictAAController from './modules/districtaa/DistrictAAController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		this.model = undefined;
		this.languageModel = undefined;
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
		this.model.start(); // Start tracking resize events
		
		this.languageModel = new LanguageModel();
		this.modelRepo.add('LanguageModel',this.languageModel);
		
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		//this.controllers['menu'].restore();
		
		this.controllers['DA'] = new DistrictAController({name:'DA', master:this, el:'#content', visible:false});
		this.controllers['DA'].init();
		//this.controllers['DA'].restore();
		
		this.controllers['DAA'] = new DistrictAAController({name:'DAA', master:this, el:'#content', visible:false});
		this.controllers['DAA'].init();
		//this.controllers['DAA'].restore();
	}
}
new MasterController().init();
