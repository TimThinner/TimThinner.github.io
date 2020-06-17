import View from '../common/View.js';

export default class InfoView extends View {
	
	constructor(controller) {
		super(controller);
		this.rendered = false;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		
	}
	
	render() {
		$(this.el).empty();
		const html =
			'<div class="row">'+
				'<div class="col s12 m10 l8 offset-m1 offset-l2">'+
					'<h4 class="info-header">Ystävällinen Parkkihaukka palveluksessanne!</h4>'+
					
					'<p class="info-text-ingress">Parkkihaukka on uusi palvelukokeilu kansallispuiston kävijöiden saapumisen sujuvoittamiseksi. '+
					'Parkkihaukka välittää kansallispuiston parkkialueilta 1-10 minuutin välein kamerakuvan tälle sivulle, jolta '+
					'voit tarkistaa ajantasaisen parkkitilanteen. Näin ei tarvitse arvailla, mahtuuko oma auto parkkiin.</p>'+
					
					'<p class="info-text"><b>OHJE:</b> Klikkaa kartalta haluamaasi parkkialueen&nbsp;'+
					'<img src="assets/ParkCameraIcon.png" class="embedded-image" alt="" />&nbsp;-ikonia, ja näet alueen parkkitilanteen aukeavasta kuvasta. '+
					'Bussiliikenteen pysäkkikohtaiset aikataulut näet klikkaamalla bussipysäkkiä&nbsp;'+
					'<img src="assets/640px-Finland_road_sign_531.svg.png" class="embedded-image-busstop" alt="" />. '+
					'Kansallispuiston luontoreittejä näkyy värillisinä karttapohjassa, reittikuvauksiin pääset klikkaamalla reittiä tai oikeassa alareunassa olevaa '+
					'<img src="assets/HikingSmall.png" class="embedded-image-square" alt="" /> -ikonia.</p>'+
				'</div>'+
				'<div class="col s12 m10 l8 offset-m1 offset-l2">'+
					'<div class="col s6">'+
						'<img src="assets/UIHome.png" class="info-pic" alt="" />'+
					'</div>'+
					'<div class="col s6">'+
						'<img src="assets/UIMap.png" class="info-pic" alt="" />'+
					'</div>'+
				'</div>'+
				/*
				'<div class="col s12 m10 l8 offset-m1 offset-l2">'+
					'<div class="col s6">'+
						'<img src="assets/UICameras.png" class="info-pic" alt="" />'+
					'</div>'+
					'<div class="col s6">'+
						'<img src="assets/UITimetables.png" class="info-pic" alt="" />'+
					'</div>'+
				'</div>'+
				*/
				'<div class="col s12 m10 l8 offset-m1 offset-l2">'+
					'<div class="col s6">'+
						'<img src="assets/infopark.png" class="info-pic" alt="" />'+
					'</div>'+
					'<div class="col s6">'+
						'<img src="assets/infobus.png" class="info-pic" alt="" />'+
					'</div>'+
				'</div>'+
				'<div class="col s12 m10 l8 offset-m1 offset-l2">'+
					'<p class="info-text">Palvelu toteutetaan <a href="https://www.visitespoo.fi/fi/perille-asti-hanke/" target="_blank" rel="noopener noreferrer"> '+
					'Perille asti</a> -hankkeen (Parkkihaukkakamerat) ja VAMOS! -hankkeen yhteiskokeiluna, josta vastaa VTT. '+
					'Kamerakuvasta ei ole tunnistettavissa kävijöiden kasvoja tai rekisterinumeroita. Pysäkkiaikataulut saadaan HSL:n avoimesta datasta.</p>'+
					
					'<h2 class="info-header-framed">Rentouttavaa retkeä!</h2>'+
					
					'<p class="info-text">Perille asti -hanke kehittää matkailijoiden, asukkaiden ja työntekijöiden liikkumista pääkaupunkiseudulla täydentäen nykyistä '+
					'liikennejärjestelmää. Espoossa saavutettavuutta parannetaan Nuuksion ja Rantaraitin näkökulmista. Hanketta toteuttaa Espoossa Espoo Marketing Oy. '+
					'Perille asti -hanke saa rahoituksensa Euroopan aluekehitysrahastosta osana 6Aika -strategiaa vuosina 2017-2019.</p>'+
					'<p class="info-text-bold">Yhteistyössä:</p>'+
					
					'<div class="co-op-icon-wrapper">'+
						'<img src="assets/Metsahallitus_logo_varillinen_vaaka.png" class="co-op-icon-2" alt="" />'+
						'<img src="assets/VTTLogo.png" class="co-op-icon" alt="" />'+
					'</div>'+
					'<p class="info-version">Parkkihaukka v.20.06.17</p>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		this.rendered = true;
	}
}
