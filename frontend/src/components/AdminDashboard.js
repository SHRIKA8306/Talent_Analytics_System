import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await API.get('/api/analytics/students?');
      setStudents(data);
      setFilteredStudents(data);
      
      // Extract all unique skills
      const skillsSet = new Set();
      data.forEach(student => {
        student.skills?.forEach(skill => skillsSet.add(skill));
      });
      setAllSkills(Array.from(skillsSet).sort());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const params = new URLSearchParams();
      if (searchName) params.append('search', searchName);
      if (minCgpa) params.append('minCgpa', minCgpa);
      if (filterSkill) params.append('skill', filterSkill);

      const { data } = await API.get(`/api/analytics/students?${params.toString()}`);
      setFilteredStudents(data);
    } catch (err) {
      console.error('Error filtering students:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (loading) return <div className='text-center py-5'><p>Loading...</p></div>;

  return (
    <div className='bg-page-gradient min-vh-100 py-5'>
      <div className='container-fluid'>
        {/* Top Navigation */}
        <div className='row mb-4'>
          <div className='col-12'>
            <div style={{ background: 'linear-gradient(135deg, #7779f3 0%, #a855f7 50%, #ec4899 100%)', padding: '20px 30px', borderRadius: '12px', color: 'white' }}>
              <div className='d-flex justify-content-between align-items-center'>
                <h3 className='m-0 fw-bold'>🎯 Admin Portal</h3>
                <button className='btn btn-light fw-bold' onClick={handleLogout}>LOGOUT</button>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          {/* Sidebar */}
          <div className='col-md-3 mb-4'>
            <div className='card shadow rounded-4 mb-3' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4'>
                <h5 className='fw-bold mb-3'>Navigation</h5>
                <nav className='nav flex-column'>
                  <Link to='/admin' className='nav-link text-dark fw-bold px-0 py-2 mb-2'>
                    📊 Students
                  </Link>
                  <Link to='/leaderboard' className='nav-link text-dark fw-bold px-0 py-2'>
                    🏆 Leaderboard
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='col-md-9'>
            {/* Header */}
            <div className='card shadow rounded-4 mb-4' style={{ background: 'linear-gradient(135deg, #7779f3 0%, #a855f7 50%, #ec4899 100%)', color: 'white' }}>
              <div className='card-body p-5'>
                <h2 className='fw-bold mb-2'>👥 Student Management</h2>
                <p className='mb-0'>Total Students: <strong>{students.length}</strong></p>
              </div>
            </div>

            {/* Filter Section */}
            <div className='card shadow rounded-4 mb-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4'>
                <h4 className='fw-bold mb-4'>🔍 Filters & Search</h4>
                <div className='row mb-3'>
                  <div className='col-md-4 mb-3'>
                    <label className='form-label fw-bold'>Search by Name</label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Enter student name'
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                  </div>
                  <div className='col-md-4 mb-3'>
                    <label className='form-label fw-bold'>Minimum CGPA</label>
                    <input
                      type='number'
                      className='form-control'
                      placeholder='Enter minimum CGPA'
                      min='0'
                      max='10'
                      step='0.1'
                      value={minCgpa}
                      onChange={(e) => setMinCgpa(e.target.value)}
                    />
                  </div>
                  <div className='col-md-4 mb-3'>
                    <label className='form-label fw-bold'>Filter by Skill</label>
                    <select
                      className='form-control'
                      value={filterSkill}
                      onChange={(e) => setFilterSkill(e.target.value)}
                    >
                      <option value=''>All Skills</option>
                      {allSkills.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button className='btn btn-gradient fw-bold' onClick={handleFilter}>Apply Filters</button>
                <button className='btn btn-outline-secondary fw-bold ms-2' onClick={() => {
                  setSearchName('');
                  setMinCgpa('');
                  setFilterSkill('');
                  setFilteredStudents(students);
                }}>Clear Filters</button>
              </div>
            </div>

            {/* Students Table */}
            <div className='card shadow rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4'>
                <h4 className='fw-bold mb-4'>📋 Students List</h4>
                <div className='table-responsive'>
                  <table className='table table-hover'>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className='fw-bold'>Rank</th>
                        <th className='fw-bold'>Name</th>
                        <th className='fw-bold'>CGPA</th>
                        <th className='fw-bold'>Projects</th>
                        <th className='fw-bold'>Skills</th>
                        <th className='fw-bold'>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, idx) => (
                          <tr key={student._id}>
                            <td className='fw-bold text-primary'>{student.rank || idx + 1}</td>
                            <td className='fw-bold'>{student.name}</td>
                            <td>{student.cgpa}</td>
                            <td>{student.projects}</td>
                            <td>
                              <div className='d-flex flex-wrap gap-1'>
                                {student.skills && student.skills.length > 0 ? (
                                  student.skills.slice(0, 2).map((skill, idx) => (
                                    <span key={idx} className='badge bg-info text-dark'>{skill}</span>
                                  ))
                                ) : (
                                  <span className='text-muted'>-</span>
                                )}
                                {student.skills && student.skills.length > 2 && (
                                  <span className='badge bg-secondary'>+{student.skills.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className='fw-bold text-success'>{student.score}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='6' className='text-center text-muted py-4'>No students found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
