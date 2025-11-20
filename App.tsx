import React, { useState, useEffect, useCallback } from 'react';
import { AppView, ScanResult } from './types';
import { ICONS, APP_NAME, HISTORY_STORAGE_KEY } from './constants';
import Scanner from './components/Scanner';

// Utility to check valid URL
const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save history
  const addToHistory = (text: string) => {
    const newItem: ScanResult = {
      text,
      format: 'QR_CODE',
      timestamp: Date.now()
    };
    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  };

  const handleScan = (result: string) => {
    setCurrentResult(result);
    addToHistory(result);
    setView(AppView.RESULT);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copiado para área de transferência!");
    } catch (err) {
      showToast("Erro ao copiar.");
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const clearHistory = () => {
    if(window.confirm("Tem certeza que deseja limpar o histórico?")) {
      setHistory([]);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-dark flex flex-col transition-colors duration-300">
      
      {/* Main Content Container */}
      <main className="flex-1 flex flex-col relative max-w-lg mx-auto w-full bg-white dark:bg-surface shadow-2xl sm:min-h-[800px] sm:my-8 sm:rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <header className="p-6 flex justify-between items-center bg-white dark:bg-surface z-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
               {/* Small icon version */}
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4h-4v-5h5v-5h-6l2 3m5 2v-2h6l-2-2m2 6h-6M6 16H4m2 0V6h10" /></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{APP_NAME}</h1>
          </div>
          {view === AppView.HOME && (
            <button 
              onClick={() => setView(AppView.HISTORY)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
            >
              {ICONS.HISTORY}
            </button>
          )}
          {view !== AppView.HOME && (
             <button 
             onClick={() => setView(AppView.HOME)}
             className="text-sm font-semibold text-slate-500 hover:text-primary"
           >
             Voltar
           </button>
          )}
        </header>

        {/* View: HOME */}
        {view === AppView.HOME && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="mb-8 text-slate-300 dark:text-slate-600">
              {ICONS.QR}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              Leitor de QR Code
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs">
              Aponte a câmera para ler códigos instantaneamente. Rápido, seguro e funciona offline.
            </p>
            
            <button
              onClick={() => setView(AppView.SCANNER)}
              className="group relative w-full max-w-xs bg-primary hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 overflow-hidden"
            >
              {ICONS.CAMERA}
              <span>Iniciar Leitura</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            
            <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest">Versão PWA 1.0.0</p>
          </div>
        )}

        {/* View: SCANNER */}
        {view === AppView.SCANNER && (
          <Scanner 
            onScan={handleScan} 
            onClose={() => setView(AppView.HOME)} 
          />
        )}

        {/* View: RESULT */}
        {view === AppView.RESULT && currentResult && (
          <div className="flex-1 flex flex-col p-6 animate-slide-up">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 mb-6 border border-slate-100 dark:border-slate-600 shadow-inner">
              <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">Conteúdo Detectado</span>
              <p className="text-lg text-slate-800 dark:text-slate-100 break-words font-mono leading-relaxed">
                {currentResult}
              </p>
            </div>

            <div className="grid gap-4">
              {isValidUrl(currentResult) && (
                <a 
                  href={currentResult} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-3.5 rounded-xl hover:opacity-90 transition shadow-md"
                >
                  {ICONS.EXTERNAL_LINK} Abrir Link
                </a>
              )}
              
              <button 
                onClick={() => copyToClipboard(currentResult)}
                className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-semibold py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition"
              >
                {ICONS.COPY} Copiar Texto
              </button>

              <button 
                onClick={() => {
                  setCurrentResult(null);
                  setView(AppView.SCANNER);
                }}
                className="mt-4 text-primary font-semibold text-sm hover:underline"
              >
                Ler outro código
              </button>
            </div>
          </div>
        )}

        {/* View: HISTORY */}
        {view === AppView.HISTORY && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pb-2 flex justify-between items-end border-b border-slate-100 dark:border-slate-700/50">
               <span className="text-sm text-slate-500 dark:text-slate-400">{history.length} leituras recentes</span>
               {history.length > 0 && (
                 <button onClick={clearHistory} className="text-red-500 text-xs font-semibold p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                    Limpar
                 </button>
               )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 scroll-smooth">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p>Nenhum histórico ainda</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {history.map((item, idx) => (
                    <li key={idx} className="group p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition cursor-pointer" onClick={() => {
                        setCurrentResult(item.text);
                        setView(AppView.RESULT);
                    }}>
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium line-clamp-2 break-all">
                          {item.text}
                        </p>
                        <span className="text-xs text-slate-400 whitespace-nowrap ml-4 shrink-0">
                          {new Date(item.timestamp).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                         <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${isValidUrl(item.text) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                           {isValidUrl(item.text) ? 'LINK' : 'TEXTO'}
                         </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-fade-in-up z-50 whitespace-nowrap">
            {toast}
          </div>
        )}

      </main>
    </div>
  );
};

export default App;