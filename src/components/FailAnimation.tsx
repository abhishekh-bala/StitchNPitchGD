import React from 'react';
import { X } from 'lucide-react';

interface FailAnimationProps {
  isActive: boolean;
  guideName: string;
  onClose: () => void;
}

const FailAnimation: React.FC<FailAnimationProps> = ({ isActive, guideName, onClose }) => {
  if (!isActive) return null;

  const funnyMessages = [
    "Oops! Better luck next time! 😅",
    "Not today, champion! 🎭",
    "The universe has other plans! 🌟",
    "Plot twist! Try again! 🎬",
    "Almost there! Keep trying! 💪",
    "The stars weren't aligned! ⭐",
    "Mission failed successfully! 🎯",
    "Error 404: Winner not found! 🤖"
  ];

  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <style>
        {`
          .fail-bounce {
            animation: fail-bounce 0.8s ease-out;
          }
          
          @keyframes fail-bounce {
            0% { transform: scale(0) rotate(-180deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(-90deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          
          .fail-shake {
            animation: fail-shake 0.5s ease-in-out infinite;
          }
          
          @keyframes fail-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          
          .fail-float {
            animation: fail-float 2s ease-in-out infinite;
          }
          
          @keyframes fail-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .fail-emoji {
            animation: fail-emoji-spin 1s linear infinite;
          }
          
          @keyframes fail-emoji-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div 
          className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 bg-opacity-90 backdrop-blur-xl border border-white border-opacity-20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center fail-bounce relative"
          onClick={handleModalClick}
        >
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 z-10 backdrop-blur-sm"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Animated Emojis */}
          <div className="flex justify-center gap-4 mb-6">
            <span className="text-6xl fail-emoji">😅</span>
            <span className="text-6xl fail-float">🎭</span>
            <span className="text-6xl fail-shake">😂</span>
          </div>
          
          {/* Main Message */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 fail-shake">
            OOPS! 
          </h1>
          
          <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6 backdrop-blur-sm border border-white border-opacity-30">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {guideName}
            </h2>
            <p className="text-xl text-white opacity-90">
              {randomMessage}
            </p>
          </div>
          
          {/* Funny Animation Elements */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-4xl fail-float" style={{ animationDelay: '0.2s' }}>🎪</div>
            <div className="text-4xl fail-float" style={{ animationDelay: '0.4s' }}>🎨</div>
            <div className="text-4xl fail-float" style={{ animationDelay: '0.6s' }}>🎵</div>
            <div className="text-4xl fail-float" style={{ animationDelay: '0.8s' }}>🎲</div>
          </div>
          
          <div className="text-white text-lg opacity-80 mb-6">
            Don't worry, every great story has plot twists! 📚✨
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="bg-white bg-opacity-20 text-white px-8 py-3 rounded-xl hover:bg-opacity-30 transition-all transform hover:scale-105 font-semibold backdrop-blur-sm z-10 relative border border-white border-opacity-30"
            type="button"
          >
            Try Again
          </button>
          
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-3xl border-4 border-white opacity-30 animate-pulse pointer-events-none"></div>
        </div>
      </div>
    </>
  );
};

export default FailAnimation;