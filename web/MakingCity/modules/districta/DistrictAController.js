import DistrictAModel from  './DistrictAModel.js';
import DistrictAView from './DistrictAView.js';

export default class DistrictAController {
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		this.model   = undefined;
		this.view    = undefined;
		this.menuModel = undefined;
	}
	
	show() {
		if (this.visible && this.view) {
			this.view.show();
		}
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		if (this.model) {
			this.model.unsubscribe(this);
			this.model.unsubscribe(this.master);
		}
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
	}
	
	hide() {
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
	
	restore() {
		console.log('DistrictAController restore');
	}
	
	init() {
		this.model = new DistrictAModel();
		this.model.subscribe(this);
		this.model.subscribe(this.master);
		
		this.master.modelRepo.add('DistrictAModel',this.model);
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictAView(this);
		
		this.model.fetch();
		this.show();
	}
}
