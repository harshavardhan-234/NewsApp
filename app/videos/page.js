'use client';

import { useState, useEffect } from 'react';
import './videos.css';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      // Build API URL with category filter
      const apiUrl = selectedCategory === 'all' 
        ? '/api/videos' 
        : `/api/videos?category=${selectedCategory}`;
      
      console.log('Frontend - Fetching from URL:', apiUrl);
      console.log('Frontend - Selected category:', selectedCategory);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Frontend - API Response:', data);
      
      if (data.success) {
        setVideos(data.videos || []);
        console.log('Frontend - Videos loaded:', data.videos?.length || 0);
      } else {
        console.error('Failed to fetch videos:', data.message);
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Videos' },
    { value: 'technology', label: 'Technology' },
    { value: 'sports', label: 'Sports' },
    { value: 'politics', label: 'Politics' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'business', label: 'Business' },
    { value: 'health', label: 'Health' },
    { value: 'science', label: 'Science' }
  ];

  const handleVideoClick = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="videos-page">
      <div className="videos-header">
        <h1>Latest Videos</h1>
        <p>Watch the latest news videos and updates</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.value}
            className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading videos...</p>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.length === 0 ? (
            <div className="no-videos">
              <h3>No videos found</h3>
              <p>Check back later for new video content</p>
            </div>
          ) : (
            videos.map(video => (
              <div 
                key={video._id} 
                className="video-card"
                onClick={() => handleVideoClick(video.videoUrl)}
              >
                <div className="video-thumbnail">
                  <img 
                    src={video.thumbnail || '/placeholder-video.jpg'} 
                    alt={video.title}
                    onError={(e) => {
                      e.target.src = '/placeholder-video.jpg';
                    }}
                  />
                  <div className="video-duration">{video.duration}</div>
                  <div className="play-overlay">
                    <div className="play-button">▶</div>
                  </div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-description">{video.description}</p>
                  <div className="video-meta">
                    <span className="video-views">{video.views || 0} views</span>
                    <span className="video-date">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
