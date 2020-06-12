import TimetablesView from './TimetablesView.js';
export default class TimetablesController {
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		//this.appDataModel = this.master.modelRepo.get('AppDataModel');
		//this.appDataModel.subscribe(this);
		this.models = {};
		this.view = undefined;
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		//this.appDataModel.unsubscribe(this);
	}
	
	hide() {
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		console.log('TimetablesView Show!!');
		if (this.visible && this.view) {
			this.view.show();
		}
	}
	
	restore() {
		console.log('TimetablesController restore');
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
		console.log('TimetablesController Init');
		
		const ADM = this.master.modelRepo.get('AppDataModel');
		ADM.subscribe(this);
		this.models['AppDataModel'] = ADM;
		
		const MM = this.master.modelRepo.get('MapModel');
		MM.subscribe(this);
		this.models['MapModel'] = MM;
		
		this.view = new TimetablesView(this);
	}
}
