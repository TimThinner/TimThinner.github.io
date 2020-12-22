export default class LanguageModel {
	constructor() {
		this.languages = ['en','fi'];
		this.selected = 'en';
		this.translation = {
			'en':{
				'EXAMPLE_1':'Example 1',
				'EXAMPLE_2':'Example 2',
				'SESSION_EXPIRED':'Session has expired... logging out NOW!'
			},
			'fi':{
				'EXAMPLE_1':'Esimerkki 1',
				'EXAMPLE_2':'Esimerkki 2',
				'SESSION_EXPIRED':'Sessio on vanhentunut... automaattinen logout NYT!'
			}
		}
	}
}
