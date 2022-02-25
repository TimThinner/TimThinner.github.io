import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import LanguageModel from './modules/common/LanguageModel.js';
//import LogModel from './modules/common/LogModel.js';
import UserModel from './modules/user/UserModel.js';
import ProxyCleanerModel from './modules/common/ProxyCleanerModel.js';

import MenuController from './modules/menu/MenuController.js';
import UserLoginController from './modules/user/UserLoginController.js';
import UserSignupController from './modules/user/UserSignupController.js';

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

import DistrictBController from './modules/districtb/DistrictBController.js';
import DistrictCController from './modules/districtc/DistrictCController.js';
import DistrictEController from './modules/districte/DistrictEController.js';
import DistrictFController from './modules/districtf/DistrictFController.js';

import UserPageController from './modules/userpage/UserPageController.js';
import UserPropsController from './modules/userprops/UserPropsController.js';
import UserHeatingController from './modules/userheating/UserHeatingController.js';
import UserElectricityController from './modules/userelectricity/UserElectricityController.js';
//import UserWaterController from './modules/userwater/UserWaterController.js';
import UserChangePswController from './modules/userprops/UserChangePswController.js';

import GridPageController from './modules/gridpage/GridPageController.js';
import EnvironmentPageController from './modules/environmentpage/EnvironmentPageController.js';
import SolarPageController from './modules/solarpage/SolarPageController.js';

// ADMIN stuff:
import UsersController from './modules/admin/users/UsersController.js';
import PointIdEditController from './modules/admin/users/PointIdEditController.js';
import RegCodeController from './modules/admin/regcodes/RegCodeController.js';
import RegCodeCreateController from './modules/admin/regcodes/RegCodeCreateController.js';
import RegCodeEditController from './modules/admin/regcodes/RegCodeEditController.js';
import ReadKeyController from './modules/admin/readkeys/ReadKeyController.js';
import ReadKeyEditController from './modules/admin/readkeys/ReadKeyEditController.js';


class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
	}
	
	notify(options) {
		if (options.model==='UserModel' && options.method==='before-logout') {
			console.log('MasterController BEFORE-LOGOUT!');
			// Log the LOGOUT EVENT.
			/*
			const lm = this.modelRepo.get('LogModel');
			if (lm) {
				const data = {
					refToUser: options.id,
					eventType: 'Logout'
				}
				lm.addToLog(data, options.token);
			}
			*/
			
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
			console.log('MasterController LOGIN!');
		}
	}
	
	init() {
		console.log('MasterController init v2022.02.25.ELE-D');
		
		console.log('Create ResizeEventObserver!');
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		REO.start(); // Start tracking resize events
		
		console.log('Create LanguageModel!');
		const LM = new LanguageModel();
		this.modelRepo.add('LanguageModel',LM);
		/*
		console.log('Create LogModel!');
		const LOGM = new LogModel({name:'LogModel',src:''});
		this.modelRepo.add('LogModel',LOGM);
		*/
		
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
		
		this.controllers['userlogin'] = new UserLoginController({name:'userlogin', master:this, el:'#content', visible:false});
		this.controllers['userlogin'].init();
		this.controllers['usersignup'] = new UserSignupController({name:'usersignup', master:this, el:'#content', visible:false});
		this.controllers['usersignup'].init();
		
		this.controllers['userpage'] = new UserPageController({name:'userpage', master:this, el:'#content', visible:false});
		this.controllers['userpage'].init();
		this.controllers['userprops'] = new UserPropsController({name:'userprops', master:this, el:'#content', visible:false});
		this.controllers['userprops'].init();
		
		this.controllers['userheating'] = new UserHeatingController({name:'userheating', master:this, el:'#content', visible:false});
		this.controllers['userheating'].init();
		this.controllers['userelectricity'] = new UserElectricityController({name:'userelectricity', master:this, el:'#content', visible:false});
		this.controllers['userelectricity'].init();
		
		this.controllers['userchangepsw'] = new UserChangePswController({name:'userchangepsw', master:this, el:'#content', visible:false});
		this.controllers['userchangepsw'].init();
		
		this.controllers['gridpage'] = new GridPageController({name:'gridpage', master:this, el:'#content', visible:false});
		this.controllers['gridpage'].init();
		this.controllers['environmentpage'] = new EnvironmentPageController({name:'environmentpage', master:this, el:'#content', visible:false});
		this.controllers['environmentpage'].init();
		this.controllers['solarpage'] = new SolarPageController({name:'solarpage', master:this, el:'#content', visible:false});
		this.controllers['solarpage'].init();
		
		this.controllers['district'] = new DistrictController({name:'district', master:this, el:'#content', visible:false});
		this.controllers['district'].init();
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
		
		this.controllers['DB'] = new DistrictBController({name:'DB', master:this, el:'#content', visible:false});
		this.controllers['DB'].init();
		this.controllers['DC'] = new DistrictCController({name:'DC', master:this, el:'#content', visible:false});
		this.controllers['DC'].init();
		this.controllers['DE'] = new DistrictEController({name:'DE', master:this, el:'#content', visible:false});
		this.controllers['DE'].init();
		this.controllers['DF'] = new DistrictFController({name:'DF', master:this, el:'#content', visible:false});
		this.controllers['DF'].init();
		
		// Admin stuff start ------>
		// New implementation:
		// UsersController creates models for:
		//   - Users
		//   - Regcodes
		//   - Readkeys
		// and UsersView fetches all data for these models.
		//
		this.controllers['USERS'] = new UsersController({name:'USERS', master:this, el:'#content', visible:false});
		this.controllers['USERS'].init();
		this.controllers['POINTIDEDIT'] = new PointIdEditController({name:'POINTIDEDIT', master:this, el:'#content', visible:false});
		this.controllers['POINTIDEDIT'].init();
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
		// <------------- Admin stuff end.
		
		
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
