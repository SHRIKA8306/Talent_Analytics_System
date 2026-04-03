import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import EditProfile from './components/EditProfile';
import Leaderboard from './components/Leaderboard';
import CareerInsights from './components/CareerInsights';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import API from './api';

// Handles Google OAuth redirect: saves token+role then goes to dashboard
function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    if (token) {
      localStorage.setItem('token', token);
      if (role) localStorage.setItem('role', role);
    }
    navigate('/', { replace: true });
  }, []);

  return <div style={{textAlign:'center',marginTop:'20vh',fontSize:'1.2rem'}}>Signing you in... ⏳</div>;
}

function PrivateRoute({children}){
  const token=localStorage.getItem('token');
  return token?children:<Navigate to='/login'/>
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <PrivateRoute>
          <StudentDashboard/>
        </PrivateRoute>
      }/>
      <Route path='/profile' element={
        <PrivateRoute>
          <EditProfile/>
        </PrivateRoute>
      }/>
      <Route path='/leaderboard' element={
        <PrivateRoute>
          <Leaderboard/>
        </PrivateRoute>
      }/>
      <Route path='/career-insights' element={
        <PrivateRoute>
          <CareerInsights/>
        </PrivateRoute>
      }/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<GoogleCallback/>}/>
      <Route path='*' element={<Navigate to='/'replace/>}/>
    </Routes>
  );
}

export default App;
