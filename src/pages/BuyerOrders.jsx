import React, { useEffect, useState } from 'react';

const statusColors = {
  pending: 'bg-yellow-200 text-yellow-800',
  processing: 'bg-blue-200 text-blue-800',
  shipped: 'bg-indigo-200 text-indigo-800',
  delivered: 'bg-green-200 text-green-800',
  cancelled: 'bg-red-200 text-red-800',
};

const paymentStatusColors = {
  paid: 'bg-green-200 text-green-800',
  pending: 'bg-yellow-200 text-yellow-800',
  failed: 'bg-red-200 text-red-800',
};

function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://e-commerce-backend-getc.onrender.com/orders/buyer', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
      else setError(data.message || 'Failed to fetch orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(orderId);
    try {
      const res = await fetch(`https://e-commerce-backend-getc.onrender.com/orders/buyer/${orderId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to cancel order');
      } else {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, status: 'cancelled', cancelledBy: 'buyer' }
              : o
          )
        );
      }
    } catch (err) {
      alert(err.message);
    }
    setCancelling(null);
  };

  // Pagination
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const renderStatusBadge = (status) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const renderPaymentBadge = (paymentStatus) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        paymentStatusColors[paymentStatus] || 'bg-gray-200 text-gray-700'
      }`}
    >
      {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
    </span>
  );

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (orders.length === 0) return <p className="text-center mt-10 text-gray-600">No orders found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Orders</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#ff7f00] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Total Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentOrders.map((order) => {
              const isFinalStatus = order.status === 'delivered' || order.status === 'cancelled';
              const totalPrice = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              return (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-800">{order._id}</td>
                  <td className="px-4 py-3 text-sm flex items-center gap-2">{renderStatusBadge(order.status)}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.items.map((item, idx) => (
                      <p key={idx}>{item.product?.name || 'Deleted Product'} x {item.quantity}</p>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm flex items-center gap-2">
                    {renderPaymentBadge(order.paymentStatus)}
                    <span className="text-xs text-gray-600">({order.paymentMethod.toUpperCase()})</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isFinalStatus || cancelling === order._id}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        isFinalStatus
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-[#ff7f00] text-white hover:bg-orange-600'
                      }`}
                    >
                      {cancelling === order._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {currentOrders.map((order) => {
          const isFinalStatus = order.status === 'delivered' || order.status === 'cancelled';
          const totalPrice = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          return (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                {renderStatusBadge(order.status)}
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={isFinalStatus || cancelling === order._id}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    isFinalStatus
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-[#ff7f00] text-white hover:bg-orange-600'
                  }`}
                >
                  {cancelling === order._id ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p className="font-medium">Items:</p>
                {order.items.map((item, idx) => (
                  <p key={idx}>
                    {item.product?.name || 'Deleted Product'} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                ))}
              </div>
              <p className="font-semibold text-gray-800 mt-2 text-right">Total: ₹{totalPrice.toFixed(2)}</p>

              {/* Payment Section */}
              <div className="mt-2 flex justify-between items-center text-sm">
                {renderPaymentBadge(order.paymentStatus)}
                <span className="text-gray-600">Method: {order.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BuyerOrders;
