export default class ModelRepo {
	constructor() {
		this.repo = {};
	}
	add(key, m) {
		this.repo[key] = m;
	}
	get(key) {
		return this.repo[key];
	}
	remove(key) {
		delete this.repo[key];
	}
	keys() {
		return Object.keys(this.repo);
	}
	stringify() {
		return Object.keys(this.repo).join();
	}
}
