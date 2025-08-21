"use client";
import React from "react";

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirect to Stripe Checkout
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        padding: "12px 20px",
        fontSize: "16px",
        cursor: "pointer",
        background: "#635bff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
      }}
    >
      Pay ₹198
    </button>
  );
}
