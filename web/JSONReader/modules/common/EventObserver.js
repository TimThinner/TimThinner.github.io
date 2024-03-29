
/*
	Models extend EventObserver, so that they can notify all other
	components (views) when data is available to be rendered.
*/
export default class EventObserver {
	constructor() {
		this.observers = [];
	}
	subscribe(fn) {
		this.observers.push(fn);
	}
	unsubscribe(fn) {
		this.observers = this.observers.filter((subscriber) => subscriber !== fn);
	}
	notifyAll(options) {
		this.observers.forEach((subscriber) => subscriber.notify(options));
	}
}
