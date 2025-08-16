import React, { useContext, useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import { MyContext } from '../context/ContextProvider';

function ProductsPage() {
  const { data, fetchProducts, totalPages, loading } = useContext(MyContext);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const getCurrentUserId = () => localStorage.getItem('userId');

  const handleOpenForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://e-commerce-backend-getc.onrender.com/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Delete failed');
      alert('Product deleted successfully!');
      fetchProducts({ page: currentPage, limit: productsPerPage });
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Fetch seller products with pagination
  useEffect(() => {
    fetchProducts({ page: currentPage, limit: productsPerPage });
  }, [currentPage, fetchProducts]);

  // Filter only current seller’s products
  const userId = getCurrentUserId();
  const filteredData = data?.filter((product) => product.seller?._id === userId);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Products - {filteredData?.length || 0} Nos
        </h2>
        <button
          onClick={handleOpenForm}
          className="px-6 py-2.5 text-white bg-[#ff7f00] hover:bg-orange-600 rounded-md text-sm sm:text-base font-medium shadow-sm transition duration-200"
        >
          + Create Product
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-5 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : filteredData?.length > 0 ? (
              filteredData.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{product.stock}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">₹{product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1.5 text-xs text-white bg-green-600 hover:bg-green-700 rounded-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-md transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-5 text-center text-gray-500 text-sm">
                  No products found for this user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : filteredData?.length > 0 ? (
          filteredData.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-gray-800 font-semibold">{product.name}</h3>
                <span className="text-gray-500 text-sm">{product.category}</span>
              </div>
              <p className="text-gray-700 text-sm">Stock: {product.stock}</p>
              <p className="text-gray-800 font-medium">Price: ₹{product.price.toFixed(2)}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products found for this user.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md font-semibold ${
              currentPage === 1
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
              className={`px-4 py-2 rounded-md font-semibold ${
                currentPage === idx + 1
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
            className={`px-4 py-2 rounded-md font-semibold ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#ff7f00] text-white hover:bg-orange-600'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 md:p-8 relative max-h-screen overflow-y-auto">
            <ProductForm onClose={handleCloseForm} product={editingProduct} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
