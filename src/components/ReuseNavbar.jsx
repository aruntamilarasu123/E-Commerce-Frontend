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
  const [filterOpen, setFilterOpen] = useState(false);

  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const path = location.pathname;
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (path === "/") localStorage.clear();
  }, [path]);

  const isHome = path === "/";
  const isBuyerRelated = path === "/buyer" || path.startsWith("/buyer/");
  const isSellerRelated = path === "/seller" || path.startsWith("/seller/");
  const isSingleProduct =
    path.startsWith("/buyer/product/") || path.startsWith("/seller/product/");

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
    setMobileMenuOpen(false); // close mobile menu on apply
  };

  const NavButtons = ({ isMobile }) => (
    <>
      {showUserButtons && (
        <div
          className={`flex flex-col ${isMobile ? "gap-2" : "md:flex-row md:gap-4"
            } `}
        >
          {showCartAndOrder && (
            <>
              <Link to={`/${role}`} className="nav-link">Home</Link>
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
            <Link to={`/${role}`} className="nav-link">Home</Link>
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

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-2xl text-gray-600 hover:text-[#ff7f00] focus:outline-none"
            >
              <FaUserCircle />
            </button>
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-md py-2 z-50 ${isMobile ? "relative mt-0" : ""
                  }`}
              >
                <div
                  onClick={() => {
                    navigate(`/${role}/user-profile`);
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-gray-800 font-medium border-b hover:bg-gray-100"
                >
                  {name || "User"}
                </div>
                <Link
                  to={`/${role}/change-password`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
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
        <div
          className={`flex flex-col ${isMobile ? "gap-2" : "md:flex-row md:gap-3"
            }`}
        >
          <Link
            to="/login"
            className="px-4 py-2 bg-[#ff7f00] hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 text-white font-semibold rounded-lg shadow text-center transition"
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-[#ff7f00] hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 text-white font-semibold rounded-lg shadow text-center transition"
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Signup
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/Cart2.png"
            alt="Arindra Logo"
            className="w-10 h-10 object-cover rounded-lg shadow"
          />
          <h1 className="text-2xl font-bold text-[#ff7f00] tracking-wide">
            Arindra
          </h1>
        </div>

        {/* Desktop Search + Filter */}
        {showSearchBar && (
          <div className="hidden md:flex items-center gap-3 w-1/2">
            <SearchBox onSearch={handleSearch} />
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border transition"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white border-t border-gray-200 shadow-sm">
          {showSearchBar && <SearchBox onSearch={handleSearch} />}
          <NavButtons isMobile={true} />

          {/* Mobile Filter Dropdown */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border mt-2 transition"
          >
            <FaFilter />
            <span>Filter</span>
          </button>
          {filterOpen && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mt-2 max-h-[70vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-3">Filters</h3>
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-md px-2 py-1 mb-2"
              />
              <div className="flex gap-2 mb-2">
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
                className="w-full bg-[#ff7f00] hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 text-white font-semibold py-2 rounded-lg transition"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}

      {/* Desktop Filter Dropdown */}
      {filterOpen && !mobileMenuOpen && (
        <div className="absolute right-10 top-16 w-64 bg-white border border-gray-100 rounded-lg shadow-md p-4 z-50">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-2 py-1 mb-2"
          />
          <div className="flex gap-2 mb-2">
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
            className="w-full bg-[#ff7f00] hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 text-white font-semibold py-2 rounded-lg transition"
          >
            Apply
          </button>
        </div>
      )}
    </nav>
  );
};

export default ReuseNavbar;
