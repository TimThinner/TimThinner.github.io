import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';

import UserModel from './modules/user/UserModel.js';

import MenuController from './modules/menu/MenuController.js';
import UserLoginController from './modules/user/UserLoginController.js';
import UserSignupController from './modules/user/UserSignupController.js';
import UserPageController from './modules/userpage/UserPageController.js';


import UserHeatingController from './modules/userheating/UserHeatingController.js';
import UserFeedbackController from './modules/userfeedback/UserFeedbackController.js';

import AController from './modules/a/AController.js';
import BController from './modules/b/BController.js';
import CController from './modules/c/CController.js';
import DController from './modules/d/DController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		
		
	}
	
	notify(options) {
		console.log(['MasterController NOTIFY: model=',options.model,' method=',options.method]);
		
		if (options.model==='UserModel' && options.method==='before-logout') {
			
			console.log('MasterController BEFORE LOGOUT!');
			
		} else if (options.model==='UserModel' && options.method==='logout') {
			
			console.log('MasterController LOGOUT!');
			
			const mm = this.modelRepo.get('MenuModel');
			if (mm) {
				mm.setSelected('menu');
			}
			Object.keys(this.controllers).forEach(key => {
				this.controllers[key].clean();
			});
			
		} else if (options.model==='UserModel' && options.method==='login') {
			console.log('MasterController LOGIN !!!!');
		}
	}
	
	init() {
		console.log('MasterController init!');
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		
		
		
		console.log('Create UserModel!');
		const UM = new UserModel({name:'UserModel',src:'user'});
		UM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.modelRepo.add('UserModel',UM);
		UM.restore(); // Try to restore previous "session" stored into LocalStorage.
		
		
		console.log('Create Controllers...');
		// Menu controller MUST be first!
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		
		this.controllers['userlogin'] = new UserLoginController({name:'userlogin', master:this, el:'#content', visible:false});
		this.controllers['userlogin'].init();
		this.controllers['usersignup'] = new UserSignupController({name:'usersignup', master:this, el:'#content', visible:false});
		this.controllers['usersignup'].init();
		
		this.controllers['USERPAGE'] = new UserPageController({name:'USERPAGE', master:this, el:'#content', visible:false});
		this.controllers['USERPAGE'].init();
		this.controllers['USERHEATING'] = new UserHeatingController({name:'USERHEATING', master:this, el:'#content', visible:false});
		this.controllers['USERHEATING'].init();
		this.controllers['USERFEEDBACK'] = new UserFeedbackController({name:'USERFEEDBACK', master:this, el:'#content', visible:false});
		this.controllers['USERFEEDBACK'].init();
		
		this.controllers['A'] = new AController({name:'A', master:this, el:'#content', visible:false});
		this.controllers['A'].init();
		
		this.controllers['B'] = new BController({name:'B', master:this, el:'#content', visible:false});
		this.controllers['B'].init();
		
		this.controllers['C'] = new CController({name:'C', master:this, el:'#content', visible:false});
		this.controllers['C'].init();
		
		this.controllers['D'] = new DController({name:'D', master:this, el:'#content', visible:false});
		this.controllers['D'].init();
		
		
		REO.start(); // Start tracking resize events => will also do the initial "resize" for MenuView (View which is visible).
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
