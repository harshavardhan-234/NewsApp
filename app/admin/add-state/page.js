'use client';
import { useEffect, useState } from 'react';

export default function AddState() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [stateName, setStateName] = useState('');

  useEffect(() => {
    async function fetchCountries() {
      const res = await fetch('/api/countries');
      const data = await res.json();
      setCountries(data);
    }
    fetchCountries();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCountry || !stateName) {
      alert('Select country & enter state name');
      return;
    }
    const res = await fetch('/api/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryId: selectedCountry, stateName }),
    });
    if (res.ok) {
      alert('State added');
      setStateName('');
    } else {
      alert('Error adding state');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add State</h2>
      <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
        <option value="">-- Select Country --</option>
        {countries.map((c) => (
          <option key={c._id} value={c._id}>{c.countryName}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="State name"
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
      />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}
