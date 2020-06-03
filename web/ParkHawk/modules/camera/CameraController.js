import PeriodicPoller from '../common/PeriodicPoller.js';
//import CameraModel from './CameraModel.js';
import CameraView from './CameraView.js';

export default class CameraController extends PeriodicPoller {
	
	constructor(options) {
		super();
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.appDataModel = this.master.modelRepo.get('AppDataModel');
		this.appDataModel.subscribe(this);
		
		this.models = {};
		this.models['AppDataModel'] = this.appDataModel;
		
		this.view = undefined;
	}
	
	remove() {
		super.remove(); // See the PeriodicPoller.
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		this.appDataModel.unsubscribe(this);
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
	
	init() {
		console.log('CameraController Init');
		// This defines the periodic polling interval.
		this.timers['Cameras'] = {timer: undefined, interval:300000, models:['AppDataModel']};
		this.view = new CameraView(this);
	}
}
