import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../hooks/usePremium';

// Mock shorts data
const shortsData = [
  {
    id: '1',
    title: 'Amazing Dance Moves',
    videoUrl: 'https://example.com/short1.mp4',
    author: 'DanceMaster',
    likes: '1.2M',
    comments: '12K',
    description: 'Check out these incredible dance moves! #dance #viral',
  },
  {
    id: '2',
    title: 'Cooking Quick Tips',
    videoUrl: 'https://example.com/short2.mp4',
    author: 'ChefPro',
    likes: '800K',
    comments: '5K',
    description: 'Learn to cook like a pro in 60 seconds! #cooking #tips',
  },
  {
    id: '3',
    title: 'Funny Cat Moments',
    videoUrl: 'https://example.com/short3.mp4',
    author: 'CatLover',
    likes: '2.5M',
    comments: '25K',
    description: 'Cats being cats 😹 #cats #funny',
  },
];

const Shorts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();
  const { isPremium } = usePremium();

  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentIndex < shortsData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [currentIndex]);

  const currentShort = shortsData[currentIndex];

  return (
    <div 
      className="h-screen w-full bg-black flex items-center justify-center"
      onWheel={handleScroll}
    >
      <div className="relative w-full max-w-md h-full">
        {/* Video Player */}
        <div className="relative h-full">
          <video
            ref={videoRef}
            src={currentShort.videoUrl}
            className="w-full h-full object-cover"
            loop
            onClick={togglePlay}
          />
          
          {/* Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h2 className="text-white text-lg font-semibold">{currentShort.title}</h2>
            <p className="text-gray-300 text-sm">{currentShort.author}</p>
            <p className="text-gray-300 text-sm mt-2">{currentShort.description}</p>
          </div>

          {/* Interaction Buttons */}
          <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-4">
            <button className="flex flex-col items-center text-white">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="text-sm">{currentShort.likes}</span>
            </button>
            <button className="flex flex-col items-center text-white">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
              </svg>
              <span className="text-sm">{currentShort.comments}</span>
            </button>
            <button className="flex flex-col items-center text-white">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span className="text-sm">Share</span>
            </button>
          </div>

          {/* Premium Badge */}
          {isPremium() && (
            <div className="absolute top-4 right-4 bg-youtube-red text-white px-2 py-1 rounded-full text-xs">
              Premium
            </div>
          )}
        </div>

        {/* Navigation Hints */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white opacity-50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white opacity-50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Shorts; 