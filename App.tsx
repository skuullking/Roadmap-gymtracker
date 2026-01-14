
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, TrendingUp, Layers, Database, Lock } from 'lucide-react';
import { Task, Stats, Priority } from './types';
import { INITIAL_DATA } from './constants';
import { TaskCard } from './components/TaskCard';

const STORAGE_KEY = 'gymtracker_roadmap_v2';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const toggleSubtask = useCallback((parentId: number, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === parentId) {
        return {
          ...task,
          subtasks: task.subtasks.map(sub =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          )
        };
      }
      return task;
    }));
  }, []);

  const toggleAccordion = useCallback((parentId: number) => {
    setTasks(prev => prev.map(task =>
      task.id === parentId ? { ...task, isOpen: !task.isOpen } : task
    ));
  }, []);

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
    <div className="min-h-screen pb-32">
      {/* Header Section */}
      <header className="sticky top-0 z-30 bg-[#0f172a]/85 backdrop-blur-xl border-b border-slate-800/60 shadow-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight italic text-indigo-50">GymTracker</h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Master Plan | Roadmap</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500 leading-none">
                {stats.percentage}%
              </div>
              <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">
                Avancement Global (V1)
              </div>
            </div>
          </div>

          <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className="absolute h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.4)]"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            <span>{stats.completedSubtasks} sous-tâches validées</span>
            <span className="text-indigo-400">Reste: {stats.totalSubtasks - stats.completedSubtasks}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-16">
        
        {/* Priority Sections */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-wider">P1 - Cœur de Projet (MVP)</h2>
          </div>
          <div className="grid gap-4">
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
          <div className="flex items-center gap-2 text-blue-400 pt-10 border-t border-slate-800/50 mb-2">
            <Layers className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-wider">P2 - Rétention & Social</h2>
          </div>
          <div className="grid gap-4">
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
          <div className="flex items-center gap-2 text-orange-400 pt-10 border-t border-slate-800/50 mb-2">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-wider">P3 - Avancé & Data</h2>
          </div>
          <div className="grid gap-4">
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
          <div className="flex items-center gap-2 text-slate-500 pt-10 border-t border-slate-800/50 mb-2">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-wider">V2 / Futur (Hors Scope)</h2>
          </div>
          <div className="grid gap-4">
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

      {/* Footer Nav / Branding */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-6 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          <div>GymTracker Master Plan &copy; 2024</div>
          <div className="flex gap-4">
            <span className="text-indigo-400">Productive Stack</span>
            <span>Build 1.4.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
