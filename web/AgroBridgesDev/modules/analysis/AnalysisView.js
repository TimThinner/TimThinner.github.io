import View from '../common/View.js';

/*
	D3 Spider Chart Tutorial
	https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
	
	Spider charts, also known as radar charts, are a type of chart that can display multiple features of each data point.
	They are similar to bar charts, except each axis extends out radially from the center of the chart.
	They can sometimes be an alternative to line charts, and are useful for overlaying and comparing data that have multiple variables.
	
	
	Three different shades of green:
	
	this.colors.LIGHT_GREEN // 
	this.colors.LIGHT_GREEN_2 // darker
	this.colors.LIGHT_GREEN_3 // more darker
	
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
	
	drawSpider(name, spider_id, width, height) {
		
		$('#'+spider_id).empty();
		
		const svg = d3.select('#'+spider_id);
		
		const horiz_center = width*0.5;
		const verti_center = height*0.5;
		
		const min_dim = Math.min(horiz_center, verti_center);
		
		// Make spider a litle bit smaller:
		//const range = min_dim - 0.15*min_dim;
		const range = min_dim - 0.25*min_dim;
		console.log(['range=',range,' width=',width]);
		
		let fontsize;
		if (range <= 120) {
			fontsize = 8;
		} else if (range > 120 && range <= 160) {
			fontsize = 10;
		} else if (range > 160 && range <= 200) {
			fontsize = 12;
		} else {
			fontsize = 14;
		}
		
		let data = [];
		let features = [
			"Volume", 
			"Consumer Contact", 
			"Gender Equality", 
			"Lower Labor Produce Ratio", 
			"Lower Carbon Footprint", 
			"Chain Added Value",
			"Price Premium"]; // 7 features
		
		// Wholesale:
		// Volume;				1
		// Price_Premium;		0.243019648;
		// Chain_Added_Value;	0.093587522;
		// Carbon_Footprint;	0.27142858;
		// Labor_Produce;		1
		// Gender_Equality;		0.498997996
		// Consumer_Contact		0.2
		
		if (name === 'wholesale') {
			data = [{
				"Volume":1,
				"Consumer Contact":0.2,
				"Gender Equality":0.498997996,
				"Lower Labor Produce Ratio":1,
				"Lower Carbon Footprint":0.27142858,
				"Chain Added Value":0.093587522,
				"Price Premium":0.243019648
			}];
		} else {
			if (this.USER_MODEL.analysisReady) {
				data = this.USER_MODEL.analysisResult.recommendations;
			}
		}
		
		//let svg = d3.select("spider").append("svg").attr("width", 600).attr("height", 600);
		//let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
		let radialScale = d3.scaleLinear().domain([0, 1]).range([0, range]);
		//let ticks = [0.2, 0.4, 0.6, 0.8, 1];
		let ticks = [1, 0.8, 0.6, 0.4, 0.2];
		//draw grid lines (circles)
		ticks.forEach(t =>
			svg.append("circle")
				//.attr("cx", 300)
				//.attr("cy", 300)
				.attr("cx", horiz_center) // min_dim)
				.attr("cy", verti_center) // min_dim)
				.attr("fill", '#fff')//"#e5ecf6") // "none"
				.attr("stroke", this.colors.GREY)
				.attr("r", radialScale(t))
		);
		// draw tick labels
		// fontsize = 8,10,12,14
		ticks.forEach(t =>
			svg.append("text")
				//.attr("x", 305)
				//.attr("y", 300 - radialScale(t))
				.attr("x", horiz_center+5)
				.attr("y", verti_center - radialScale(t))
				.attr("font-size",fontsize+2)
				.text(t.toString())
		);
		//draw axis for each feature
		function angleToCoordinate(angle, value) {
			let x = Math.cos(angle) * radialScale(value);
			let y = Math.sin(angle) * radialScale(value);
			//return { "x": 300 + x, "y": 300 - y };
			return { "x": horiz_center + x, "y": verti_center - y };
		}
		for (var i = 0; i < features.length; i++) {
			let ft_name = features[i];
			let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
			let line_coordinate = angleToCoordinate(angle, 1);//10);
			let label_coordinate = angleToCoordinate(angle, 1.1); // 10.5);
			
			// fontsize = 8,10,12,14
			if (ft_name === 'Volume') {
				label_coordinate.x -= fontsize*3; // 6 characters
			} else if (ft_name === 'Consumer Contact') { // 16 characters
				label_coordinate.x -= fontsize*7;
			} else if (ft_name === 'Gender Equality') { // 15 characters
				label_coordinate.x -= fontsize*3;
			} else if (ft_name === 'Lower Labor Produce Ratio') { // 25 characters
				label_coordinate.x -= fontsize*8;
			} else if (ft_name === 'Lower Carbon Footprint') { // 22 characters
				label_coordinate.x -= fontsize*4;
			} else if (ft_name === 'Chain Added Value') { // 17 characters
				label_coordinate.x -= fontsize*4;
			} else if (ft_name === 'Price Premium') { // 13 characters
				label_coordinate.x -= fontsize*3;
			}
			svg.append("line")
				.attr("x1", horiz_center)//min_dim 300)
				.attr("y1", verti_center)//min_dim 300)
				.attr("x2", line_coordinate.x)
				.attr("y2", line_coordinate.y)
				.attr("stroke", this.colors.GREY);
			svg.append("text")
				.attr("x", label_coordinate.x)
				.attr("y", label_coordinate.y)
				.attr("font-size",fontsize)
				.text(ft_name);
		}
		//drawing the line for the spider chart
		let line = d3.line().x(d => d.x).y(d => d.y);
		//get coordinates for a data point
		function getPathCoordinates(d) {
			let coordinates = [];
			for (var i = 0; i < features.length; i++) {
				let ft_name = features[i];
				let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
				coordinates.push(angleToCoordinate(angle, d[ft_name]));
			}
			// Add also the last connecting coordinate from last point to the first point.
			coordinates.push(angleToCoordinate(Math.PI/2, d[features[0]]));
			return coordinates;
		}
		// Draw in reverse order => RANK 3 is in background and RANK 1 in foreground.
		for (let i=data.length-1; i>=0; i--) {
			// draw the path element
			// IF THE SHOW CHECKBOX is checked!!!!
			// BUT do not block the "wholesale" spider!
			if (data.length === 1 || this.showRecommendation['R'+i].value === true) {
				
				let d = data[i];
				let color;
				// Note that when we show "wholesale" spider, we do not have access to 
				// this.showRecommendation['R'+i] -object.
				if (name === 'wholesale') {
					color = this.colors.DARK_GREEN;
				} else {
					color = this.showRecommendation['R'+i].color;
				}
				let coordinates = getPathCoordinates(d);
				svg.append("path")
					.datum(coordinates)
					.attr("d", line)
					.attr("stroke-width", 2)
					.attr("stroke", color)
					.attr("fill", "none")//color)
					.attr("stroke-opacity", 1)
					.attr("opacity", 1) //0.5);
			}
		}
	}
	
	renderWholesaleSpider() {
		$('#wholesale-spider-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		
		let width = w*0.5;					// 50% of width
		let height = this.REO.height*0.5;	// 50% of height
		
		if (w < 576) { // s12 => takes "whole width"  should be 601, but because we are "cropping" a little bit...
			width = w*0.9;					// 90% of width
			height = this.REO.height*0.5;	// 50% of height
		}
		
		const html = '<svg id="spider" width="'+width+'" height="'+height+'"></svg>';
		$(html).appendTo('#wholesale-spider-wrapper');
		this.drawSpider('wholesale','spider', width, height);
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
					this.renderRecommendationsList();
					this.renderRecommendationsSpider();
					
					this.renderAdditionalDescriptionPart1();
					
					
					//this.renderRecommendationsPart2Text();
					this.appendAttractiveness();
					
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
	
	renderRecommendationsSpider() {
		$('#recommendations-spider-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		
		let width = w*0.5;					// 50% of width
		let height = this.REO.height*0.5;	// 50% of height
		
		if (w < 576) { // s12 => takes "whole width"  should be 601, but because we are "cropping" a little bit...
			width = w*0.9;					// 90% of width
			height = this.REO.height*0.5;	// 50% of height
		}
		
		const html = '<svg id="spider-r" width="'+width+'" height="'+height+'"></svg>';
		$(html).appendTo('#recommendations-spider-wrapper');
		
		this.drawSpider('peterparker', 'spider-r', width, height);
	}
	
	renderRecommendationsList() {
		const self = this;
		
		// Generate following HTML dynamically based on analysis recommendations:
		let html = 
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s5">'+
					'<p style="font-weight:bold;">Sales Channel</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="font-weight:bold;">Business Model</p>'+
				'</div>'+
				'<div class="col s2">'+
					'<p style="font-weight:bold;">Show</p>'+
				'</div>'+
			'</div>';
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
			const id = this.showRecommendation["R"+index].id;
			let checked = '';
			if (this.showRecommendation["R"+index].value===true) {
				checked = 'checked="checked" ';
			}
			html += '<div class="row" style="margin-bottom:0;">'+
				'<div class="col s5">'+
					'<p style="color:'+this.showRecommendation["R"+index].color+'">'+r["Sales Channel"]+'</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="color:'+this.showRecommendation["R"+index].color+'">'+r["Business Model"]+'</p>'+
				'</div>'+
				'<div class="input-field col s2" style="padding-top:0">'+
					'<p><label><input type="checkbox" class="filled-in" id="'+id+'" '+checked+'/><span></span></label></p>'+
				'</div>'+
			'</div>';
		});
		$("#recommendations-list-wrapper").empty().append(html);
		
		this.USER_MODEL.analysisResult.recommendations.forEach((r,index) => {
			
			const id = this.showRecommendation["R"+index].id;
			
			$('#'+id).on('click', function(){
				if (self.showRecommendation["R"+index].value === true) {
					self.showRecommendation["R"+index].value = false;
				} else {
					self.showRecommendation["R"+index].value = true;
				}
				self.renderRecommendationsSpider();
			});
		});
	}
	
	
	renderAdditionalDescriptionPart1() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		//const ll_add_a = LM['translation'][sel]['Describtion_Spiderweb'];
		//const html = '<p>'+ll_add_a+'</p>';
		
		const ll_no_suitable = LM['translation'][sel]['Results2_farm_no_suitable_Channels'];
		const ll_only_one_suitable = LM['translation'][sel]['Results2_only_one_channel'];
		const ll_more_than_2_suitable = LM['translation'][sel]['Results2_Farm_more_2_suitable'];
		
		const numberOfResults = this.USER_MODEL.analysisResult.recommendations.length;
		
		let html;
		if (numberOfResults === 0) {
			html = '<p>'+ll_no_suitable+'</p>';
			
		} else if(numberOfResults === 1) {
			html = '<p>'+ll_only_one_suitable+'</p>';
			
		} else { // Two or more...
			html = '<p>'+ll_more_than_2_suitable+'</p>';
		}
		$("#additional-description-text-part-1-wrapper").empty().append(html);
	}
	
	renderAdditionalDescriptionPart2() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_dse = LM['translation'][sel]['Description_Spiderweb_example'];
		const html = '<p>'+ll_dse+'</p>';
		$("#wholesale-description-wrapper").empty().append(html);
	}
	
	appendAttractiveness() {
		// To do: take result from recommendation response.
		const result = this.USER_MODEL.analysisResult.attractiveness;
		$("#attractiveness-wrapper").empty().append(result);
	}
	
	renderDisclaimer() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_d_title = LM['translation'][sel]['Disclaimer_Header'];
		const ll_d_text = LM['translation'][sel]['Disclaimer'];
		const html = '<h6>'+ll_d_title+'</h6><p>'+ll_d_text+'</p>';
		$("#disclaimer-text-wrapper").empty().append(html);
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
		const ll_improved_logistics_title = 'Improved logistics as an option for all farmers';
		const ll_comparison_to_wholesale_title = "Comparison to Wholesale";
		
		const ll_how_to_read_spiders_title = LM['translation'][sel]['Description_Spiderweb_title'];
		const ll_how_to_read_spiders_text = LM['translation'][sel]['Describtion_Spiderweb'];
		const ll_definition_criteria = LM['translation'][sel]['Definition_Criteria'];
		
		const ll_volume = LM['translation'][sel]['Volume'];
		const ll_volume_def = LM['translation'][sel]['Volume_Definition'];
		const ll_price_premium = LM['translation'][sel]['Price_Premium'];
		const ll_price_premium_def = LM['translation'][sel]['Price_Premium_Definition'];
		const ll_chain_added_value = LM['translation'][sel]['Chain_Added_Value'];
		const ll_chain_added_value_def = LM['translation'][sel]['Chain_Added_Value_Definition'];
		const ll_carbon_footprint = LM['translation'][sel]['Carbon_Footprint'];
		const ll_carbon_footprint_def = LM['translation'][sel]['Carbon_Footprint_Definition'];
		const ll_labor_produce = LM['translation'][sel]['Labor_Produce'];
		const ll_labor_produce_def = LM['translation'][sel]['Labor_Produce_Definition'];
		const ll_gender_equality = LM['translation'][sel]['Gender_Equality'];
		const ll_gender_equality_def = LM['translation'][sel]['Gender_Equality_Definition'];
		const ll_consumer_contact = LM['translation'][sel]['Consumer_Contact'];
		const ll_consumer_contact_def = LM['translation'][sel]['Consumer_Contact_Definition'];
		
		const ll_farm_and_regional_chars_title = LM['translation'][sel]['Suitability_farm_Characteristics_title'];
		const ll_farm_and_regional_chars_intro = LM['translation'][sel]['Intro_not_all_sales_channels_con'];
		const ll_relative_attractiveness = LM['translation'][sel]['Relative_Attractiveness']; // concat the value!
		const ll_farm_and_regional_chars_text = LM['translation'][sel]['Suitability_farm_Characterstics'];
		const ll_farm_and_regional_chars_more = LM['translation'][sel]['Suitability_farm_Characteristics_info'];
		
		const ll_how_calculated_title = LM['translation'][sel]['How_calculated_title'];
		const ll_how_calculated_text = LM['translation'][sel]['How_calculated'];
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+this.colors.DARK_GREEN+'">ANALYSIS</h3>'+
					'</div>'+
				'</div>'+
				
				'<div class="col s12">'+
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
				'</div>'+
				
				// SECOND "CHAPTER"
				
				'<div class="col s12" style="border-top: 1px solid #555; border-bottom: 1px solid #555; margin-top:16px; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_recommendations_title+'</h5>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="recommendations-text-part-1-wrapper"></div>'+
					'</div>'+
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
				'</div>'+
				'<div class="col s12" style="border-bottom: 1px solid #555; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_improved_logistics_title+'</h5>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1" >'+
						'<div id="additional-description-text-part-1-wrapper"></div>'+
					'</div>'+
				'</div>'+
				'<div class="col s12" style="border-bottom: 1px solid #555; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_comparison_to_wholesale_title+'</h5>'+
						'<div class="row">'+
							'<div class="col s12 m5" id="wholesale-description-wrapper">'+
							'</div>'+
							'<div class="col s12 m7" id="wholesale-spider-wrapper">'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				
				// THIRD "CHAPTER"
				
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_how_to_read_spiders_title+'</h5>'+
						'<p>'+ll_how_to_read_spiders_text+'</p>'+
						'<p>'+ll_definition_criteria+'</p>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<ul class="collapsible">'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_volume+'</div>'+
								'<div class="collapsible-body">'+ll_volume_def+'</div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_price_premium+'</div>'+
								'<div class="collapsible-body">'+ll_price_premium_def+'</div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_chain_added_value+'</div>'+
								'<div class="collapsible-body">'+ll_chain_added_value_def+'</div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_carbon_footprint+'</div>'+
								'<div class="collapsible-body">'+ll_carbon_footprint_def+'</div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_labor_produce+'</div>'+
								'<div class="collapsible-body">'+ll_labor_produce_def+'</div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_gender_equality+'</div>'+
								'<div class="collapsible-body">'+ll_gender_equality_def+'</div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_consumer_contact+'</div>'+
								'<div class="collapsible-body">'+ll_consumer_contact_def+'</div>'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>'+
				
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_farm_and_regional_chars_title+'</h5>'+
						'<p>'+ll_farm_and_regional_chars_intro+'</p>'+
						'<p style="color:'+this.colors.DARK_GREEN+'; font-weight:bold;">'+ll_relative_attractiveness+' <span id="attractiveness-wrapper" style="color:'+this.colors.DARK_ORANGE+'"></span></p>'+
						'<p>'+ll_farm_and_regional_chars_text+'</p>'+
						'<p>'+ll_farm_and_regional_chars_more+'</p>'+
					'</div>'+
				'</div>'+
				
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_how_calculated_title+'</h5>'+
						'<p>'+ll_how_calculated_text+'</p>'+
					'</div>'+
				'</div>'+
				
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="disclaimer-text-wrapper" style="font-size:75%; color:#888; border:1px solid #888; margin-top:16px; padding:16px;"></div>'+
					'</div>'+
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
			this.renderRecommendationsList();
			this.renderRecommendationsSpider();
			
			this.renderAdditionalDescriptionPart1();
			this.appendAttractiveness();
			
		} else {
			this.showSpinner('#recommendations-text-part-1-wrapper');
		}
		
		this.renderAdditionalDescriptionPart2();
		this.renderWholesaleSpider();
		
		this.renderBusinessModels();
		$('.collapsible').collapsible({
			accordion: true,
			onOpenEnd: function(el) { console.log(['open el=',el]); /*self.previewOpen=true;*/ },
			onCloseEnd: function(el) { console.log(['close el=',el]); /*self.previewOpen=false;*/ }
		});
		this.renderDisclaimer();
		this.rendered = true;
	}
}
