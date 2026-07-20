import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');

  return (
    <form 
      className="w-full max-w-2xl relative group"
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim() && !isLoading) onSearch(query);
      }}
    >
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <svg className="w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        type="text"
        value={query}
        disabled={isLoading}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ex: Princípios da Administração Pública"
        className="w-full bg-surface/80 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 rounded-full py-5 pl-16 pr-44 text-white text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all shadow-xl disabled:opacity-50"
      />
      <button 
        type="submit"
        disabled={isLoading || !query.trim()}
        className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-primary transition-all px-8 rounded-full font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando...
          </>
        ) : 'Gerar Mapa'}
      </button>
    </form>
  );
}
