import * as d3 from "d3";
import React from "react";

import { useD3 } from "./hooks/useD3";

function BarChart({ data }) {
  const ref = useD3(
    (svg) => {
      const margin = { top: 20, right: 20, bottom: 100, left: 100 };
      const height = 600 - margin.top - margin.bottom;
      const width = 600 - margin.left - margin.right;

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.dishes))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.count)])
        .rangeRound([height, margin.top]);

      const xAxis = (g) =>
        g.attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .style("color", "white")
          .call(d3.axisLeft(y))
          .call((g) =>
            g
              .append("text")
              .attr("fill", "white")
              .attr("text-anchor", "start")
              .text(data.y)
          );

      svg.select(".x-axis").call(xAxis);
      svg.select(".y-axis").call(yAxis);

      const t = d3.transition().duration(700);
      const widthTween = (d) => {
        let i = d3.interpolate(0, x.bandwidth());
        return function (t) {
          return i(t);
        };
      };

      svg
        .select(".plot-area")
        .attr("fill", "steelblue")
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("style", "outline: steelblue")
        .attr("height", (d) => 0)
        .attr("x", (d) => x(d.dishes))
        .attr("y", (d) => height)
        .transition(t)
        .attrTween("width", widthTween)
        .attr("y", (d) => y(d.count))
        .attr("height", (d) => height - y(d.count));

      function handleClick() {
        const target = d3.select(this);
        const currentBorder = target.style("outline");
        if (currentBorder == "steelblue") {
          target.attr("style", "outline: solid white");
        } else {
          target.attr("style", "outline: steelblue");
        }
      }

      function handleMouseOver() {
        d3.select(this).attr("fill", "lightblue");
      }

      function handleMouseLeave() {
        d3.select(this).attr("fill", "steelblue");
      }

      svg
        .selectAll("rect")
        .on("mouseover", handleMouseOver)
        .on("mouseleave", handleMouseLeave)
        .on("click", handleClick);
    },
    [data.length]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: 600,
        width: 600,
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}

export default BarChart;
