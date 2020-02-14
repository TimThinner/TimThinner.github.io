export default class LanguageModel {
	constructor() {
		this.languages = ['en','fi'];
		this.selected = 'en';
		this.translation = {
			'en':{
				'MENU_D_A_LABEL':'District A',
				'MENU_D_B_LABEL':'District B',
				'MENU_D_C_LABEL':'District C',
				'MENU_D_D_LABEL':'District D',
				'MENU_D_E_LABEL':'District E',
				'MENU_TITLE':'Positive Energy Districts',
				'MENU_DESCRIPTION':'The project pilots low-carbon energy technologies. The project is funded by EU’s Horizon 2020 programme and is a part of the Smart Cities and Communities (SCC) theme.',
				'SOLAR_PANELS':'SOLAR PANELS',
				'GRID_TEXT':'GRID',
				'DA_BACK':'BACK',
				'DA_DESCRIPTION':'This view will contain all components for District A.',
				'DAA_TITLE':'Total Consumption',
				'DAB_TITLE':'Solar energy',
				'DAC_TITLE':'Lights and appliances',
				'DAD_TITLE':'Kitchen appliances',
				'DAA_POWER':'Power',
				'DAA_ENERGY':'Energy',
				'AUTO_UPDATE_MSG_1':'Chart is automatically updated once every',
				'AUTO_UPDATE_MSG_1_B':'Power consumption values are automatically updated once every',
				'AUTO_UPDATE_MSG_2':'seconds',
				'AUTO_UPDATE_MSG_3':'Chart is NOT automatically updated',
				'ADJUST_UPDATE_INTERVAL':'Adjust the update interval (0-60s):'
			},
			'fi':{
				'MENU_D_A_LABEL':'Alue A',
				'MENU_D_B_LABEL':'Alue B',
				'MENU_D_C_LABEL':'Alue C',
				'MENU_D_D_LABEL':'Alue D',
				'MENU_D_E_LABEL':'Alue E',
				'MENU_TITLE':'Energiataseeltaan positiivinen alue',
				'MENU_DESCRIPTION':'Hankkeessa pilotoidaan vähähiilisiä energiateknologioita. Hanke saa rahoitusta EU:n Horizon 2020 -ohjelmasta. Se kuuluu Smart Cities and Communities (SCC) -teemaan.',
				'SOLAR_PANELS':'AURINKOPANEELIT',
				'GRID_TEXT':'SÄHKÖVERKKO',
				'DA_BACK':'TAKAISIN',
				'DA_DESCRIPTION':'Tähän näyttöön kaikki tämän alueen komponentit.',
				'DAA_TITLE':'Kokonaiskulutus',
				'DAB_TITLE':'Aurinkoenergia',
				'DAC_TITLE':'Valaistus ja laitteet',
				'DAD_TITLE':'Keittiön laitteet',
				'DAA_POWER':'Teho',
				'DAA_ENERGY':'Energia',
				'AUTO_UPDATE_MSG_1':'Kuvaaja päivittyy automaattisesti kerran',
				'AUTO_UPDATE_MSG_1_B':'Teholukemat päivittyvät automaattisesti kerran',
				'AUTO_UPDATE_MSG_2':'sekunnissa',
				'AUTO_UPDATE_MSG_3':'Kuvaaja EI päivity automaattisesti',
				'ADJUST_UPDATE_INTERVAL':'Säädä päivitystaajuutta (0-60s):'
			}
		}
	}
}
