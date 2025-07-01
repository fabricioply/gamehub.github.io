import React, { useState, useEffect } from 'react';
import { Role, Permission } from '../../types';
import { PERMISSIONS } from '../../constants';
import { XMarkIcon } from '../icons/Icons';

interface RoleFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (role: Role) => void;
    role?: Role;
}

const RoleForm: React.FC<RoleFormProps> = ({ isOpen, onClose, onSave, role }) => {
    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState<Permission[]>([]);

    useEffect(() => {
        if(role) {
            setName(role.name);
            setPermissions(role.permissions);
        } else {
            setName('');
            setPermissions([]);
        }
    }, [role]);
    
    const handlePermissionChange = (permission: Permission, isChecked: boolean) => {
        if(isChecked) {
            setPermissions(prev => [...prev, permission]);
        } else {
            setPermissions(prev => prev.filter(p => p !== permission));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name) {
            alert("Role name is required.");
            return;
        }
        onSave({
            id: role?.id || `role-${Date.now()}`,
            name,
            permissions
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700">
                <form onSubmit={handleSubmit}>
                    <header className="p-4 flex justify-between items-center border-b border-slate-700">
                        <h3 className="text-xl font-bold">{role ? 'Edit Role' : 'Add New Role'}</h3>
                        <button type="button" onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
                    </header>
                    <main className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Role Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Permissions</label>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {PERMISSIONS.map(p => (
                                    <label key={p} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={permissions.includes(p)}
                                            onChange={e => handlePermissionChange(p, e.target.checked)}
                                            className="w-5 h-5 rounded text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-offset-slate-800"
                                        />
                                        <span className="text-gray-200">{p.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </main>
                    <footer className="bg-slate-900/50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white font-semibold transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold transition-colors">{role ? 'Save Changes' : 'Create Role'}</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default RoleForm;
