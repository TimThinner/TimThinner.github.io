import Model from './Model.js';
/*
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
		
	
	Dummy fetch
	fetch() {
		console.log('DUMMY FETCH!');
		this.ready = true;
	}
*/
export default class FlexResultModel extends Model {
	
	constructor(options) {
		super(options);
		
		this.ready = true;
		this.status = 200;
		
		if (typeof options.numberOfDays !== 'undefined') {
			this.numberOfDays = options.numberOfDays;
		} else {
			this.numberOfDays = 31;
		}
		
		this.indicatorStatus = {
			ele_energy: false,
			ele_price: false,
			ele_emissions: false,
			dh_energy: false,
			dh_price: false,
			dh_emissions: false,
			optimization: false
		};
		this.dailyBaskets = {};
		
		// calculateSum() creates a sum of 3 phases and array contains {timestamp, value} -objects
		// convertPriceData() creates an array of {date, price} -objects
		this.ele_cons = []; // array of {timestamp (Date), value} pairs. Value contains electricity consumption sum from PL1,PL2,PL3.
		this.ele_prices = []; // array of {timestamp (Date), value} pairs.
		this.ele_emission_factors = [];
		this.optimizations = [];
		this.dh_cons = [];
	}
	
	copy(prop, arra) {
		this[prop] = [];
		arra.forEach(e=>{
			this[prop].push(e);
		});
		console.log(['prop=',prop,' this[prop]=',this[prop]]);
	}
	
	merge(propa, propb) {
		const val_array = [];
		const arra = this[propa];
		const arrb = this[propb];
		if (arra.length > 0 && arrb.length > 0) {
			console.log('======== MERGE! =========');
			const bucket = {};
			// For all consumption timestamps, check if price exist.
			arra.forEach(e=>{
				const ds = moment(e.timestamp).format();
				bucket[ds] = {};
				bucket[ds]['a'] = e.value;
			});
			arrb.forEach(p=>{
				const ds = moment(p.timestamp).format();
				if (bucket.hasOwnProperty(ds)) {
					bucket[ds]['b'] = p.value;
				}
			});
			Object.keys(bucket).forEach(key=>{
				if (typeof bucket[key].a !== 'undefined' && typeof bucket[key].b !== 'undefined') {
					const c = bucket[key].a * bucket[key].b;
					val_array.push({timestamp: moment(key).toDate(), value:c});
				}
			});
			// NEW: Sort values by the timestamp: oldest first.
			// Sort by date (timestamp is a Date).
			val_array.sort(function(a, b) {
				if (a.timestamp < b.timestamp) {
					return -1;
				}
				if (a.timestamp > b.timestamp) {
					return 1;
				}
				return 0; // dates must be equal
			});
			
		} else {
			console.log('======== NOT READY TO MERGE YET! =========');
		}
		return val_array;
	}
	
