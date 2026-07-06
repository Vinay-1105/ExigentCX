// Intercept Supabase auth errors in the URL hash fragment before Supabase clears it on initialization
if (typeof window !== 'undefined' && window.location.hash) {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const error = hashParams.get("error");
  const errorDescription = hashParams.get("error_description");
  const errorCode = hashParams.get("error_code");

  if (error || errorCode || errorDescription) {
    let friendlyMessage = errorDescription || error || "Authentication failed.";
    if (errorCode === "otp_expired" || friendlyMessage.toLowerCase().includes("expired") || friendlyMessage.toLowerCase().includes("invalid")) {
      friendlyMessage = "The sign-in link has expired or has already been used. This is common if your email provider scans links for safety. Please try signing in again, or choose the OTP method for a more reliable login.";
    }
    const targetRole = localStorage.getItem('logging_in_role') || 'expert';
    localStorage.removeItem('logging_in_role');
    
    sessionStorage.setItem('auth_error', JSON.stringify({
      message: friendlyMessage,
      role: targetRole
    }));
    
    // Clear the hash from the URL
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
