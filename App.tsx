
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Activity, TrendingUp, Layers, Database, Lock, Cloud, RefreshCw, Wifi, AlertCircle } from 'lucide-react';
import { Task, Stats, Priority } from './types';
import { INITIAL_DATA } from './constants';
import { TaskCard } from './components/TaskCard';

// Identifiant unique pour le partage global sur Vercel
const KV_BUCKET = 'gymtracker_pro_shared_v1';
const API_URL = `https://kvdb.io/6Z8q9X9YxR4z8U5V6W7A/${KV_BUCKET}`;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_DATA);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  
  const isInitialLoad = useRef(true);
  const lastUpdateFromSelf = useRef<number>(0);

  // --- LOGIQUE DE SYNCHRONISATION ---

  const fetchSharedData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur de récupération');
      const remoteData = await response.json();
      
      // On ne met à jour que si on n'a pas fait de changement localement il y a moins de 2 secondes
      if (Date.now() - lastUpdateFromSelf.current > 2000) {
        setTasks(remoteData);
        setLastSync(new Date());
        setError(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (isInitialLoad.current) {
        saveSharedData(INITIAL_DATA);
      }
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
    const interval = setInterval(fetchSharedData, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS UTILISATEUR ---

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
    <div className="min-h-screen pb-40">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight italic flex items-center gap-2">
                  GymTracker
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse">
                    <Wifi className="w-2 h-2 mr-1" /> Live Sync
                  </span>
                </h1>
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">Shared Roadmap Dashboard</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500 leading-none">
                {stats.percentage}%
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {isSyncing ? (
                  <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
                ) : error ? (
                  <AlertCircle className="w-3 h-3 text-red-400" />
                ) : (
                  <Cloud className="w-3 h-3 text-slate-500" />
                )}
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                  {error ? 'Erreur de sync' : isSyncing ? 'Envoi...' : `Sync: ${lastSync.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`}
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`max-w-4xl mx-auto px-6 py-10 space-y-16 transition-opacity duration-300 ${isSyncing ? 'opacity-80' : 'opacity-100'}`}>
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-red-400 mb-2 px-1">
            <TrendingUp className="w-4 h-4" />
            <h2 className="text-base font-black uppercase tracking-wider">P1 - Cœur de Projet (MVP)</h2>
          </div>
          <div className="grid gap-3">
            {groupedTasks.P1.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleSubtask={(sid) => toggleSubtask(task.id, sid)} 
                onToggleAccordion={() => toggleAccordion(task.id)} 
              />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-blue-400 pt-8 border-t border-slate-800/50 mb-2 px-1">
            <Layers className="w-4 h-4" />
            <h2 className="text-base font-black uppercase tracking-wider">P2 - Rétention & Social</h2>
          </div>
          <div className="grid gap-3">
            {groupedTasks.P2.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleSubtask={(sid) => toggleSubtask(task.id, sid)} 
                onToggleAccordion={() => toggleAccordion(task.id)} 
              />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-orange-400 pt-8 border-t border-slate-800/50 mb-2 px-1">
            <Database className="w-4 h-4" />
            <h2 className="text-base font-black uppercase tracking-wider">P3 - Avancé & Data</h2>
          </div>
          <div className="grid gap-3">
            {groupedTasks.P3.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleSubtask={(sid) => toggleSubtask(task.id, sid)} 
                onToggleAccordion={() => toggleAccordion(task.id)} 
              />
            ))}
          </div>
        </section>

        <section className="space-y-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-slate-500 pt-8 border-t border-slate-800/50 mb-2 px-1">
            <Lock className="w-4 h-4" />
            <h2 className="text-base font-black uppercase tracking-wider">V2 / Futur</h2>
          </div>
          <div className="grid gap-3">
            {groupedTasks.V2.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleSubtask={(sid) => toggleSubtask(task.id, sid)} 
                onToggleAccordion={() => toggleAccordion(task.id)} 
                isV2={true}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-4 px-4 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-[9px] text-slate-600 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
            Network Status: {error ? 'Offline / Error' : 'Global Shared Instance'}
          </div>
          <div className="flex gap-4">
            <span className="text-indigo-400">GymTracker Vercel Build</span>
            <span>v1.5.1-shared</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
