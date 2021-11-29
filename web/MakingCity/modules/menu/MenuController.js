import Controller from '../common/Controller.js';
import MenuModel from  './MenuModel.js';
import FingridModel from  '../energydata/FingridModel.js';
import EmpoModel from  '../environmentpage/EmpoModel.js';
import MenuView from './MenuView.js';
/*

1. make the query to get the emissions for the last 31 days
	
	http://128.214.253.150/api/v1/resources/emissions/findByDate?startdate=NNN&enddate=NNN&EmDB=EcoInvent&country=FI
2.	
	a. Calculate the mean value of the em_cons variable (excluding incorrect input such as NaN and Inf or -Inf) 
	this gives the last point to display and to compare with
	
	b. Calculate the cumulative mean of the result and that gives the moving average (https://www.philippe-fournier-viger.com/spmf/TimeSeriesCumulativeMovingAverage.php) 
	easier to display the last month to date moving average from a single query instead of storing data
	
	
*/
export default class MenuController extends Controller {
	
	constructor(options) {
		super(options);
		this.numOfEmpoModels = 30;
	}
	
	init() {
		const model = new MenuModel({name:'MenuModel',src:'menu'});
		model.subscribe(this);
		this.master.modelRepo.add('MenuModel',model);
		this.models['MenuModel'] = model;
		
		this.models['MenuModel'].clean(); // Clean Proxes!
		
		const m2 = new FingridModel({name:'FingridPowerSystemStateModel',src:'https://api.fingrid.fi/v1/variable/209/event/json'});
		m2.subscribe(this);
		this.master.modelRepo.add('FingridPowerSystemStateModel',m2);
		this.models['FingridPowerSystemStateModel'] = m2;
		
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
		
		// 180000
		const model_names = ['FingridPowerSystemStateModel'];
		model_data.forEach(md => {
			model_names.push(md.name);
		});
		this.timers['MenuView'] = {timer: undefined, interval: 180000, models: model_names}; // once per 3 minutes.
		this.view = new MenuView(this);
		// At init() there is ALWAYS only one controller with visible=true, this controller.
		// and also the ResizeEventObserver is started at init() => this controller is shown 
		// TWICE in init() if this.show() is called here!!!
		this.startPollers();
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
