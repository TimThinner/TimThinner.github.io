const DUMMY_DATA = [
	{name: "1", value:226023},
	{name: "2", value:254004},
	{name: "3", value:363994},
	{name: "4", value:267438},
	{name: "5", value:228513},
	{name: "6", value:274456},
	{name: "7", value:200336},
	{name: "8", value:296441},
	{name: "9", value:220501},
	{name: "10", value:184820},
	{name: "11", value:251908},
	{name: "12", value:349117},
	{name: "13", value:365553},
	{name: "14", value:380513},
	{name: "15", value:460285},
	{name: "16", value:409174},
	{name: "17", value:410304},
	{name: "18", value:415214},
	{name: "19", value:420598},
	{name: "20", value:471354},
	{name: "21", value:469132},
	{name: "22", value:438532},
	{name: "23", value:471041},
	{name: "24", value:450723},
	{name: "25", value:501573},
	{name: "26", value:518566},
	{name: "27", value:521528},
	{name: "28", value:544084},
	{name: "29", value:522578},
	{name: "30", value:533628},
	{name: "31", value:510077},
	{name: "32", value:523862},
	{name: "33", value:520614},
	{name: "34", value:518082},
	{name: "35", value:621009},
	{name: "36", value:538670}
	//{name: "37", value:0},
	//{name: "38", value:10000},
	//{name: "39", value:700000},
	//{name: "40", value:690000}
];
/*
https://bl.ocks.org/mbostock/3019563
https://observablehq.com/@d3/margin-convention?collection=@d3/d3-axis
*/
render = function() {
	$('svg').empty();
	
	console.log('Testing main v 2.0');
	
	const margin = {top: 20, right: 20, bottom: 20, left: 60};
	
	let w = $(window).width()-40;
	if (w > 1600) {
		w = 1600;
	}
	const h = w*0.5; //$(window).height();
	const xRange = [margin.left, w - margin.right]; // [left, right]
	const yRange = [h - margin.bottom, margin.top]; // [bottom, top]
	/*
	const xScale = d3.scaleLinear()
		.domain(DUMMY_DATA.map((dataPoint) => dataPoint.name))
		.range(xRange)
		*/
	const xScale = d3
		.scaleBand()
		.domain(DUMMY_DATA.map((dataPoint) => dataPoint.name))
		.rangeRound(xRange)
		.padding(0.1);
		
	const yScale = d3.scaleLinear()
		.domain([0, 700000])
		.range(yRange);
		
	const xAxis = g => g
		.attr("transform", `translate(0,${h - margin.bottom})`)
		.call(d3.axisBottom(xScale))
		
	const yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(yScale))
	
	const svg = d3.select('svg')//.classed('container', true);
		.attr('width',w)
		.attr('height',h)
		.attr("viewBox", [0, 0, w, h])
		.style('border','1px solid #aaa');
	// Paint SVG (chart) background white.
	svg.append('rect')
		.attr('width', w)
		.attr('height', h)
		.attr('x', 0)
		.attr('y', 0)
		.attr('fill','#fff');
	
	svg.append("g").call(xAxis);
	
	svg.append("g").call(yAxis);
	
	const yGrid = d3.axisLeft()
		.scale(yScale)
		.tickFormat('')
		.ticks(14)
		.tickSizeInner(-w + margin.left + margin.right)
	
	svg.append('g')
		.attr('class', 'y-grid')
		.attr('transform', 'translate(' + margin.left + ', 0)')
		.call(yGrid)
	
	svg.selectAll('.bar')
		.data(DUMMY_DATA)
		.enter()
		.append('rect')
			.classed('bar', true)
			.attr('width', xScale.bandwidth())
			.attr('height', (data) => h - margin.bottom - yScale(data.value))
			.attr('x', data => xScale(data.name))
			.attr('y', data => yScale(data.value));
	/*
	svg
		.selectAll('rect')
		.data(DUMMY_DATA)
		.enter()
		.append('rect')
			.attr('x', d => xScale(d.location))
			.attr('y', d => yScale(d.new_deaths))
			.attr('width', xScale.bandwidth())
			.attr('height', d => h - margin.bottom - yScale(d.value))
			.attr('fill', 'yellow')
	*/
	
	svg.selectAll("text.bar")
		.data(data)
		.enter()
		.append("text")
		.attr("class", "bar")
		.attr("text-anchor", "middle")
		.attr("x", function(d) { return xScale(d.name) + xScale.bandwidth()/2; })
		.attr("y", function(d) { return yScale(d.value) - 5; })
		.text(function(d) { return d.value/1000; });
}
$(window).on('resize', function() {
	render();
});
render();

/*
See 
http://bl.ocks.org/larskotthoff/601c66edfb83a11cf2bb


svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });

  svg.selectAll("text.bar")
      .data(data)
    .enter().append("text")
      .attr("class", "bar")
      .attr("text-anchor", "middle")
      .attr("x", function(d) { return x(d.letter) + x.rangeBand()/2; })
      .attr("y", function(d) { return y(d.frequency) - 5; })
      .text(function(d) { return d.frequency; });
*/