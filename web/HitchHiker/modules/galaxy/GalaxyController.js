import Controller from '../common/Controller.js';
import GalaxyModel from  './GalaxyModel.js';
import GalaxyView from './GalaxyView.js';

export default class GalaxyController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize():
		Object.keys(this.models).forEach(key => {
			if (key === 'GalaxyModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		const model = new GalaxyModel({name:'GalaxyModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('GalaxyModel',model);
		this.models['GalaxyModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new GalaxyView(this);
		// NOTE: If View does NOT have ResizeEventObserver, we try to show it.
		// If view is listening to ResizeEventObserver, initial resize event will trigger "show()".
		if (typeof this.view.REO === 'undefined') {
			this.show(); // IF this controller is visible => show it.
		}
	}
	
	clean() {
		this.remove();
		console.log('GalaxyController is now REALLY cleaned!');
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
