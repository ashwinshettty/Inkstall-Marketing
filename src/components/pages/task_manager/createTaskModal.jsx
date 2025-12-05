import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, users = [], editTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    points: 0,
    deadline: '',
    assignedToId: '',
    isOpenTask: false,
    checklist: [{ text: '', completed: false }],
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!editTask;

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editTask) {
        // Populate form with existing task data for editing
        setFormData({
          title: editTask.title || '',
          description: editTask.description || '',
          priority: editTask.priority || 'medium',
          points: editTask.points || 0,
          deadline: editTask.deadline ? new Date(editTask.deadline).toISOString().split('T')[0] : '',
          assignedToId: editTask.assignedToId || '',
          isOpenTask: editTask.isOpenTask || false,
          checklist: editTask.checklist && editTask.checklist.length > 0 
            ? editTask.checklist 
            : [{ text: '', completed: false }],
          attachments: [] // Don't populate attachments for edit mode
        });
      } else {
        // Reset form for create mode
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          points: 0,
          deadline: '',
          assignedToId: '',
          isOpenTask: false,
          checklist: [{ text: '', completed: false }],
          attachments: []
        });
      }
    }
  }, [isOpen, editTask]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index].text = value;
    setFormData(prev => ({
      ...prev,
      checklist: newChecklist
    }));
  };

  const addChecklistItem = () => {
    setFormData(prev => ({
      ...prev,
      checklist: [...prev.checklist, { text: '', completed: false }]
    }));
  };

  const removeChecklistItem = (index) => {
    if (formData.checklist.length <= 1) return;
    const newChecklist = formData.checklist.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      checklist: newChecklist
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      attachments: newAttachments
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.deadline) {
      toast.error('Deadline is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const marketingId = localStorage.getItem('marketingId');
      
      // Upload files to S3 and get URLs
      let fileUrls = [];
      if (formData.attachments.length > 0) {
        const uploadPromises = formData.attachments.map(async (file) => {
          const fileFormData = new FormData();
          fileFormData.append('photo', file);
          
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/api/s3-upload/photo`,
            fileFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          return uploadResponse.data.file.url;
        });
        
        fileUrls = await Promise.all(uploadPromises);
      }
      
      // Prepare task data
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        points: parseInt(formData.points, 10),
        deadline: formData.deadline,
        assignedToId: formData.assignedToId || undefined,
        isOpenTask: formData.isOpenTask,
        checklist: formData.checklist.filter(item => item.text.trim() !== ''),
      };

      // Add file URLs if new files were uploaded
      if (fileUrls.length > 0) {
        taskData.filesurl = isEditMode 
          ? [...(editTask.filesurl || []), ...fileUrls] // Append new files to existing ones
          : fileUrls;
      }

      // Add createdBy only for create mode
      if (!isEditMode) {
        taskData.createdBy = marketingId;
      }

      // Create or update task
      const response = isEditMode
        ? await axios.patch(
            `${API_BASE_URL}/api/marketing/marketing-task/${editTask._id}`,
            taskData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          )
        : await axios.post(
            `${API_BASE_URL}/api/marketing/marketing-task`,
            taskData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );

      if (response.data.success) {
        toast.success(isEditMode ? 'Task updated successfully!' : 'Task created successfully!');
        onTaskCreated(response.data.task);
        onClose();
      } else {
        toast.error(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} task`);
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} task:`, err);
      toast.error(err.response?.data?.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the task`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg px-4">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 py-2">
            <div className="flex justify-between items-center my-4">
                <h3 className="text-2xl font-semibold text-white">
                  {isEditMode ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                    type="button"
                    className="text-gray-400 hover:text-gray-300 text-4xl leading-none"
                    onClick={onClose}
                >
                    ×
                </button>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
            <div>
                <label htmlFor="title" className="block text-lg font-medium text-white">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md placeholder-gray-400"
                    placeholder="Enter task title"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-lg font-medium text-white">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md placeholder-gray-400"
                    placeholder="Enter task description"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="priority" className="block text-lg font-medium text-white">
                        Priority
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-md"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="points" className="block text-lg font-medium text-white">
                        Points
                    </label>
                    <input
                        type="number"
                        id="points"
                        name="points"
                        min="0"
                        value={formData.points}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md placeholder-gray-400"
                    />
                </div>

                <div>
                    <label htmlFor="deadline" className="block text-lg font-medium text-white">
                        Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="assignedToId" className="block text-lg font-medium text-white">
                        Assign To
                    </label>
                    <select
                        id="assignedToId"
                        name="assignedToId"
                        value={formData.assignedToId}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-slate-700 text-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-md"
                    >
                        <option value="">Unassigned</option>
                        {users.map(user => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center">
                    <label className="block text-lg font-medium text-white">
                        Checklist
                    </label>
                    <button
                        type="button"
                        onClick={addChecklistItem}
                        className="text-lg text-blue-400 hover:text-blue-300"
                    >
                        + Add Item
                    </button>
                </div>
                <div className="mt-2 space-y-4">
                    {formData.checklist.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => handleChecklistChange(index, e.target.value)}
                            className="p-2 flex-1 rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md placeholder-gray-400"
                            placeholder={`Checklist item ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeChecklistItem(index)}
                            className="text-red-400 hover:text-red-300 text-2xl font-bold"
                            disabled={formData.checklist.length <= 1}
                          >
                            ×
                          </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-lg font-medium text-white">
                    Attachments
                </label>
                <div className="mt-2 flex items-center gap-3">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 rounded-md border-0 text-md font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Choose Files
                    </label>
                    {formData.attachments.length === 0 && (
                        <span className="text-gray-400 text-md">No file chosen</span>
                    )}
                </div>
                {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-md text-gray-300">Selected files:</p>
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 bg-slate-700 p-2 rounded-md">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <span className="text-white text-md truncate" title={file.name}>{file.name}</span>
                            <span className="text-gray-400 text-md whitespace-nowrap">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-400 hover:text-red-300 text-2xl font-bold shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                )}
            </div>
        </form>

        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-4 py-2">
                <div className="my-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center rounded-md border border-slate-600 bg-slate-700 py-2 px-4 text-lg font-medium text-gray-300 shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(e);
                        }}
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-lg font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSubmitting 
                          ? (isEditMode ? 'Updating...' : 'Creating...') 
                          : (isEditMode ? 'Update Task' : 'Create Task')
                        }
                    </button>
                </div>
            </div>
      </div>
    </div>
  ) : null;
};

export default CreateTaskModal;