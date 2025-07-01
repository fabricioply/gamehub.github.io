import React, { useState } from 'react';
import { XMarkIcon } from '../icons/Icons';
import TeamManagement from './TeamManagement';
import RoleManagement from './RoleManagement';
import { TeamMember, Role } from '../../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamMember[];
  roles: Role[];
  onSaveRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onAddTeamMember: (memberData: Omit<TeamMember, 'id'>) => void;
  onUpdateTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (memberId: string) => void;
}

type AdminTab = 'team' | 'roles';

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('team');

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-slate-700">
        <header className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <button onClick={props.onClose} className="p-1 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex flex-grow overflow-hidden">
          <nav className="w-48 border-r border-slate-700 p-4 flex-shrink-0">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`w-full text-left px-3 py-2 rounded-md font-semibold transition-colors ${activeTab === 'team' ? 'bg-purple-600 text-white' : 'hover:bg-slate-700 text-gray-300'}`}
                >
                  Team Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`w-full text-left px-3 py-2 rounded-md font-semibold transition-colors ${activeTab === 'roles' ? 'bg-purple-600 text-white' : 'hover:bg-slate-700 text-gray-300'}`}
                >
                  Role Management
                </button>
              </li>
            </ul>
          </nav>
          <main className="flex-grow p-6 overflow-y-auto">
            {activeTab === 'team' && (
              <TeamManagement
                team={props.team}
                roles={props.roles}
                onAddTeamMember={props.onAddTeamMember}
                onUpdateTeamMember={props.onUpdateTeamMember}
                onDeleteTeamMember={props.onDeleteTeamMember}
              />
            )}
            {activeTab === 'roles' && (
              <RoleManagement
                roles={props.roles}
                team={props.team}
                onSaveRole={props.onSaveRole}
                onDeleteRole={props.onDeleteRole}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
