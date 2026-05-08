import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

export const NeuralNodeMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 300;

    const nodes: Node[] = [
      { id: 'CORE-0', group: 1 },
      { id: 'NODE-1', group: 2 },
      { id: 'NODE-2', group: 2 },
      { id: 'NODE-3', group: 2 },
      { id: 'SHARD-A', group: 3 },
      { id: 'SHARD-B', group: 3 },
      { id: 'SHARD-C', group: 3 },
    ];

    const links: Link[] = [
      { source: 'CORE-0', target: 'NODE-1', value: 1 },
      { source: 'CORE-0', target: 'NODE-2', value: 1 },
      { source: 'CORE-0', target: 'NODE-3', value: 1 },
      { source: 'NODE-1', target: 'SHARD-A', value: 2 },
      { source: 'NODE-2', target: 'SHARD-B', value: 2 },
      { source: 'NODE-3', target: 'SHARD-C', value: 2 },
    ];

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#E60000')
      .attr('stroke-opacity', 0.2)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.group === 1 ? 8 : 5)
      .attr('fill', d => d.group === 1 ? '#E60000' : '#FFF')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    node.append('title').text(d => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);
    });

    return () => { simulation.stop(); };
  }, []);

  return (
    <div className="w-full h-full bg-black/40 rounded-lg overflow-hidden border border-white/5 relative">
        <div className="absolute top-2 left-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="label-micro text-[8px] text-red-500">Live Swarm Sync</span>
        </div>
        <svg ref={svgRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};
