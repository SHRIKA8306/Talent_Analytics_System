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
    <div  className='container py-5'>
        <div className='row justify-content-center'>
            <div className='col-11 col-sm-8 col-md-6 col-lg-4'>
                <div className='card shadow-sm'>
                    <div className='card-body p-4'>
                        <h3 className='mb-4 text-center'><span className='text-gradient'>TAS Portal</span></h3>
                        {error&&<div className='alert alert-danger'>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                 <label className='form-label'>Username</label>
                                   <input type='text' name='username' className='form-control' placeholder='Enter your username' onChange={handleChange} required/>
                            </div>
                            <div className='mb-3'>
                                 <label className='form-label'>Password</label>
                                   <input type='password' name='password' className='form-control' placeholder='Enter your password ' onChange={handleChange} required/>
                            </div>
                            <button type='submit' className='btn w-100 fw-bold shadow-sm btn-gradient' style={{ padding: '10px' }}>Login In</button>
                        </form>
                        <div className='text-center my-3'>
                            <span className='text-muted'>Or</span>
                        </div>
                        <button type='button' className='btn btn-white w-100 d-flex align-items-center justify-content-center mb-3 border shadow-sm' style={{backgroundColor: 'white'}} onClick={handleGoogleLogin}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '20px', marginRight: '10px'}} />
                            Login with Google
                        </button>
                        <div className='text-center mt-3'>
                            <span>If not created?  </span>
                            <Link to="/signup" className='text-decoration-none fw-bold' style={{ color: '#7c3aed' }}>Create Account</Link>
                        </div>
                    </div>

                </div>
            </div>

        </div>
      
    </div>
  )
}