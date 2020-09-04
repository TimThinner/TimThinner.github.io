import PeriodicPoller from '../common/PeriodicPoller.js';
import CModel from './CModel.js';
import CView from './CView.js';

export default class CController extends PeriodicPoller {
	
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
		console.log('remove CController!');
		
		super.remove();
		
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		Object.keys(this.models).forEach(key => {
			if (key === 'CModel') {
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
		const cm = new CModel({name:'CModel',src:'TBD'});
		if (cm) {
			this.master.modelRepo.add('CModel',cm);
			cm.subscribe(this);
			this.models['CModel'] = cm;
		}
		
		const mm = this.master.modelRepo.get('MenuModel');
		if (mm) {
			mm.subscribe(this);
			this.models['MenuModel'] = mm;
		}
		// See: PeriodicPoller.js
		this.timers['CView'] = {timer: undefined, interval: 10000, models:['CModel']};
		
		this.view = new CView(this);
	}
}
