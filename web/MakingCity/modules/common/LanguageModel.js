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
				'DA_DESCRIPTION':'This view will contain all components for District A.'
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
				'DA_DESCRIPTION':'Tähän näyttöön kaikki tämän alueen komponentit.'
			}
		}
	}
}
