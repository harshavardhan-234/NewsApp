'use client';
import { useState } from 'react';

const countryStateCity = {
  India: {
    Maharashtra: ['Mumbai', 'Pune'],
    Telangana: ['Hyderabad', 'Warangal'],
    Karnataka: ['Bengaluru', 'Mysuru'],
  },
  USA: {
    California: ['Los Angeles', 'San Francisco'],
    Texas: ['Houston', 'Dallas'],
  },
};

export default function SubscribePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: '1',
    country: '',
    state: '',
    city: '',
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'country') {
      const selectedStates = Object.keys(countryStateCity[value] || {});
      setStates(selectedStates);
      setCities([]);
      setForm({ ...form, country: value, state: '', city: '' });
    } else if (name === 'state') {
      const selectedCities = countryStateCity[form.country]?.[value] || [];
      setCities(selectedCities);
      setForm({ ...form, state: value, city: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Subscribe</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        style={styles.input}
      />

      <select name="country" onChange={handleChange} style={styles.select}>
        <option value="">Select Country</option>
        {Object.keys(countryStateCity).map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>

      <select
        name="state"
        onChange={handleChange}
        disabled={!states.length}
        style={styles.select}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <select
        name="city"
        onChange={handleChange}
        disabled={!cities.length}
        style={styles.select}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      <select name="plan" onChange={handleChange} style={styles.select}>
        <option value="1">1 Month - ₹99</option>
        <option value="2">2 Months - ₹199</option>
        <option value="3">3 Months - ₹299</option>
        <option value="6">6 Months - ₹599</option>
      </select>

      <button onClick={() => alert(JSON.stringify(form))} style={styles.button}>
        Submit
      </button>
    </div>
  );
}

// ✅ Inline styles object
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
