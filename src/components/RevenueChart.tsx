import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RevenueChartProps {
  data: number[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 10, right: 10, bottom: 20, left: 10 };

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([d3.min(data) || 0, (d3.max(data) || 10000) * 1.1])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line<number>()
      .x((_: number, i: number) => x(i))
      .y((d: number) => y(d))
      .curve(d3.curveMonotoneX);

    const area = d3.area<number>()
        .x((_: number, i: number) => x(i))
        .y0(height - margin.bottom)
        .y1((d: number) => y(d))
        .curve(d3.curveMonotoneX);

    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'flux-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#E60000')
        .attr('stop-opacity', 0.3);

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#E60000')
        .attr('stop-opacity', 0);

    svg.append('path')
        .datum(data)
        .attr('fill', 'url(#flux-gradient)')
        .attr('d', area);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#E60000')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.append('circle')
        .attr('cx', x(data.length - 1))
        .attr('cy', y(data[data.length - 1]))
        .attr('r', 3)
        .attr('fill', '#E60000')
        .attr('class', 'animate-pulse');

  }, [data]);

  return (
    <div className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
