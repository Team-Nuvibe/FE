import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ArchiveItem {
  id: string;
  title: string;
  thumbnail?: string;
}

interface VideoPost {
  id: string;
  tag: string;
  time: string;
  thumbnail: string;
}

const ArchivePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const videoPosts: VideoPost[] = [
    { id: '1', tag: '#Minimal', time: '12m', thumbnail: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256?w=400&h=600&fit=crop' },
    { id: '2', tag: '#Minimal', time: '01h', thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop' }
  ];

  const tags = ['#Minimal', '#Warm', '#Object', '#Moody'];

  const archiveItems: ArchiveItem[] = [
    { id: '1', title: '2026 추구미' },
    { id: '2', title: '보드명' },
    { id: '3', title: '' },
    { id: '4', title: '' },
    { id: '5', title: '' },
    { id: '6', title: '' }
  ];

  return (
    <div className="w-full h-full bg-black text-white flex flex-col overflow-hidden">
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24 touch-auto">
        {/* Video Posts Section with Overlay */}
        <div className="relative px-4 mb-6">
          {/* Background Video Posts */}
          <div className="flex gap-3 overflow-x-auto pb-2 touch-auto">
            {videoPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex-shrink-0 w-36 h-48 rounded-2xl overflow-hidden"
              >
                <img 
                  src={post.thumbnail} 
                  alt={post.tag}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg B2">
                  {post.tag}
                </div>
                <div className="absolute top-3 right-3 B2 text-white/80">
                  {post.time}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Foreground Profile & Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-16 h-16 rounded-full bg-white mb-3"></div>
            <h1 className="H0 text-white">Vibers</h1>
          </div>
        </div>

        {/* Vibe Tone Section */}
        <div className="px-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="B2 text-gray-400">0000's Vibe Tone</p>
            <button className="B2 text-gray-400">more &gt;</button>
          </div>
          
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <motion.button
                key={tag}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-white/10 rounded-full B2"
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Archive Section - Header Fixed */}
        <div className="flex-1 flex flex-col">
          {/* Fixed Header */}
          <div className="px-6 bg-black sticky top-0 z-10 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="H2">Archive</h2>
              <div className="flex gap-2">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-lg B2 ${viewMode === 'list' ? 'bg-white/20' : 'bg-white/10'}`}
                  onClick={() => setViewMode('list')}
                >
                  선택
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white/20' : 'bg-white/10'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                    <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="10" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="1" y="10" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="10" y="10" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 B2 placeholder:text-gray-500 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Scrollable Grid */}
          <div className="px-6">
            <div className="grid grid-cols-2 gap-4 pb-6">
              {archiveItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="aspect-square bg-gradient-to-b from-white/20 to-white/10 rounded-2xl flex items-center justify-center cursor-pointer"
                >
                  {item.title && (
                    <span className="ST2">{item.title}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;