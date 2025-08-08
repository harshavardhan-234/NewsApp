'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './EditNewsPage.module.css';

export default function EditNewsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', slug: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(`/api/news`);
      const data = await res.json();
      const current = data.find(n => n._id === id);
      setNews(current);
      if (current) {
        setForm({
          title: current.title,
          description: current.description,
          category: current.category,
          slug: current.slug,
        });
        setPreview(current.image); // Show existing image
      }
    }
    fetchNews();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('slug', form.slug);
    formData.append('category', form.category);
    if (image) {
      formData.append('image', image);
    }

    const res = await fetch(`/api/news/update`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      alert('✅ News updated successfully!');
      router.push('/admin/manage-news');
    } else {
      alert('❌ Update failed');
    }
  };

  return news ? (
    <div className={styles.container}>
      <h2 className={styles.heading}>Edit News</h2>

      <form onSubmit={handleUpdate} encType="multipart/form-data">
        <label className={styles.label}>Title</label>
        <input
          type="text"
          className={styles.input}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>

        <label className={styles.label}>Slug</label>
        <input
          type="text"
          className={styles.input}
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />

        <label className={styles.label}>Category</label>
        <input
          type="text"
          className={styles.input}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <label className={styles.label}>Current Image</label>
        {preview && <img src={preview} alt="current" width={150} />}

        <label className={styles.label}>Upload New Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className={styles.button} type="submit">Update News</button>
      </form>
    </div>
  ) : (
    <p className={styles.loading}>Loading...</p>
  );
}
