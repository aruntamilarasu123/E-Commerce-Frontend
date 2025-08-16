import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    shopName: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post('https://e-commerce-backend-getc.onrender.com/auth/register', formData);
      setMessage('Signup successful!');
      setFormData({ name: '', email: '', password: '', role: 'buyer', shopName: '' });
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        const msg = error.response.data.message;
        if (msg.includes('Email is already registered')) {
          setMessage('Email already in use. Please log in or use a different email.');
        } else {
          setMessage(`Error: ${msg}`);
        }
      } else {
        setMessage('Signup failed. Try again.');
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg font-sans border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 tracking-tight">
        Create Account
      </h2>

      {message && (
        <p
          className={`mb-6 text-center font-medium ${
            message.includes('successful') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <label htmlFor="name" className="block mb-1 text-gray-700 font-semibold">
            Username
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input-style"
            placeholder="Enter your username"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 text-gray-700 font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-style"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-1 text-gray-700 font-semibold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="input-style"
            placeholder="Enter your password"
          />
        </div>

        {/* Role Selection */}
        <fieldset className="mb-4">
          <legend className="text-gray-700 font-semibold mb-2">Role</legend>
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={formData.role === 'seller'}
                onChange={handleChange}
                className="form-radio text-[#ff7f00]"
              />
              <span className="ml-2 text-gray-700">Seller</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={formData.role === 'buyer'}
                onChange={handleChange}
                className="form-radio text-[#ff7f00]"
              />
              <span className="ml-2 text-gray-700">Buyer</span>
            </label>
          </div>
        </fieldset>

        {/* Shop Name (only if seller) */}
        {formData.role === 'seller' && (
          <div>
            <label htmlFor="shopName" className="block mb-1 text-gray-700 font-semibold">
              Shop Name
            </label>
            <input
              id="shopName"
              name="shopName"
              type="text"
              required={formData.role === 'seller'}
              value={formData.shopName}
              onChange={handleChange}
              className="input-style"
              placeholder="Enter your shop name"
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn-primary w-full py-3">
          Register
        </button>
      </form>

      {/* Link to Login */}
      <p className="text-center mt-6 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-[#ff7f00] font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
