
<template>
  <div class="container">
    <h3>Direct graph</h3>
    <svg></svg>
  </div>
</template>

<script>
import data from "./data.js";
import * as d3 from "d3";

export default {
  data() {
    return {
      count: 0,
    };
  },
  mounted() {
    var svg = d3.select("svg");
    let container = document.querySelector(".container");
    let svg_node = document.querySelector("svg");
    svg_node.setAttribute("width", svg_node.clientWidth);
    svg.attr("height", window.innerHeight - 30);
    svg.attr(
      "height",
      svg_node.clientWidth / 2 > 400 ? svg_node.clientWidth / 2 : 400
    );
    var width = +svg.attr("width"),
      height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeAccent);

    let graph = data;

    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function (d) {
          return d.id;
        })
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-500)
          .distanceMax(width / 3)
          .distanceMin(10)
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke", function (d) {
        return d.stroke;
      })
      .attr("stroke-width", function (d) {
        return Math.sqrt(d.value);
      });

    var node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g")
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      });
    var circles = node
      .append("circle")
      .attr("r", function (d) {
        return d.weight;
      })
      .attr("fill", function (d) {
        return color(d.name);
      });

    var lables = node
      .append("text")
      .text(function (d) {
        return d.name;
      })
      .attr("x", 6)
      .attr("y", 3);

    node.append("title").text(function (d) {
      return d.name;
    });

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    function ticked() {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      dfx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  },
};
</script>
<style scoped>
.container {
  padding: 15px;
  box-sizing: border-box;
}
.container svg {
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}
a {
  color: #42b983;
}
line {
  stroke: lightblue;
}
.links line {
  stroke: lightblue;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: rgba(255, 255, 255, 0.514);
  stroke-width: 1.5px;
}

text {
  font-family: sans-serif;
  font-size: 10px;
}
</style>
