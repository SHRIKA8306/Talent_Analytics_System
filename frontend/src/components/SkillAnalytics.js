import React, { useState, useEffect } from 'react';
import API from '../api';

const CircularProgress = ({ value, label, color, delay }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Staggered animation
    const timer = setTimeout(() => setProgress(value), delay * 150 + 100);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="d-flex flex-column align-items-center mb-4 mx-3">
      <div className="position-relative shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px', background: '#fff' }}>
        <svg width="90" height="90" viewBox="0 0 90 90" className="position-absolute top-0 start-0">
          <circle cx="45" cy="45" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx="45" cy="45" r={radius} fill="none" stroke={color}
            strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" transform="rotate(-90 45 45)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="fw-bold" style={{ fontSize: '0.95rem', color: color }}>
          {progress}
        </div>
      </div>
      <span className="mt-3 fw-bold text-secondary text-capitalize" style={{ fontSize: '0.85rem' }}>{label}</span>
    </div>
  );
};

export default function SkillAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/api/student/skill-analytics');
        setAnalytics(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching skill analytics:', err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className='text-center py-4'><div className="spinner-border text-primary" role="status"></div></div>;
  
  if (!analytics || !analytics.skills || analytics.skills.length === 0) {
    return (
      <div className='card card-refined border-0 shadow-sm'>
        <div className='card-body text-center py-5'>
          <i className="bi bi-bar-chart text-muted display-4"></i>
          <p className='mt-3 text-muted fw-semibold'>Add skills in your profile to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='card card-refined border-0 shadow-sm overflow-hidden'>
      <div className='card-header bg-white border-0 pt-4 px-4'>
        <h5 className='fw-bold mb-0 text-dark'>Talent Analytics</h5>
        <p className='text-muted small mb-0'>Visualization of your technical proficiency levels</p>
      </div>
      <div className='card-body p-4'>

        <div className='row g-4 mb-4'>
          <div className='col-md-4'>
            <div className='p-3 rounded-4 border bg-light h-100'>
              <small className='text-muted fw-bold text-uppercase' style={{ fontSize: '0.65rem' }}>Strongest Skill</small>
              <div className='d-flex align-items-center mt-1'>
                <span className='fw-bold text-success me-2'>{analytics.strongestSkill?.name}</span>
                <span className='badge bg-success bg-opacity-10 text-success rounded-pill'>{analytics.strongestSkill?.level}%</span>
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='p-3 rounded-4 border bg-light h-100'>
              <small className='text-muted fw-bold text-uppercase' style={{ fontSize: '0.65rem' }}>Weakest Area</small>
              <div className='d-flex align-items-center mt-1'>
                <span className='fw-bold text-danger me-2'>{analytics.weakestSkill?.name}</span>
                <span className='badge bg-danger bg-opacity-10 text-danger rounded-pill'>{analytics.weakestSkill?.level}%</span>
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='p-3 rounded-4 border bg-light h-100'>
              <small className='text-muted fw-bold text-uppercase' style={{ fontSize: '0.65rem' }}>Overall Mastery</small>
              <div className='d-flex align-items-center mt-1'>
                <span className='fw-bold text-primary me-2'>{analytics.averageSkillLevel}%</span>
                <span className='badge bg-primary bg-opacity-10 text-primary rounded-pill'>Avg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-center pt-3 pb-2 bg-light rounded-4 border border-1 border-light">
          {analytics.skills.map((skill, index) => {
            const ringColors = ['#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#14b8a6', '#84cc16', '#a855f7'];
            const color = ringColors[index % ringColors.length];
            return (
              <CircularProgress 
                key={index} 
                value={skill.level} 
                label={skill.name} 
                color={color} 
                delay={index} 
              />
            );
          })}
        </div>

        {analytics.weakSkills && analytics.weakSkills.length > 0 && (
          <div className='mt-4 p-3 rounded-4 border bg-danger bg-opacity-10'>
            <p className='text-danger fw-bold small mb-2'><i className="bi bi-exclamation-triangle-fill me-2"></i> Areas for Improvement</p>
            <div className='d-flex flex-wrap gap-2'>
              {analytics.weakSkills.map((skill, idx) => (
                <span key={idx} className='badge bg-white text-danger border border-danger border-opacity-50 px-2 py-1'>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
