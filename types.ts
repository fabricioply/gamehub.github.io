export enum TaskCategory {
  Developer = 'Developer',
  Designer = 'Designer',
  MotionDesigner = 'Motion Designer',
  Writer = 'Writer',
  Producer = 'Producer',
  QA = 'QA Tester',
  Art = 'Art',
  Sound = 'Sound',
}

export enum Permission {
    AccessAdminDashboard = 'AccessAdminDashboard',
    ManageTeam = 'ManageTeam', // Invite, edit, delete users
    ManageRoles = 'ManageRoles', // Create, edit, delete roles
    ManageColumns = 'ManageColumns', // Add, edit, delete columns
    ManageAllTasks = 'ManageAllTasks', // Edit, delete any task
}

export type ColumnId = string;

export interface Column {
  id: ColumnId;
  title: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface TeamMember {
  id: string;
  name: string;
  roleId: string;
  avatar: string;
  email: string;
  password?: string; // For simulation; would be handled by a backend in a real app
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  column: ColumnId;
  category: TaskCategory;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title:string;
  };
}