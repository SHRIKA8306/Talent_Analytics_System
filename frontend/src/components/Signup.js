import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api';

export default function Signup() {
    //to store the data
    const[data,setData]=useState({
        username:'',
        email:'',
        password:''
    })
    //to store the error
    const[error,setError]=useState('');
    const navigate=useNavigate();
    //to track the changes-handlechange
    const handleChange=(e)=>{
        setData(pre=>({...pre,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError('')
        try{
            await API.post('/api/users',data)
            navigate('/login')
        }
        catch(err){
               console.error('Signup error:', err);
               const msg = err?.response?.data;
               if (typeof msg === 'string') {
                   setError(msg);
               } else if (err?.response?.status === 400) {
                   setError('Validation error. Please check your inputs.');
               } else if (!err?.response) {
                   setError('Network error. Is the backend server running?');
               } else {
                   setError('Signup failed. Please try again.');
               }
        }
    }
  return (
    <div className='bg-page-gradient min-vh-100 d-flex align-items-center py-5'>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-11 col-sm-8 col-md-7 col-lg-6 col-xl-5'>
                    <div className='card shadow border-2 rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className='card-body p-5 p-md-4'>
                            <h3 className='mb-4 text-center'><span className='text-gradient'>Create Account</span></h3>
                            {error&&<div className='alert alert-danger'>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                   <label className='form-label text-muted fw-semibold'>Username</label>
                                   <input type='text' name='username' className='form-control form-control-lg border-1 shadow-sm' style={{ background: '#f8fafc' }} placeholder='Enter your username' onChange={handleChange} required/>
                                </div>
                                <div className='mb-3'>
                                     <label className='form-label text-muted fw-semibold'>Email</label>
                                       <input type='text' name='email' className='form-control form-control-lg border-1 shadow-sm' style={{ background: '#f8fafc' }} placeholder='Enter your email' onChange={handleChange} required/>
                                </div>
                                <div className='mb-3'>
                                     <label className='form-label text-muted fw-semibold'>Password</label>
                                       <input type='password' name='password' className='form-control form-control-lg border-1 shadow-sm' style={{ background: '#f8fafc' }} placeholder='Enter min 6 characters' onChange={handleChange} required/>
                                </div>
                                <button type='submit' className='btn btn-gradient w-100 fw-bold shadow-sm py-3 mt-3' style={{ borderRadius: '12px' }}>Create Account</button>
                            </form>
                            <div className='text-center mt-4'>
                                <span className='text-muted'>Already have an account?</span>
                                <Link to="/login" className='text-decoration-none fw-bold ms-2' style={{ color: '#7c3aed' }}>Login in</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
