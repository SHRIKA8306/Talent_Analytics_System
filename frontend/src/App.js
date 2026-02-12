import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import { Navigate, Route, Routes } from 'react-router-dom';
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
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='*' element={<Navigate to='/'replace/>}/>
    </Routes>

  );
}

export default App;
