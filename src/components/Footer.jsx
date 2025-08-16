import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo & About */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/public/Cart2.png"
                alt="Arindra Logo"
                className="w-10 h-10 object-cover rounded-xl shadow-md"
              />
              <h1 className="text-2xl font-bold text-[#ff7f00] tracking-tight">
                Arindra
              </h1>
            </div>
            <p className="text-gray-600 max-w-sm">
              Arindra is your trusted platform for seamless shopping experiences. 
              We bring you the best products with easy navigation and secure transactions.
            </p>
          </div>

          {/* Contact & Social */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Follow Us</h2>
            <div className="flex gap-4 text-gray-600">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7f00] transition">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7f00] transition">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7f00] transition">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7f00] transition">
                <FaLinkedinIn />
              </a>
            </div>
            <p className="text-gray-500 mt-4 text-sm">
              Email: support@arindra.com
            </p>
            <p className="text-gray-500 text-sm">Phone: +91 0000000210</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-200 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Arindra. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
