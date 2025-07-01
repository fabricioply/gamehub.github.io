import React from 'react';
import Column from './Column';
import AddColumn from './AddColumn';
import { Task, TeamMember, Column as ColumnType, Permission } from '../types';
import { usePermissions } from '../hooks/usePermissions';

interface BoardProps {
  columns: ColumnType[];
  tasks: Task[];
  team: TeamMember[];
  onMoveTask: (taskId: string, newColumn: string) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddColumn: (title: string) => void;
}

const Board: React.FC<BoardProps> = ({
  columns,
  tasks,
  team,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
  onAddColumn,
}) => {
  const { hasPermission } = usePermissions();

  return (
    <div className="flex gap-6 overflow-x-auto p-2 pb-4">
      {columns.map(({ id, title }) => (
        <Column
          key={id}
          columnId={id}
          title={title}
          tasks={tasks.filter(task => task.column === id)}
          team={team}
          onMoveTask={onMoveTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          columns={columns}
        />
      ))}
      {hasPermission(Permission.ManageColumns) && (
        <AddColumn onAddColumn={onAddColumn} />
      )}
    </div>
  );
};

export default Board;