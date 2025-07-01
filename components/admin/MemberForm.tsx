import React, { useState, useEffect } from 'react';
import { TeamMember, Role } from '../../types';
import { XMarkIcon } from '../icons/Icons';

interface MemberFormProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (memberData: Omit<TeamMember, 'id'>) => void;
    onUpdate: (member: TeamMember) => void;
    roles: Role[];
    member?: TeamMember;
}

const MemberForm: React.FC<MemberFormProps> = ({ isOpen, onClose, onAdd, onUpdate, roles, member }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');

    useEffect(() => {
        if(member) {
            setName(member.name);
            setEmail(member.email);
            setRoleId(member.roleId);
            setPassword(''); // Don't show existing password
        } else {
            setName('');
            setEmail('');
            setPassword('');
            setRoleId(roles[0]?.id || '');
        }
    }, [member, roles]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || (!member && !password) || !roleId) {
            alert("Please fill all required fields.");
            return;
        }

        if (member) {
            onUpdate({
                ...member,
                name,
                email,
                roleId,
                password: password || member.password, // Only update password if new one is entered
            });
        } else {
            onAdd({
                name,
                email,
                roleId,
                password,
                avatar: `https://i.pravatar.cc/48?u=${email}`, // Generate avatar from email
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
                <form onSubmit={handleSubmit}>
                    <header className="p-4 flex justify-between items-center border-b border-slate-700">
                        <h3 className="text-xl font-bold">{member ? 'Edit Member' : 'Add New Member'}</h3>
                        <button type="button" onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
                    </header>
                    <main className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input type="password" placeholder={member ? "Leave blank to keep current password" : ""} value={password} onChange={e => setPassword(e.target.value)} required={!member} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                            <select value={roleId} onChange={e => setRoleId(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none">
                                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                    </main>
                    <footer className="bg-slate-900/50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white font-semibold transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold transition-colors">{member ? 'Save Changes' : 'Add Member'}</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default MemberForm;
