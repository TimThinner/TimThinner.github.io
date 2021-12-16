/*
timers have hash key (unique name) which maps to object containing timer, interval (in ms) and array of model names.
For example:
timers['MyView'] = {timer:undefined, interval: 60000, models:['MyTemperatureModel']}
*/
export default class PeriodicPoller {
	
	constructor(options) {
		this.master  = options.master;
		this.timers = {};
	}
	
	getInterval(name) {
		let interval = 0;
		if (this.timers.hasOwnProperty(name)) {
			interval = this.timers[name].interval;
		}
		return interval;
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
					console.log(['Poller fetch ONCE model key=',key]);
					this.models[key].fetch();
				});
			}
		}
	}
	
	start() {
		Object.keys(this.timers).forEach(key => {
			console.log(['start key=',key]);
			this.poller(key);
		});
	}
	
	stop() {
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
	}
	/* 
		At restart the polling interval can be changed.
	*/
	restart(name, interval) {
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
