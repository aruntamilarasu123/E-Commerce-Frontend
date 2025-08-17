import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    try {
      const res = await axios.post(
        'https://e-commerce-backend-getc.onrender.com/auth/change-password',
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      setForm({ currentPassword: '', newPassword: '' });

      // Navigate immediately if successful
      if (res.data.message.toLowerCase().includes('success')) {
        navigate(`/${role}`);
        toast.success('Password Changed successful')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Server error';
      setMessage(`Error: ${errorMsg}`);
    }

    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Change Password
          </h2>

          {message && (
            <p
              className={`mb-4 text-center font-medium ${
                message.toLowerCase().includes('success')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff7f00] hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
