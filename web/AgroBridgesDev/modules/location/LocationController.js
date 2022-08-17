import Controller from '../common/Controller.js';
import CountriesModel from './CountriesModel.js';
import RegionsModel from './RegionsModel.js';
import LocationView from './LocationView.js';

export default class LocationController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		/*
		const cm = new CountriesModel({name:'CountriesModel',src:'./data/NUTS_LB_2021_3035.json'});
		cm.subscribe(this);
		this.master.modelRepo.add('CountriesModel',cm);
		this.models['CountriesModel'] = cm;
		this.models['CountriesModel'].fetch(this.cids); // This "configuration" does not change, so we can fetch this at Controller init() -time.
		
		const rm = new RegionsModel({name:'RegionsModel',src:'./data/NUTS_LB_2021_3035.json'});
		rm.subscribe(this);
		this.master.modelRepo.add('RegionsModel',rm);
		this.models['RegionsModel'] = rm;
		*/
		const cm = new CountriesModel({name:'CountriesModel',src:''});
		cm.MOCKUP = this.master.MOCKUP;
		cm.subscribe(this);
		
		this.master.modelRepo.add('CountriesModel',cm);
		this.models['CountriesModel'] = cm;
		this.models['CountriesModel'].fetch(); // This "configuration" does not change, so we can fetch this at Controller init() -time.
		
		const rm = new RegionsModel({name:'RegionsModel',src:''});
		rm.MOCKUP = this.master.MOCKUP;
		rm.subscribe(this);
		this.master.modelRepo.add('RegionsModel',rm);
		this.models['RegionsModel'] = rm;
		
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new LocationView(this);
	}
}
