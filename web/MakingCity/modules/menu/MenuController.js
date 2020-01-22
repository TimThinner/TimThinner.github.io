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
				name: 'EXAMPLE',
				timer: undefined,
				interval: 10000
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
					if (name === 'EXAMPLE') {
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
		console.log('MenuController show()!!!!!');
		if (this.visible && this.view) {
			this.view.show();
			this.poller('EXAMPLE'); // Start the timer poller
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
		
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		if (this.visible) {
			this.show(); // Try if this view can be shown right now!
		}
	}
}
