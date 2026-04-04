//in this only we connect frontend and backend
import axios from "axios";
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://tech-talent.onrender.com'
})
//attach jwt token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
}
)
export default API;

