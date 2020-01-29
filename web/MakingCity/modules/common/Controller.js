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
		return this.timers[name].interval;
	}
	
	poller(name) {
		if (this.timers[name].interval > 0) {
			console.log(['POLLER FETCH ',name]);
			this.models[name].fetch();
			this.timers[name].timer = setTimeout(()=>{
				this.poller(name);
			}, this.timers[name].interval);
		}
	}
	/* 
		User can change the polling interval. It is initially 10 s.
	*/
	changePollingInterval(name, interval) {
		if (this.timers[name].timer) {
			console.log('Clear old timer...');
			clearTimeout(this.timers[name].timer);
			this.timers[name].timer = undefined;
		}
		this.timers[name].interval = interval;
		this.poller(name);
	}
	
	restore() {
		console.log('Controller restore');
	}
}
