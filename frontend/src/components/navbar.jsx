import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'User'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <header className="w-full bg-white shadow flex justify-between items-center px-4 py-2">
      <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
        WorkspaceApp
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-gray-700">Hello, {username}</span>

        <div className="relative">
          <button className="px-3 py-1 border rounded hover:bg-gray-100">
            Profile ▼
          </button>
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md hidden group-hover:block z-50">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
