import ModelRepo from './modules/common/ModelRepo.js';
import ConfigModel from './modules/common/ConfigModel.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import LanguageModel from './modules/common/LanguageModel.js';

import UserModel from './modules/user/UserModel.js';
import FeedbackModel from './modules/common/FeedbackModel.js';

import MenuController from './modules/menu/MenuController.js';
import UserLoginController from './modules/user/UserLoginController.js';
import UserSignupController from './modules/user/UserSignupController.js';
import UserGDPRController from './modules/user/UserGDPRController.js';
import UserConsentController from './modules/user/UserConsentController.js';
import HelpController from './modules/help/HelpController.js';

import UserPageController from './modules/userpage/UserPageController.js';
import UserPropsController from './modules/userprops/UserPropsController.js';
import UserChangePswController from './modules/userprops/UserChangePswController.js';
import UserHeatingController from './modules/userheating/UserHeatingController.js';
import UserFeedbackController from './modules/userfeedback/UserFeedbackController.js';

import AController from './modules/a/AController.js';
import BController from './modules/b/BController.js';
import CController from './modules/c/CController.js';
import DController from './modules/d/DController.js';
import FlexController from './modules/Flex/FlexController.js';

// ADMIN stuff:
import RegCodeController from './modules/admin/regcodes/RegCodeController.js';
import RegCodeCreateController from './modules/admin/regcodes/RegCodeCreateController.js';
import RegCodeEditController from './modules/admin/regcodes/RegCodeEditController.js';
import ReadKeyController from './modules/admin/readkeys/ReadKeyController.js';
import ReadKeyEditController from './modules/admin/readkeys/ReadKeyEditController.js';
import ObixCodeEditController from './modules/admin/users/ObixCodeEditController.js';
//import ObixCodeBEditController from './modules/admin/users/ObixCodeBEditController.js';
//import ObixCodeCEditController from './modules/admin/users/ObixCodeCEditController.js';
import UsersController from './modules/admin/users/UsersController.js';
import ConfigsController from './modules/admin/configs/ConfigsController.js';
import FeedbacksController from './modules/admin/feedbacks/FeedbacksController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		
		
	}
	
	notify(options) {
		console.log(['MasterController NOTIFY: model=',options.model,' method=',options.method]);
		
		if (options.model==='UserModel' && options.method==='before-logout') {
			
			console.log('MasterController BEFORE USER LOGOUT!');
			
		} else if (options.model==='UserModel' && options.method==='logout') {
			
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
		
		} else if (options.model==='ConfigModel' && options.method==='fetched') {
			
			const cm = this.modelRepo.get('ConfigModel');
			console.log(['ConfigModel FETCHED!!!! cm=',cm]);
			// Now you can access configs in different parts of app!
		}
	}
	
	init() {
		console.log('MasterController init 2022.02.16!');
		
		const CONFIG_MODEL = new ConfigModel({name:'ConfigModel',src:''});
		CONFIG_MODEL.subscribe(this);
		this.modelRepo.add('ConfigModel',CONFIG_MODEL);
		CONFIG_MODEL.fetch();
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		
		console.log('Create LanguageModel!');
		const LM = new LanguageModel();
		this.modelRepo.add('LanguageModel',LM);
		
		console.log('Create UserModel!');
		const UM = new UserModel({name:'UserModel',src:'user'});
		UM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.modelRepo.add('UserModel',UM);
		UM.restore(); // Try to restore previous "session" stored into LocalStorage.
		
		const FBM = new FeedbackModel({name:'FeedbackModel',src:''});
		FBM.subscribe(this);
		this.modelRepo.add('FeedbackModel',FBM);
		
		console.log('Create Controllers...');
		// Menu controller MUST be first!
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		
		this.controllers['HELP'] = new HelpController({name:'HELP', master:this, el:'#content', visible:false});
		this.controllers['HELP'].init();
		this.controllers['userGDPR'] = new UserGDPRController({name:'userGDPR', master:this, el:'#content', visible:false});
		this.controllers['userGDPR'].init();
		this.controllers['userConsent'] = new UserConsentController({name:'userConsent', master:this, el:'#content', visible:false});
		this.controllers['userConsent'].init();
		this.controllers['userlogin'] = new UserLoginController({name:'userlogin', master:this, el:'#content', visible:false});
		this.controllers['userlogin'].init();
		this.controllers['usersignup'] = new UserSignupController({name:'usersignup', master:this, el:'#content', visible:false});
		this.controllers['usersignup'].init();
		
		this.controllers['USERPAGE'] = new UserPageController({name:'USERPAGE', master:this, el:'#content', visible:false});
		this.controllers['USERPAGE'].init();
		
		this.controllers['USERPROPS'] = new UserPropsController({name:'USERPROPS', master:this, el:'#content', visible:false});
		this.controllers['USERPROPS'].init();
		this.controllers['USERCHANGEPSW'] = new UserChangePswController({name:'USERCHANGEPSW', master:this, el:'#content', visible:false});
		this.controllers['USERCHANGEPSW'].init();
		
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
		this.controllers['FLEX'] = new FlexController({name:'FLEX', master:this, el:'#content', visible:false});
		this.controllers['FLEX'].init();
		
		// Admin stuff start ------>
		this.controllers['REGCODES'] = new RegCodeController({name:'REGCODES', master:this, el:'#content', visible:false});
		this.controllers['REGCODES'].init();
		this.controllers['REGCODECREATE'] = new RegCodeCreateController({name:'REGCODECREATE', master:this, el:'#content', visible:false});
		this.controllers['REGCODECREATE'].init();
		this.controllers['REGCODEEDIT'] = new RegCodeEditController({name:'REGCODEEDIT', master:this, el:'#content', visible:false});
		this.controllers['REGCODEEDIT'].init();
		
		this.controllers['READKEYS'] = new ReadKeyController({name:'READKEYS', master:this, el:'#content', visible:false});
		this.controllers['READKEYS'].init();
		this.controllers['READKEYEDIT'] = new ReadKeyEditController({name:'READKEYEDIT', master:this, el:'#content', visible:false});
		this.controllers['READKEYEDIT'].init();
		
		this.controllers['USERS'] = new UsersController({name:'USERS', master:this, el:'#content', visible:false});
		this.controllers['USERS'].init();
		this.controllers['OBIXCODEEDIT'] = new ObixCodeEditController({name:'OBIXCODEEDIT', master:this, el:'#content', visible:false});
		this.controllers['OBIXCODEEDIT'].init();
		//this.controllers['OBIXCODEBEDIT'] = new ObixCodeBEditController({name:'OBIXCODEBEDIT', master:this, el:'#content', visible:false});
		//this.controllers['OBIXCODEBEDIT'].init();
		//this.controllers['OBIXCODECEDIT'] = new ObixCodeCEditController({name:'OBIXCODECEDIT', master:this, el:'#content', visible:false});
		//this.controllers['OBIXCODECEDIT'].init();
		
		this.controllers['CONFIGS'] = new ConfigsController({name:'CONFIGS', master:this, el:'#content', visible:false});
		this.controllers['CONFIGS'].init();
		
		this.controllers['FEEDBACKS'] = new FeedbacksController({name:'FEEDBACKS', master:this, el:'#content', visible:false});
		this.controllers['FEEDBACKS'].init();
		// <------------- Admin stuff end.
		
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
