'use client';
import { useEffect, useState } from 'react';

export default function ManageNews() {
  const [newsList, setNewsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNewsList(data));
  }, []);

  const filteredNews = newsList.filter(news =>
    news.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="manage-news-container">
      <h2>Manage News</h2>

      <input
        type="text"
        placeholder="Search by Category..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-input"
      />

      <table className="news-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Category</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((news, index) => (
            <tr key={news._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{news.title}</td>
              <td>{news.category}</td>
              <td>{news.slug}</td>
              <td>
                <a href={`/admin/edit-news/${news._id}`} className="edit-btn">Edit</a>
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
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <style jsx>{`
        .manage-news-container {
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, sans-serif;
        }

        h2 {
          margin-bottom: 20px;
          color: #333;
        }

        .search-input {
          padding: 10px;
          width: 300px;
          margin-bottom: 20px;
          border-radius: 6px;
          border: 1px solid #ccc;
          outline: none;
          transition: 0.3s;
        }

        .search-input:focus {
          border-color: #0070f3;
          box-shadow: 0 0 5px rgba(0, 112, 243, 0.3);
        }

        .news-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
        }

        .news-table th, 
        .news-table td {
          padding: 12px 15px;
          text-align: left;
        }

        .news-table thead {
          background-color: #0070f3;
          color: white;
        }

        .news-table tbody tr {
          border-bottom: 1px solid #ddd;
        }

        .news-table tbody tr:hover {
          background-color: #f9f9f9;
        }

        .edit-btn {
          background: #28a745;
          color: white;
          padding: 6px 12px;
          text-decoration: none;
          border-radius: 5px;
          margin-right: 8px;
          transition: 0.3s;
        }

        .edit-btn:hover {
          background: #218838;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
        }

        .delete-btn:hover {
          background: #c82333;
        }

        .pagination {
          margin-top: 20px;
        }

        .pagination button {
          margin: 0 5px;
          background: #f1f1f1;
          color: black;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.3s;
        }

        .pagination button:hover {
          background: #0070f3;
          color: white;
        }

        .pagination .active {
          background: #0070f3;
          color: white;
        }
      `}</style>
    </div>
  );
}
