import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import LanguageModel from './modules/common/LanguageModel.js';
import UserModel from './modules/user/UserModel.js';

import MenuController from './modules/menu/MenuController.js';
//import MainController from './modules/main/MainController.js';
import FarmController from './modules/farm/FarmController.js';
import LocationController from './modules/location/LocationController.js';
import InfoController from './modules/info/InfoController.js';
import VegeController from './modules/vege/VegeController.js';
import AnimalsController from './modules/animals/AnimalsController.js';
import FruitsController from './modules/fruits/FruitsController.js';

import ActivitiesController from './modules/activities/ActivitiesController.js';
import ProducerController from './modules/producer/ProducerController.js';

import AnalysisController from './modules/analysis/AnalysisController.js';

import HelpController from './modules/help/HelpController.js';
import LanguageController from './modules/language/LanguageController.js';

/*
EventObserver	Model					MenuModel
				ResizeEventObserver		
				PeriodicTimeoutObserver	
ModelRepo		
Controller		MenuController
View			MenuView



NEW: Read in the parameters from URL Query String

https://..../index.html?userid=323949890&country=IE&language=en


*/
class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		this.MOCKUP = false;
	}
	
	createControllers() {
	
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		
		this.controllers['farm'] = new FarmController({name:'farm', master:this, el:'#content', visible:false});
		this.controllers['farm'].init();
		this.controllers['location'] = new LocationController({name:'location', master:this, el:'#content', visible:false});
		this.controllers['location'].init();
		this.controllers['info'] = new InfoController({name:'info', master:this, el:'#content', visible:false});
		this.controllers['info'].init();
		this.controllers['vege'] = new VegeController({name:'vege', master:this, el:'#content', visible:false});
		this.controllers['vege'].init();
		this.controllers['animals'] = new AnimalsController({name:'animals', master:this, el:'#content', visible:false});
		this.controllers['animals'].init();
		this.controllers['fruits'] = new FruitsController({name:'fruits', master:this, el:'#content', visible:false});
		this.controllers['fruits'].init();
		
		this.controllers['activities'] = new ActivitiesController({name:'activities', master:this, el:'#content', visible:false});
		this.controllers['activities'].init();
		this.controllers['producer'] = new ProducerController({name:'producer', master:this, el:'#content', visible:false});
		this.controllers['producer'].init();
		
		this.controllers['analysis'] = new AnalysisController({name:'analysis', master:this, el:'#content', visible:false});
		this.controllers['analysis'].init();
		
		
		this.controllers['help'] = new HelpController({name:'help', master:this, el:'#content', visible:false});
		this.controllers['help'].init();
		
		this.controllers['language'] = new LanguageController({name:'language', master:this, el:'#content', visible:false});
		this.controllers['language'].init();
	}
	
	notify(options) {
		console.log(['MasterController notify options=',options]);
		
		if (options.model==='UserModel' && options.method==='logout') {
			
			console.log('MasterController USER LOGOUT!');
			
			
			/*
			const mm = this.modelRepo.get('MenuModel');
			if (mm) {
				mm.setSelected('menu');
			}
			
			*/
			
			/*
				cleaning removes all user specific data from app. 
				Default implementation does nothing.
			*/
			Object.keys(this.controllers).forEach(key => {
				this.controllers[key].clean();
			});
			
			// Test if this closes the current TAB.
			// NOTE: This method can only be called on windows that were opened by a script using the Window.open() method. 
			// If the window was not opened by a script, an error similar to this one appears in the console: 
			// Scripts may not close windows that were not opened by script.
			window.close();
			
			
		} else if (options.model==='UserModel' && options.method==='login') {
			
			console.log('MasterController LOGIN !!!!');
			
			
		} else if (options.model==='UserModel' && options.method==='insertUser') {
			
			if (options.status===201) {
				// 201 OK User is inserted (new one).
				// 404 409 if exist => 
				// 201 OK
				console.log('NEW USER, NO NEED to RESTORE values!');
				
				
				
			} else {
				console.log('USER EXIST in the databasew => RESTORE values!');
				const UM = this.modelRepo.get('UserModel');
				UM.restoreUserProfile(); // Try to restore previous profile data stored into database.
			}
			
		} else if (options.model==='UserModel' && options.method==='restoreUserProfile') {
			
			console.log(['ReSTORED USER profile !!!!!! options.status=',options.status]);
			
			
			
		} else if (options.model==='LanguageModel' && options.method==='loadTranslation') {
			
			console.log(['MasterController LanguageModel loadTranslation status=',options.status,' message=',options.message]);
			
		}
	}
	
	init() {
		console.log('MasterController init!');
		
		// Parse URL Query String.
		// const query_string = '?userid='+uid+'&country=IE&language=en&MOCKUP='+mockup;
		//
		// If URL QUERY STRING does NOT have values, what are the defaults?
		// 
		// class UserModel this.id = 'prod_nl_1';
		// UM.profile['Country'] = 'IE';
		// class Model this.MOCKUP = true; NOTE: effects UM, LM
		// MasterController this.MOCKUP = true; NOTE: effects CM, RM (Location)
		// LM.selected = 'en';
		
		const url_params = {};
		//	const query_string = '?userid='+uid+'&country=IE&language=en&MOCKUP='+mockup;
		const params = new URLSearchParams(window.location.search);
		// get the key/value pairs
		for (const [key, value] of params.entries()) {
			url_params[key] = value;
		}
		console.log(['url_params=',url_params]);
		// New code here October 11th 2022
		// If any of these URL params ('userid' or 'country' or 'language') is missing, 
		// we just skip rest of init and open the landing page of the project.
		if (typeof url_params['userid'] === 'undefined' || typeof url_params['country'] === 'undefined' || typeof url_params['language'] === 'undefined') {
			
			window.location.replace("https://agrobridges-toolbox.eu/decisionsupporttool/");
			
		} else {
			console.log('Create ResizeEventObserver!');
			const REO = new ResizeEventObserver();
			this.modelRepo.add('ResizeEventObserver',REO);
			
			const LM = new LanguageModel({name:'LanguageModel',src:''});
			LM.subscribe(this); // Now we will receive notifications from the LanguageModel.
			this.modelRepo.add('LanguageModel',LM);
			
			console.log('Create UserModel!');
			const UM = new UserModel({name:'UserModel'});
			UM.subscribe(this); // Now we will receive notifications from the UserModel.
			this.modelRepo.add('UserModel',UM);
			//UM.restore(); // Try to restore previous "session" stored into LocalStorage.
			
			// Start tracking resize events => will also notify initial "resize" (with small delay) 
			// for MenuView (View which is visible after delay timeout).
			REO.start();
			
			console.log('Create Controllers...');
			// - MENU
			// - MAIN
			//   - Farm
			// 	   - Location
			//     - Info
			//     - Vegetables
			//     - Animals
			//     - Fruits
			//   - Activities
			//   - Producer
			
			if (typeof url_params['userid'] !== 'undefined') {
				UM.id = url_params['userid'];
			}
			
			if (typeof url_params['country'] !== 'undefined') {
				UM.profile['Country'] = url_params['country'];
				
			} else {
				UM.profile['Country'] = 'IE';
			}
			if (typeof url_params['MOCKUP'] !== 'undefined') {
				if (url_params['MOCKUP'] === 'true') {
					this.MOCKUP = true;
				} else {
					this.MOCKUP = false;
				}
				UM.MOCKUP = this.MOCKUP;
				LM.MOCKUP = this.MOCKUP;
			} else {
				this.MOCKUP = false;
				UM.MOCKUP = this.MOCKUP;
				LM.MOCKUP = this.MOCKUP;
			}
			
			console.log('Now load the language Translation!');
			if (typeof url_params['language'] !== 'undefined') {
				LM.selected = url_params['language'];
			} else {
				LM.selected = 'en';
			}
			// Clear all search strings ('?foo=bar') and hash anchors ('#mood') from URL WITHOUT RELOADING THE PAGE!
			window.history.pushState({}, "", "index.html");
			LM.loadTranslation();
			UM.insertUser(); // This checks if User already exists in database.
			this.createControllers();
		}
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
