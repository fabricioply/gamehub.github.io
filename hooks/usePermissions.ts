import { usePermissionContext } from '../contexts/PermissionContext';

// This is a convenience hook to avoid importing useContext and PermissionContext everywhere.
export const usePermissions = () => {
  return usePermissionContext();
};
