
import React from 'react';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles = {
    P1: "bg-red-500/10 text-red-400 border-red-500/20",
    P2: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    P3: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    V2: "bg-slate-800 text-slate-500 border-slate-700",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[priority] || styles.V2}`}>
      {priority}
    </span>
  );
};
