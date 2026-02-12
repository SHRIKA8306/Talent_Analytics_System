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
    <div  className='container py-5'>
        <div className='row justify-content-center'>
            <div className='col-11 col-sm-8 col-md-6 col-lg-4'>
                <div className='card shadow-sm'>
                    <div className='card-body p-4'>
                        <h3 className='mb-4 text-center'><span className='text-gradient'>Create Account</span></h3>
                        {error&&<div className='alert alert-danger'>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className='row'>
                                <div className='mb-3'>
                                   <label className='form-label'>Username</label>
                                   <input type='text' name='username' className='form-control' placeholder='Enter your username' onChange={handleChange} required/>
                                </div>
                            </div>
                            <div className='mb-3'>
                                 <label className='form-label'>Email</label>
                                   <input type='text' name='email' className='form-control' placeholder='Enter your email' onChange={handleChange} required/>
                            </div>
                            <div className='mb-3'>
                                 <label className='form-label'>Password</label>
                                   <input type='password' name='password' className='form-control' placeholder='Password should be min 6 characters' onChange={handleChange} required/>
                            </div>
                            <button type='submit' className='btn w-100 fw-bold shadow-sm btn-gradient' style={{ padding: '10px' }}>Create Account</button>
                        </form>
                        <div className='text-center mt-3'>
                            <span>Already have an account? </span>
                            <Link to="/login" className='text-decoration-none fw-bold' style={{ color: '#7c3aed' }}>Login in</Link>
                        </div>
                    </div>

                </div>
            </div>

        </div>
      
    </div>
  )
}
