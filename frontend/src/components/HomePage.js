import React, { useState, useMemo, useEffect } from 'react';
import { Plus, BarChart3, Target } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import HabitCard from './HabitCard';
import HabitModal from './HabitModal';
import StatisticsModal from './StatisticsModal';
import '../App.css';

function HomePage() {
  const {
    habits,
    totalHabits,
    loading,
    error,
    showStatsModal,
    openStatsModal,
    showEditModal,
    hideEditModal,
    createHabit,
    updateHabit,
    selectedHabit,
    loadHabits,
    loading: habitLoading,
    deleteHabit,
  } = useHabits();

  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    loadHabits(pageSize, page * pageSize);
  }, [loadHabits, page]);

  const totalPages = Math.ceil(totalHabits / pageSize);

  const editInitialData = useMemo(() => (
    selectedHabit
      ? { name: selectedHabit.name, description: selectedHabit.description }
      : { name: '', description: '' }
  ), [selectedHabit]);

  // Open create modal
  const handleOpenCreate = () => setShowCreate(true);
  // Close create modal
  const handleCloseCreate = () => setShowCreate(false);

  // Create habit and refresh list
  const handleCreateHabit = async (data) => {
    await createHabit(data, page, pageSize);
    setShowCreate(false);
  };

  // Update habit and refresh list
  const handleUpdateHabit = async (id, data) => {
    await updateHabit(id, data, page, pageSize);
    hideEditModal();
  };

  // Delete habit and refresh list
  const handleDeleteHabit = async (id) => {
    await deleteHabit(id, page, pageSize);
  };

  // After deletion, refresh and handle empty page
  useEffect(() => {
    if (!loading && habits.length === 0 && page > 0) {
      setPage(page - 1);
    }
  }, [habits, loading, page]);

  return (
    <div>
        <div >
              <div className="container">
                {/* Action Bar */}
                <div className="action-bar">
                  <div className="action-left">
                    <button onClick={handleOpenCreate} className="btn-primary flex gap-2">
                      <Plus size={16}  className='mx-3 mt-1' />
                      Add Habit
                    </button>
                  </div>
                  <div className="action-right">
                    <button 
                      onClick={openStatsModal} 
                      className={`flex gap-2 btn-secondary ${showStatsModal ? 'active' : ''}`}
                    >
                      <BarChart3 size={16} className='mx-3 mt-1' />
                      Statistics
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading habits...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="error-container">
                    <p className="error-message">Error: {error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">
                      Retry
                    </button>
                  </div>
                )}

                {/* Habits Grid */}
                {!loading && !error && (
                  <div className="habits-container">
                    {habits.length === 0 ? (
                      <div className="empty-state">
                        <Target size={48} className="empty-icon" />
                        <h3>No habits yet</h3>
                        <p>Start building your habits by creating your first one!</p>
                        <button onClick={handleOpenCreate} className="btn-primary">
                          <Plus size={16} />
                          Create Your First Habit
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="habits-grid">
                          {habits.map(habit => (
                            <HabitCard key={habit.id} habit={habit} onDelete={handleDeleteHabit} />
                          ))}
                        </div>
                        <div className="pagination flex justify-center items-center gap-4 mt-6">
                          <button
                            className="btn-secondary"
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                          >
                            Prev
                          </button>
                          <span>{page + 1} of {totalPages}</span>
                          <button
                            className="btn-secondary"
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                          >
                            Next
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modals */}
            <HabitModal
              open={showCreate}
              mode="create"
              onClose={handleCloseCreate}
              onSubmit={handleCreateHabit}
              loading={habitLoading}
              initialData={{ name: '', description: '' }}
            />
            <HabitModal
              open={showEditModal && !!selectedHabit}
              mode="edit"
              onClose={hideEditModal}
              onSubmit={data => handleUpdateHabit(selectedHabit?.id, data)}
              loading={habitLoading}
              initialData={editInitialData}
              stats={selectedHabit}
            />
            <StatisticsModal />
    </div>
  );
}

export default HomePage; 