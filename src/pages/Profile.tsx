import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface WatchHistory {
  id: string;
  title: string;
  thumbnail: string;
  watchTime: number;
  xpEarned: number;
  date: string;
}

const mockHistory: WatchHistory[] = [
  {
    id: '1',
    title: 'Amazing Video 1',
    thumbnail: 'https://via.placeholder.com/160x90',
    watchTime: 1200,
    xpEarned: 10,
    date: '2024-03-10'
  },
  // add more mock history items
];

const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  if (!user) return null;

  const handleUpdateProfile = async () => {
    await updateUserProfile({ name: editedName });
    setIsEditing(false);
  };

  const calculateLevelProgress = () => {
    const xpForNextLevel = user.level * 1000;
    const progress = (user.xp / xpForNextLevel) * 100;
    return Math.min(progress, 100);
  };

  const totalXp = mockHistory.reduce((sum, item) => sum + item.xpEarned, 0);
  const totalWatchTime = mockHistory.reduce((sum, item) => sum + item.watchTime, 0);

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-youtube-dark rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-6">
          <img
            src={user.picture}
            alt={user.name}
            className="w-32 h-32 rounded-full"
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full bg-youtube-black border border-gray-700 rounded px-4 py-2 text-white"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-youtube-red text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditedName(user.name);
                      setIsEditing(false);
                    }}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-youtube-red hover:text-red-700"
                  >
                    Edit Profile
                  </button>
                </div>
                <p className="text-gray-400 mt-1">{user.email}</p>
                <p className="text-gray-400 mt-1">
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-youtube-dark rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Level {user.level}</span>
              <span>{user.xp} / {user.level * 1000} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-youtube-red h-2.5 rounded-full"
                style={{ width: `${calculateLevelProgress()}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-youtube-black p-4 rounded">
              <h3 className="font-bold mb-2">Subscription</h3>
              <p className="text-gray-400">
                {user.subscription === 'premium' ? 'Premium Member' : 'Free Account'}
              </p>
            </div>
            <div className="bg-youtube-black p-4 rounded">
              <h3 className="font-bold mb-2">Next Level</h3>
              <p className="text-gray-400">
                {user.level * 1000 - user.xp} XP needed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Total XP</h2>
              <p className="text-3xl font-bold text-youtube-red">{totalXp} XP</p>
              <p className="text-sm text-gray-400 mt-2">
                Earn more XP by watching videos!
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Total Watch Time</h2>
              <p className="text-3xl font-bold">{formatWatchTime(totalWatchTime)}</p>
              <p className="text-sm text-gray-400 mt-2">
                Keep watching to earn more XP!
              </p>
            </div>
          </div>

          {/* Watch History */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Watch History</h2>
            <div className="space-y-4">
              {mockHistory.map((item) => (
                <div key={item.id} className="bg-gray-700 rounded-lg p-4 flex items-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-40 h-24 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <div className="text-sm text-gray-400 mt-1">
                      <p>Watch Time: {formatWatchTime(item.watchTime)}</p>
                      <p>XP Earned: {item.xpEarned}</p>
                      <p>Date: {item.date}</p>
                    </div>
                  </div>
                  <Link
                    to={`/watch/${item.id}`}
                    className="bg-youtube-red text-white px-4 py-2 rounded-full hover:bg-red-700"
                  >
                    Watch Again
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 