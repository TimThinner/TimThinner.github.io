import Model from '../common/Model.js';
/*
English			en
Danish			da
Greek			el
Spanish			es
French			fr
Italian			it
Latvian			lv
Lithuanian		lt
Dutch			nl
Polish			pl
Finnish			fi
Turkish			tr
*/
export default class LanguageModel extends Model {
	constructor(options) {
		super(options);
		this.languages = ['en', 'da', 'el',
			'es', 'fr', 'it', 
			'lv', 'lt', 'nl',
			'pl', 'fi', 'tr'];
		this.selected = 'en';
		
		
		this.translation_simulated = {
    "en": {
        "Cert_High": "I am highly certified (HACCP and IFS)",
        "Cert_Min": "I am certified at a lower level (basic hygiene requirements)",
        "Cert_uncertified": "I am uncertified",
        "Distance_Drive_major_kat1": "<31 minutes",
        "Distance_Drive_major_kat2": "31-60 minutes",
        "Distance_Drive_major_kat3": "61-90 minutes",
        "Distance_Drive_major_kat4": "91-120 minutes",
        "Distance_Drive_major_kat5": ">120 minutes",
        "Distance_Drive_minor_kat1": "<31 minutes",
        "Distance_Drive_minor_kat2": "31-60 minutes",
        "Distance_Drive_minor_kat3": "61-90 minutes",
        "Distance_Drive_minor_kat4": "91-120 minutes",
        "Distance_Drive_minor_kat5": ">120 minutes",
        "Dummy_Beef": "Beef",
        "Dummy_Berries": "Berries (Rapsberries, Strawberries, Blueberries...)",
        "Dummy_Cabbage": "Cabbages (Broccoli, Kohlrabi, red and white cabbage...)",
        "Dummy_Citrus": "Citrus (Orange, Tangerine, Lemon...)",
        "Dummy_Cows": "Dairy Cows",
        "Dummy_Dairy_Products": "Milk products (cheese and yogurt...)",
        "Dummy_Fish": "Fish (Fish)",
        "Dummy_Layer_Hens": "Layer Hens",
        "Dummy_Milk": "Homogenized and pasteurized milk",
        "Dummy_Pickyourown": "Pick your own activities",
        "Dummy_Pomefruits": "Pome fruits (Apple, Pear, Quince...)",
        "Dummy_Root": "Root vegetables and Onions (Potatos, Carrots, Parsnip, Root Parsley, Black Salsify...)",
        "Dummy_Special": "Specialities (Asparagus, Olives, Truffel....)",
        "Dummy_Stonefruits": "Stonefruits (Peach, Nectarine, Apricot, Cherries...)",
        "Dummy_animal_welfare": "Beef from an animal kept under higher animal welfare standards",
        "Dummy_bulb": "Bulb vegetables (Celeric and Fennel)",
        "Dummy_cheese_reg_special": "Other animal products considered regional specialties (Prosciutto di Parma or Bleu d’Auvergne)",
        "Dummy_commu_supp_agri": "Fields for community supported agriculture",
        "Dummy_exotic_fruits": "Other exotic fruits (Banana, Date, Kiwi, Mango...)",
        "Dummy_farmer_market": "at farmer's markets",
        "Dummy_farmer_shop": "at my own farmer's shop",
        "Dummy_food_assemblies": "to others (in cooperation with farmer assemblies, other farm shops)",
        "Dummy_food_box_delivery": "online (own delivery or delivered by post)",
        "Dummy_fruit_farm": "Fruits",
        "Dummy_fruit_vegetables": "Fruitlike vegetables (Tomatoes, Peppers, Eggplant...)",
        "Dummy_lettuce": "Lettuce (Cut lettuce, Argula, Spinach, Swiss chard, Endivie...)",
        "Dummy_livestock": "Animal Products",
        "Dummy_no_SFSC": "none of the above",
        "Dummy_organic": "I am an organic farmer",
        "Dummy_public_canteens": "to institutions (canteens of e.g. schools or hospitals)",
        "Dummy_pumpkin": "Pumpkins and Courgettes",
        "Dummy_raw_milk_only": "Only Raw Milk",
        "Dummy_restaurant": "to restaurants",
        "Dummy_spec_beef": "Beef from animal rarer varieties (Wagyu, Angus...)",
        "Dummy_supermarket_noregio": "to supermarkets (the regional origin is not highlighted)",
        "Dummy_supermarket_regional": "to supermarkets (the regional origin is highlighted)",
        "Dummy_veggie_farm": "Vegetables ",
        "Dummy_wholesale": "the wholesale market (or distributors or producers organisations)",
        "Eu_funding": "THIS PROJECT HAS RECEIVED FUNDING FROM THE EUROPEAN UNION’S HORIZON 2020 RESEARCH AND INNOVATION PROGRAMME UNDER GRANT AGREEMENT N° 101000788.",
        "Harv_Clean_Sort_Ref": "I harvest the products and do the necessary  post-harvest handling at farm (e.g. cleaning, sorting, refrigerating)",
        "Harv_farmers_org": "I harvest only, all post-harvest handling steps (e.g. sorting, cleaning and storing) are performed by a farmers organisation or other parties",
        "Likert_consumer_con": "I enjoy direct consumer contact...",
        "Likert_welcome_farm": "I like to welcome consumers and tourist at my farm...",
        "Other_animals": "Others (pigs, poultry, sheep, and goats)",
        "activities_title": "Activities",
        "agree": "I agree",
        "animals_query": "Which animals are you keeping (hobby livestock excluded)?",
        "dairy_products_query": "Are you offering the following products?",
        "delivery_month_total_query": "Over which period could you deliver fresh fruits or vegetables grown at your farm (in months)?",
        "distance_drive_major_query": "How long is the driving distance in minutes to a major city (Larger number of inhabitants with a large number of public facilities and cultural offerings (e.g. capitals and provincial capitals).)?",
        "distance_drive_small_query": "How long is the driving distance in minutes to the next bigger town (Smaller number of inhabitants with some public facilities but rather limited cultural offerings.)?",
        "do_not_know": "I do not know ",
        "dummy_no": "No",
        "dummy_yes": "Yes",
        "farm_animals_title": "Farm animals",
        "farm_fruits_title": "Farm fruits",
        "farm_hectare_query": "How large is your farm in total (in hectares)?",
        "farm_info_title": "Farm Info",
        "farm_location_title": "Farm location",
        "farm_title": "Farm",
        "farm_vegetables_title": "Farm vegetables",
        "fruits_how_many_query": "How many types of different fruit do you approximately grow?",
        "fruits_query": "Which of these fruits do you grow?",
        "fully_agree": "I fully agree",
        "fully_disagree": "I fully disagree",
        "harvest_query": "How do you handle your products after the harvest?",
        "icon_activities": "Activities",
        "icon_analysis": "Analysis",
        "icon_animals": "Animals",
        "icon_farm": "Farm",
        "icon_fruits": "Fruits",
        "icon_info": "Info",
        "icon_location": "Location",
        "icon_producer": "Producer",
        "icon_vegetables": "Vegetables",
        "info_title": "Instructions",
        "language_title": "Select language",
        "location_query": "In which country is your farm located?",
		"main_instruction_1":"Please, fill in the information about the Farm, Farm activities and Producer.",
		"main_instruction_2":"Light red/green boxes indicate if you have completed all mandatory questions.",
		"main_instruction_3":"Once all the mandatory information is filled in, the analysis button in the centre will be activated.",
		"main_instruction_4":"You will receive the analysis about the most suitable business models and sales channels.",
        "main_title": "Decision support tool for farmers",
        "marketing_channel_query": "Where are you currently selling your products?",
        "offering_query": "Do you already offer",
        "organic_query": "I am an organic farmer",
        "producer_title": "Producer",
        "products_offering_query": "Are you offering these products?",
        "quality_cert_query": "Which quality certification standards do you fullfil?",
        "region_query": "In which region is your farm located?",
        "self_desc_likert_consumer_con_query": "I enjoy direct consumer contact...",
        "self_desc_likert_welcome_farm_query": "I like to welcome consumers and tourists at my farm...",
        "self_desc_query": "How would you describe yourself ...",
        "slightly_disagree": "I slightly disagree",
        "status_profiled_save": "Profile Saved OK",
        "vegetables_how_many_query": "How many different types of vegetables do you approximately grow?",
        "vegetables_query": "Which of these vegetables do you grow?"
    },
			'da': {}, 'el':{},
			'es': {}, 'fr': {}, 'it': {},
			'lv': {}, 'lt': {}, 'nl': {},
			'pl': {}, 
    "fi": {
        "Cert_High": "Olen korkeasti sertifioitu (HACCP ja IFS)",
        "Cert_Min": "Olen sertifioitu matalalla tasolla (perushygieniavaatimukset)",
        "Cert_uncertified": "Olen sertifioimaton",
        "Distance_Drive_major_kat1": "<31 minuuttia",
        "Distance_Drive_major_kat2": "31-60 minuuttia",
        "Distance_Drive_major_kat3": "61-90 minuuttia",
        "Distance_Drive_major_kat4": "91-120 minuuttia",
        "Distance_Drive_major_kat5": ">120 minuuttia",
        "Distance_Drive_minor_kat1": "<31 minuuttia",
        "Distance_Drive_minor_kat2": "31-60 minuuttia",
        "Distance_Drive_minor_kat3": "61-90 minuuttia",
        "Distance_Drive_minor_kat4": "91-120 minuuttia",
        "Distance_Drive_minor_kat5": ">120 minuuttia",
        "Dummy_Beef": "Naudanlihaa",
        "Dummy_Berries": "Marjat (vadelmat, mansikat, mustikat...)",
        "Dummy_Cabbage": "Kaalia (parsakaali, kyssäkaali, puna- ja valkokaali...)",
        "Dummy_Citrus": "Sitrushedelmät (appelsiini, mandariini, sitruuna...)",
        "Dummy_Cows": "Lypsylehmiä",
        "Dummy_Dairy_Products": "Maitotuotteita (juusto ja jogurtti…)",
        "Dummy_Fish": "Kaloja",
        "Dummy_Layer_Hens": "Häkkikanoja",
        "Dummy_Milk": "Homogenoitua ja pastoroitua maitoa",
        "Dummy_Pickyourown": "Mahdollisuuksia itsepoimintaan",
        "Dummy_Pomefruits": "Siemenhedelmät (omena, päärynä, kvitteni...)",
        "Dummy_Root": "Juureksia ja sipuleita (perunat, porkkanat, palsternakka, juuripersilja, musta salsify...)",
        "Dummy_Special": "Erikoistuotteita (parsa, oliivit, tryffeli...)",
        "Dummy_Stonefruits": "Kivihedelmät (persikka, nektariini, aprikoosi, kirsikat...)",
        "Dummy_animal_welfare": "Naudanlihaa, joka on peräisin korkeampien eläinten hyvinvointistandardien mukaisesti pidetystä eläimestä",
        "Dummy_bulb": "Sipulivihanneksia (selleri ja fenkoli)",
        "Dummy_cheese_reg_special": "Muut eläintuotteet, joita pidetään paikallisina erikoisuuksina (Prosciutto di Parma tai Bleu d’Auvergne)",
        "Dummy_commu_supp_agri": "Peltoja yhteisöviljelyyn",
        "Dummy_exotic_fruits": "Muut eksoottiset hedelmät (banaani, taateli, kiivi, mango...)",
        "Dummy_farmer_market": "maatilojen kaupoissa",
        "Dummy_farmer_shop": "oman maatilan kaupassa",
        "Dummy_food_assemblies": "muille (yhteistyössä viljelijäyhdistysten, muiden maatilakauppojen kanssa)",
        "Dummy_food_box_delivery": "verkossa (oma toimitus tai toimitetaan postitse)",
        "Dummy_fruit_farm": "Hedelmiä",
        "Dummy_fruit_vegetables": "Hedelmän tapaisia vihanneksia (tomaatit, paprikat, munakoiso...)",
        "Dummy_lettuce": "Salaattia (leikattu salaatti, argula, pinaatti, mangoldi, endivie...)",
        "Dummy_livestock": "Eläintuotteita",
        "Dummy_no_SFSC": "ei  mikään yllä mainituista",
        "Dummy_organic": "Olen luomuviljelijä",
        "Dummy_public_canteens": "laitoksille (esim. koulujen tai sairaaloiden ruokaloihin)",
        "Dummy_pumpkin": "Kurpitsoja ja kesäkurpitsoja",
        "Dummy_raw_milk_only": "Vain raakamaitoa",
        "Dummy_restaurant": "ravintoloihin",
        "Dummy_spec_beef": "Naudanlihaa harvinaisimmista eläimistä (Wagyu, Angus...)",
        "Dummy_supermarket_noregio": "supermarketteihin (alueellista alkuperää ei korosteta)",
        "Dummy_supermarket_regional": "supermarketteihin (alueellista alkuperää korostetaan)",
        "Dummy_veggie_farm": "Vihanneksia",
        "Dummy_wholesale": "tukkumarkkinat (tai jakelijat tai tuottajaorganisaatiot)",
        "Eu_funding": "TÄMÄ HANKE ON SAANUT RAHOITUSTA EUROOPAN UNIONIN HORIZON 2020 TUTKIMUS- JA INNOVAATIOOHJELMASTA AVUSTUSSOPIMUKSEN NRO 101000788 MUKAISESTI.",
        "Harv_Clean_Sort_Ref": "Teen sadonkorjuun ja tarvittavat sadonkorjuun jälkeiset käsittelyvaiheet (esim. puhdistus, lajittelu ja jäähdytys)",
        "Harv_farmers_org": "Teen vain sadonkorjuun, kaikki sadonkorjuun jälkeiset käsittelyvaiheet (esim. lajittelu, puhdistus ja varastointi) tekee viljelijäjärjestö tai muu taho.",
        "Likert_consumer_con": "Pidän suorasta kuluttajakontaktista…",
        "Likert_welcome_farm": "Haluan toivottaa kuluttajat ja turistit tervetulleiksi tilalleni... ",
        "Other_animals": "Muita (sikoja, siipikarjaa, lampaita ja vuohia)",
        "activities_title": "Aktiviteetit",
        "agree": "Olen samaa mieltä",
        "animals_query": "Mitä eläimiä kasvatat (pois lukien harrastuseläimet)?",
        "dairy_products_query": "Tarjoatko seuraavia tuotteita?",
        "delivery_month_total_query": "Kuinka monta kuukautta vuodessa voit toimittaa tuoreita hedelmiä tai vihanneksia?",
        "distance_drive_major_query": "Kuinka pitkä ajomatka on minuuteissa seuraavaan suureen kaupunkiin (Suurempi määrä asukkaita, tarjolla on paljon julkisia tiloja ja kulttuuritarjontaa (esim. pääkaupungit ja maakuntien pääkaupungit)?",
        "distance_drive_small_query": "Kuinka pitkä ajomatka on minuuteissa seuraavaan suurempaan kaupunkiin (Pienempi määrä asukkaita, tarjolla on joitakin julkisia tiloja, mutta melko rajallinen kulttuuritarjonta.)?",
        "do_not_know": "En osaa sanoa",
        "dummy_no": "Ei",
        "dummy_yes": "Kyllä",
        "farm_animals_title": "Maatilan eläimet",
        "farm_fruits_title": "Maatilan hedelmät",
        "farm_hectare_query": "Kuinka suuri tilasi on yhteensä (hehtaareissa)?",
        "farm_info_title": "Tietoa maatilasta",
        "farm_location_title": "Maatilan sijainti",
        "farm_title": "Maatila",
        "farm_vegetables_title": "Maatilan vihannekset",
        "fruits_how_many_query": "Kuinka monta eri hedelmälajiketta kasvatat?",
        "fruits_query": "Mitä näistä hedelmistä kasvatat? ",
        "fully_agree": "Olen täysin samaa mieltä",
        "fully_disagree": "Olen täysin erimieltä",
        "harvest_query": "Miten käsittelet tuotteitasi sadonkorjuun jälkeen?",
        "icon_activities": "Aktiviteetit",
        "icon_analysis": "Analyysi",
        "icon_animals": "Eläimet",
        "icon_farm": "Maatila",
        "icon_fruits": "Hedelmät",
        "icon_info": "Info",
        "icon_location": "Sijainti",
        "icon_producer": "Tuottaja",
        "icon_vegetables": "Vihannekset",
        "info_title": "Ohjeet",
        "language_title": "Valitse kieli",
        "location_query": "Missä maassa maatilasi sijaitsee?",
        "main_instruction_1":"Ole hyvä ja täytä tiedot maatilasta, maatilan toiminnasta ja tuottajasta.",
		"main_instruction_2":"Vaaleanpunaiset/vihreät laatikot osoittavat, oletko jo vastannut kaikkiin pakollisiin kysymyksiin.",
		"main_instruction_3":"Kun kaikki pakolliset tiedot on täytetty, keskellä oleva analyysipainike aktivoituu.",
		"main_instruction_4":"Analyysi antaa tietoa sopivimmista liiketoimintamalleista ja myyntikanavista.",
        "main_title": "Työkalu päätöksenteon tueksi viljelijöille",
        "marketing_channel_query": "Missä myyt tuotteitasi tällä hetkellä?",
        "offering_query": "Tarjoatko jo",
        "organic_query": "Olen luomuviljelijä",
        "producer_title": "Tuottaja",
        "products_offering_query": "Tarjoatko näitä tuotteita?",
        "quality_cert_query": "Minkä laatusertifiointistandardien vaatimukset täytät?",
        "region_query": "Millä alueella maatilasi sijaitsee?",
        "self_desc_likert_consumer_con_query": "Nautin asioidessani suoraan kuluttajien kanssa...",
        "self_desc_likert_welcome_farm_query": "Haluan toivottaa kuluttajat ja turistit tervetulleiksi tilalleni...",
        "self_desc_query": "Miten kuvailisit itseäsi…",
        "slightly_disagree": "Olen hieman erimieltä",
        "status_profiled_save": "Tiedot tallennettu onnistuneesti",
        "vegetables_how_many_query": "Kuinka monta eri vihanneslajiketta kasvatat?",
        "vegetables_query": "Mitä näistä vihanneksista kasvatat?"
    },
			
			'tr': {}
		};
		
		
		this.translation = this.translation_simulated;
		
		this.translationReady = false;
	}
	
