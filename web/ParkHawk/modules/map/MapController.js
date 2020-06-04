import PeriodicPoller from '../common/PeriodicPoller.js';
import MapModel from './MapModel.js';
import MapView from './MapView.js';

export default class MapController extends PeriodicPoller {
	
	constructor(options) {
		super();
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.models = {};
		this.view = undefined;
	}
	
	remove() {
		super.remove(); // See the PeriodicPoller.
		
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
			if (key === 'MapModel') {
				this.master.modelRepo.remove(key);
			}
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
	}
	
	hide() {
		super.hide(); // See the PeriodicPoller.
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		console.log('MapView Show!!');
		if (this.visible && this.view) {
			this.view.render();
			this.startPollers(); // See the PeriodicPoller.
		}
	}
	
	notify(options) {
		if (options.model==='AppDataModel' && (options.method==='tabselected' || options.method==='restored')) {
			console.log(['Open tab ',options.tab]);
			if (this.name === options.tab) {
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
		//console.log('MapController restore');
	}
	
	init() {
		console.log('MapController init');
		
		
		
		const ADM = this.master.modelRepo.get('AppDataModel');
		ADM.subscribe(this);
		this.models['AppDataModel'] = ADM;
		
		const MM = new MapModel({name:'MapModel',src:ADM});
		MM.subscribe(this);
		this.master.modelRepo.add('MapModel',MM);
		this.models['MapModel'] = MM;
		
		// This defines the periodic polling interval (See the PeriodicPoller).
		this.timers['BusStops'] = {timer: undefined, interval: -1, models:['MapModel']};
		
		this.view = new MapView(this);
	}
}
