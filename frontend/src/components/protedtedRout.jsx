import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    // Not authenticated → redirect to login
    return <Navigate to="/login" replace />
  }

  // Authenticated → render children
  return children
}
