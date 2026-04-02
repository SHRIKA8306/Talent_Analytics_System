import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";

export default function Login() {
    const[data,setData]=useState({
        username:'',
        password:''
    })
    const[error,setError]=useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();
    const location = useLocation();

    useEffect(() => {
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
            const{data:res}= await API.post('/api/auth', data)
            localStorage.setItem('token',res.token);
            localStorage.setItem('role', res.role);
            localStorage.setItem('username', res.username);
            navigate('/');
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
        window.location.href = 'http://localhost:4000/api/auth/google';
    };
  return (
    <div className='bg-page-gradient min-vh-100 d-flex align-items-center py-5'>
        <div className='container'>
            <div className='row justify-content-center px-3'>
                <div className='col-12 col-sm-10 col-md-8 col-lg-7 col-xl-5'>
                    <div className='card card-refined p-4'>
                        <div className='card-body p-0'>
                            <h2 className='mb-1 text-center'><span className='text-gradient fw-extrabold pb-1' style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>Tech Talent</span></h2>
                            <p className='text-center text-muted small fw-medium mb-4'>Secure Access to Talent Analytics</p>
                            
                            {error&&<div className='alert alert-danger py-2 mb-4 small fw-bold border-0' style={{ backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '10px' }}>{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                     <label className='form-label text-muted small fw-bold ps-1 mb-1'>USERNAME</label>
                                       <input type='text' name='username' className='form-control form-control-refined py-2' placeholder='Enter your username' onChange={handleChange} required/>
                                </div>
                                <div className='mb-4'>
                                     <label className='form-label text-muted small fw-bold ps-1 mb-1'>PASSWORD</label>
                                     <div className='position-relative'>
                                       <input type={showPassword ? 'text' : 'password'} name='password' className='form-control form-control-refined py-2' style={{ paddingRight: '55px' }} placeholder='Enter your password' onChange={handleChange} required/>
                                       <button 
                                         type='button' 
                                         className='btn position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent px-3' 
                                         onClick={() => setShowPassword(!showPassword)}
                                       >
                                         <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ color: '#94a3b8', fontSize: '1.1rem' }}></i>
                                       </button>
                                     </div>
                                </div>
                                <button type="submit" className="btn btn-gradient w-100 fw-bold py-3 mb-4 mt-2 shadow-sm" style={{ borderRadius: '14px', fontSize: '1rem', letterSpacing: '0.01em' }}>
                                    Login
                                </button>
                            </form>

                            <div className='or-separator'>OR</div>

                            <button type='button' className='btn w-100 d-flex align-items-center justify-content-center mb-0 py-2' style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'all 0.2s ease'}} onClick={handleGoogleLogin}>
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '20px', marginRight: '14px'}} />
                                <span className='fw-bold' style={{ color: '#475569', fontSize: '0.95rem' }}>Continue with Google</span>
                            </button>

                            <div className='text-center mt-4 pt-1'>
                                <span className='text-muted small fw-medium'>Don't have an account?</span>
                                <Link to="/signup" className='text-decoration-none fw-bold ms-2' style={{ color: '#7c3aed', fontSize: '0.95rem' }}>Create profile</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}