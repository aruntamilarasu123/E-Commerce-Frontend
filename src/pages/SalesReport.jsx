import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#FF7F00', '#1E90FF', '#32CD32', '#FF4500', '#8A2BE2', '#00CED1'];

const SalesReport = () => {
  const [paidDeliveredOrders, setPaidDeliveredOrders] = useState([]);
  const [pendingDeliveredOrders, setPendingDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get('https://e-commerce-backend-getc.onrender.com/orders/seller', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const paid = response.data.filter(
        order => order.status === 'delivered' && order.paymentStatus === 'paid'
      );

      const pending = response.data.filter(
        order => order.status === 'delivered' && order.paymentStatus !== 'paid'
      );

      setPaidDeliveredOrders(paid);
      setPendingDeliveredOrders(pending);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading sales report...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
  if (paidDeliveredOrders.length === 0 && pendingDeliveredOrders.length === 0) {
    return <p className="text-center mt-6 text-gray-500">No delivered orders yet.</p>;
  }

  // Summary (only paid orders)
  const totalRevenue = paidDeliveredOrders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.product.price * item.quantity, 0)
  , 0);

  const totalItemsSold = paidDeliveredOrders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
  , 0);

  // Prepare chart data (only paid orders)
  const productMap = {};
  paidDeliveredOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productMap[item.product.name]) {
        productMap[item.product.name] = { revenue: 0, quantity: 0 };
      }
      productMap[item.product.name].revenue += item.product.price * item.quantity;
      productMap[item.product.name].quantity += item.quantity;
    });
  });

  const barChartData = Object.keys(productMap).map(name => ({
    name,
    revenue: productMap[name].revenue,
  }));

  const pieChartData = Object.keys(productMap).map(name => ({
    name,
    value: productMap[name].quantity,
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Sales Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-green-600 mt-1">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Items Sold</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{totalItemsSold}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Delivered & Paid Orders</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">{paidDeliveredOrders.length}</p>
        </div>
      </div>

      {/* Charts (only paid orders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Revenue by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#FF7F00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Products Sold (Quantity)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Paid Delivered Orders Table */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Delivered & Paid Orders</h3>
      <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#ff7f00] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Buyer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Total Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paidDeliveredOrders.map(order => {
              const totalPrice = order.items.reduce(
                (sum, item) => sum + item.product.price * item.quantity, 0
              );
              return (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-800">{order._id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.buyer.name}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.items.map((item, idx) => (
                      <p key={idx}>{item.product.name} x {item.quantity}</p>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{totalPrice.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pending Payment Orders Table */}
      {pendingDeliveredOrders.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Delivered but Pending Payment</h3>
          <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Buyer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Payment Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {pendingDeliveredOrders.map(order => {
                  const totalPrice = order.items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity, 0
                  );
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-gray-800">{order._id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.buyer.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {order.items.map((item, idx) => (
                          <p key={idx}>{item.product.name} x {item.quantity}</p>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-yellow-600 font-semibold capitalize">{order.paymentStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesReport;
