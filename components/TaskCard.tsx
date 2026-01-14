
import React from 'react';
import { 
  Check, ChevronDown, ChevronRight, BarChart2, Calendar, FileText, 
  Calculator, HelpCircle, Bell, Database, Activity, Share2, Smartphone, WifiOff, HeartPulse 
} from 'lucide-react';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { SubTaskItem } from './SubTaskItem';

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (subtaskId: string) => void;
  onToggleAccordion: () => void;
  isV2?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggleSubtask, 
  onToggleAccordion, 
  isV2 = false 
}) => {
  const completedCount = task.subtasks.filter(s => s.completed).length;
  const totalCount = task.subtasks.length;
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
  const isFullyComplete = completedCount === totalCount && totalCount > 0;

  const getIcon = () => {
    const name = task.name.toLowerCase();
    if (name.includes("stats") || name.includes("gamification")) return <BarChart2 className="w-5 h-5" />;
    if (name.includes("calendrier")) return <Calendar className="w-5 h-5" />;
    if (name.includes("export") || name.includes("data")) return <FileText className="w-5 h-5" />;
    if (name.includes("outils") || name.includes("calculateur")) return <Calculator className="w-5 h-5" />;
    if (name.includes("onboarding") || name.includes("aide")) return <HelpCircle className="w-5 h-5" />;
    if (name.includes("paramètres")) return <Bell className="w-5 h-5" />;
    if (name.includes("social") || name.includes("partage")) return <Share2 className="w-5 h-5" />;
    if (name.includes("mobile")) return <Smartphone className="w-5 h-5" />;
    if (name.includes("hors-ligne")) return <WifiOff className="w-5 h-5" />;
    if (name.includes("santé") || name.includes("fit")) return <HeartPulse className="w-5 h-5" />;
    if (isFullyComplete) return <Check className="w-5 h-5" />;
    return <Database className="w-5 h-5" />;
  };

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
      isFullyComplete 
        ? 'bg-slate-900/40 border-slate-800/50' 
        : 'bg-slate-900 border-slate-700/50 shadow-lg shadow-black/20 hover:border-slate-600/50' 
      } ${isV2 ? 'opacity-70 grayscale-[0.5] border-slate-800 bg-slate-950/20' : ''}`}>
      
      <div
        onClick={onToggleAccordion}
        className="p-4 flex items-center justify-between cursor-pointer group hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-lg transition-colors ${
            isFullyComplete 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'
          }`}>
            {getIcon()}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className={`font-semibold text-base tracking-tight ${
                isFullyComplete ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-200'
              }`}>
                {task.name}
              </h3>
              <PriorityBadge priority={task.priority} />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isFullyComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-tighter">
                {completedCount} / {totalCount}
              </span>
            </div>
          </div>
        </div>

        <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
          {task.isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </div>

      {task.isOpen && (
        <div className="bg-slate-950/50 border-t border-slate-800/30 p-2 space-y-1">
          {task.subtasks.map(sub => (
            <SubTaskItem 
              key={sub.id} 
              sub={sub} 
              onToggle={() => onToggleSubtask(sub.id)} 
              isV2={isV2}
            />
          ))}
        </div>
      )}
    </div>
  );
};
