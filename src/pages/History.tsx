import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const History: React.FC = () => {
  const { user } = useAuth();

  // Mock history data
  const historyItems = [
    {
      id: '1',
      title: 'Introduction to React',
      thumbnail: 'https://via.placeholder.com/320x180',
      timestamp: '2 hours ago',
      duration: '10:30',
    },
    {
      id: '2',
      title: 'Building a YouTube Clone',
      thumbnail: 'https://via.placeholder.com/320x180',
      timestamp: '1 day ago',
      duration: '15:45',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Watch History</h1>
      <div className="space-y-4">
        {historyItems.map((item) => (
          <Link
            key={item.id}
            to={`/watch/${item.id}`}
            className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="relative w-48 flex-shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full aspect-video object-cover rounded"
              />
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {item.duration}
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{item.timestamp}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default History; 