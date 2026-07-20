import React, { useEffect } from 'react';
import ReactFlow, {
  Controls, MiniMap, Background,
  useNodesState, useEdgesState,
  Handle, Position
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import type { MindMapData, MindMapNode } from '../types';

interface MindMapCanvasProps {
  mindmap: MindMapData;
  onNodeClick: (node: MindMapNode) => void;
  activeNodeId?: string;
}

// O visual exato do print: Fundo azul escuro nas caixas
const nodeStyle = {
  root: { bg: '#1A2942', border: '#3B82F6', text: '#E2E8F0' },
  branch: { bg: '#17253B', border: '#2A3F5F', text: '#CBD5E1' }
};

const CustomNode = ({ data, id }: { data: MindMapNode & { onClick?: () => void; isActive: boolean }, id: string }) => {
  const style = data.type === 'root' ? nodeStyle.root : nodeStyle.branch;
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        console.log("Clicou no quadro (onClick):", id, data.label);
        if (data.onClick) data.onClick();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        console.log("Clicou no quadro (onMouseDown):", id, data.label);
        if (data.onClick) data.onClick();
      }}
      className={`nodrag transition-all duration-300 shadow-xl ${data.isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0B1120]' : 'hover:border-blue-500/50'}`}
      style={{
        background: style.bg,
        borderColor: style.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: data.type === 'root' ? '12px' : '12px',
        padding: data.type === 'root' ? '20px 28px' : '14px 20px',
        cursor: 'pointer',
        minWidth: data.type === 'root' ? 200 : 220,
        maxWidth: 280,
      }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      
      <div 
        className={`font-semibold leading-snug mb-1 ${data.type === 'root' ? 'text-lg text-center text-blue-300' : 'text-[15px] text-blue-100'}`}
      >
        {data.label}
      </div>
      
      {data.type === 'root' && (
        <div className="text-xs text-center opacity-70 mt-2 font-medium text-blue-200">
          {data.priority === 'fire' ? '🔥 Tema Quente' : '⭐ Tópico Central'}
        </div>
      )}

      {data.type !== 'root' && (
        <div className="text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: '#64748B' }}>
          {data.priority === 'fire' ? '🔴 1º Mais Cobrado' : data.priority === 'high' ? '🔴 Muito Alto' : '🟡 Alto'}
        </div>
      )}

      {data.subTopics && data.subTopics.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5 pt-3 border-t border-slate-700/50">
          {data.subTopics.map((sub, i) => (
            <div key={i} className="text-[12px] flex items-start gap-1.5 hover:bg-slate-800/50 p-1 rounded transition-colors text-slate-300">
              <span className="text-[10px] text-blue-400 opacity-80 mt-0.5">❯</span>
              <span className="leading-tight">{sub}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function MindMapCanvas({ mindmap, onNodeClick, activeNodeId }: MindMapCanvasProps) {
  const rfNodes: Node[] = mindmap.nodes.map((node, index) => ({
    id: node.id,
    type: 'custom',
    position: calculatePosition(node, index, mindmap.nodes.length),
    data: {
      ...node,
      onClick: () => {
        console.log("Chamando onNodeClick para:", node.label);
        onNodeClick(node);
      },
      isActive: node.id === activeNodeId,
    },
  }));

  const rfEdges: Edge[] = mindmap.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'default',
    animated: false,
    style: { 
      stroke: '#3B82F6', 
      strokeWidth: 1.5,
      strokeDasharray: '5 5', // Faz a linha ficar tracejada igual ao print
      opacity: 0.6
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  // Atualiza o estado ativo dos nós quando activeNodeId muda
  useEffect(() => {
    setNodes(nds => nds.map(n => ({
      ...n,
      data: { ...n.data, isActive: n.id === activeNodeId }
    })));
  }, [activeNodeId, setNodes]);

  return (
    <div className="w-full h-full min-h-[700px] bg-[#0B1120] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node.data as MindMapNode)}
        nodeTypes={{ custom: CustomNode }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-right"
      >
        <Controls className="bg-slate-900 border-slate-800 fill-blue-300" />
        <Background variant={"dots" as any} gap={24} size={2} color="#1E293B" />
      </ReactFlow>
    </div>
  );
}

// Layout radial ideal para alinhamento e bom preenchimento de tela
function calculatePosition(node: MindMapNode, index: number, total: number): { x: number; y: number } {
  const CENTER_X = 500;
  const CENTER_Y = 350;
  
  if (node.type === 'root') return { x: CENTER_X, y: CENTER_Y };
  
  const branchIndex = index - 1;
  const numBranches = total - 1 > 0 ? total - 1 : 1;
  
  // Raios menores para que o fitView do React Flow não afaste tanto as caixas (deixando-as maiores na tela)
  const radiusX = 480;
  const radiusY = 320;
  
  const angle = (branchIndex / numBranches) * 2 * Math.PI;
  return { 
    x: CENTER_X + Math.cos(angle) * radiusX, 
    y: CENTER_Y + Math.sin(angle) * radiusY 
  };
}
