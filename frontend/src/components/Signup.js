import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api';

export default function Signup() {
    //to store the data
    const[data,setData]=useState({
        username:'',
        email:'',
        password:'',
        role:'student'
    })
    //to store the error
    const[error,setError]=useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();
    //to track the changes-handlechange
    const handleChange=(e)=>{
        setData(pre=>({...pre,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError('')
        try{
            const{data:res}= await API.post('/api/users/register', { ...data, role: 'student' })
            localStorage.setItem('token',res.token);
            localStorage.setItem('role',res.role);
            localStorage.setItem('username',res.username);
            navigate('/')
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
            <div className='row justify-content-center px-3'>
                <div className='col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4'>
                    <div className='card card-refined p-4 p-md-5'>
                        <div className='card-body p-0'>
                            <h2 className='mb-2 text-center'><span className='text-gradient fw-extrabold pb-1' style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}>Tech Talent</span></h2>
                            <p className='text-center text-muted small fw-medium mb-5'>Create your Talent Profile</p>
                            
                            {error&&<div className='alert alert-danger py-2 mb-4 small fw-bold border-0' style={{ backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '10px' }}>{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className='mb-4'>
                                   <label className='form-label text-muted small fw-bold ps-1 mb-2'>USERNAME</label>
                                   <input type='text' name='username' className='form-control form-control-refined' placeholder='Choose a username' onChange={handleChange} required/>
                                </div>
                                <div className='mb-4'>
                                     <label className='form-label text-muted small fw-bold ps-1 mb-2'>EMAIL</label>
                                       <input type='email' name='email' className='form-control form-control-refined' placeholder='Enter your email address' onChange={handleChange} required/>
                                </div>
                                <div className='mb-5'>
                                     <label className='form-label text-muted small fw-bold ps-1 mb-2'>PASSWORD</label>
                                     <div className='position-relative'>
                                       <input type={showPassword ? 'text' : 'password'} name='password' className='form-control form-control-refined' style={{ paddingRight: '55px' }} placeholder='Minimum 6 characters' onChange={handleChange} required/>
                                       <button 
                                         type='button' 
                                         className='btn position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent px-3' 
                                         onClick={() => setShowPassword(!showPassword)}
                                       >
                                         <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ color: '#94a3b8', fontSize: '1.1rem' }}></i>
                                       </button>
                                     </div>
                                </div>
                                <button type='submit' className='btn btn-gradient w-100 fw-bold py-3 mb-4' style={{ borderRadius: '14px', fontSize: '1rem', letterSpacing: '0.01em' }}>Create account</button>
                            </form>
                            
                            <div className='text-center mt-2'>
                                <span className='text-muted small fw-medium'>Already have an account?</span>
                                <Link to="/login" className='text-decoration-none fw-bold ms-2' style={{ color: '#7c3aed', fontSize: '0.95rem' }}>Log in</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
