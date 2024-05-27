import './app.css'
import App from './Lab7Temp/src/components/App.svelte'

import { onMount } from 'svelte';
import * as d3 from 'd3';

  onMount(() => { 
    async function fetchData() {

        function rowConverter(d) {
          return {
            'Categories': d['Categories'],
            'Public Utilities': +d['Public Utilities'], // Convert to number
            'Transportation': +d['Transportation'], 
            'Parks & Recreation': +d['Parks & Recreation'],
            'Stormwater': +d['Stormwater'],
            'Environmental Services': +d['Environmental Services'],
            'Citywide': +d['Citywide'],
            'Fire-Rescue': +d['Fire-Rescue'],
            'General Services': +d['General Services'],
            'Department of Information Technology': +d['Department of Information Technology'],
            'Library': +d['Library'],
            'Airport Management': +d['Airport Management'],
            'Sustainability & Mobility': +d['Sustainability & Mobility'],
            'Police': +d['Police'],
            'Homelessness Strategies and Solutions': +d['Homelessness Strategies and Solutions'],
            'Real Estate Assets': +d['Real Estate Assets'],
          };
        }

        const response = await fetch('Caps-Trans.csv');
        const capBudData = await response.text();
        const capData = d3.csvParse(capBudData, rowConverter);
        
        // set the dimensions and margins of the graph
        const margin = {top: 50, right: 10, bottom: 110, left: 90},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg1 = d3.select("#chart1")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",`translate(${margin.left},${margin.top})`);

        // List of subgroups = header of the csv files = soil condition here
        const groups = capData.map(d => d.Categories)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        const subgroups = capData.columns.slice(1)

        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg1.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x).tickSizeOuter(0))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, 1000000000])
          .range([ height, 0 ]);
        svg1.append("g")
          .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
          .domain(subgroups)
          .range(['#000080','#87CEFA','#DC143C', '#FFA500', '#8FBC8F', '#90EE90', '#FF0000', '#F4A460', '#006400', '#6B8E23', '#800080', '#FFC0CB', '#0000CD', '#778899', '#DAA520'])

        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
          .keys(subgroups)
          (capData)

        console.log(stackedData)

        // ----------------
        // Create a tooltip
        // ----------------
        const tooltip = d3.select("#chart1")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px")
        

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event, d) {
          const subgroupName = d3.select(this.parentNode).datum().key;
          const subgroupValue = d.data[subgroupName];
          tooltip
              .html("Department: " + subgroupName + "<br>" + "Budget: $" + subgroupValue)
              .style("opacity", 1)

        }
        const mousemove = function(event, d) {
          tooltip.style("transform","translateY(-55%)")
                .style("left",(event.x)/2+"px")
                .style("top",(event.y)/2-30+"px")
        }
        const mouseleave = function(event, d) {
          tooltip
            .style("opacity", 0)
        }

        // Show the bars
        svg1.append("g")
          .selectAll("g")
          // Enter in the stack data = loop key per key = group per group
          .data(stackedData)
          .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
              .attr("x", d =>  x(d.data.Categories))
              .attr("y", d => y(d[1]))
              .attr("height", d => y(d[0]) - y(d[1]))
              .attr("width",x.bandwidth())
              .attr("stroke", "grey")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        // Stormwater bar chart
        const svg2 = d3.select("#chart2")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",`translate(${margin.left},${margin.top})`); 

        svg2.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x).tickSizeOuter(0))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

        // Add Y axis
        const y2 = d3.scaleLinear()
          .domain([0, 100000000])
          .range([ height, 0 ]);
        svg2.append("g")
          .call(d3.axisLeft(y2)); 

        const tooltip2 = d3.select("#chart2")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover2 = function(event, d) {
          tooltip2
              .html("Stormwater Budget: $" + d)
              .style("opacity", 1)

        }
        const mousemove2 = function(event, d) {
          tooltip2.style("transform","translateY(-55%)")
                .style("left",(event.x)/2+"px")
                .style("top",(event.y)/2-30+"px")
        }
        const mouseleave2 = function(event, d) {
          tooltip2
            .style("opacity", 0)
        }

        const stormCol = capData.map(d => d['Stormwater'])

        svg2.append("g")
          .selectAll("g")
            .data(stormCol)
            .join("rect")
              .attr("x", (d,i) => x(groups[i]))
              .attr("y", d => y2(d))
              .attr("width", x.bandwidth())
              .attr("height", d => height - y2(d))
              .attr("fill", '#FFA500')
              .attr("stroke", "grey")
            .on("mouseover", mouseover2)
            .on("mousemove", mousemove2)
            .on("mouseleave", mouseleave2)
    }
    
    fetchData();
    
  });
