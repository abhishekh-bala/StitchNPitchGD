import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import RandomGuideSelector from './components/RandomGuideSelector';
import PasswordModal from './components/PasswordModal';
import WinnerDisplay from './components/WinnerDisplay';
import WinnerHistory from './components/WinnerHistory';
import WinHistoryDashboard from './components/WinHistoryDashboard';
import ExportData from './components/ExportData';
import BackupRestore from './components/BackupRestore';
import ConfettiAnimation from './components/ConfettiAnimation';
import FailAnimation from './components/FailAnimation';
import DynamicOrbs from './components/DynamicOrbs';
import Navigation from './components/Navigation';
import { Guide, Winner, ADMIN_PASSWORD } from './config/data';

type AppTab = 'selection' | 'winners';

function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('selection');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFailAnimation, setShowFailAnimation] = useState(false);
  const [failedGuideName, setFailedGuideName] = useState('');
  const [loading, setLoading] = useState(true);
  
  // New modal states
  const [isWinHistoryDashboardOpen, setIsWinHistoryDashboardOpen] = useState(false);
  const [isExportDataOpen, setIsExportDataOpen] = useState(false);
  const [isBackupRestoreOpen, setIsBackupRestoreOpen] = useState(false);

  // Load winners from Supabase on component mount
  useEffect(() => {
    loadWinners();
  }, []);

  const loadWinners = async () => {
    try {
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .order('created_at', { ascending: true }); // Changed to ascending order

      if (error) {
        console.error('Error loading winners:', error);
        // Fallback to localStorage if Supabase fails
        const savedWinners = localStorage.getItem('stitchAndPitchWinners');
        if (savedWinners) {
          const localWinners = JSON.parse(savedWinners);
          // Sort local winners by timestamp in ascending order
          localWinners.sort((a: Winner, b: Winner) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setWinners(localWinners);
        }
      } else {
        setWinners(data || []);
        // Also sync to localStorage as backup
        localStorage.setItem('stitchAndPitchWinners', JSON.stringify(data || []));
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const savedWinners = localStorage.getItem('stitchAndPitchWinners');
      if (savedWinners) {
        const localWinners = JSON.parse(savedWinners);
        // Sort local winners by timestamp in ascending order
        localWinners.sort((a: Winner, b: Winner) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setWinners(localWinners);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveWinnerToDatabase = async (winner: Winner) => {
    try {
      const { data, error } = await supabase
        .from('winners')
        .insert([{
          guide_id: winner.id || winner.guide_id,
          name: winner.name,
          department: winner.department,
          supervisor: winner.supervisor,
          timestamp: winner.timestamp
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving winner to database:', error);
        // Fallback to localStorage
        const updatedWinners = [...winners, winner].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setWinners(updatedWinners);
        localStorage.setItem('stitchAndPitchWinners', JSON.stringify(updatedWinners));
      } else {
        // Reload winners from database to get the latest data
        await loadWinners();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const updatedWinners = [...winners, winner].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setWinners(updatedWinners);
      localStorage.setItem('stitchAndPitchWinners', JSON.stringify(updatedWinners));
    }
  };

  const deleteWinnerFromDatabase = async (winnerId: string) => {
    try {
      const { error } = await supabase
        .from('winners')
        .delete()
        .eq('id', winnerId);

      if (error) {
        console.error('Error deleting winner from database:', error);
        // Fallback to localStorage
        const updatedWinners = winners.filter(winner => winner.id !== winnerId);
        setWinners(updatedWinners);
        localStorage.setItem('stitchAndPitchWinners', JSON.stringify(updatedWinners));
      } else {
        // Reload winners from database to get the latest data
        await loadWinners();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const updatedWinners = winners.filter(winner => winner.id !== winnerId);
      setWinners(updatedWinners);
      localStorage.setItem('stitchAndPitchWinners', JSON.stringify(updatedWinners));
    }
  };

  const purgeAllWinners = async () => {
    try {
      // Use a more specific delete query
      const { error } = await supabase
        .from('winners')
        .delete()
        .gte('created_at', '1900-01-01'); // Delete all records by using a date condition that matches all

      if (error) {
        console.error('Error purging winners from database:', error);
        // Try alternative delete method
        const { error: altError } = await supabase
          .from('winners')
          .delete()
          .not('id', 'is', null); // Delete all records where id is not null (which should be all records)
        
        if (altError) {
          console.error('Alternative purge method also failed:', altError);
          // Fallback to localStorage only
          setWinners([]);
          localStorage.removeItem('stitchAndPitchWinners');
          return;
        }
      }

      // Successfully purged from database
      setWinners([]);
      localStorage.removeItem('stitchAndPitchWinners');
      
      // Reload to confirm the purge worked
      await loadWinners();
      
    } catch (error) {
      console.error('Error connecting to database during purge:', error);
      // Fallback to localStorage
      setWinners([]);
      localStorage.removeItem('stitchAndPitchWinners');
    }
  };

  const handleRestoreWinners = async (restoredWinners: Winner[]) => {
    try {
      // First, purge existing data
      await purgeAllWinners();
      
      // Then insert restored data
      for (const winner of restoredWinners) {
        await saveWinnerToDatabase(winner);
      }
      
      // Reload to get fresh data
      await loadWinners();
    } catch (error) {
      console.error('Error restoring winners:', error);
      // Fallback to localStorage
      setWinners(restoredWinners);
      localStorage.setItem('stitchAndPitchWinners', JSON.stringify(restoredWinners));
    }
  };

  const handleGuideSelected = (guide: Guide) => {
    setSelectedGuide(guide);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordConfirm = async (action: 'pass' | 'fail') => {
    setIsPasswordModalOpen(false);
    
    if (action === 'pass' && selectedGuide) {
      // Create winner object
      const winner: Winner = {
        ...selectedGuide,
        timestamp: new Date().toISOString()
      };
      
      // Save to database
      await saveWinnerToDatabase(winner);
      setCurrentWinner(winner);
      setShowConfetti(true);
      
      // Winner display and confetti will stay until manually closed
    } else if (action === 'fail' && selectedGuide) {
      // Show fail animation
      setFailedGuideName(selectedGuide.name);
      setShowFailAnimation(true);
      
      // Fail animation will stay until manually closed
    }
    
    // Reset selected guide
    setSelectedGuide(null);
  };

  const handleCloseWinner = () => {
    setShowConfetti(false);
    setCurrentWinner(null);
  };

  const handleCloseFail = () => {
    setShowFailAnimation(false);
    setFailedGuideName('');
  };

  const validatePassword = (password: string): boolean => {
    return password === ADMIN_PASSWORD;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/stitch-n-pitch-logo.png" 
              alt="Stitch n Pitch Logo" 
              className="h-20 w-auto animate-pulse"
            />
          </div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Stitch n Pitch contest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Dynamic Orbs Background */}
      <DynamicOrbs />

      {/* Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onPurgeWinners={purgeAllWinners}
        winnerCount={winners.length}
        onOpenWinHistoryDashboard={() => setIsWinHistoryDashboardOpen(true)}
        onOpenExportData={() => setIsExportDataOpen(true)}
        onOpenBackupRestore={() => setIsBackupRestoreOpen(true)}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {currentTab === 'selection' && (
          <RandomGuideSelector 
            onGuideSelected={handleGuideSelected} 
            winners={winners}
          />
        )}

        {currentTab === 'winners' && (
          <WinnerHistory 
            winners={winners} 
            onPurgeWinners={purgeAllWinners}
            onDeleteWinner={deleteWinnerFromDatabase}
          />
        )}
      </div>

      {/* Winner Display Overlay */}
      {currentWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <WinnerDisplay
            winner={currentWinner}
            onBack={handleCloseWinner}
          />
        </div>
      )}

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setSelectedGuide(null);
        }}
        onConfirm={(action) => {
          const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
          if (passwordInput && validatePassword(passwordInput.value)) {
            handlePasswordConfirm(action);
          } else {
            alert('Invalid password. Access denied.');
          }
        }}
        guideName={selectedGuide?.name || ''}
      />

      {/* New Feature Modals */}
      <WinHistoryDashboard
        isOpen={isWinHistoryDashboardOpen}
        onClose={() => setIsWinHistoryDashboardOpen(false)}
        winners={winners}
      />

      <ExportData
        isOpen={isExportDataOpen}
        onClose={() => setIsExportDataOpen(false)}
        winners={winners}
      />

      <BackupRestore
        isOpen={isBackupRestoreOpen}
        onClose={() => setIsBackupRestoreOpen(false)}
        winners={winners}
        onRestoreWinners={handleRestoreWinners}
      />

      {/* Confetti Animation */}
      <ConfettiAnimation isActive={showConfetti} />

      {/* Fail Animation */}
      <FailAnimation 
        isActive={showFailAnimation} 
        guideName={failedGuideName}
        onClose={handleCloseFail}
      />
    </div>
  );
}

export default App;