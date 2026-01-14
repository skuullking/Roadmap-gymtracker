
export type Priority = 'P1' | 'P2' | 'P3' | 'V2';

export interface SubTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface Task {
  id: number;
  name: string;
  priority: Priority;
  effort: number;
  isOpen: boolean;
  subtasks: SubTask[];
}

export interface Stats {
  totalSubtasks: number;
  completedSubtasks: number;
  percentage: number;
}
