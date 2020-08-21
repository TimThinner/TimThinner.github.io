import UserModel from '../user/UserModel.js';
import InfluxModel from './InfluxModel.js';
import InfluxView from './InfluxView.js';

export default class InfluxController {
	
	constructor(options) {
		this.name      = options.name;
		this.master    = options.master;
		this.el        = options.el;
		this.visible   = options.visible;
		this.influxModel = undefined;
		this.menuModel = undefined;
		this.view      = undefined;
	}
	
	remove() {
		console.log('remove InfluxController!');
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
		if (this.influxModel) {
			this.master.modelRepo.add('InfluxModel',this.influxModel);
			this.influxModel.subscribe(this);
		}

	}
	
	hide() {
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		if (this.visible) {
			if (this.view) {
				this.view.render();
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
	
	init() {
		
		this.influxModel = new InfluxModel();
		if (this.influxModel) {
			this.master.modelRepo.add('InfluxModel',this.influxModel);
			this.influxModel.subscribe(this);
		}
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		
		this.view = new InfluxView(this);
	}
}
