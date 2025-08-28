'use client';
import { useEffect, useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiFileText, FiGrid, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import './manage-news.css';

export default function ManageNews() {
  const [newsList, setNewsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('/api/news')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setNewsList(data))
      .catch(error => {
        console.error('Error fetching news:', error);
        setNewsList([]); // Set empty array on error
      });
  }, []);

  const filteredNews = newsList.filter(news => {
    // Text search filter
    const matchesSearch = 
      news.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    let matchesDate = true;
    if (dateFilter.startDate) {
      const newsDate = new Date(news.createdAt);
      const startDate = new Date(dateFilter.startDate);
      matchesDate = matchesDate && newsDate >= startDate;
    }
    if (dateFilter.endDate) {
      const newsDate = new Date(news.createdAt);
      const endDate = new Date(dateFilter.endDate);
      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && newsDate <= endDate;
    }
    
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="manage-news-container">
      <div className="manage-news-header">
        <h2><FiFileText /> Manage News</h2>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon"><FiFileText /></div>
          <h3>Total News</h3>
          <p className="stat-value">{newsList.length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiGrid /></div>
          <h3>Categories</h3>
          <p className="stat-value">{[...new Set(newsList.map(news => news.category))].length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiClock /></div>
          <h3>Latest News</h3>
          <p className="stat-value">{newsList.length > 0 ? new Date(Math.max(...newsList.map(news => new Date(news.createdAt)))).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <div className="filters-container">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Title or Category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
        
        <div className="date-filters">
          <div className="date-filter">
            <label>From:</label>
            <input 
              type="date" 
              value={dateFilter.startDate}
              onChange={(e) => {
                setDateFilter({...dateFilter, startDate: e.target.value});
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="date-filter">
            <label>To:</label>
            <input 
              type="date" 
              value={dateFilter.endDate}
              onChange={(e) => {
                setDateFilter({...dateFilter, endDate: e.target.value});
                setCurrentPage(1);
              }}
            />
          </div>
          
          {(dateFilter.startDate || dateFilter.endDate) && (
            <button 
              className="clear-filter-btn"
              onClick={() => {
                setDateFilter({ startDate: '', endDate: '' });
                setCurrentPage(1);
              }}
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      <div className="news-table-container">
        <table className="news-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((news, index) => (
                <tr key={news._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>
                    <img 
                      src={news.image || '/placeholder.jpg'} 
                      alt={news.title} 
                      className="news-thumbnail"
                    />
                  </td>
                  <td>
                    <p className="news-title">{news.title}</p>
                  </td>
                  <td>
                    <span className={`news-category ${news.category}`}>{news.category}</span>
                  </td>
                  <td>{news.slug}</td>
                  <td>
                    <span className="news-date">{new Date(news.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link href={`/admin/edit-news/${news._id}`} className="action-btn edit-btn">
                        <FiEdit2 />
                      </Link>
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
                        className="action-btn delete-btn"
                      >
                        <FiTrash2 />
                      </button>
                      <Link href={`/news/${news.slug}`} target="_blank" className="action-btn view-btn">
                        <FiEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <div className="empty-state-icon"><FiFileText /></div>
                    <p className="empty-state-text">No news articles found</p>
                    <Link href="/admin/add-news" className="add-news-btn">
                      Add Your First News
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          &laquo; Prev
        </button>
        
        {Array.from({ length: totalPages }).map((_, index) => {
          // Show limited page numbers with ellipsis for better UX
          if (
            index === 0 || // First page
            index === totalPages - 1 || // Last page
            (index >= currentPage - 2 && index <= currentPage + 1) // Pages around current
          ) {
            return (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            );
          } else if (
            index === currentPage - 3 ||
            index === currentPage + 2
          ) {
            // Add ellipsis
            return <span key={index} className="pagination-ellipsis">...</span>;
          }
          return null;
        })}
        
        <button 
          onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
          disabled={currentPage === totalPages}
          className="pagination-arrow"
        >
          Next &raquo;
        </button>
      </div>


    </div>
  );
}
