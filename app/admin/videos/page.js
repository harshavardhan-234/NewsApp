'use client';

import { useState, useEffect } from 'react';
import './admin-videos.css';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    category: 'technology',
    duration: '',
    tags: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'sports', label: 'Sports' },
    { value: 'politics', label: 'Politics' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'business', label: 'Business' },
    { value: 'health', label: 'Health' },
    { value: 'science', label: 'Science' }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
      } else {
        // Fallback to sample data if API fails
        setVideos([
          {
            _id: '1',
            title: 'Breaking News: Technology Updates',
            description: 'Latest developments in artificial intelligence',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            category: 'technology',
            duration: '5:30',
            views: 1250,
            publishedAt: '2024-01-15T00:00:00.000Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      showAlert('Error fetching videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.videoUrl || !formData.category) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    try {
      const url = editingVideo ? `/api/videos/${editingVideo._id}` : '/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        showAlert(
          editingVideo ? 'Video updated successfully!' : 'Video created successfully!',
          'success'
        );
        fetchVideos();
        resetForm();
      } else {
        showAlert(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      showAlert('Error saving video', 'error');
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail || '',
      category: video.category,
      duration: video.duration || '',
      tags: video.tags ? video.tags.join(', ') : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        showAlert('Video deleted successfully!', 'success');
        fetchVideos();
      } else {
        showAlert(data.message || 'Delete failed', 'error');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      showAlert('Error deleting video', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnail: '',
      category: 'technology',
      duration: '',
      tags: ''
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const generateThumbnail = () => {
    if (formData.videoUrl) {
      const videoId = extractVideoId(formData.videoUrl);
      if (videoId) {
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setFormData(prev => ({ ...prev, thumbnail }));
      }
    }
  };

  return (
    <div className="admin-videos-page">
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="page-header">
        <h1>Video Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Video
        </button>
      </div>

      {/* Video Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingVideo ? 'Edit Video' : 'Add New Video'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="video-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter video description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="videoUrl">Video URL *</label>
                <div className="url-input-group">
                  <input
                    type="url"
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={generateThumbnail}
                  >
                    Generate Thumbnail
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="thumbnail">Thumbnail URL</label>
                <input
                  type="url"
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                  placeholder="Thumbnail image URL"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration</label>
                  <input
                    type="text"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 5:30"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVideo ? 'Update Video' : 'Create Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Videos List */}
      <div className="videos-section">
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
                <p>Create your first video to get started</p>
              </div>
            ) : (
              videos.map(video => (
                <div key={video._id} className="video-card">
                  <div className="video-thumbnail">
                    <img 
                      src={video.thumbnail || '/placeholder-video.jpg'} 
                      alt={video.title}
                      onError={(e) => {
                        e.target.src = '/placeholder-video.jpg';
                      }}
                    />
                    <div className="video-duration">{video.duration}</div>
                  </div>
                  
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-description">{video.description}</p>
                    <div className="video-meta">
                      <span className="category">{video.category}</span>
                      <span className="views">{video.views || 0} views</span>
                    </div>
                    <div className="video-date">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="video-actions">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(video)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(video._id)}
                    >
                      Delete
                    </button>
                    <a 
                      href={video.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
