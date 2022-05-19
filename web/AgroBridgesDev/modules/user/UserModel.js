import Model from '../common/Model.js';
/*
	User has:
		id
		email
		token
		
*/
export default class UserModel extends Model {
	
	constructor(options) {
		super(options);
		this.id = undefined;
		this.email = undefined;
		this.token = undefined;
		
		this.localStorageLabel = 'AgroBridgesUserModel';
		
		this.profile = {
			// FARM LOCATION:
			Country: undefined,
			NUTS3:  undefined,
			Distance_Drive_small: 0,
			Distance_Drive_major: 0,
			
			// FARM INFO:
			Hectare_farm: 0,
			Delivery_month_total: 0,
			Dummy_organic: 'No', // 'Yes'
			
			Cert_Min: false,
			Cert_High: false,
			Cert_uncertified: true,
			
			Harv_farmers_org: false,
			Harv_Clean_Sort_Ref: true,
			
			// FARM VEGETABLES:
			Dummy_veggie_farm: undefined, //'No', // 'Yes'
			
			Dummy_lettuce: false,
			Dummy_fruit_vegetables: false,
			Dummy_pumpkin: false,
			Dummy_bulb: false,
			Dummy_Root: false,
			Dummy_Cabbage: false,
			Dummy_Special: false,
			
			vegetables_total: 0,
			Hectare_veggies: 0,
			
			// FARM ANIMALS:
			Dummy_livestock: undefined, // 'No', // 'Yes'
			
			Number_cows: false,
			Number_goats: false,
			Number_beef: false,
			Number_other_poultry: false,
			Number_layer_Hens: false,
			Number_hogs: false,
			Dummy_spec_hog: false,
			Number_fish: false,
			Dummy_animal_welfare: false,
			Dummy_Beef_2: false,
			
			Dummy_Milk: false,
			Dummy_cheese_normal: false,
			Dummy_cheese_reg_special: false,
			Dummy_Dairy_Products: false,
			Dummy_Beef: false,
			Dummy_special_Beef: false,
			Dummy_raw_milk_only: false,
			
			// FARM FRUITS:
			Dummy_fruit_farm: undefined, //'No', // 'Yes'
			
			Dummy_Stonefruits: false,
			Dummy_Pomefruits: false,
			Dummy_Berries: false,
			Dummy_Citrus: false,
			Dummy_exotic_fruits: false,
			
			fruits_total: 0,
			Hectare_fruits: 0,
			
			// ACTIVITIES:
			Dummy_wholesale: false,
			Dummy_supermarket_regional: false,
			Dummy_supermarket_noregio: false,
			Dummy_farmer_market: false,
			Dummy_farmer_shop: false,
			Dummy_food_assemblies: false,
			Dummy_food_box_delivery: false,
			Dummy_restaurant: false,
			Dummy_public_canteens: false,
			Dummy_no_SFSC: false,
			
			Dummy_commu_supp_agri: false,
			Dummy_Pickyourown: false,
			
			// PRODUCER:
			Likert_welcome_farm: undefined, // 5 scale from "I agree" to "I disagree"
			Likert_consumer_con: undefined  // 5 scale from "I agree" to "I disagree"
		}
		
		this.analysisResult = {};
		this.analysisReady = false;
	}
	
	
	/*
		- how many questions are there?
		- how many questions are completed?
		- what is the status? GREEN (ready = true) or RED (ready = false)?
	*/
	profileLocationState() {
		let retval = {'total':4,'filled':0,'ready':false};
		
		if (typeof this.profile.Country !== 'undefined') {
			retval.filled++;
		}
		if (typeof this.profile.NUTS3 !== 'undefined') {
			retval.filled++;
		}
		if (this.profile.Distance_Drive_small > 0) {
			retval.filled++;
		}
		if (this.profile.Distance_Drive_major > 0) {
			retval.filled++;
		}
		
		if (typeof this.profile.Country !== 'undefined' && 
			typeof this.profile.NUTS3 !== 'undefined' &&
			this.profile.Distance_Drive_small > 0 &&
			this.profile.Distance_Drive_major > 0) {
			
			retval.ready = true;
		}
		return retval;
	}
	
	
	profileInfoState() {
		let retval = {'total':5,'filled':3,'ready':false};
		// 3 questionsa are already filled BY DEFAULT:
		// Dummy_organic: 'No', // 'Yes'
		// Cert_Min: false,
		// Cert_High: false,
		// Cert_uncertified: true,
		// Harv_farmers_org: false,
		// Harv_Clean_Sort_Ref: true,
		
		if (this.profile.Hectare_farm > 0) {
			retval.filled++;
		}
		if (this.profile.Delivery_month_total > 0) {
			retval.filled++;
		}
		
		if (this.profile.Hectare_farm > 0 && this.profile.Delivery_month_total > 0) {
			retval.ready = true;
		}
		return retval;
	}
	/*
		- how many questions are there?
		- how many questions are completed?
		- what is the status? GREEN (ready = true) or RED (ready = false)?
	*/
	profileVegeState() {
		let retval = {'total':4,'filled':0,'ready':false};
		let fillOne = false;
		if (this.profile.Dummy_lettuce || 
			this.profile.Dummy_fruit_vegetables || 
			this.profile.Dummy_pumpkin || 
			this.profile.Dummy_bulb || 
			this.profile.Dummy_Root || 
			this.profile.Dummy_Cabbage || 
			this.profile.Dummy_Special) {
			
			fillOne = true;
		}
		
		if (typeof this.profile.Dummy_veggie_farm === 'undefined') {
			// 'undefined' or ''No' or 'Yes'
		} else {
			retval.filled++;
			if (this.profile.Dummy_veggie_farm === 'No') {
				retval.ready = true;
			} else { // 'Yes' => ready is true ONLY if something is checked AND amounts are given!
				if (fillOne && this.profile.vegetables_total > 0 && this.profile.Hectare_veggies > 0) {
					retval.ready = true;
				}
			}
		}
		if (fillOne) {
			retval.filled++;
		}
		if (this.profile.vegetables_total > 0) {
			retval.filled++;
		}
		if (this.profile.Hectare_veggies > 0) {
			retval.filled++;
		}
		return retval;
	}
	
