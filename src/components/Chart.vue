
<template>
  <div class="container">
    <h3>SEARCH IN DIRECTED GRAPH</h3>
    <button @click="createPoint">Create Point</button>
    <button @click="randomize">Randomize</button>
    <input type="text" v-model="start" />
    <input type="text" v-model="end" />
    <button @click="search">Search</button>
    <div v-if="results.length">
      <Result
        v-for="(item, index) of results"
        v-bind:result="item"
        :index="index"
        v-bind:key="index"
      ></Result>
    </div>
    <div v-if="isEmpty">
      <h3>NO RESULTS</h3>
    </div>
    <svg id="graph"></svg>
  </div>
</template>

<script>
import { generateData, createNode } from "./data.js";
import { formatData, CreateDFS, RemovePath, CalcValues } from "./floyds.js";
import ResultVue from "./Result.vue";
import * as d3 from "d3";
let number_of_data = 100;
let startData = generateData(number_of_data);
export default {
  components: {
    Result: ResultVue,
  },
  data() {
    return {
      width: 0,
      height: 0,
      start: 0,
      end: 1,
      isEmpty: false,
      results: [],
    };
  },
  methods: {
    search() {
      if (this.end === this.start) {
        return;
      }
      let nodes_map = formatData(startData);
      console.log(nodes_map);
      const start = Number(this.start);
      const end = Number(this.end);
      const results = [];
      for (let i = 0; i < number_of_data; i++) {
        let res = CreateDFS(nodes_map, end)(start);
        if (res == false) {
          break;
        }
        results.push(res);
        nodes_map = RemovePath(nodes_map, res);
      }
      const values = CalcValues(startData.nodes, results);
      const viewResults = [];
      for (const [key, val] of Object.entries(values)) {
        let color = "rgb(0, 255, 0)";
        if (key == 3) {
          break;
        }
        switch (key) {
          case "1":
            color = "rgb(245, 236, 67)";
            break;
          case "2":
            color = "blue";
            break;
        }
        val.color = color;
        val.steps.forEach((el) => {
          el.stroke = color;
          startData.links.push(el);
        });
        viewResults.push(val);
      }
      if (viewResults.length) {
        this.results = viewResults;
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
        this.results = [];
      }
      this.update();
      this.clearResultsInGraph();
    },
    randomize() {
      startData = generateData(number_of_data);
      this.isEmpty = false;
      this.results = [];
      this.update();
    },
    initSVG() {
      var svg = d3.select("svg");
      let svg_node = document.querySelector("svg");
      svg_node.setAttribute("width", svg_node.clientWidth);
      svg.attr("height", window.innerHeight - 30);
      svg.attr(
        "height",
        svg_node.clientWidth / 2 > 400 ? svg_node.clientWidth / 2 : 400
      );
      const marker = svg.append("defs").append("marker");
      const attrs = {
        id: "arrowhead",
        viewBox: "-0 -5 10 10",
        refX: 5,
        refY: 0,
        orient: "auto",
        markerWidth: 5,
        markerHeight: 5,
        xoverflow: "visible",
        yoverflow: "visible",
      };
      for (const [key, value] of Object.entries(attrs)) {
        marker.attr(key, value);
      }
      marker
        .append("svg:path")
        .attr("d", "M 0,-5 L 10 ,0 L 0,5")
        .attr("fill", "lightblue")
        .style("stroke", "none");

      svg.append("g").attr("id", "group");
      const width = +svg.attr("width"),
        height = +svg.attr("height");
      this.width = width;
      this.height = height;
    },
    clearResultsInGraph() {
      startData.links = startData.links.filter((el) => !el.isResult);
    },
    update() {
      d3.select("#group").html("");
      this.render(startData);
    },
    createPoint() {
      let [node, links] = createNode(number_of_data);
      console.log(startData, node, links);
      startData = {
        nodes: [...startData.nodes, node],
        links: [...startData.links, ...links],
      };
      this.isEmpty = false;
      this.results = [];
      number_of_data += 1;
      this.clearResultsInGraph();
      this.update();
    },
    render(data) {
      const width = this.width,
        height = this.height;
      let colors = d3.schemeTableau10;
      let nodeGroups = undefined;
      const invalidation = undefined;
      const linkStrokeLinecap = "round";
      const nodeFill = "currentColor",
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 1.5, // node stroke width, in pixels
        nodeStrokeOpacity = 1;
      const linkStrokeWidth = (l) => Math.sqrt(l.value);
      const linkStrokeOpacity = 1;
      const nodeGroup = (d) => d.group;
      const nodeTitle = (d) => `${d.id}`;
      const nodeId = (d) => d.id;
      const linkSource = ({ source }) => source;
      const linkTarget = ({ target }) => target;
      const N = d3.map(data.nodes, nodeId).map(intern);
      const LS = d3.map(data.links, linkSource).map(intern);
      const LT = d3.map(data.links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
      const T = nodeTitle == null ? null : d3.map(data.nodes, nodeTitle);
      const G =
        nodeGroup == null ? null : d3.map(data.nodes, nodeGroup).map(intern);
      const W =
        typeof linkStrokeWidth !== "function"
          ? null
          : d3.map(data.links, linkStrokeWidth);

      // Replace the input margin: 0px 10px 10px 0px;nodes and links with mutable objects for the simulation.
      let nodes = d3.map(data.nodes, (val, i) => ({
        id: N[i],
        name: val.name,
        weight: val.weight,
      }));
      let links = d3.map(data.links, (val, i) => ({
        source: LS[i],
        target: LT[i],
        stroke: val.stroke,
      }));

      // Compute default domains.
      if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      const color =
        nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

      const simulation = d3
        .forceSimulation(nodes)
        .alphaDecay(0.03)
        .force(
          "link",
          d3
            .forceLink(links)
            .id(({ index: i }) => N[i])
            .distance(500)
        )
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("attraceForce", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter());
      simulation.on("tick", ticked);

      const svg = d3
        .select("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
      const g = svg.select("#group");
      const link = g
        .append("g")
        .attr("stroke-linecap", linkStrokeLinecap)
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", function (d) {
          return Math.sqrt(d.value / 2);
        })
        .attr("marker-end", "url(#arrowhead)")
        .attr("stroke", (d) => {
          return d.stroke;
        });

      const circles_group = g
        .append("g")
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        .selectAll("circle")
        .data(nodes)
        .join("g");

      circles_group.append("circle").attr("r", (d) => d.weight);
      circles_group
        .append("text")
        .text(function (d) {
          return `${d.name}`;
        })
        .attr("stroke", "white")
        .style("font-size", "16px")
        .attr("x", (d) => {
          return -(d.weight / 2);
        })
        .attr("y", (d) => d.weight / 2);
      const node = circles_group.call(drag(simulation));

      if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      if (G) node.attr("fill", ({ index: i }) => color(G[i]));
      if (T) node.append("title").text(({ index: i }) => T[i]);
      if (invalidation != null) invalidation.then(() => simulation.stop());

      function intern(value) {
        return value !== null && typeof value === "object"
          ? value.valueOf()
          : value;
      }

      function drag(simulation) {
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }

      function ticked() {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      }
      svg.call(
        d3.zoom().on("zoom", function (event) {
          g.attr("transform", event.transform);
        })
      );
    },
  },
  mounted() {
    this.initSVG();
    this.render(startData);
    console.log("START");
  },
};
</script>
<style scoped>
text {
  font-size: 10px;
}
.container {
  padding: 3vh 10vw;
  box-sizing: border-box;
}
.container svg {
  margin-top: 30px;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  box-shadow: rgb(194 202 214) 0px 0.6em, rgb(194 202 214) 0px -0.6em,
    rgb(194 202 214) 0.6em 0px, rgb(194 202 214) -0.6em 0px;
  border: 5px solid white;
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
h3 {
  font-size: 30px;
  color: rgb(0, 255, 0);
}
</style>
