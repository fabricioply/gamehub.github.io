import React, { useState, useEffect, useCallback } from 'react';
import { Task, TeamMember, TaskCategory, ColumnId, Column } from '../types';
import { enhanceDescription } from '../services/geminiService';
import { XMarkIcon, SparklesIcon } from './icons/Icons';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task | Omit<Task, 'id'>) => void;
  task?: Task;
  team: TeamMember[];
  columns: Column[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, team, columns }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.Developer);
  const [column, setColumn] = useState<ColumnId>(columns[0]?.id || 'backlog');
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setAssigneeId(task.assigneeId);
            setCategory(task.category);
            setColumn(task.column);
        } else {
            setTitle('');
            setDescription('');
            setAssigneeId(null);
            setCategory(TaskCategory.Developer);
            setColumn(columns[0]?.id || 'backlog');
        }
    }
  }, [task, isOpen, columns]);

  const handleSave = () => {
    if (!title) return;
    const taskData = {
      title,
      description,
      assigneeId,
      category,
      column,
    };
    if (task) {
      onSave({ ...taskData, id: task.id });
    } else {
      onSave(taskData);
    }
    onClose();
  };
  
  const handleEnhanceDescription = useCallback(async () => {
    if(!title) return;
    setIsEnhancing(true);
    const enhancedText = await enhanceDescription(title, description);
    setDescription(prev => `${prev}${prev ? '\n\n' : ''}**AI Enhancement:**\n${enhancedText}`);
    setIsEnhancing(false);
  }, [title, description]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 relative">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white mb-4">{task ? 'Edit Task' : 'Create New Task'}</h2>
             <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
          </div>
         
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg font-semibold"
            />
             <div className="relative">
              <textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
               <button 
                  onClick={handleEnhanceDescription}
                  disabled={isEnhancing || !title}
                  className="absolute bottom-3 right-3 flex items-center space-x-2 px-3 py-1 bg-purple-600/50 hover:bg-purple-600/80 rounded-md text-purple-200 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {isEnhancing ? (
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                    <SparklesIcon className="w-4 h-4" />
                   )}
                  <span>{isEnhancing ? 'Enhancing...' : 'Enhance'}</span>
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
                <select
                  value={assigneeId || ''}
                  onChange={(e) => setAssigneeId(e.target.value || null)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {team.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                 <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                   {Object.values(TaskCategory).map(cat => (
                     <option key={cat} value={cat}>{cat}</option>
                   ))}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                 <select
                  value={column}
                  onChange={(e) => setColumn(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!title}
          >
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;