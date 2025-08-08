'use client';
import { useState } from 'react';

export default function AddCountry() {
  const [countryName, setCountryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/countries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryName }),
    });
    if (res.ok) {
      alert('Country added');
      setCountryName('');
    } else {
      alert('Error adding country');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2>Add Country</h2>
      <input
        type="text"
        value={countryName}
        onChange={(e) => setCountryName(e.target.value)}
        placeholder="Country name"
      />
      <button type="submit">Add</button>
    </form>
  );
}
