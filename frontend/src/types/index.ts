export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'branch' | 'leaf';
  detail: string;
  priority: 'fire' | 'high' | 'medium' | 'low' | 'new';
  audioUrl?: string;
  sources: string[];
  subTopics?: string[];
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
}
