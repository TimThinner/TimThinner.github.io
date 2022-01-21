import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import ObixModel from '../common/ObixModel.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
	}
	/*
	NOTE: Menumodel is NEVER removed!
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key === 'MenuModel' || key === 'ProxesCleanerModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	*/
	init() {
		const model = new MenuModel({name:'MenuModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		const m2 = new ObixModel({name:'ProxesCleanerModel',src:'',access:'PUBLIC'});
		m2.subscribe(this);
		this.master.modelRepo.add('ProxesCleanerModel',m2);
		this.models['ProxesCleanerModel'] = m2;
		
		this.view = new MenuView(this);
		// NOTE: If View does NOT have ResizeEventObserver, we try to show it.
		// If view is listening to ResizeEventObserver, initial resize event will trigger "show()".
		if (typeof this.view.REO === 'undefined') {
			this.show(); // IF this controller is visible => show it.
		}
	}
}
