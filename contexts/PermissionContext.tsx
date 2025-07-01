import React, { createContext, useContext } from 'react';
import { TeamMember, Role, Permission } from '../types';

interface PermissionContextType {
  currentUser: TeamMember;
  roles: Role[];
  userRole: Role | undefined;
  hasPermission: (permission: Permission) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: React.ReactNode;
  currentUser: TeamMember | null;
  roles: Role[];
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children, currentUser, roles }) => {
  if (!currentUser) {
    // This can happen briefly during logout or before login.
    // Render nothing or a loader, but don't crash.
    return null;
  }
  
  const userRole = roles.find(role => role.id === currentUser.roleId);

  const hasPermission = (permission: Permission): boolean => {
    return userRole?.permissions.includes(permission) ?? false;
  };

  const value = {
    currentUser,
    roles,
    userRole,
    hasPermission,
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};
