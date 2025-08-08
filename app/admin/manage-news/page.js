'use client';
import { useEffect, useState } from 'react';

export default function ManageNews() {
  const [newsList, setNewsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNewsList(data));
  }, []);

  const filteredNews = newsList.filter(news =>
    news.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Manage News</h2>

      <input
        type="text"
        placeholder="Search by Category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredNews.map((news) => (
            <tr key={news._id}>
              <td>{news.title}</td>
              <td>{news.category}</td>
              <td>{news.slug}</td>
              <td>
                <a href={`/admin/edit-news/${news._id}`} style={{ marginRight: '10px' }}>Edit</a>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure to delete?')) {
                      const res = await fetch(`/api/news/delete`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: news._id }),
                      });
                      if (res.ok) {
                        setNewsList(newsList.filter((n) => n._id !== news._id));
                      }
                    }
                  }}
                  style={{ color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
