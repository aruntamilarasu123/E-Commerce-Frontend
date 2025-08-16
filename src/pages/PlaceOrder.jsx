import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from '../context/ContextProvider';

function PlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useContext(MyContext); // all products
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    let order = location.state?.order?.order;

    if (!order) {
      const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
      if (lastOrder) order = lastOrder.order || lastOrder;
    }

    if (!order) {
      navigate('/');
      return;
    }

    setOrderData(order);
  }, [location.state, navigate]);

  if (!orderData) return null;

  // Helper to get product info from context data
  const getProductDetails = (productId) => {
    return data.find((p) => p._id === productId) || { name: productId, images: [] };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-6 text-center sm:text-left">
          Thank you for your purchase. Your order ID is{' '}
          <span className="font-mono text-orange-600">{orderData._id}</span>.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Order Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {orderData?.items?.map((item, index) => {
                const product = getProductDetails(item.product); // match by ID
                const imageUrl = product.images?.[0]?.url || '/placeholder.png';
                return (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                    <td className="px-4 py-2 flex items-center space-x-2">
                      <img src={imageUrl} alt={product.name || 'Product'} className="w-12 h-12 object-cover rounded" />
                      <span>{product.name || product._id}</span>
                    </td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">₹{item.price.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-lg font-semibold text-gray-800 mt-6 mb-6 text-right">
          Total Paid: <span className="text-green-700">₹{orderData.totalAmount.toFixed(2)}</span>
        </p>

        <div className="flex justify-center sm:justify-end">
          <button
            onClick={() => navigate('/buyer/order')}
            className="px-6 py-2 bg-[#ff7f00] text-white rounded-lg shadow hover:bg-orange-600 transition"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
