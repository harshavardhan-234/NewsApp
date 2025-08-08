'use client';
import { useEffect, useState } from 'react';

export default function AddCity() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [cityName, setCityName] = useState('');

  // Fetch countries on mount
  useEffect(() => {
    async function fetchCountries() {
      const res = await fetch('/api/countries');
      const data = await res.json();
      setCountries(data);
    }
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setSelectedState('');
      return;
    }
    async function fetchStates() {
      const res = await fetch(`/api/states?countryId=${selectedCountry}`);
      const data = await res.json();
      setStates(data);
    }
    fetchStates();
  }, [selectedCountry]);

  const handleSubmit = async () => {
    if (!selectedState || !cityName) {
      alert('Please select a state and enter a city name.');
      return;
    }
    const res = await fetch('/api/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stateId: selectedState, cityName }),
    });
    if (res.ok) {
      alert('City added');
      setCityName('');
    } else {
      alert('Error adding city');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add City</h2>

      {/* Country dropdown */}
      <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
        <option value="">-- Select Country --</option>
        {countries.map((c) => (
          <option key={c._id} value={c._id}>{c.countryName}</option>
        ))}
      </select>

      {/* State dropdown */}
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        disabled={!selectedCountry}
      >
        <option value="">-- Select State --</option>
        {states.map((s) => (
          <option key={s._id} value={s._id}>{s.stateName}</option>
        ))}
      </select>

      {/* City name */}
      <input
        type="text"
        placeholder="City name"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
      />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}
