import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import API from '../api';

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

  const getBarColor = (level) => {
    if (level > 70) return '#10b981'; // Success Green
    if (level > 40) return '#f59e0b'; // Warning Yellow
    return '#ef4444'; // Danger Red
  };

  const getInsightMessage = () => {
    if (!analytics || !analytics.strongestSkill || !analytics.weakestSkill) return '';
    const { strongestSkill, weakestSkill, averageSkillLevel } = analytics;
    let levelText = "moderate";
    if (averageSkillLevel > 70) levelText = "excellent";
    else if (averageSkillLevel < 40) levelText = "foundational";

    return `You are strongest in ${strongestSkill.name} but have room to grow in ${weakestSkill.name}. Your overall skill proficiency is ${levelText}.`;
  };

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

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={analytics.skills}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="level" radius={[6, 6, 0, 0]} barSize={40}>
                {analytics.skills.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
