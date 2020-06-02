import ModelRepo from './modules/common/ModelRepo.js';
import ResizeEventObserver from './modules/common/ResizeEventObserver.js';
import MenuController from './modules/menu/MenuController.js';
import HomeController from './modules/home/HomeController.js';
import MapController from './modules/map/MapController.js';
import CameraController from './modules/camera/CameraController.js';
import InfoController from './modules/info/InfoController.js';

class MasterController {
	
	constructor() {
		this.controllers = {};
		this.modelRepo = new ModelRepo();
		//const icon_map = {'map':'home','camera':'camera_alt','info':'info'};
		this.menuitems = {'home':{logo:'./img/401px-Nuuksion_kp.png'},'map':{logo:'home'},'camera':{logo:'camera_alt'},'info':{logo:'info'}};
		this.targets = {'Nuuksio':{
			logo: './img/401px-Nuuksion_kp.png',
			zoom: 11,
			center: [60.32, 24.54]
		},'Sipoonkorpi':{
			logo: './img/377px-Sipoonkorven_kp.png',
			zoom: 11,
			center: [60.35, 25.20]
		}};
	}
	
	restore() {
		console.log('MasterController restore!');
	}
	
	notify(options) {
		console.log(['MasterController NOTIFY: model=',options.model,' method=',options.method]);
	}
	
	init() {
		console.log('MasterController init!');
		
		const REO = new ResizeEventObserver();
		this.modelRepo.add('ResizeEventObserver',REO);
		REO.start(); // Start tracking resize events
		
		// Menu controller MUST be first!
		this.controllers['menu'] = new MenuController({name:'menu', master:this, el:'#menu', visible:true, menuitems:this.menuitems});
		this.controllers['menu'].init();
		this.controllers['menu'].restore();
		
		this.controllers['home'] = new HomeController({name:'home', master:this, el:'#content', visible:false, targets:this.targets});
		this.controllers['home'].init();
		this.controllers['home'].restore();
		
		this.controllers['map'] = new MapController({name:'map', master:this, el:'#content', visible:false});
		this.controllers['map'].init();
		
		this.controllers['camera'] = new CameraController({name:'camera', master:this, el:'#content', visible:false});
		this.controllers['camera'].init();
		
		this.controllers['info'] = new InfoController({name:'info', master:this, el:'#content', visible:false});
		this.controllers['info'].init();
	}
}
new MasterController().init();
