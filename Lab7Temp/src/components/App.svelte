<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  onMount(() => { 
    async function fetchData() {

        function rowConverter(d) {
          return {
            '2010-11 Adopted CIP Budget': +d['2010-11 Adopted CIP Budget'], // Convert to number
            '2011-12 Adopted CIP Budget': +d['2011-12 Adopted CIP Budget'], 
            '2012-13 Adopted CIP Budget': +d['2012-13 Adopted CIP Budget'],
            '2013-14 Adopted CIP Budget': +d['2013-14 Adopted CIP Budget'],
            '2014-15 Adopted CIP Budget': +d['2014-15 Adopted CIP Budget'],
            '2015-16 Adopted CIP Budget': +d['2015-16 Adopted CIP Budget'],
            '2016-17 Adopted CIP Budget': +d['2016-17 Adopted CIP Budget'],
            '2017-18 Adopted CIP Budget': +d['2017-18 Adopted CIP Budget'],
            '2018-19 Adopted CIP Budget': +d['2018-19 Adopted CIP Budget'],
            '2019-20 Adopted CIP Budget': +d['2019-20 Adopted CIP Budget'],
            '2020-21 Adopted CIP Budget': +d['2020-21 Adopted CIP Budget'],
            '2021-22 Adopted CIP Budget': +d['2021-22 Adopted CIP Budget'],
            '2022-23 Adopted CIP Budget': +d['2022-23 Adopted CIP Budget'],
            '2023-24 Adopted CIP Budget': +d['2023-24 Adopted CIP Budget'],
            '2024-25 Proposed CIP Budget': +d['2024-25 Proposed CIP Budget'],
          };
        }

        const response = await fetch('capital_clean.csv');
        const capBudData = await response.text();
        const capData = d3.csvParse(capBudData, rowConverter);
        
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 20, left: 50},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("svg")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",`translate(${margin.left},${margin.top})`);

        // List of subgroups = header of the csv files = soil condition here
        const groups = capData.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        const subgroups = capData.map(d => d['Category'])

        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, 1000000000])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
          .domain(subgroups)
          .range(['#000080','#87CEFA','#DC143C', '#FFA500', '#8FBC8F', '#90EE90', '#FF0000', '#F4A460', '#006400', '#6B8E23', '#800080', '#FFC0CB', '#0000CD', '#778899', '#DAA520'])

        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
          .keys(groups)
          (capData)

        console.log(stackedData)

        // ----------------
        // Create a tooltip
        // ----------------
        const tooltip = d3.select("svg")
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
              .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
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
        svg.append("g")
          .selectAll("g")
          // Enter in the stack data = loop key per key = group per group
          .data(stackedData)
          .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
              .attr("x", d =>  x(d.data.group))
              .attr("y", d => y(d[1]))
              .attr("height", d => y(d[0]) - y(d[1]))
              .attr("width",x.bandwidth())
              .attr("stroke", "grey")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    }
    
    fetchData();
    
  });
</script>

<main>
  <h1>San Diego Residents: Where Are Your Tax Dollars Going?</h1>
  <h2>Analyzing The San Diego City Budget for Weather Emergencies</h2>
  <p>Every year on April 15, residents of the United States turn in their tax forms, handing over a large portion of their income to the federal, state, and local governments. Around the same time, those residents start asking the burning question: Where is my money going? The capital budget of the city of San Diego is utilized to fund long-term investments and projects; these include but are not limited to public utilities, transportation, as well as parks & recreational facilities. The City of San Diego government site hosts a database which details how much money goes into these investments between the years 2010 to 2024 as well as the proposed budget for 2025. The capital budget within these years has grown, with respect to inflation, by approximately 50 percent. The total adopted budget, split up by asset owning department, for each year between 2010 and 2024, along with the proposed budget for 2025, is displayed below:</p>
  <body></body>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  body {
    font-family: "Bebas Neue", sans-serif;
  }
</style>
