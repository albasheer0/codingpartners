import React, { useState, useEffect } from 'react';
import { X, Plus, Edit } from 'lucide-react';

const HabitModal = ({
  open,
  mode = 'create', // 'create' or 'edit'
  initialData = { name: '', description: '' },
  loading = false,
  onClose = () => {}, // default to no-op
  onSubmit,
  stats = null // for edit mode
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(initialData);
      setErrors({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData.name, initialData.description]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Habit name must be less than 100 characters';
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSubmit(formData);
      setFormData({ name: '', description: '' });
      setErrors({});
      onClose();
    } catch (error) {
      // Error handled by parent
    }
  };

  const handleClose = () => {
    setFormData(initialData);
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {mode === 'edit' ? <Edit size={20} className="mr-2 text-primary-600" /> : <Plus size={20} className="mr-2 text-primary-600" />}
              {mode === 'edit' ? 'Edit Habit' : 'Create New Habit'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                id="habit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g., Morning Exercise"
                maxLength={100}
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="habit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`input-field resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g., 30 minutes of cardio or strength training"
                rows={3}
                maxLength={500}
                disabled={loading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Habit Stats Preview (edit mode only) */}
            {mode === 'edit' && stats && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Streak:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {stats.streak} day{stats.streak !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Completions:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {stats.completedDates?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Completed:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {stats.lastCompletedDate 
                        ? new Date(stats.lastCompletedDate).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(stats.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center flex flex-wrap items-center"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner mx-2"></div>
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {mode === 'edit' ? <Edit size={16} className="mx-2" /> : <Plus size={16} className="mx-2" />}
                    {mode === 'edit' ? 'Update Habit' : 'Create Habit'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HabitModal; 