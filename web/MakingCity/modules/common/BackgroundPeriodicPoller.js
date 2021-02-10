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
			//console.log(['BackgroundPoller fetchModel name=',modelName,' token=',token,' readkey=',readkey]);
			const m = this.master.modelRepo.get(modelName);
			if (m) {
				m.fetch(token, readkey);
			}
		}
	}
	
	checkAlarms(modelName) {
		if (modelName === 'UserHeatingMonthModel') {
			
			console.log('CHECK HEATING 30 DAYS LIMITS');
			
			const m = this.master.modelRepo.get(modelName); // Measurement values
			const uam = this.master.modelRepo.get('UserAlarmModel'); // Alarms 
			const UM = this.master.modelRepo.get('UserModel'); // Limits for temperature and humidity
			
			if (m && uam && UM) {
				
				// Clear all Alarms where alarmType starts with "Heating".
				uam.clear('Heating');
				
				const TU = UM.heating_temperature_upper;
				// UM.heating_target_temperature
				const TL = UM.heating_temperature_lower;
				const HU = UM.heating_humidity_upper;
				//UM.heating_target_humidity
				const HL = UM.heating_humidity_lower;
				if (Array.isArray(m.values)) {
					//console.log('============================= max 720 values ============================');
					m.values.forEach((v,i)=>{
						const data = {
							refToUser: UM.id,
							alarmTimestamp: moment(v.time).format('YYYY-MM-DDTHH:mm'),
							severity: 3
						};
						//console.log(['i=',i,' time=',v.time,' temperature=',v.temperature,' humidity=',v.humidity]);
						if (v.temperature > TU) {
							data.alarmType = 'HeatingTemperatureUpperLimit';
							uam.addOne(data, UM.token);
						}
						if (v.temperature < TL) {
							data.alarmType = 'HeatingTemperatureLowerLimit';
							uam.addOne(data, UM.token);
						}
						if (v.humidity > HU) {
							data.alarmType = 'HeatingHumidityUpperLimit';
							uam.addOne(data, UM.token);
						}
						if (v.humidity < HL) {
							data.alarmType = 'HeatingHumidityLowerLimit';
							uam.addOne(data, UM.token);
						}
					});
				}
			}
			
		} else if (modelName === 'UserWaterTSModel') {
			
			console.log('CHECK WATER 30 DAYS LIMITS');
			
			const m = this.master.modelRepo.get(modelName); // Measurement values
			const uam = this.master.modelRepo.get('UserAlarmModel'); // Alarms 
			const UM = this.master.modelRepo.get('UserModel'); // Limits for temperature and humidity
			
			if (m && uam && UM) {
				
				// Clear all Alarms where alarmType starts with "Water".
				uam.clear('Water');
				
				/* Water targets and limits per 24h */
				const WHU = UM.water_hot_upper;
				//this.water_hot_target  = this.DEFAULTS.water_hot_target;
				const WHL = UM.water_hot_lower;
				const WCU = UM.water_cold_upper;
				//this.water_cold_target = this.DEFAULTS.water_cold_target;
				const WCL = UM.water_cold_lower;
				
				//console.log('============================ max 30 values ==================================');
				m.waterValues.forEach((v,i)=>{
					const data = {
						refToUser: UM.id,
						alarmTimestamp: moment(v.time).format('YYYY-MM-DDTHH:mm'),
						severity: 3
					};
					//console.log(['i=',i,' time=',v.time,' hot=',v.hot,' cold=',v.cold]);
					if (v.hot > WHU) {
						data.alarmType = 'WaterHotUpperLimit';
						uam.addOne(data, UM.token);
					}
					if (v.hot < WHL) {
						data.alarmType = 'WaterHotLowerLimit';
						uam.addOne(data, UM.token);
					}
					if (v.cold > WCU) {
						data.alarmType = 'WaterColdUpperLimit';
						uam.addOne(data, UM.token);
					}
					if (v.cold < WCL) {
						data.alarmType = 'WaterColdLowerLimit';
						uam.addOne(data, UM.token);
					}
				});
			}
			
		} else if (modelName === 'UserElectricityTSModel') {
			
			console.log('CHECK ELECTRICITY 30 DAYS LIMITS');
			
			const m = this.master.modelRepo.get(modelName); // Measurement values
			const uam = this.master.modelRepo.get('UserAlarmModel'); // Alarms 
			const UM = this.master.modelRepo.get('UserModel'); // Limits for temperature and humidity
			
			if (m && uam && UM) {
				// Clear all Alarms where alarmType starts with "Energy".
				uam.clear('Energy');
				
				/* Electricity targets and limits per 24h */
				const EU = UM.energy_upper;
				// this.energy_target  = this.DEFAULTS.energy_target;
				const EL = UM.energy_lower;
				
				//console.log('============================== max 30 values ================================');
				m.energyValues.forEach((v,i)=>{
					const data = {
						refToUser: UM.id,
						alarmTimestamp: moment(v.time).format('YYYY-MM-DDTHH:mm'),
						severity: 3
					};
					if (v.energy > EU) {
						data.alarmType = 'EnergyUpperLimit';
						uam.addOne(data, UM.token);
					}
					if (v.energy < EL) {
						data.alarmType = 'EnergyLowerLimit';
						uam.addOne(data, UM.token);
					}
				});
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
					this.fetchModel(options.model);
				}
			} else if (options.method==='fetched-all') {
				if (options.status === 200) {
					console.log(options.model+' FOR ONE MONTH IS NOW READY TO BE CHECKED FOR ALARMS!');
					this.checkAlarms(options.model);
				}
			}
		} else if (options.model==='UserHeatingMonthModel' && options.method==='fetched') {
			if (options.status === 200) {
				console.log(options.model+' FOR ONE MONTH IS NOW READY TO BE CHECKED FOR ALARMS!');
				this.checkAlarms(options.model);
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
					
					// RESET all models.
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
			
			// RESET all models.
			this.timers[key].models.forEach(name => {
				const m = this.master.modelRepo.get(name);
				if (m) { m.reset(); }
			});
			// Start polling
			this.poller(key);
		});
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
}
