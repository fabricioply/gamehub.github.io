import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { Task, TeamMember, ColumnId, Column as ColumnType } from '../types';

interface ColumnProps {
  columnId: ColumnId;
  title: string;
  tasks: Task[];
  team: TeamMember[];
  onMoveTask: (taskId: string, newColumn: ColumnId) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  columns: ColumnType[];
}

const Column: React.FC<ColumnProps> = ({ columnId, title, tasks, team, onMoveTask, onUpdateTask, onDeleteTask, columns }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => onMoveTask(item.id, columnId),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const getBackgroundColor = () => {
    if (isOver && canDrop) {
      return 'bg-slate-700/50';
    }
    return 'bg-slate-800/50';
  };

  return (
    <div className="w-[280px] sm:w-[320px] flex-shrink-0">
        <div
        ref={drop as any}
        className={`rounded-xl p-4 transition-colors duration-300 h-full flex flex-col ${getBackgroundColor()}`}
        >
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-slate-700 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-200">{title}</h2>
            <span className="bg-slate-700 text-gray-300 text-sm font-semibold px-2.5 py-0.5 rounded-full">
            {tasks.length}
            </span>
        </div>
        <div className="space-y-4 overflow-y-auto pr-1 flex-grow">
            {tasks.map(task => (
            <TaskCard 
                key={task.id} 
                task={task} 
                team={team}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                columns={columns}
            />
            ))}
        </div>
        </div>
    </div>
  );
};

export default Column;