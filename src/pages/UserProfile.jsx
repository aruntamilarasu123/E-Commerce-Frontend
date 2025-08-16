import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import GoBackButton from '../components/GoBackButton';

const UserProfile = () => {
  const role = localStorage.getItem('role'); 
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    shopName: '',
    shopDescription: ''
  });

  const apiBase = 'https://e-commerce-backend-getc.onrender.com/auth';

  useEffect(() => {
    const fetchProfile = async () => {
      if (!role || !token) {
        setMessage('Role or token missing. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${apiBase}/${role}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profile = res.data.profile || {};
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: {
            street: profile.address?.street || '',
            city: profile.address?.city || '',
            state: profile.address?.state || '',
            postalCode: profile.address?.postalCode || '',
            country: profile.address?.country || ''
          },
          shopName: profile.shopName || '',
          shopDescription: profile.shopDescription || ''
        });
      } catch (error) {
        console.error('Fetch profile error:', error?.response || error);
        setMessage('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [role, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (role !== 'seller') {
      delete payload.shopName;
      delete payload.shopDescription;
    }

    try {
      await axios.put(`${apiBase}/${role}/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      setIsOpen(false);
    } catch (err) {
      console.error("Update failed:", err?.response?.data || err.message);
      setMessage('Error updating profile.');
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-8">
        <GoBackButton />
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h2>
        {message && <p className="text-green-600 font-medium mb-4">{message}</p>}

        {/* Display Info */}
        <div className="space-y-3 text-gray-700 text-base md:text-lg">
          <p><span className="font-semibold">Name:</span> {formData.name}</p>
          <p><span className="font-semibold">Email:</span> {formData.email}</p>
          <p><span className="font-semibold">Phone:</span> {formData.phone}</p>
          <p>
            <span className="font-semibold">Address:</span>{' '}
            {formData.address.street}, {formData.address.city}, {formData.address.state}, {formData.address.postalCode}, {formData.address.country}
          </p>
          {role === 'seller' && (
            <>
              <p><span className="font-semibold">Shop Name:</span> {formData.shopName}</p>
              <p><span className="font-semibold">Shop Description:</span> {formData.shopDescription}</p>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="mt-6 inline-block bg-[#ff7f00] hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition shadow"
        >
          Update Profile
        </button>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white rounded-lg p-6 md:p-8 shadow-lg">
                <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
                      placeholder="Phone"
                    />
                    {['street', 'city', 'state', 'postalCode', 'country'].map((field) => (
                      <input
                        key={field}
                        name={`address.${field}`}
                        value={formData.address[field]}
                        onChange={handleChange}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
                      />
                    ))}
                    {role === 'seller' && (
                      <>
                        <input
                          type="text"
                          name="shopName"
                          value={formData.shopName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
                          placeholder="Shop Name"
                        />
                        <textarea
                          name="shopDescription"
                          value={formData.shopDescription}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
                          placeholder="Shop Description"
                        />
                      </>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#ff7f00] hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UserProfile;
