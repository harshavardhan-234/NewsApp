'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Results for "{query}"</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((news) => (
            <li key={news._id}>
              <Link href={`/news/${news.slug}`} className="text-blue-600 hover:underline">
                {news.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
