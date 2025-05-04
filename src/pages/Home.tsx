import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Categories
const categories = [
  'All',
  'Music',
  'Gaming',
  'Sports',
  'News',
  'Education',
  'Entertainment',
  'Technology',
  'Cooking',
  'Travel',
];

// Sort options
const sortOptions = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Viewed', value: 'views' },
  { label: 'Most Liked', value: 'likes' },
  { label: 'Trending', value: 'trending' },
];

// Random video titles and channels
const videoTitles = [
  'How to Build a React App in 10 Minutes',
  'The Future of AI Technology',
  'Amazing Cooking Tips for Beginners',
  'Top 10 Gaming Moments of 2024',
  'Learn JavaScript in 1 Hour',
  'Travel Vlog: Exploring Tokyo',
  'Fitness Workout for Beginners',
  'Music Production Tutorial',
  'Photography Tips and Tricks',
  'DIY Home Decoration Ideas',
  'Coding Interview Preparation',
  'Healthy Meal Prep Ideas',
  'Gaming Setup Tour 2024',
  'Travel Guide: Paris in 3 Days',
  'Web Development Crash Course',
  'Fitness Transformation Journey',
  'Music Theory for Beginners',
  'Photography Equipment Review',
  'Home Organization Hacks',
  'Programming Best Practices',
];

const channelNames = [
  'TechMaster',
  'CookingWithSarah',
  'GamingPro',
  'CodeNinja',
  'TravelVlogs',
  'FitnessGuru',
  'MusicMaker',
  'PhotoArtist',
  'DIYExpert',
  'WebDevPro',
  'HealthyLife',
  'GamingSetup',
  'TravelGuide',
  'CodeMaster',
  'FitnessLife',
  'MusicTheory',
  'PhotoTips',
  'HomeHacks',
  'DevTips',
  'LifeStyle',
];

// Random thumbnail generators
const getRandomThumbnail = (index: number) => {
  const thumbnailTypes = [
    // Picsum Photos with different seeds
    `https://picsum.photos/seed/${index}/320/180`,
    `https://picsum.photos/seed/video${index}/320/180`,
    // Unsplash random images
    `https://source.unsplash.com/random/320x180?sig=${index}`,
    `https://source.unsplash.com/featured/320x180?sig=${index}`,
    // Category-specific Unsplash images
    `https://source.unsplash.com/320x180/?${['music', 'gaming', 'sports', 'news', 'education', 'entertainment', 'technology', 'cooking', 'travel'][Math.floor(Math.random() * 9)]}&sig=${index}`,
  ];
  return thumbnailTypes[Math.floor(Math.random() * thumbnailTypes.length)];
};

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  channel: string;
  views: number;
  likes: number;
  viewsFormatted: string;
  likesFormatted: string;
  timestamp: string;
  duration: string;
  category: string;
  description: string;
}

// Sample video data with real video URLs
const sampleVideos: Video[] = [
  {
    id: 'video-1',
    title: 'Big Buck Bunny',
    thumbnail: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    channel: 'Blender Foundation',
    views: 1500000,
    likes: 75000,
    viewsFormatted: '1,500,000',
    likesFormatted: '75,000',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '10:34',
    category: 'Animation',
    description: 'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself.',
  },
  {
    id: 'video-2',
    title: 'Elephant Dream',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    channel: 'Orange Open Movie Project',
    views: 2500000,
    likes: 125000,
    viewsFormatted: '2,500,000',
    likesFormatted: '125,000',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '11:00',
    category: 'Animation',
    description: 'The first Blender Open Movie from 2006',
  },
  {
    id: 'video-3',
    title: 'Sintel',
    thumbnail: 'https://durian.blender.org/wp-content/uploads/2010/05/1000x500xlogo.jpg.pagespeed.ic.7_9a3Jh4xq.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    channel: 'Blender Foundation',
    views: 3500000,
    likes: 175000,
    viewsFormatted: '3,500,000',
    likesFormatted: '175,000',
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '14:48',
    category: 'Animation',
    description: 'Third Blender Open Movie from 2010',
  },
  {
    id: 'video-4',
    title: 'Tears of Steel',
    thumbnail: 'https://mango.blender.org/wp-content/uploads/2013/05/01_thom_celia_bridge.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    channel: 'Blender Foundation',
    views: 4500000,
    likes: 225000,
    viewsFormatted: '4,500,000',
    likesFormatted: '225,000',
    timestamp: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '12:14',
    category: 'Animation',
    description: 'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender.',
  },
  {
    id: 'video-5',
    title: 'Subaru WRX STI',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    channel: 'Garage419',
    views: 5500000,
    likes: 275000,
    viewsFormatted: '5,500,000',
    likesFormatted: '275,000',
    timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '00:15',
    category: 'Automotive',
    description: 'Smoking Tire takes the all-new Subaru Outback to the highest point we can find in hopes our customer-appreciation Balloon Launch will get some free T-shirts into the hands of our viewers.',
  },
];

