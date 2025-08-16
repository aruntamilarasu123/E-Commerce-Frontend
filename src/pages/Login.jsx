import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LogContext from '../context/LoginContext';

const Login = () => {
  const { formData, message, handleChange, handleSubmit } = useContext(LogContext);

  return (
    <div className="max-w-md w-full mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg font-sans border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 tracking-tight">
        Login
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
        <div>
          <label htmlFor="email" className="block mb-1 text-gray-700 font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-style"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-gray-700 font-semibold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="input-style"
            placeholder="Enter your password"
          />
          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-sm text-[#ff7f00] hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-3">
          Login
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#ff7f00] font-medium hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
