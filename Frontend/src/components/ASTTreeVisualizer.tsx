import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ASTNode {
  type: 'operator' | 'operand';
  operator?: 'AND' | 'OR';
  left: ASTNode | null;
  right: ASTNode | null;
  value: {
    attribute: string;
    operator: string;
    comparisonValue: string;
  } | null;
}

const ASTTreeVisualizer: React.FC<{ data: ASTNode }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const nodeSize = { width: 120, height: 60 };

    const tree = d3.tree<ASTNode>().nodeSize([nodeSize.height, nodeSize.width]);

    const root = d3.hierarchy(data, d => {
      if (d.type === "operator") {
        return [d.left, d.right].filter((node): node is ASTNode => node !== null);
      }
      return null;
    });

    const treeData = tree(root);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    treeData.each(d => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
      minY = Math.min(minY, d.y);
      maxY = Math.max(maxY, d.y);
    });

    const width = maxY - minY + margin.left + margin.right + nodeSize.width;
    const height = maxX - minX + margin.top + margin.bottom + nodeSize.height;

    const scale = Math.min(dimensions.width / width, dimensions.height / height);

    svg.attr("width", width * scale)
      .attr("height", height * scale)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left + nodeSize.width / 2},${-minX + margin.top + nodeSize.height / 2})`);

    const linkGenerator = d3.linkHorizontal<d3.HierarchyPointLink<ASTNode>, d3.HierarchyPointNode<ASTNode>>()
      .x(d => d.y)
      .y(d => d.x);

    g.selectAll(".link")
      .data(treeData.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .attr("stroke", "#4B5563")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    const node = g.selectAll(".node")
      .data(treeData.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("r", 6)
      .attr("fill", "#60A5FA");

    node.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -10 : 10)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("fill", "#E5E7EB")
      .text((d: d3.HierarchyPointNode<ASTNode>) => {
        if (d.data.type === "operator") {
          return d.data.operator || '';
        } else if (d.data.value) {
          return `${d.data.value.attribute} ${d.data.value.operator} ${d.data.value.comparisonValue}`;
        } else {
          return '';
        }
      });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [data, dimensions]);

  return (
    <div className="w-full h-full" ref={containerRef}>
      <div className="w-full h-full border border-gray-700 rounded-lg bg-gray-900 p-4 overflow-hidden">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default ASTTreeVisualizer;
