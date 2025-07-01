import React, { useState } from 'react';
import { Role, TeamMember } from '../../types';
import { PERMISSIONS } from '../../constants';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '../icons/Icons';
import RoleForm from './RoleForm';

interface RoleManagementProps {
  roles: Role[];
  team: TeamMember[];
  onSaveRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
}

const RoleManagement: React.FC<RoleManagementProps> = (props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

  const openForm = (role?: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRole(undefined);
  };
  
  const handleDelete = (role: Role) => {
    const usersInRole = props.team.filter(m => m.roleId === role.id).length;
    if (usersInRole > 0) {
      alert(`Cannot delete role "${role.name}" as ${usersInRole} user(s) are assigned to it. Please re-assign them first.`);
      return;
    }
    if(window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      props.onDeleteRole(role.id);
    }
  };

  return (
     <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Roles & Permissions ({props.roles.length})</h3>
        <button onClick={() => openForm()} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors">
          <PlusCircleIcon className="w-5 h-5" />
          <span>Add Role</span>
        </button>
      </div>
      <div className="space-y-4">
        {props.roles.map(role => (
          <div key={role.id} className="bg-slate-900/50 rounded-lg border border-slate-700 p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-bold text-purple-300">{role.name}</h4>
              <div className="flex items-center space-x-2">
                 <span className="text-sm text-gray-400">{props.team.filter(m => m.roleId === role.id).length} users</span>
                 <button onClick={() => openForm(role)} className="p-2 text-gray-400 hover:text-purple-400"><PencilSquareIcon className="w-5 h-5"/></button>
                 {role.name !== 'Admin' && ( // Prevent deleting admin role
                    <button onClick={() => handleDelete(role)} className="p-2 text-gray-400 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                 )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {PERMISSIONS.map(permission => (
                    <div key={permission} className="flex items-center space-x-2">
                        <input type="checkbox" checked={role.permissions.includes(permission)} readOnly className="w-4 h-4 rounded text-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-600 cursor-not-allowed" />
                        <label className="text-sm text-gray-300">{permission.replace(/([A-Z])/g, ' $1').trim()}</label>
                    </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      
      {isFormOpen && (
        <RoleForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSave={props.onSaveRole}
          role={editingRole}
        />
      )}
    </div>
  );
};

export default RoleManagement;
