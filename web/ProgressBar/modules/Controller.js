import PeriodicPoller from './PeriodicPoller.js';
import PModel from './PModel.js';
import PView from './PView.js';

export default class Controller extends PeriodicPoller {
	
	constructor(options) {
		
		super(options); // Call PeriodicPoller constructor
		
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		// Note: PeriodicPoller uses this.models hash.
		this.models = {};
		this.view = undefined;
	}
	
	remove() {
		console.log('remove Controller!');
		
		super.remove();
		
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		Object.keys(this.models).forEach(key => {
			if (key === 'PModel') {
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
				this.view.show();
				// Start polling all timers for THIS CONTROLLER:
				this.startPollers();
			}
		}
	}
	
	notify(options) {
		console.log(['Controller notify options=',options]);
	}
	
	init() {
		const model = new PModel({name:'PModel',src:'TBD'});
		if (model) {
			this.master.modelRepo.add('PModel',model);
			model.subscribe(this);
			this.models['PModel'] = model;
			model.fetch();
		}
		// See: PeriodicPoller.js
		//this.timers['PView'] = {timer: undefined, interval: 5000, models:['PModel']};
		this.view = new PView(this);
	}
}
