import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import History from './pages/History';
import Premium from './pages/Premium';
import VideoPlayer from './pages/VideoPlayer';
import Shorts from './pages/Shorts';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-youtube-dark text-white">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/watch/:id" element={<VideoPlayer />} />
            <Route path="/shorts" element={<Shorts />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App; 