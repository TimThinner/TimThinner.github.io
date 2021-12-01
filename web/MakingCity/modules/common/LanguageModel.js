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
				'COMING_SOON':'COMING SOON!',
				'USER_PAGE_ELECTRICITY':'Electricity',
				'USER_PAGE_HEATING':'Heating',
				'USER_PAGE_WATER':'Water',
				'GRID_PAGE_TITLE':'The Grid Page',
				'GRID_PAGE_DESCRIPTION':'Here you will find more information about the aggregated load (from Fingrid open data). Values are updated once every 3 minutes.',
				'SOLAR_PAGE_TITLE':'The Solar Page',
				'SOLAR_PAGE_DESCRIPTION':'Solar power generation forecast for the next 36 hours. Updated hourly.',
				'ENVIRONMENT_PAGE_TITLE':'The Environment Page',
				'ENVIRONMENT_PAGE_DESCRIPTION':'Here you will find more information about the environmental load of the energy used.',
				'ENVIRONMENT_PAGE_AXIS_TITLE':'Emissions gCO2/kWh',
				'ENVIRONMENT_PAGE_CONS_TOOLTIP':'Consumed',
				'ENVIRONMENT_PAGE_PROD_TOOLTIP':'Produced',
				'ENVIRONMENT_PAGE_CONS_LEGEND_LABEL':'Consumed',
				'ENVIRONMENT_PAGE_PROD_LEGEND_LABEL':'Produced',
				'USER_PROPS_TITLE':'User Properties',
				'USER_PROPS_DESCRIPTION':'Here you will find your information and settings.',
				'USER_ENERGY_PRICES_TITLE':'Energy price',
				'USER_ENERGY_PRICES_DESCRIPTION':'Give prices from your contract so that we can calculate prices for each period.',
				'USER_ENERGY_PRICES_MONTHLY':'Monthly price: ',
				'USER_ENERGY_PRICES_MONTHLY_UNIT':'€/month',
				'USER_ENERGY_PRICES_ENERGY':'Energy price: ',
				'USER_ENERGY_PRICES_ENERGY_UNIT':'cnt/kWh',
				'USER_ENERGY_PRICES_TRANSFER':'Network price: ',
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
				'USER_CHART_X_DAYS':'days',
				'USER_CHART_X_DAYS_WAIT':'Electricity consumption data not available yet... check tomorrow again.',
				'USER_ELECTRICITY_TARGETS_TITLE':'Targets for 24h energy consumption',
				'USER_ELECTRICITY_TARGETS_DESCRIPTION':'Give upper and lower limits and target value for electricity consumption <b>in one day</b>.',
				'USER_TARGETS_ALARM_COUNT_DESCRIPTION':'Numbers indicate alarm count for last 30 days when current limits are used.',
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
				'USER_HEATING_TARGETS_BOTH_DESCRIPTION':'Give upper and lower limits and target value for temperature and humidity.',
				'USER_TARGET':'Target: ',
				'USER_UPPER_LIMIT':'Upper limit: ',
				'USER_LOWER_LIMIT':'Lower limit: ',
				'USER_TARGET_SAVED':'New target/limit saved.',
				'USER_WATER_TITLE':'Water',
				'USER_WATER_DESCRIPTION':'Here you will find more information about your water consumption.',
				'USER_WATER_CHART_TITLE':'Water consumption',
				'USER_WATER_CHART_TITLE_30_DAYS':'Water consumption 30 days',
				'USER_WATER_CHART_LEGEND_HOT':'Hot',
				'USER_WATER_CHART_LEGEND_COLD':'Cold',
				'USER_WATER_TARGETS_TITLE':'Targets for 24h water consumption',
				'USER_WATER_TARGETS_BOTH_DESCRIPTION':'Give upper and lower limits and target value for water consumption <b>in one day</b>.',
				'USER_ALARM_TITLE':'Alarms',
				'USER_ALARM_DESCRIPTION':'Here you will find a list of alarms and other useful messages from the system.',
				'USER_ALARM_CHART_TITLE':'Count',
				'USER_ALARM_VIEW_TABLE_HEADER_TYPE':'Type',
				'USER_ALARM_VIEW_TABLE_HEADER_COUNT':'Count',
				'USER_ALARM_VIEW_TABLE_HEADER_DETAILS':'&nbsp;',
				'USER_ALARM_VIEW_HEATING_TEMPERATURE_UPPER_LIMIT':'Heating Temperature Upper Limit',
				'USER_ALARM_VIEW_HEATING_TEMPERATURE_LOWER_LIMIT':'Heating Temperature Lower Limit',
				'USER_ALARM_VIEW_HEATING_HUMIDITY_UPPER_LIMIT':'Heating Humidity Upper Limit',
				'USER_ALARM_VIEW_HEATING_HUMIDITY_LOWER_LIMIT':'Heating Humidity Lower Limit',
				'USER_ALARM_VIEW_WATER_HOT_UPPER_LIMIT':'Water Hot Upper Limit',
				'USER_ALARM_VIEW_WATER_HOT_LOWER_LIMIT':'Water Hot Lower Limit',
				'USER_ALARM_VIEW_WATER_COLD_UPPER_LIMIT':'Water Cold Upper Limit',
				'USER_ALARM_VIEW_WATER_COLD_LOWER_LIMIT':'Water Cold Lower Limit',
				'USER_ALARM_VIEW_ENERGY_UPPER_LIMIT':'Energy Upper Limit',
				'USER_ALARM_VIEW_ENERGY_LOWER_LIMIT':'Energy Lower Limit',
				'USER_ALARM_DETAILS_DESCRIPTION':'Alarm count for each day for last 30 days',
				'DISTRICT_A_LABEL':'S-Arina',
				'DISTRICT_B_LABEL':'Sivakka 1',
				'DISTRICT_C_LABEL':'Sivakka 2',
				'DISTRICT_D_LABEL':'Sivakka 3',
				'DISTRICT_E_LABEL':'YIT 1',
				'DISTRICT_F_LABEL':'School',
				'MENU_TITLE':'Positive Energy Districts',
				'MENU_DESCRIPTION':'<a href="http://makingcity.eu/" target="_blank" rel="noreferrer noopener" aria-label="This is an external link (opens in a new tab)">THE MAKING-CITY PROJECT</a> is funded by EU’s Horizon 2020 programme and is a part of the Smart Cities and Communities (SCC) theme.',
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
				'DBA_TITLE':'Grid',
				'DBB_TITLE':'Solar power',
				'DBD_TITLE':'Apartments',
				'DBE_TITLE_1':'SAUNA,',
				'DBE_TITLE_2':'lights,',
				'DBE_TITLE_3':'etc.',
				'DBF_TITLE_1':'Heating',
				'DBF_TITLE_2':'system',
				'DBG_TITLE_1':'Exthaus air',
				'DBG_TITLE_2':'recovery',
				'DBH_TITLE_1':'Wastewater',
				'DBH_TITLE_2':'recovery',
				'DBI_TITLE_1':'District',
				'DBI_TITLE_2':'heating',
				'DBI_TITLE_3':'network',
				'DBJ_TITLE_1':'Heating',
				'DBJ_TITLE_2':'devices',
				'DBK_TITLE_1':'Hot',
				'DBK_TITLE_2':'water',
				'AUTO_UPDATE_MSG_1':'Chart is automatically updated once every',
				'AUTO_UPDATE_MSG_1_B':'Power consumption values are automatically updated once every',
				'AUTO_UPDATE_MSG_2':'seconds',
				'AUTO_UPDATE_MSG_3':'Chart is NOT automatically updated',
				'ADJUST_UPDATE_INTERVAL':'Adjust the update interval (0-60s):',
				'SESSION_EXPIRED':'Session has expired... logging out in 3 seconds!',
				'MENU_VERSION':'v 21.12.01'
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
				'COMING_SOON':'TULOSSA PIAN!',
				'USER_PAGE_ELECTRICITY':'Sähkö',
				'USER_PAGE_HEATING':'Lämmitys',
				'USER_PAGE_WATER':'Vesi',
				'GRID_PAGE_TITLE':'Sähköverkko',
				'GRID_PAGE_DESCRIPTION':'Täältä löytyy lisätietoa sähköverkon kuormituksesta (Fingridin avoin data). Kaikki lukuarvot päivittyvät 3 minuutin välein.',
				'SOLAR_PAGE_TITLE':'Aurinkoenergia',
				'SOLAR_PAGE_DESCRIPTION':'Aurinkoenergian tuotantoennuste seuraaville 36 tunnille. Ennuste päivittyy tunnin välein.',
				'ENVIRONMENT_PAGE_TITLE':'Ympäristövaikutus',
				'ENVIRONMENT_PAGE_DESCRIPTION':'Täältä löytyy lisätietoa kulutetun energian vaikutuksesta ympäristöön.',
				'ENVIRONMENT_PAGE_AXIS_TITLE':'Päästöt gCO2/kWh',
				'ENVIRONMENT_PAGE_CONS_TOOLTIP':'Kulutus',
				'ENVIRONMENT_PAGE_PROD_TOOLTIP':'Tuotanto',
				'ENVIRONMENT_PAGE_CONS_LEGEND_LABEL':'Kulutus',
				'ENVIRONMENT_PAGE_PROD_LEGEND_LABEL':'Tuotanto',
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
				'USER_CHART_X_DAYS':'päivää',
				'USER_CHART_X_DAYS_WAIT':'Kulutustietoa ei vielä saatavilla... katso huomenna uudelleen.',
				'USER_ELECTRICITY_TARGETS_TITLE':'Tavoitearvot 24h sähkönkulutukselle',
				'USER_ELECTRICITY_TARGETS_DESCRIPTION':'Anna ylä- ja alarajat sekä tavoitearvot <b>yhden vuorokauden</b> sähkönkulutukselle.',
				'USER_TARGETS_ALARM_COUNT_DESCRIPTION':'Numerot kertovat viimeisten 30 päivän hälytysten lukumäärän annetuilla rajoilla laskettuna.',
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
				'USER_HEATING_TARGETS_BOTH_DESCRIPTION':'Anna ylä- ja alarajat sekä tavoitearvot lämpötilalle ja kosteudelle.',
				'USER_TARGET':'Tavoite: ',
				'USER_UPPER_LIMIT':'Yläraja: ',
				'USER_LOWER_LIMIT':'Alaraja: ',
				'USER_TARGET_SAVED':'Uusi tavoite/raja talletettu.',
				'USER_WATER_TITLE':'Asuntokohtainen vedenkulutus',
				'USER_WATER_DESCRIPTION':'Täältä löytyvät tiedot asuntokohtaisesta vedenkulutuksesta',
				'USER_WATER_CHART_TITLE':'Vedenkulutus',
				'USER_WATER_CHART_TITLE_30_DAYS':'Vedenkulutus 30 päivää',
				'USER_WATER_CHART_LEGEND_HOT':'Kuuma',
				'USER_WATER_CHART_LEGEND_COLD':'Kylmä',
				'USER_WATER_TARGETS_TITLE':'Tavoitearvot 24h vedenkulutukselle',
				'USER_WATER_TARGETS_BOTH_DESCRIPTION':'Anna ylä- ja alarajat sekä tavoitearvot <b>yhden vuorokauden</b> vedenkulutukselle.',
				'USER_ALARM_TITLE':'Hälytykset',
				'USER_ALARM_DESCRIPTION':'Täältä voit seurata mitä hälytyksiä tai muita hyödyllisiä viestejä systeemi on generoinut.',
				'USER_ALARM_CHART_TITLE':'Lukumäärä',
				'USER_ALARM_VIEW_TABLE_HEADER_TYPE':'Tyyppi',
				'USER_ALARM_VIEW_TABLE_HEADER_COUNT':'Lukumäärä',
				'USER_ALARM_VIEW_TABLE_HEADER_DETAILS':'&nbsp;',
				'USER_ALARM_VIEW_HEATING_TEMPERATURE_UPPER_LIMIT':'Lämpötilan yläraja',
				'USER_ALARM_VIEW_HEATING_TEMPERATURE_LOWER_LIMIT':'Lämpötilan alaraja',
				'USER_ALARM_VIEW_HEATING_HUMIDITY_UPPER_LIMIT':'Kosteuden yläraja',
				'USER_ALARM_VIEW_HEATING_HUMIDITY_LOWER_LIMIT':'Kosteuden alaraja',
				'USER_ALARM_VIEW_WATER_HOT_UPPER_LIMIT':'Kuuman veden yläraja',
				'USER_ALARM_VIEW_WATER_HOT_LOWER_LIMIT':'Kuuman veden alaraja',
				'USER_ALARM_VIEW_WATER_COLD_UPPER_LIMIT':'Kylmän veden yläraja',
				'USER_ALARM_VIEW_WATER_COLD_LOWER_LIMIT':'Kylmän veden alaraja',
				'USER_ALARM_VIEW_ENERGY_UPPER_LIMIT':'Sähkönkulutuksen yläraja',
				'USER_ALARM_VIEW_ENERGY_LOWER_LIMIT':'Sähkönkulutuksen alaraja',
				'USER_ALARM_DETAILS_DESCRIPTION':'Hälytysten päiväkohtainen lukumäärä kuukauden ajalta',
				'DISTRICT_A_LABEL':'S-Arina',
				'DISTRICT_B_LABEL':'Sivakka 1',
				'DISTRICT_C_LABEL':'Sivakka 2',
				'DISTRICT_D_LABEL':'Sivakka 3',
				'DISTRICT_E_LABEL':'YIT 1',
				'DISTRICT_F_LABEL':'Koulu',
				'MENU_TITLE':'Energiataseeltaan positiivinen alue',
				'MENU_DESCRIPTION':'<a href="http://makingcity.eu/" target="_blank" rel="noreferrer noopener" aria-label="This is an external link (opens in a new tab)">MAKING-CITY HANKE</a> saa rahoitusta EU:n Horizon 2020 -ohjelmasta. Se kuuluu Smart Cities and Communities (SCC) -teemaan.',
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
				'DAHC_TITLE':'Jäähdytys',
				'DAHD_TITLE':'Lämmitys',
				'DAI_TITLE':'Maalämpö',
				'DAA_POWER':'Teho',
				'DAA_ENERGY':'Energia',
				'DAW_SEL_TIMERANGE':'Valitse kuvaajan aikaikkuna:',
				'DBA_TITLE':'Grid',
				'DBB_TITLE':'Aurinkoenergia',
				'DBD_TITLE':'Asunnot',
				'DBE_TITLE_1':'SAUNA,',
				'DBE_TITLE_2':'valot,',
				'DBE_TITLE_3':'yms.',
				'DBF_TITLE_1':'Heating',
				'DBF_TITLE_2':'system',
				'DBG_TITLE_1':'Exthaus air',
				'DBG_TITLE_2':'recovery',
				'DBH_TITLE_1':'Wastewater',
				'DBH_TITLE_2':'recovery',
				'DBI_TITLE_1':'Kauko-',
				'DBI_TITLE_2':'lämpö-',
				'DBI_TITLE_3':'verkko',
				'DBJ_TITLE_1':'Heating',
				'DBJ_TITLE_2':'devices',
				'DBK_TITLE_1':'Kuuma',
				'DBK_TITLE_2':'vesi',
				'AUTO_UPDATE_MSG_1':'Kuvaaja päivittyy automaattisesti kerran',
				'AUTO_UPDATE_MSG_1_B':'Teholukemat päivittyvät automaattisesti kerran',
				'AUTO_UPDATE_MSG_2':'sekunnissa',
				'AUTO_UPDATE_MSG_3':'Kuvaaja EI päivity automaattisesti',
				'ADJUST_UPDATE_INTERVAL':'Säädä päivitystaajuutta (0-60s):',
				'SESSION_EXPIRED':'Kirjautuminen on vanhentunut... automaattinen uloskirjaus 3 sekunnissa!',
				'MENU_VERSION':'v 21.12.01'
			}
		}
	}
}
