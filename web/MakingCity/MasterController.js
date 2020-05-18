import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import LanguageModel from './modules/common/LanguageModel.js';
import UserModel from './modules/user/UserModel.js';

import MenuController from './modules/menu/MenuController.js';
import UserLoginController from './modules/user/UserLoginController.js';
import UserSignupController from './modules/user/UserSignupController.js';
//import UserInfoController from './modules/user/UserInfoController.js';

import UserPageController from './modules/userpage/UserPageController.js';
import UserPropsController from './modules/userprops/UserPropsController.js';
import UserElectricityController from './modules/userelectricity/UserElectricityController.js';
import UserHeatingController from './modules/userheating/UserHeatingController.js';
import UserWaterController from './modules/userwater/UserWaterController.js';

import GridPageController from './modules/gridpage/GridPageController.js';
import SolarPageController from './modules/solarpage/SolarPageController.js';
import EnvironmentPageController from './modules/environmentpage/EnvironmentPageController.js';

import DistrictController from './modules/district/DistrictController.js';
import DistrictAController from './modules/districta/DistrictAController.js';
import DistrictAAController from './modules/districtaa/DistrictAAController.js';
import DistrictABController from './modules/districtab/DistrictABController.js';
import DistrictACController from './modules/districtac/DistrictACController.js';
import DistrictADController from './modules/districtad/DistrictADController.js';
import DistrictAEController from './modules/districtae/DistrictAEController.js';
import DistrictAFController from './modules/districtaf/DistrictAFController.js';
import DistrictAGController from './modules/districtag/DistrictAGController.js';
import DistrictAIController from './modules/districtai/DistrictAIController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
	}
	/*
	restore() {
		console.log('MasterController restore!');
	}
	*/
	notify(options) {
		//console.log(['MasterController NOTIFY: model=',options.model,' method=',options.method]);
		if (options.model==='UserModel' && options.method==='logout') {
			
			console.log('MasterController LOGOUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
			
			const mm = this.modelRepo.get('MenuModel');
			if (mm) {
				mm.setSelected('menu');
			}
			
			Object.keys(this.controllers).forEach(key => {
				this.controllers[key].clean();
			});
		}
	}
	
	init() {
		console.log('MasterController init!');
		
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		REO.start(); // Start tracking resize events
		
		const LM = new LanguageModel();
		this.modelRepo.add('LanguageModel',LM);
		
		const UM = new UserModel({name:'UserModel',src:'user'});
		UM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.modelRepo.add('UserModel',UM);
		UM.restore(); // Try to restore previous "session" stored into LocalStorage.
		
		// Menu controller MUST be first!
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#content', visible:true});
		this.controllers['menu'].init();
		//this.controllers['menu'].restore();
		
		this.controllers['userlogin'] = new UserLoginController({name:'userlogin', master:this, el:'#content', visible:false});
		this.controllers['userlogin'].init();
		this.controllers['usersignup'] = new UserSignupController({name:'usersignup', master:this, el:'#content', visible:false});
		this.controllers['usersignup'].init();
		//this.controllers['userinfo'] = new UserInfoController({name:'userinfo', master:this, el:'#content', visible:false});
		//this.controllers['userinfo'].init();
		
		this.controllers['USERPAGE'] = new UserPageController({name:'USERPAGE', master:this, el:'#content', visible:false});
		this.controllers['USERPAGE'].init();
		this.controllers['USERPROPS'] = new UserPropsController({name:'USERPROPS', master:this, el:'#content', visible:false});
		this.controllers['USERPROPS'].init();
		this.controllers['USERELECTRICITY'] = new UserElectricityController({name:'USERELECTRICITY', master:this, el:'#content', visible:false});
		this.controllers['USERELECTRICITY'].init();
		this.controllers['USERHEATING'] = new UserHeatingController({name:'USERHEATING', master:this, el:'#content', visible:false});
		this.controllers['USERHEATING'].init();
		this.controllers['USERWATER'] = new UserWaterController({name:'USERWATER', master:this, el:'#content', visible:false});
		this.controllers['USERWATER'].init();
		
		this.controllers['GRIDPAGE'] = new GridPageController({name:'GRIDPAGE', master:this, el:'#content', visible:false});
		this.controllers['GRIDPAGE'].init();
		this.controllers['SOLARPAGE'] = new SolarPageController({name:'SOLARPAGE', master:this, el:'#content', visible:false});
		this.controllers['SOLARPAGE'].init();
		this.controllers['ENVIRONMENTPAGE'] = new EnvironmentPageController({name:'ENVIRONMENTPAGE', master:this, el:'#content', visible:false});
		this.controllers['ENVIRONMENTPAGE'].init();
		
		this.controllers['D'] = new DistrictController({name:'D', master:this, el:'#content', visible:false});
		this.controllers['D'].init();
		
		this.controllers['DA'] = new DistrictAController({name:'DA', master:this, el:'#content', visible:false});
		this.controllers['DA'].init();
		
		this.controllers['DAA'] = new DistrictAAController({name:'DAA', master:this, el:'#content', visible:false});
		this.controllers['DAA'].init();
		
		this.controllers['DAB'] = new DistrictABController({name:'DAB', master:this, el:'#content', visible:false});
		this.controllers['DAB'].init();
		
		this.controllers['DAC'] = new DistrictACController({name:'DAC', master:this, el:'#content', visible:false});
		this.controllers['DAC'].init();
		
		this.controllers['DAD'] = new DistrictADController({name:'DAD', master:this, el:'#content', visible:false});
		this.controllers['DAD'].init();
		
		this.controllers['DAE'] = new DistrictAEController({name:'DAE', master:this, el:'#content', visible:false});
		this.controllers['DAE'].init();
		
		this.controllers['DAF'] = new DistrictAFController({name:'DAF', master:this, el:'#content', visible:false});
		this.controllers['DAF'].init();
		
		this.controllers['DAG'] = new DistrictAGController({name:'DAG', master:this, el:'#content', visible:false});
		this.controllers['DAG'].init();
		
		this.controllers['DAI'] = new DistrictAIController({name:'DAI', master:this, el:'#content', visible:false});
		this.controllers['DAI'].init();
		
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
