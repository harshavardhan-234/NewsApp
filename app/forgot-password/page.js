"use client"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState("")

  const sendOtp = async () => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (data.success) {
      setOtpSent(true)
      setMessage("OTP sent to your email. Check inbox.")
    } else {
      setMessage("Failed to send OTP.")
    }
  }

  const verifyOtp = async () => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })
    const data = await res.json()
    if (data.success) {
      // redirect to reset password page
      window.location.href = `/reset-password?email=${email}`
    } else {
      setMessage("Invalid OTP")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Forgot Password</h2>

      {!otpSent ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      <p>{message}</p>
    </div>
  )
}