// Mock video data generator
const generateMockVideos = (startIndex: number, count: number, category?: string) => {
  // First, include the sample videos
  if (startIndex === 0) {
    return sampleVideos;
  }

  // Then generate additional mock videos
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const titleIndex = Math.floor(Math.random() * videoTitles.length);
    const channelIndex = Math.floor(Math.random() * channelNames.length);
    const views = Math.floor(Math.random() * 1000000);
    const likes = Math.floor(views * (Math.random() * 0.1));
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
    const duration = `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
    const videoCategory = category || categories[Math.floor(Math.random() * (categories.length - 1)) + 1];

    return {
      id: `video-${index}`,
      title: videoTitles[titleIndex],
      thumbnail: getRandomThumbnail(index),
      videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`, // Using a default video for mock data
      channel: channelNames[channelIndex],
      views,
      likes,
      viewsFormatted: views.toLocaleString(),
      likesFormatted: likes.toLocaleString(),
      timestamp,
      duration,
      category: videoCategory,
      description: `This is a ${videoCategory.toLowerCase()} video about ${videoTitles[titleIndex].toLowerCase()}. Watch to learn more!`,
    };
  });
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

const VideoCard: React.FC<{ video: Video }> = ({ video }) => {
  return (
    <Link to={`/watch/${video.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
          {video.duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{video.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{video.channel}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>{video.viewsFormatted} views</span>
          <span className="mx-1">•</span>
          <span>{formatTimestamp(video.timestamp)}</span>
        </div>
      </div>
    </Link>
  );
};

const Home: React.FC = () => {
  const [videos, setVideos] = useState(generateMockVideos(0, 12));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const observer = useRef<IntersectionObserver | null>(null);
  const page = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  // Pull to refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0 && containerRef.current.scrollTop === 0) {
      containerRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const diff = e.changedTouches[0].clientY - startY.current;

    if (diff > 100) {
      setIsRefreshing(true);
      await refreshVideos();
      setIsRefreshing(false);
    }

    containerRef.current.style.transform = '';
  };

  const lastVideoElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreVideos();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadMoreVideos = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newVideos = generateMockVideos(videos.length, 12, selectedCategory !== 'All' ? selectedCategory : undefined);
    setVideos(prevVideos => [...prevVideos, ...newVideos]);
    
    if (page.current >= 5) {
      setHasMore(false);
    }
    page.current += 1;
    setLoading(false);
  };

  const refreshVideos = async () => {
    page.current = 1;
    setHasMore(true);
    const newVideos = generateMockVideos(0, 12, selectedCategory !== 'All' ? selectedCategory : undefined);
    setVideos(newVideos);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredVideos = videos.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setVideos(filteredVideos);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const sortedVideos = [...videos].sort((a, b) => {
      switch (value) {
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'recent':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'trending':
          return (b.views * 0.7 + b.likes * 0.3) - (a.views * 0.7 + a.likes * 0.3);
        default:
          return 0;
      }
    });
    setVideos(sortedVideos);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    page.current = 1;
    setHasMore(true);
    const newVideos = generateMockVideos(0, 12, category !== 'All' ? category : undefined);
    setVideos(newVideos);
  };

  return (
    <div 
      ref={containerRef}
      className="max-w-7xl mx-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-youtube-red"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-youtube-red text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex justify-end mb-6">
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-youtube-red"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pull to Refresh Indicator */}
      {isRefreshing && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-youtube-red"></div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={index === videos.length - 1 ? lastVideoElementRef : null}
            className="flex flex-col"
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-youtube-red"></div>
        </div>
      )}

      {/* End of Content Message */}
      {!hasMore && !loading && (
        <div className="text-center py-8 text-gray-400">
          No more videos to load
        </div>
      )}
    </div>
  );
};

export default Home; 