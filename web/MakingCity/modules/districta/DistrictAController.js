import Controller from '../common/Controller.js';
import DistrictAModel from  './DistrictAModel.js';
import DistrictAView from './DistrictAView.js';

export default class DistrictAController extends Controller {
	
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
			this.poller('DistrictAView'); // Start the timer poller
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
	
	init() {
		const model = new DistrictAModel();
		model.subscribe(this);
		model.subscribe(this.master);
		this.master.modelRepo.add('DistrictAModel',model);
		this.models['DistrictAModel'] = model;
		model.fetch();
		
		this.timers['DistrictAView'] = {timer: undefined, interval: 30000, models:['DistrictAModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictAView(this);
		this.show();
	}
}
