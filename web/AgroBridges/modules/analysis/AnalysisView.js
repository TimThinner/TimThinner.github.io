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
		
		//this.previewOpen = false;
		//this.preview_csa_Open = false;
		//this.preview_f2f_Open = false;
		//this.preview_online_Open = false;
		//this.preview_retail_Open = false;
		//this.preview_logistics_Open = false;
		
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
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				//console.log('ResizeEventObserver resize => SHOW()!');
				this.show();
			}
		}
	}
	
	renderBusinessModelsIntro() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_intro = LM['translation'][sel]['Intro_Definition_Business_Models'];
		const html = '<p>'+ll_intro+'</p>';
		$("#business-models-intro-wrapper").empty().append(html);
	}
	
	renderRecommendationsPart1Text() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_intro = LM['translation'][sel]['Result1_Models_Considered'];
		const ll_r1_no_suitable = LM['translation'][sel]['Results1_farms_no_suitable_channels'];
		const ll_r1_only_1_suitable = LM['translation'][sel]['Results1_only_one_channel'];
		const ll_r1_more_than_2_suitable = LM['translation'][sel]['Result_Farms_more_than_2_suitable'];
		
		let html;
		const numberOfResults = 3;
		if (numberOfResults === 0) {
			html = '<p>'+ll_intro+' '+ll_r1_no_suitable+'</p>';
			
		} else if(numberOfResults === 1) {
			html = '<p>'+ll_intro+' '+ll_r1_only_1_suitable+'</p>';
			
		} else { // Two or more...
			html = '<p>'+ll_intro+' '+ll_r1_more_than_2_suitable+'</p>';
		}
		$("#recommendations-text-part-1-wrapper").empty().append(html);
	}
	
	
	renderRecommendationsPart2Text() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_r2_more_than_2_suitable = LM['translation'][sel]['Results2_Farm_more_2_suitable'];
		const ll_r2_no_suitable = LM['translation'][sel]['Results2_farm_no_suitable_Channels'];
		const ll_r2_only_1_suitable = LM['translation'][sel]['Results2_only_one_channel'];
		
		const numberOfResults = 3;
		
		let html = '';
		if (numberOfResults === 0) {
			html += '<p>'+ll_r2_no_suitable+'</p>';
			
		} else if(numberOfResults === 1) {
			html += '<p>'+ll_r2_only_1_suitable+'</p>';
			
		} else { // Two or more...
			html += '<p>'+ll_r2_more_than_2_suitable+'</p>';
		}
		$("#recommendations-text-part-2-wrapper").empty().append(html);
	}
	
	renderRecommendationsList() {
		// SHOW EXAMPLE TABLE:
		// RANK	SALES_CHANNEL			BUSINESS_MODEL
		// 1	On_Farm_Shop_extensive	Face-to-Face
		// 2	Online_Sales_Post		Online Trade
		// 3	Retail_Store			Retail Trade
		
		//Sales Channel: 
		// 1.	On-Farm Shop (extensively managed, unstaffed)
		// 2.	Post delivery (sales on demand)
		// 3.	Retail store
		/*const html = 
			'<table>'+
				'<thead>'+
					'<tr>'+
						'<th>Rank</th>'+
						'<th>Sales Channel</th>'+
						'<th>Business Model</th>'+
					'</tr>'+
				'</thead>'+
				'<tbody>'+
					'<tr>'+
						'<td>1</td>'+
						'<td>On-Farm Shop (extensively managed, unstaffed)</td>'+
						'<td>Face-to-Face</td>'+
					'</tr>'+
					'<tr>'+
						'<td>2</td>'+
						'<td>Post delivery (sales on demand)</td>'+
						'<td>Online Trade</td>'+
					'</tr>'+
					'<tr>'+
						'<td>3</td>'+
						'<td>Retail store</td>'+
						'<td>Retail Trade</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>';
		$("#recommendations-table-wrapper").empty().append(html);
		*/
		
		// What is the number of recommendations?
		const numberOfResults = 3;
		const colors = [
			this.colors.DARK_GREEN,
			this.colors.DARK_ORANGE,
			this.colors.DARK_BLUE
		];
		const html = 
			'<div class="row">'+
				'<div class="col s5">'+
					'<p style="font-weight:bold">Sales Channel</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="font-weight:bold">Business Model</p>'+
				'</div>'+
				'<div class="col s2">'+
					'<p style="font-weight:bold">Show</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s5">'+
					'<p style="color:'+colors[0]+'">On-Farm Shop (extensively managed, unstaffed)</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="color:'+colors[0]+'">Face-to-Face</p>'+
				'</div>'+
				'<div class="col s2">'+
					'<input type="checkbox" class="filled-in" checked="checked" />'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s5">'+
					'<p style="color:'+colors[1]+'">Post delivery (sales on demand)</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="color:'+colors[1]+'">Online Trade</p>'+
				'</div>'+
				'<div class="col s2">'+
					'<input type="checkbox" class="filled-in" checked="checked" />'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s5">'+
					'<p style="color:'+colors[2]+'">Retail store</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="color:'+colors[2]+'">Retail Trade</p>'+
				'</div>'+
				'<div class="col s2">'+
					'<input type="checkbox" class="filled-in" checked="checked" />'+
				'</div>'+
			'</div>';
		$("#recommendations-list-wrapper").empty().append(html);
	}
	
	/* Note:
		light-blue background:	#e5ecf6
		blue line:				#5965fa
	*/
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
			"Price Premium"]; // 7!
		//generate the data (only one set)
		
		//wholesale diagram results:
		//diagram_title_id;Volume;Price_Premium;Chain_Added_Value;Carbon_Footprint;Labor_Produce;Gender_Equality;Consumer_Contact
		//Wholesale;1;0,243019648;0,093587522;0,27142858;1;0,498997996;0,2
		
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
			// RANK 1 RESULT:
			// Ranked 1 result:
			// Volume	Price_Premium	Chain_Added_Value	Carbon_Footprint	Labor_Produce	Gender_Equality	Consumer_Contact
			// 0,2	0,729058945		0,694974003				0,074509829			0,3125			0,645290581			0,4
			data = [{
				"Volume":0.2,
				"Consumer Contact":0.4,
				"Gender Equality":0.645290581,
				"Lower Labor Produce Ratio":0.3125,
				"Lower Carbon Footprint":0.074509829,
				"Chain Added Value":0.694974003,
				"Price Premium":0.729058945
			},
			// RANK 2 RESULT:
			// Volume	Price_Premium	Chain_Added_Value	Carbon_Footprint	Labor_Produce	Gender_Equality	Consumer_Contact
			// 0,2	0,728024819	0,620450607					1					0,020243		0,503006012		0,2
			{
				"Volume":0.2,
				"Consumer Contact":0.2,
				"Gender Equality":0.503006012,
				"Lower Labor Produce Ratio":0.020243,
				"Lower Carbon Footprint":1,
				"Chain Added Value":0.620450607,
				"Price Premium":0.728024819
			},
			// RANK 3 RESULT:
			// Volume	Price_Premium	Chain_Added_Value	Carbon_Footprint	Labor_Produce	Gender_Equality	Consumer_Contact
			// 0,4			0,640124095		0,402079723			0,504424796			0,3125			0,509018036			0,4
			{
				"Volume":0.4,
				"Consumer Contact":0.4,
				"Gender Equality":0.509018036,
				"Lower Labor Produce Ratio":0.3125,
				"Lower Carbon Footprint":0.504424796,
				"Chain Added Value":0.402079723,
				"Price Premium":0.640124095
			}];
		}
		
		//let svg = d3.select("spider").append("svg").attr("width", 600).attr("height", 600);
		const colors = [
			this.colors.DARK_GREEN,
			this.colors.DARK_ORANGE,
			this.colors.DARK_BLUE,
			this.colors.GREY
		];
		
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
				.attr("stroke", colors[3])
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
				label_coordinate.x -= fontsize*5;
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
				.attr("stroke", colors[3]);
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
			let d = data[i];
			let color = colors[i];
			let coordinates = getPathCoordinates(d);
			
			//draw the path element
			svg.append("path")
				.datum(coordinates)
				.attr("d", line)
				.attr("stroke-width", 3)
				.attr("stroke", color)
				.attr("fill", "none")//color)
				.attr("stroke-opacity", 1)
				.attr("opacity", 1) //0.5);
		}
	}
	
	renderSpider() {
		$('#spider-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		
		const width = w*0.9;				// 90% of width
		const height = this.REO.height*0.5;	// 50% of height
		
		const html = '<svg id="spider" width="'+width+'" height="'+height+'"></svg>';
		$(html).appendTo('#spider-wrapper');
		this.drawSpider('wholesale','spider', width, height);
	}
	
	renderResultsSpider() {
		$('#recommendations-spider-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		
		const width = w*0.45;				// 45% of width
		const height = this.REO.height*0.4;	// 40% of height
		
		const html = '<svg id="spider-r" width="'+width+'" height="'+height+'"></svg>';
		$(html).appendTo('#recommendations-spider-wrapper');
		
		this.drawSpider('peterparker', 'spider-r', width, height);
	}
	/*
	renderResultsSpiders() {
		
		$('#results-spiders-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		
		const width = w*0.9;				// 90% of width
		const height = this.REO.height*0.4;	// 40% of height
		
		let xwidth = width;		// small screen has only one spider per row.
		if (w > 871) {			// NOTE REO gives 8px smaller value 992-8 = 984 for scren width...
			xwidth = width*0.3;	// has 3 equal wide cols to hold spiders.
		}
		const html = 
			'<div class="col s12 l4 center">'+
				'<h6 style="text-align:center">On-Farm Shop (extensively managed, unstaffed)</h6>'+
				'<svg id="spider-r1" width="'+xwidth+'" height="'+height+'"></svg>'+
			'</div>'+
			'<div class="col s12 l4 center">'+
				'<h6 style="text-align:center">Online Sales on Demand - Delivery by Post</h6>'+
				'<svg id="spider-r2" width="'+xwidth+'" height="'+height+'"></svg>'+
			'</div>'+
			'<div class="col s12 l4 center">'+
				'<h6 style="text-align:center">Retail Store (e.g. supermarket highlighting origin)</h6>'+
				'<svg id="spider-r3" width="'+xwidth+'" height="'+height+'"></svg>'+
			'</div>';
		$(html).appendTo('#results-spiders-wrapper');
		
		this.drawSpider('diagram1', 'spider-r1', xwidth, height);
		this.drawSpider('diagram2', 'spider-r2', xwidth, height);
		this.drawSpider('diagram3', 'spider-r3', xwidth, height);
	}
	*/
	renderAdditionalDescriptionPart1() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_add_a = LM['translation'][sel]['Describtion_Spiderweb'];
		const html = '<p>'+ll_add_a+'</p>';
		$("#additional-description-text-part-1-wrapper").empty().append(html);
	}
	
	renderAnalysisRegionAttractiveness() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_add_e = LM['translation'][sel]['Relative_Attractiveness']; // add the result of ?
		const ll_add_f = LM['translation'][sel]['Suitability_farm_Characterstics'];
		const result = 'medium';
		const html = 
			'<div class="highlighted-message">'+
				'<p style="font-weight:bold; font-size:120%">'+ll_add_e+' '+result+'</p>'+
			'</div>'+
			'<p>'+ll_add_f+'</p>';
		$("#analysis-region-attractiveness-wrapper").empty().append(html);
	}
	
	renderAdditionalDescriptionPart2() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_add_b = LM['translation'][sel]['How_calculated'];
		const ll_add_c = LM['translation'][sel]['Definition_Criteria'];
		const ll_add_d = LM['translation'][sel]['Intro_not_all_sales_channels_con'];
		const html = '<p>'+ll_add_b+'</p>'+
			'<p>'+ll_add_c+'</p>'+
			'<p>'+ll_add_d+'</p>';
		$("#additional-description-text-part-2-wrapper").empty().append(html);
	}
	
	renderBusinessModelsText() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_def_csa = LM['translation'][sel]['Definition_CSA'];
		const ll_def_f2f = LM['translation'][sel]['Definition_Face_2_Face'];
		const ll_def_online_trade = LM['translation'][sel]['Definition_Online_Trade'];
		const ll_def_retail_trade = LM['translation'][sel]['Definition_Retail_Trade'];
		const ll_def_improved_logistics = LM['translation'][sel]['Definition_Improved_Logistics'];
		const ll_def_more_info = LM['translation'][sel]['More_Info_Business_Models'];
		
		// Note: put little bit of vertical space below each li-item!
		// See styles.css:
		// li.agro-item:not(:last-child) { 
		//		margin-bottom: 12px;
		// }
		/*
		const html =
			'<ul class="browser-default"><li class="agro-item">'+ll_def_csa+'</li>'+
			'<li class="agro-item">'+ll_def_f2f+'</li>'+
			'<li class="agro-item">'+ll_def_online_trade+'</li>'+
			'<li class="agro-item">'+ll_def_retail_trade+'</li>'+
			'<li class="agro-item">'+ll_def_improved_logistics+'</li></ul>'+
			'<p>'+ll_def_more_info+'</p>'+
		*/
		$("#business-models-csa-text").empty().append(ll_def_csa);
		$("#business-models-f2f-text").empty().append(ll_def_f2f);
		$("#business-models-online-text").empty().append(ll_def_online_trade);
		$("#business-models-retail-text").empty().append(ll_def_retail_trade);
		$("#business-models-logistics-text").empty().append(ll_def_improved_logistics);
		
		
		$("#business-models-more-info-wrapper").empty().append(ll_def_more_info);
		
		/*$('#bottom-close-preview').on('click', function(){
			$('#preview-placeholder').empty();
			$('#preview-placeholder').css({"border":"none","padding":"0"});
			self.previewOpen = false;
			$('#preview-business-models').html('SEE DEFINITION');
		});*/
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
		
		//let li_open_tag = '<li>';
		//if (this.previewOpen) {
			//li_open_tag = '<li class="active">';
		//}
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">ANALYSIS</h3>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">Recommendations for Short Food Supply Chain</h5>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="business-models-intro-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						//'<h5 style="text-align:center">Business models for Short Food Supply Chain</h5>'+
						//'<div id="business-models-text-accordion-wrapper"></div>'+
						// PREVIEW business models BUTTON:
						'<ul class="collapsible">'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>Consumer Supported Agriculture (CSA)</div>'+
								'<div class="collapsible-body"><span id="business-models-csa-text"></span></div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>Face-to-Face Sales</div>'+
								'<div class="collapsible-body"><span id="business-models-f2f-text"></span></div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>Online Trade</div>'+
								'<div class="collapsible-body"><span id="business-models-online-text"></span></div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>Retail Trade</div>'+
								'<div class="collapsible-body"><span id="business-models-retail-text"></span></div>'+
							'</li>'+
							'<li>'+
								'<div class="collapsible-header"><i class="material-icons">info_outline</i>Improved Logistics</div>'+
								'<div class="collapsible-body"><span id="business-models-logistics-text"></span></div>'+
							'</li>'+
						'</ul>'+
						//'<div class="col s12 center" id="preview-button-wrapper">'+ // style="margin-top:16px;margin-bottom:16px;">'+
							//'<button class="btn waves-effect waves-light" style="background-color:#eee;color:#000" id="preview-business-models">SEE DEFINITION</button>'+
						//'</div>'+
						//'<div class="col s12" id="preview-placeholder">'+ // style="margin-bottom:16px">'+
						//'</div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="business-models-more-info-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="recommendations-text-part-1-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div class="row">'+
							'<div class="col s6" id="recommendations-list-wrapper">'+
							'</div>'+
							'<div class="col s6" id="recommendations-spider-wrapper">'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="recommendations-text-part-2-wrapper"></div>'+
					'</div>'+
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
					//'<div class="col s12 m10 offset-m1">'+
						//'<h5 style="text-align:center">Business models for Short Food Supply Chain</h5>'+
						//'<div id="business-models-text-wrapper"></div>'+
					//'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="disclaimer-text-wrapper" style="font-size:75%; color:#888; border:1px solid #888; margin-top:16px; padding:16px;"></div>'+
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
		
		
		this.renderBusinessModelsIntro();
		
		this.renderBusinessModelsText(); // to #business-models-info-text
		
		$('.collapsible').collapsible({
			accordion: true,
			onOpenEnd: function(el) { console.log(['open el=',el]); /*self.previewOpen=true;*/ },
			onCloseEnd: function(el) { console.log(['close el=',el]); /*self.previewOpen=false;*/ }
		});
		/*
		this.renderBusinessModelsIntro();
		if (this.previewOpen ) {
			this.renderBusinessModelsText(); //('preview-placeholder', p);
			$('#preview-placeholder').css({"border":"3px solid #005794","padding":"8px"});
			// update the button text
			$('#preview-business-models').html('CLOSE DEFINITION');
		}
		$('#preview-business-models').on('click', function(){
			// TOGGLE THE PREVIEW
			if (self.previewOpen) {
				$('#preview-placeholder').empty();
				// reset CSS
				$('#preview-placeholder').css({"border":"none","padding":"0"});
				self.previewOpen = false;
				// update the button text
				$('#preview-business-models').html('SEE DEFINITION');
			} else {
				self.renderBusinessModelsText(); //('preview-placeholder', p);
				// add CSS
				$('#preview-placeholder').css({"border":"3px solid #005794","padding":"8px"});
				self.previewOpen = true;
				// update the button text
				$('#preview-business-models').html('CLOSE DEFINITION');
			}
		});*/
		
		this.renderRecommendationsPart1Text();
		this.renderRecommendationsList();
		this.renderResultsSpider();
		this.renderRecommendationsPart2Text();
		
		this.renderAdditionalDescriptionPart1();
		this.renderSpider();
		this.renderAnalysisRegionAttractiveness();
		this.renderAdditionalDescriptionPart2();
		
		
		this.renderDisclaimer();
		
		this.rendered = true;
	}
}
