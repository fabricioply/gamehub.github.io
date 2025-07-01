import { TeamMember, Task, TaskCategory, Role, Permission, Column } from './types';

export const PERMISSIONS: Permission[] = Object.values(Permission);

export const INITIAL_ROLES: Role[] = [
    {
        id: 'role-admin',
        name: 'Admin',
        permissions: [
            Permission.AccessAdminDashboard,
            Permission.ManageTeam,
            Permission.ManageRoles,
            Permission.ManageColumns,
            Permission.ManageAllTasks,
        ]
    },
    {
        id: 'role-producer',
        name: 'Producer',
        permissions: [Permission.ManageColumns, Permission.ManageAllTasks]
    },
    {
        id: 'role-developer',
        name: 'Developer',
        permissions: []
    },
    {
        id: 'role-designer',
        name: 'Designer',
        permissions: []
    },
];


export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'dev-1', name: 'Alex', email: 'alex@gamedev.hub', password: 'password123', roleId: 'role-developer', avatar: 'https://i.pravatar.cc/48?u=dev-1' },
  { id: 'des-1', name: 'Mia', email: 'mia@gamedev.hub', password: 'password123', roleId: 'role-designer', avatar: 'https://i.pravatar.cc/48?u=des-1' },
  { id: 'mot-1', name: 'Leo', email: 'leo@gamedev.hub', password: 'password123', roleId: 'role-designer', avatar: 'https://i.pravatar.cc/48?u=mot-1' },
  { id: 'wri-1', name: 'Chloe', email: 'chloe@gamedev.hub', password: 'password123', roleId: 'role-developer', avatar: 'https://i.pravatar.cc/48?u=wri-1' },
  { id: 'pro-1', name: 'Ben', email: 'ben@gamedev.hub', password: 'adminpass', roleId: 'role-admin', avatar: 'https://i.pravatar.cc/48?u=pro-1' },
  { id: 'qa-1', name: 'Zoe', email: 'zoe@gamedev.hub', password: 'password123', roleId: 'role-developer', avatar: 'https://i.pravatar.cc/48?u=qa-1' },
];

export const INITIAL_COLUMNS: Column[] = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design main character concepts',
    description: 'Create 3-5 initial concept sketches for the protagonist, exploring different styles.',
    assigneeId: 'des-1',
    column: 'in-progress',
    category: TaskCategory.Designer,
  },
  {
    id: 'task-2',
    title: 'Develop player movement mechanics',
    description: 'Implement basic character controller for jumping, running, and crouching.',
    assigneeId: 'dev-1',
    column: 'in-progress',
    category: TaskCategory.Developer,
  },
  {
    id: 'task-3',
    title: 'Outline the first chapter of the story',
    description: 'Write a detailed outline for the game\'s opening chapter, including key plot points and character introductions.',
    assigneeId: 'wri-1',
    column: 'review',
    category: TaskCategory.Writer,
  },
  {
    id: 'task-4',
    title: 'Setup project repository and CI/CD',
    description: 'Initialize the Git repository and configure the continuous integration pipeline for automated builds.',
    assigneeId: 'dev-1',
    column: 'done',
    category: TaskCategory.Developer,
  },
  {
    id: 'task-5',
    title: 'Create title screen animation',
    description: 'Animate the game logo and title for the main menu screen.',
    assigneeId: 'mot-1',
    column: 'backlog',
    category: TaskCategory.MotionDesigner,
  },
   {
    id: 'task-6',
    title: 'Explore enemy AI behavior patterns',
    description: 'Research and prototype different AI patterns for basic enemy units.',
    assigneeId: null,
    column: 'backlog',
    category: TaskCategory.Developer,
  },
];

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  [TaskCategory.Developer]: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  [TaskCategory.Designer]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [TaskCategory.MotionDesigner]: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  [TaskCategory.Writer]: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  [TaskCategory.Producer]: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  [TaskCategory.QA]: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  [TaskCategory.Art]: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  [TaskCategory.Sound]: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
};