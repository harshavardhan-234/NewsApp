"use client";

import React, { useEffect, useState } from "react";

export default function ProfilePopup() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/get-user-details");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.heading}>👤 My Account</div>
      <div style={styles.detail}><strong>Name:</strong> {user.name}</div>
      <div style={styles.detail}><strong>Email:</strong> {user.email}</div>
      <div style={styles.detail}><strong>Phone:</strong> {user.phone}</div>
      <div style={styles.detail}><strong>Plan:</strong> {user.plan} months</div>
      <div style={styles.detail}><strong>Expires At:</strong> {new Date(user.expiresAt).toLocaleString()}</div>
      <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    color: "#111",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    borderRadius: "10px",
    padding: "16px",
    position: "absolute",
    top: "60px",
    right: "20px",
    width: "270px",
    zIndex: 1000,
    fontFamily: "Arial",
  },
  heading: {
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "10px",
    textAlign: "center",
    color: "#D80027",
  },
  detail: {
    marginBottom: "8px",
    fontSize: "14px",
  },
  logoutBtn: {
    background: "#D80027",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
    marginTop: "12px",
  },
};
