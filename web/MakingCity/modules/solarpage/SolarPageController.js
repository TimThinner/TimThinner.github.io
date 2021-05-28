import Controller from '../common/Controller.js';
import SolarPageView from './SolarPageView.js';
import FingridModel from  '../energydata/FingridModel.js';
//import obixModel from '../energydata/obixModel.js';
import EntsoeModel from '../energydata/EntsoeModel.js';
import RussiaModel from '../energydata/RussiaModel.js';
import SwedenModel from '../energydata/SwedenModel.js';

export default class SolarPageController extends Controller {
	
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
			if (key === 'FingridSolarPowerFinlandModel' || /*key === 'obixModel' || */ 
				key === 'EntsoeA65NorwayNO4Model' || key === 'EntsoeA75FinlandB01Model' ||
				key === 'RussiaModel' || key === 'SwedenModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		/*
		NOTE: In SOLAR FORECAST case we are giving here just a base src address, it will be appended with start_time and end_time, like this:
		https://api.fingrid.fi/v1/variable/248/events/json?start_time=2021-05-14T15:00:00Z&end_time=2021-05-16T15:00:00Z
		*/
		const m = new FingridModel({name:'FingridSolarPowerFinlandModel',src:'https://api.fingrid.fi/v1/variable/248/events/json?'});
		m.subscribe(this);
		this.master.modelRepo.add('FingridSolarPowerFinlandModel',m);
		this.models['FingridSolarPowerFinlandModel'] = m;
		
		// Testing!
		/*
		const m2 = new obixModel({name:'obixModel',src:''});
		m2.subscribe(this);
		this.master.modelRepo.add('obixModel',m2);
		this.models['obixModel'] = m2;
		*/
		const m3 = new EntsoeModel({name:'EntsoeA75NorwayNO4Model',src:'https://transparency.entsoe.eu/api', document_type: 'A65', area_name: 'NorwayNO4'});
		m3.subscribe(this);
		this.master.modelRepo.add('EntsoeA65NorwayNO4Model',m3);
		this.models['EntsoeA65NorwayNO4Model'] = m3;
		
		const m33 = new EntsoeModel({name:'EntsoeA75FinlandB01Model',src:'https://transparency.entsoe.eu/api', document_type: 'A75', area_name: 'Finland', psr_type:'B01'});
		m33.subscribe(this);
		this.master.modelRepo.add('EntsoeA75FinlandB01Model',m33);
		this.models['EntsoeA75FinlandB01Model'] = m33;
		
		
		const m4 = new RussiaModel({name:'RussiaModel',src:'http://br.so-ups.ru/webapi/api/CommonInfo/PowerGeneration?priceZone[]=1'});
		m4.subscribe(this);
		this.master.modelRepo.add('RussiaModel',m4);
		this.models['RussiaModel'] = m4;
		
		const m5 = new SwedenModel({name:'SwedenModel',src:'https://www.svk.se/ControlRoom/GetProductionHistory/'});
		m5.subscribe(this);
		this.master.modelRepo.add('SwedenModel',m5);
		this.models['SwedenModel'] = m5;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		// interval 3600 s = 1 hour
		this.timers['SolarPageChartView'] = {timer: undefined, interval: 3600000, models:['FingridSolarPowerFinlandModel',/*'obixModel',*/
		'EntsoeA65NorwayNO4Model','EntsoeA75FinlandB01Model','RussiaModel','SwedenModel']};
		
		this.view = new SolarPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
