import Controller from '../../common/Controller.js';
import UsersModel from  './UsersModel.js';
import RegCodeModel from  '../regcodes/RegCodeModel.js';
import ReadKeyModel from  '../readkeys/ReadKeyModel.js';
import UsersView from './UsersView.js';

export default class UsersController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		
		Object.keys(this.models).forEach(key => {
			if (key === 'UsersModel' || key === 'RegCodeModel' || key === 'ReadKeyModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		const model = new UsersModel({name:'UsersModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('UsersModel',model);
		this.models['UsersModel'] = model;
		
		const m2 = new RegCodeModel({name:'RegCodeModel',src:''});
		m2.subscribe(this);
		this.master.modelRepo.add('RegCodeModel',m2);
		this.models['RegCodeModel'] = m2;
		
		const m3 = new ReadKeyModel({name:'ReadKeyModel',src:''});
		m3.subscribe(this);
		this.master.modelRepo.add('ReadKeyModel',m3);
		this.models['ReadKeyModel'] = m3;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UsersView(this);
	}
	
	clean() {
		console.log('UsersController is now REALLY cleaned!');
		this.remove();
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		// AND in this.remove finally all models created here is removed.
		// So we need to do init() almost in its entirety again ... timers are NOT deleted in remove, 
		// so there is no need to redefine them.
		this.initialize();
	}
	
	
	init() {
		this.initialize();
		// New: Controller does not extend PeriodicPoller 
		//this.timers['UsersView'] = {timer: undefined, interval: -1, models:['UsersModel','RegCodeModel','ReadKeyModel']};
	}
}
