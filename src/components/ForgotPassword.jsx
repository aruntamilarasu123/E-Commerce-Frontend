import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://e-commerce-backend-getc.onrender.com/auth/forgot-password', { email });
      setMessage(res.data.message);
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }

    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 sm:p-10">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        {message && (
          <p
            className={`mb-4 text-center font-medium ${
              message.toLowerCase().includes('sent') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff7f00] hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
