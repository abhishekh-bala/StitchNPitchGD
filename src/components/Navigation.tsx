import React, { useState } from 'react';
import { Trophy, Home, History, Trash2, X, AlertTriangle, BarChart3, Download, Database } from 'lucide-react';
import { PURGE_PASSWORD } from '../config/data';

interface NavigationProps {
  currentTab: 'selection' | 'winners';
  onTabChange: (tab: 'selection' | 'winners') => void;
  onPurgeWinners: () => void;
  winnerCount: number;
  onOpenWinHistoryDashboard: () => void;
  onOpenExportData: () => void;
  onOpenBackupRestore: () => void;
}

interface PurgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PurgeModal: React.FC<PurgeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PURGE_PASSWORD) {
      onConfirm();
      setPassword('');
      setError('');
    } else {
      setError('Invalid password. Access denied.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 bg-opacity-20 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="w-8 h-8 text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-white">Confirm Purge</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors bg-white bg-opacity-10 rounded-full p-2 hover:bg-opacity-20 backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white text-opacity-90 mb-4">
            This action will permanently delete all winners from the database. This cannot be undone.
          </p>
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="nav-purge-password" className="block text-sm font-medium text-white text-opacity-90 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              id="nav-purge-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-white placeholder-white placeholder-opacity-60 backdrop-blur-sm"
              placeholder="Enter admin password"
            />
            
            {error && (
              <div className="mt-3 p-3 bg-red-500 bg-opacity-20 border border-red-400 border-opacity-50 text-red-200 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-white bg-opacity-10 border border-white border-opacity-20 text-white rounded-xl hover:bg-opacity-20 transition-colors backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-red-600 bg-opacity-80 text-white rounded-xl hover:bg-opacity-90 transition-colors backdrop-blur-sm border border-red-500 border-opacity-50"
              >
                Purge All Winners
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  onPurgeWinners,
  winnerCount,
  onOpenWinHistoryDashboard,
  onOpenExportData,
  onOpenBackupRestore
}) => {
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);

  const handlePurgeClick = () => {
    setIsPurgeModalOpen(true);
  };

  const handlePurgeConfirm = () => {
    onPurgeWinners();
    setIsPurgeModalOpen(false);
  };

  const handleLogoClick = () => {
    onTabChange('selection');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-20 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <img 
                  src="/stitch-n-pitch-logo.png" 
                  alt="Stitch n Pitch Logo" 
                  className="h-12 w-12 rounded-xl object-cover drop-shadow-lg border-2 border-white border-opacity-30"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">Stitch n Pitch Portal</h1>
              </div>
            </button>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onTabChange('selection')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentTab === 'selection'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Selection</span>
              </button>

              <button
                onClick={() => onTabChange('winners')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all relative ${
                  currentTab === 'winners'
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Winners</span>
                {winnerCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {winnerCount}
                  </span>
                )}
              </button>

              {/* New Feature Buttons */}
              {winnerCount > 0 && (
                <>
                  <button
                    onClick={onOpenWinHistoryDashboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all"
                    title="Win History Dashboard"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Analytics</span>
                  </button>

                  <button
                    onClick={onOpenExportData}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all"
                    title="Export Data"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>

                  <button
                    onClick={onOpenBackupRestore}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all"
                    title="Backup & Restore"
                  >
                    <Database className="w-4 h-4" />
                    <span className="hidden sm:inline">Backup</span>
                  </button>
                </>
              )}

              {/* Purge Button - Only show in winners tab */}
              {currentTab === 'winners' && winnerCount > 0 && (
                <button
                  onClick={handlePurgeClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-300 hover:text-white hover:bg-red-600 transition-all"
                  title="Purge all winners"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Purge</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Purge Modal */}
      <PurgeModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirm={handlePurgeConfirm}
      />
    </>
  );
};

export default Navigation;