import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '',
    skills: [], // Now an array of objects {name, level}
    projects: '',
    profilePic: ''
  });
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(50);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/api/profile');
      // Handle legacy string array or new object array
      const normalizedSkills = data.skills ? data.skills.map(s => 
        typeof s === 'string' ? { name: s, level: 50 } : s
      ) : [];

      setFormData({
        name: data.name || '',
        cgpa: data.cgpa || '',
        skills: normalizedSkills,
        projects: data.projects || '',
        profilePic: data.profilePic || ''
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
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      if (formData.skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
        alert('Skill already exists!');
        return;
      }
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkillName.trim(), level: newSkillLevel }]
      }));
      setNewSkillName('');
      setNewSkillLevel(50);
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillLevelChange = (index, level) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index].level = parseInt(level);
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.skills.length === 0) {
      setMessage({ type: 'danger', text: 'Please add at least one skill.' });
      return;
    }

    const processedData = {
      ...formData,
      cgpa: parseFloat(formData.cgpa),
      projects: parseInt(formData.projects) || 0
    };

    try {
      let profileExists = false;
      try {
        await API.get('/api/profile');
        profileExists = true;
      } catch (err) {
        profileExists = false;
      }

      if (profileExists) {
        await API.put('/api/profile', processedData);
      } else {
        await API.post('/api/profile', processedData);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully! Redirecting...' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || err.response?.data || 'Failed to update profile' });
    }
  };

  if (loading) return <div className='d-flex justify-content-center align-items-center min-vh-100 bg-page-gradient text-white'><h3>Loading Profile...</h3></div>;

  return (
    <div className='bg-page-gradient min-vh-100 py-5'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-11 col-md-8 col-lg-6'>
            <div className='card flex-row card-refined overflow-hidden'>
              <div className='card-body p-4 p-md-5'>
                <div className='d-flex align-items-center mb-4'>
                  <Link to="/" className='btn btn-link text-decoration-none p-0 me-3'>
                    <i className="bi bi-arrow-left-circle-fill fs-2" style={{ color: '#7c3aed' }}></i>
                  </Link>
                  <h2 className='m-0 fw-extrabold'><span className='text-gradient py-1' style={{ letterSpacing: '-0.02em' }}>Edit Profile</span></h2>
                </div>

                {message.text && (
                  <div className={`alert alert-${message.type} py-2 mb-4 small fw-bold border-0`} style={{ borderRadius: '10px' }}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className='mb-4 text-center'>
                    <div className='position-relative d-inline-block'>
                      {formData.profilePic ? (
                        <img 
                          src={formData.profilePic} 
                          alt="Profile Preview" 
                          className="rounded-circle mb-3 object-fit-cover shadow-sm" 
                          style={{ width: '120px', height: '120px', border: '3px solid #7c3aed' }} 
                        />
                      ) : (
                        <div 
                          className="rounded-circle mb-3 d-flex align-items-center justify-content-center bg-light shadow-sm"
                          style={{ width: '120px', height: '120px', border: '3px dashed #cbd5e1' }}
                        >
                          <i className="bi bi-person text-secondary" style={{ fontSize: '3rem' }}></i>
                        </div>
                      )}
                      
                      <div className="position-absolute bottom-0 end-0 mb-3" style={{ transform: 'translate(25%, 25%)' }}>
                        <label htmlFor="profileUpload" className="btn btn-sm btn-gradient rounded-circle shadow" style={{ width: '36px', height: '36px', padding: '6px' }}>
                          <i className="bi bi-camera-fill"></i>
                        </label>
                        <input 
                          id="profileUpload"
                          type="file" 
                          accept="image/*"
                          className="d-none"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='mb-4'>
                    <label className='form-label text-muted small fw-bold ps-1 mb-2'>FULL NAME</label>
                    <input 
                      type='text' 
                      name='name' 
                      className='form-control form-control-refined' 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder='Enter your full name'
                      required
                    />
                  </div>

                  <div className='row mb-4'>
                    <div className='col-md-6'>
                      <label className='form-label text-muted small fw-bold ps-1 mb-2'>CGPA (0-10)</label>
                      <input 
                        type='number' 
                        name='cgpa' 
                        step='0.01'
                        min='0'
                        max='10'
                        className='form-control form-control-refined' 
                        value={formData.cgpa}
                        onChange={handleChange}
                        placeholder='e.g. 8.5'
                        required
                      />
                    </div>
                    <div className='col-md-6 mt-4 mt-md-0'>
                      <label className='form-label text-muted small fw-bold ps-1 mb-2'>PROJECTS COUNT</label>
                      <input 
                        type='number' 
                        name='projects' 
                        min='0'
                        className='form-control form-control-refined' 
                        value={formData.projects}
                        onChange={handleChange}
                        placeholder='e.g. 5'
                        required
                      />
                    </div>
                  </div>

                  <div className='mb-5'>
                    <label className='form-label text-muted small fw-bold ps-1 mb-3'>TECHNICAL TALENTS & PROFICIENCY</label>
                    
                    {/* Add New Skill Input */}
                    <div className='p-3 bg-light rounded-4 border mb-4'>
                      <div className='row g-3 align-items-end'>
                        <div className='col-md-5'>
                          <label className='form-label small fw-bold text-muted mb-1'>TALENT NAME</label>
                          <input 
                            type='text' 
                            className='form-control form-control-refined' 
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder='e.g. React'
                          />
                        </div>
                        <div className='col-md-4'>
                          <label className='form-label small fw-bold text-muted mb-1'>LEVEL ({newSkillLevel}%)</label>
                          <input 
                            type='range' 
                            className='form-range custom-range mt-2' 
                            min='0' 
                            max='100' 
                            value={newSkillLevel}
                            onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                          />
                        </div>
                        <div className='col-md-3'>
                          <button 
                            type='button' 
                            className='btn btn-gradient w-100 fw-bold py-2 shadow-sm'
                            style={{ borderRadius: '10px' }}
                            onClick={handleAddSkill}
                          >
                            <i className="bi bi-plus-lg me-1"></i> Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Talent List */}
                    <div className='skill-list d-flex flex-column gap-2'>
                      {formData.skills.map((skill, index) => (
                        <div key={index} className='px-3 py-2 rounded-4 border bg-white shadow-sm transition-all hover-shadow'>
                          <div className='d-flex justify-content-between align-items-center mb-1'>
                            <span className='fw-bold text-dark small'>{skill.name}</span>
                            <button 
                              type='button' 
                              className='btn btn-link text-danger p-0'
                              onClick={() => handleRemoveSkill(index)}
                            >
                              <i className="bi bi-trash3-fill small"></i>
                            </button>
                          </div>
                          <div className='d-flex align-items-center gap-2'>
                            <input 
                              type='range' 
                              className='form-range custom-range flex-grow-1' 
                              min='0' 
                              max='100' 
                              style={{ height: '1.2rem' }}
                              value={skill.level}
                              onChange={(e) => handleSkillLevelChange(index, e.target.value)}
                            />
                            <span className='badge bg-indigo-subtle text-indigo fw-bold' style={{ minWidth: '40px', fontSize: '0.75rem' }}>
                              {skill.level}%
                            </span>
                          </div>
                        </div>
                      ))}
                      {formData.skills.length === 0 && (
                        <div className='text-center py-4 bg-light rounded-4 border border-dashed'>
                          <p className='text-muted small mb-0 fw-medium'>No skills added yet. Use the form above to add your technical expertise.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button type='submit' className='btn btn-gradient w-100 fw-bold py-3 mb-2 shadow' style={{ borderRadius: '14px', fontSize: '1rem', letterSpacing: '0.01em' }}>
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
