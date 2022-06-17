import View from '../common/View.js';

/*
	D3 Spider Chart Tutorial
	https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
	
	Spider charts, also known as radar charts, are a type of chart that can display multiple features of each data point.
	They are similar to bar charts, except each axis extends out radially from the center of the chart.
	They can sometimes be an alternative to line charts, and are useful for overlaying and comparing data that have multiple variables.
	
*/

export default class AnalysisView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.showRecommendation = {
			"R0":{id:'show-r-0', value:true, color:this.colors.DARK_GREEN},
			"R1":{id:'show-r-1', value:true, color:this.colors.DARK_ORANGE},
			"R2":{id:'show-r-2', value:true, color:this.colors.DARK_BLUE},
			"R3":{id:'show-r-3', value:true, color:this.colors.DARK_RED}
		};
		this.rendered = false;
		this.FELID = 'analysis-message';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	setRecommendations() {
		this.showRecommendation = {};
		
		const colors = [
			this.colors.DARK_GREEN, // First recommendation.
			this.colors.DARK_ORANGE, // Second recommendation.
			this.colors.DARK_BLUE, // Third recommendation.
			this.colors.DARK_RED
		];
		// "R0":{id:'show-r-0',value:true, color:this.colors.DARK_GREEN}
		// "R1":{id:'show-r-1',value:true, color:this.colors.DARK_ORANGE}
		// "R2":{id:'show-r-2',value:true, color:this.colors.DARK_BLUE}
		
		this.USER_MODEL.analysisResult.recommendations.forEach((r,index) => {
			/*
			r["Sales Channel"]
			r["Business Model"]
			r["Volume"]
			r["Consumer Contact"]
			r["Gender Equality"]
			r["Lower Labor Produce Ratio"]
			r["Lower Carbon Footprint"]
			r["Chain Added Value"]
			r["Price Premium"]
			*/
			let color = '#000000';
			if (index < 4) {
				color = colors[index];
			}
			this.showRecommendation["R"+index] = {id:'show-r-'+index, value:true, color:color};
		});
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				//console.log('ResizeEventObserver resize => SHOW()!');
				this.show();
				
			} else if (options.model==='UserModel' && options.method==='runAnalysis') {
				if (options.status === 200) {
					
					$('#'+this.FELID).empty();
					
					this.setRecommendations();
					this.renderRecommendationsPart1Text();
					//this.renderRecommendationsList();
					//this.renderRecommendationsSpider();
					//this.renderRecommendationsPart2Text();
					//this.renderAnalysisRegionAttractiveness();
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
				}
			}
		}
	}
	
	renderBusinessModels() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_intro = LM['translation'][sel]['Intro_Definition_Business_Models'];
		const ll_def_csa = LM['translation'][sel]['Definition_CSA'];
		const ll_def_f2f = LM['translation'][sel]['Definition_Face_2_Face'];
		const ll_def_online_trade = LM['translation'][sel]['Definition_Online_Trade'];
		const ll_def_retail_trade = LM['translation'][sel]['Definition_Retail_Trade'];
		const ll_def_improved_logistics = LM['translation'][sel]['Definition_Improved_Logistics'];
		const ll_def_more_info = LM['translation'][sel]['More_Info_Business_Models'];
		
		$("#business-models-intro-wrapper").empty().append('<p>'+ll_intro+'</p>');
		
		$("#business-models-csa-text").empty().append(ll_def_csa);
		$("#business-models-f2f-text").empty().append(ll_def_f2f);
		$("#business-models-online-text").empty().append(ll_def_online_trade);
		$("#business-models-retail-text").empty().append(ll_def_retail_trade);
		$("#business-models-logistics-text").empty().append(ll_def_improved_logistics);
		
		$("#business-models-more-info-wrapper").empty().append(ll_def_more_info);
	}
	
	renderRecommendationsPart1Text() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_intro = LM['translation'][sel]['Result1_Models_Considered'];
		const ll_r1_no_suitable = LM['translation'][sel]['Results1_farms_no_suitable_channels'];
		const ll_r1_only_1_suitable = LM['translation'][sel]['Results1_only_one_channel'];
		const ll_r1_more_than_2_suitable = LM['translation'][sel]['Result_Farms_more_than_2_suitable'];
		
		const numberOfResults = this.USER_MODEL.analysisResult.recommendations.length;
		
		let html;
		
		if (numberOfResults === 0) {
			html = '<p>'+ll_intro+' '+ll_r1_no_suitable+'</p>';
			
		} else if(numberOfResults === 1) {
			html = '<p>'+ll_intro+' '+ll_r1_only_1_suitable+'</p>';
			
		} else { // Two or more...
			html = '<p>'+ll_intro+' '+ll_r1_more_than_2_suitable+'</p>';
		}
		$("#recommendations-text-part-1-wrapper").empty().append(html);
	}
	
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_intro_business_models_title = LM['translation'][sel]['Intro_Definition_Business_Models_title'];
		const ll_csa = LM['translation'][sel]['CSA'];
		const ll_f2f = LM['translation'][sel]['Face-to-Face'];
		const ll_online_trade = LM['translation'][sel]['Online_Trade'];
		const ll_retail_trade = LM['translation'][sel]['Retail_Trade'];
		const ll_improved_logistics = LM['translation'][sel]['Improved_Logistics'];
		
		const ll_recommendations_title = 'Recommendations for Short Food Supply Chain';
		
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">ANALYSIS</h3>'+
					'</div>'+
					
					// This FIRST "CHAPTER" is filled in 
					//		this.renderBusinessModels()
					//			fills the #business-models-intro-wrapper and 5 collapsible definitions and #business-models-more-info-wrapper
					//
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_intro_business_models_title+'</h5>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="business-models-intro-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<ul class="collapsible">'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_csa+'</div>'+
								'<div class="collapsible-body"><span id="business-models-csa-text"></span></div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_f2f+'</div>'+
								'<div class="collapsible-body"><span id="business-models-f2f-text"></span></div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_online_trade+'</div>'+
								'<div class="collapsible-body"><span id="business-models-online-text"></span></div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_retail_trade+'</div>'+
								'<div class="collapsible-body"><span id="business-models-retail-text"></span></div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_improved_logistics+'</div>'+
								'<div class="collapsible-body"><span id="business-models-logistics-text"></span></div>'+
							'</li>'+
						'</ul>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="business-models-more-info-wrapper"></div>'+
					'</div>'+
					
					
					
					
					
					
					
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_recommendations_title+'</h5>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="recommendations-text-part-1-wrapper"></div>'+
					'</div>'+
					
					/*
					'<div class="col s12 m10 offset-m1">'+
						'<div class="row">'+
							'<div class="col s12 m5" id="recommendations-list-wrapper">'+
							'</div>'+
							'<div class="col s12 m7" id="recommendations-spider-wrapper">'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="recommendations-text-part-2-wrapper"></div>'+
					'</div>'+
					*/
					
					'<div class="col s12 m10 offset-m1">'+
						'<p>&nbsp;</p>'+
						'<h5 style="text-align:center">UNDER CONSTRUCTION!!!</h5>'+
						'<p>&nbsp;</p>'+
					'</div>'+
					
					/*
					'<div class="col s12 m10 offset-m1">'+
						'<div id="additional-description-text-part-1-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 center">'+
						'<h5>Wholesale</h5>'+
						'<div id="spider-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="analysis-region-attractiveness-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="additional-description-text-part-2-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="disclaimer-text-wrapper" style="font-size:75%; color:#888; border:1px solid #888; margin-top:16px; padding:16px;"></div>'+
					'</div>'+
					*/
					
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1" id="'+this.FELID+'">'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="analysis-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		$("#analysis-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('main');
		});
		
		
		if (this.USER_MODEL.analysisReady) {
			
			this.setRecommendations();
			this.renderRecommendationsPart1Text();
			//this.renderRecommendationsList();
			//this.renderRecommendationsSpider();
			//this.renderRecommendationsPart2Text();
			//this.renderAnalysisRegionAttractiveness();
			
		} else {
			this.showSpinner('#recommendations-text-part-1-wrapper');
			//this.showSpinner('#analysis-region-attractiveness-wrapper');
		}
		
		//this.renderAdditionalDescriptionPart1();
		//this.renderWholesaleSpider();
		
		
		this.renderBusinessModels();
		$('.collapsible').collapsible({
			accordion: true,
			onOpenEnd: function(el) { console.log(['open el=',el]); /*self.previewOpen=true;*/ },
			onCloseEnd: function(el) { console.log(['close el=',el]); /*self.previewOpen=false;*/ }
		});
		
		
		
		
		
		/*
		this.renderAdditionalDescriptionPart2();
		this.renderDisclaimer();
		*/
		
		
		this.rendered = true;
	}
}
