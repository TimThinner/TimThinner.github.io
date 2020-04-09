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
	
	/*
		Every Controller must subscribe for "MenuModel" notifications.
		After that all view changes are driven by this code. Note that by using 
		timeout we make all other "VIEWS" hidden before showing the selected one.
	*/
	notify(options) {
		if (options.model==='MenuModel' && options.method==='selected') {
			//console.log(['In ',this.name,' selected = ',options.selected]);
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
				// Feed the UserModel auth-token into fetch call.
				// We also need to know whether REST-API call will be using token or not?
				const um = this.master.modelRepo.get('UserModel');
				const token = um ? um.token : undefined;
				
				//console.log(['POLLER FETCH ',name]);
				this.timers[name].models.forEach(key => {
					console.log(['Poller fetch model key=',key,' token=',token]);
					this.models[key].fetch(token);
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
		
		//console.log(['changePollingInterval name=',name]);
		
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
	
	doPollingInterval(name) {
		if (this.timers.hasOwnProperty(name)) {
			if (this.timers[name].timer) {
				console.log('Clear old timer...');
				clearTimeout(this.timers[name].timer);
				this.timers[name].timer = undefined;
			}
			this.poller(name);
		}
	}
	
	forceLogout() {
		this.master.forceLogout();
	}
	
	restore() {
		console.log('Controller restore');
	}
}
