import MenuModel from  './MenuModel.js';
import MenuView from './MenuView.js';

export default class MenuController {
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		this.model   = undefined;
		this.view    = undefined;
	}
	
	remove() {
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
	
	/*
		
	*/
	show() {
		if (this.visible && this.view) {
			/* View start calls ScreenOrientationObserver to do 3 things:
					this.mode = undefined;
					this.setResizeHandler();
					this.resize(); // resize now
			*/
			this.view.start();
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
		} else if (options.model==='MenuModel' && options.method==='fetched') {
			if (options.status === 200) {
				this.show();
			} else {
				// TODO: Handle error!
			}
		}
	}
	
	restore() {
		console.log('MenuController restore');
	}
	
	init() {
		this.model = new MenuModel();
		this.model.subscribe(this);
		this.model.subscribe(this.master);
		
		this.master.modelRepo.add('MenuModel',this.model);
		
		this.model.fetch();
		//setTimeout(() => this.model.fetch(), 2000);
		
		this.view = new MenuView(this);
	}
}
