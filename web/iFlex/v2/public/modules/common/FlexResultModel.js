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
		
		if (typeof options.dhEmissionsFactor !== 'undefined') {
			this.dhEmissionsFactor = options.dhEmissionsFactor;
		} else {
			this.dhEmissionsFactor = 182;
		}
		
		if (typeof options.dhPrice !== 'undefined') {
			this.dhPrice = options.dhPrice;
		} else {
			this.dhPrice = 0.1135; // in e/kWh
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
		//this.hourlyBaskets = {};
		
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
	/*
		merge uses properties:
			this.ele_cons
			this.ele_prices
			this.ele_emission_factors
			this.optimizations
			this.dh_cons
	*/
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
		
		this.indicatorStatus.ele_energy = false;
		this.indicatorStatus.ele_price = false;
		this.indicatorStatus.ele_emissions = false;
		this.indicatorStatus.dh_energy = false;
		this.indicatorStatus.dh_price = false;
		this.indicatorStatus.dh_emissions = false;
		this.indicatorStatus.optimization = false;
		
		// 24 x 30 = 720
		
		for (let i=this.numberOfDays; i>0; i--) {
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
			
			/*
			// initialize HOURLY baskets for "raw" data.
			for (let j=0; j<10; j++) {
				const hh_date = s_date + 'T0' + j + ':00';
				this.hourlyBaskets[hh_date] = {
					ele_energy: 0,
					ele_price: 0,
					ele_emissions: 0,
					dh_energy: 0,
					dh_price: 0,
					dh_emissions: 0,
					optimization: 0
				};
			}
			for (let j=10; j<24; j++) {
				const hh_date = s_date + 'T' + j + ':00';
				this.hourlyBaskets[hh_date] = {
					ele_energy: 0,
					ele_price: 0,
					ele_emissions: 0,
					dh_energy: 0,
					dh_price: 0,
					dh_emissions: 0,
					optimization: 0
				};
			}
			*/
			
		}
		console.log(['FlexResultModel this.dailyBaskets=',this.dailyBaskets]);
		//console.log(['FlexResultModel this.hourlyBaskets=',this.hourlyBaskets]);
		// Added raw arrays for FlexView CHARTS.
		/*
		this.raw_ele_energy = [];
		this.raw_ele_price = [];
		this.raw_ele_emissions = [];
		this.raw_dh_energy = [];
		this.raw_dh_price = [];
		this.raw_dh_emissions = [];
		this.raw_optimization = [];
		*/
	}
	
	/*
		This is like update, but we are not using daily baskets, but using 
		original hourly values instead.
		array contains {timestamp:Date ,value:number}
	*/
	/*
	updateHourly(flag, array) {
		
		console.log('FlexResultModel==== Fill in the HOURLY '+flag+'===============');
		if (array.length > 0) {
			
			const DHEF = this.dhEmissionsFactor;
			const DHP = this.dhPrice;
			
			array.forEach(e=>{
				const ds = moment(e.timestamp).format(); // timestamp (date) is a Date object => convert to string.
				//console.log(['ds=',ds]); "2023-01-10T12:00:00+02:00"
				
				const yyyy_mm_ddThh = ds.slice(0,16); // "2023-01-10T12:00"
				if (flag === 'ele_emissions') {
					if (this.hourlyBaskets.hasOwnProperty(yyyy_mm_ddThh)) {
						this.hourlyBaskets[yyyy_mm_ddThh][flag] = e.value*0.001;
					}
				} else if (flag === 'dh_price')  {
					if (this.hourlyBaskets.hasOwnProperty(yyyy_mm_ddThh)) {
						this.hourlyBaskets[yyyy_mm_ddThh][flag] = e.value*DHP;
					}
				} else if (flag === 'dh_emissions')  {
					if (this.hourlyBaskets.hasOwnProperty(yyyy_mm_ddThh)) {
						this.hourlyBaskets[yyyy_mm_ddThh][flag] = e.value*DHEF*0.001;
					}
				} else { // ele_energy or ele_price or dh_energy
					if (this.hourlyBaskets.hasOwnProperty(yyyy_mm_ddThh)) {
						this.hourlyBaskets[yyyy_mm_ddThh][flag] = e.value;
					}
				}
			});
		}
	}
	*/
	
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
				
				const DHEF = this.dhEmissionsFactor;
				const DHP = this.dhPrice;
				
				array.forEach(e=>{
					const ds = moment(e.timestamp).format(); // timestamp (date) is a Date object => convert to string.
					//console.log(['ds=',ds]); "2023-01-10T12:00:00+02:00"
					
					const yyyy_mm_dd = ds.slice(0,10);
					// In 'optimization', we do not store sum of all 24 values, 
					// but use only one value instead. We use the value set at 12 o'clock.
					if (flag === 'optimization') {
						const hh = ds.slice(11,13);
						if (hh === '12' && this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] = e.value;
						}
					} else if (flag === 'ele_emissions') {
						if (this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] += e.value*0.001;
						}
					} else if (flag === 'dh_price')  {
						if (this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] += e.value*DHP;
						}
					} else if (flag === 'dh_emissions')  {
						if (this.dailyBaskets.hasOwnProperty(yyyy_mm_dd)) {
							this.dailyBaskets[yyyy_mm_dd][flag] += e.value*DHEF*0.001;
						}
					} else { // ele_energy or ele_price or dh_energy
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
		
		const base_arr = [];
		const opt_arr = [];
		
		if (prop === 'energy') {
			Object.keys(this.dailyBaskets).forEach(key=>{
				const tot = this.dailyBaskets[key].ele_energy + this.dailyBaskets[key].dh_energy;
				if (this.dailyBaskets[key].optimization) {
					opt_arr.push(tot);
				} else {
					base_arr.push(tot);
				}
			});
		} else if (prop === 'price') {
			Object.keys(this.dailyBaskets).forEach(key=>{
				const tot = this.dailyBaskets[key].ele_price + this.dailyBaskets[key].dh_price;
				if (this.dailyBaskets[key].optimization) {
					opt_arr.push(tot);
				} else {
					base_arr.push(tot);
				}
			});
		} else { // if (prop === 'emissions') {
			Object.keys(this.dailyBaskets).forEach(key=>{
				const tot = this.dailyBaskets[key].ele_emissions + this.dailyBaskets[key].dh_emissions;
				if (this.dailyBaskets[key].optimization) {
					opt_arr.push(tot);
				} else {
					base_arr.push(tot);
				}
			});
		}
		// NOTE: We must make sure that both arrays have equal amount of days in them.
		// The push() method adds one or more elements to the end of an array and returns the new length of the array.
		// The pop() method removes the last element from an array and returns that element.
		const blen = base_arr.length;
		const olen = opt_arr.length;
		if (blen > olen) {
			const diff = blen - olen;
			console.log(['BASE-SET HAS MORE DAYS THAN OPTIMIZED-SET diff=',diff]);
			for (let i=0; i<diff; i++) {
				base_arr.pop();
			}
		} else if (olen > blen) {
			const diff = olen - blen;
			console.log(['OPTIMIZED-SET HAS MORE DAYS THAN BASE-SET diff=',diff]);
			for (let i=0; i<diff; i++) {
				opt_arr.pop();
			}
		}
		console.log(['BEFORE popping baselen=',base_arr.length,' and optlen=',opt_arr.length]);
		while (base_arr.length > 0) {
			retval.base += base_arr.pop();
		}
		while (opt_arr.length > 0) {
			retval.opt += opt_arr.pop();
		}
		
		/*
		if (base_count > 0) {
			retval.base = retval.base/base_count;
		}
		if (opt_count > 0) {
			retval.opt = retval.opt/opt_count;
		}
		*/
		console.log(['SAVINGS ARE prop=',prop,' retval=',retval]);
		return retval;
	}
}
