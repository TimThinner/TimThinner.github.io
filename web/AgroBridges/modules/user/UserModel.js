import Model from '../common/Model.js';
/*
	User has:
		id
		email
		token
		is_superuser
*/
export default class UserModel extends Model {
	
	constructor(options) {
		super(options);
		this.id = undefined;
		this.email = undefined;
		this.token = undefined;
		this.is_superuser = false;
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
	}
	/*
		- how many questions are there?
		- how many questions are completed?
		- what is the status? GREEN (ready = true) or RED (ready = false)?
	*/
	profileVegeState() {
		let retval = {'total':4,'filled':0,'ready':false};
		if (typeof this.profile.Dummy_veggie_farm === 'undefined') {
			// 'undefined' or ''No' or 'Yes'
		} else {
			retval.filled++;
			retval.ready = true;
		}
		if (this.profile.Dummy_lettuce || 
			this.profile.Dummy_fruit_vegetables || 
			this.profile.Dummy_pumpkin || 
			this.profile.Dummy_bulb || 
			this.profile.Dummy_Root || 
			this.profile.Dummy_Cabbage || 
			this.profile.Dummy_Special) {
			
			retval.filled++;
		}
		if (this.profile.vegetables_total > 0) {
			retval.filled++;
		}
		if (this.profile.Hectare_veggies > 0) {
			retval.filled++;
		}
		if (this.profile.Dummy_veggie_farm === 'Yes') {
			// If 'Yes' => check that amounts are given.
			if (this.profile.vegetables_total === 0) {
				retval.ready = false;
			}
			if (this.profile.Hectare_veggies === 0) {
				retval.ready = false;
			}
		}
		return retval;
	}
	/*
		Use "child"-states to determine "parent"-state.
	*/
	profileFarmState() {
		let retval = {'total':5,'filled':0,'ready':false};
		const vegeState = this.profileVegeState();
		if (vegeState.ready===true) {
			retval.filled++;
		}
		retval.ready = vegeState.ready;
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
		this.is_superuser = false;
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
}
