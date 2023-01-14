import React, { useEffect, useRef } from "react";

import * as d3 from "d3";

import axios from "axios";

import "./App.css";

function App() {
  const svgRef = useRef();

  useEffect(() => {
    async function renderChart() {
      await axios.get("/order/dish_stats/").then((res) => {
        const svg = d3.select(svgRef.current);

        const margin = { top: 20, right: 20, bottom: 100, left: 100 };
        const graphWidth = 400 - margin.left - margin.right;
        const graphHeight = 400 - margin.top - margin.bottom;

        const graph = svg
          .append("g")
          .attr("width", graphWidth)
          .attr("height", graphHeight)
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const xAxisGroup = graph
          .append("g")
          .attr("transform", `translate(0, ${graphHeight})`);

        const yAxisGroup = graph.append("g");
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(res.data, (d) => d.count)])
          .range([graphHeight, 0]);

        const x = d3
          .scaleBand()
          .domain(res.data.map((item) => item.dishes))
          .range([0, graphWidth])
          .paddingInner(0.2)
          .paddingOuter(0.2);

        const rects = graph.selectAll("rect").data(res.data);

        rects
          .enter()
          .append("rect")
          .attr("width", x.bandwidth)
          .attr("height", (d) => graphHeight - y(d.count))
          .attr("fill", "orange")
          .attr("x", (d) => x(d.dishes))
          .attr("y", (d) => y(d.count));

        const xAxis = d3.axisBottom(x);
        const yAxis = d3
          .axisLeft(y)
          .ticks(3)
          .tickFormat((d) => d + " count");

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        xAxisGroup
          .selectAll("text")
          .attr("fill", "orange")
          .attr("transform", "rotate(-40)")
          .attr("text-anchor", "end");
      });
    }

    renderChart();
  }, []);

  return (
    <div classdishes="App">
      <header classdishes="App-header">
        <svg
          ref={svgRef}
          style={{
            height: 500,
            width: "100%",
            marginRight: "0px",
            marginLeft: "0px",
          }}
        ></svg>
      </header>
    </div>
  );
}

export default App;
