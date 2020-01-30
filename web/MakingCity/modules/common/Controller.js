export default class Controller {
	constructor() {
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
				console.log(['POLLER FETCH ',name]);
				
				// Here we fetch from one model. 
				// How can we use one timer to fetch multiple models?
				// 
				this.timers[name].models.forEach(name => {
					this.models[name].fetch();
				});
				//this.models[name].fetch();
				
				this.timers[name].timer = setTimeout(()=>{
					this.poller(name);
				}, this.timers[name].interval);
			}
		}
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
