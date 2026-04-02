import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import EditProfile from './components/EditProfile';
import Analytics from './components/Analytics';
import Leaderboard from './components/Leaderboard';
import CareerInsights from './components/CareerInsights';
import { Navigate, Route, Routes } from 'react-router-dom';
import API from './api';

function PrivateRoute({children}){
  const token=localStorage.getItem('token');
  return token?children:<Navigate to='/login'/>
}

function AdminRoute({children}){
  const token=localStorage.getItem('token');
  const role=localStorage.getItem('role');
  return token && role === 'admin' ? children : <Navigate to='/login'/>
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <PrivateRoute>
          <StudentDashboard/>
        </PrivateRoute>
      }/>
      <Route path='/admin' element={
        <AdminRoute>
          <AdminDashboard/>
        </AdminRoute>
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
      <Route path='/analytics' element={
        <PrivateRoute>
          <Analytics/>
        </PrivateRoute>
      }/>
      <Route path='/career-insights' element={
        <PrivateRoute>
          <CareerInsights/>
        </PrivateRoute>
      }/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='*' element={<Navigate to='/'replace/>}/>
    </Routes>
  );
}

export default App;