	reset() {
		this.ele_cons = [];
		this.ele_prices = [];
		this.ele_emission_factors = [];
		this.optimizations = [];
		this.dh_cons = [];
		
		for (let i=this.numberOfDays; i>0; i--) {
			
			this.indicatorStatus.ele_energy = false;
			this.indicatorStatus.ele_price = false;
			this.indicatorStatus.ele_emissions = false;
			this.indicatorStatus.dh_energy = false;
			this.indicatorStatus.dh_price = false;
			this.indicatorStatus.dh_emissions = false;
			this.indicatorStatus.optimization = false;
			
			const s_date = moment().subtract(i,'days').format('YYYY-MM-DD');
			this.dailyBaskets[s_date] = {
				ele_energy: 0,
				ele_price: 0,
				ele_emissions: 0,
				dh_energy: 0,
				dh_price: 0,
				dh_emissions: 0,
				optimization: 0
			};
		}
		console.log(['FlexResultModel this.dailyBaskets=',this.dailyBaskets]);
	}
	/*	SOURCE								FLAG
		===============================================
		ele_cons						=>	ele_energy
		(ele_prices, ele_cons)			=>	ele_price
		(ele_emission_factors, ele_cons)=>	ele_emissions
		
		dh_cons							=>	dh_energy
		(dh_cons, CONSTANT)				=>	dh_price
		(dh_cons, CONSTANT)				=>	dh_emissions
		
		optimizations					=>	optimization
	*/
	update(flag, array) {
		if (this.indicatorStatus[flag] === false) {
			console.log('FlexResultModel==== Fill in the '+flag+'===============');
			if (array.length > 0) {
				array.forEach(e=>{
					const ds = moment(e.timestamp).format(); // timestamp (date) is a Date object => convert to string.
					const yyyy_mm_dd = ds.slice(0,10);
					// In 'optimization', we do not store sum of all 24 values, 
					// but use only one value instead. We use the value set at 12 o'clock.
					if (flag === 'optimization') {
						const hh = ds.slice(11,13);
						if (hh === '12' && this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] = e.value;
						}
					} else if (flag === 'ele_emissions')  {
						if (this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] += e.value*0.001;
						}
					} else if (flag === 'dh_price')  {
						if (this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] += e.value*0.1135;
						}
					} else if (flag === 'dh_emissions')  {
						if (this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] += e.value*182*0.001;
						}
					} else {
						if (this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] += e.value;
						}
					}
				});
				this.indicatorStatus[flag]= true; // Done!
				console.log(['DONE!!!! FlexResultModel this.dailyBaskets=',this.dailyBaskets]);
			} else {
				console.log('FlexResultModel SOURCE ARRAY NOT READY YET!');
			}
		} else {
			console.log('FlexResultModel ==== '+flag+' IS ALREADY FILLED! ===============');
		}
	}
	/*	SOURCE								FLAG
		===============================================
		ele_cons						=>	ele_energy
		(ele_prices, ele_cons)			=>	ele_price
		(ele_emission_factors, ele_cons)=>	ele_emissions
		
		dh_cons							=>	dh_energy
		(dh_cons, CONSTANT)				=>	dh_price
		(dh_cons, CONSTANT)				=>	dh_emissions
		
		optimizations					=>	optimization
		
		
		MONTHLY SAVINGS:
		
		Energy Cost:
		10 €
		17% decrease
		
		Energy Consumption:
		25kWh
		21% decrease
		
		CO2 Emissions:
		5 kg
		1% decrease
	*/
	calculate(prop) {
		const retval = {
			base: 0,
			opt: 0
		};
		let base_count = 0;
		let opt_count = 0;
		if (prop === 'energy') {
			Object.keys(this.dailyBaskets).forEach(key=>{
				
				if (this.dailyBaskets[key].optimization) {
					retval.opt += (this.dailyBaskets[key].ele_energy + this.dailyBaskets[key].dh_energy);
					opt_count++;
				} else {
					retval.base += (this.dailyBaskets[key].ele_energy + this.dailyBaskets[key].dh_energy);
					base_count++;
				}
			});
		} else if (prop === 'price') {
			Object.keys(this.dailyBaskets).forEach(key=>{
				if (this.dailyBaskets[key].optimization) {
					retval.opt += (this.dailyBaskets[key].ele_price + this.dailyBaskets[key].dh_price);
					opt_count++;
				} else {
					retval.base += (this.dailyBaskets[key].ele_price + this.dailyBaskets[key].dh_price);
					base_count++;
				}
			});
		} else { // if (prop === 'emissions') {
			Object.keys(this.dailyBaskets).forEach(key=>{
				if (this.dailyBaskets[key].optimization) {
					retval.opt += (this.dailyBaskets[key].ele_emissions + this.dailyBaskets[key].dh_emissions);
					opt_count++;
				} else {
					retval.base += (this.dailyBaskets[key].ele_emissions + this.dailyBaskets[key].dh_emissions);
					base_count++;
				}
			});
		}
		if (base_count > 0) {
			retval.base = retval.base/base_count;
		}
		if (opt_count > 0) {
			retval.opt = retval.opt/opt_count;
		}
		console.log(['SAVINGS ARE prop=',prop,' retval=',retval]);
		return retval;
	}
}
