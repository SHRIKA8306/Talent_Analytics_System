import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Leaderboard() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get('/api/profile/leaderboard/all');
      setProfiles(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLoading(false);
    }
  };

  return (
    <div className='bg-page-gradient min-vh-100 py-5'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='text-gradient fw-extrabold pb-1' style={{ fontSize: '2.4rem', letterSpacing: '-0.02em' }}>🏆 Leaderboard</h2>
          <Link to='/' className='btn btn-gradient btn-md px-4 py-2 fw-bold shadow' style={{ borderRadius: '12px' }}>← Back to Dashboard</Link>
        </div>

        <div className='card shadow rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
          <div className='card-body p-4'>
            {loading ? (
              <div className='text-center'><p>Loading...</p></div>
            ) : profiles.length === 0 ? (
              <div className='alert alert-info mb-0'>No student profiles available yet</div>
            ) : (
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className='fw-bold'>Rank</th>
                      <th className='fw-bold'>Student</th>
                      <th className='fw-bold'>CGPA</th>
                      <th className='fw-bold'>Projects</th>
                      <th className='fw-bold'>Skills</th>
                      <th className='fw-bold'>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile, idx) => (
                      <tr key={profile._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td className='fw-bold'>
                          {idx === 0 && <span className='badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 fw-extrabold' style={{ borderRadius: '10px' }}>🥇 #1</span>}
                          {idx === 1 && <span className='badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 fw-extrabold' style={{ borderRadius: '10px' }}>🥈 #2</span>}
                          {idx === 2 && <span className='badge bg-info-subtle text-info border border-info-subtle px-3 py-2 fw-extrabold' style={{ borderRadius: '10px' }}>🥉 #3</span>}
                          {idx > 2 && <span className='text-muted fw-bold ps-2'>#{idx + 1}</span>}
                        </td>
                        <td className='fw-bold'>
                          <div className='d-flex align-items-center'>
                            {profile.profilePic ? (
                              <img src={profile.profilePic} alt={profile.name} className='rounded-circle me-3 object-fit-cover shadow-sm' style={{ width: '40px', height: '40px', border: '2px solid #7c3aed' }} />
                            ) : (
                              <div className='rounded-circle me-3 d-flex align-items-center justify-content-center bg-light shadow-sm' style={{ width: '40px', height: '40px', border: '2px dashed #cbd5e1' }}>
                                <i className="bi bi-person text-secondary"></i>
                              </div>
                            )}
                            {profile.name}
                          </div>
                        </td>
                        <td>{profile.cgpa}</td>
                        <td>{profile.projects}</td>
                        <td>
                          <div className='d-flex flex-wrap gap-1'>
                            {profile.skills && profile.skills.length > 0 ? (
                              profile.skills.slice(0, 2).map((skill, idx) => (
                                <span key={idx} className='badge bg-primary' style={{ fontSize: '0.75rem' }}>{skill}</span>
                              ))
                            ) : (
                              <span className='text-muted'>-</span>
                            )}
                            {profile.skills && profile.skills.length > 2 && (
                              <span className='badge bg-secondary' style={{ fontSize: '0.75rem' }}>+{profile.skills.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className='badge bg-success' style={{ fontSize: '0.9rem', padding: '5px 10px' }}>
                            {profile.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
