import React from 'react';
import { Trophy, Star, X } from 'lucide-react';
import { Winner } from '../config/data';

interface WinnerDisplayProps {
  winner: Winner;
  onBack: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center bounce-in relative">
        
        {/* Close Button */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 rounded-full p-2 hover:bg-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-4 animate-bounce">
            <Trophy className="w-10 h-10 text-yellow-700" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2 animate-pulse">
            🎉 WINNER! 🎉
          </h1>
          
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-8 h-8 text-yellow-400 fill-current animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {winner.name}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-lg">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="font-semibold text-yellow-300">Department</div>
              <div>{winner.department}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="font-semibold text-yellow-300">Supervisor</div>
              <div>{winner.supervisor}</div>
            </div>
          </div>
        </div>

        <div className="text-gray-600 mb-8">
          <p className="text-lg">
            Congratulations on being selected as our guide!
          </p>
          <p className="text-sm mt-2">
            Selected on {new Date(winner.timestamp).toLocaleString()}
          </p>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-xl hover:bg-blue-800 transition-all transform hover:scale-105 font-semibold"
        >
          <Trophy className="w-5 h-5" />
          Continue Selection
        </button>
      </div>
    </div>
  );
};

export default WinnerDisplay;