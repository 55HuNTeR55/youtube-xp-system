import React from 'react';
import { getLevelUpRewards } from '../services/xpService';

interface LevelUpNotificationProps {
  newLevel: number;
  onClose: () => void;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({ newLevel, onClose }) => {
  const rewards = getLevelUpRewards(newLevel);

  return (
    <div className="fixed bottom-4 right-4 bg-youtube-dark border border-youtube-red rounded-lg p-4 shadow-lg max-w-md animate-slide-up">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-youtube-red">Level Up! 🎉</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      <p className="text-white mb-2">
        Congratulations! You've reached level {newLevel}
      </p>
      {rewards.length > 0 && (
        <div className="mt-2">
          <p className="text-gray-400 mb-1">New Rewards:</p>
          <ul className="list-disc list-inside text-gray-300">
            {rewards.map((reward, index) => (
              <li key={index}>{reward}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LevelUpNotification; 