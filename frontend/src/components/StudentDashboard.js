import React from 'react'

export default function StudentDashboard() {
  const handleLogout=()=>{
    localStorage.removeItem('token');
    window.location.href='/login';     
  }
  return (
    <div className='container py-5'>
      <nav className='d-flex justify-content-between align-items-center mb-4'>
           <h3 className='m-0 text-gradient'>TAS Portal</h3>
           <button className='btn fw-bold shadow-sm btn-logout-gradient' style={{ padding: '5px 15px' }} onClick={handleLogout}>Logout</button>
      </nav>
      <div className='text-center'>
        <h4>Welcome Student! Showcase your talents!</h4>
        <p className='text-muted'>You are Logged in. The page is protected by your JWT.</p>
      </div>
    </div>
  )
}