	/*
		- how many questions are there?
		- how many questions are completed?
		- what is the status? GREEN (ready = true) or RED (ready = false)?
	*/
	profileAnimalsState() {
		let retval = {'total':3,'filled':0,'ready':false};
		let fillOne = false;
		let fillTwo = false;
		if (this.profile.Number_cows || 
			this.profile.Number_goats || 
			this.profile.Number_beef || 
			this.profile.Number_other_poultry || 
			this.profile.Number_layer_Hens || 
			this.profile.Number_hogs || 
			this.profile.Dummy_spec_hog || 
			this.profile.Number_fish || 
			this.profile.Dummy_animal_welfare || 
			this.profile.Dummy_Beef_2) {
			
			fillOne = true;
		}
		if (this.profile.Dummy_Milk || 
			this.profile.Dummy_cheese_normal || 
			this.profile.Dummy_cheese_reg_special || 
			this.profile.Dummy_Dairy_Products || 
			this.profile.Dummy_Beef || 
			this.profile.Dummy_special_Beef || 
			this.profile.Dummy_raw_milk_only) {
			
			fillTwo = true;
		}
		
		if (typeof this.profile.Dummy_livestock === 'undefined') {
			// 'undefined' or ''No' or 'Yes'
		} else {
			retval.filled++;
			if (this.profile.Dummy_livestock === 'No') {
				retval.ready = true;
			} else { // 'Yes' => ready is true ONLY if something is checked!
				if (fillOne || fillTwo) {
					retval.ready = true;
				}
			}
		}
		if (fillOne) {
			retval.filled++;
		}
		if (fillTwo) {
			retval.filled++;
		}
		return retval;
	}
	
	/*
		- how many questions are there?
		- how many questions are completed?
		- what is the status? GREEN (ready = true) or RED (ready = false)?
	*/
	profileFruitsState() {
		let retval = {'total':4,'filled':0,'ready':false};
		let fillOne = false;
		if (this.profile.Dummy_Stonefruits || 
			this.profile.Dummy_Pomefruits || 
			this.profile.Dummy_Berries || 
			this.profile.Dummy_Citrus || 
			this.profile.Dummy_exotic_fruits) {
			
			fillOne = true;
		}
		
		if (typeof this.profile.Dummy_fruit_farm === 'undefined') {
			// 'undefined' or ''No' or 'Yes'
		} else {
			retval.filled++;
			if (this.profile.Dummy_fruit_farm === 'No') {
				retval.ready = true;
			} else { // 'Yes' => ready is true ONLY if something is checked AND amounts are given!
				if (fillOne && this.profile.fruits_total > 0 && this.profile.Hectare_fruits > 0) {
					retval.ready = true;
				}
			}
		}
		if (fillOne) {
			retval.filled++;
		}
		if (this.profile.fruits_total > 0) {
			retval.filled++;
		}
		if (this.profile.Hectare_fruits > 0) {
			retval.filled++;
		}
		return retval;
	}
	
