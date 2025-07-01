import React, { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { XMarkIcon } from './icons/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: TeamMember) => void;
  currentUser: TeamMember;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
  const [name, setName] = useState(currentUser.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setPassword('');
      setConfirmPassword('');
      setError(null);
    }
  }, [isOpen, currentUser]);

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    const updatedUser: TeamMember = {
      ...currentUser,
      name,
      // Only update password if a new one is provided
      password: password || currentUser.password,
    };
    onSave(updatedUser);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 relative">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
             <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
          </div>
         
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email (cannot be changed)</label>
              <input
                id="email"
                type="email"
                value={currentUser.email}
                disabled
                className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-3 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">New Password (optional)</label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            {error && (
                <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-md border border-red-500/30">
                    {error}
                </p>
            )}
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
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;