// File: app/admin/locations/page.js
'use client';

import { useState, useEffect } from 'react';

export default function LocationManager() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  // Fetch all data
  const fetchLocations = async () => {
    const res = await fetch('/api/locations/get-all');
    const data = await res.json();
    if (data.success) setCountries(data.data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddCountry = async () => {
    await fetch('/api/locations/add-country', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country })
    });
    setCountry('');
    fetchLocations();
  };

  const handleAddState = async () => {
    await fetch('/api/locations/add-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: selectedCountry, state })
    });
    setState('');
    fetchLocations();
  };

  const handleAddCity = async () => {
    await fetch('/api/locations/add-city', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: selectedCountry, state: selectedState, city })
    });
    setCity('');
    fetchLocations();
  };

  // update states when selectedCountry changes
  useEffect(() => {
    const c = countries.find((c) => c.country === selectedCountry);
    if (c) setStates(c.states);
    else setStates([]);
  }, [selectedCountry, countries]);

  return (
    <div style={{ padding: 20 }}>
      <h2>📍 Location Manager</h2>

      <div style={{ marginBottom: 20 }}>
        <h3>➕ Add Country</h3>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country Name"
        />
        <button onClick={handleAddCountry}>Add Country</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>➕ Add State</h3>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c.country}>{c.country}</option>
          ))}
        </select>
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State Name"
        />
        <button onClick={handleAddState}>Add State</button>
      </div>

      <div>
        <h3>➕ Add City</h3>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c.country}>{c.country}</option>
          ))}
        </select>

        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City Name"
        />
        <button onClick={handleAddCity}>Add City</button>
      </div>
    </div>
  );
}
