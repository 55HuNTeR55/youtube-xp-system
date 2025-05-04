import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  FireIcon,
  VideoCameraIcon,
  ClockIcon,
  HeartIcon,
  BookmarkIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  MusicalNoteIcon,
  FilmIcon,
  DevicePhoneMobileIcon,
  NewspaperIcon,
  TrophyIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  FlagIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface SidebarItem {
  icon: React.ElementType;
  text: string;
  path?: string;
}

const mainItems: SidebarItem[] = [
  { icon: HomeIcon, text: 'Home', path: '/' },
  { icon: FireIcon, text: 'Shorts', path: '/shorts' },
  { icon: VideoCameraIcon, text: 'Subscriptions', path: '/subscriptions' },
];

const libraryItems: SidebarItem[] = [
  { icon: ClockIcon, text: 'History', path: '/history' },
  { icon: HeartIcon, text: 'Liked Videos', path: '/liked' },
  { icon: BookmarkIcon, text: 'Watch Later', path: '/watch-later' },
];

const subscriptions: SidebarItem[] = [
  { icon: UserGroupIcon, text: 'Music', path: '/channel/music' },
  { icon: ShoppingBagIcon, text: 'Gaming', path: '/channel/gaming' },
  { icon: MusicalNoteIcon, text: 'Sports', path: '/channel/sports' },
];

const exploreItems: SidebarItem[] = [
  { icon: FilmIcon, text: 'Movies', path: '/explore/movies' },
  { icon: DevicePhoneMobileIcon, text: 'Gaming', path: '/explore/gaming' },
  { icon: NewspaperIcon, text: 'News', path: '/explore/news' },
  { icon: TrophyIcon, text: 'Sports', path: '/explore/sports' },
  { icon: LightBulbIcon, text: 'Learning', path: '/explore/learning' },
];

const settingsItems: SidebarItem[] = [
  { icon: Cog6ToothIcon, text: 'Settings', path: '/settings' },
  { icon: FlagIcon, text: 'Report History', path: '/report-history' },
  { icon: QuestionMarkCircleIcon, text: 'Help', path: '/help' },
  { icon: ChatBubbleLeftRightIcon, text: 'Send Feedback', path: '/feedback' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const renderSidebarSection = (items: SidebarItem[], title?: string) => (
    <div className="py-2">
      {title && (
        <h2 className="px-6 text-sm font-semibold text-gray-400 mb-2">{title}</h2>
      )}
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path || '#'}
          className={`flex items-center px-6 py-2 text-gray-300 hover:bg-gray-800 hover:text-white group ${
            location.pathname === item.path ? 'bg-gray-800 text-white' : ''
          }`}
        >
          <item.icon className="h-6 w-6 mr-4" />
          <span className="text-sm">{item.text}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-youtube-dark border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="p-4">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Main Navigation */}
          {renderSidebarSection(mainItems)}
          
          {/* Library Section */}
          {renderSidebarSection(libraryItems, 'Library')}
          
          {/* Subscriptions Section */}
          {renderSidebarSection(subscriptions, 'Subscriptions')}
          
          {/* Explore Section */}
          {renderSidebarSection(exploreItems, 'Explore')}
          
          {/* Settings Section */}
          {renderSidebarSection(settingsItems, 'Settings')}

          {/* User Profile Section */}
          {user && (
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-gray-400 text-sm">Level {user.level}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>XP Progress</span>
                  <span>{user.xp} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-youtube-red h-2 rounded-full"
                    style={{ width: `${(user.xp % 1000) / 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 