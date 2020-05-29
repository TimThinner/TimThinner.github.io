import InfoView from './InfoView.js';
export default class InfoController {
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		//this.models = {};
		this.view      = undefined;
		this.menuModel = undefined;
	}
	
	remove() {
		/*Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});*/
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
	}
	
	hide() {
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		console.log('InfoView Show!!');
		if (this.visible && this.view) {
			this.view.show();
		}
	}
	
	restore() {
		console.log('InfoController restore');
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
	
	init() {
		// Create the Home Model
		/*const model = new HomeModel({name:'HomeModel',src:'placeholder'});
		model.subscribe(this);
		this.master.modelRepo.add('HomeModel',model);
		this.models['HomeModel'] = model;
		*/
		/*
		setTimeout(() => model.fetch(), 200);
		*/
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new InfoView(this);
	}
}
