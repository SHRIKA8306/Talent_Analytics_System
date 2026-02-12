import React from 'react'

export default function StudentDashboard() {
  const handleLogout=()=>{
    localStorage.removeItem('token');
    window.location.href='/login';     
  }
  return (
    <div className='bg-page-gradient min-vh-100 py-5'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-11 col-lg-10 col-xl-8'>
            <div className='card shadow border-2 rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4 p-md-5'>
                <nav className='d-flex justify-content-between align-items-center mb-5'>
                  <h3 className='m-0 text-gradient'>TAS Portal</h3>
                  <button className='btn fw-bold shadow-sm btn-logout-gradient px-4 py-2' style={{ borderRadius: '10px' }} onClick={handleLogout}>Logout</button>
                </nav>
                <div className='text-center py-4'>
                  <h2 className='mb-3 fw-bold'>Welcome Back, <span className='text-gradient'>Student!</span></h2>
                  <h4 className='text-muted mb-4'>Showcase your talents and track your progress!</h4>
                  <div className='p-4 rounded-3' style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p className='mb-0 fw-semibold text-secondary'>You are securely logged in. This dashboard is protected by your JWT token.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
