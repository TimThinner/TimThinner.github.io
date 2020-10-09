export default class PeriodicPoller {
	
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
		this.master  = options.master;
		this.timers = {};
	}
	
	remove() {
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
	}
	
	hide() {
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
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
				this.timers[name].models.forEach(key => {
					console.log(['Poller fetch model key=',key]);
					this.models[key].fetch();
				});
				this.timers[name].timer = setTimeout(()=>{
					this.poller(name);
				}, this.timers[name].interval);
				
			} else if (this.timers[name].interval == -1) {
				// Fetch only ONCE!
				this.timers[name].models.forEach(key => {
					console.log(['Poller fetch model key=',key]);
					this.models[key].fetch();
				});
				
			}
		}
	}
	
	startPollers() {
		Object.keys(this.timers).forEach(key => {
			this.poller(key);
		});
	}
	
	/* 
		At restart the polling interval can be changed.
	*/
	restartPollingInterval(name, interval) {
		if (this.timers.hasOwnProperty(name)) {
			if (this.timers[name].timer) {
				console.log('Clear old timer...');
				clearTimeout(this.timers[name].timer);
				this.timers[name].timer = undefined;
			}
			if (typeof interval !== 'undefined') {
				this.timers[name].interval = interval;
			}
			this.poller(name);
		}
	}
}
