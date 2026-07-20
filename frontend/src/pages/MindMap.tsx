import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MindMapCanvas from '../components/MindMapCanvas';
import { api } from '../services/api';
import type { MindMapData, MindMapNode } from '../types';

export default function MindMap() {
  const { id } = useParams<{ id: string }>();
  const [mindmap, setMindmap] = useState<MindMapData | null>(null);
  const [activeNode, setActiveNode] = useState<MindMapNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindmap = async () => {
      try {
        const response = await api.get(`/topics/${id}`);
        // Se o tópico estiver concluído, temos o mindmap dentro dele
        if (response.data && response.data.mindmap) {
          setMindmap(response.data.mindmap);
        } else {
          setMindmap(null);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchMindmap();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-xl text-gray-400 animate-pulse font-medium">Carregando seu material...</div>;
  if (!mindmap) return <div className="text-center mt-20 text-xl text-red-400">Erro ao carregar o mapa mental.</div>;

  return (
    <div className="flex flex-col gap-6 w-full h-[85vh]">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors bg-surface px-4 py-2 rounded-lg border border-gray-800">
          ← Nova Busca
        </Link>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Mapa Mental Estruturado
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors border border-slate-600"
          >
            📄 Baixar PDF
          </button>
          <Link to={`/quiz/${id}`} className="px-6 py-2 bg-primary hover:bg-primary/80 text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary/20">
            Fazer Simulado →
          </Link>
        </div>
      </div>
      
      <div className="flex gap-6 h-full">
        {/* Canvas Section */}
        <div className="flex-1 h-full">
          <MindMapCanvas 
            mindmap={mindmap} 
            onNodeClick={(node) => {
              console.log("Recebeu click no MindMap.tsx para o nó:", node.label);
              setActiveNode(node);
            }} 
            activeNodeId={activeNode?.id}
          />
        </div>

        <div className="w-96 bg-surface rounded-2xl border border-gray-800 p-6 flex flex-col gap-4 shadow-xl overflow-y-auto">
          <h3 className="text-xl font-bold border-b border-gray-700 pb-3 flex items-center gap-2">
            🧠 Resumo IA
          </h3>
          {activeNode ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
              <div className="flex-1">
                <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider bg-primary/10 inline-block px-2 py-1 rounded">
                  PRIORIDADE: {activeNode.priority}
                </div>
                <h4 className="text-2xl font-bold mb-4">{activeNode.label}</h4>
                <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {activeNode.detail}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col gap-3">
                {activeNode.sources && activeNode.sources.length > 0 && activeNode.sources.map((source, i) => (
                  source.includes('youtube.com') ? (
                    <a key={i} href={source} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-900/50 rounded-xl transition-colors font-semibold">
                      ▶️ Buscar Videoaula no YouTube
                    </a>
                  ) : (
                    <a key={i} href={source} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-sm truncate">
                      {source}
                    </a>
                  )
                ))}
                
                <Link to={`/quiz/${id}`} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl transition-colors font-bold shadow-lg shadow-primary/20">
                  📝 Ir para o Simulado
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic text-center mt-10 p-4 border border-dashed border-gray-700 rounded-xl">
              Selecione um bloco do mapa ao lado para ler a explicação gerada pela IA, acessar vídeos recomendados e fazer o simulado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
