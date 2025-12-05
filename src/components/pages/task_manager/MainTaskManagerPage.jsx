import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainCard from '../../ui/MainCard';
import CreateTaskModal from './createTaskModal';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const TaskManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState({
    todo: [],
    accepted: [],
    inProgress: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch all tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${API_BASE_URL}/api/marketing/marketing-task`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Group tasks by status
        const groupedTasks = {
          todo: [],
          accepted: [],
          inProgress: [],
          completed: [],
        };

        response.data.tasks.forEach(task => {
          if (task.status === 'todo') {
            groupedTasks.todo.push(task);
          } else if (task.status === 'accepted') {
            groupedTasks.accepted.push(task);
          } else if (task.status === 'in-progress') {
            groupedTasks.inProgress.push(task);
          } else if (task.status === 'completed') {
            groupedTasks.completed.push(task);
          }
        });

        setTasks(groupedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.task-menu-container')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Format date for display
  const formatDueDate = (deadline) => {
    const date = new Date(deadline);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (date < today) {
      return 'Overdue';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const columns = {
    'To Do': tasks.todo,
    'Pending Approval': tasks.accepted,
    'In Progress': tasks.inProgress,
    'Completed': tasks.completed,
  };

  const handleTaskCreated = (newTask) => {
    // Refresh tasks after creating a new one
    fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    toast.info('Delete functionality coming soon!');
    setOpenMenuId(null);
  };

  const handleMarkAsCompleted = async (taskId) => {
    toast.info('Mark as completed functionality coming soon!');
    setOpenMenuId(null);
  };

  const handleEditTask = (taskId) => {
    // Find the task to edit
    const taskToEdit = Object.values(tasks)
      .flat()
      .find(task => task._id === taskId);
    
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setIsModalOpen(true);
    }
    setOpenMenuId(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Manager</h2>
          <p className="text-gray-400 mt-1">
            Kanban-style view for campaigns, creatives and follow-ups.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#FBBF24', color: '#1E293B' }}
          className="px-4 py-2 rounded-md font-medium"
        >
          + New Task
        </button>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg">Loading tasks...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(columns).map(([title, taskList]) => (
            <MainCard key={title} className="!bg-slate-800 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">{title}</h3>
                <span className="text-gray-400 text-sm bg-slate-700 px-2 py-1 rounded">
                  {taskList.length} tasks
                </span>
              </div>
              <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                {taskList.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-8">
                    No tasks
                  </div>
                ) : (
                  taskList.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 rounded-lg relative"
                      style={{ backgroundColor: '#05091B' }}
                    >
                      {/* Title and Menu */}
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold text-md flex-1 pr-2">
                          {task.title}
                        </h4>
                        
                        {/* Three Dot Menu */}
                        <div className="relative task-menu-container">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openMenuId === task._id && (
                            <div className="absolute left-auto right-0 mt-2 w-52 bg-white rounded-lg shadow-xl z-50 py-2 border border-gray-200">
                              <button
                                onClick={() => handleEditTask(task._id)}
                                className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Delete
                              </button>
                              <button
                                onClick={() => handleMarkAsCompleted(task._id)}
                                className="w-full px-4 py-2 text-left text-green-600 hover:bg-gray-100 flex items-center gap-3"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Mark as Completed
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Description */}
                      {task.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      {/* Created By */}
                      <p className="text-gray-500 text-sm italic mb-3">
                        Created by {task.createdByName || 'Unknown'}
                      </p>
                      
                      {/* Divider Line */}
                      <div className="border-t border-gray-700 mb-3"></div>
                      
                      {/* Assigned To and Priority Badges */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Assigned To Badge - Improved Style */}
                        <div className="bg-blue-500/30 rounded-full border border-blue-500 px-2 py-1 flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                            {task.assignedToName ? task.assignedToName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="text-white text-sm font-medium truncate pr-1">
                            {task.assignedToName || 'Unassigned'}
                          </span>
                        </div>
                        
                        {/* Priority Badge */}
                        <span 
                          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap shrink-0 ${
                            task.priority === 'high' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500' 
                              : task.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                              : 'bg-green-500/20 text-green-400 border border-green-500'
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </MainCard>
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null); // Reset editing task when closing
        }}
        onTaskCreated={handleTaskCreated}
        users={users}
        editTask={editingTask}
      />
    </div>
  );
};

export default TaskManager;
