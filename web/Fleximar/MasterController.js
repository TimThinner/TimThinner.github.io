import ModelRepo from './modules/common/ModelRepo.js';
//import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import LanguageModel from './modules/common/LanguageModel.js';
import UserModel from './modules/user/UserModel.js';

import MenuController from './modules/menu/MenuController.js';
import ProfileController from './modules/profile/ProfileController.js';
import InfluxController from './modules/influx/InfluxController.js';


class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		
		// Note: property 'key' must equal to key in controllers hash and also 
		// the name of the associated Controller.
		this.menuitems = [
			{key:'Profile',value:'Profile'},
			{key:'Influx',value:'Market Info'},
			{key:'Messages',value:'Trading'},
			{key:'Rules',value:'Rules & Conditions'},
			{key:'Guide',value:'Technical Docs'},
			{key:'About', value:'About'}
		];
		// Note:
		// modelRepo.remove(key) will delete the property from hash:
		//		remove(key) {
		//			delete this.repo[key];
		//		}
		//
	}
	
	createSessionControllers() {
		console.log('CREATE Profile and initialize it.');
		this.controllers['Profile'] = new ProfileController({name:'Profile', master:this, el:'#content', visible:false});
		this.controllers['Profile'].init();
		
		this.controllers['Influx'] = new InfluxController({name:'Influx', master:this, el:'#content', visible:false});
		this.controllers['Influx'].init();
	}
	
	notify(options) {
		
		console.log(['MasterController NOTIFY: model=',options.model,' method=',options.method]);
		
		if (options.model==='UserModel' && options.method==='restored') {
			console.log('UserModel restored!');
			if (options.status === 200) {
				
				console.log('SESSION RESTORED OK!');
				
				this.createSessionControllers();
				
				console.log('TIME TO RESTORE MENU!');
				Object.keys(this.controllers).forEach(key => {
					if (key === 'menu') {
						this.controllers[key].restore();
					}
				});
				
			} else {
				console.log('NO SESSION TO RESTORE => SHOW MENU');
				Object.keys(this.controllers).forEach(key => {
					if (key === 'menu') {
						this.controllers[key].show();
					}
				});
			}
			
		} else if (options.model==='UserModel' && options.method==='login') {
			
			console.log('SESSION STARTED WITH LOGIN!!!!!!!');
			if (options.status === 200) {
				this.createSessionControllers();
				
				console.log('TIME TO RESTORE MENU!');
				Object.keys(this.controllers).forEach(key => {
					if (key === 'menu') {
						this.controllers[key].restore();
					}
				});
			} else {
				// Login NOT OK => Show error and restore menu?
				console.log('LOGIN NOT OK => SHOW MENU');
				Object.keys(this.controllers).forEach(key => {
					if (key === 'menu') {
						this.controllers[key].show();
					}
				});
			}
			
		} else if (options.model==='UserModel' && options.method==='logout') {
			console.log('LOGOUT');
			Object.keys(this.controllers).forEach(key => {
				// TODO: Remove all controllers (except menu) => clear data they contain
				// and REFRESH menu:
				if (key === 'menu') {
					console.log(['controller key = ',key,' SHOW!']);
					this.controllers[key].show();
				} else {
					console.log(['controller key = ',key,' REMOVE AND DELETE!']);
					this.controllers[key].remove();
					delete this.controllers[key];
				}
			});
			// remove also all models except those listed.
			this.modelRepo.keys().forEach((key)=>{
				if (key === 'ResizeEventObserver' || key === 'LanguageModel' || key === 'UserModel' || key === 'MenuModel') {
					// do nothing
					console.log(['model key = ',key,' NO ACTION']);
				} else {
					console.log(['model key = ',key,' REMOVE!!!']);
					this.modelRepo.remove(key);
				}
			});
		}
	}
	
	init() {
		console.log('MasterController init!');
		
		//const REO = new ResizeEventObserver();
		//this.modelRepo.add('ResizeEventObserver',REO);
		//REO.start(); // Start tracking resize events
		
		const LM = new LanguageModel();
		this.modelRepo.add('LanguageModel',LM);
		
		
		const UM = new UserModel();
		UM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.modelRepo.add('UserModel',UM);
		UM.restore(); // Try to restore previous "session" stored into LocalStorage.
		
		// Create "permanent" Menu controller now. It is the only controller that is never removed.
		
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#menu', visible:true, menuitems:this.menuitems});
		this.controllers['menu'].init();
		
		// If there is no UserModel => we must restore menu here (like this):
		//this.createSessionControllers();
		//this.controllers['menu'].restore();
		// Also note that selected menu is stored into localStorage ONLY if UserModel exist.
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