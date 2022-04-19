import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import FingridModel from  '../energydata/FingridModel.js';
import EmpoModel from  '../environmentpage/EmpoModel.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
		this.numOfEmpoModels = 30;
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
		
		const m = new FingridModel({name:'FingridPowerSystemStateModel',src:'https://api.fingrid.fi/v1/variable/209/event/json'});
		m.subscribe(this);
		this.master.modelRepo.add('FingridPowerSystemStateModel',m);
		this.models['FingridPowerSystemStateModel'] = m;
		
		
		const model_data = [];
		for (let i=1; i<this.numOfEmpoModels+1; i++) {
			const sh = i*24;
			const eh = i*24-24;
			model_data.push({name:'EmpoEmissions'+i+'Model',sh:sh,eh:eh});
		}
		model_data.forEach(md => {
			const em = new EmpoModel({
				name: md.name,
				src: 'emissions/findByDate?country=FI&EmDB=EcoInvent',
				timerange_start_subtract_hours: md.sh,
				timerange_end_subtract_hours: md.eh
			});
			em.subscribe(this);
			this.master.modelRepo.add(md.name, em);
			this.models[md.name] = em;
		});
		
		this.view = new MenuView(this);
		// NOTE: If View does NOT have ResizeEventObserver, we try to show it.
		// If view is listening to ResizeEventObserver, initial resize event will trigger "show()".
		if (typeof this.view.REO === 'undefined') {
			this.show(); // IF this controller is visible => show it.
		}
	}
}
