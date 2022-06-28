import Model from '../common/Model.js';
/*
	User has:
		id
		email
		token
		
		
		
		TODO:
		
		
*/
export default class UserModel extends Model {
	
	constructor(options) {
		super(options);
		this.id = 'prod_nl_1'; //undefined;
		this.email = undefined;
		this.token = undefined;
		
		//this.localStorageLabel = 'AgroBridgesUserModel';
		this.profile = {
			// FARM LOCATION:
			Country: undefined,
			NUTS3:  undefined,
			Distance_Drive_small: 0,
			Distance_Drive_major: 0,
			
			Distance_Drive_minor_kat1: true,  // < 31 mins
			Distance_Drive_minor_kat2: false, // 31-60
			Distance_Drive_minor_kat3: false, // 61-90
			Distance_Drive_minor_kat4: false, // 91-120
			Distance_Drive_minor_kat5: false, // > 120 
			
			Distance_Drive_major_kat1: true,  // < 31 mins
			Distance_Drive_major_kat2: false, // 31-60
			Distance_Drive_major_kat3: false, // 61-90
			Distance_Drive_major_kat4: false, // 91-120
			Distance_Drive_major_kat5: false, // > 120 
			
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
			//Hectare_veggies: 0,
			
			// FARM ANIMALS:
			Dummy_livestock: undefined, // 'No', // 'Yes'
			
			Dummy_Cows: false,
			Dummy_Layer_Hens: false,
			Dummy_Fish: false,
			Other_animals: false,
		
			Dummy_raw_milk_only: false,
			Dummy_Milk: false,
			Dummy_Dairy_Products: false,
			Dummy_Beef: false,
			Dummy_animal_welfare: false,
			Dummy_spec_beef: false,
			Dummy_cheese_reg_special: false,
			/*
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
			*/
			
			// FARM FRUITS:
			Dummy_fruit_farm: undefined, //'No', // 'Yes'
			
			Dummy_Stonefruits: false,
			Dummy_Pomefruits: false,
			Dummy_Berries: false,
			Dummy_Citrus: false,
			Dummy_exotic_fruits: false,
			
			fruits_total: 0,
			//Hectare_fruits: 0,
			
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
		this.analysis_simulation_backup = {
			"result_text": {
				"Intro_Definition_Business_Models": "Five business models can be differentiated for the Short Food Supply Chain. These are Consumer Supported Agriculture (CSA), Face-to-Face Sales, Retail Trade, Online Trade, and Improved Logistics. They can be defined as follows:",
				"Definition_CSA": "Definition CSA: Producers and consumers have a pre-existing agreement where consumers pay an agreed membership fee or offer labour services (or both), in exchange for produce. Two sales channels of the business model are considered in the analysis: A) CSA -\u00a0 Trading working hours for a share of the harvest, B) CSA - Subscription - payment of an annual fee for a share of the harvest",
				"Definition_Face_2_Face": "Definition Face-to-Face Trade: Consumer purchases a product directly from the producer/processor on a face-to-face basis.\u00a0Three sales channels of the business model are considered in the analysis: A) Farm shops, B) Farmers markets, C) Pick your own",
				"Definition_Online_Trade": "Definition Online Trade: Products are traded online using websites of farmers or shared marketing websites.\u00a0We consider two different sales channels: A) Online Food Trade - Post box delivery, B) Online Food Trade - Box scheme subscription & Direct Delivery",
				"Definition_Retail_Trade": "Definition Retail Trade: Products are produced and retailed in the specific region of production, and consumers are made aware of the \u2018local\u2019 nature of the product at the point of sale.\u00a0The sales channels considered in the analysis is: Retail Store -\u00a0 the origin is highlighted",
				"Definition_Improved_Logistics": "Definition Improved Logistics: Selling products to producers organisations, food hubs or other distributors, enables farmers to benefit from improved logistics by sharing costs and pooling resources for distribution. This way larger quantities can be sold to channels like supermarket chains. This business model is always considered to be an option and not part of the ranking procedure.",
				"More_Info_Business_Models": "More information about the five business models e.g. practice cases can be found here: Link",
				"Result1_Models_Considered": "The following business models and sales channels were considered in your analysis:",
				"How_calculated": "How where the results calculated? The ranking is based on a set of sustainability criteria. The sales channel that reaches the economic, environmental and social criteria best is considered to be the most suitable option and ranked first. The graphics show to which extent the SFSC sales channels meet the different criteria.",
				"Describtion_Spiderweb": "As you can see the SFSC enable you to reach higher prices (price premium), but they are labor-intensive (labor to produce ratio), which reduces profit and usually only enable you to sell smaller quantities (volume) in comparison to wholesale.",
				"Intro_not_all_sales_channels_con": "Not all sales channels were considered. Why? Some business models were excluded, because they were considered to be less suitable for your farm or in your region. Reasons for this are farms or regional characteristics (e.g. how attractive your region is for sales).",
				"Relative_Attractiveness": "The relative attractiveness of your region was considered to be:",
				"Suitability_farm_Characterstics": "This relative attractiveness in the model depends on the population density and the income of the inhabitants. If you would like to learn more about farms or regional characteristics, and how these affect the suitability of the business models, please follow this Link.",
				"Disclaimer_Header": "Disclaimer",
				"Disclaimer": "The success of the different business models and their associated sales channels depends on multiple factors and some of them are not considered in the model e.g. the effect of marketing or negotiation skills. Additionally, the expected sales volumes and profits are based on average values. In reality, these might vary across regions and for different products. You are, therefore, advised to make careful investment calculations, before engaging in any of the business models. The responsibility for the decision and its consequences remain with you.",
				"rank_intro1_id": "Our analysis shows that the sales channels can be ranked as follows. The most suitable channel is ranked first:",
				"rank_intro2_id": "Improved logistics is also an option for you. It is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms."
			},
			"recommendation": [
				{
					"Business_Model": "Online_Trade",
					"Sales_Channel": "Online_Sales_Post",
					"Ranking": 1,
					"Volume": 0.2,
					"Price_Premium": 0.73,
					"Chain_Added_Value": 0.62,
					"Carbon_Footprint": 1.0,
					"Labor_Produce": 0.02,
					"Gender_Equality": 0.5,
					"Consumer_Contact": 0.2,
					"business_model_title": "Online Trade",
					"sales_channel_title": "Post delivery (sales on demand)"
				},
				{
					"Business_Model": "Retail_Trade",
					"Sales_Channel": "Retail_Store",
					"Ranking": 2,
					"Volume": 0.4,
					"Price_Premium": 0.64,
					"Chain_Added_Value": 0.4,
					"Carbon_Footprint": 0.5,
					"Labor_Produce": 0.31,
					"Gender_Equality": 0.51,
					"Consumer_Contact": 0.4,
					"business_model_title": "Retail Trade",
					"sales_channel_title": "Retail Store"
				},
				{
					"Business_Model": "Face-to-Face",
					"Sales_Channel": "On_Farm_Shop_extensive",
					"Ranking": 3,
					"Volume": 0.2,
					"Price_Premium": 0.73,
					"Chain_Added_Value": 0.69,
					"Carbon_Footprint": 0.07,
					"Labor_Produce": 0.31,
					"Gender_Equality": 0.65,
					"Consumer_Contact": 0.4,
					"business_model_title": "Face-to-Face",
					"sales_channel_title": "On-Farm Shop (extensively managed, unstaffed)"
				}
			],
			"rec_additional_text": {},
			"diagram_dimension_labels": [
				{
					"var_name": "Volume",
					"title": "Volume ",
					"definition": null
				},
				{
					"var_name": "Price_Premium",
					"title": "Price Premium",
					"definition": "Calculated from the difference between the average farmgate price in the chain and the average farm gate price in the region. Price Premium = Price Difference at the farm gate (Euro per kg) / Average farmgate to retail price in the region"
				},
				{
					"var_name": "Chain_Added_Value",
					"title": "Chain Added Value",
					"definition": "The chain value-added is based on the difference to the average farm gate price, but considers distribution costs as well. Chain value added (Euro per kg) = Price Difference at Farm Gate - Distribution Costs . The distribution costs contain costs of transport, packaging, marketing fees, and payments to distributors."
				},
				{
					"var_name": "Carbon_Footprint",
					"title": "Carbon Footprint",
					"definition": "Measures greenhouse gas emissions (GHG) from the process of transportation. The value is based on food miles. Retail channels that require cooling show an increase in fuel consumption to account for their higher environmental impact."
				},
				{
					"var_name": "Labor_Produce",
					"title": "Labor Produce",
					"definition": "Reflects the number of working hours used in the respective chain for the distribution process (transport, loading, and sales by the farmer). Labor to produce ratio= ((working hours for preparing the sale per delivery + working hours for transport + working hours for selling) * Number of deliveries) / sales volume per channel (kg)"
				},
				{
					"var_name": "Gender_Equality",
					"title": "Gender Equality",
					"definition": "Measures the share of working hours by women in the distribution process.Gender Equality = hours worked by women in the distribution process / total labor input for distribution (h) *100"
				},
				{
					"var_name": "Consumer_Contact",
					"title": "Consumer Contact",
					"definition": null
				}
			],
			"comparison": {
				"Business_Model": "Wholesale_Trade",
				"Sales Channel": "Wholesale_Market",
				"Volume": 1,
				"Price_Premium": 0.24,
				"Chain_Added_Value": 0.09,
				"Carbon_Footprint": 0.27,
				"Labor_Produce": 1,
				"Gender_Equality": 0.5,
				"Consumer_Contact": 0.2,
				"business_model_title": "Wholesale",
				"sales_channel_title": "Wholesale "
			},
			"Region_Attractiveness": {
				"Relative_Attractiveness": "The relative attractiveness of your region was considered to be:",
				"value": "medium"
			}
		};
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
		/*
		if (this.profile.Distance_Drive_small > 0) {
			retval.filled++;
		}
		if (this.profile.Distance_Drive_major > 0) {
			retval.filled++;
		}*/
		// NOTE: if we have default selections for radiobuttons => they are always ready.
		retval.filled+=2;
		
		if (typeof this.profile.Country !== 'undefined' && 
			typeof this.profile.NUTS3 !== 'undefined') {
			//this.profile.Distance_Drive_small > 0 &&
			//this.profile.Distance_Drive_major > 0) {
			
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
				if (fillOne && this.profile.vegetables_total > 0) { // && this.profile.Hectare_veggies > 0) {
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
		//if (this.profile.Hectare_veggies > 0) {
		//	retval.filled++;
		//}
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
		
		if (this.profile.Dummy_Cows || 
			this.profile.Dummy_Layer_Hens ||
			this.profile.Dummy_Fish ||
			this.profile.Other_animals) {
		/*
		if (this.profile.Number_cows || 
			this.profile.Number_goats || 
			this.profile.Number_beef || 
			this.profile.Number_other_poultry || 
			this.profile.Number_layer_Hens || 
			this.profile.Number_hogs || 
			this.profile.Dummy_spec_hog || 
			this.profile.Number_fish || 
			this.profile.Dummy_animal_welfare || 
			this.profile.Dummy_Beef_2) {*/
			
			fillOne = true;
		}
		
		if (this.profile.Dummy_raw_milk_only ||
			this.profile.Dummy_Milk ||
			this.profile.Dummy_Dairy_Products ||
			this.profile.Dummy_Beef ||
			this.profile.Dummy_animal_welfare ||
			this.profile.Dummy_spec_beef ||
			this.profile.Dummy_cheese_reg_special) {
		/*
		if (this.profile.Dummy_Milk || 
			this.profile.Dummy_cheese_normal || 
			this.profile.Dummy_cheese_reg_special || 
			this.profile.Dummy_Dairy_Products || 
			this.profile.Dummy_Beef || 
			this.profile.Dummy_special_Beef || 
			this.profile.Dummy_raw_milk_only) {*/
			
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
				if (fillOne && this.profile.fruits_total > 0) { // && this.profile.Hectare_fruits > 0) {
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
		//if (this.profile.Hectare_fruits > 0) {
			//retval.filled++;
		//}
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
	/*
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
	*/
	
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
		const validData = {};
		data.forEach(d => {
			if (Object.keys(self.profile).includes(d.propName)) {
				validData[d.propName] = d.value;
			}
		});
		validData['user_id'] = this.id;
		
		console.log(['updateUserProfile validData=',validData]);
		
		if (this.MOCKUP) {
			
			setTimeout(() => this.notifyAll({model:self.name, method:'updateUserProfile', status:200, message:'OK'}), 500);
			
		} else {
			let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
			
			const myHeaders = new Headers();
			if (typeof this.token !== 'undefined') {
				const authorizationToken = 'Bearer '+this.token;
				myHeaders.append("Authorization", authorizationToken);
			}
			myHeaders.append("Content-Type", "application/json");
			
			const myPost = {
				method: 'POST',
				headers: myHeaders,
				body: JSON.stringify(validData)
			};
			//const myRequest = new Request(this.backend + '/users/'+this.id, myPut);
			const myRequest = new Request(this.backend + '/update_user_data', myPost);
			fetch(myRequest)
				.then(function(response){
					status = response.status;
					return response.json();
				})
				.then(function(myJson){
					let msg = "OK";
					console.log(['myJson=',myJson]);
					if (typeof myJson.message !== 'undefined') {
						msg = myJson.message;
					}
					self.notifyAll({model:self.name, method:'updateUserProfile', status:status, message:msg});
				})
				.catch(function(error){
					let msg = "Error: ";
					if (typeof error.message !== 'undefined') {
						msg += error.message;
					} else {
						msg += 'NOT SPECIFIED in error.message.';
					}
					self.notifyAll({model:self.name, method:'updateUserProfile', status:status, message:msg});
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
				this.analysisResult = this.analysis_simulation_backup;
				/*
				this.analysisResult = {
					attractiveness:"medium",
					recommendations:[
						{
					"Business_Model": "Online_Trade",
					"Sales_Channel": "Online_Sales_Post",
					"Ranking": 1,
					"Volume": 0.2,
					"Price_Premium": 0.73,
					"Chain_Added_Value": 0.62,
					"Carbon_Footprint": 1.0,
					"Labor_Produce": 0.02,
					"Gender_Equality": 0.5,
					"Consumer_Contact": 0.2,
					"business_model_title": "Online Trade",
					"sales_channel_title": "Post delivery (sales on demand)"
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
						},
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
						}
					]
				};*/
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
			//const myRequest = new Request(this.backend + '/analysis/'+this.id, myPost);
			const myRequest = new Request(this.backend + '/analysis', myPost);
			fetch(myRequest)
				.then(function(response){
					status = response.status;
					return response.json();
				})
				.then(function(myJson){
					let msg = "OK";
					console.log(['myJson=',myJson]);
					if (typeof myJson.message !== 'undefined') {
						msg = myJson.message;
					}
					self.analysisResult = JSON.parse(myJson);
					self.notifyAll({model:self.name, method:'runAnalysis', status:status, message:myJson.message});
				})
				.catch(function(error){
					let msg = "Error: ";
					if (typeof error.message !== 'undefined') {
						msg += error.message;
					} else {
						msg += 'NOT SPECIFIED in error.message.';
					}
					self.notifyAll({model:self.name, method:'runAnalysis', status:status, message:msg});
				});
		}
	}
}
