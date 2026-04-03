import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import SkillAnalytics from './SkillAnalytics';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [showScoreTooltip, setShowScoreTooltip] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: userData } = await API.get('/api/me');
      setUser(userData);

      try {
        const { data: dashboardData } = await API.get('/api/student/dashboard');
        const { data: rankData } = await API.get('/api/student/rank');
        const { data: insightsData } = await API.get('/api/student/insights');

        setProfile({ ...dashboardData, rank: rankData.rank, totalStudents: rankData.totalStudents });
        setInsights(insightsData);
      } catch (err) {
        console.log('Profile not found');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '/login';
  }

  if (loading) return <div className='d-flex justify-content-center align-items-center min-vh-100 bg-page-gradient text-white'><h3>Loading Dashboard...</h3></div>;

  return (
    <div className='bg-page-gradient min-vh-100 py-4 py-md-5'>
      <div className='container px-3 px-md-5' style={{ maxWidth: '1250px', margin: '0 auto' }}>
        {/* Navbar-style header */}
        <div className='row mb-4'>
          <div className='col-12'>
            <div className='card card-refined border-0 shadow-sm'>
              <div className='card-body px-4 py-3 d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <h4 className='m-0 fw-bold me-4'><span className='text-gradient fw-extrabold' style={{ letterSpacing: '-0.02em' }}>Tech Talent</span></h4>
                  <Link to='/' className='btn btn-gradient btn-sm me-2 px-3 fw-bold shadow-sm'>Dashboard</Link>
                  <Link to='/career-insights' className='btn btn-outline-light btn-sm px-3 fw-bold text-dark border-secondary opacity-75'>Career Insights</Link>
                </div>
                <div className='d-flex align-items-center'>
                  <span className='text-muted small fw-bold me-4 d-none d-sm-inline'>{user?.email}</span>
                  <button className='btn btn-logout-gradient fw-bold' onClick={handleLogout}>Log out</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className='row mb-4'>
          <div className='col-12'>
            <div className='card border-0 rounded-5 shadow-lg overflow-hidden' style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}>
              <div className='card-body p-4 p-md-4 text-white position-relative'>
                <div className='row align-items-center position-relative' style={{ zIndex: 1 }}>
                  <div className='col-auto mb-2 mb-md-0'>
                    {profile?.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        className='rounded-circle border border-3 border-white shadow'
                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setIsImageEnlarged(true)}
                      />
                    ) : (
                      <div className='bg-white rounded-circle d-flex align-items-center justify-content-center text-primary shadow' style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-person-fill fs-1"></i>
                      </div>
                    )}
                  </div>
                  <div className='col'>
                    <h1 className='fw-bold mb-1' style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Welcome, {profile?.name || user?.username}! 👋</h1>
                    <p className='mb-0 opacity-90 fw-medium small'>Keep building your skills and projects to improve your rank.</p>
                  </div>
                  <div className='col-md-auto mt-3 mt-md-0'>
                    <Link to="/profile" className='btn btn-light btn-md px-4 py-2 fw-bold shadow hover-up' style={{ borderRadius: '12px', zIndex: 10, position: 'relative', color: '#7c3aed' }}>
                      Update Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {profile ? (
          <>
            {/* Score and Ranking Row */}
            <div className='row mb-4 g-4'>
              <div className='col-md-6' style={{ zIndex: showScoreTooltip ? 1000 : 1, position: 'relative' }}>
                <div
                  className='card card-refined text-center p-2 border-0 shadow h-100 position-relative'
                  onMouseEnter={() => setShowScoreTooltip(true)}
                  onMouseLeave={() => setShowScoreTooltip(false)}
                >
                  <div className='card-body d-flex flex-column align-items-center justify-content-center py-1'>
                    <div className='rounded-circle d-inline-flex align-items-center justify-content-center mb-2'
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'rgba(124, 58, 237, 0.12)',
                        color: '#7c3aed',
                        boxShadow: '-3px 3px 0px #7c3aed'
                      }}>
                      <i className="bi bi-star-fill fs-4"></i>
                    </div>
                    <p className='text-muted small fw-bold text-uppercase mb-1' style={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>Your Talent Score</p>
                    <h1 className='display-5 fw-extrabold text-gradient mb-0 w-100 d-inline-block' style={{ position: 'relative' }}>
                      {profile.totalScore?.toFixed(1) || 0}
                    </h1>
                    {/* Tooltip Overlay */}
                    {showScoreTooltip && profile.breakdown && (
                      <div
                        className="position-absolute text-white p-3 shadow-lg text-start"
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                          left: '100%',
                          marginLeft: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1000,
                          width: '240px',
                          borderRadius: '16px'
                        }}
                      >
                        <div className="fw-bold mb-3 small text-uppercase" style={{ letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>
                          Score Breakdown
                        </div>

                        {/* CGPA */}
                        <div className="d-flex align-items-center mb-3">
                          <div style={{ width: '55px', fontSize: '0.8rem' }}>CGPA</div>
                          <div className="progress flex-grow-1 mx-2 overflow-visible" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
                            <div className="progress-bar rounded-pill" style={{ width: `${Math.min((profile.breakdown.cgpa / 100) * 100, 100)}%`, backgroundColor: '#fff', boxShadow: '0 0 6px rgba(255,255,255,0.4)' }}></div>
                          </div>
                          <div className="fw-bold text-end" style={{ width: '35px', fontSize: '0.85rem' }}>{profile.breakdown.cgpa.toFixed(1)}</div>
                        </div>

                        {/* Skills */}
                        <div className="d-flex align-items-center mb-3">
                          <div style={{ width: '55px', fontSize: '0.8rem' }}>Skills</div>
                          <div className="progress flex-grow-1 mx-2 overflow-visible" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
                            <div className="progress-bar rounded-pill" style={{ width: `${Math.min((profile.breakdown.skills / 100) * 100, 100)}%`, backgroundColor: '#fff', boxShadow: '0 0 6px rgba(255,255,255,0.4)' }}></div>
                          </div>
                          <div className="fw-bold text-end" style={{ width: '35px', fontSize: '0.85rem' }}>{profile.breakdown.skills.toFixed(1)}</div>
                        </div>

                        {/* Projects */}
                        <div className="d-flex align-items-center mb-4">
                          <div style={{ width: '55px', fontSize: '0.8rem' }}>Projects</div>
                          <div className="progress flex-grow-1 mx-2 overflow-visible" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
                            <div className="progress-bar rounded-pill" style={{ width: `${Math.min((profile.breakdown.projects / 100) * 100, 100)}%`, backgroundColor: '#fff', boxShadow: '0 0 6px rgba(255,255,255,0.4)' }}></div>
                          </div>
                          <div className="fw-bold text-end" style={{ width: '35px', fontSize: '0.85rem' }}>{profile.breakdown.projects.toFixed(1)}</div>
                        </div>

                        <div className="border-top border-light border-opacity-25 pt-2 d-flex justify-content-between align-items-end mt-1">
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Total score</span>
                          <span className="fw-bold fs-5" style={{ lineHeight: 1 }}>{profile.totalScore?.toFixed(1) || 0}</span>
                        </div>

                        {/* Tooltip Arrow pointing left */}
                        <div className="position-absolute" style={{ top: '50%', left: '-8px', transform: 'translateY(-50%)', width: '0', height: '0', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid #7c3aed' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='card card-refined text-center p-2 border-0 shadow h-100'>
                  <div className='card-body d-flex flex-column align-items-center justify-content-center py-1'>
                    <div className='rounded-circle d-inline-flex align-items-center justify-content-center mb-2'
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'rgba(219, 39, 119, 0.12)',
                        color: '#db2777'
                      }}>
                      <i className="bi bi-people-fill fs-4"></i>
                    </div>
                    <p className='text-muted small fw-bold text-uppercase mb-1' style={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>Your Rank</p>
                    <h1 className='display-5 fw-extrabold text-gradient mb-0'>{profile.rank || '--'}</h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Statistics */}
            <div className='row g-4 mb-4'>
              <div className='col-md-4'>
                <div className='card card-refined py-3 text-center border-0 shadow-sm'>
                  <h3 className='fw-bold text-gradient mb-0'>{profile.cgpa || 0}</h3>
                  <p className='text-muted small fw-bold mb-0 text-uppercase' style={{ fontSize: '0.7rem' }}>CGPA</p>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='card card-refined py-3 text-center border-0 shadow-sm'>
                  <h3 className='fw-bold text-gradient mb-0'>{profile.skills?.length || 0}</h3>
                  <p className='text-muted small fw-bold mb-0 text-uppercase' style={{ fontSize: '0.7rem' }}>Skills</p>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='card card-refined py-3 text-center border-0 shadow-sm'>
                  <h3 className='fw-bold text-gradient mb-0'>{profile.projects || 0}</h3>
                  <p className='text-muted small fw-bold mb-0 text-uppercase' style={{ fontSize: '0.7rem' }}>Projects</p>
                </div>
              </div>
            </div>

            {/* Talent Analytics Section */}
            <div className='row mb-4'>
              <div className='col-12'>
                <SkillAnalytics />
              </div>
            </div>
          </>
        ) : (
          <div className='row'>
            <div className='col-12'>
              <div className='card border-0 rounded-5 shadow-lg' style={{ background: 'rgba(255, 255, 255, 0.98)' }}>
                <div className='card-body p-5 text-center'>
                  <div className='bg-light d-inline-flex align-items-center justify-content-center rounded-circle mb-4' style={{ width: '100px', height: '100px' }}>
                    <i className="bi bi-person-bounding-box display-4 text-muted"></i>
                  </div>
                  <h2 className='fw-bold mb-3'>Create Your Talent Profile</h2>
                  <p className='text-muted mb-4 mx-auto' style={{ maxWidth: '400px' }}>
                    Unlock your personalized analytics, score, and rank by creating your talent profile today.
                  </p>
                  <Link to="/profile" className='btn btn-gradient btn-lg px-5 py-3 fw-bold shadow' style={{ borderRadius: '15px' }}>
                    Get Started Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='text-center mt-5 mb-4'>
          <p className='text-white-50 small fw-bold'>Tech Talent © 2026</p>
        </div>
      </div>

      {/* Fullscreen Image Overlay */}
      {isImageEnlarged && profile?.profilePic && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999, backdropFilter: 'blur(5px)', cursor: 'zoom-out' }}
          onClick={() => setIsImageEnlarged(false)}
        >
          <div className="position-absolute top-0 end-0 p-4">
            <button
              className="btn btn-link text-white fs-1 p-0 text-decoration-none"
              onClick={(e) => { e.stopPropagation(); setIsImageEnlarged(false); }}
            >
              &times;
            </button>
          </div>
          <img
            src={profile.profilePic}
            alt="Enlarged Profile"
            className="rounded shadow-lg"
            style={{ maxWidth: '350px', maxHeight: '350px', width: '90%', objectFit: 'contain', cursor: 'default' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
