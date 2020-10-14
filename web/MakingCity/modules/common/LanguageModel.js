export default class LanguageModel {
	constructor() {
		this.languages = ['en','fi'];
		this.selected = 'en';
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
				'USER_ELECTRICITY_TITLE':'Electricity',
				'USER_ELECTRICITY_DESCRIPTION':'Here you will find more information about your electricity consumption.',
				'USER_HEATING_TITLE':'Heating',
				'USER_HEATING_DESCRIPTION':'Here you will find more information about your heating.',
				'USER_WATER_TITLE':'Water',
				'USER_WATER_DESCRIPTION':'Here you will find more information about your water consumption.',
				'DISTRICT_A_LABEL':'S-Arina',
				'DISTRICT_B_LABEL':'Sivakka 1',
				'DISTRICT_C_LABEL':'Sivakka 2',
				'DISTRICT_D_LABEL':'YIT 1',
				'DISTRICT_E_LABEL':'YIT 2',
				'MENU_TITLE':'Positive Energy Districts',
				'MENU_DESCRIPTION':'<a href="http://makingcity.eu/" target="_blank" rel="noreferrer noopener" aria-label="This is an external link (opens in a new tab)">THE MAKING-CITY PROJECT</a> is funded by EU’s Horizon 2020 programme and is a part of the Smart Cities and Communities (SCC) theme.',
				'MENU_VERSION':'v 20.10.14',
				'SOLAR_PANELS':'SOLAR PANELS',
				'GRID_TEXT':'GRID',
				'DA_BACK':'BACK',
				'DA_CANCEL':'CANCEL',
				'DA_DESCRIPTION':'This view will contain all components for District A.',
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
				'USER_ELECTRICITY_TITLE':'Asuntokohtainen sähkönkulutus',
				'USER_ELECTRICITY_DESCRIPTION':'Täältä löytyvät tiedot asuntokohtaisesta sähkönkulutuksesta.',
				'USER_HEATING_TITLE':'Asuntokohtainen lämmitys',
				'USER_HEATING_DESCRIPTION':'Täältä löytyvät tiedot asuntokohtaisesta lämmityksestä.',
				'USER_WATER_TITLE':'Asuntokohtainen vedenkulutus',
				'USER_WATER_DESCRIPTION':'Täältä löytyvät tiedot asuntokohtaisesta vedenkulutuksesta',
				'DISTRICT_A_LABEL':'S-Arina',
				'DISTRICT_B_LABEL':'Sivakka 1',
				'DISTRICT_C_LABEL':'Sivakka 2',
				'DISTRICT_D_LABEL':'YIT 1',
				'DISTRICT_E_LABEL':'YIT 2',
				'MENU_TITLE':'Energiataseeltaan positiivinen alue',
				'MENU_DESCRIPTION':'<a href="http://makingcity.eu/" target="_blank" rel="noreferrer noopener" aria-label="This is an external link (opens in a new tab)">MAKING-CITY HANKE</a> saa rahoitusta EU:n Horizon 2020 -ohjelmasta. Se kuuluu Smart Cities and Communities (SCC) -teemaan.',
				'MENU_VERSION':'v 20.10.14',
				'SOLAR_PANELS':'AURINKOPANEELIT',
				'GRID_TEXT':'SÄHKÖVERKKO',
				'DA_BACK':'TAKAISIN',
				'DA_CANCEL':'PERU',
				'DA_DESCRIPTION':'Tähän näyttöön kaikki tämän alueen komponentit.',
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
