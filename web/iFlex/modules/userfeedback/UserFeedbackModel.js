
import Model from '../common/Model.js';

export default class UserFeedbackModel extends Model {
	
	constructor(options) {
		super(options);
		this.ready = true; // Always true!
		this.status = 200; // Always OK!
		
	}
}