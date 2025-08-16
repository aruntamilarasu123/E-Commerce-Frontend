import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaFilter } from "react-icons/fa";
import SearchBox from "./SearchBox";
import { MyContext } from "../context/ContextProvider";

const ReuseNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchProducts } = useContext(MyContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ NEW: filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const path = location.pathname;
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("role");

  // Clear localStorage on home page
  useEffect(() => {
    if (path === "/") {
      localStorage.clear();
    }
  }, [path]);

  // Determine page type
  const isHome = path === "/";
  const isBuyerRelated = path === "/buyer" || path.startsWith("/buyer/");
  const isSellerRelated = path === "/seller" || path.startsWith("/seller/");
  const isSingleProduct =
    path.startsWith("/buyer/product/") || path.startsWith("/seller/product/");

  // Navbar visibility flags
  const showSearchBar = isHome || isBuyerRelated;
  const showLoginSignup = isHome || isSingleProduct;
  const showUserButtons = isBuyerRelated || isSellerRelated;
  const showCartAndOrder = isBuyerRelated;
  const showOrderManagement = isSellerRelated;
  const showSalesReport = isSellerRelated;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSearch = (query) => {
    if (isHome || isBuyerRelated) {
      fetchProducts({ search: query, page: 1, limit: 8 });
    }
  };

  // ✅ NEW: Apply filters
  const handleFilterApply = () => {
    fetchProducts({
      category,
      minPrice,
      maxPrice,
      sort,
      page: 1,
      limit: 8,
    });
    setFilterOpen(false);
  };

  const NavButtons = () => (
    <>
      {showUserButtons && (
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          {showCartAndOrder && (
            <>
              <Link to="/buyer/wishlist" className="nav-link">
                Wishlist
              </Link>
              <Link to="/buyer/cart" className="nav-link">
                Cart
              </Link>
              <Link to="/buyer/order" className="nav-link">
                Orders
              </Link>
            </>
          )}
          {showOrderManagement && (
            <Link to="/seller/order" className="nav-link">
              Order Management
            </Link>
          )}
          {showSalesReport && (
            <Link to="/seller/sales-report" className="nav-link">
              Sales Report
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-2xl text-gray-600 hover:text-[#ff7f00] focus:outline-none ml-0 md:ml-3"
            >
              <FaUserCircle />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div
                  onClick={() => {
                    navigate(`/${role}/user-profile`);
                    setDropdownOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-gray-800 font-medium border-b hover:bg-gray-100"
                >
                  {name || "User"}
                </div>
                <Link
                  to={`/${role}/change-password`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Change Password
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showLoginSignup && (
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <Link
            to="/login"
            className="px-4 py-2 bg-[#ff7f00] hover:bg-orange-600 text-white font-semibold rounded-md shadow-sm text-center"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-[#ff7f00] hover:bg-orange-600 text-white font-semibold rounded-md shadow-sm text-center"
          >
            Signup
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/Cart2.png"
            alt="Arindra Logo"
            className="w-10 h-10 object-cover rounded-xl shadow-md"
          />
          <h1 className="text-2xl font-bold text-[#ff7f00] tracking-tight">
            Arindra
          </h1>
        </div>

        {/* Search + Filter (Desktop) */}
        {showSearchBar && (
          <div className="hidden md:flex items-center gap-3 w-1/2">
            <SearchBox onSearch={handleSearch} />

            {/* ✅ NEW Filter Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
            >
              <FaFilter />
              <span>Filter</span>
            </button>
          </div>
        )}

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">
          <NavButtons />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ✅ NEW Filter Dropdown */}
      {filterOpen && (
        <div className="absolute right-10 top-16 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>

          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            placeholder="e.g. Electronics"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-2 py-1 mb-2"
          />

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 border rounded-md px-2 py-1"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 border rounded-md px-2 py-1"
            />
          </div>

          <label className="block text-sm font-medium mt-2">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border rounded-md px-2 py-1 mb-3"
          >
            <option value="">Default</option>
            <option value="priceLowHigh">Price: Low → High</option>
            <option value="priceHighLow">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>

          <button
            onClick={handleFilterApply}
            className="w-full bg-[#ff7f00] hover:bg-orange-600 text-white font-semibold py-2 rounded-md"
          >
            Apply
          </button>
        </div>
      )}

      {/* Mobile Search + Filter */}
      {showSearchBar && mobileMenuOpen && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-3">
          <SearchBox onSearch={handleSearch} />
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
          >
            <FaFilter />
            <span>Filter</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default ReuseNavbar;
