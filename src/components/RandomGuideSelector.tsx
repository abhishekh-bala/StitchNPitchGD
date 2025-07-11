import React, { useState } from 'react';
import { Shuffle, User, Building, UserCheck, Trophy, Sparkles } from 'lucide-react';
import { Guide, getGuidesByDepartment, Winner } from '../config/data';
import DepartmentSelector from './DepartmentSelector';

interface RandomGuideSelectorProps {
  onGuideSelected: (guide: Guide) => void;
  winners: Winner[];
}

const RandomGuideSelector: React.FC<RandomGuideSelectorProps> = ({
  onGuideSelected,
  winners
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinGuide, setCurrentSpinGuide] = useState<Guide | null>(null);

  // Get winner guide IDs to exclude from selection
  const winnerGuideIds = new Set(winners.map(winner => winner.guide_id));

  const selectRandomGuide = () => {
    if (!selectedDepartment) return;
    
    const departmentGuides = getGuidesByDepartment(selectedDepartment);
    // Filter out guides who are already winners
    const availableGuides = departmentGuides.filter(guide => !winnerGuideIds.has(guide.id));
    
    if (availableGuides.length === 0) {
      alert('No more guides available in this department! All guides have already been selected as winners.');
      return;
    }

    setIsSpinning(true);
    setCurrentSpinGuide(null);
    
    // Extended animation for 5-7 seconds with name scrolling
    let spinCount = 0;
    const maxSpins = 80 + Math.floor(Math.random() * 40); // 80-120 spins for more suspense
    const totalDuration = 5000 + Math.random() * 2000; // 5-7 seconds
    const intervalTime = totalDuration / maxSpins;
    
    const spinInterval = setInterval(() => {
      const randomGuide = availableGuides[Math.floor(Math.random() * availableGuides.length)];
      setCurrentSpinGuide(randomGuide);
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        const finalGuide = availableGuides[Math.floor(Math.random() * availableGuides.length)];
        setSelectedGuide(finalGuide);
        setCurrentSpinGuide(null);
      }
    }, intervalTime);
  };

  const handleMarkGuide = () => {
    if (selectedGuide) {
      onGuideSelected(selectedGuide);
    }
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setSelectedGuide(null); // Reset selected guide when department changes
    setCurrentSpinGuide(null); // Reset spinning guide
  };

  const departmentGuides = selectedDepartment ? getGuidesByDepartment(selectedDepartment) : [];
  const availableGuides = departmentGuides.filter(guide => !winnerGuideIds.has(guide.id));

  return (
    <div className="pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src="/stitch-n-pitch-logo.png" 
                alt="Stitch n Pitch Logo" 
                className="h-24 w-24 rounded-2xl object-cover drop-shadow-2xl border-4 border-white border-opacity-50"
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-bounce flex items-center justify-center gap-4">
            <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
            Stitch n Pitch
            <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-medium">
            Choose your department and pick a random guide for audit
          </p>
        </div>

        {/* Department Selection */}
        <DepartmentSelector
          selectedDepartment={selectedDepartment}
          onDepartmentSelect={handleDepartmentSelect}
          winners={winners}
        />

        {/* Department Info */}
        {selectedDepartment && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-6 py-3 rounded-full backdrop-blur-sm">
              <Building className="w-5 h-5" />
              <span className="font-semibold">{selectedDepartment}</span>
              <span>•</span>
              <User className="w-5 h-5" />
              <span>{availableGuides.length} Available {availableGuides.length === 1 ? 'Guide' : 'Guides'}</span>
              {departmentGuides.length !== availableGuides.length && (
                <>
                  <span>•</span>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>{departmentGuides.length - availableGuides.length} Already Won</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Random Selection Button */}
        {selectedDepartment && (
          <div className="text-center mb-12">
            <button
              onClick={selectRandomGuide}
              disabled={isSpinning || availableGuides.length === 0}
              className={`inline-flex items-center gap-4 text-2xl font-bold px-12 py-6 rounded-2xl transition-all transform shadow-2xl ${
                isSpinning || availableGuides.length === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:scale-105'
              } text-white`}
            >
              <Shuffle className={`w-8 h-8 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? 'Selecting...' : availableGuides.length === 0 ? 'No Guides Available' : `Pick Random Guide from ${selectedDepartment}`}
            </button>
            
            {isSpinning && (
              <div className="mt-6">
                <div className="text-white text-lg font-semibold animate-pulse mb-4">
                  🎲 Rolling the dice... Who will it be? 🎲
                </div>
                
                {/* Scrolling Names Animation */}
                {currentSpinGuide && (
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 mb-4 border border-white border-opacity-30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2 animate-pulse">
                        {currentSpinGuide.name}
                      </div>
                      <div className="text-blue-200 text-lg">
                        {currentSpinGuide.department} • {currentSpinGuide.supervisor}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-blue-200 animate-bounce">
                  Names are scrolling through the pool... Building suspense! ⏰
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected Guide Display */}
        {selectedGuide && !isSpinning && (
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl mb-8 transform transition-all hover:scale-105 border border-white border-opacity-20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 bg-opacity-30 rounded-full mb-4 backdrop-blur-sm">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Selected Guide
              </h2>
            </div>

            <div className="bg-gradient-to-r from-blue-500 from-opacity-20 to-purple-500 to-opacity-20 rounded-2xl p-6 mb-6 backdrop-blur-sm border border-white border-opacity-10">
              <h3 className="text-4xl font-bold text-white mb-4 text-center">
                {selectedGuide.name}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-xl p-4 shadow-sm backdrop-blur-sm">
                  <Building className="w-6 h-6 text-blue-300" />
                  <div>
                    <div className="font-semibold text-blue-200">Department</div>
                    <div className="text-xl text-white">{selectedGuide.department}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-xl p-4 shadow-sm backdrop-blur-sm">
                  <UserCheck className="w-6 h-6 text-green-300" />
                  <div>
                    <div className="font-semibold text-blue-200">Supervisor</div>
                    <div className="text-xl text-white">{selectedGuide.supervisor}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleMarkGuide}
                className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                <Trophy className="w-6 h-6" />
                Mark as Selected/Not Selected
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 text-center border border-white border-opacity-20">
          <h3 className="text-xl font-semibold text-white mb-3">How to Use</h3>
          <div className="grid md:grid-cols-4 gap-4 text-blue-100">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold">1</span>
              </div>
              <p>Select a department</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold">2</span>
              </div>
              <p>Click "Pick Random Guide"</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold">3</span>
              </div>
              <p>Watch names scroll through the pool</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold">4</span>
              </div>
              <p>Mark as Selected or Not Selected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomGuideSelector;