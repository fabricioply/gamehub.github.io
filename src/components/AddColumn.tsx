import React, { useState } from 'react';
import { PlusCircleIcon } from './icons/Icons';

interface AddColumnProps {
  onAddColumn: (title: string) => void;
}

const AddColumn: React.FC<AddColumnProps> = ({ onAddColumn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddColumn(title.trim());
      setTitle('');
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="w-[280px] sm:w-[320px] flex-shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="w-full h-12 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-colors"
        >
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          Add another column
        </button>
      </div>
    );
  }

  return (
    <div className="w-[280px] sm:w-[320px] flex-shrink-0 bg-slate-800/80 rounded-xl p-3">
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          type="text"
          placeholder="Enter column title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => { if(!title) setIsEditing(false) }}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 mb-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold text-sm transition-colors"
          >
            Add column
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="p-2 text-slate-400 hover:text-white"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddColumn;