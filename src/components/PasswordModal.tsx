import React, { useState } from 'react';
import { X, Lock, MessageCircle, Plus, Trash2 } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: 'pass' | 'fail', chatIds: string[]) => void;
  guideName: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  guideName
}) => {
  const [password, setPassword] = useState('');
  const [selectedAction, setSelectedAction] = useState<'pass' | 'fail' | null>(null);
  const [error, setError] = useState('');
  const [chatIds, setChatIds] = useState<string[]>(['']);
  const [showChatIds, setShowChatIds] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) {
      setError('Please select Selected or Not Selected');
      return;
    }
    
    if (showChatIds) {
      // Validate chat IDs if any are entered
      const validChatIds = chatIds.filter(id => id.trim() !== '');
      if (validChatIds.length > 5) {
        setError('Maximum 5 Chat IDs allowed');
        return;
      }
    }
    
    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }
    
    const validChatIds = showChatIds ? chatIds.filter(id => id.trim() !== '') : [];
    onConfirm(selectedAction, validChatIds);
    setPassword('');
    setSelectedAction(null);
    setChatIds(['']);
    setShowChatIds(false);
    setError('');
  };

  const handleClose = () => {
    setPassword('');
    setSelectedAction(null);
    setChatIds(['']);
    setShowChatIds(false);
    setError('');
    onClose();
  };

  const addChatIdField = () => {
    if (chatIds.length < 5) {
      setChatIds([...chatIds, '']);
    }
  };

  const removeChatIdField = (index: number) => {
    if (chatIds.length > 1) {
      setChatIds(chatIds.filter((_, i) => i !== index));
    }
  };

  const updateChatId = (index: number, value: string) => {
    const newChatIds = [...chatIds];
    newChatIds[index] = value;
    setChatIds(newChatIds);
  };

  const handleActionSelect = (action: 'pass' | 'fail') => {
    setSelectedAction(action);
    setShowChatIds(true);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Access</h2>
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
            Mark <span className="font-semibold text-blue-200">{guideName}</span> as:
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleActionSelect('pass')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all backdrop-blur-sm border ${
                selectedAction === 'pass'
                  ? 'bg-green-500 bg-opacity-80 text-white shadow-lg border-green-400 border-opacity-50'
                  : 'bg-white bg-opacity-10 text-white hover:bg-green-500 hover:bg-opacity-30 border-white border-opacity-20'
              }`}
            >
              ✅ Selected (Winner)
            </button>
            <button
              type="button"
              onClick={() => handleActionSelect('fail')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all backdrop-blur-sm border ${
                selectedAction === 'fail'
                  ? 'bg-red-500 bg-opacity-80 text-white shadow-lg border-red-400 border-opacity-50'
                  : 'bg-white bg-opacity-10 text-white hover:bg-red-500 hover:bg-opacity-30 border-white border-opacity-20'
              }`}
            >
              ❌ Not Selected
            </button>
          </div>
        </div>

        {/* Chat IDs Section */}
        {showChatIds && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-blue-300" />
              <label className="text-sm font-medium text-white text-opacity-90">
                Chat IDs (Optional - Max 5)
              </label>
            </div>
            
            <div className="space-y-3">
              {chatIds.map((chatId, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => updateChatId(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white placeholder-opacity-60 backdrop-blur-sm text-sm"
                    placeholder={`Chat ID ${index + 1}`}
                  />
                  {chatIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChatIdField(index)}
                      className="p-2 bg-red-500 bg-opacity-20 text-red-300 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {chatIds.length < 5 && (
                <button
                  type="button"
                  onClick={addChatIdField}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 bg-opacity-20 text-blue-300 rounded-lg hover:bg-blue-500 hover:text-white transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Chat ID
                </button>
              )}
            </div>
            
            <p className="text-xs text-blue-200 mt-2 opacity-75">
              Chat IDs are optional and will be saved for record-keeping purposes
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white text-opacity-90 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white placeholder-opacity-60 backdrop-blur-sm"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-400 border-opacity-50 text-red-200 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 bg-white bg-opacity-10 border border-white border-opacity-20 text-white rounded-xl hover:bg-opacity-20 transition-colors backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 bg-opacity-80 text-white rounded-xl hover:bg-opacity-90 transition-colors backdrop-blur-sm border border-blue-500 border-opacity-50"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;