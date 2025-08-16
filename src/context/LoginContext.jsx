import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogContext = createContext();

export const LoginProvider = ({ children }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://e-commerce-backend-getc.onrender.com/auth/login', formData);
      const { token, userId, userName, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('role', role);

      setMessage('Login successful!');
      setTimeout(() => {
        setMessage('');
        setFormData({ email: '', password: '' });
      }, 3000);

      if (role === 'buyer') {
        navigate('/buyer');
      } else if (role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please try again.';
      setMessage(`Error: ${errMsg}`);
      setFormData({ email: '', password: '' });

      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <LogContext.Provider value={{ formData, message, handleChange, handleSubmit }}>
      {children}
    </LogContext.Provider>
  );
};

export default LogContext;
