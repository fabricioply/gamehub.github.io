import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from './components/Header';
import Board from './components/Board';
import Login from './components/Login';
import SettingsModal from './components/SettingsModal';
import AdminDashboard from './components/admin/AdminDashboard';
import TaskModal from './components/TaskModal';
import { Task, TeamMember, Column, Role, TaskCategory } from './types';
import { TEAM_MEMBERS, INITIAL_TASKS, INITIAL_COLUMNS, INITIAL_ROLES } from './constants';
import { PermissionProvider } from './contexts/PermissionContext';

// A simple hook to manage state with localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}


const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', INITIAL_TASKS);
  const [team, setTeam] = useLocalStorage<TeamMember[]>('team', TEAM_MEMBERS);
  const [columns, setColumns] = useLocalStorage<Column[]>('columns', INITIAL_COLUMNS);
  const [roles, setRoles] = useLocalStorage<Role[]>('roles', INITIAL_ROLES);
  
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // If a user was logged in, find their latest data from the `team` state
    if (currentUser) {
      const updatedCurrentUser = team.find(member => member.id === currentUser.id);
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
      } else {
        // User might have been deleted, log them out
        handleLogout();
      }
    }
  }, [team]);


  const handleLogin = (email: string, password: string) => {
    const user = team.find(
      member => member.email.toLowerCase() === email.toLowerCase() && member.password === password
    );

    if (user) {
      setCurrentUser(user);
      setLoginError(null);
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminDashboardOpen(false);
  };
  
  const handleUpdateUser = (updatedUser: TeamMember) => {
    setTeam(prevTeam => prevTeam.map(member => member.id === updatedUser.id ? updatedUser : member));
    if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
    setIsSettingsModalOpen(false);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id'>) => {
    setTasks(prevTasks => [
      ...prevTasks,
      { ...newTaskData, id: `task-${Date.now()}` }
    ]);
    setIsCreateTaskModalOpen(false);
  };
  
  const moveTask = (taskId: string, newColumnId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, column: newColumnId } : task
      )
    );
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleAddColumn = (title: string) => {
    if (title) {
        const newColumn: Column = {
            id: `column-${Date.now()}`,
            title,
        };
        setColumns(prevColumns => [...prevColumns, newColumn]);
    }
  };

  // Admin Dashboard Handlers
  const handleSaveRole = (role: Role) => {
    setRoles(prev => {
        const existing = prev.find(r => r.id === role.id);
        if (existing) {
            return prev.map(r => r.id === role.id ? role : r);
        }
        return [...prev, { ...role, id: role.id || `role-${Date.now()}` }];
    });
  };

  const handleDeleteRole = (roleId: string) => {
      const defaultRole = roles.find(r => r.name === 'Developer') || roles[0];
      // Re-assign users with this role to a default role to prevent orphaned users
      setTeam(prevTeam => prevTeam.map(member => 
          member.roleId === roleId ? { ...member, roleId: defaultRole.id } : member
      ));
      setRoles(prev => prev.filter(r => r.id !== roleId));
  };

  const handleAddTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
      setTeam(prev => [...prev, { ...memberData, id: `member-${Date.now()}` }]);
  };
  
  const handleUpdateTeamMember = (member: TeamMember) => {
     setTeam(prev => prev.map(m => m.id === member.id ? member : m));
  };

  const handleDeleteTeamMember = (memberId: string) => {
    // Unassign this member from any tasks
    setTasks(prevTasks => prevTasks.map(task => 
        task.assigneeId === memberId ? { ...task, assigneeId: null } : task
    ));
    setTeam(prev => prev.filter(m => m.id !== memberId));
  };
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
     <PermissionProvider currentUser={currentUser} roles={roles}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-100 font-sans">
        <Header 
            onAddTaskClick={() => setIsCreateTaskModalOpen(true)}
            onLogout={handleLogout}
            onSettingsClick={() => setIsSettingsModalOpen(true)}
            onAdminClick={() => setIsAdminDashboardOpen(true)}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          <Board
            columns={columns}
            tasks={tasks}
            team={team}
            onMoveTask={moveTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddColumn={handleAddColumn}
          />
        </main>
        {isSettingsModalOpen && (
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={handleUpdateUser}
                currentUser={currentUser}
            />
        )}
        {isCreateTaskModalOpen && (
          <TaskModal
            isOpen={isCreateTaskModalOpen}
            onClose={() => setIsCreateTaskModalOpen(false)}
            onSave={handleAddTask}
            team={team}
            columns={columns}
          />
        )}
        {isAdminDashboardOpen && (
            <AdminDashboard
                isOpen={isAdminDashboardOpen}
                onClose={() => setIsAdminDashboardOpen(false)}
                team={team}
                roles={roles}
                onSaveRole={handleSaveRole}
                onDeleteRole={handleDeleteRole}
                onAddTeamMember={handleAddTeamMember}
                onUpdateTeamMember={handleUpdateTeamMember}
                onDeleteTeamMember={handleDeleteTeamMember}
            />
        )}
      </div>
     </PermissionProvider>
    </DndProvider>
  );
};

export default App;