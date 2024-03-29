/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../../common/View.js';
import PeriodicTimeoutObserver from '../../common/PeriodicTimeoutObserver.js'

export default class FeedbacksView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.PTO = new PeriodicTimeoutObserver({interval:-1});
		this.PTO.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'view-failure';
		this.layout = 'Table';
	}
	
	show() {
		this.render();
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	/*
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
	feedbackType: { type:String },
	created: { type: Date, default: Date.now },
	refTime: { type: Date },
	feedback: { type:Number },
	feedbackText: { type:String }
	
	'<th>User</th>'+
	'<th>Type</th>'+
	'<th>Created</th>'+
	'<th>RefTime</th>'+
	'<th>Feedback</th>'+
	'<th>Text</th>'+
	*/
	showFeedbacks() {
		const self = this;
		$('#feedbacks-body').empty();
		if (typeof this.models['FeedbacksModel'].feedbacks !== 'undefined') {
			// NEW: Sort feedbacks by the created date: newest first.
			// sort by string (created is a string, for example: "2021-04-21T07:40:50.965Z")
			this.models['FeedbacksModel'].feedbacks.sort(function(a, b) {
				if (a.created < b.created) {
					return 1;
				}
				if (a.created > b.created) {
					return -1;
				}
				return 0; // dates are equal
			});
			this.models['FeedbacksModel'].feedbacks.forEach(fb => {
				//console.log(['fb=',fb]);
				let email = '-';
				let fedback = '-';
				if (typeof fb.userId !== 'undefined') {
					email = fb.userId.email;
				}
				if (fb.feedback > 0) {
					fedback = '<img src="./svg/smiley-'+fb.feedback+'.svg" height="40"/>';
				}
				const html = '<tr>'+
					'<td>'+email+'</td>'+
					'<td>'+fb.feedbackType+'</td>'+
					'<td>'+fb.created+'</td>'+
					'<td>'+fb.refTime+'</td>'+
					'<td>'+fedback+'</td>'+
					'<td>'+fb.feedbackText+'</td>'+
					'</tr>';
				$(html).appendTo("#feedbacks-body");
			});
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='FeedbacksModel' && options.method==='fetched') {
				if (options.status === 200) {
					if (this.areModelsReady()) {
						
						console.log('FeedbacksView => FeedbacksModel fetched!');
						if (this.rendered) {
							$('#'+this.FELID).empty();
							this.showFeedbacks();
						} else {
							this.render();
						}
					} else {
						console.log('WAIT...');
					}
					
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				// Do something with each TICK!
				// Feed the UserModel parameters into fetch call.
				const UM = this.controller.master.modelRepo.get('UserModel');
				const token = UM ? UM.token : undefined;
				Object.keys(this.models).forEach(key => {
					console.log(['FETCH MODEL key=',key]);
					this.models[key].fetch({token: token});
				});
			}
		}
	}
	/*
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
	feedbackType: { type:String },
	created: { type: Date, default: Date.now },
	refTime: { type: Date },
	feedback: { type:Number },
	feedbackText: { type:String }
	*/
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_back = LM['translation'][sel]['BACK'];
			const localized_string_title = 'Feedbacks';
			const html =
				'<div class="row">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						//'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
					'<div class="col s12">'+
						'<table class="striped">'+
							'<thead>'+
								'<tr>'+
									'<th>User</th>'+
									'<th>Type</th>'+
									'<th>Created</th>'+
									'<th>RefTime</th>'+
									'<th>Feedback</th>'+
									'<th>Text</th>'+
								'</tr>'+
							'</thead>'+
							'<tbody id="feedbacks-body">'+
							'</tbody>'+
						'</table>'+
					'</div>'+
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_back+
							'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			this.showFeedbacks();
			
			$('#back').on('click',function() {
				self.models['MenuModel'].setSelected('USERPROPS');
			});
			
			this.handleErrorMessages(this.FELID);
			
			this.rendered = true;
			
		} else {
			console.log('FeedbacksView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}