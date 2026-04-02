import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import API from '../api'

export default function CareerInsights() {
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
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
        const { data: recommendationData } = await API.get('/api/student/recommendation');

        setProfile(dashboardData);
        setAnalysis(recommendationData);
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

  const handleGetAIAdvice = async () => {
    setAiLoading(true);
    setAiAdvice('');
    try {
      const payload = {
        skills: profile.skills.map(s => typeof s === 'string' ? { name: s, level: 50 } : s),
        recommendedRole: analysis.recommendedRole,
        matchPercentage: analysis.matchPercentage,
        missingSkills: analysis.missingSkills || []
      };

      const { data } = await API.post('/api/ai/advice', payload);
      setAiAdvice(data.advice);
    } catch (err) {
      console.error('Error fetching AI advice:', err);
      const errorMsg = err.response?.data?.details || err.response?.data?.error || 'Service temporarily unavailable. Please try again later.';
      setAiAdvice(`Error: ${errorMsg}`);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className='d-flex justify-content-center align-items-center min-vh-100 bg-page-gradient text-white'><h3>Loading Data...</h3></div>;

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
                  <Link to='/' className='btn btn-outline-light btn-sm me-2 px-3 fw-bold text-dark border-secondary opacity-75'>Dashboard</Link>
                  <Link to='/career-insights' className='btn btn-gradient btn-sm px-3 fw-bold shadow-sm'>Career Insights</Link>
                </div>
                <div className='d-flex align-items-center'>
                  <span className='text-muted small fw-bold me-4 d-none d-sm-inline'>{user?.email}</span>
                  <button className='btn btn-logout-gradient fw-bold' onClick={handleLogout}>Log out</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {profile ? (
          <>
            <div className='mb-4 d-flex justify-content-between align-items-center'>
              <h2 className='text-white fw-bold'>Talents & Recommendation</h2>
            </div>

            {/* Detailed Skills Section */}
            <div className='row mb-4'>
              <div className='col-12'>
                <div className='card card-refined border-0 shadow-sm'>
                  <div className='card-body p-4 p-md-5'>
                    <h5 className='fw-bold mb-4 d-flex align-items-center text-dark'>
                      Talents Summary
                    </h5>
                    {profile.skills && profile.skills.length > 0 ? (
                      <div className='d-flex flex-wrap gap-2'>
                        {profile.skills.map((skill, idx) => {
                          const sName = typeof skill === 'string' ? skill : skill.name;
                          return (
                            <div key={idx} className='px-4 py-2 rounded-pill bg-light border fw-semibold text-secondary' style={{ fontSize: '0.85rem' }}>
                              {sName}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className='text-center py-5 bg-light rounded-4 border border-dashed'>
                        <p className='text-muted mb-0 fw-medium'>No skills added. Update your profile to display them.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Insights Section */}
            {analysis && (
              <div className='row mb-4'>
                <div className='col-12'>
                  <div className='card card-refined border-0 shadow-sm'>
                    <div className='card-body p-4 p-md-5'>
                      <h5 className='fw-bold mb-4 d-flex align-items-center text-dark'>
                        Career Insights & Recommendation
                      </h5>

                      <div className='row align-items-center mb-4 g-4'>
                        <div className='col-md-6'>
                          <div className='p-4 h-100 bg-light rounded-4 border'>
                            <p className='text-muted small fw-bold mb-1 text-uppercase'>Recommended Role</p>
                            <h3 className='fw-bold text-primary mb-0'>{analysis.recommendedRole}</h3>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='p-4 h-100 bg-light rounded-4 border d-flex flex-column justify-content-center'>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                              <p className='text-muted small fw-bold mb-0 text-uppercase'>Role Compatibility Match</p>
                              <h4 className='fw-bold mb-0 text-success'>{analysis.matchPercentage}%</h4>
                            </div>
                            <div className='progress bg-secondary bg-opacity-25 mb-2' style={{ height: '12px', borderRadius: '10px' }}>
                              <div className='progress-bar bg-success progress-bar-striped progress-bar-animated' role='progressbar' style={{ width: `${analysis.matchPercentage}%` }} aria-valuenow={analysis.matchPercentage} aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='row g-4 mb-5'>
                        <div className='col-md-6'>
                          <h6 className='fw-bold d-flex align-items-center mb-3'><div className='bg-success rounded-circle me-2' style={{ width: '8px', height: '8px' }}></div> Matched Talents <span className='badge bg-success ms-2 px-2 rounded-pill'>{analysis.matchedSkills?.length || 0}</span></h6>
                          {analysis.matchedSkills?.length > 0 ? (
                            <div className='d-flex flex-wrap gap-2'>
                              {analysis.matchedSkills.map((skill, idx) => (
                                <span key={idx} className='fw-semibold px-3 py-1 bg-success bg-opacity-10 text-success border border-success border-opacity-50' style={{ borderRadius: '8px', fontSize: '0.85rem' }}>
                                  <i className="bi bi-check-circle me-1 small"></i> {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className='text-muted small'>No matching skills found.</p>
                          )}
                        </div>
                        <div className='col-md-6'>
                          <h6 className='fw-bold d-flex align-items-center mb-3'><div className='bg-danger rounded-circle me-2' style={{ width: '8px', height: '8px' }}></div> Missing Talents to Learn <span className='badge bg-danger ms-2 px-2 rounded-pill'>{analysis.missingSkills?.length || 0}</span></h6>
                          {analysis.missingSkills?.length > 0 ? (
                            <div className='d-flex flex-wrap gap-2'>
                              {analysis.missingSkills.map((skill, idx) => (
                                <span key={idx} className={`fw-semibold px-3 py-1 bg-danger bg-opacity-10 text-danger border border-danger border-opacity-50`} style={{ borderRadius: '8px', fontSize: '0.85rem' }}>
                                  <i className="bi bi-exclamation-circle me-1 small"></i> {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className='text-muted small text-success fw-bold d-flex align-items-center'>
                              <i className="bi bi-patch-check-fill me-2 fs-5"></i> You've met all the standard skill requirements!
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='row g-4 mt-4'>
                        <div className='col-12'>
                          <h2 className='fw-bold mb-4 text-center'>Best-Fit Roles for You</h2>
                          {analysis.topRoles && analysis.topRoles.length > 0 && (
                            <div style={{ width: '100%', height: 300 }}>
                              <ResponsiveContainer>
                                <PieChart>
                                  <Pie
                                    data={analysis.topRoles}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="matchPercentage"
                                    nameKey="role"
                                    label={({ role, matchPercentage }) => `${role} (${matchPercentage}%)`}
                                  >
                                    {analysis.topRoles.map((entry, index) => {
                                      const COLORS = ['#7c3aed', '#0ea5e9', '#f59e0b', '#64748b']; // Indigo, Sky, Amber, Slate
                                      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                                    })}
                                  </Pie>
                                  <Tooltip formatter={(value) => [`${value}%`, 'Match']} />
                                  <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* AI Career Advisor Section */}
                      <div className='border-top pt-5 mt-4'>
                        <div className='row align-items-center'>
                          <div className='col-md-8'>
                            <h5 className='fw-bold mb-2 d-flex align-items-center text-dark'>
                              AI Career Advisor
                            </h5>
                            <p className='text-muted small mb-0'>Get personalized, AI-driven career guidance based on your unique skill set and compatible roles.</p>
                          </div>
                          <div className='col-md-4 text-md-end mt-3 mt-md-0'>
                            <button 
                              className='btn btn-gradient text-white fw-bold px-4 py-3 rounded-4 shadow-sm' 
                              onClick={handleGetAIAdvice}
                              disabled={aiLoading}
                            >
                              {aiLoading ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Thinking...</>
                              ) : (
                                <><i className="bi bi-stars me-2"></i> Get AI Advice</>
                              )}
                            </button>
                          </div>
                        </div>

                        {aiAdvice && (
                          <div className='mt-4 p-4 rounded-4 border-Glow premium-ai-card'>
                            <div className='d-flex align-items-start mb-2'>
                              <div>
                                <h6 className='fw-bold text-dark mb-1'>Expert Recommendation</h6>
                                <p className='mb-0 text-secondary' style={{ lineHeight: '1.6', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                                  {aiAdvice}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}
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
