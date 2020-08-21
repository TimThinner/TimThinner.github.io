import EventObserver from '../common/EventObserver.js';

/*
	this.menuitems = [
		{key:'Profile',value:'Profile'},
		{key:'Influx',value:'Market Info'},
		{key:'Messages',value:'Trading'},
		{key:'Rules',value:'Rules & Conditions'},
		{key:'Guide',value:'Technical Docs'},
		{key:'About', value:'About'}
];*/

export default class MenuModel extends EventObserver {
	constructor(menuitems) {
		super();
		this.menuitems = menuitems;
		this.activeTab = menuitems[0].key;
		this.localStorageLabel = 'FlexiMenu_';
	}
	
	store(userid) {
		if (userid) {
			const itemID = this.localStorageLabel + userid;
			const new_status = {'activeTab':this.activeTab};
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
	}
	
	restore(userid) {
		// By default FIRST item is selected!
		this.activeTab = this.menuitems[0].key;
		if (userid) {
			const itemID = this.localStorageLabel + userid;
			const status = localStorage.getItem(itemID);
			if (status == null) {
				console.log('No status stored in localStorage.');
			} else {
				// Status exist: Restore current situation from localStorage.
				const stat = JSON.parse(status);
				if (typeof stat.activeTab !== 'undefined') {
					// Make sure localStorage has valid tab!
					this.menuitems.forEach((item)=>{
						if (stat.activeTab === item.key) {
							this.activeTab = stat.activeTab;
						}
					});
				}
			}
		}
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'restored',tab:this.activeTab}), 100);
	}
	
	setSelected(tab) {
		this.activeTab = tab;
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'selected',tab:tab}), 100);
	}
}
