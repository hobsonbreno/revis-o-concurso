import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditalScanner from './pages/EditalScanner';
import MindMap from './pages/MindMap';
import Quiz from './pages/Quiz';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <header className="border-b border-gray-800 bg-surface/50 backdrop-blur-md sticky top-0 z-50 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent cursor-pointer" onClick={() => window.location.href='/'}>
              StudySystem
            </h1>
            <nav className="flex gap-4">
              <a href="/" className="text-gray-400 hover:text-white font-medium transition-colors">Gerador Livre</a>
              <a href="/edital" className="text-green-400 hover:text-green-300 font-medium transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Raio-X do Edital
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edital" element={<EditalScanner />} />
            <Route path="/mindmap/:id" element={<MindMap />} />
            <Route path="/quiz/:id" element={<Quiz />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;
