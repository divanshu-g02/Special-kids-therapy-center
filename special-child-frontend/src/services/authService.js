import axios from 'axios';

const API_BASE_URL = 'http://localhost:5022/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ROLE_MAP = { Admin: 1, Receptionist: 2, Doctor: 3, Patient: 4, Guardian: 5 };

export async function loginUser({ email, password }) {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Invalid email or password.';
    throw new Error(message);
  }
}

export async function registerUser({ firstName, lastName, email, password, role, phoneNo }) {
  try {
    const payload = {
      firstName,
      lastName,
      email,
      password,
      role: ROLE_MAP[role],
      phoneNo: phoneNo || null,
    };
    console.log('Sending payload:', JSON.stringify(payload)); // ADD THIS
    const res = await api.post('/auth/register', payload);
    return res.data;
  } catch (err) {
    console.log('Error response:', err.response);  // ADD THIS
    const message = err.response?.data?.message || 'Registration failed. Please try again.';
    throw new Error(message);
  }
}

export function saveSession(data) {
  localStorage.setItem('token',    data.token);
  localStorage.setItem('role',     data.role);
  localStorage.setItem('fullName', data.fullName);
  localStorage.setItem('email',    data.email);
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('fullName');
  localStorage.removeItem('email');
}

export function getSession() {
  return {
    token:    localStorage.getItem('token'),
    role:     localStorage.getItem('role'),
    fullName: localStorage.getItem('fullName'),
    email:    localStorage.getItem('email'),
  };
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export default api;