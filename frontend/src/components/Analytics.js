import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/api/analytics/dashboard');
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setLoading(false);
    }
  };

  if (loading) return <div className='text-center py-5'>Loading...</div>;

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className='bg-page-gradient min-vh-100 py-5'>
      <div className='container-fluid'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='text-gradient fw-bold'>📊 Analytics Dashboard</h2>
          <Link to='/admin' className='btn btn-outline-primary'>← Back to Admin</Link>
        </div>

        {/* Stats Cards */}
        <div className='row mb-4'>
          <div className='col-md-3 mb-3'>
            <div className='card shadow rounded-3' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4 text-center'>
                <p className='text-muted fw-bold text-uppercase mb-2'>Total Students</p>
                <h2 className='text-primary fw-bold'>{stats?.totalStudents || 0}</h2>
              </div>
            </div>
          </div>
          <div className='col-md-3 mb-3'>
            <div className='card shadow rounded-3' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4 text-center'>
                <p className='text-muted fw-bold text-uppercase mb-2'>Avg CGPA</p>
                <h2 className='text-success fw-bold'>{stats?.avgCGPA || 0}</h2>
              </div>
            </div>
          </div>
          <div className='col-md-6 mb-3'>
            <div className='card shadow rounded-3' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4'>
                <p className='text-muted fw-bold text-uppercase mb-3'>Top 3 Students</p>
                <div>
                  {stats?.top3 && stats.top3.length > 0 ? (
                    stats.top3.map((student, idx) => (
                      <div key={idx} className='mb-2 pb-2' style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <div className='d-flex justify-content-between align-items-center'>
                          <div>
                            <small className='fw-bold'>{idx === 0 && '🥇 '}{idx === 1 && '🥈 '}{idx === 2 && '🥉 '}{student.name}</small>
                          </div>
                          <span className='badge bg-info'>{student.score}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-muted mb-0'>No students yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className='row'>
          <div className='col-lg-6 mb-4'>
            <div className='card shadow rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4'>
                <h4 className='fw-bold mb-4'>📊 Skills Distribution</h4>
                {stats?.skillsDistribution && stats.skillsDistribution.length > 0 ? (
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={stats.skillsDistribution}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='skill' />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey='count' fill='#8b5cf6' />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className='text-muted text-center py-5'>No skills data available</p>
                )}
              </div>
            </div>
          </div>

          <div className='col-lg-6 mb-4'>
            <div className='card shadow rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4'>
                <h4 className='fw-bold mb-4'>🥧 Top Skills Pie Chart</h4>
                {stats?.skillsDistribution && stats.skillsDistribution.length > 0 ? (
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={stats.skillsDistribution.slice(0, 6)}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ skill, count }) => `${skill} (${count})`}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='count'
                      >
                        {stats.skillsDistribution.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className='text-muted text-center py-5'>No skills data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='card shadow rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
          <div className='card-body p-4'>
            <h4 className='fw-bold mb-4'>📈 Skills Summary</h4>
            <div className='row'>
              {stats?.skillsDistribution && stats.skillsDistribution.slice(0, 6).map((item, idx) => (
                <div key={idx} className='col-md-2 mb-3'>
                  <div className='text-center p-3 border rounded-3' style={{ background: '#f8fafc' }}>
                    <p className='fw-bold mb-1'>{item.skill}</p>
                    <h5 className='text-primary fw-bold mb-0'>{item.count}</h5>
                    <small className='text-muted'>students</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
