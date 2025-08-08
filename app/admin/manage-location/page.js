// app/admin/manage-location/page.jsx
'use client';
import { useEffect, useState } from 'react';

export default function ManageLocation() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    fetch('/api/countries').then(res => res.json()).then(setCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry)
      fetch(`/api/states?countryId=${selectedCountry}`).then(res => res.json()).then(setStates);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState)
      fetch(`/api/cities?stateId=${selectedState}`).then(res => res.json()).then(setCities);
  }, [selectedState]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Locations</h2>

      <div className="mb-4">
        <label>Country:</label>
        <select onChange={e => setSelectedCountry(e.target.value)} className="border ml-2">
          <option value="">--Select Country--</option>
          {countries.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label>State:</label>
        <select onChange={e => setSelectedState(e.target.value)} className="border ml-2">
          <option value="">--Select State--</option>
          {states.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label>City:</label>
        <select className="border ml-2">
          <option value="">--Select City--</option>
          {cities.map(c => (
            <option key={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
