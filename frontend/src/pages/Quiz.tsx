import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

interface QuizQuestion {
  id: string;
  statement: string;
  options: { letter: string; text: string }[];
  correct: string;
  explanation: string;
  bancaStyle: string;
  difficulty: string;
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/topics/${id}/quiz`);
        if (data?.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          // Mock se a IA ainda não gerou ou modo fallback
          setQuestions([
            {
              id: 'q_demo',
              statement: '[Demo] Qual a principal característica da banca FCC (Fundação Carlos Chagas) tradicionalmente?',
              options: [
                { letter: 'A', text: 'Cobrança excessiva de Doutrina' },
                { letter: 'B', text: 'Literalidade da lei (Lei Seca)' },
                { letter: 'C', text: 'Modelo Certo e Errado (uma errada anula uma certa)' },
                { letter: 'D', text: 'Jurisprudência internacional' }
              ],
              correct: 'B',
              explanation: 'Historicamente, a FCC foca bastante na literalidade da lei, embora venha evoluindo para casos práticos recentes.',
              bancaStyle: 'FCC',
              difficulty: 'easy'
            }
          ]);
        }
      } catch (err) {
        console.error(err);
        setQuestions([
          {
            id: 'q_error',
            statement: '[Erro] Não foi possível carregar as questões geradas pela IA no momento.',
            options: [
              { letter: 'A', text: 'Ok, tentarei novamente mais tarde.' }
            ],
            correct: 'A',
            explanation: 'Sempre responda A.',
            bancaStyle: 'UNKNOWN',
            difficulty: 'easy'
          }
        ])
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSelect = (letter: string) => {
    if (showAnswer) return;
    setSelectedLetter(letter);
  };

  const handleConfirm = () => {
    if (!selectedLetter) return;
    setShowAnswer(true);
    if (selectedLetter === questions[currentIdx].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedLetter(null);
      setShowAnswer(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl text-gray-400 animate-pulse font-medium">🤖 Gerando seu Simulado com IA...</div>;
  if (!questions.length) return <div className="text-center mt-20 text-xl text-red-400">Nenhuma questão encontrada para este tópico.</div>;

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 bg-surface p-12 rounded-3xl border border-gray-800 shadow-2xl max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-5xl mb-6 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
          🎯
        </div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Simulado Finalizado!</h2>
        <p className="text-2xl text-gray-300 mb-8">Sua pontuação: <strong className="text-green-400 font-bold">{score}</strong> de {questions.length}</p>
        
        <Link to={`/mindmap/${id}`} className="px-8 py-4 bg-primary hover:bg-primary/80 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105">
          Voltar para o Mapa Mental
        </Link>
      </div>
    );
  }

  const q = questions[currentIdx];
  const isCorrectSelected = selectedLetter === q.correct;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <Link to={`/mindmap/${id}`} className="text-gray-400 hover:text-white transition-colors bg-surface px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
          ← Voltar ao Mapa
        </Link>
        <span className="bg-surface px-5 py-2 rounded-xl border border-gray-800 text-primary font-bold shadow-sm">
          Questão {currentIdx + 1} de {questions.length}
        </span>
      </div>

      <div className="bg-surface rounded-3xl border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
        {/* Elemento de decoração */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10"></div>
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <span className="text-xs font-bold bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full uppercase tracking-wider">{q.bancaStyle}</span>
          <span className="text-xs font-bold bg-gray-700/50 text-gray-300 border border-gray-600 px-4 py-1.5 rounded-full capitalize">{q.difficulty}</span>
        </div>
        
        <h3 className="text-2xl leading-relaxed mb-10 font-semibold text-gray-50 relative z-10">{q.statement}</h3>

        <div className="flex flex-col gap-4 relative z-10">
          {q.options.map(opt => {
            const isSelected = selectedLetter === opt.letter;
            let btnClass = "text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-5 text-lg ";
            
            if (showAnswer) {
              if (opt.letter === q.correct) {
                btnClass += "bg-green-500/10 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.15)]";
              } else if (isSelected) {
                btnClass += "bg-red-500/10 border-red-500/50 text-red-200";
              } else {
                btnClass += "bg-surface/50 border-gray-800/50 text-gray-500 opacity-60";
              }
            } else {
              if (isSelected) {
                btnClass += "bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] transform scale-[1.01]";
              } else {
                btnClass += "bg-surface border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800/50";
              }
            }

            return (
              <button 
                key={opt.letter} 
                onClick={() => handleSelect(opt.letter)}
                className={btnClass}
              >
                <span className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-xl font-bold text-lg
                  ${(showAnswer && opt.letter === q.correct) ? 'bg-green-500 text-white shadow-lg' : 
                    (showAnswer && isSelected) ? 'bg-red-500 text-white' : 
                    (isSelected && !showAnswer) ? 'bg-primary text-white' : 
                    'bg-gray-800 text-gray-400 border border-gray-700'}
                `}>
                  {opt.letter}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            )
          })}
        </div>

        {showAnswer && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            <div className={`p-8 rounded-2xl border-2 ${isCorrectSelected ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
              <h4 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isCorrectSelected ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrectSelected ? '✅ Mandou bem! Resposta Correta' : '❌ Não foi dessa vez'}
              </h4>
              <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                <strong className="text-white">Explicação da Banca: </strong> 
                {q.explanation.replace(/\[QUEBRA\]/g, '\n')}
              </p>
            </div>
            
            <div className="mt-8 flex justify-end border-t border-gray-800 pt-8">
              <button onClick={handleNext} className="px-10 py-4 bg-primary hover:bg-primary/80 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 flex items-center gap-2">
                {currentIdx < questions.length - 1 ? 'Ir para Próxima Questão →' : 'Ver Resultado Final 🎉'}
              </button>
            </div>
          </div>
        )}

        {!showAnswer && (
          <div className="mt-10 flex justify-end border-t border-gray-800 pt-8 relative z-10">
            <button 
              onClick={handleConfirm}
              disabled={!selectedLetter}
              className="px-10 py-4 bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 disabled:transform-none flex items-center gap-2"
            >
              Confirmar Resposta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
