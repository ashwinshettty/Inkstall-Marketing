import React from 'react';
import MainCard from '../../ui/MainCard';

const TaskManager = () => {
  const tasks = {
    todo: [
      {
        id: 1,
        description: 'Follow up 15 hot leads – Borivali',
        assignee: 'Nisha',
        due: 'Tomorrow',
      },
    ],
    inProgress: [
      {
        id: 2,
        description: 'Launch IGCSE Math Goregaon campaign',
        assignee: 'Rohit',
        due: 'Today',
      },
    ],
    pendingApproval: [
      {
        id: 3,
        description: 'Upload new creative set for IBDP',
        assignee: 'Priya',
        due: 'Friday',
      },
    ],
    completed: [
      {
        id: 4,
        description: 'Reconcile October Google invoices',
        assignee: 'Anita',
        due: 'Last Week',
      },
    ],
  };

  const columns = {
    'To Do': tasks.todo,
    'In Progress': tasks.inProgress,
    'Pending Approval': tasks.pendingApproval,
    'Completed': tasks.completed,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Task Manager</h2>
          <p className="text-gray-400 mt-2">
            Kanban-style view for campaigns, creatives and follow-ups.
          </p>
        </div>
        <button
          style={{ backgroundColor: '#FBBF24', color: '#1E293B' }}
          className="px-4 py-2 rounded-lg font-semibold text-sm"
        >
          + New Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(columns).map(([title, tasks]) => (
          <MainCard key={title} className="!bg-slate-800 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">{title}</h3>
              <span className="text-gray-400 text-sm bg-slate-700 px-2 py-1 rounded">
                {tasks.length} tasks
              </span>
            </div>
            <div className="space-y-4 flex-grow">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#05091B' }}
                >
                  <p className="text-white font-semibold text-sm">
                    {task.description}
                  </p>
                  <div className="flex justify-between text-gray-400 text-xs mt-2">
                    <span>Assignee: {task.assignee}</span>
                    <span>Due: {task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </MainCard>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
