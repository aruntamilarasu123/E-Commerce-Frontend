import React, { useContext, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { MyContext } from '../context/ContextProvider';

function Home() {
  const { data, fetchProducts, totalPages, loading } = useContext(MyContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Number of products per page

  // Fetch products whenever page changes
  useEffect(() => {
    fetchProducts({ page: currentPage, limit: productsPerPage });
  }, [currentPage, fetchProducts]);


  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-gray-500 text-center mt-20">Loading products...</p>
        ) : data && data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {data.map((product) => (
                <div key={product._id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md font-semibold ${currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#ff7f00] text-white hover:bg-orange-600'
                  }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => handlePageClick(idx + 1)}
                  className={`px-4 py-2 rounded-md font-semibold ${currentPage === idx + 1
                      ? 'bg-[#ff7f00] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md font-semibold ${currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#ff7f00] text-white hover:bg-orange-600'
                  }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 text-lg font-medium mt-10">
            No products available.
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
