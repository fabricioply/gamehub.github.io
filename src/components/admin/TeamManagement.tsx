import React, { useState } from 'react';
import { TeamMember, Role } from '../../types';
import { UserPlusIcon, PencilSquareIcon, TrashIcon } from '../icons/Icons';
import MemberForm from './MemberForm';

interface TeamManagementProps {
  team: TeamMember[];
  roles: Role[];
  onAddTeamMember: (memberData: Omit<TeamMember, 'id'>) => void;
  onUpdateTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (memberId: string) => void;
}

const TeamManagement: React.FC<TeamManagementProps> = (props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined);

  const openForm = (member?: TeamMember) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMember(undefined);
  };

  const handleDelete = (memberId: string, memberName: string) => {
    if(window.confirm(`Are you sure you want to delete ${memberName}? This will also unassign them from all tasks.`)) {
      props.onDeleteTeamMember(memberId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Team Members ({props.team.length})</h3>
        <button onClick={() => openForm()} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors">
          <UserPlusIcon className="w-5 h-5" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="bg-slate-900/50 rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.team.map(member => (
              <tr key={member.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                    <span>{member.name}</span>
                </td>
                <td className="px-6 py-4">{member.email}</td>
                <td className="px-6 py-4">{props.roles.find(r => r.id === member.roleId)?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openForm(member)} className="p-2 text-gray-400 hover:text-purple-400"><PencilSquareIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDelete(member.id, member.name)} className="p-2 text-gray-400 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isFormOpen && (
        <MemberForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onAdd={props.onAddTeamMember}
          onUpdate={props.onUpdateTeamMember}
          roles={props.roles}
          member={editingMember}
        />
      )}
    </div>
  );
};

export default TeamManagement;
