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
				// Feed the UserModel auth-token into fetch call.
				// We also need to know whether REST-API call will be using token or not?
				const um = this.master.modelRepo.get('UserModel');
				const token = um ? um.token : undefined;
				const readkey = um ? um.readkey : undefined;
				//
				// Residents are allowed to fetch their own data. This is secured so that each resident 
				// must be registered using a specific REGCODE, which is associated with a his/her apartment.
				// In registering process a special READKEY is created, and it is unique for each user.
				// The READKEY has startDate and endDate, when it is valid to fetch users data. This is managed 
				// by the administrator.
				// The Timers where READKEY must be used are:
				//   - UserPageView
				//   - UserElectricityView
				//   - UserHeatingView
				//   - UserWaterView
				//
				// The name is name of the timer:
				/*
				if (name==='UserPageView'||name==='UserElectricityView'||name==='UserHeatingView'||name==='UserWaterView') {
					const readkey = um ? um.readkey : undefined;
					const readkeystartdate = um ? um.readkeystartdate : undefined;
					const readkeyenddate = um ? um.readkeyenddate : undefined;
					console.log(['PERIODIC POLLER timername=',name,' interval=',this.timers[name].interval,
						' readkey=',readkey, 'readkeystartdate=',readkeystartdate,' readkeyenddate',readkeyenddate]);
				}
				*/
				this.timers[name].models.forEach(key => {
					console.log(['Poller fetch model key=',key,' token=',token,' readkey=',readkey]);
					this.models[key].fetch(token, readkey);
				});
				this.timers[name].timer = setTimeout(()=>{
					this.poller(name);
				}, this.timers[name].interval);
				
			} else if (this.timers[name].interval == -1) {
				// Fetch only ONCE!
				const um = this.master.modelRepo.get('UserModel');
				const token = um ? um.token : undefined;
				const readkey = um ? um.readkey : undefined;
				/*
				if (name==='UserPageView'||name==='UserElectricityView'||name==='UserHeatingView'||name==='UserWaterView') {
					const readkey = um ? um.readkey : undefined;
					const readkeystartdate = um ? um.readkeystartdate : undefined;
					const readkeyenddate = um ? um.readkeyenddate : undefined;
					console.log(['PERIODIC POLLER timername=',name,' interval=',this.timers[name].interval,
						' readkey=',readkey, 'readkeystartdate=',readkeystartdate,' readkeyenddate',readkeyenddate]);
				}*/
				this.timers[name].models.forEach(key => {
					console.log(['Poller fetch model key=',key,' token=',token,' readkey=',readkey]);
					
					this.models[key].fetch(token, readkey);
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
