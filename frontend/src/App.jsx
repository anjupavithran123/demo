import { Routes, Route } from 'react-router-dom'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import WorkspaceLayout from './pages/workspace/workspaceLayout'
import ChatPanel from './pages/workspace/chatpannel'
import ProfilePanel from './pages/workspace/profilepannel'
import './index.css';
function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/workspace/:id" element={<WorkspaceLayout />} />
      <Route path="/chatpannel" element={<ChatPanel />} />
      <Route path="/profile" element={<ProfilePanel />} />


    </Routes>
  )
}

export default App
