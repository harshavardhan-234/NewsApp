'use client';
import { useState, useEffect } from 'react';

export default function SiteSettings() {
  const [data, setData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    fetch('/api/settings/get')
      .then(res => res.json())
      .then(setData);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await fetch('/api/settings/update', {
      method: 'PUT',
      body: form,
    });

    const result = await res.json();
    alert(result.success ? 'Settings updated!' : 'Failed to update');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Site Settings</h2>
      <input type="text" name="siteTitle" defaultValue={data.siteTitle} placeholder="Site Title" required />
      <input type="email" name="contactEmail" defaultValue={data.contactEmail} placeholder="Contact Email" />
      <input type="text" name="contactPhone" defaultValue={data.contactPhone} placeholder="Contact Phone" />
      <input type="text" name="facebook" defaultValue={data.facebook} placeholder="Facebook URL" />
      <input type="text" name="instagram" defaultValue={data.instagram} placeholder="Instagram URL" />
      <input type="text" name="linkedin" defaultValue={data.linkedin} placeholder="LinkedIn URL" />
      <textarea name="footerText" defaultValue={data.footerText} placeholder="Footer Text" />

      <div>
        <label>Upload Logo:</label>
        <input type="file" name="logo" onChange={e => {
          const file = e.target.files[0];
          if (file) setLogoPreview(URL.createObjectURL(file));
        }} />
        {logoPreview ? (
          <img src={logoPreview} width={100} />
        ) : (
          data.logo && <img src={data.logo} width={100} />
        )}
      </div>

      <button type="submit">Save Settings</button>
    </form>
  );
}
