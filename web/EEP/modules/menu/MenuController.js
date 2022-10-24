import Controller from '../common/Controller.js';
import EntsoeModel from  './EntsoeModel.js';
import EmpoModel from  './EmpoModel.js';
import MenuModel from  './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		const model = new MenuModel({name:'MenuModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		
		const entsoe_model = new EntsoeModel({name:'EntsoeEnergyPriceModel',src:'https://transparency.entsoe.eu/api', document_type:'A44', area_name:'Finland'});
		entsoe_model.subscribe(this);
		this.master.modelRepo.add('EntsoeEnergyPriceModel',entsoe_model);
		this.models['EntsoeEnergyPriceModel'] = entsoe_model;
		
		const mFiveDays = new EmpoModel({
			name: 'EmpoEmissionsFiveDays',
			src: 'emissions/findByDate?country=FI&EmDB=EcoInvent',
			timerange_start_subtract_hours: 131, // 120 + 11 hours 
			timerange_end_subtract_hours: 0 // should be 131 x 20 = 2620 values
		});
		mFiveDays.subscribe(this);
		this.master.modelRepo.add('EmpoEmissionsFiveDays', mFiveDays);
		this.models['EmpoEmissionsFiveDays'] = mFiveDays;
		
		this.view = new MenuView(this);
		
		// NOTE: If View does NOT have ResizeEventObserver, we try to show it.
		// If view is listening to ResizeEventObserver, initial resize event will trigger "show()".
		if (typeof this.view.REO === 'undefined') {
			this.show(); // IF this controller is visible => show it... and start periodic timer with 10 s interval.
		}
	}
}
