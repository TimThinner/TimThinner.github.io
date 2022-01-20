export default class LanguageModel {
	constructor() {
		this.languages = ['en','fi'];
		this.selected = 'fi';
		this.translation = {
			'en':{
				'MENU_ABOUT':'This is just a demo.',
				'MENU_VERSION':'v 22.01.20'
			},
			'fi':{
				'MENU_ABOUT':'Tämä on vain demo.',
				'MENU_VERSION':'v 22.01.20'
			}
		}
	}
}
