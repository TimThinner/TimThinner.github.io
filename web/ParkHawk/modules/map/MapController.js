import PeriodicPoller from '../common/PeriodicPoller.js';
import {MapListModel} from  './MapModel.js';
import MapView from './MapView.js';

export default class MapController extends PeriodicPoller {
	
	constructor(options) {
		super();
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.models    = {};
		this.menuModel = undefined;
		this.view      = undefined;
	}
	
	remove() {
		super.remove(); // See the PeriodicPoller.
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
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
		if (options.model==='MenuModel' && options.method==='selected') {
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
		console.log('MapController restore');
	}
	
	init() {
		const model = new MapListModel({name:'MapListModel',src:'placeholder'});
		model.subscribe(this);
		this.master.modelRepo.add('MapListModel',model);
		this.models['MapListModel'] = model;
		
		// This defines the periodic polling interval (-1 => only once).
		this.timers['MapList'] = {timer: undefined, interval: -1, models:['MapListModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new MapView(this);
	}
}
