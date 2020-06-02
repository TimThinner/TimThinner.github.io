
import EventObserver from '../common/EventObserver.js';

export default class HomeModel extends EventObserver {
	
	constructor(targets) {
		super();
		this.targets = targets;
		this.activeTarget = 'Nuuksio';
	}
	
	store() {
		const itemID = 'ParkhawkTarget';
		const new_status = {'activeTarget':this.activeTarget};
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
		const itemID = 'ParkhawkTarget';
		
		// By default Nuuksio is selected!
		this.activeTarget = 'Nuuksio';
		
		const status = localStorage.getItem(itemID);
		if (status == null) {
			console.log('No status stored in localStorage.');
		} else {
			// Status exist: Restore current situation from localStorage.
			const stat = JSON.parse(status);
			if (typeof stat.activeTarget !== 'undefined') {
				// Make sure localStorage has valid target!
				if (Object.keys(this.targets).includes(stat.activeTarget)) {
					this.activeTarget = stat.activeTarget;
				}
			}
		}
		setTimeout(() => {
			this.notifyAll({model:'HomeModel',method:'restored',target:this.activeTarget});
		}, 100);
	}
	
	setSelected(target) {
		this.activeTarget = target;
		this.store(); // Store activeTarget to local storage.
		setTimeout(() => this.notifyAll({model:'HomeModel',method:'selected',target:target}), 100);
	}
}
