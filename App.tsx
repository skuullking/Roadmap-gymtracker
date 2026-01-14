
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Activity, TrendingUp, Layers, Database, Lock, Cloud, RefreshCw, 
  Wifi, AlertCircle, Download, Upload, Sparkles, ChevronRight, 
  BrainCircuit, Save
} from 'lucide-react';
import { Task, Stats, Priority } from './types';
import { INITIAL_DATA } from './constants';
import { TaskCard } from './components/TaskCard';
import { generateNextSteps } from './services/aiService';

// Identifiant unique pour le partage global
// Utilisation d'un bucket KV public persistant
const KV_BUCKET = 'gymtracker_pro_v3_shared';
const API_URL = `https://kvdb.io/6Z8q9X9YxR4z8U5V6W7A/${KV_BUCKET}`;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_DATA);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  
  const isInitialLoad = useRef(true);
  const lastUpdateFromSelf = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIQUE DE SYNCHRONISATION ---

  const fetchSharedData = async (force = false) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        if (response.status === 404) {
          // Si le bucket n'existe pas encore, on l'initialise
          saveSharedData(INITIAL_DATA);
          return;
        }
        throw new Error('Erreur de récupération');
      }
      const remoteData = await response.json();
      
      // On ne met à jour que si on n'a pas fait de changement localement récemment (anti-clignotement)
      // ou si c'est un refresh forcé
      if (force || Date.now() - lastUpdateFromSelf.current > 3000) {
        setTasks(remoteData);
        setLastSync(new Date());
        setError(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Mode hors-ligne ou erreur serveur");
    } finally {
      isInitialLoad.current = false;
    }
  };

  const saveSharedData = async (newData: Task[]) => {
    setIsSyncing(true);
    lastUpdateFromSelf.current = Date.now();
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error('Erreur de sauvegarde');
      setLastSync(new Date());
      setError(null);
    } catch (err) {
      setError("Erreur de synchronisation cloud");
      console.error("Save error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchSharedData();
    const interval = setInterval(() => fetchSharedData(), 8000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS IA ---

  const handleAskAi = async () => {
    setIsGeneratingAi(true);
    try {
      const advice = await generateNextSteps(tasks);
      setAiAdvice(advice);
    } catch (err) {
      setAiAdvice("L'IA est momentanément indisponible.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // --- GESTION JSON (EXPORT/IMPORT) ---

  const exportToJson = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `gymtracker-plan-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          setTasks(json);
          saveSharedData(json);
          alert("Importation réussie ! Les données ont été synchronisées avec le serveur.");
        }
      } catch (err) {
        alert("Erreur lors de la lecture du fichier JSON.");
      }
    };
    reader.readAsText(file);
  };

  // --- ACTIONS TASK ---

  const toggleSubtask = useCallback((parentId: number, subtaskId: string) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === parentId) {
          return {
            ...task,
            subtasks: task.subtasks.map(sub =>
              sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
            )
          };
        }
        return task;
      });
      saveSharedData(updated);
      return updated;
    });
  }, []);

  const toggleAccordion = useCallback((parentId: number) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === parentId ? { ...task, isOpen: !task.isOpen } : task
      );
      saveSharedData(updated); 
      return updated;
    });
  }, []);

  // --- STATISTIQUES ---

  const stats: Stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    tasks.forEach(t => {
      if (t.priority !== 'V2') {
        t.subtasks.forEach(st => {
          total++;
          if (st.completed) completed++;
        });
      }
    });
    return {
      totalSubtasks: total,
      completedSubtasks: completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  }, [tasks]);

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.priority].push(task);
      return acc;
    }, { P1: [], P2: [], P3: [], V2: [] } as Record<Priority, Task[]>);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 pb-32">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-indigo-500/10 shadow-2xl">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-start md:items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                  GYMTRACKER <span className="text-indigo-500">PRO</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border transition-colors ${error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {error ? <AlertCircle className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1 animate-pulse" />}
                    {error ? 'Offline' : 'Shared Hub'}
                  </span>
                </h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">Global Development Roadmap</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="text-4xl font-black tabular-nums tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                {stats.percentage}%
              </div>
              <div className="flex items-center gap-2">
                {isSyncing && <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />}
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  Last Update: {lastSync.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 relative h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
            <div 
              className="absolute h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(79,70,229,0.5)]"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10`}>
        
        {/* Left Column: Tasks */}
        <div className="lg:col-span-8 space-y-12">
          {/* AI Insights Card */}
          {aiAdvice && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit className="w-20 h-20 text-indigo-400" />
              </div>
              <div className="flex items-center gap-2 text-indigo-400 mb-3">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">IA Strategic Advice</h3>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed relative z-10 italic">
                "{aiAdvice}"
              </p>
              <button 
                onClick={() => setAiAdvice(null)}
                className="mt-4 text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest"
              >
                Ignorer le conseil
              </button>
            </div>
          )}

          {/* Task Sections */}
          <div className="space-y-16">
            <Section title="P1 - Cœur de Projet (MVP)" icon={<TrendingUp className="w-4 h-4" />} color="text-red-400">
              {groupedTasks.P1.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleSubtask={(sid) => toggleSubtask(task.id, sid)} 
                  onToggleAccordion={() => toggleAccordion(task.id)} 
                />
              ))}
            </Section>

            <Section title="P2 - Rétention & Social" icon={<Layers className="w-4 h-4" />} color="text-blue-400">
              {groupedTasks.P2.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleSubtask={(sid) => toggleSubtask(task.id, sid)} 
                  onToggleAccordion={() => toggleAccordion(task.id)} 
                />
              ))}
            </Section>

            <Section title="P3 - Avancé & Data" icon={<Database className="w-4 h-4" />} color="text-orange-400">
              {groupedTasks.P3.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleSubtask={(sid) => toggleSubtask(task.id, sid)} 
                  onToggleAccordion={() => toggleAccordion(task.id)} 
                />
              ))}
            </Section>

            <section className="opacity-50 hover:opacity-100 transition-opacity">
               <Section title="V2 / Futur" icon={<Lock className="w-4 h-4" />} color="text-slate-500">
                {groupedTasks.V2.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onToggleSubtask={(sid) => toggleSubtask(task.id, sid)} 
                    onToggleAccordion={() => toggleAccordion(task.id)} 
                    isV2={true}
                  />
                ))}
              </Section>
            </section>
          </div>
        </div>

        {/* Right Column: Controls & Stats Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-28 space-y-6">
            
            {/* Control Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-500" />
                Data Controls
              </h3>
              
              <div className="grid gap-3">
                <button 
                  onClick={handleAskAi}
                  disabled={isGeneratingAi}
                  className="w-full flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-5 h-5 ${isGeneratingAi ? 'animate-pulse' : ''}`} />
                    <span className="font-bold text-sm tracking-tight">Analyse IA MVP</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={exportToJson}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700"
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Export JSON</span>
                  </button>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Import JSON</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={importFromJson} 
                  />
                </div>

                <button 
                  onClick={() => fetchSharedData(true)}
                  className="w-full mt-2 flex items-center justify-center gap-2 p-3 text-slate-500 hover:text-indigo-400 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <RefreshCw className="w-3 h-3" />
                  Force Sync Now
                </button>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/10 rounded-2xl p-6">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Live Insights</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tasks Remaining</span>
                    <span className="text-xl font-black text-white tabular-nums">{stats.totalSubtasks - stats.completedSubtasks}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Core Tasks (P1)</span>
                    <span className="text-xl font-black text-emerald-400 tabular-nums">
                      {groupedTasks.P1.reduce((acc, t) => acc + t.subtasks.filter(s => s.completed).length, 0)} / {groupedTasks.P1.reduce((acc, t) => acc + t.subtasks.length, 0)}
                    </span>
                  </div>
               </div>
            </div>

          </div>
        </aside>
      </main>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/50 py-3 px-6 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-[9px] text-slate-500 uppercase tracking-widest font-black">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
              Network: {error ? 'Sync Error' : 'Active Channel'}
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-3 h-3" />
              Storage: KVDB.IO Persistence
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-indigo-500 underline underline-offset-4 cursor-help">Documentation v1.5.2</span>
            <span>Ref: {KV_BUCKET}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Fixed Section component props to properly handle children in a way that satisfies TypeScript checks
function Section({ title, icon, color, children }: { title: string, icon: React.ReactNode, color: string, children?: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className={`flex items-center gap-3 ${color} mb-2 px-1`}>
        {icon}
        <h2 className="text-base font-black uppercase tracking-[0.15em]">{title}</h2>
        <div className={`h-px flex-1 bg-current opacity-10 ml-2`}></div>
      </div>
      <div className="grid gap-4">
        {children}
      </div>
    </section>
  );
}
