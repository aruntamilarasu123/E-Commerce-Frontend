// import React, { useState } from 'react';
// import SearchBox from './SearchBox';
// import { Link } from 'react-router';

// function Navbar({ handleSearch }) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <nav className='px-4 md:px-16 py-4 flex justify-between items-center shadow-md bg-white relative z-20'>
//       {/* Logo Section */}
//       <Link to='/'>
//             <div className='flex items-center gap-3'>
//         <img className='rounded-lg w-10' src="/src/assets/Cart2.png" alt="logo" />
//         <h1 className='font-bold text-2xl text-[#ff7f00]'>Arindra</h1>
//       </div>
//       </Link>

//       {/* Search Box (Centered in large screens) */}
//       <div className='hidden md:block w-1/2'>
//         <SearchBox onSearch={handleSearch} />
//       </div>

//       {/* Desktop Buttons */}
//       <div className='hidden md:flex gap-3'>
//         <Link to="/login">
//         <button className='px-4 py-2 font-semibold rounded-md text-white bg-[#ff7f00] hover:bg-orange-600 transition'>Login</button>
//         </Link>
//         <Link to="/signup">
//         <button className='px-4 py-2 font-semibold rounded-md text-white bg-[#ff7f00] hover:bg-orange-600 transition'>Signup</button>
//         </Link>
//       </div>

//       {/* Hamburger Button for Mobile */}
//       <div className='md:hidden'>
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className='text-[#ff7f00] focus:outline-none'
//         >
//           <svg
//             className='w-7 h-7'
//             fill='none'
//             stroke='currentColor'
//             viewBox='0 0 24 24'
//             xmlns='http://www.w3.org/2000/svg'
//           >
//             <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className='absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md flex flex-col items-start px-4 py-4 gap-2 md:hidden z-10'>
//           <SearchBox onSearch={handleSearch} />
//           <button className='w-full text-left px-4 py-2 font-semibold text-white bg-[#ff7f00] rounded-md hover:bg-orange-600'>Home</button>
//           <button className='w-full text-left px-4 py-2 font-semibold text-white bg-[#ff7f00] rounded-md hover:bg-orange-600'>Cart</button>
//           <button className='w-full text-left px-4 py-2 font-semibold text-white bg-[#ff7f00] rounded-md hover:bg-orange-600'>Orders</button>
//           <button className='w-full text-left px-4 py-2 font-semibold text-white bg-[#ff7f00] rounded-md hover:bg-orange-600'>Payment</button>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;
