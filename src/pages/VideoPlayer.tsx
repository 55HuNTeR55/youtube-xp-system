import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateUserXP } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<Video | undefined>(sampleVideos.find(v => v.id === id));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const lastTimeRef = useRef(0);
  const continuousWatchTimeRef = useRef(0);
  const hasSkippedRef = useRef(false);

  useEffect(() => {
    if (!video) {
      navigate('/');
      return;
    }

    // Start XP tracking when video starts playing
    const handlePlay = () => {
      setIsPlaying(true);
      setXpEarned(0);
      continuousWatchTimeRef.current = 0;
      hasSkippedRef.current = false;
    };

    // Update XP based on watch time
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const timeDiff = currentTime - lastTimeRef.current;
        
        // Check if user skipped ahead
        if (timeDiff > 1.5) { // Allow small jumps (1.5 seconds) for buffering
          hasSkippedRef.current = true;
          continuousWatchTimeRef.current = 0;
        } else if (!hasSkippedRef.current) {
          continuousWatchTimeRef.current += timeDiff;
          
          // Award XP for every 5 minutes of continuous watching
          if (continuousWatchTimeRef.current >= 300) { // 5 minutes = 300 seconds
            const newXp = Math.floor(continuousWatchTimeRef.current / 300) * 50; // 50 XP per 5 minutes
            if (newXp > xpEarned) {
              setXpEarned(newXp);
              if (user) {
                updateUserXP(newXp - xpEarned);
              }
            }
          }
        }
        
        lastTimeRef.current = currentTime;
        setCurrentTime(currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [video, user, navigate, xpEarned, updateUserXP]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  if (!video) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full"
              controls
              autoPlay
            />
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-white">{video.title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">{video.viewsFormatted} views</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{formatTimestamp(video.timestamp)}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-white hover:text-youtube-red">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{video.likesFormatted}</span>
                </button>
                <button className="flex items-center space-x-2 text-white hover:text-youtube-red">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div>
                  <h3 className="text-white font-semibold">{video.channel}</h3>
                  <p className="text-gray-400 text-sm">1.2M subscribers</p>
                </div>
              </div>
              <button className="bg-youtube-red text-white px-4 py-2 rounded-full hover:bg-red-700">
                Subscribe
              </button>
            </div>
          </div>

          {/* Video Description */}
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-white whitespace-pre-line">{video.description}</p>
          </div>
        </div>

        {/* XP Progress Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-bold text-white mb-4">Watch Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Watch Time</span>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-youtube-red h-2 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>XP Earned</span>
                  <span>{xpEarned} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((xpEarned / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              {user && (
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Total XP</span>
                    <span>{user.xp} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(user.xp % 1000) / 10}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 