	/*
		Use "child"-states to determine "parent"-state.
	*/
	profileFarmState() {
		let retval = {'total':5,'filled':0,'ready':false};
		
		const locationState = this.profileLocationState();
		if (locationState.ready===true) {
			retval.filled++;
		}
		
		const infoState = this.profileInfoState();
		if (infoState.ready===true) {
			retval.filled++;
		}
		
		const vegeState = this.profileVegeState();
		if (vegeState.ready===true) {
			retval.filled++;
		}
		
		const fruitsState = this.profileFruitsState();
		if (fruitsState.ready===true) {
			retval.filled++;
		}
		
		const animalsState = this.profileAnimalsState();
		if (animalsState.ready===true) {
			retval.filled++;
		}
		// FARM is ready when all subcomponents are ready.
		retval.ready = locationState.ready && infoState.ready && vegeState.ready && fruitsState.ready && animalsState.ready;
		return retval;
	}
	
	profileActivitiesState() {
		let retval = {'total':2,'filled':0,'ready':false};
		let fillOne = false;
		let fillTwo = false;
		
		if (this.profile.Dummy_wholesale ||
			this.profile.Dummy_supermarket_regional ||
			this.profile.Dummy_supermarket_noregio ||
			this.profile.Dummy_farmer_market ||
			this.profile.Dummy_farmer_shop ||
			this.profile.Dummy_food_assemblies ||
			this.profile.Dummy_food_box_delivery ||
			this.profile.Dummy_restaurant ||
			this.profile.Dummy_public_canteens ||
			this.profile.Dummy_no_SFSC) {
			
			fillOne = true;
			retval.filled++;
		}
		if (this.profile.Dummy_commu_supp_agri ||
			this.profile.Dummy_Pickyourown) {
			
			fillTwo = true;
			retval.filled++;
		}
		if (fillOne || fillTwo) {
			retval.ready = true;
		}
		return retval;
	}
	
	profileProducerState() {
		let retval = {'total':2,'filled':0,'ready':false};
		
		if (typeof this.profile.Likert_welcome_farm !== 'undefined') {
			retval.filled++;
		}
		if (typeof this.profile.Likert_consumer_con !== 'undefined') {
			retval.filled++;
		}
		if (typeof this.profile.Likert_welcome_farm !== 'undefined' &&
			typeof this.profile.Likert_consumer_con !== 'undefined') {
			
			retval.ready = true;
		}
		return retval;
	}
	/*
		if mainState is true, then ANALYSIS is active and can be clicked.
	
	*/
	mainState() {
		let retval = {'total':3,'filled':0,'ready':false};
		
		const farmState = this.profileFarmState();
		if (farmState.ready===true) {
			retval.filled++;
		}
		
		const activitiesState = this.profileActivitiesState();
		if (activitiesState.ready===true) {
			retval.filled++;
		}
		
		const producerState = this.profileProducerState();
		if (producerState.ready===true) {
			retval.filled++;
		}
		retval.ready = farmState.ready && activitiesState.ready && producerState.ready;
		return retval;
	}
	
	isLoggedIn() {
		let retval = false;
		if (typeof this.token !== 'undefined') {
			retval = true;
		}
		return retval;
	}
	
	reset() {
		this.id = undefined;
		this.email = undefined;
		this.token = undefined;
	}
	
	store() {
		const status = localStorage.getItem(this.localStorageLabel);
		const new_status = {
			'id': this.id,
			'email': this.email,
			'token': this.token
		};
		if (status == null) {
			// no previous status.
			const encoded = JSON.stringify(new_status);
			localStorage.setItem(this.localStorageLabel, encoded);
		} else {
			// previous status exist.
			localStorage.removeItem(this.localStorageLabel);
			const encoded = JSON.stringify(new_status);
			localStorage.setItem(this.localStorageLabel, encoded);
		}
	}
	
	restore() {
		const status = localStorage.getItem(this.localStorageLabel);
		if (status == null) {
			console.log('No status stored in localStorage.');
		} else {
			// Status exist: Restore current situation from localStorage.
			const stat = JSON.parse(status);
			if (typeof stat.id !== 'undefined')    { this.id = stat.id; }
			if (typeof stat.email !== 'undefined') { this.email = stat.email; }
			if (typeof stat.token !== 'undefined') { this.token = stat.token; }
		}
		
		if (this.isLoggedIn()) {
			// Let the masterController know that user is logged in.
			setTimeout(() => this.notifyAll({model:'UserModel',method:'login',status:200,message:'Login OK'}), 100);
		} else {
			this.reset();
			this.store();
		}
	}
	
	
	logout() {
		this.reset();
		this.store(); // Clears the localStorage
		setTimeout(() => this.notifyAll({model:'UserModel',method:'logout',status:200,message:'Logout OK'}), 100);
	}
	
