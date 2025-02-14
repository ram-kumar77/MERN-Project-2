import axios from 'axios';
// import { alert } from '../../utils/alert';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:5000';

export const userLogin = (values) => async dispatch => {
  dispatch({ type: 'LOADING', payload: true });
  try {
      // For admin login, bypass backend call
      if (values.username === 'admin' && values.password === 'admin123') {
          const adminUser = {
              username: 'admin',
              isAdmin: true,
              _id: 'admin123' // Add a dummy ID for admin
          };
          localStorage.setItem('user', JSON.stringify(adminUser));
          dispatch({ type: 'LOADING', payload: false });
          return adminUser;
      }

      // Regular user login
      const response = await axios.post('http://localhost:5000/api/users/login', values);
      localStorage.setItem('user', JSON.stringify(response.data));
      dispatch({ type: 'LOADING', payload: false });
      return response.data;
  } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOADING', payload: false });
      throw error;
  }
};

export const userRegister = (values) => async dispatch => {
  dispatch({ type: 'LOADING', payload: true });
  try {
      const response = await axios.post('http://localhost:5000/api/users/register', values);
      dispatch({ type: 'LOADING', payload: false });
      toast.success('Registration successful! Please login.');
      return response.data;
  } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOADING', payload: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
  }
};