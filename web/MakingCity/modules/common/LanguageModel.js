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
				'MENU_DESCRIPTION':'Place description in English here.',
				'SOLAR_PANELS':'SOLAR PANELS',
				'DA_DESCRIPTION':'This view will contain all charts and graphs for District A. Click the button "Toggle direction" to change energy flow back to GRID.',
			},
			'fi':{
				'MENU_D_A_LABEL':'Alue A',
				'MENU_D_B_LABEL':'Alue B',
				'MENU_D_C_LABEL':'Alue C',
				'MENU_D_D_LABEL':'Alue D',
				'MENU_D_E_LABEL':'Alue E',
				'MENU_TITLE':'Positiivisia energia-alueita',
				'MENU_DESCRIPTION':'Tähän kuvausta suomeksi.',
				'SOLAR_PANELS':'AURINKOPANEELIT',
				'DA_DESCRIPTION':'Tähän näyttöön kaikki tämän alueen visualisonnit. Paina nappia "Vaihda suuntaa" ja energia virtaa takaisin syöttöverkkoon.'
			}
		}
	}
}
