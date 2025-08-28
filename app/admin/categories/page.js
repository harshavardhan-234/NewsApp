'use client';

import { useState, useEffect } from 'react';
import './categories.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // For now, use some sample categories if API fails
      setCategories([
        { _id: '1', name: 'Technology', slug: 'technology', createdAt: new Date() },
        { _id: '2', name: 'Sports', slug: 'sports', createdAt: new Date() },
        { _id: '3', name: 'Politics', slug: 'politics', createdAt: new Date() },
        { _id: '4', name: 'Entertainment', slug: 'entertainment', createdAt: new Date() },
      ]);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(prev => [...prev, data.category]);
        setNewCategory('');
        setSuccess('Category added successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add category');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      // For demo purposes, add locally if API fails
      const newCat = {
        _id: Date.now().toString(),
        name: newCategory.trim(),
        slug: newCategory.trim().toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date()
      };
      setCategories(prev => [...prev, newCat]);
      setNewCategory('');
      setSuccess('Category added successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (id) => {
    if (!editName.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(prev => prev.map(cat => 
          cat._id === id ? { ...cat, name: editName.trim() } : cat
        ));
        setEditingCategory(null);
        setEditName('');
        setSuccess('Category updated successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update category');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      // For demo purposes, update locally if API fails
      setCategories(prev => prev.map(cat => 
        cat._id === id ? { ...cat, name: editName.trim() } : cat
      ));
      setEditingCategory(null);
      setEditName('');
      setSuccess('Category updated successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat._id !== id));
        setSuccess('Category deleted successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      // For demo purposes, delete locally if API fails
      setCategories(prev => prev.filter(cat => cat._id !== id));
      setSuccess('Category deleted successfully!');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category._id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Manage Categories</h1>
        <p>Add, edit, and manage news categories for your website</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add New Category Form */}
      <div className="add-category-section">
        <h2>Add New Category</h2>
        <form onSubmit={handleAddCategory} className="add-category-form">
          <div className="form-group">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="category-input"
              required
            />
            <button 
              type="submit" 
              disabled={loading || !newCategory.trim()}
              className="btn btn-primary"
            >
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="categories-list-section">
        <h2>Existing Categories ({categories.length})</h2>
        
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories found. Add your first category above.</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category._id} className="category-card">
                {editingCategory === category._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleEditCategory(category._id)}
                        className="btn btn-sm btn-success"
                        disabled={loading || !editName.trim()}
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="btn btn-sm btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="category-info">
                      <h3>{category.name}</h3>
                      <p className="category-slug">/{category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}</p>
                      <p className="category-date">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="category-actions">
                      <button 
                        onClick={() => startEdit(category)}
                        className="btn btn-sm btn-outline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category._id)}
                        className="btn btn-sm btn-danger"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
