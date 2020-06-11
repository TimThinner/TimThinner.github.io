import EventObserver from './EventObserver.js';

export default class AppDataModel extends EventObserver {
	
	constructor() {
		super();
		this.name = 'AppDataModel';
		//this.errorMessage = '';
		//this.fetching = false;
		//this.ready = false;
		
		this.menuitems = {'home':{logo:'./img/401px-Nuuksion_kp.png'},'map':{logo:'home'},'camera':{logo:'camera_alt'},'info':{logo:'info'}};
		this.activeTab = 'home'; // 'map', 'camera', 'info'
		this.targets = {'Nuuksio':{
			logo: './img/401px-Nuuksion_kp.png',
			zoom: 11,
			//center: [60.32, 24.54],
			center: { lat: 60.32, lng: 24.54 },
			busStops: {
				routingUrl: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
				routingAreas: [
					{ lat: 60.270, lng: 24.594, radius: 3200 }, // Solvik
					{ lat: 60.2695, lng: 24.4440, radius: 300 }, // Veikkola
					{ lat: 60.283, lng: 24.511, radius: 2000 }, // Siikajärvi radius ws 1600
					{ lat: 60.310, lng: 24.546, radius: 3000 }, // Nuuksionpää
					{ lat: 60.324, lng: 24.5, radius: 1300 } // Kattila
				],
				priorityStops: ['Hakjärventie','Haltia','Haukkalammentie','Kattila','Siikaniemi','Veikkola']
			},
			cameras: [
				/*{
					name: 'Haukkalampi 1',
					loc: 'Haukkalampi',
					url: 'https://parkkihaukka.fi/haukkalampi1/latest.jpg',
					lat: 60.31002,
					lon: 24.51705
				},*/
				{
					name: 'Haukkalampi 2',
					loc: 'Haukkalampi',
					url: 'https://parkkihaukka.fi/haukkalampi2/latest.jpg',
					lat: 60.30992,
					lon: 24.52122
				},
				{
					name: 'Haukkalampi 3',
					loc: 'Haukkalampi',
					url: 'https://parkkihaukka.fi/haukkalampi3/latest.jpg',
					lat: 60.30953,
					lon: 24.52140
				},
				{
					name: 'Kattila 1',
					loc: 'Kattila',
					url: 'https://parkkihaukka.fi/kattila1/latest.jpg',
					lat: 60.32693,
					lon: 24.49555
				},
				{
					name: 'Kattila 2',
					loc: 'Kattila',
					url: 'https://parkkihaukka.fi/kattila2/latest.jpg',
					lat: 60.32847,
					lon: 24.49383
				}
			]
		},'Sipoonkorpi':{
			logo: './img/377px-Sipoonkorven_kp.png',
			zoom: 11,
			center: { lat: 60.35, lng: 25.20 },
			//center: [60.35, 25.20],
			busStops: {
				routingUrl: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
				routingAreas: [
					{ lat: 60.31, lng: 25.11, radius: 1200 },
					{ lat: 60.283, lng: 25.14, radius: 1200 },
					{ lat: 60.360, lng: 25.165, radius: 2000 }
				],
				priorityStops: ['Kuusijärvi','Länsitie','Kalkkiuunintie']
				// Kuusijärvelle: bussi 739 Rautatientorilta 
				// Sipoonkorven eteläosiin ja Sotunkiin: bussi 717 Rautatientorilta 
				// Sipoonkorven pohjoisosiin: bussit 785, 787 ja 788 Rautatientorilta 
			},
			cameras: [
				
			]
		}};
		this.activeTarget = 'Nuuksio';
	}
	
	store() {
		const itemID = 'ParkhawkAppData';
		const new_status = {'activeTab':this.activeTab, 'activeTarget':this.activeTarget};
		const status = localStorage.getItem(itemID);
		if (status == null) {
			// no previous status.
			const encoded = JSON.stringify(new_status);
			localStorage.setItem(itemID, encoded);
		} else {
			// previous status exist.
			localStorage.removeItem(itemID);
			const encoded = JSON.stringify(new_status);
			localStorage.setItem(itemID, encoded);
		}
	}
	
	restore() {
		const itemID = 'ParkhawkAppData';
		
		// By default FIRST item is selected!
		this.activeTab = 'home';
		// By default Nuuksio is selected!
		this.activeTarget = 'Nuuksio';
		
		const status = localStorage.getItem(itemID);
		if (status == null) {
			console.log('No status stored in localStorage.');
		} else {
			// Status exist: Restore current situation from localStorage.
			const stat = JSON.parse(status);
			if (typeof stat.activeTab !== 'undefined') {
				// Make sure localStorage has valid tab!
				if (Object.keys(this.menuitems).includes(stat.activeTab)) {
					this.activeTab = stat.activeTab;
				}
			}
			if (typeof stat.activeTarget !== 'undefined') {
				// Make sure localStorage has valid target!
				if (Object.keys(this.targets).includes(stat.activeTarget)) {
					this.activeTarget = stat.activeTarget;
				}
			}
		}
		setTimeout(() => this.notifyAll({model:'AppDataModel',method:'restored',tab:this.activeTab,target:this.activeTarget}), 100);
	}
	
	setSelectedTarget(target) {
		this.activeTarget = target;
		this.store(); // Store activeTarget to local storage.
		setTimeout(() => this.notifyAll({model:'AppDataModel',method:'targetselected',target:target}), 100);
	}
	
	setSelectedTab(tab) {
		this.activeTab = tab;
		this.store(); // Store activeTab to local storage.
		setTimeout(() => this.notifyAll({model:'AppDataModel',method:'tabselected',tab:tab}), 100);
	}
	
	setHomeLogo(logo) {
		this.menuitems['home'].logo = logo;
		setTimeout(() => this.notifyAll({model:'AppDataModel',method:'logochanged',logo:logo}), 100);
	}
	/*
	setTargetProperty(target, property, value) {
		this.targets[target][property] = value;
		setTimeout(() => this.notifyAll({model:'AppDataModel',method:'propertychanged'}), 100);
	}
	*/
	/*
	fetch() {
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		const status = 200; // OK.
		this.errorMessage = '';
		this.fetching = true;
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
		}, 100);
	}*/
}
