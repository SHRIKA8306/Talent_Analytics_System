import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'
import SkillAnalytics from './SkillAnalytics';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      <div className='container-fluid px-3 px-md-5' style={{ maxWidth: '1400px' }}>
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
                      <img src={profile.profilePic} alt="Profile" className='rounded-circle border border-3 border-white shadow' style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
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
                    <Link to="/profile" className='btn btn-light btn-md px-4 py-2 fw-bold text-primary shadow hover-up' style={{ borderRadius: '12px', zIndex: 10, position: 'relative' }}>
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
              <div className='col-md-6'>
                <div className='card card-refined text-center p-3 border-0 shadow h-100'>
                  <div className='card-body d-flex flex-column align-items-center justify-content-center py-2'>
                    <div className='bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2' style={{ width: '60px', height: '60px' }}>
                      <i className="bi bi-star-fill text-primary fs-4"></i>
                    </div>
                    <p className='text-muted small fw-bold text-uppercase mb-1' style={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>Your Talent Score</p>
                    <h1 className='display-5 fw-extrabold text-gradient mb-1'>{profile.totalScore || 0}</h1>
                    <p className='text-muted' style={{ fontSize: '0.75rem' }}>Calculated from CGPA, Skills, and Projects</p>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='card card-refined text-center p-3 border-0 shadow h-100'>
                  <div className='card-body d-flex flex-column align-items-center justify-content-center py-2'>
                    <div className='bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2' style={{ width: '60px', height: '60px' }}>
                      <i className="bi bi-trophy-fill text-danger fs-4"></i>
                    </div>
                    <p className='text-muted small fw-bold text-uppercase mb-1' style={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>Your Ranking</p>
                    <h1 className='display-5 fw-extrabold text-dark mb-1'>#{profile.rank || '--'}</h1>
                    <p className='text-muted' style={{ fontSize: '0.75rem' }}>Out of {profile.totalStudents || 1} students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Statistics */}
            <div className='row g-4 mb-4'>
              <div className='col-md-4'>
                <div className='card card-refined py-3 text-center border-0 shadow-sm'>
                  <h3 className='fw-bold text-primary mb-0'>{profile.cgpa || 0}</h3>
                  <p className='text-muted small fw-bold mb-0 text-uppercase' style={{ fontSize: '0.7rem' }}>CGPA</p>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='card card-refined py-3 text-center border-0 shadow-sm'>
                  <h3 className='fw-bold text-info mb-0'>{profile.skills?.length || 0}</h3>
                  <p className='text-muted small fw-bold mb-0 text-uppercase' style={{ fontSize: '0.7rem' }}>Skills</p>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='card card-refined py-3 text-center border-0 shadow-sm'>
                  <h3 className='fw-bold text-success mb-0'>{profile.projects || 0}</h3>
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
    </div>
  )
}
