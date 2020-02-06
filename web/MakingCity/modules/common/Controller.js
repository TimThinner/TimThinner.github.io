export default class Controller {
	
	/*
	Timers are used to fetch (update) data periodically.
	Timers are owned by Controller, and any Controller can initialize one or more timers
	using a syntax like this:
	
	this.timers['DistrictAView'] = {timer: undefined, interval: 30000, models:['StatusModel']};
	
	If there are many charts in one view, a Controller creates a WrapperView, which holds all subviews.
	It is important to notice here that one chart can display data from multiple models, but one chart 
	can have only one timer.
	*/
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.timers = {};
		this.models = {};
		this.view   = undefined;
	}
	
	remove() {
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
			//this.models[key].unsubscribe(this.master);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
	}
	
	hide() {
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		if (this.visible && this.view) {
			this.view.show();
			// Start polling all timers for THIS CONTROLLER:
			this.startPollers();
		}
	}
	
	notify(options) {
		if (options.model==='MenuModel' && options.method==='selected') {
			console.log(['In ',this.name,' selected = ',options.selected]);
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
	
	getPollingInterval(name) {
		if (this.timers.hasOwnProperty(name)) {
			return this.timers[name].interval;
		} 
		return 0;
	}
	
	poller(name) {
		if (this.timers.hasOwnProperty(name)) {
			if (this.timers[name].interval > 0) {
				
				console.log(['POLLER FETCH ',name]);
				this.timers[name].models.forEach(name => {
					this.models[name].fetch();
				});
				
				this.timers[name].timer = setTimeout(()=>{
					this.poller(name);
				}, this.timers[name].interval);
			}
		}
	}
	
	startPollers() {
		Object.keys(this.timers).forEach(key => {
			this.poller(key);
		});
	}
	
	/* 
		User can change the polling interval. It is initially 10 s.
	*/
	changePollingInterval(name, interval) {
		if (this.timers.hasOwnProperty(name)) {
			if (this.timers[name].timer) {
				console.log('Clear old timer...');
				clearTimeout(this.timers[name].timer);
				this.timers[name].timer = undefined;
			}
			this.timers[name].interval = interval;
			this.poller(name);
		}
	}
	
	restore() {
		console.log('Controller restore');
	}
}
