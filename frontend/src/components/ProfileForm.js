import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function ProfileForm() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '',
    skills: [],
    projects: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/api/profile');
      setProfile(data);
      setFormData({
        rollNumber: data.rollNumber || '',
        name: data.name || '',
        cgpa: data.cgpa || '',
        skills: data.skills || [],
        projects: data.projects || ''
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'projects' ? parseInt(value) || '' : value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.find(s => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim(), level: 50 }]
      }));
      setNewSkill('');
    }
  };

  const handleLevelChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index].level = parseInt(value);
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleRemoveSkill = (nameToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== nameToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (profile) {
        await API.put('/api/profile', formData);
      } else {
        await API.post('/api/profile', formData);
      }
      setMessage('Profile saved successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save profile');
    }
  };

  if (loading) return <div className='text-center py-5'>Loading...</div>;

  return (
    <div className='bg-page-gradient min-vh-100 py-5'>
      <div className='container'>
        <Link to='/' className='btn btn-sm btn-outline-primary mb-3'>← Back to Dashboard</Link>

        <div className='row justify-content-center'>
          <div className='col-lg-6'>
            <div className='card shadow rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className='card-body p-4'>
                <h3 className='text-gradient fw-bold mb-4'>My Talent Profile</h3>
                
                {message && (
                  <div className={`alert alert-${message.includes('successfully') ? 'success' : 'danger'}`}>
                    {message}
                  </div>
                )}

                {profile && (
                  <div className='mb-4 p-3 bg-light rounded'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <p className='mb-1'><small className='text-muted'>SCORE</small></p>
                        <h4 className='text-primary fw-bold'>{profile.score || 0}</h4>
                      </div>
                      <div className='col-md-6'>
                        <p className='mb-1'><small className='text-muted'>RANK</small></p>
                        <h4 className='text-info fw-bold'>{profile.rank || 'N/A'}</h4>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <label className='form-label fw-bold'>Full Name</label>
                    <input
                      type='text'
                      name='name'
                      className='form-control'
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label fw-bold'>CGPA (0-10)</label>
                    <input
                      type='number'
                      name='cgpa'
                      className='form-control'
                      min='0'
                      max='10'
                      step='0.1'
                      value={formData.cgpa}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label fw-bold'>Number of Projects</label>
                    <input
                      type='number'
                      name='projects'
                      className='form-control'
                      min='0'
                      value={formData.projects}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='mb-4'>
                    <label className='form-label fw-bold text-secondary small text-uppercase spacing-wide'>Technical Talents</label>
                    <div className='bg-light p-4 rounded-4 border-Glow mb-4'>
                      <div className='row g-3 align-items-end'>
                        <div className='col-md-7'>
                          <label className='form-label small fw-bold text-muted mb-1'>TALENT</label>
                          <input
                            type='text'
                            className='form-control form-control-refined'
                            placeholder='e.g. React, Node.js, Python'
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                          />
                        </div>
                        <div className='col-md-5'>
                          <button
                            type='button'
                            className='btn btn-gradient w-100 py-3 shadow-sm'
                            onClick={handleAddSkill}
                            style={{ borderRadius: '12px' }}
                          >
                            <i className="bi bi-plus-lg me-2"></i> Add Talent
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='mt-4'>
                      {formData.skills.map((skill, idx) => {
                        const levelText = skill.level > 75 ? 'Expert' : skill.level > 40 ? 'Intermediate' : 'Learning';
                        const firstLetter = skill.name ? skill.name.charAt(0).toUpperCase() : 'S';
                        
                        return (
                        <div key={idx} className='card border-0 shadow-sm mb-2' style={{ borderRadius: '12px', backgroundColor: '#fff' }}>
                          <div className='card-body p-2 px-3 d-flex align-items-center'>

                            {/* Content */}
                            <div className='flex-grow-1 d-flex flex-column justify-content-center'>
                              <div className='d-flex justify-content-between align-items-center mb-1'>
                                <div className='d-flex align-items-center gap-2'>
                                  <h6 className='fw-bold mb-0 text-dark' style={{ fontSize: '0.85rem' }}>{skill.name}</h6>
                                  <span className='badge rounded-pill fw-semibold' style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', fontSize: '0.6rem', padding: '0.25em 0.5em' }}>
                                    {levelText}
                                  </span>
                                </div>
                                <div className='d-flex align-items-center'>
                                  <span className='fw-bold me-3' style={{ color: '#7c3aed', fontSize: '0.9rem' }}>{skill.level}%</span>
                                  <button
                                      type='button'
                                      className='btn btn-sm d-flex align-items-center justify-content-center'
                                      onClick={() => handleRemoveSkill(skill.name)}
                                      style={{ width: '28px', height: '28px', backgroundColor: 'rgba(124, 58, 237, 0.05)', color: '#7c3aed', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '6px' }}
                                  >
                                      <i className="bi bi-trash3" style={{ fontSize: '0.75rem' }}></i>
                                  </button>
                                </div>
                              </div>

                              {/* Progress Slider Container */}
                              <div className='mt-1 position-relative' style={{ height: '4px' }}>
                                <div className='progress w-100 position-absolute top-50 translate-middle-y rounded-pill' style={{ height: '4px', backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                                  <div className='progress-bar rounded-pill' style={{ width: `${skill.level}%`, background: 'linear-gradient(to right, #7B2FBE, #5B0E91)' }}></div>
                                </div>
                                {/* Invisible range input over the top for interactivity */}
                                <input
                                    type='range'
                                    className='form-range w-100 position-absolute top-50 translate-middle-y'
                                    min='0'
                                    max='100'
                                    value={skill.level}
                                    onChange={(e) => handleLevelChange(idx, e.target.value)}
                                    style={{ opacity: 0, height: '100%', cursor: 'pointer', zIndex: 5 }}
                                    title="Slide to adjust proficiency"
                                />
                              </div>
                            </div>

                          </div>
                        </div>
                      )})}
                      {formData.skills.length === 0 && (
                          <div className='text-center py-5 border rounded-4 border-dashed bg-white'>
                            <i className="bi bi-layers text-muted fs-1 mb-3 d-block"></i>
                            <p className='text-muted mb-0'>No talents added yet. Start by adding your top skills!</p>
                          </div>
                      )}
                    </div>
                  </div>

                  <button type='submit' className='btn btn-gradient w-100 py-3 fs-5 shadow mt-4' style={{ borderRadius: '15px' }}>
                    Save Profile Information
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
