import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";

export default function Login() {
    const[data,setData]=useState({
        username:'',
        password:''
    })
    const[error,setError]=useState('');
    const navigate=useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check for token in URL parameters (redirect from Google Auth)
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/');
        }
    }, [location, navigate]);

    const handleChange=(e)=>{
        setData(pre=>({...pre,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError('')
        try{
            const{data:res}= await API.post('/api/auth',data)
            localStorage.setItem('token',res.token);
            navigate('/')
        }
        catch(err){
               console.error('Login error:', err);
               const msg = err?.response?.data;
               if (typeof msg === 'string') {
                   setError(msg);
               } else if (!err?.response) {
                   setError('Network error. Is the backend server running?');
               } else {
                   setError('Login failed. Please check your credentials.');
               }
        }
    }

    const handleGoogleLogin = () => {
        // Redirect to backend Google Auth route
        window.location.href = 'http://localhost:4000/api/auth/google';
    };
  return (
    <div className='bg-page-gradient min-vh-100 d-flex align-items-center py-5'>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-11 col-sm-8 col-md-7 col-lg-6 col-xl-5'>
                    <div className='card shadow border-2 rounded-4' style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className='card-body p-5 p-md-4'>
                            <h3 className='mb-4 text-center'><span className='text-gradient'>TAS Portal</span></h3>
                            {error&&<div className='alert alert-danger'>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className='mb-4'>
                                     <label className='form-label text-muted fw-semibold'>Username</label>
                                       <input type='text' name='username' className='form-control form-control-lg border-1 shadow-sm' style={{ background: '#f8fafc' }} placeholder='Enter your username' onChange={handleChange} required/>
                                </div>
                                <div className='mb-4'>
                                     <label className='form-label text-muted fw-semibold'>Password</label>
                                       <input type='password' name='password' className='form-control form-control-lg border-1 shadow-sm' style={{ background: '#f8fafc' }} placeholder='Enter your password' onChange={handleChange} required/>
                                </div>
                                <button type='submit' className='btn btn-gradient w-100 fw-bold shadow-sm py-3 mt-3' style={{ borderRadius: '12px' }}>Login In</button>
                            </form>
                            <div className='text-center my-4'>
                                <span className='text-muted small fw-bold text-uppercase'>Or</span>
                            </div>
                            <button type='button' className='btn btn-white w-100 d-flex align-items-center justify-content-center mb-3 border shadow-sm py-2' style={{backgroundColor: 'white', borderRadius: '12px'}} onClick={handleGoogleLogin}>
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '20px', marginRight: '10px'}} />
                                <span className='fw-semibold'>Login with Google</span>
                            </button>
                            <div className='text-center mt-4'>
                                <span className='text-muted'>If not created?</span>
                                <Link to="/signup" className='text-decoration-none fw-bold ms-2' style={{ color: '#7c3aed' }}>Create Account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}