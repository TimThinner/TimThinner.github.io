
//import {MapListModel} from  './MapModel.js';
import MapView from './MapView.js';

export default class MapController {
	
	constructor(options) {
		//super();
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.appDataModel = this.master.modelRepo.get('AppDataModel');
		this.appDataModel.subscribe(this);
		
		this.view = undefined;
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		this.appDataModel.unsubscribe(this);
	}
	
	hide() {
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		console.log('MapView Show!!');
		if (this.visible && this.view) {
			this.view.render();
		}
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
	
	restore() {
		//console.log('MapController restore');
	}
	
	init() {
		console.log('MapController init');
		this.view = new MapView(this);
	}
}
