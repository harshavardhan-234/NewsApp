'use client';
import { useState } from 'react';
import './AddNews.css';

export default function AddNews() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    slug: '',
    category: '',
    image: null,
  });

  const categories = ['Entertainment', 'News', 'Sports', 'Politics', 'Science'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    } else {
      alert('❌ Failed to add news');
    }
  };

  return (
    <div className="form-container">
      <h2>Add News Article</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="news-form">
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="text" name="slug" placeholder="Slug" onChange={handleChange} required />

        <select name="category" onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit">📤 Add News</button>
      </form>
    </div>
  );
}
