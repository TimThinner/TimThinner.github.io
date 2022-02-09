import EventObserver from './EventObserver.js';

export default class PeriodicTimeoutObserver extends EventObserver {
	
	constructor(options) {
		super();
		if (typeof options !== 'undefined' && typeof options.interval !== 'undefined') {
			this.interval = options.interval;
		} else {
			this.interval = 1000; //  The default interval is 1 second.
		}
		this.timer = undefined;
	}
	
	poller() {
		if (this.interval > 0) {
			// Notify all observers.
			//setTimeout(() => this.notifyAll({model:'PeriodicTimeoutObserver',method:'timeout',status:200,message:'OK'}), 100);
			this.notifyAll({model:'PeriodicTimeoutObserver',method:'timeout',status:200,message:'OK'});
			// Set timer to do "timeout" again.
			this.timer = setTimeout(()=>{
				this.poller();
			}, this.interval);
		} else if (this.interval == -1) {
			// Notify all observers ONLY once.
			//setTimeout(() => this.notifyAll({model:'PeriodicTimeoutObserver',method:'timeout',status:200,message:'OK'}), 100);
			this.notifyAll({model:'PeriodicTimeoutObserver',method:'timeout',status:200,message:'OK'});
		}
	}
	
	start() {
		console.log('PeriodicTimeoutObserver start');
		this.poller();
	}
	
	stop() {
		if (this.timer) {
			console.log('PeriodicTimeoutObserver stop');
			clearTimeout(this.timer);
			this.timer = undefined;
		}
	}
	/* 
		At restart the polling interval can be changed.
	*/
	restart(interval) {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = undefined;
		}
		if (typeof interval !== 'undefined') {
			this.interval = interval;
		}
		this.poller();
	}
}
