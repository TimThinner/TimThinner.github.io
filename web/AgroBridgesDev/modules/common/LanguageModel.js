import Model from '../common/Model.js';

export default class LanguageModel extends Model {
	constructor(options) {
		super(options);
		this.languages = ['en'];
		this.selected = 'en';
		this.translation = {
			'en':{
				'dummy_yes':'Yes',
				'dummy_no':'No',
				'location_query':'In which country is your farm located?',
				'region_query':'In which region is your farm located?',
				'marketting_channel_query':'Where are you currently selling your products?',
				'offering_query':'Do you already offer',
				'self_desc_query':'How would you describe yourself?',
				'organic_query':'I am an organic farmer',
				'shops_close_query':'Are there many farm shops in close by (5-10 km radius)',
				'distance_drive_small_query':'How long is the driving distance in minutes to the next bigger town (Smaller number of inhabitants with some public facilities but rather limited cultural offerings)?',
				'distance_drive_major_query':'How long is the driving distance in minutes to a major city (Larger number of inhabitants with a large number of public facilities and cultural offerings (e.g. capitals and provincial capitals)?',
				'products_offering_query':'Are you offering these products?',
				'vege_hectare_query':'On how many hectares do you grow vegetables?',
				'fruit_hectare_query':'On how many hectars do you grow fruits?',
				'farm_hectare_query':'How large is your farm in total (in hectares)?',
				'greenhouse_query':'Do you also produce in greenhouses?',
				'delivery_month_total_query':'Over which period could you deliver fresh fruits or vegetables grown at your farm (in months)?',
				'animals_query':'Which animals are you keeping (hobby livestock excluded)?',
				'dairy_products_query':'Are you offering the following products?',
				'fruits_query':'Which of these fruits do you grow?',
				'fruits_how_many_query':'How many different fruits do you approximately grow in total?',
				'vegetables_query':'Which of these vegetables do you grow?',
				'grow_herbs_query':'Do you also grow herbs?',
				'grow_nuts_query':'Do you grow nuts (Walnut, Hazelnut, Marone...)?',
				'quality_cert_query':'Which quality certification standards do you fullfil?',
				'harvest_query':'How do you handle your products after the harvest?',
				'vegetables_how_many_query':'How many different vegetables do you grow in total?',
				'Dummy_fruit_farm':'Fruits',
				'Dummy_veggie_farm':'Vegetables',
				'Dummy_livestock':'Animal Products',
				'Dummy_lettuce':'Lettuce (Cut lettuce, Argula, Spinach, Swiss chard, Endivie...)',
				'Dummy_fruit_vegetables':'Fruitlike vegetables (Tomatoes, Peppers, Eggplant...)',
				'Dummy_pumpkin':'Pumpkins and Courgettes ',
				'Dummy_bulb':'Bulb vegetables (Celeric and Fennel)',
				'Dummy_Root':'Root vegetables and Onions (Potatos, Carrots, Parsnip, Root Parsley, Black Salsify...)',
				'Dummy_Cabbage':'Cabbages (Broccoli, Kohlrabi, red and white cabbage...)',
				'Dummy_Special':'Specialities (Asparagus, Olives, Truffel....)',
				"Dummy_Cows":"Dairy Cows",
				"Dummy_Layer_Hens":"Layer Hens",
				"Dummy_Fish":"Fish",
				"Other_animals": "Others (pigs, poultry, sheep, and goats)",
				"Dummy_raw_milk_only":"Only Raw Milk",
				"Dummy_Milk":"Homogenized and pasteurized milk",
				"Dummy_Dairy_Products":"Milk products (cheese and yogurt...)",
				"Dummy_Beef":"Beef",
				"Dummy_animal_welfare":"Beef from an animal kept under higher animal welfare standards",
				"Dummy_spec_beef":"Beef from animal rarer varieties (Wagyu, Angus...)",
				"Dummy_cheese_reg_special":"Other animal products considered regional specialties (Prosciutto di Parma or Bleu d’Auvergne)",
				'Dummy_Stonefruits':'Stonefruits (Peach, Nectarine, Apricot, Cherries...)',
				'Dummy_Pomefruits':'Pome fruits (Apple, Pear, Quince...)',
				'Dummy_Berries':'Berries (Rapsberries, Strawberries, Blueberries...)',
				'Dummy_Citrus':'Citrus (Orange, Tangerine, Lemon...)',
				'Dummy_exotic_fruits':'Other exotic fruits (Banana, Date, Kiwi, Mango...)',
				'Cert_Min':'I am certified at a lower level (basic hygiene requirements)',
				'Cert_High':'I am highly certified (HACCP and IFS)',
				'Cert_uncertified':'I am uncertified',
				'Harv_farmers_org':'I harvest only, all post-harvest handling steps (e.g. sorting, cleaning and storing) are performed by a farmers organisation or other parties',
				'Harv_Clean_Sort_Ref':'I harvest the products and do the necessary post-harvest handling at farm (e.g. cleaning, sorting, refrigerating)',
				'Self_desc_likert_value_1':'I fully agree',
				'Self_desc_likert_value_2':'I agree',
				'Self_desc_likert_value_3':'I do not know',
				'Self_desc_likert_value_4':'I slightly disagree',
				'Self_desc_likert_value_5':'I fully disagree',
				'Dummy_wholesale':'the wholesale market (or distributors or producers organisations)',
				'Dummy_supermarket_regional':'to supermarkets (the regional origin is highlighted)',
				'Dummy_supermarket_noregio':'to supermarkets (the regional origin is not highlighted)',
				'Dummy_farmer_market':"at farmer's markets",
				'Dummy_farmer_shop':"at my own farmer's shop",
				'Dummy_food_assemblies':'to others (in cooperation with farmer assemblies, other farm shops)',
				'Dummy_food_box_delivery':'online (own delivery or delivered by post)',
				'Dummy_restaurant':'to restaurants',
				'Dummy_public_canteens':'to institutions (canteens of e.g. schools or hospitals)',
				'Dummy_no_SFSC':'none of the above',
				'Dummy_commu_supp_agri':'Fields for community supported agriculture',
				'Dummy_Pickyourown':'Pick your own activities',
				'Likert_welcome_farm':'I like to welcome consumers and tourists at my farm...',
				'Likert_consumer_con':'I enjoy direct consumer contact...',
				
				// New ones here:
				"Intro_Definition_Business_Models_title":"Definitions of business models for Short food Supply chain",
				"Intro_Definition_Business_Models": "Five business models can be differentiated for the Short Food Supply Chain. These are Consumer Supported Agriculture (CSA), Face-to-Face Sales, Retail Trade, Online Trade, and Improved Logistics. They can be defined as follows:",
				"CSA": "Consumer Supported Agriculture",
				"Face-to-Face": "Face-to-Face",
				"Online_Trade": "Online Trade",
				"Retail_Trade": "Retail Trade",
				"Improved_Logistics": "Improved Logistics",
				"Definition_CSA": "Producers and consumers have a pre-existing agreement where consumers pay an agreed membership fee or offer labour services (or both), in exchange for produce. Two sales channels of the business model are considered in the analysis: A) CSA -  Trading working hours for a share of the harvest, B) CSA - Subscription - payment of an annual fee for a share of the harvest",
				"Definition_Face_2_Face": "Consumer purchases a product directly from the producer/processor on a face-to-face basis. Three sales channels of the business model are considered in the analysis: A) Farm shops, B) Farmers markets, C) Pick your own",
				"Definition_Online_Trade": "Products are traded online using websites of farmers or shared marketing websites. We consider two different sales channels: A) Online Food Trade - Post box delivery, B) Online Food Trade - Box scheme subscription & Direct Delivery",
				"Definition_Retail_Trade": "Products are produced and retailed in the specific region of production, and consumers are made aware of the ‘local’ nature of the product at the point of sale. The sales channels considered in the analysis is: Retail Store -  the origin is highlighted",
				"Definition_Improved_Logistics": "Selling products to producers organisations, food hubs or other distributors, enables farmers to benefit from improved logistics by sharing costs and pooling resources for distribution. This way larger quantities can be sold to channels like supermarket chains. This business model is always considered to be an option and not part of the ranking procedure.",
				"More_Info_Business_Models": "More information about the five business models e.g. practice cases can be found here: Link",
				/*
				'Intro_Definition_Business_Models':'Five business models can be differentiated for the Short Food Supply Chain. These are Consumer Supported Agriculture (CSA), Face-to-Face Sales, Online Trade, Retail Trade and Improved Logistics. They can be defined as follows:',
				'Definition_CSA':'Producers and consumers have a pre-existing agreement where consumers pay an agreed membership fee or offer labour services (or both), in exchange for produce. Two sales channels of the business model are considered in the analysis: A) CSA -  Trading working hours for a share of the harvest, B) CSA - Subscription - payment of an annual fee for a share of the harvest',
				'Definition_Face_2_Face':'Consumer purchases a product directly from the producer/processor on a face-to-face basis. Three sales channels of the business model are considered in the analysis: A) Farm shops, B) Farmers markets, C) Pick your own',
				'Definition_Online_Trade':'Products are traded online using websites of farmers or shared marketing websites. We consider two different sales channels: A) Online Food Trade - Post box delivery, B) Online Food Trade - Box scheme subscription & Direct Delivery',
				'Definition_Retail_Trade':'Products are produced and retailed in the specific region of production, and consumers are made aware of the ‘local’ nature of the product at the point of sale. The sales channels considered in the analysis is: Retail Store -  the origin is highlighted',
				'Definition_Improved_Logistics':'Selling products to producers organisations, food hubs or other distributors, enables farmers to benefit from improved logistics by sharing costs and pooling resources for distribution. This way larger quantities can be sold to channels like supermarket chains. This business model is always considered to be an option and not part of the ranking procedure.',
				'More_Info_Business_Models':'More information about the five business models e.g. practice cases can be found here: Link',
				*/
				
				// New ones here:
				"Relative_Attractiveness": "The relative attractiveness of your region was considered to be:",
				"Result1_Models_Considered": "The following business models and sales channels were considered in your analysis:",
				"Result_Farms_more_than_2_suitable": "Our analysis shows that the sales channels can be ranked as follows. The most suitable channel is ranked first:",
				"Results1_farms_no_suitable_channels": "Based on the characteristics of your farm non of the sales channels are considered to be an option for you. Please check the information you entered.",
				"Results1_only_one_channel": "Based on the characteristics of your farm only one of the sales channels is considered to be an option for you and no ranking is possible. This sales channel is:",
				"Results2_Farm_more_2_suitable": "Improved logistics is also an option for you. It is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms.",
				"Results2_farm_no_suitable_Channels": "If the information was correct: Improved Logistics is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by larger farms. Improved logistics is assumed to be suitable for all farmers regardless of their location and their production characteristics.",
				"Results2_only_one_channel": "However, Improved logistics is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms and could be interesting for you.",
				/*
				'Relative_Attractiveness':'The relative attractiveness of your region was considered to be:',
				'Result1_Models_Considered':'The following business models and sales channels were considered in your analysis.',
				'Result_Farms_more_than_2_suitable':'Our analysis shows that the sales channels can be ranked as follows. The most suitable channel is ranked first.',
				'Results2_Farm_more_2_suitable':'<b>Improved logistics</b> is also an option for you. It is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms.',
				'Results1_farms_no_suitable_channels':'Based on the characteristics of your farm non of the sales channels are considered to be an option for you. Please check the information you entered.',
				'Results2_farm_no_suitable_Channels':'If the information was correct: Improved Logistics is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by larger farms. Improved logistics is assumed to be suitable for all farmers regardless of their location and their production characteristics.',
				'Results1_only_one_channel':'Based on the characteristics of your farm only one of the sales channels is considered to be an option for you and no ranking is possible. This sales channel is:',
				'Results2_only_one_channel':'However, Improved logistics is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms and could be interesting for you.',
				*/
				
				"Volume":"Volume",
				"Volume_Definition":"",
				"Price_Premium":"Price Premium",
				"Price_Premium_Definition":"Calculated from the difference between the average farmgate price in the chain and the average farm gate price in the region. Price Premium = Price Difference at the farm gate (Euro per kg) / Average farmgate to retail price in the region",
				"Chain_Added_Value":"Chain Added Value",
				"Chain_Added_Value_Definition":"The chain value-added is based on the difference to the average farm gate price, but considers distribution costs as well. Chain value added (Euro per kg) = Price Difference at Farm Gate - Distribution Costs . The distribution costs contain costs of transport, packaging, marketing fees, and payments to distributors.",
				"Carbon_Footprint":"Carbon Footprint",
				"Carbon_Footprint_Definition":"Measures greenhouse gas emissions (GHG) from the process of transportation. The value is based on food miles. Retail channels that require cooling show an increase in fuel consumption to account for their higher environmental impact.",
				"Labor_Produce":"Labor Produce",
				"Labor_Produce_Definition":"Reflects the number of working hours used in the respective chain for the distribution process (transport, loading, and sales by the farmer). Labor to produce ratio= ((working hours for preparing the sale per delivery + working hours for transport + working hours for selling) * Number of deliveries) / sales volume per channel (kg)",
				"Gender_Equality":"Gender Equality",
				"Gender_Equality_Definition":"Measures the share of working hours by women in the distribution process.Gender Equality = hours worked by women in the distribution process / total labor input for distribution (h) *100",
				"Consumer_Contact":"Consumer Contact",
				"Consumer_Contact_Definition":"",
				
				'How_calculated':'How were the results calculated? The ranking is based on a set of sustainability criteria. The sales channel that reaches the economic, environmental and social criteria best is considered to be the most suitable option and ranked first. The graphics show to which extent the SFSC sales channels meet the different criteria.',
				'Definition_Criteria':'Would you like to know how the criteria are defined? Please follow this Link.',
				'Intro_not_all_sales_channels_con':'Not all sales channels were considered. Why? Some business models were excluded, because they were considered to be less suitable for your farm or in your region. Reasons for this are farms or regional characteristics (e.g. how attractive your region is for sales).',
				'Suitability_farm_Characterstics':'This relative attractiveness in the model depends on the population density and the income of the inhabitants. If you would like to learn more about farms or regional characteristics, and how these affect the suitability of the business models, please follow this Link.',
				'Disclaimer_Header':'Disclaimer',
				'Disclaimer':'The success of the different business models and their associated sales channels depends on multiple factors and some of them are not considered in the model e.g. the effect of marketing or negotiation skills. Additionally, the expected sales volumes and profits are based on average values. In reality, these might vary across regions and for different products. You are, therefore, advised to make careful investment calculations, before engaging in any of the business models. The responsibility for the decision and its consequences remain with you.',
				'Additional_Info_PickU':'The harvesting labor saved by Pick Your Own is not reflected in the Labor to Produce Ratio. The Labor to Produce Ratio only considered Labor Requirements for Sales. ',
				'Describtion_Spiderweb':'As you can see the SFSC enable you to reach higher prices (price premium), but they are labor-intensive (labor to produce ratio), which reduces profit and usually only enable you to sell smaller quantities (volume) in comparison to wholesale.',
				'region_low':'low',
				'region_medium':'medium',
				'region_high':'high',
				'PROFILE_SAVE_OK':'Profile saved OK',
				"Distance_Drive_major_kat1":"<31 minutes",
				"Distance_Drive_major_kat2":"31-60 minutes",
				"Distance_Drive_major_kat3":"61-90 minutes",
				"Distance_Drive_major_kat4":"91-120 minutes",
				"Distance_Drive_major_kat5":">120 minutes",
				"Distance_Drive_minor_kat1":"<31 minutes",
				"Distance_Drive_minor_kat2":"31-60 minutes",
				"Distance_Drive_minor_kat3":"61-90 minutes",
				"Distance_Drive_minor_kat4":"91-120 minutes",
				"Distance_Drive_minor_kat5":">120 minutes",
				'no_database_message':'<b>WAIT for few seconds...</b> if the backend is not running in your machine, we continue after timeout error.'
			}
		}
	}
}
