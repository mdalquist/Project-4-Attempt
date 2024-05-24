<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  var data = [
      { year: "2006", alex: "104", mindy: "152", sean: "90", karen: "162" },
      { year: "2007", alex: "122", mindy: "184", sean: "99", karen: "143" },
      { year: "2008", alex: "50", mindy: "201", sean: "127", karen: "114" },
      { year: "2009", alex: "150", mindy: "134", sean: "139", karen: "80" }
  ];

  var colors = ["#C9D6DF", "#F7EECF", "#E3E1B2", "#F9CAC8"];

  var stack = d3.stack().keys(["alex", "mindy", "sean", "karen"]);
  var dataset = stack(data.map(d => ({
    x: d3.timeParse("%Y")(d.year),
    y: [+d.alex, +d.mindy, +d.sean, +d.karen]
  })));

  



</script>

<main>
  <h1>Hello</h1>
  <body></body>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  body {
    font-family: "Bebas Neue", sans-serif;
  }
</style>
