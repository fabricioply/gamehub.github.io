import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Task, TeamMember, Column, Permission } from '../types';
import { CATEGORY_COLORS } from '../constants';
import TaskModal from './TaskModal';
import { BrainIcon, SparklesIcon, TrashIcon } from './icons/Icons';
import { generateCreativeIdeas } from '../services/geminiService';
import { usePermissions } from '../hooks/usePermissions';

interface TaskCardProps {
  task: Task;
  team: TeamMember[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  columns: Column[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, team, onUpdateTask, onDeleteTask, columns }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIdeasLoading, setIsIdeasLoading] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  
  const assignee = team.find(member => member.id === task.assigneeId);
  const { currentUser, hasPermission } = usePermissions();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const categoryColor = CATEGORY_COLORS[task.category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  const canDelete = hasPermission(Permission.ManageAllTasks) || task.assigneeId === currentUser.id;

  const handleGenerateIdeas = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIdeasLoading(true);
    setGeneratedIdeas([]);
    const ideas = await generateCreativeIdeas(task);
    setGeneratedIdeas(ideas);
    setIsIdeasLoading(false);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
        onDeleteTask(task.id);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGeneratedIdeas([]); // Clear ideas when closing modal
  };

  return (
    <>
      <div
        ref={drag as any}
        onClick={handleOpenModal}
        className={`p-4 rounded-lg shadow-md border border-slate-700/50 bg-slate-800 cursor-pointer hover:bg-slate-700/80 transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-105' : 'opacity-100'
        }`}
      >
        <div className="flex justify-between items-start">
          <p className="text-base font-semibold text-gray-100 leading-tight mb-2">
            {task.title}
          </p>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${categoryColor}`}
          >
            {task.category}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {task.description}
        </p>

        {generatedIdeas.length > 0 && (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-purple-500/30">
            <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center">
              <SparklesIcon className="w-4 h-4 mr-2" /> AI Generated Ideas
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              {generatedIdeas.map((idea, index) => <li key={index}>{idea}</li>)}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            {assignee && (
              <img
                src={assignee.avatar}
                alt={assignee.name}
                className="w-8 h-8 rounded-full border-2 border-slate-600"
                title={assignee.name}
              />
            )}
            {!assignee && (
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-600 bg-slate-700 flex items-center justify-center" title="Unassigned">
                    <span className="text-slate-500 font-bold">?</span>
                </div>
            )}
            <button
                onClick={handleGenerateIdeas}
                disabled={isIdeasLoading}
                className="flex items-center space-x-2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 rounded-md text-purple-300 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isIdeasLoading ? (
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <BrainIcon className="w-4 h-4" />
                )}
                <span>{isIdeasLoading ? 'Thinking...' : 'Ideas'}</span>
            </button>
          </div>
           {canDelete && (
             <button onClick={handleDelete} className="p-2 rounded-full text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-colors" title="Delete Task">
                <TrashIcon className="w-4 h-4" />
             </button>
           )}
        </div>
      </div>
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={onUpdateTask}
          task={task}
          team={team}
          columns={columns}
        />
      )}
    </>
  );
};

export default TaskCard;