import React, { useEffect, useState } from "react";
import axios from "axios";

// Status badge styles
const statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  processing: "bg-blue-200 text-blue-800",
  shipped: "bg-purple-200 text-purple-800",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

const paymentColors = {
  pending: "bg-yellow-200 text-yellow-800",
  paid: "bg-green-200 text-green-800",
  failed: "bg-red-200 text-red-800",
};

// Reusable status badge
const renderStatusBadge = (status) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      statusColors[status] || "bg-gray-200 text-gray-800"
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

// Reusable payment badge
const renderPaymentBadge = (paymentStatus) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      paymentColors[paymentStatus] || "bg-gray-200 text-gray-800"
    }`}
  >
    {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
  </span>
);

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seller orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://e-commerce-backend-getc.onrender.com/orders/seller", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });


      // backend sends array directly, not { orders: [...] }
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrders([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `https://e-commerce-backend-getc.onrender.com/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: response.data.status } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Failed to update order status");
    }
  };

  // Mark COD as paid
  const handleMarkPaid = async (orderId) => {
    try {
      const response = await axios.patch(
        `https://e-commerce-backend-getc.onrender.com/orders/${orderId}/mark-paid`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, paymentStatus: response.data.order.paymentStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Failed to mark COD order as paid", err);
      alert("Failed to mark COD order as paid");
    }
  };

  if (loading) return <p className="p-4">Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Seller Orders</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Order ID</th>
              <th className="px-4 py-2 text-left text-sm">Buyer</th>
              <th className="px-4 py-2 text-left text-sm">Items</th>
              <th className="px-4 py-2 text-left text-sm">Status</th>
              <th className="px-4 py-2 text-left text-sm">Payment</th>
              <th className="px-4 py-2 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isFinalStatus =
                order.status === "delivered" || order.status === "cancelled";

              return (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-3 text-sm">{order._id}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.buyer?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <ul className="list-disc list-inside">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.product?.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col gap-1">
                      {renderStatusBadge(order.status)}
                      {!isFinalStatus && (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="mt-1 border px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col gap-1">
                      {renderPaymentBadge(order.paymentStatus)}
                      <span className="text-xs text-gray-600">
                        Mode: {order.paymentMethod?.toUpperCase()}
                      </span>

                      {order.paymentMethod === "cod" &&
                        order.paymentStatus !== "paid" && (
                          <button
                            onClick={() => handleMarkPaid(order._id)}
                            className="mt-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Mark as Paid
                          </button>
                        )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-sm">
                    {!isFinalStatus && (
                      <button
                        onClick={() => handleStatusChange(order._id, "cancelled")}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {orders.map((order) => {
          const isFinalStatus =
            order.status === "delivered" || order.status === "cancelled";

          return (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm">
              <p className="text-sm font-medium">Order ID: {order._id}</p>
              <p className="text-sm">Buyer: {order.buyer?.name || "Unknown"}</p>

              <div className="mt-2">
                <p className="text-sm font-medium">Items:</p>
                <ul className="list-disc list-inside text-sm">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.product?.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status */}
              <div className="mt-2 flex flex-col">
                {renderStatusBadge(order.status)}
                {!isFinalStatus && (
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="mt-1 border px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
              </div>

              {/* Payment */}
              <div className="mt-2 flex flex-col text-sm">
                {renderPaymentBadge(order.paymentStatus)}
                <span className="text-xs text-gray-600">
                  Mode: {order.paymentMethod?.toUpperCase()}
                </span>

                {order.paymentMethod === "cod" &&
                  order.paymentStatus !== "paid" && (
                    <button
                      onClick={() => handleMarkPaid(order._id)}
                      className="mt-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Mark as Paid
                    </button>
                  )}
              </div>

              {/* Actions */}
              {!isFinalStatus && (
                <button
                  onClick={() => handleStatusChange(order._id, "cancelled")}
                  className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SellerOrders;
