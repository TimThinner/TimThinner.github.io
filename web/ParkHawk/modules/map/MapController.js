import {MapListModel} from  './MapModel.js';
import MapView from './MapView.js';

export default class MapController {
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		this.mapListModel = undefined;
		this.menuModel    = undefined;
		this.view         = undefined;
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		if (this.mapListModel) {
			this.mapListModel.unsubscribe(this);
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
	
	show() {
		console.log('MapView Show!!');
		if (this.visible && this.view) {
			this.view.render();
		}
	}
	
	notify(options) {
		if (options.model==='MenuModel' && options.method==='restore') {
			
			console.log(['Restore Open tab ',options.tab]);
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
			
		} else if (options.model==='MenuModel' && options.method==='selected') {
			
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
		this.mapListModel = new MapListModel();
		this.mapListModel.subscribe(this);
		
		this.master.modelRepo.add('MapListModel',this.mapListModel);
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		
		this.view = new MapView(this);
		//setTimeout(() => this.mapListModel.fetch(), 100);
	}
}
