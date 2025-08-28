'use client';
import { useState, useEffect } from 'react';
import { FiUploadCloud, FiFileText, FiTag, FiList, FiImage } from 'react-icons/fi';
import './add-news.css';

export default function AddNews() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    slug: '',
    category: '',
    image: null,
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [refreshCategories, setRefreshCategories] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.categories) {
            setCategories(data.categories);
          } else {
            // Fallback to default categories
            setCategories([
              { id: 1, name: 'Entertainment', slug: 'entertainment' },
              { id: 2, name: 'News', slug: 'news' },
              { id: 3, name: 'Sports', slug: 'sports' },
              { id: 4, name: 'Politics', slug: 'politics' },
              { id: 5, name: 'Science', slug: 'science' }
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories
        setCategories([
          { id: 1, name: 'Entertainment', slug: 'entertainment' },
          { id: 2, name: 'News', slug: 'news' },
          { id: 3, name: 'Sports', slug: 'sports' },
          { id: 4, name: 'Politics', slug: 'politics' },
          { id: 5, name: 'Science', slug: 'science' }
        ]);
      }
    };

    fetchCategories();
  }, [refreshCategories]);

  // Add window focus listener to refresh categories when switching tabs
  useEffect(() => {
    const handleFocus = () => {
      setRefreshCategories(prev => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({
        ...form,
        [name]: files[0],
      });
      setFileName(files[0].name);
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('slug', form.slug);
      formData.append('category', form.category);
      if (form.image) {
        formData.append('image', form.image);
      }

      const res = await fetch('/api/news/add', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ News added successfully!');
        // Reset form
        setForm({
          title: '',
          description: '',
          slug: '',
          category: '',
          image: null,
        });
        setFileName('');
      } else {
        alert(`❌ Failed to add news: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding news:', error);
      alert('❌ An error occurred while adding news');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-news-container">
      <div className="add-news-header">
        <h2><FiFileText /> Add News Article</h2>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="news-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title"
            name="title" 
            value={form.title}
            placeholder="Enter news title" 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            name="description" 
            value={form.description}
            placeholder="Enter news content" 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="slug">Slug</label>
          <input 
            type="text" 
            id="slug"
            name="slug" 
            value={form.slug}
            placeholder="Enter URL slug (e.g., my-news-title)" 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              id="category"
              name="category" 
              value={form.category}
              onChange={handleChange} 
              required
              style={{ flex: 1 }}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat, index) => (
                <option key={cat.id || cat.slug || `category-${index}`} value={cat.slug || cat}>
                  {cat.name || cat}
                </option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={() => setRefreshCategories(prev => prev + 1)}
              style={{
                padding: '8px 12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              title="Refresh categories"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Featured Image</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <FiImage />
              {fileName ? fileName : 'Choose an image file'}
              <input 
                type="file" 
                id="image"
                name="image" 
                className="file-input"
                accept="image/*" 
                onChange={handleChange} 
              />
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          <FiUploadCloud />
          {isSubmitting ? 'Adding...' : 'Add News'}
        </button>
      </form>
    </div>
  );
}
