
import React from 'react';
import { Check, Server, Layout } from 'lucide-react';
import { SubTask } from '../types';

interface SubTaskItemProps {
  sub: SubTask;
  onToggle: () => void;
  isV2: boolean;
}

export const SubTaskItem: React.FC<SubTaskItemProps> = ({ sub, onToggle, isV2 }) => {
  const isApi = sub.name.startsWith("API:") || sub.name.includes("Backend") || sub.name.includes("DB:");

  return (
    <div
      onClick={onToggle}
      className={`group flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all ml-4 border-l-2 ${
        sub.completed 
          ? 'border-emerald-500/30 bg-emerald-900/5 text-slate-500' 
          : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50 text-slate-300'
      } ${isV2 ? 'opacity-70' : ''}`}
    >
      <div className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
        sub.completed 
          ? 'bg-emerald-600 border-emerald-600' 
          : 'bg-slate-900 border-slate-600 group-hover:border-indigo-400' 
      }`}>
        {sub.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
      </div>

      <div className="text-slate-600">
        {isApi ? <Server className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
      </div>

      <span className={`text-sm ${sub.completed ? 'line-through decoration-slate-600/50' : ''}`}>
        {sub.name}
      </span>
    </div>
  );
};
