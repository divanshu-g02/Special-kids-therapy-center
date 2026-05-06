// src/services/authService.js
// Only handles: login, register, session storage
// Nothing else

import api from './api';

const ROLE_MAP = { Admin: 1, Receptionist: 2, Doctor: 3, Patient: 4, Guardian: 5 };

export async function loginUser({ email, password }) {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Invalid email or password.');
  }
}

export async function registerUser({ firstName, lastName, email, password, role, phoneNo }) {
  try {
    const res = await api.post('/auth/register', {
      firstName, lastName, email, password,
      role: ROLE_MAP[role],
      phoneNo: phoneNo || null,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Registration failed.');
  }
}

export function saveSession(data) {
  localStorage.setItem('token',    data.token);
  localStorage.setItem('userId',   data.userId);
  localStorage.setItem('role',     data.role);
  localStorage.setItem('fullName', data.fullName);
  localStorage.setItem('email',    data.email);
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('fullName');
  localStorage.removeItem('email');
}

export function getSession() {
  return {
    token:    localStorage.getItem('token'),
    userId:   localStorage.getItem('userId'),
    role:     localStorage.getItem('role'),
    fullName: localStorage.getItem('fullName'),
    email:    localStorage.getItem('email'),
  };
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}