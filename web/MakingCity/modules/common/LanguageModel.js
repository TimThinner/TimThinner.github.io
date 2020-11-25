export default class LanguageModel {
	constructor() {
		this.languages = ['en','fi'];
		this.selected = 'fi';
		this.translation = {
			'en':{
				'USER_LOGIN_TITLE':'Login',
				'USER_EMAIL':'Email',
				'USER_PASSWORD':'Password',
				'USER_REGCODE':'Registration code',
				'USER_LOGIN_BTN_TXT':'Login',
				'USER_OPEN_SIGNUP_FORM':'Open signup form &raquo;',
				'USER_SIGNUP_TITLE':'Signup',
				'USER_SIGNUP_BTN_TXT':'Signup',
				'USER_INFO':'User Info',
				'USER_DESCRIPTION':'Here you will find your information and settings.',
				'USER_BULLET_1':'- edit your profile',
				'USER_BULLET_2':'- participation ON/OFF',
				'USER_BULLET_3':'- alarms ON/OFF',
				'USER_LOGOUT':'LOGOUT',
				'COMING_SOON':'COMING SOON!',
				'USER_PAGE_TITLE':'The User Page',
				'USER_PAGE_SUBTITLE':'Your Home Page',
				'USER_PAGE_ELECTRICITY':'Electricity',
				'USER_PAGE_HEATING':'Heating',
				'USER_PAGE_WATER':'Water',
				'GRID_PAGE_TITLE':'The Grid Page',
				'GRID_PAGE_DESCRIPTION':'Here you will find more information about the aggregated load (from Fingrid open data).',
				'SOLAR_PAGE_TITLE':'The Solar Page',
				'SOLAR_PAGE_DESCRIPTION':'Here you will find more information about solar energy. For example prediction for the coming days.',
				'ENVIRONMENT_PAGE_TITLE':'The Environment Page',
				'ENVIRONMENT_PAGE_DESCRIPTION':'Here you will find more information about the environmental load of the energy used.',
				'USER_PROPS_TITLE':'User Properties',
				'USER_PROPS_DESCRIPTION':'Here you will find your information and settings.',
				'USER_ENERGY_PRICES_TITLE':'Energy price',
				'USER_ENERGY_PRICES_DESCRIPTION':'Give prices from your contract so that we can calculate prices for each period.',
				'USER_ENERGY_PRICES_MONTHLY':'Monthly price: ',
				'USER_ENERGY_PRICES_MONTHLY_UNIT':'€/month',
				'USER_ENERGY_PRICES_ENERGY':'Energy price: ',
				'USER_ENERGY_PRICES_ENERGY_UNIT':'cnt/kWh',
				'USER_ENERGY_PRICES_TRANSFER':'Transfer price: ',
				'USER_ENERGY_PRICES_TRANSFER_UNIT':'cnt/kWh',
				'USER_ENERGY_PRICE_SAVED_OK':'New price saved.',
				'USER_DATA_PERIOD':'Period',
				'USER_DATA_PERIOD_DAY':'24h',
				'USER_DATA_PERIOD_WEEK':'Week',
				'USER_DATA_PERIOD_MONTH':'Month',
				'USER_DATA_TARGET':'Target',
				'USER_DATA_UPPER_LIMIT':'Upper limit',
				'USER_DATA_LOWER_LIMIT':'Lower limit',
				'USER_DATA_WATER_HOT':'HOT (L)',
				'USER_DATA_WATER_COLD':'COLD (L)',
				'USER_ELECTRICITY_TITLE':'Electricity',
				'USER_ELECTRICITY_DESCRIPTION':'Here you will find more information about your electricity consumption.',
				'USER_ELECTRICITY_CHART_TITLE':'Electricity consumption',
				'USER_HEATING_TITLE':'Heating',
				'USER_HEATING_DESCRIPTION':'Here you will find more information about your heating.',
				'USER_HEATING_CHART_TITLE':'Temperature and humidity',
				'USER_HEATING_CHART_LEGEND_TEMPERATURE':'Temperature',
				'USER_HEATING_CHART_LEGEND_HUMIDITY':'Humidity',
				'USER_HEATING_CHART_AVERAGE':'Average',
				'USER_HEATING_FEEDBACK_PROMPT':'Give feedback: how do you feel about the apartment temperature today? Select smiley and send feedback.',
				'USER_HEATING_SEND_FEEDBACK':'Send feedback',
				'USER_HEATING_FEEDBACK_OK':'Thank you for your feedback!',
				'USER_HEATING_TARGETS_TITLE':'Targets for heating',
				'USER_HEATING_TARGET_BOTH_DESCRIPTION':'Give upper and lower limits and target value for temperature and humidity.',
				'USER_HEATING_TARGET_TEMPERATURE':'Target temperature: ',
				'USER_HEATING_UPPER_TEMPERATURE':'Temperature upper limit: ',
				'USER_HEATING_LOWER_TEMPERATURE':'Temperature lower limit: ',
				'USER_HEATING_TARGET_HUMIDITY':'Target humidity: ',
				'USER_HEATING_UPPER_HUMIDITY':'Humidity upper limit: ',
				'USER_HEATING_LOWER_HUMIDITY':'Humidity lower limit: ',
				'USER_HEATING_TARGET_SAVED':'New heating target/limit saved.',
				'USER_WATER_TITLE':'Water',
				'USER_WATER_DESCRIPTION':'Here you will find more information about your water consumption.',
				'USER_WATER_CHART_TITLE':'Water consumption',
				'USER_WATER_CHART_LEGEND_HOT':'Hot',
				'USER_WATER_CHART_LEGEND_COLD':'Cold',
				'DISTRICT_A_LABEL':'S-Arina',
				'DISTRICT_B_LABEL':'Sivakka 1',
				'DISTRICT_C_LABEL':'Sivakka 2',
				'DISTRICT_D_LABEL':'Sivakka 3',
				'DISTRICT_E_LABEL':'YIT 1',
				'MENU_TITLE':'Positive Energy Districts',
				'MENU_DESCRIPTION':'<a href="http://makingcity.eu/" target="_blank" rel="noreferrer noopener" aria-label="This is an external link (opens in a new tab)">THE MAKING-CITY PROJECT</a> is funded by EU’s Horizon 2020 programme and is a part of the Smart Cities and Communities (SCC) theme.',
				'MENU_VERSION':'v 20.11.24',
				'MENU_VISIT_COUNT':'visit count',
				'SOLAR_PANELS':'SOLAR PANELS',
				'GRID_TEXT':'GRID',
				'DA_BACK':'BACK',
				'DA_CANCEL':'CANCEL',
				'DA_SAVE':'SAVE',
				'DA_QUICK_LOGIN':'MOCKUP LOGIN',
				'DA_QUICK_LOGIN_MESSAGE':'NOTE: This is a MOCKUP. You can use the login button below to login as "testuser@testdomain.com".',
				'DAA_TITLE':'Grid',
				'DAB_TITLE':'Solar power',
				'DAC_TITLE':'Lights and appliances',
				'DAD_TITLE':'Kitchen appliances',
				'DAE_TITLE':'HPAC',
				'DAF_TITLE':'Other',
				'DAG_TITLE':'Compressors, Cooler equipments and Heating',
				'DAP_TITLE_A':'District',
				'DAP_TITLE_B':'heating',
				'DAP_TITLE_C':'network',
				'DAHA_TITLE':'Compressors',
				'DAHB_TITLE':'Cooler equipment',
				'DAHC_TITLE':'Cooling',
				'DAHD_TITLE':'Heating',
				'DAI_TITLE':'Geothermal power',
				'DAA_POWER':'Power',
				'DAA_ENERGY':'Energy',
				'DAW_SEL_TIMERANGE':'Select timerange for database query:',
				'AUTO_UPDATE_MSG_1':'Chart is automatically updated once every',
				'AUTO_UPDATE_MSG_1_B':'Power consumption values are automatically updated once every',
				'AUTO_UPDATE_MSG_2':'seconds',
				'AUTO_UPDATE_MSG_3':'Chart is NOT automatically updated',
				'ADJUST_UPDATE_INTERVAL':'Adjust the update interval (0-60s):',
				'SESSION_EXPIRED':'Session has expired... logging out in 3 seconds!'
			},
			'fi':{
				'USER_LOGIN_TITLE':'Kirjautuminen',
				'USER_EMAIL':'Sähköposti',
				'USER_PASSWORD':'Salasana',
				'USER_REGCODE':'Rekisteröintikoodi',
				'USER_LOGIN_BTN_TXT':'KIRJAUDU SISÄÄN',
				'USER_OPEN_SIGNUP_FORM':'Rekisteröityminen &raquo;',
				'USER_SIGNUP_TITLE':'Rekisteröityminen',
				'USER_SIGNUP_BTN_TXT':'Rekisteröidy',
				'USER_INFO':'Käyttäjätiedot',
				'USER_DESCRIPTION':'Täältä löytyvät kaikki sinun tietosi ja asetuksesi.',
				'USER_BULLET_1':'- omien tietojen muokkaus',
				'USER_BULLET_2':'- osallistuminen PÄÄLLÄ/POIS',
				'USER_BULLET_3':'- hälytykset PÄÄLLÄ/POIS',
				'USER_LOGOUT':'KIRJAUDU ULOS',
				'COMING_SOON':'TULOSSA PIAN!',
				'USER_PAGE_TITLE':'Koti',
				'USER_PAGE_SUBTITLE':'Sinun kotisivusi',
				'USER_PAGE_ELECTRICITY':'Sähkö',
				'USER_PAGE_HEATING':'Lämmitys',
				'USER_PAGE_WATER':'Vesi',
				'GRID_PAGE_TITLE':'Sähköverkko',
				'GRID_PAGE_DESCRIPTION':'Täältä löytyy lisätietoa sähköverkon kuormituksesta (Fingridin avoin data).',
				'SOLAR_PAGE_TITLE':'Aurinkoenergia',
				'SOLAR_PAGE_DESCRIPTION':'Täältä löytyy lisätietoa aurinkoenergiasta. Esimerkiksi lähipäivien ennuste.',
				'ENVIRONMENT_PAGE_TITLE':'Ympäristövaikutus',
				'ENVIRONMENT_PAGE_DESCRIPTION':'Täältä löytyy lisätietoa kulutetun energian vaikutuksesta ympäristöön.',
				'USER_PROPS_TITLE':'Käyttäjätiedot',
				'USER_PROPS_DESCRIPTION':'Täältä löytyvät kaikki sinun tietosi ja asetuksesi.',
				'USER_ENERGY_PRICES_TITLE':'Energian hinta',
				'USER_ENERGY_PRICES_DESCRIPTION':'Syötä hinnat omasta sähkösopimuksestasi, niin voimme laskea sähkönkulutuksen jaksokohtaiset hinta-arviot.',
				'USER_ENERGY_PRICES_MONTHLY':'Kuukausimaksu: ',
				'USER_ENERGY_PRICES_MONTHLY_UNIT':'€/kk',
				'USER_ENERGY_PRICES_ENERGY':'Energiamaksu: ',
				'USER_ENERGY_PRICES_ENERGY_UNIT':'snt/kWh',
				'USER_ENERGY_PRICES_TRANSFER':'Siirtomaksu: ',
				'USER_ENERGY_PRICES_TRANSFER_UNIT':'snt/kWh',
				'USER_ENERGY_PRICE_SAVED_OK':'Uusi hinta talletettu.',
				'USER_DATA_PERIOD':'Jakso',
				'USER_DATA_PERIOD_DAY':'24h',
				'USER_DATA_PERIOD_WEEK':'Viikko',
				'USER_DATA_PERIOD_MONTH':'Kuukausi',
				'USER_DATA_TARGET':'Tavoitearvo',
				'USER_DATA_UPPER_LIMIT':'Yläraja',
				'USER_DATA_LOWER_LIMIT':'Alaraja',
				'USER_DATA_WATER_HOT':'KUUMA (L)',
				'USER_DATA_WATER_COLD':'KYLMÄ (L)',
				'USER_ELECTRICITY_TITLE':'Asuntokohtainen sähkönkulutus',
				'USER_ELECTRICITY_DESCRIPTION':'Täältä löytyvät tiedot asuntokohtaisesta sähkönkulutuksesta.',
				'USER_ELECTRICITY_CHART_TITLE':'Sähkönkulutus',
				'USER_HEATING_TITLE':'Asuntokohtainen lämmitys',
				'USER_HEATING_DESCRIPTION':'Täältä löytyvät tiedot asuntokohtaisesta lämmityksestä.',
				'USER_HEATING_CHART_TITLE':'Lämpötila ja kosteus',
				'USER_HEATING_CHART_LEGEND_TEMPERATURE':'Lämpötila',
				'USER_HEATING_CHART_LEGEND_HUMIDITY':'Kosteus',
				'USER_HEATING_CHART_AVERAGE':'Keskiarvo',
				'USER_HEATING_FEEDBACK_PROMPT':'Anna palautetta: miltä asunnon lämpötila tuntuu tänään? Valitse hymiö ja lähetä palaute.',
				'USER_HEATING_SEND_FEEDBACK':'Lähetä palaute',
				'USER_HEATING_FEEDBACK_OK':'Kiitos palautteesta!',
				'USER_HEATING_TARGETS_TITLE':'Tavoitearvot lämmitykselle',
				'USER_HEATING_TARGET_BOTH_DESCRIPTION':'Anna ylä- ja alarajat ja tavoitearvot lämpötilalle ja kosteudelle.',
				'USER_HEATING_TARGET_TEMPERATURE':'Tavoitelämpötila: ',
				'USER_HEATING_UPPER_TEMPERATURE':'Lämpötilan yläraja: ',
				'USER_HEATING_LOWER_TEMPERATURE':'Lämpötilan alaraja: ',
				'USER_HEATING_TARGET_HUMIDITY':'Tavoitekosteus: ',
				'USER_HEATING_UPPER_HUMIDITY':'Kosteuden yläraja: ',
				'USER_HEATING_LOWER_HUMIDITY':'Kosteuden alaraja: ',
				'USER_HEATING_TARGET_SAVED':'Uusi tavoite/raja talletettu.',
				'USER_WATER_TITLE':'Asuntokohtainen vedenkulutus',
				'USER_WATER_DESCRIPTION':'Täältä löytyvät tiedot asuntokohtaisesta vedenkulutuksesta',
				'USER_WATER_CHART_TITLE':'Vedenkulutus',
				'USER_WATER_CHART_LEGEND_HOT':'Kuuma',
				'USER_WATER_CHART_LEGEND_COLD':'Kylmä',
				'DISTRICT_A_LABEL':'S-Arina',
				'DISTRICT_B_LABEL':'Sivakka 1',
				'DISTRICT_C_LABEL':'Sivakka 2',
				'DISTRICT_D_LABEL':'Sivakka 3',
				'DISTRICT_E_LABEL':'YIT 1',
				'MENU_TITLE':'Energiataseeltaan positiivinen alue',
				'MENU_DESCRIPTION':'<a href="http://makingcity.eu/" target="_blank" rel="noreferrer noopener" aria-label="This is an external link (opens in a new tab)">MAKING-CITY HANKE</a> saa rahoitusta EU:n Horizon 2020 -ohjelmasta. Se kuuluu Smart Cities and Communities (SCC) -teemaan.',
				'MENU_VERSION':'v 20.11.24',
				'MENU_VISIT_COUNT':'kävijälaskuri',
				'SOLAR_PANELS':'AURINKOPANEELIT',
				'GRID_TEXT':'SÄHKÖVERKKO',
				'DA_BACK':'TAKAISIN',
				'DA_CANCEL':'PERU',
				'DA_SAVE':'TALLETA',
				'DA_QUICK_LOGIN':'MOCKUP KIRJAUTUMINEN',
				'DA_QUICK_LOGIN_MESSAGE':'HUOM: Tämä on MOCKUP. Voit kirjautua testikäyttäjänä suoraan alla olevasta napista.',
				'DAA_TITLE':'Grid',
				'DAB_TITLE':'Aurinkoteho',
				'DAC_TITLE':'Valaistus ja laitteet',
				'DAD_TITLE':'Keittiön laitteet',
				'DAE_TITLE':'LVI',
				'DAF_TITLE':'Muut',
				'DAG_TITLE':'Kompressorit, kylmälaitteet ja lämmitys',
				'DAHA_TITLE':'Kompressorit',
				'DAP_TITLE_A':'Kauko-',
				'DAP_TITLE_B':'lämpö-',
				'DAP_TITLE_C':'verkko',
				'DAHB_TITLE':'Kylmälaitteet',
				'DAHC_TITLE':'Kylmäkoneet',
				'DAHD_TITLE':'Lämmitys',
				'DAI_TITLE':'Maalämpö',
				'DAA_POWER':'Teho',
				'DAA_ENERGY':'Energia',
				'DAW_SEL_TIMERANGE':'Valitse kuvaajan aikaikkuna:',
				'AUTO_UPDATE_MSG_1':'Kuvaaja päivittyy automaattisesti kerran',
				'AUTO_UPDATE_MSG_1_B':'Teholukemat päivittyvät automaattisesti kerran',
				'AUTO_UPDATE_MSG_2':'sekunnissa',
				'AUTO_UPDATE_MSG_3':'Kuvaaja EI päivity automaattisesti',
				'ADJUST_UPDATE_INTERVAL':'Säädä päivitystaajuutta (0-60s):',
				'SESSION_EXPIRED':'Kirjautuminen on vanhentunut... automaattinen uloskirjaus 3 sekunnissa!'
			}
		}
	}
}
