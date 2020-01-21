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
		this.timers = [
			{
				name: 'POWER',
				timer: undefined,
				interval: 1000
			}
		];
	}
	/*
		NOTE: remove is not called because there is no LOGIN, LOGOUT.
		But it is defined here just in case this implementation includes 
		authentication.
	*/
	remove() {
		console.log('!!!!!!!!! REMOVE !!!!!!!!!!!!');
		this.timers.forEach(item=>{
			if (item.timer) {
				clearTimeout(item.timer);
				item.timer = undefined;
			}
		});
		if (this.model) {
			this.model.unsubscribe(this);
			this.model.unsubscribe(this.master);
		}
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
	}
	
	hide() {
		this.timers.forEach(item=>{
			if (item.timer) {
				clearTimeout(item.timer);
				item.timer = undefined;
			}
		});
		if (this.view) {
			this.view.hide();
		}
	}
	
	poller(name) {
		this.timers.forEach(item=>{
			if (item.name === name) {
				if (item.interval > 0) {
					console.log(['POLLER FETCH ',name]);
					if (name === 'POWER') {
						this.model.fetch();
					} 
					item.timer = setTimeout(()=>{
						this.poller(name);
					}, item.interval);
				}
			}
		});
	}
	
	show() {
		if (this.visible && this.view) {
			/* View start calls ScreenOrientationObserver to do 4 things:
				subscribe view as an observer
				this.mode = undefined;
				this.setResizeHandler();
				this.resize(); // resize now
			*/
			this.view.start();
			/* Start the timer poller */
			this.poller('POWER');
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
		console.log('MenuController restore');
	}
	
	init() {
		this.model = new MenuModel();
		this.model.subscribe(this);
		this.model.subscribe(this.master);
		
		this.master.modelRepo.add('MenuModel',this.model);
		//this.model.fetch();
		//setTimeout(() => this.model.fetch(), 2000);
		this.view = new MenuView(this);
		this.show(); // Try if this view can be shown right now!
	}
}
