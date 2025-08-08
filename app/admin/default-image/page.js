'use client';
import { useState } from 'react';
import styles from './DefaultImageUpload.module.css'; // CSS module

export default function DefaultImageUpload() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    const res = await fetch('/api/admin/upload-default-image', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Upload Default News Image</h2>
      <form className={styles.form} onSubmit={handleUpload}>
        <input
          type="file"
          className={styles.input}
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit" className={styles.button}>Upload</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
