import PeriodicPoller from '../common/PeriodicPoller.js';
import CameraModel from './CameraModel.js';
import CameraView from './CameraView.js';

export default class CameraController extends PeriodicPoller {
	
	constructor(options) {
		super();
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.models = {};
		this.view      = undefined;
		this.menuModel = undefined;
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
		console.log('CameraView Show!!');
		if (this.visible && this.view) {
			this.view.show();
			this.startPollers(); // See the PeriodicPoller.
		}
	}
	
	restore() {
		console.log('CameraController restore');
	}
	
	notify(options) {
		if (options.model==='MenuModel' && (options.method==='selected' || options.method==='restored')) {
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
	
	init() {
		const model = new CameraModel({name:'CameraModel',src:'placeholder'});
		model.subscribe(this);
		this.master.modelRepo.add('CameraModel',model);
		this.models['CameraModel'] = model;
		
		// This defines the periodic polling interval.
		this.timers['Cameras'] = {timer: undefined, interval: 1000, models:['CameraModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new CameraView(this);
	}
}