	login(data) {
		setTimeout(() => this.notifyAll({model:'UserModel',method:'login',status:200,message:'OK'}), 100);
	}
	
	signup(data) {
		setTimeout(() => this.notifyAll({model:'UserModel',method:'signup',status:200,message:'OK'}), 100);
	}
	
	updateUserProfile(data) {
		const self = this;
		/*const data = [
			{propName:'Hectare_farm', value:20},
			{propName:'Delivery_month_total', value:3}
		];*/
		const validData = [];
		data.forEach(d => {
			if (Object.keys(self.profile).includes(d.propName)) {
				validData.push(d);
			}
		});
		
		if (this.MOCKUP) {
			// Just update UserModel profile and notify.
			validData.forEach(d => {
				if (Object.keys(this.profile).includes(d.propName)) {
					this.profile[d.propName] = d.value;
				}
			});
			setTimeout(() => this.notifyAll({model:self.name, method:'updateUserProfile', status:200, message:'OK'}), 500);
			
		} else {
			let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
			
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+this.token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			const myPut = {
				method: 'PUT',
				headers: myHeaders,
				body: JSON.stringify(validData)
			};
			const myRequest = new Request(this.backend + '/users/'+this.id, myPut);
			fetch(myRequest)
				.then(function(response){
					status = response.status;
					return response.json();
				})
				.then(function(myJson){
					if (status === 200) {
						validData.forEach(d => {
							if (Object.keys(self.profile).includes(d.propName)) {
								self.profile[d.propName] = d.value;
							}
						});
						//self.store();
					}
					self.notifyAll({model:self.name, method:'updateUserProfile', status:status, message:myJson.message});
				})
				.catch(function(error){
					self.notifyAll({model:self.name, method:'updateUserProfile', status:status, message:error});
				});
		}
	}
	
	runAnalysis(data) {
		const self = this;
		this.analysisReady = false;
		this.analysisResult = {};
		if (this.MOCKUP) {
			setTimeout(() => {
				// After 2 seconds of delay (to simulate analysis delay) fill in the results data.
				this.analysisResult = {
					attractiveness:"medium",
					recommendations:[
						{
						"Sales Channel":"On-Farm Shop (extensively managed, unstaffed)",
						"Business Model":"Face-to-Face",
						"Volume":0.2,
						"Consumer Contact":0.4,
						"Gender Equality":0.645290581,
						"Lower Labor Produce Ratio":0.3125,
						"Lower Carbon Footprint":0.074509829,
						"Chain Added Value":0.694974003,
						"Price Premium":0.729058945
						},
						{
						"Sales Channel":"Post delivery (sales on demand)",
						"Business Model":"Online Trade",
						"Volume":0.2,
						"Consumer Contact":0.2,
						"Gender Equality":0.503006012,
						"Lower Labor Produce Ratio":0.020243,
						"Lower Carbon Footprint":1,
						"Chain Added Value":0.620450607,
						"Price Premium":0.728024819
						},
						{
						"Sales Channel":"Retail store",
						"Business Model":"Retail Trade",
						"Volume":0.4,
						"Consumer Contact":0.4,
						"Gender Equality":0.509018036,
						"Lower Labor Produce Ratio":0.3125,
						"Lower Carbon Footprint":0.504424796,
						"Chain Added Value":0.402079723,
						"Price Premium":0.640124095
						}
					]
				};
				this.analysisReady = true;
				this.notifyAll({model:self.name, method:'runAnalysis', status:200, message:'OK'});
				
			}, 2000);
			
		} else {
			// Send a command to start analysis for this User (id= ) 
			let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
			
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+this.token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			const myPost = {
				method: 'POST',
				headers: myHeaders,
				body: JSON.stringify(data)
			};
			const myRequest = new Request(this.backend + '/analysis/'+this.id, myPost);
			fetch(myRequest)
				.then(function(response){
					status = response.status;
					return response.json();
				})
				.then(function(myJson){
					//if (status === 200) {
					//	
					//}
					self.notifyAll({model:self.name, method:'runAnalysis', status:status, message:myJson.message});
				})
				.catch(function(error){
					self.notifyAll({model:self.name, method:'runAnalysis', status:status, message:error});
				});
		}
	}
}
