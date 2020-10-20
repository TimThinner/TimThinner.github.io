import EventObserver from './EventObserver.js';

export default class PModel extends EventObserver {
	
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
		//this.percentage = 0;
		//this.value = 0;
		this.alldays = 0;
		this.nowdays = 0;
		this.nowdate = moment();//'2020-10-28');//.format('YYYY-MM-DD');
	}
	
	reset() {
		
	}
	
	/*
From and including: Friday, 28 October 1960
To, but not including Monday, 28 April 2025
Result: 23,558 days
It is 23,558 days from the start date to the end date, but not including the end date.
Or 64 years, 6 months excluding the end date.

From and including: Wednesday, 28 October 2020
To, but not including Monday, 28 April 2025
Result: 1643 days

From and including: Friday, 28 October 1960
To, but not including Wednesday, 28 October 2020
Result: 21,915 days

<-------------------------- 23 558  ------------------------------------------->

|-------------------------------------------------------------------|----------|

<---------------------- 21 915 -------------------------------------><-- 1643 ->

21 915 = X/100 * 23 558 => X = 2 191 500 / 23 558 = 93,03% (93,0257)
*/
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	*/
	
	fetch() {
		const self = this;
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.errorMessage = '';
		this.fetching = true;
		
		let start_date = moment('1960-10-28');
		let end_date = moment('2025-04-28');
		//this.nowdate = moment(); //'2020-10-28');//.format('YYYY-MM-DD');
		
		this.alldays = end_date.diff(start_date, 'days');
		this.nowdays = this.nowdate.diff(start_date, 'days');
		//this.percentage = this.todayLived*100/this.bigDifference;
		//this.value = this.percentage*645/100; // 645 => 100%
		
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:200, message:this.errorMessage});
		}, 100);
	}
}
