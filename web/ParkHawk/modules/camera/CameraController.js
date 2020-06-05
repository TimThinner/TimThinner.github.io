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
		this.view = undefined;
	}
	
	remove() {
		super.remove(); // See the PeriodicPoller.
		
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
			if (key === 'CameraModel') {
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
		
		const ADM = this.master.modelRepo.get('AppDataModel');
		ADM.subscribe(this);
		this.models['AppDataModel'] = ADM;
		
		const CM = new CameraModel({name:'CameraModel',src:'placeholder'});
		CM.subscribe(this);
		this.master.modelRepo.add('CameraModel',CM);
		this.models['CameraModel'] = CM;
		
		// This defines the periodic polling interval (See the PeriodicPoller).
		// 5mins = 5 x 60s = 300s = 300 000 ms
		this.timers['Cameras'] = {timer: undefined, interval: 300000, models:['CameraModel']};
		
		this.view = new CameraView(this);
	}
}
