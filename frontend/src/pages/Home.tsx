import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProgressBar from '../components/ProgressBar';
import { api } from '../services/api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:4800', {
  query: { userId: 'user-mocked-123' }
});

export default function Home() {
  const navigate = useNavigate();
  const [topicId, setTopicId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<{ progress: number, message: string } | null>(null);

  useEffect(() => {
    socket.on('scraping:start', (data) => {
      setProgressData({ progress: 10, message: `Processando o tema: ${data.title}` });
    });
    
    socket.on('scraping:progress', (data) => {
      setProgressData({ progress: data.progress, message: data.message });
    });
    
    socket.on('scraping:done', (data) => {
      setProgressData({ progress: 100, message: '🎉 Mapa Mental pronto!' });
      setTimeout(() => {
        navigate(`/mindmap/${data.topicId || 'demo'}`);
      }, 1500);
    });

    socket.on('scraping:error', (data) => {
      setProgressData({ progress: 0, message: `Erro: ${data.message}` });
    });

    return () => {
      socket.off('scraping:start');
      socket.off('scraping:progress');
      socket.off('scraping:done');
      socket.off('scraping:error');
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      handleSearch(q);
      // Remove o parâmetro da URL sem recarregar a página
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSearch = async (query: string) => {
    setProgressData({ progress: 5, message: 'Iniciando os motores da IA...' });
    try {
      const response = await api.post('/topics', { title: query });
      setTopicId(response.data._id);
    } catch (error) {
      setProgressData({ progress: 0, message: 'Erro ao conectar com a API' });
    }
  };

  const suggestions = [
    "Direito Administrativo - Licitações",
    "Direito Constitucional - Direitos Fundamentais",
    "Informática - Segurança da Informação"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-10 relative">
      {/* Background Glow Decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none -z-10"></div>

      <div className="text-center max-w-3xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-gray-700/50 text-sm font-medium text-primary mb-8 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Inteligência Artificial v2.0 Ativada
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          O que vamos <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">estudar hoje?</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Digite o tema do edital. Nossa IA vai varrer a internet, compilar os dados mais importantes e montar um <strong>mapa mental interativo</strong> focado na sua aprovação.
        </p>
      </div>

      <div className="w-full max-w-2xl px-4 z-10 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-150 fill-mode-both">
        <SearchBar onSearch={handleSearch} isLoading={progressData !== null && progressData.progress < 100} />
        
        {!progressData && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-gray-500 w-full text-center mb-1">Experimente buscar por:</span>
            {suggestions.map((sug, i) => (
              <button 
                key={i}
                onClick={() => setTopicId(sug)}
                className="text-sm bg-surface/50 border border-gray-800 hover:border-gray-600 hover:bg-surface text-gray-300 px-4 py-2 rounded-full transition-all active:scale-95 cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>

      {progressData && (
        <div className="w-full max-w-2xl mt-4 px-4 animate-in fade-in zoom-in-95 duration-500">
          <ProgressBar progress={progressData.progress} message={progressData.message} />
        </div>
      )}
    </div>
  );
}
