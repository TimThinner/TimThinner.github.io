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
	
	/*
		interval: 'PT15M'	1D
		interval: 'PT30M'	1W
		interval: 'PT60M'	2W
		interval: 'PT2H'	1M
		interval: 'PT12H'	6M
		interval: 'PT24H'	13M
	*/
	adjustSyncMinute(interval, sm) {
		// New: SYNC moment should always be have same intervals, like "HH:00", "HH:15", "HH:30", "HH:45", ...
		// Floor down to closest "QUARTER-HOUR"? OR HALF-HOUR OR FULL-HOUR, depending on MODELS interval.
		//const m1 = (parseInt((sync_minute + 7.5)/15) * 15) % 60;
		//var h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
		//minutes can as well be calculated by using Math.round():
		let m = sm;
		if (interval==='PT15M') {
			m = (Math.floor(sm/15) * 15) % 60;
		} else if(interval==='PT30M') {
			m = (Math.floor(sm/30) * 30) % 60;
		} else if(interval==='PT60M') {
			m = 0;
		} else if(interval==='PT2H') {
			m = 0;
		} else if(interval==='PT12H') {
			m = 0;
		} else if(interval==='PT24H') {
			m = 0;
		}
		console.log(['SYNC MINUTE m=',m]);
		return m;
	}
	adjustSyncHour(interval, sh) {
		let h = sh;
		if (interval==='PT15M') {
			h = sh;
		} else if(interval==='PT30M') {
			h = sh;
		} else if(interval==='PT60M') {
			h = sh;
		} else if(interval==='PT2H') {
			h = (Math.floor(sh/2) * 2) % 24;
		} else if(interval==='PT12H') {
			h = (Math.floor(sh/12) * 12) % 24;
		} else if(interval==='PT24H') {
			h = 0;
		}
		console.log(['SYNC HOUR h=',h]);
		return h;
	}
	
	poller(name) {
		if (this.timers.hasOwnProperty(name)) {
			if (this.timers[name].interval > 0) {
				// Feed the UserModel auth-token into fetch call.
				// We also need to know whether REST-API call will be using token or not?
				const um = this.master.modelRepo.get('UserModel');
				const token = um ? um.token : undefined;
				const readkey = um ? um.readkey : undefined;
				const readkey_startdate = um ? um.readkey_startdate : undefined;
				const readkey_enddate = um ? um.readkey_enddate : undefined;
				const obix_code = um ? um.obix_code : undefined;
				const obix_code_b = um ? um.obix_code_b : undefined;
				const obix_code_c = um ? um.obix_code_c : undefined;
				//
				// Residents are allowed to fetch their own data. This is secured so that each resident 
				// must be registered using a specific REGCODE, which is associated with a his/her apartment.
				// In registering process a special READKEY is created, and it is unique for each user.
				// The READKEY has startDate and endDate, when it is valid to fetch users data. This is managed 
				// by the administrator.
				//
				const now = moment();
				let sync_minute = now.minutes(); // Returns a number from 0 to 59
				let sync_hour = now.hours();
				
				this.timers[name].models.forEach(key => {
					//console.log(['Poller fetch model key=',key,' token=',token,' readkey=',readkey,' obix_code=',obix_code]);
					if (typeof this.models[key].interval !== 'undefined') {
						sync_minute = this.adjustSyncMinute(this.models[key].interval, sync_minute);
						sync_hour = this.adjustSyncHour(this.models[key].interval, sync_hour);
					}
					this.models[key].fetch({
						token: token,
						readkey: readkey,
						readkey_startdate: readkey_startdate,
						readkey_enddate: readkey_enddate,
						obix_code: obix_code,
						obix_code_b: obix_code_b,
						obix_code_c: obix_code_c
					}, sync_minute, sync_hour);
				});
				this.timers[name].timer = setTimeout(()=>{
					this.poller(name);
				}, this.timers[name].interval);
				
			} else if (this.timers[name].interval == -1) {
				// Fetch only ONCE!
				const um = this.master.modelRepo.get('UserModel');
				const token = um ? um.token : undefined;
				const readkey = um ? um.readkey : undefined;
				const readkey_startdate = um ? um.readkey_startdate : undefined;
				const readkey_enddate = um ? um.readkey_enddate : undefined;
				const obix_code = um ? um.obix_code : undefined;
				const obix_code_b = um ? um.obix_code_b : undefined;
				const obix_code_c = um ? um.obix_code_c : undefined;
				
				// When there are multiple models to be fetched, there is usually need to call fetch with THE SAME start time!
				// That is to make sure response has SAME TIMESTAMPS in returned values.
				const now = moment();
				let sync_minute = now.minutes();
				let sync_hour = now.hours();
				
				this.timers[name].models.forEach(key => {
					//console.log(['Poller fetch model key=',key,' token=',token,' readkey=',readkey,' obix_code=',obix_code]);
					if (typeof this.models[key].interval !== 'undefined') {
						sync_minute = this.adjustSyncMinute(this.models[key].interval, sync_minute);
						sync_hour = this.adjustSyncHour(this.models[key].interval, sync_hour);
					}
					this.models[key].fetch({
						token: token,
						readkey: readkey,
						readkey_startdate: readkey_startdate,
						readkey_enddate: readkey_enddate,
						obix_code: obix_code,
						obix_code_b: obix_code_b,
						obix_code_c: obix_code_c
					}, sync_minute, sync_hour);
				});
			}
		}
	}
	
	startPollers() {
		Object.keys(this.timers).forEach(key => {
			console.log(['startPollers key=',key]);
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
