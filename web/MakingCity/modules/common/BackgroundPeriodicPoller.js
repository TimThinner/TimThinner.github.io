export default class BackgroundPeriodicPoller {
	
	constructor(options) {
		this.master  = options.master;
		// const backgroundModels = ['UserHeatingMonthModel','UserElectricityTSModel','UserWaterTSModel'];
		this.timers = {};
		this.interval = 10*60*1000; // 10 minutes
		
		options.models.forEach(name=>{
			this.timers[name+'Poller'] = {timer:undefined, interval:this.interval, models:[name]};
			const m = this.master.modelRepo.get(name);
			m.subscribe(this); // Now we will receive notifications from all models.
		});
		this.counter=0;
	}
	
	stop() {
		console.log('STOP BackgroundPollers');
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
	}
	
	fetchModel(modelName) {
		// Feed the UserModel auth-token into fetch call.
		// We also need to know whether REST-API call will be using token or not?
		const um = this.master.modelRepo.get('UserModel');
		const token = um ? um.token : undefined;
		// Residents are allowed to fetch their own data. This is secured so that each resident 
		// must be registered using a specific REGCODE, which is associated with a his/her apartment.
		// In registering process a special READKEY is created, and it is unique for each user.
		// The READKEY has startDate and endDate, when it is valid to fetch users data. This is managed 
		// by the administrator.
		//
		const readkey = um ? um.readkey : undefined;
		if (typeof token !== 'undefined') {
			console.log(['BackgroundPoller fetchModel name=',modelName,' token=',token,' readkey=',readkey]);
			const m = this.master.modelRepo.get(modelName);
			if (m) {
				m.fetch(token, readkey);
			}
		}
	}
	
	/* The models, which should be checked periodically for possible alarms are:
		"UserHeatingMonthModel"			Hourly values for 30 days         is a UserApartmentModel
​​		"UserWaterTSModel"				Daily consumption for 30 days     is a UserApartmentTimeSeriesModel
		"UserElectricityTSModel"		Daily consumption for 30 days     is a UserApartmentTimeSeriesModel
​​	*/
	notify(options) {
		if (options.model==='UserWaterTSModel' || options.model==='UserElectricityTSModel') {
			if (options.method==='fetched') {
				if (options.status === 200) {
					this.counter++;
					//console.log(['CONTROLLER Notify: ',options.model,' fetched!']);
					//console.log(['CALL AGAIN!!!!!!!!!!!!!!!!! count=',this.counter]);
					
					this.fetchModel(options.model);
				}
			}
		}
	}
	
	poller(key) {
		if (this.timers.hasOwnProperty(key)) {
			if (this.timers[key].interval > 0) {
				
				this.timers[key].models.forEach(name => {
					this.fetchModel(name);
				});
				this.timers[key].timer = setTimeout(()=>{
					this.counter=0;
					// RESET the model.
					this.timers[key].models.forEach(name => {
						const m = this.master.modelRepo.get(name);
						if (m) { m.reset(); }
					});
					// Start polling AGAIN AFTER interval.
					this.poller(key);
				}, this.timers[key].interval);
			
			}
		}
	}
	
	start() {
		console.log('START BackgroundPollers');
		Object.keys(this.timers).forEach(key => {
			this.counter=0;
			// RESET the model.
			this.timers[key].models.forEach(name => {
				const m = this.master.modelRepo.get(name);
				if (m) { m.reset(); }
			});
			// Start polling
			this.poller(key);
		});
	}
}
