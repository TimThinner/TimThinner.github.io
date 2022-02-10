import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import LanguageModel from './modules/common/LanguageModel.js';
import UserModel from './modules/user/UserModel.js';
import ProxyCleanerModel from './modules/common/ProxyCleanerModel.js';
import MenuController from './modules/menu/MenuController.js';
import DistrictController from './modules/district/DistrictController.js';
import UserPageController from './modules/userpage/UserPageController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
	}
	
	notify(options) {
		// Nothing to do here, but this is mandatory if we have subscribed to any model.
	}
	
	init() {
		console.log('MasterController init v2022.02.09.B');
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		REO.start(); // Start tracking resize events
		
		console.log('Create LanguageModel!');
		const LM = new LanguageModel();
		this.modelRepo.add('LanguageModel',LM);
		
		console.log('Create UserModel!');
		const UM = new UserModel({name:'UserModel',src:'user'});
		UM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.modelRepo.add('UserModel',UM);
		UM.restore(); // Try to restore previous "session" stored into LocalStorage.
		
		const PCM = new ProxyCleanerModel({name:'ProxyCleanerModel',src:''});
		this.modelRepo.add('ProxyCleanerModel',PCM);
		PCM.fetch(); // Just call PCM.fetch() anytime to clean the proxy cache!
		
		console.log('Create Controllers...');
		// Menu controller MUST be first!
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		
		this.controllers['district'] = new DistrictController({name:'district', master:this, el:'#content', visible:false});
		this.controllers['district'].init();
		
		this.controllers['userpage'] = new UserPageController({name:'userpage', master:this, el:'#content', visible:false});
		this.controllers['userpage'].init();
		
		console.log('ALL Controllers are now created!');
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
