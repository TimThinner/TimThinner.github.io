import Controller from '../common/Controller.js';
import SolarModel from  './SolarModel.js';
import FooModel from  './FooModel.js';
import DistrictAAWrapperView from './DistrictAAWrapperView.js';

export default class DistrictAAController extends Controller {
	
	constructor(options) {
		super();
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		this.models  = {};
		//this.timers  = {};
		this.view    = undefined;
		this.menuModel = undefined;
	}
	
	remove() {
		super.remove(); // Handles the timer stuff.
		
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
			this.models[key].unsubscribe(this.master);
		});
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
	}
	
	show() {
		if (this.visible && this.view) {
			this.view.show();
			this.poller('SolarChartView'); // Start the timer poller
			this.poller('FooChartView'); // Start the timer poller
		}
	}
	
	hide() {
		super.hide(); // Handles the timer stuff.
		
		if (this.view) {
			this.view.hide();
		}
	}
	
	notify(options) {
		if (options.model==='MenuModel' && options.method==='selected') {
			console.log(['Selected = ',options.selected]);
			if (this.name === options.selected) {
				setTimeout(() => {
					this.visible = true;
					this.restore();
					this.show();
				}, 100);
			} else {
				this.visible = false;
				this.hide();
			}
		}
	}
	
	restore() {
		console.log('DistrictAAController restore');
	}
	
	init() {
		const smodel = new SolarModel();
		smodel.subscribe(this);
		smodel.subscribe(this.master);
		this.master.modelRepo.add('SolarModel',smodel);
		this.models['SolarModel'] = smodel;
		smodel.fetch();
		
		const fmodel = new FooModel();
		fmodel.subscribe(this);
		fmodel.subscribe(this.master);
		this.master.modelRepo.add('FooModel',fmodel);
		this.models['FooModel'] = fmodel;
		fmodel.fetch();
		
		this.timers['SolarChartView'] = {timer: undefined, interval: 10000, models:['SolarModel']};
		this.timers['FooChartView'] = {timer: undefined, interval: 10000, models:['FooModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictAAWrapperView(this);
		this.show();
	}
}
