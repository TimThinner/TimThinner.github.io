import PeriodicPoller from '../common/PeriodicPoller.js';
import UserModel from '../user/UserModel.js';
import InfluxModel from './InfluxModel.js';
import InfluxView from './InfluxView.js';

export default class InfluxController extends PeriodicPoller {
	
	constructor(options) {
		super(options); // Call PeriodicPoller constructor
		this.name    = options.name;
		this.master  = options.master;
		this.el      = options.el;
		this.visible = options.visible;
		
		// Note: PeriodicPoller uses this.models hash.
		this.models = {};
		this.view   = undefined;
	}
	
	remove() {
		console.log('remove InfluxController!');
		
		super.remove();
		
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		Object.keys(this.models).forEach(key => {
			if (key === 'InfluxModel') {
				this.master.modelRepo.remove(key);
			}
			this.models[key].unsubscribe(this);
		});
	}
	
	hide() {
		super.hide();
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		if (this.visible) {
			if (this.view) {
				this.view.render();
				// Start polling all timers for THIS CONTROLLER:
				this.startPollers();
			}
		}
	}
	
	activate(tab) {
		if (this.name === tab) {
			console.log(['Restore Open tab ',tab]);
			setTimeout(() => {
				this.visible = true;
				this.show();
			}, 100);
		} else {
			this.visible = false;
			this.hide();
		}
	}
	
	notify(options){
		if (options.model==='MenuModel' && options.method==='restored') {
			this.activate(options.tab);
			
		} else if (options.model==='MenuModel' && options.method==='selected') {
			this.activate(options.tab);
		}
	}
	
	forceLogout() {
		this.master.forceLogout();
	}
	
	init() {
		const influxModel = new InfluxModel({name:'InfluxModel',src:'TBD'});
		if (influxModel) {
			this.master.modelRepo.add('InfluxModel',influxModel);
			influxModel.subscribe(this);
			this.models['InfluxModel'] = influxModel;
		}
		
		const menuModel = this.master.modelRepo.get('MenuModel');
		if (menuModel) {
			menuModel.subscribe(this);
			this.models['MenuModel'] = menuModel;
		}
		// See: PeriodicPoller.js
		this.timers['InfluxView'] = {timer: undefined, interval: 1000, models:['InfluxModel']};
		
		this.view = new InfluxView(this);
	}
}