	loadTranslation() {
		const self = this;
		
		const lang = this.selected;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		this.fetching = true;
		this.translationReady = false;
		this.translation = {};
		
		if (this.MOCKUP === true) {
			
			setTimeout(() => {
				// After 1 second of delay (to simulate delay) fill in the results data.
				this.translation = this.translation_simulated;
				this.translationReady = true;
				this.fetching = false;
				this.notifyAll({model:self.name, method:'loadTranslation', status:200, message:'OK'});
				
			}, 1000);
			
		} else {
			// Send a command to start analysis for this User (id= ) 
			let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
			
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+this.token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			const myGet = {
				method: 'GET',
				headers: myHeaders
				//body: JSON.stringify(data)
			};
			const myRequest = new Request(this.backend + '/UI_text?lang='+lang, myGet);
			fetch(myRequest)
				.then(function(response){
					status = response.status;
					return response.json();
				})
				.then(function(myJson){
					let msg = "OK";
					console.log(['loadTranslation myJson=',myJson]);
					/*
					const resu = JSON.parse(myJson);
					console.log(['loadTranslation resu=',resu]);
					if (typeof resu.message !== 'undefined') {
						msg = resu.message;
					}*/
					
					self.translation = myJson;
					self.translationReady = true;
					self.fetching = false;
					self.notifyAll({model:self.name, method:'loadTranslation', status:status, message:msg});
				})
				.catch(function(error){
					let msg = "Error: ";
					if (typeof error.message !== 'undefined') {
						msg += error.message;
					} else {
						msg += 'NOT SPECIFIED in error.message.';
					}
					self.fetching = false;
					self.notifyAll({model:self.name, method:'loadTranslation', status:status, message:msg});
				});
		}
	}
}
