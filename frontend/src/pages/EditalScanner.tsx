import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

interface ChecklistItem {
  assunto: string;
  prioridade: string;
  peso: number;
  estudado?: boolean;
  revisado?: boolean;
}

interface Disciplina {
  disciplina: string;
  topicos: ChecklistItem[];
}

export default function EditalScanner() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [cargo, setCargo] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editalId, setEditalId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<{ progress: number; message: string } | null>(null);
  const [checklist, setChecklist] = useState<Disciplina[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setEditalId(id);
    }
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cargo || (!file && !url)) {
      alert("Forneça o cargo e o PDF (ou link).");
      return;
    }

    setIsUploading(true);
    setProgressData({ progress: 5, message: 'Processando requisição...' });

    const formData = new FormData();
    formData.append('cargo', cargo);
    if (file) formData.append('file', file);
    if (url) formData.append('url', url);

    try {
      const res = await fetch('http://localhost:8800/api/edital/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'error') {
        setProgressData(null);
        alert(data.message);
      } else if (data.editalId) {
        setEditalId(data.editalId);
        window.history.pushState({}, '', `/edital?id=${data.editalId}`);
      }
    } catch (error) {
      setProgressData(null);
      alert('Erro ao enviar o edital');
    }
    setIsUploading(false);
  };

  useEffect(() => {
    if (!editalId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8800/api/edital/${editalId}`);
        const data = await res.json();

        if (data.status === 'processing') {
          setProgressData({ progress: data.progress || 50, message: 'A IA está lendo seu Edital e filtrando as matérias...' });
        } else if (data.status === 'done' || data.status === 'error') {
          clearInterval(interval);
          setChecklist(data.checklist);
          setProgressData(null);
        } else if (data.status === 'pending') {
          setProgressData({ progress: 15, message: 'Aguardando retry devido a bloqueio da IA...' });
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [editalId]);

  const handleToggleProgress = async (dIdx: number, tIdx: number, field: 'estudado' | 'revisado', currentValue: boolean) => {
    if (!checklist || !editalId) return;
    
    // Optimistic UI update
    const newChecklist = [...checklist];
    newChecklist[dIdx].topicos[tIdx][field] = !currentValue;
    setChecklist(newChecklist);

    try {
      await fetch(`http://localhost:8800/api/edital/${editalId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina_idx: dIdx,
          topico_idx: tIdx,
          field,
          value: !currentValue
        })
      });
    } catch (e) {
      console.error('Failed to update progress', e);
    }
  };

  const handleGenerateMindMap = (assunto: string, prioridade: string) => {
    navigate(`/?q=${encodeURIComponent(`${assunto} (Foco de Edital: ${prioridade})`)}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[75vh] gap-10">
      <div className="text-center max-w-3xl px-4 mt-8">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
          Raio-X do <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Edital</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Faça upload do PDF do edital. Nossa IA vai varrer o documento, cruzar com o histórico da banca e gerar seu <strong>Edital Verticalizado</strong> focado no que mais cai.
        </p>
      </div>

      {!checklist && (
        <form onSubmit={handleUpload} className="w-full max-w-lg bg-surface/80 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2">Qual o cargo desejado?</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Analista de TI, Técnico Judiciário..."
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2">Envie o PDF do Edital...</label>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e) => {
                setFile(e.target.files ? e.target.files[0] : null);
                if (e.target.files && e.target.files.length > 0) setUrl('');
              }}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/10 file:text-green-500 hover:file:bg-green-500/20 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="border-t border-gray-700 flex-grow"></div>
            <span className="px-3 text-gray-500 text-sm font-medium">OU</span>
            <div className="border-t border-gray-700 flex-grow"></div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-300 text-sm font-bold mb-2">...ou cole o Link Direto do PDF</label>
            <input 
              type="url" 
              placeholder="https://site.com/edital.pdf"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (e.target.value) setFile(null);
              }}
              className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={isUploading || !!progressData || (!file && !url)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
          >
            {isUploading ? 'Enviando...' : 'Gerar Edital Verticalizado'}
          </button>
        </form>
      )}

      {progressData && !checklist && (
        <div className="w-full max-w-lg mt-4 px-4 animate-in fade-in zoom-in-95 duration-500">
          <ProgressBar progress={progressData.progress} message={progressData.message} />
        </div>
      )}

      {checklist && (
        <div className="w-full max-w-4xl bg-surface border border-gray-800 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
            <h3 className="text-2xl font-bold text-white">Seu Checklist Priorizado</h3>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
              {cargo}
            </span>
          </div>

          <div className="space-y-6">
            {checklist.map((disc, dIdx) => (
              <div key={dIdx} className="bg-background rounded-xl p-5 border border-gray-800">
                <h4 className="text-xl font-bold text-gray-200 mb-4">{disc.disciplina}</h4>
                <div className="space-y-3">
                  {disc.topicos.map((topico, tIdx) => (
                    <div key={tIdx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface/50 p-4 rounded-lg hover:bg-surface transition-colors group gap-4">
                      
                      <div className="flex items-start sm:items-center gap-4 flex-1">
                        <span className={`font-medium transition-colors ${topico.revisado ? 'text-gray-500 line-through' : topico.estudado ? 'text-green-400' : 'text-gray-300 group-hover:text-white'}`}>
                          {topico.assunto}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm px-3 py-1.5 rounded-full bg-gray-800 text-gray-400 whitespace-nowrap border border-gray-700">
                          {topico.prioridade}
                        </span>
                        
                        <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border border-gray-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!topico.estudado}
                              onChange={() => handleToggleProgress(dIdx, tIdx, 'estudado', !!topico.estudado)}
                              className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500/50 bg-surface cursor-pointer" 
                            />
                            <span className={`text-xs font-bold ${topico.estudado ? 'text-blue-400' : 'text-gray-500'}`}>ESTUDADO</span>
                          </label>
                          
                          <div className="w-px h-4 bg-gray-700 mx-1"></div>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!topico.revisado}
                              onChange={() => handleToggleProgress(dIdx, tIdx, 'revisado', !!topico.revisado)}
                              disabled={!topico.estudado}
                              className="w-4 h-4 rounded border-gray-600 text-green-500 focus:ring-green-500/50 bg-surface cursor-pointer disabled:opacity-50" 
                            />
                            <span className={`text-xs font-bold ${topico.revisado ? 'text-green-400' : 'text-gray-500'} ${!topico.estudado && 'opacity-50'}`}>REVISADO</span>
                          </label>
                        </div>

                        <button 
                          onClick={() => handleGenerateMindMap(topico.assunto, topico.prioridade)}
                          className="bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all opacity-0 sm:group-hover:opacity-100"
                        >
                          Gerar Aula →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
