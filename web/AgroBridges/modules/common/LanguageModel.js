import Model from '../common/Model.js';

export default class LanguageModel extends Model {
	constructor() {
		this.languages = ['en','fi'];
		this.selected = 'en';
		this.translation = {
			'en':{
				'location_query':'In which country is your farm located?',
				'marketting_channel_query':'Where are you currently selling your products?',
				'offering_query':'Do you already offer',
				'self_desc_query':'How would you describe yourself?',
				'organic_query':'I am an organic farmer',
				'shops_close_query':'Are there many farm shops in close by (5-10 km radius)',
				'distance_drive_small_query':'How long is the driving distance to the next bigger town (100.000 inhabitants)?',
				'distance_drive_major_query':'How long is the driving distance to a major city (1.000.000 inhabitants)?',
				'products_offering_query':'Are you offering these products?',
				'vege_hectare_query':'On how many hectares do you grow vegetables?',
				
				'fruit_hectare_query':'On how many hectars do you grow fruits?',
				'farm_hectare_query':'How large is your farm in total?',
				'greenhouse_query':'Do you also produce in greenhouses?',
				'delivery_month_total_query':'How long could you deliver fresh products (month)?',
				'animals_query':'Which animals are you keeping (hobby livestock excluded)?',
				'dairy_products_query':'Are you offering the following dairy products?',
				'neighbor_sells_milk_query':'Is someone in your neighborhood selling milk and milk products directly (farm shop, vending machine)?',
				'fruits_query':'Which of these fruits do you grow?',
				'fruits_how_many_query':'How many different fruits do you approximately grow in total?',
				'vegetables_query':'Which of these vegetables do you grow?',
				
				'grow_herbs_query':'Do you also grow herbs?',
				'grow_nuts_query':'Do you grow nuts (Walnut, Hazelnut, Marone...)?',
				'quality_cert_query':'Which quality certification standards do you fullfil?',
				'harvest_query':'How do you handle your products after the harvest?',
				'vegetables_how_many_query':'How many different vegetables do you grow in total?',
				'harvets_query':'How do you handle your products after the harvest?',
				
				'Dummy_fruit_farm':'Fruits',
				'Dummy_veggie_farm':'Vegetables',
				'Dummy_livestock':'Animal Products',
				
				'Dummy_lettuce':'Lettuce (cut lettuce, Argula, Spinach, Swiss Chard, Endivie...)',
				'Dummy_fruit_vegetables':'Fruitlike vegetables (tomatoes, peppers, Eggplant...)',
				'Dummy_pumpkin':'Pumpkins and Courgettes',
				'Dummy_bulb':'Bulb vegetables (celeric and fennel)',
				'Dummy_Root':'Root vegetables and Onions (Potatos, Carrots, Parsnip, Root parsley, Black salsify...)',
				'Dummy_Cabbage':'Cabbages (Broccoli, Kohlrabi, red and white cabbage...)',
				'Dummy_Special':'Specialities (Asparagus, olives, truffle, sweet potato...)',
				
				'Dummy_Stonefruits':'Stonefruits (Peach, Nectarine, Apricot, Cherries...)',
				'Dummy_Promefruits':'Pome fruits (Apple, Pear, Quince...)',
				'Dummy_Berries':'Berries (Rapsberries, Strawberries, Blueberries...)',
				'Dummy_Citrus':'Citrus (Orange, Tangerine, Lemon...)',
				'Dummy_exotic_fruits':'Other exotic fruits (banana, date, kiwi, mango...)'
			},
			'fi':{
				'location_query':'Missä maassa tilasi sijaitsee?',
				'marketting_channel_query':'Missä myyt tuotteitasi tällä hetkellä?',
				'offering_query':'Tarjoatko jo',
				'self_desc_query':'Miten kuvailisit itseäsi?',
				'organic_query':'Olen luomuviljelijä',
				'shops_close_query':'Onko lähellä monia maatilakauppoja (5-10 km säteellä)',
				'distance_drive_small_query':'Kuinka pitkä ajomatka on seuraavaan suurempaan kaupunkiin (100 000 asukasta)?',
				'distance_drive_major_query':'Kuinka pitkä ajomatka on seuraavaan suureen kaupunkiin (1000 000 asukasta)?',
				'products_offering_query':'Tarjoatko näitä tuotteita?',
				'vege_hectare_query':'Kuinka monella hehtaarilla kasvatat vihanneksia?',
				
				'fruit_hectare_query':'Kuinka monella hehtaarilla kasvatat hedelmiä?',
				'farm_hectare_query':'Kuinka suuri tilasi on yhteensä?',
				'greenhouse_query':'Kasvatatko myös kasvihuoneissa?',
				'delivery_month_total_query':'Kuinka monta kuukautta vuodessa voit toimittaa tuoreita tuotteita?',
				'animals_query':'Mitä eläimiä kasvatat (pois lukien harrastuseläimet)?',
				'dairy_products_query':'Tarjoatko seuraavia maitotuotteita?',
				'neighbor_sells_milk_query':'Myykö joku naapurustossasi maitoa ja maitotuotteita suoraan (maatilakauppa, myyntiautomaatti)?',
				'fruits_query':'Mitä näistä hedelmistä kasvatat?',
				'fruits_how_many_query':'Kuinka monta eri hedelmälajiketta kasvatat yhteensä?',
				'vegetables_query':'Mitä näistä vihanneksista kasvatat?',
				
				'grow_herbs_query':'Kasvatatko myös yrttejä?',
				'grow_nuts_query':'Kasvatatko pähkinöitä (saksanpähkinä, hasselpähkinä, marone...)?',
				'quality_cert_query':'Minkä laatusertifiointistandardien vaatimukset täytät?',
				'harvest_query':'Miten käsittelet tuotteitasi sadonkorjuun jälkeen?',
				'vegetables_how_many_query':'Kuinka monta eri vihanneslajiketta kasvatat yhteensä?',
				'harvest_query':'Miten käsittelet tuotteitasi sadonkorjuun jälkeen?',
				
				'Dummy_fruit_farm':'Hedelmiä',
				'Dummy_veggie_farm':'Vihanneksia',
				'Dummy_livestock':'Eläintuotteita',
				
				'Dummy_lettuce':'Salaattia (leikattu salaatti, argula, pinaatti, mangoldi, endivie...)',
				'Dummy_fruit_vegetables':'Hedelmän tapaisia vihanneksia (tomaatit, paprikat, munakoiso...)',
				'Dummy_pumpkin':'Kurpitsoja ja kesäkurpitsoja',
				'Dummy_bulb':'Sipulivihanneksia (selleri ja fenkoli)',
				'Dummy_Root':'Juureksia ja sipuleita (perunat, porkkanat, palsternakka, juuripersilja, musta salsify...)',
				'Dummy_Cabbage':'Kaalia (parsakaali, kyssäkaali, puna- ja valkokaali...)',
				'Dummy_Special':'Erikoistuotteita (parsa, oliivit, tryffeli, bataatti...)',
				
				'Dummy_Stonefruits':'Kivihedelmät (persikka, nektariini, aprikoosi, kirsikat...)',
				'Dummy_Promefruits':'Siemenhedelmät (omena, päärynä, kvitteni...)',
				'Dummy_Berries':'Marjat (vadelmat, mansikat, mustikat...)',
				'Dummy_Citrus':'Sitrushedelmät (appelsiini, mandariini, sitruuna...)',
				'Dummy_exotic_fruits':'Muut eksoottiset hedelmät (banaani, taateli, kiivi, mango...)'
				
			}
		}
	}
}