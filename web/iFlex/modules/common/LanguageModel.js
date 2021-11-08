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
				'USER_SIGNUP_COMING_SOON':'Signup coming soon...',
				'USER_SIGNUP_TITLE':'Signup',
				'USER_SIGNUP_BTN_TXT':'Signup',
				'USER_SIGNUP_SENSORS_TXT':'You can also have sensors to measure temperature and humidity in your apartment. This data is shown only to you. Check the checkbox below if you want sensors. Due to limited number of sensors in this pilot, please be quick.',
				'USER_SIGNUP_SENSORS_CHECKBOX_LABEL':'Yes, I want sensors.',
				'USER_SIGNUP_CONSENT_OK_1':'I have read the ',
				'USER_SIGNUP_GDPR_LINK_TXT':'GDPR statement',
				'USER_SIGNUP_CONSENT_OK_2':' and given my consent in ',
				'USER_SIGNUP_CONSENT_LINK_TXT':'consent form.',
				'USER_SIGNUP_APARTMENT_NUMBER':'Apartment number',
				'USER_SIGNUP_APARTMENT_NOT_SELECTED':'Not selected',
				'USER_SIGNUP_APARTMENT_MUST_INPUT':'Must input <b>Apartment number</b>',
				'USER_PROPS_TITLE':'User Properties',
				'USER_PROPS_DESCRIPTION':'User can can view and modify own properties here.',
				'USER_PROPS_CHANGE_PASSWORD_BTN_TXT':'Change your password',
				'USER_PROPS_CONSENT':'Click this link to read the ',
				'USER_PROPS_ADMIN_DESCRIPTION':'Admin can view and edit RegCodes, view Users and associated ReadKeys.',
				'USER_PROPS_ADMIN_REGCODES':'RegCodes',
				'USER_PROPS_ADMIN_REGCODES_CREATE_BTN_TXT': 'Create new',
				'USER_PROPS_ADMIN_USERS':'Users',
				'USER_CHANGE_PASSWORD_TITLE':'Change password',
				'USER_OLD_PASSWORD':'Old password',
				'USER_NEW_PASSWORD':'New password',
				'USER_CONSENT_TXT':'You can also view and modify your ',
				'USER_CONSENT_LINK_TXT':'consent form.',
				'USER_GDPR_TXT':'You can also view ',
				'USER_GDPR_LINK_TXT':'GDPR text.',
				'ADMIN_START_LABEL':'Start',
				'ADMIN_END_LABEL':'End',
				'ADMIN_CREATE_NEW_REGCODE_TITLE':'Create a new RegCode',
				'ADMIN_CREATE_NEW_REGCODE_APA_ID':'Apartment ID',
				'ADMIN_CREATE_NEW_REGCODE_INVALID_START_DATE':'Invalid start date',
				'ADMIN_CREATE_NEW_REGCODE_INVALID_END_DATE':'Invalid end date',
				'ADMIN_CREATE_NEW_REGCODE_INVALID_DATE_ORDER':'End must be after the start.',
				'ADMIN_EDIT_REGCODE_TITLE':'RegCode',
				'ADMIN_EDIT_REGCODE_DESCRIPTION':'Modify RegCodes validity period.',
				'ADMIN_EDIT_REGCODE_APARTMENT':'Apartment',
				'ADMIN_EDIT_READKEY_TITLE':'ReadKey',
				'ADMIN_EDIT_READKEY_DESCRIPTION':'Modify ReadKey validity period.',
				'ADMIN_EDIT_OBIXCODE_TITLE':'Obix code',
				'ADMIN_EDIT_OBIXCODE_DESCRIPTION':'You can modify Users Obix code',
				'ADMIN_EDIT_OBIXCODE_LABEL':'Obix code',
				'BACK':'&nbsp;BACK&nbsp;',
				'OK':'&nbsp;&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;&nbsp;',
				'CANCEL':'CANCEL',
				'SAVE':'&nbsp;SAVE&nbsp;',
				'UPDATE':'UPDATE',
				'VALIDATOR_NOT_VALID':' not valid',
				'VALIDATOR_MISSING':' missing',
				'VALIDATOR_TOO_SHORT':' too short',
				'VALIDATOR_NOT_A_NUMBER':' not a number',
				'VALIDATOR_MUST_BE_POSITIVE_NUMBER':' must be positive number',
				'VALIDATOR_MUST_BE_GREATER_THAN_ZERO':' must be greater than zero',
				'FEEDBACK_BUILDING_TITLE':'Feedback about the whole building',
				'FEEDBACK_BUILDING_DESCRIPTION_1':'How do you feel about the building temperature today?',
				'FEEDBACK_BUILDING_DESCRIPTION_2':'Select smiley and/or write free text feedback and send.',
				'FEEDBACK_APARTMENT_TITLE':'Feedback about your apartment',
				'FEEDBACK_APARTMENT_DESCRIPTION_1':'How do you feel about your apartment temperature today?',
				'FEEDBACK_APARTMENT_DESCRIPTION_2':'Select smiley and/or write free text feedback and send.',
				'FEEDBACK_TEXT_COLD':'Cold',
				'FEEDBACK_TEXT_COOL':'Cool',
				'FEEDBACK_TEXT_SLIGHTLY_COOL':'Slightly Cool',
				'FEEDBACK_TEXT_HAPPY':'Happy',
				'FEEDBACK_TEXT_SLIGHTLY_WARM':'Slightly  Warm',
				'FEEDBACK_TEXT_WARM':'Warm',
				'FEEDBACK_TEXT_HOT':'Hot',
				'FEEDBACK_FREE_TEXT_LABEL':'Free text feedback',
				'FEEDBACK_SEND_FEEDBACK':'Send',
				'FEEDBACK_SENT_OK':'Thank you for your feedback!',
				'BUILDING_ELECTRICITY_TITLE':'Building electricity consumption',
				'BUILDING_HEATING_TITLE':'Building district heating',
				'BUILDING_POWER':'Power',
				'BUILDING_POWER_AXIS_LABEL':'Power (kW)',
				'BUILDING_POWER_LEGEND':'Instantaneous power',
				'BUILDING_CO2_TITLE':'Building CO<sub>2</sub> emissions',
				'BUILDING_CO2_DESCRIPTION':'This chart displays CO<sub>2</sub> emissions for electricity and district heating',
				'BUILDING_CO2_CONSUMPTION':'Consumption',
				'BUILDING_CO2_PRODUCTION':'Production',
				'BUILDING_EMISSION_EL':'EL',
				'BUILDING_EMISSION_DH':'DH',
				'BUILDING_EMISSION_AXIS_LABEL':'Emissions (kgCO2)',
				'BUILDING_EMISSION_EL_LEGEND':'Electricity',
				'BUILDING_EMISSION_DH_LEGEND':'District heating',
				'BUILDING_EMISSION_ALL':'Sum',
				'BUILDING_EMISSION_ALL_LEGEND':'Sum',
				'USER_HEATING_TITLE':'Apartment temperature and humidity',
				'USER_HEATING_TEMPERATURE_NOW_TITLE':'Temp (°C)',
				'USER_HEATING_HUMIDITY_NOW_TITLE':'Humidity (%)',
				'USER_HEATING_CO2_NOW_TITLE':'CO<sub>2</sub> (ppm)',
				'APARTMENT_TEMPERATURE_TOOLTIP':'Temperature',
				'APARTMENT_TEMPERATURE_AXIS_LABEL':'Temperature',
				'APARTMENT_TEMPERATURE_LEGEND':'Temperature',
				'APARTMENT_HUMIDITY_TOOLTIP':'Humidity',
				'APARTMENT_HUMIDITY_AXIS_LABEL':'Humidity',
				'APARTMENT_HUMIDITY_LEGEND':'Humidity',
				'CONSENT_TITLE':'SUOSTUMUS',
				'CONSENT_TEXT_A':'Vahvistan lukeneeni ja ymmärtäneeni tutkimustiedotteen ja sen liitteenä olleen tietosuojailmoituksen. Vahvistan, että tiedossani ei ole tutkimustiedotteessa esitettyä poissulkukriteeriä ja/tai täytän valintakriteerit. Minulla on ollut mahdollisuus harkita saamaani tietoa, esittää kysymyksiä ja olen saanut kysymyksiini riittävän vastauksen.',
				'CONSENT_CHECK_A':'Annan suostumukseni <b>tutkimukseen osallistumiseen</b>. Minulla on oikeus keskeyttää osallistuminen väliaikaisesti tai toistaiseksi (jättäytyä tutkimuksen vaiheen ulkopuolelle) tai peruuttaa suostumus, milloin tahansa ilman erityistä syytä ja syytä kertomatta.',
				'CONSENT_CHECK_B':'Annan suostumukseni <b>henkilötietojen käsittelyyn tutkimuksessa</b>. Minulla on oikeus, milloin tahansa perua suostumukseni ilman erityistä syytä ja syytä kertomatta.',
				'CONSENT_TEXT_B':'Voin perua yllä olevan suostumukseni, mutta ymmärrän aineiston julkiseksi saattamisen jälkeen poistamisen rajoitteet.',
				'GDPR_TITLE':'Tietosuojailmoitus tutkimukseen',
				'GDPR_DESCRIPTION':'Tietosuojailmoitus perustuu EU:n yleiseen tietosuoja-asetukseen (2016/679, "tietosuoja-asetus") ja tietosuojalakiin (1050/2018).',
				'GDPR_CHAPTER_1':'1. Tutkimuksen nimi ja kesto',
				'GDPR_CHAPTER_1A':'Tutkimuksen nimi: iFLEX (Intelligent Assistants for Flexibility Management',
				'GDPR_CHAPTER_1B':'Tutkimuksen kestoaika: 1.11.2020 - 31.10.2023',
				'GDPR_CHAPTER_2':'2. Rekisterinpitäjä(-t), tietosuojavastaava ja yhteyshenkilö(-t)',
				'GDPR_CHAPTER_2A':'Teknologian Tutkimuskeskus VTT Oy (”VTT”), Y-tunnus: 2647375-4, Vuorimiehentie 3, 02150 Espoo',
				'GDPR_CHAPTER_2AA':'Tietosuojavastaava:',
				'GDPR_CHAPTER_2AAA':'Nimi: Seppo Viinikainen',
				'GDPR_CHAPTER_2AAB':'Osoite: Teknologian tutkimuskeskus VTT Oy, Koivurannantie 1, 40400 Jyväskylä',
				'GDPR_CHAPTER_2AAC':'Sähköposti: <a href="mailto:Seppo.Viinikainen@vtt.fi">Seppo.Viinikainen@vtt.fi</a> (tietosuojavastaava) tai <a href="mailto:tietosuoja@vtt.fi">tietosuoja@vtt.fi</a> (tietosuojavastaava, tietoturvapäällikkö, HR ja lakimies)',
				'GDPR_CHAPTER_2AB':'Tutkimuksesta vastaavan yhteyshenkilön tai tutkimusryhmän yhteystiedot:',
				'GDPR_CHAPTER_2ABA':'Nimi: Markus Taumberger, Jussi Kiljander, Anne Immonen',
				'GDPR_CHAPTER_2ABB':'Osoite: Teknologian tutkimuskeskus VTT Oy, Kaitoväylä 1, 90571 Oulu',
				'GDPR_CHAPTER_2ABC':'Sähköposti: <a href="mailto:iFLEX-Info@vtt.fi">iFLEX-Info@vtt.fi</a>',
				'GDPR_CHAPTER_2B':'Muut yhteisrekisterinpitäjät:',
				'GDPR_CHAPTER_2BA':'<b>SCOM</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BB':'<b>Enerim</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BC':'<b>JSI</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BD':'<b>AUEB</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BE':'<b>ICOM</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BF':'<b>ELE</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BG':'<b>Caverion</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BH':'<b>IN-JET</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BI':'<b>ECE</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BJ':'<b>HERON</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BK':'<b>OPTIMUS</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BL':'<b>ZPS</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_3':'3. Yhteisrekisterin osalta rekisterinpitäjien vastuunjako',
				'GDPR_CHAPTER_3A':'Teknologian Tutkimuskeskus VTT Oy on ensisijainen rekisteröityjen yhteystaho ja koordinoi muiden yhteisrekisterinpitäjien suuntaan rekisteröityjen pyyntöjä. Muut yhteisrekisterinpitäjät (katso kohta 2) vastaavat omalta osaltaan pyyntöjen toteuttamisesta. Rekisteröity voi toteuttaa henkilötietojen käsittelyä koskevat oikeutensa keskitetysti yhteyshenkilön välityksellä: Seppo Viinikainen, Teknologian tutkimuskeskus VTT Oy, Koivurannantie 1, 40400 Jyväskylä, <a href="mailto:Seppo.Viinikainen@vtt.fi">Seppo.Viinikainen@vtt.fi</a>. Yhteyshenkilö toimittaa tarvittaessa rekisteröidyn yhteydenoton muille yhteisrekisterinpitäjille.',
				'GDPR_CHAPTER_4':'4. Käsiteltävät henkilötiedot',
				'GDPR_CHAPTER_4A':'Käsiteltävät henkilötiedot ovat: Asunnon lämpötila, kosteus, CO2, VOC-yhdisteet, käyttäjäpalaute.',
				'GDPR_CHAPTER_4B':'Henkilöt edustavat seuraavia ryhmiä: HOAS-opiskelija-asunnossa asuvia tutkimukseen osallistuvia henkilöitä.',
				'GDPR_CHAPTER_5':'5. Käsittelytarkoitus ja oikeusperuste',
				'GDPR_CHAPTER_5A':'Henkilötietojen käsittelyn tarkoitus on: VTT käsittelee kerättyjä tietoja suostumuksellasi projektissa tehtävään energia-aiheiseen tutkimukseen asuntojen olosuhteista ja energiankulutuksesta. Tietoja käytetään ainoastaan tutkimustarkoituksiin. Tietoja ei yhdistetä yksittäiseen henkilöön.',
				'GDPR_CHAPTER_5B':'Henkilötietojen käsittelyn oikeusperuste<sup>1</sup>:',
				'GDPR_CHAPTER_5BA':'Yleistä etua koskeva tehtävä',
				'GDPR_CHAPTER_5BAA':'tieteellinen tai historiallinen tutkimus tai tilastointi',
				'GDPR_CHAPTER_5BAB':'tutkimusaineistojen ja kulttuuriperintöaineistojen arkistointi',
				'GDPR_CHAPTER_5BB':'Rekisterinpitäjän tai kolmannen osapuolen oikeutettujen etujen toteuttaminen',
				'GDPR_CHAPTER_5BBA':'mikä oikeutettu etu on kyseessä:',
				'GDPR_CHAPTER_5BC':'Rekisteröidyn suostumus',
				'GDPR_CHAPTER_5BD':'Muu:',
				'GDPR_CHAPTER_5B_SUP':'<sup>1</sup>Tietosuoja-asetus, artikla 6 ja tietosuojalaki 4 §.',
				'GDPR_CHAPTER_6':'6. Henkilötietojen tietolähteet',
				'GDPR_CHAPTER_6A':'Tiedot saadaan keräämällä mittauslaitteilla ja sensoreilla asunnosta olosuhteisiin ja energiankulutukseen liittyviä tietoja. Lisäksi asukkaan on mahdollista antaa palautetta myös asukkaan käyttöliittymän kautta.',
				'GDPR_CHAPTER_7':'7. Henkilötietojen vastaanottajat tai vastaanottajaryhmät',
				'GDPR_CHAPTER_7A':'Henkilötietoja luovutetaan seuraaville vastaanottajille:',
				'GDPR_CHAPTER_7AA':'<b>SCOM</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AB':'<b>Enerim</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AC':'<b>JSI</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AD':'<b>AUEB</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AE':'<b>ICOM</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AF':'<b>ELE</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AG':'<b>Caverion</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AH':'<b>IN-JET</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AI':'<b>ECE</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AJ':'<b>HERON</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AK':'<b>OPTIMUS</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AL':'<b>ZPS</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AM':'<b>HOAS</b> - henkilötietojen vastaanottaja',
				'GDPR_CHAPTER_8':'8. Henkilötietojen siirto EU:n tai ETA:n ulkopuolelle',
				'GDPR_CHAPTER_8A':'Henkilötietoja siirretään EU:n/ ETA:n ulkopuolelle (huomioiden palvelimien sijainti ja myös pääsyoikeudet):',
				'GDPR_CHAPTER_8AA':'Ei',
				'GDPR_CHAPTER_8AB':'Mahdollista, mekanismi täsmentyy ja informoidaan tapauskohtaisesti.',
				'GDPR_CHAPTER_8AC':'Kyllä, seuraavilla tietosuoja-asetuksen mukaisilla menettelyillä: ',
				'GDPR_CHAPTER_8BA':'Tietosuojan riittävyyttä koskeva komission päätös.',
				'GDPR_CHAPTER_8BB':'Yritystä koskevat sitovat säännöt ',
				'GDPR_CHAPTER_8BC':'Komission mallisopimuslausekkeet.',
				'GDPR_CHAPTER_8BD':'Muu:',
				'GDPR_CHAPTER_8BE':'Tiedossa olevat maat:',
				'GDPR_CHAPTER_9':'9. Automaattinen päätöksenteko',
				'GDPR_CHAPTER_9A':'Automaattista päätöksentekoa ei henkilötiedoista tehdä.',
				'GDPR_CHAPTER_10':'10. Henkilötietojen säilyttäminen',
				'GDPR_CHAPTER_10A':'Tutkimusaineisto ja sen mukana henkilötiedot hävitetään tutkimuksen päätyttyä.',
				'GDPR_CHAPTER_10B':'Tutkimuksen päätyttyä tutkimusaineisto säilytetään 24 kuukauden ajan, ja',
				'GDPR_CHAPTER_10BA':'henkilötiedot anonymisoidaan',
				'GDPR_CHAPTER_10BB':'henkilötiedot pseudonymisoidaan',
				'GDPR_CHAPTER_10BC':'aineisto sisältää suoria rekisteröidyn tunnistetietoja, peruste:',
				'GDPR_CHAPTER_10C':'Tutkimusaineisto tallennetaan tutkimuksen päätyttyä VTT:n palvelimella ylläpidettävässä tietokannassa.',
				'GDPR_CHAPTER_11':'11. Henkilötietojen suojauksen periaatteet',
				'GDPR_CHAPTER_11A':'Tutkimuksen suorittamista varten tutkimusaineisto:',
				'GDPR_CHAPTER_11AA':'anonymisoidaan ennen tutkimuksen aloittamista',
				'GDPR_CHAPTER_11AB':'pseudonymisoidaan',
				'GDPR_CHAPTER_11AC':'käsitellään rekisteröidyn suorin tunnistetiedoin.',
				'GDPR_CHAPTER_11B':'<b>Manuaalisesti</b> käsiteltävien henkilötietojen suojaaminen: Henkilötiedot pseudonymisoidaan ja suojataan VTT:n tutkimusympäristön käytäntöjen mukaisesti.',
				'GDPR_CHAPTER_11C':'<b>Tietojärjestelmässä</b> käsiteltävien henkilötietojen suojaaminen:',
				'GDPR_CHAPTER_11CA':'käyttäjätunnus',
				'GDPR_CHAPTER_11CB':'salasana',
				'GDPR_CHAPTER_11CC':'kaksivaiheinen käyttäjän tunnistus (MFA)',
				'GDPR_CHAPTER_11CD':'pääsynhallinta verkko-osoitteiden avulla (IP-osoitteet)',
				'GDPR_CHAPTER_11CE':'käytön rekisteröinti (lokitietojen kerääminen)',
				'GDPR_CHAPTER_11CF':'kulunvalvonta',
				'GDPR_CHAPTER_11D':'<b>Tiedonsiirrossa</b> henkilötietojen suojaaminen:',
				'GDPR_CHAPTER_11DA':'tiedonsiirron salaus: HTTPS-standardi, SSL-protokolla',
				'GDPR_CHAPTER_11DB':'tiedoston salaus: Käyttäjätunnus ja salasana',
				'GDPR_CHAPTER_11DC':'muu, mikä:',
				'GDPR_CHAPTER_12':'12. Rekisteröidyn oikeudet',
				'GDPR_CHAPTER_12A':'Rekisteröidyllä on seuraavat oikeudet, joista kuitenkin voidaan poiketa ja/tai joita voidaan rajoittaa soveltuvan lainsäädännön mukaisesti. Rajoittaminen ja poikkeaminen tarkistetaan tapauskohtaisesti.',
				'GDPR_CHAPTER_12B':'Lisätietoja rekisteröidyn oikeuksista:',
				'GDPR_CHAPTER_12C':'<b>Oikeus peruuttaa suostumuksensa</b>',
				'GDPR_CHAPTER_12CA':'Mikäli käsittely perustuu suostumukseen, rekisteröidyllä on milloin tahansa oikeus peruuttaa suostumuksensa henkilötietojensa käsittelyä koskien.',
				'GDPR_CHAPTER_12D':'<b>Rekisteröidyn oikeus saada pääsy tietoihin</b>',
				'GDPR_CHAPTER_12DA':'Rekisteröidyllä on oikeus saada rekisterinpitäjältä vahvistus siitä, käsitelläänkö häntä koskevia henkilötietoja. Rekisteröidyllä on lisäksi oikeus saada pääsy rekisteröityä itseään koskeviin henkilötietoihin sekä tiedot henkilötietojen käsittelystä.',
				'GDPR_CHAPTER_12E':'<b>Oikeus tietojen oikaisemiseen</b>',
				'GDPR_CHAPTER_12EA':'Rekisteröidyllä on oikeus saada rekisteröityä koskevat epätarkat ja virheelliset henkilötiedot ilman aiheetonta viivytystä oikaistua ja puutteelliset henkilötiedot täydennettyä.',
				'GDPR_CHAPTER_12F':'<b>Oikeus tietojen poistamiseen, ns. "oikeus tulla unohdetuksi"</b>',
				'GDPR_CHAPTER_12FA':'Rekisteröidyllä on oikeus saada rekisterinpitäjä poistamaan rekisteröityä koskevat henkilötiedot ilman aiheetonta viivytystä.',
				'GDPR_CHAPTER_12G':'<b>Oikeus käsittelyn rajoittamiseen</b>',
				'GDPR_CHAPTER_12GA':'Rekisteröidyllä on tietyissä tilanteissa oikeus vaatia, että rekisterinpitäjä rajoittaa käsittelyä.',
				'GDPR_CHAPTER_12H':'<b>Oikeus siirtää tiedot järjestelmästä toiseen</b>',
				'GDPR_CHAPTER_12HA':'Rekisteröidyllä on oikeus saada häntä koskevat henkilötiedot, jotka hän on toimittanut rekisterinpitäjälle, ja oikeus siirtää kyseiset tiedot toiselle rekisterinpitäjälle siltä osin kuin käsittely perustuu suostumukseen tai sopimukseen, ja käsittely suoritetaan automaattisesti.',
				'GDPR_CHAPTER_12I':'<b>Oikeus tehdä valitus valvontaviranomaiselle</b>',
				'GDPR_CHAPTER_12IA':'Rekisteröidyllä on oikeus tehdä valitus valvontaviranomaisille, jos rekisteröity katsoo, että hänen oikeuksiaan on EU:n tietosuoja-asetuksen valossa loukattu. Tietosuojavaltuutetun yhteystiedot: <a href="https://tietosuoja.fi/yhteystiedot" target="_blank">https://tietosuoja.fi/yhteystiedot</a>',
				'GDPR_CHAPTER_12J':'<b>Rekisteröity voi toteuttaa yllämainitut oikeutensa ottamalla rekisterinpitäjään yhteyttä kohdassa 2 määriteltyjen yhteystietojen avulla, mieluiten sähköpostitse.</b>',
				'SESSION_EXPIRED':'Session has expired... logging out in 3 seconds!',
				'MENU_VERSION':'v 21.11.08'
			},
			'fi':{
				'USER_LOGIN_TITLE':'Kirjautuminen',
				'USER_EMAIL':'Sähköposti',
				'USER_PASSWORD':'Salasana',
				'USER_REGCODE':'Rekisteröintikoodi',
				'USER_LOGIN_BTN_TXT':'KIRJAUDU SISÄÄN',
				'USER_OPEN_SIGNUP_FORM':'Rekisteröityminen &raquo;',
				'USER_SIGNUP_COMING_SOON':'Rekisteröityminen tulossa pian...',
				'USER_SIGNUP_TITLE':'Rekisteröityminen',
				'USER_SIGNUP_BTN_TXT':'Rekisteröidy',
				'USER_SIGNUP_SENSORS_TXT':'Asuntoon on mahdollista asentaa lämpötila- ja kosteusmittaus. Laita rasti alla olevaan ruutuun jos haluat mittarit. Koska mittareita on tässä kokeilussa rajoitettu määrä, toimi nopeasti.',
				'USER_SIGNUP_SENSORS_CHECKBOX_LABEL':'Kyllä, haluan mittarit.',
				'USER_SIGNUP_CONSENT_OK_1':'Olen lukenut ',
				'USER_SIGNUP_GDPR_LINK_TXT':'tietosuojaselosteen',
				'USER_SIGNUP_CONSENT_OK_2':' ja annan suostumukseni ',
				'USER_SIGNUP_CONSENT_LINK_TXT':'suostumuslomakkeella.',
				'USER_SIGNUP_APARTMENT_NUMBER':'Asunnon numero',
				'USER_SIGNUP_APARTMENT_NOT_SELECTED':'Ei valittu',
				'USER_SIGNUP_APARTMENT_MUST_INPUT':'<b>Asunnon numero</b> täytyy ilmoittaa</b>',
				'USER_PROPS_TITLE':'Omat tiedot',
				'USER_PROPS_DESCRIPTION':'Tällä sivulla käyttäjä voi katsoa ja muokata omia tietojaan.',
				'USER_PROPS_CHANGE_PASSWORD_BTN_TXT':'Vaihda salasanasi',
				'USER_PROPS_CONSENT':'Täältä voit lukea ',
				'USER_PROPS_ADMIN_DESCRIPTION':'Ylläpitäjä voi nähdä ja muokata rekisteröintikoodeja ja lisäksi hallita kaikkien käyttäjien lukuavaimia.',
				'USER_PROPS_ADMIN_REGCODES':'Rekisteröintikoodit',
				'USER_PROPS_ADMIN_REGCODES_CREATE_BTN_TXT':'Luo uusi',
				'USER_PROPS_ADMIN_USERS':'Käyttäjät',
				'USER_CHANGE_PASSWORD_TITLE':'Salasanan vaihto',
				'USER_OLD_PASSWORD':'Vanha salasana',
				'USER_NEW_PASSWORD':'Uusi salasana',
				'USER_CONSENT_TXT':'Täältä voit katsella ja muokata ',
				'USER_CONSENT_LINK_TXT':'suostumuslomakettasi.',
				'USER_GDPR_TXT':'Täältä voit katsella ',
				'USER_GDPR_LINK_TXT':'GDPR tekstiä.',
				'ADMIN_START_LABEL':'Alkaa',
				'ADMIN_END_LABEL':'Loppuu',
				'ADMIN_CREATE_NEW_REGCODE_TITLE':'Uusi rekisteröintikoodi',
				'ADMIN_CREATE_NEW_REGCODE_APA_ID':'Asunnon ID',
				'ADMIN_CREATE_NEW_REGCODE_INVALID_START_DATE':'Alkuaika väärin',
				'ADMIN_CREATE_NEW_REGCODE_INVALID_END_DATE':'Loppuaika väärin',
				'ADMIN_CREATE_NEW_REGCODE_INVALID_DATE_ORDER':'Loppuaika ja alkuaika väärinpäin.',
				'ADMIN_EDIT_REGCODE_TITLE':'Rekisteröintikoodi',
				'ADMIN_EDIT_REGCODE_DESCRIPTION':'Voit muuttaa rekisteröintikoodin voimassaoloaikaa.',
				'ADMIN_EDIT_REGCODE_APARTMENT':'Asunto',
				'ADMIN_EDIT_READKEY_TITLE':'Lukuavain',
				'ADMIN_EDIT_READKEY_DESCRIPTION':'Voit muuttaa lukuavaimen voimassaoloaikaa.',
				'ADMIN_EDIT_OBIXCODE_TITLE':'Obix-koodi',
				'ADMIN_EDIT_OBIXCODE_DESCRIPTION':'Voit muuttaa käyttäjän Obix-koodia',
				'ADMIN_EDIT_OBIXCODE_LABEL':'Obix-koodi',
				'BACK':'TAKAISIN',
				'OK':'&nbsp;&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;&nbsp;',
				'CANCEL':'&nbsp;PERU&nbsp;',
				'SAVE':'TALLETA',
				'UPDATE':'PÄIVITÄ',
				'VALIDATOR_NOT_VALID':' ei kelpaa',
				'VALIDATOR_MISSING':' puuttuu',
				'VALIDATOR_TOO_SHORT':' liian lyhyt',
				'VALIDATOR_NOT_A_NUMBER':' ei ole numero',
				'VALIDATOR_MUST_BE_POSITIVE_NUMBER':' täytyy olla positiivinen numero',
				'VALIDATOR_MUST_BE_GREATER_THAN_ZERO':' täytyy olla suurempi kuin nolla',
				'FEEDBACK_BUILDING_TITLE':'Palaute koskien koko taloa',
				'FEEDBACK_BUILDING_DESCRIPTION_1':'Miltä rakennuksen lämpötila tänään tuntuu?',
				'FEEDBACK_BUILDING_DESCRIPTION_2':'Valitse sopiva tunnetila ja/tai kirjoita vapaamuotoinen teksti ja lähetä.',
				'FEEDBACK_APARTMENT_TITLE':'Palaute koskien asuntoa',
				'FEEDBACK_APARTMENT_DESCRIPTION_1':'Miltä asuntosi lämpötila tänään tuntuu?',
				'FEEDBACK_APARTMENT_DESCRIPTION_2':'Valitse sopiva tunnetila ja/tai kirjoita vapaamuotoinen teksti ja lähetä.',
				'FEEDBACK_TEXT_COLD':'Kylmä',
				'FEEDBACK_TEXT_COOL':'Viileä',
				'FEEDBACK_TEXT_SLIGHTLY_COOL':'Hieman viileä',
				'FEEDBACK_TEXT_HAPPY':'Tyytyväinen',
				'FEEDBACK_TEXT_SLIGHTLY_WARM':'Hieman lämmin',
				'FEEDBACK_TEXT_WARM':'Lämmin',
				'FEEDBACK_TEXT_HOT':'Kuuma',
				'FEEDBACK_FREE_TEXT_LABEL':'Vapaamuotoinen palaute',
				'FEEDBACK_SEND_FEEDBACK':'Lähetä',
				'FEEDBACK_SENT_OK':'Kiitos palautteestasi!',
				'BUILDING_ELECTRICITY_TITLE':'Rakennuksen sähkönkulutus',
				'BUILDING_HEATING_TITLE':'Rakennuksen kaukolämmön kulutus',
				'BUILDING_POWER':'Teho',
				'BUILDING_POWER_AXIS_LABEL':'Teho (kW)',
				'BUILDING_POWER_LEGEND':'Hetkellinen teho',
				'BUILDING_CO2_TITLE':'Rakennuksen hiilijalanjälki',
				'BUILDING_CO2_DESCRIPTION':'Sähkön ja kaukolämmön CO<sub>2</sub> päästöt',
				'BUILDING_CO2_CONSUMPTION':'Kulutus',
				'BUILDING_CO2_PRODUCTION':'Tuotanto',
				'BUILDING_EMISSION_EL':'Sähkö',
				'BUILDING_EMISSION_DH':'KL',
				'BUILDING_EMISSION_AXIS_LABEL':'Päästöt (kgCO2)',
				'BUILDING_EMISSION_EL_LEGEND':'Sähkö',
				'BUILDING_EMISSION_DH_LEGEND':'Kaukolämpö',
				'BUILDING_EMISSION_ALL':'Summa',
				'BUILDING_EMISSION_ALL_LEGEND':'Summa',
				'USER_HEATING_TITLE':'Asunnon lämpötila ja kosteus',
				'USER_HEATING_TEMPERATURE_NOW_TITLE':'Lämpötila (°C)',
				'USER_HEATING_HUMIDITY_NOW_TITLE':'Kosteus (%)',
				'USER_HEATING_CO2_NOW_TITLE':'CO<sub>2</sub> (ppm)',
				'APARTMENT_TEMPERATURE_TOOLTIP':'Lämpötila',
				'APARTMENT_TEMPERATURE_AXIS_LABEL':'Lämpötila',
				'APARTMENT_TEMPERATURE_LEGEND':'Lämpötila',
				'APARTMENT_HUMIDITY_TOOLTIP':'Kosteus',
				'APARTMENT_HUMIDITY_AXIS_LABEL':'Kosteus',
				'APARTMENT_HUMIDITY_LEGEND':'Kosteus',
				'CONSENT_TITLE':'SUOSTUMUS',
				'CONSENT_TEXT_A':'Vahvistan lukeneeni ja ymmärtäneeni tutkimustiedotteen ja sen liitteenä olleen tietosuojailmoituksen. Vahvistan, että tiedossani ei ole tutkimustiedotteessa esitettyä poissulkukriteeriä ja/tai täytän valintakriteerit. Minulla on ollut mahdollisuus harkita saamaani tietoa, esittää kysymyksiä ja olen saanut kysymyksiini riittävän vastauksen.',
				'CONSENT_CHECK_A':'Annan suostumukseni <b>tutkimukseen osallistumiseen</b>. Minulla on oikeus keskeyttää osallistuminen väliaikaisesti tai toistaiseksi (jättäytyä tutkimuksen vaiheen ulkopuolelle) tai peruuttaa suostumus, milloin tahansa ilman erityistä syytä ja syytä kertomatta.',
				'CONSENT_CHECK_B':'Annan suostumukseni <b>henkilötietojen käsittelyyn tutkimuksessa</b>. Minulla on oikeus, milloin tahansa perua suostumukseni ilman erityistä syytä ja syytä kertomatta.',
				'CONSENT_TEXT_B':'Voin perua yllä olevan suostumukseni, mutta ymmärrän aineiston julkiseksi saattamisen jälkeen poistamisen rajoitteet.',
				'GDPR_TITLE':'Tietosuojailmoitus tutkimukseen',
				'GDPR_DESCRIPTION':'Tietosuojailmoitus perustuu EU:n yleiseen tietosuoja-asetukseen (2016/679, "tietosuoja-asetus") ja tietosuojalakiin (1050/2018).',
				'GDPR_CHAPTER_1':'1. Tutkimuksen nimi ja kesto',
				'GDPR_CHAPTER_1A':'Tutkimuksen nimi: iFLEX (Intelligent Assistants for Flexibility Management',
				'GDPR_CHAPTER_1B':'Tutkimuksen kestoaika: 1.11.2020 - 31.10.2023',
				'GDPR_CHAPTER_2':'2. Rekisterinpitäjä(-t), tietosuojavastaava ja yhteyshenkilö(-t)',
				'GDPR_CHAPTER_2A':'Teknologian Tutkimuskeskus VTT Oy (”VTT”), Y-tunnus: 2647375-4, Vuorimiehentie 3, 02150 Espoo',
				'GDPR_CHAPTER_2AA':'Tietosuojavastaava:',
				'GDPR_CHAPTER_2AAA':'Nimi: Seppo Viinikainen',
				'GDPR_CHAPTER_2AAB':'Osoite: Teknologian tutkimuskeskus VTT Oy, Koivurannantie 1, 40400 Jyväskylä',
				'GDPR_CHAPTER_2AAC':'Sähköposti: <a href="mailto:Seppo.Viinikainen@vtt.fi">Seppo.Viinikainen@vtt.fi</a> (tietosuojavastaava) tai <a href="mailto:tietosuoja@vtt.fi">tietosuoja@vtt.fi</a> (tietosuojavastaava, tietoturvapäällikkö, HR ja lakimies)',
				'GDPR_CHAPTER_2AB':'Tutkimuksesta vastaavan yhteyshenkilön tai tutkimusryhmän yhteystiedot:',
				'GDPR_CHAPTER_2ABA':'Nimi: Markus Taumberger, Jussi Kiljander, Anne Immonen',
				'GDPR_CHAPTER_2ABB':'Osoite: Teknologian tutkimuskeskus VTT Oy, Kaitoväylä 1, 90571 Oulu',
				'GDPR_CHAPTER_2ABC':'Sähköposti: <a href="mailto:iFLEX-Info@vtt.fi">iFLEX-Info@vtt.fi</a>',
				'GDPR_CHAPTER_2B':'Muut yhteisrekisterinpitäjät:',
				'GDPR_CHAPTER_2BA':'<b>SCOM</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BB':'<b>Enerim</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BC':'<b>JSI</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BD':'<b>AUEB</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BE':'<b>ICOM</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BF':'<b>ELE</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BG':'<b>Caverion</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BH':'<b>IN-JET</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BI':'<b>ECE</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BJ':'<b>HERON</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BK':'<b>OPTIMUS</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_2BL':'<b>ZPS</b> Tietosuojavastaava: e-mail',
				'GDPR_CHAPTER_3':'3. Yhteisrekisterin osalta rekisterinpitäjien vastuunjako',
				'GDPR_CHAPTER_3A':'Teknologian Tutkimuskeskus VTT Oy on ensisijainen rekisteröityjen yhteystaho ja koordinoi muiden yhteisrekisterinpitäjien suuntaan rekisteröityjen pyyntöjä. Muut yhteisrekisterinpitäjät (katso kohta 2) vastaavat omalta osaltaan pyyntöjen toteuttamisesta. Rekisteröity voi toteuttaa henkilötietojen käsittelyä koskevat oikeutensa keskitetysti yhteyshenkilön välityksellä: Seppo Viinikainen, Teknologian tutkimuskeskus VTT Oy, Koivurannantie 1, 40400 Jyväskylä, <a href="mailto:Seppo.Viinikainen@vtt.fi">Seppo.Viinikainen@vtt.fi</a>. Yhteyshenkilö toimittaa tarvittaessa rekisteröidyn yhteydenoton muille yhteisrekisterinpitäjille.',
				'GDPR_CHAPTER_4':'4. Käsiteltävät henkilötiedot',
				'GDPR_CHAPTER_4A':'Käsiteltävät henkilötiedot ovat: Asunnon lämpötila, kosteus, CO2, VOC-yhdisteet, käyttäjäpalaute.',
				'GDPR_CHAPTER_4B':'Henkilöt edustavat seuraavia ryhmiä: HOAS-opiskelija-asunnossa asuvia tutkimukseen osallistuvia henkilöitä.',
				'GDPR_CHAPTER_5':'5. Käsittelytarkoitus ja oikeusperuste',
				'GDPR_CHAPTER_5A':'Henkilötietojen käsittelyn tarkoitus on: VTT käsittelee kerättyjä tietoja suostumuksellasi projektissa tehtävään energia-aiheiseen tutkimukseen asuntojen olosuhteista ja energiankulutuksesta. Tietoja käytetään ainoastaan tutkimustarkoituksiin. Tietoja ei yhdistetä yksittäiseen henkilöön.',
				'GDPR_CHAPTER_5B':'Henkilötietojen käsittelyn oikeusperuste<sup>1</sup>:',
				'GDPR_CHAPTER_5BA':'Yleistä etua koskeva tehtävä',
				'GDPR_CHAPTER_5BAA':'tieteellinen tai historiallinen tutkimus tai tilastointi',
				'GDPR_CHAPTER_5BAB':'tutkimusaineistojen ja kulttuuriperintöaineistojen arkistointi',
				'GDPR_CHAPTER_5BB':'Rekisterinpitäjän tai kolmannen osapuolen oikeutettujen etujen toteuttaminen',
				'GDPR_CHAPTER_5BBA':'mikä oikeutettu etu on kyseessä:',
				'GDPR_CHAPTER_5BC':'Rekisteröidyn suostumus',
				'GDPR_CHAPTER_5BD':'Muu:',
				'GDPR_CHAPTER_5B_SUP':'<sup>1</sup>Tietosuoja-asetus, artikla 6 ja tietosuojalaki 4 §.',
				'GDPR_CHAPTER_6':'6. Henkilötietojen tietolähteet',
				'GDPR_CHAPTER_6A':'Tiedot saadaan keräämällä mittauslaitteilla ja sensoreilla asunnosta olosuhteisiin ja energiankulutukseen liittyviä tietoja. Lisäksi asukkaan on mahdollista antaa palautetta myös asukkaan käyttöliittymän kautta.',
				'GDPR_CHAPTER_7':'7. Henkilötietojen vastaanottajat tai vastaanottajaryhmät',
				'GDPR_CHAPTER_7A':'Henkilötietoja luovutetaan seuraaville vastaanottajille:',
				'GDPR_CHAPTER_7AA':'<b>SCOM</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AB':'<b>Enerim</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AC':'<b>JSI</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AD':'<b>AUEB</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AE':'<b>ICOM</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AF':'<b>ELE</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AG':'<b>Caverion</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AH':'<b>IN-JET</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AI':'<b>ECE</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AJ':'<b>HERON</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AK':'<b>OPTIMUS</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AL':'<b>ZPS</b> - yhteisrekisterinpitäjä, henkilötietojen käsittelijä',
				'GDPR_CHAPTER_7AM':'<b>HOAS</b> - henkilötietojen vastaanottaja',
				'GDPR_CHAPTER_8':'8. Henkilötietojen siirto EU:n tai ETA:n ulkopuolelle',
				'GDPR_CHAPTER_8A':'Henkilötietoja siirretään EU:n/ ETA:n ulkopuolelle (huomioiden palvelimien sijainti ja myös pääsyoikeudet):',
				'GDPR_CHAPTER_8AA':'Ei',
				'GDPR_CHAPTER_8AB':'Mahdollista, mekanismi täsmentyy ja informoidaan tapauskohtaisesti.',
				'GDPR_CHAPTER_8AC':'Kyllä, seuraavilla tietosuoja-asetuksen mukaisilla menettelyillä: ',
				'GDPR_CHAPTER_8BA':'Tietosuojan riittävyyttä koskeva komission päätös.',
				'GDPR_CHAPTER_8BB':'Yritystä koskevat sitovat säännöt ',
				'GDPR_CHAPTER_8BC':'Komission mallisopimuslausekkeet.',
				'GDPR_CHAPTER_8BD':'Muu:',
				'GDPR_CHAPTER_8BE':'Tiedossa olevat maat:',
				'GDPR_CHAPTER_9':'9. Automaattinen päätöksenteko',
				'GDPR_CHAPTER_9A':'Automaattista päätöksentekoa ei henkilötiedoista tehdä.',
				'GDPR_CHAPTER_10':'10. Henkilötietojen säilyttäminen',
				'GDPR_CHAPTER_10A':'Tutkimusaineisto ja sen mukana henkilötiedot hävitetään tutkimuksen päätyttyä.',
				'GDPR_CHAPTER_10B':'Tutkimuksen päätyttyä tutkimusaineisto säilytetään 24 kuukauden ajan, ja',
				'GDPR_CHAPTER_10BA':'henkilötiedot anonymisoidaan',
				'GDPR_CHAPTER_10BB':'henkilötiedot pseudonymisoidaan',
				'GDPR_CHAPTER_10BC':'aineisto sisältää suoria rekisteröidyn tunnistetietoja, peruste:',
				'GDPR_CHAPTER_10C':'Tutkimusaineisto tallennetaan tutkimuksen päätyttyä VTT:n palvelimella ylläpidettävässä tietokannassa.',
				'GDPR_CHAPTER_11':'11. Henkilötietojen suojauksen periaatteet',
				'GDPR_CHAPTER_11A':'Tutkimuksen suorittamista varten tutkimusaineisto:',
				'GDPR_CHAPTER_11AA':'anonymisoidaan ennen tutkimuksen aloittamista',
				'GDPR_CHAPTER_11AB':'pseudonymisoidaan',
				'GDPR_CHAPTER_11AC':'käsitellään rekisteröidyn suorin tunnistetiedoin.',
				'GDPR_CHAPTER_11B':'<b>Manuaalisesti</b> käsiteltävien henkilötietojen suojaaminen: Henkilötiedot pseudonymisoidaan ja suojataan VTT:n tutkimusympäristön käytäntöjen mukaisesti.',
				'GDPR_CHAPTER_11C':'<b>Tietojärjestelmässä</b> käsiteltävien henkilötietojen suojaaminen:',
				'GDPR_CHAPTER_11CA':'käyttäjätunnus',
				'GDPR_CHAPTER_11CB':'salasana',
				'GDPR_CHAPTER_11CC':'kaksivaiheinen käyttäjän tunnistus (MFA)',
				'GDPR_CHAPTER_11CD':'pääsynhallinta verkko-osoitteiden avulla (IP-osoitteet)',
				'GDPR_CHAPTER_11CE':'käytön rekisteröinti (lokitietojen kerääminen)',
				'GDPR_CHAPTER_11CF':'kulunvalvonta',
				'GDPR_CHAPTER_11D':'<b>Tiedonsiirrossa</b> henkilötietojen suojaaminen:',
				'GDPR_CHAPTER_11DA':'tiedonsiirron salaus: HTTPS-standardi, SSL-protokolla',
				'GDPR_CHAPTER_11DB':'tiedoston salaus: Käyttäjätunnus ja salasana',
				'GDPR_CHAPTER_11DC':'muu, mikä:',
				'GDPR_CHAPTER_12':'12. Rekisteröidyn oikeudet',
				'GDPR_CHAPTER_12A':'Rekisteröidyllä on seuraavat oikeudet, joista kuitenkin voidaan poiketa ja/tai joita voidaan rajoittaa soveltuvan lainsäädännön mukaisesti. Rajoittaminen ja poikkeaminen tarkistetaan tapauskohtaisesti.',
				'GDPR_CHAPTER_12B':'Lisätietoja rekisteröidyn oikeuksista:',
				'GDPR_CHAPTER_12C':'<b>Oikeus peruuttaa suostumuksensa</b>',
				'GDPR_CHAPTER_12CA':'Mikäli käsittely perustuu suostumukseen, rekisteröidyllä on milloin tahansa oikeus peruuttaa suostumuksensa henkilötietojensa käsittelyä koskien.',
				'GDPR_CHAPTER_12D':'<b>Rekisteröidyn oikeus saada pääsy tietoihin</b>',
				'GDPR_CHAPTER_12DA':'Rekisteröidyllä on oikeus saada rekisterinpitäjältä vahvistus siitä, käsitelläänkö häntä koskevia henkilötietoja. Rekisteröidyllä on lisäksi oikeus saada pääsy rekisteröityä itseään koskeviin henkilötietoihin sekä tiedot henkilötietojen käsittelystä.',
				'GDPR_CHAPTER_12E':'<b>Oikeus tietojen oikaisemiseen</b>',
				'GDPR_CHAPTER_12EA':'Rekisteröidyllä on oikeus saada rekisteröityä koskevat epätarkat ja virheelliset henkilötiedot ilman aiheetonta viivytystä oikaistua ja puutteelliset henkilötiedot täydennettyä.',
				'GDPR_CHAPTER_12F':'<b>Oikeus tietojen poistamiseen, ns. "oikeus tulla unohdetuksi"</b>',
				'GDPR_CHAPTER_12FA':'Rekisteröidyllä on oikeus saada rekisterinpitäjä poistamaan rekisteröityä koskevat henkilötiedot ilman aiheetonta viivytystä.',
				'GDPR_CHAPTER_12G':'<b>Oikeus käsittelyn rajoittamiseen</b>',
				'GDPR_CHAPTER_12GA':'Rekisteröidyllä on tietyissä tilanteissa oikeus vaatia, että rekisterinpitäjä rajoittaa käsittelyä.',
				'GDPR_CHAPTER_12H':'<b>Oikeus siirtää tiedot järjestelmästä toiseen</b>',
				'GDPR_CHAPTER_12HA':'Rekisteröidyllä on oikeus saada häntä koskevat henkilötiedot, jotka hän on toimittanut rekisterinpitäjälle, ja oikeus siirtää kyseiset tiedot toiselle rekisterinpitäjälle siltä osin kuin käsittely perustuu suostumukseen tai sopimukseen, ja käsittely suoritetaan automaattisesti.',
				'GDPR_CHAPTER_12I':'<b>Oikeus tehdä valitus valvontaviranomaiselle</b>',
				'GDPR_CHAPTER_12IA':'Rekisteröidyllä on oikeus tehdä valitus valvontaviranomaisille, jos rekisteröity katsoo, että hänen oikeuksiaan on EU:n tietosuoja-asetuksen valossa loukattu. Tietosuojavaltuutetun yhteystiedot: <a href="https://tietosuoja.fi/yhteystiedot" target="_blank">https://tietosuoja.fi/yhteystiedot</a>',
				'GDPR_CHAPTER_12J':'<b>Rekisteröity voi toteuttaa yllämainitut oikeutensa ottamalla rekisterinpitäjään yhteyttä kohdassa 2 määriteltyjen yhteystietojen avulla, mieluiten sähköpostitse.</b>',
				'SESSION_EXPIRED':'Kirjautuminen on vanhentunut... automaattinen uloskirjaus 3 sekunnissa!',
				'MENU_VERSION':'v 21.11.08'
			}
		}
	}
}
