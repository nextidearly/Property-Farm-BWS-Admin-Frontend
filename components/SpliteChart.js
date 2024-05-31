import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { shortAddress } from "@/utils";

const TidyTree = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove(); // Clear existing SVG elements

    const container = svgRef.current.parentElement;
    const containerWidth = container.clientWidth;

    // Calculate height based on number of shares
    const sharesLength = data.children.length;
    let height = sharesLength * 14;

    const margin = { top: 20, right: 160, bottom: 20, left: 160 };
    const width = containerWidth - margin.left - margin.right;

    const svg = svgElement
      .attr("width", "100%")
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height, width]);
    const links = treeLayout(root).links();
    const linkPathGenerator = d3
      .linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x);

    // Style for links (bars)
    svg
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", linkPathGenerator)
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-width", 2);

    // Style for nodes
    svg
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.y)
      .attr("cy", (d) => d.x)
      .attr("r", 5)
      .attr("fill", "#f68816");

    // Text labels for nodes
    svg
      .selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.y)
      .attr("y", (d) => d.x)
      .attr("dy", 4)
      .attr("dx", (d) => (d.depth === 0 ? -24 : 10))
      .attr("text-anchor", (d) => (d.depth === 0 ? "end" : "start"))
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "12px")
      .style("fill", "#f68816")
      .text((d) => {
        const income =d.data.amount;
        return `$${income} ${
          d.depth !== 0 ? ` (${shortAddress(d.data.owner, 3)})` : ``
        }`;
      });

    return () => {
      svgElement.selectAll("*").remove(); // Cleanup SVG elements on unmount
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default TidyTree;
