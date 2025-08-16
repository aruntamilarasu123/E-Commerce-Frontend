import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';

function ProductCart() {
  const { cart, setCart } = useContext(MyContext);
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [shippingAddress, setShippingAddress] = useState(localStorage.getItem('shippingAddress') || '');
  const [paymentMethod, setPaymentMethod] = useState(localStorage.getItem('paymentMethod') || 'cod');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const discountRate = 0.1;
  const taxRate = 0.05;
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString();

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('https://e-commerce-backend-getc.onrender.com/cart/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (res.ok) setCart(data);
      } catch (err) {
        console.error('Failed to fetch cart:', err.message);
      }
      setLoadingCart(false);
    };
    fetchCart();
  }, [setCart]);

  // Set initial quantities
  useEffect(() => {
    const initial = {};
    cart?.items?.forEach(item => {
      if (item.product?._id) initial[item.product._id] = item.quantity || 1;
    });
    setQuantities(initial);
  }, [cart]);

  // Calculate total
  useEffect(() => {
    let totalAmt = 0;
    cart?.items?.forEach(item => {
      const qty = quantities[item.product?._id] || 1;
      totalAmt += (item.product?.price || 0) * qty;
    });
    setTotal(totalAmt);
  }, [quantities, cart]);

  // Update quantity in backend
  const handleQuantityChange = async (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({ ...prev, [productId]: qty }));

    try {
      const res = await fetch(`https://e-commerce-backend-getc.onrender.com/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ quantity: qty }),
      });
      const updatedCart = await res.json();
      if (res.ok) setCart(updatedCart);
    } catch (err) {
      console.error('Failed to update quantity:', err.message);
    }
  };

  // Remove product from cart
  const handleRemove = async (productId) => {
    try {
      const res = await fetch(`https://e-commerce-backend-getc.onrender.com/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const updatedCart = await res.json();
      if (res.ok) setCart(updatedCart);
    } catch (err) {
      console.error('Failed to remove item:', err.message);
    }
  };

  // Place order

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const handlePlaceOrder = async () => {
  setError(null);
  if (!shippingAddress.trim()) {
    setError('Please enter shipping address.');
    return;
  }

  setPlacingOrder(true);
  localStorage.setItem('shippingAddress', shippingAddress);
  localStorage.setItem('paymentMethod', paymentMethod);

  try {
    if (paymentMethod === 'cod') {
      const res = await fetch('https://e-commerce-backend-getc.onrender.com/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ shippingAddress, paymentMethod: 'cod' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');

      setCart({ items: [] });
      localStorage.setItem('lastOrder', JSON.stringify(data));
      navigate('/buyer/placeorder', { state: { order: data } });
      setPlacingOrder(false);
      return;
    }

    // Online payment via Razorpay
    const ok = await loadRazorpayScript();
    if (!ok) throw new Error('Failed to load Razorpay');

    // get public key
    const keyRes = await fetch('https://e-commerce-backend-getc.onrender.com/payments/key', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const { key } = await keyRes.json();

    // create razorpay order (server computes amount from cart)
    const createRes = await fetch('https://e-commerce-backend-getc.onrender.com/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({}),
    });
    const createData = await createRes.json();
    if (!createRes.ok || !createData?.order?.id) {
      throw new Error(createData.message || 'Failed to initialize payment');
    }

    const rzpOptions = {
      key,
      amount: createData.order.amount,          
      currency: createData.order.currency,
      name: 'Your Store',
      description: 'Order Payment',
      order_id: createData.order.id,
      handler: async function (response) {
        try {
          // verify on backend & place order
          const verifyRes = await fetch('https://e-commerce-backend-getc.onrender.com/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.message || 'Payment verification failed');
          }

          // success → clear cart locally, save last order and navigate
          setCart({ items: [] });
          localStorage.setItem('lastOrder', JSON.stringify(verifyData));
          navigate('/buyer/placeorder', { state: { order: verifyData } });
        } catch (e) {
          alert(e.message || 'Payment verification error');
        }
      },
      prefill: {
        name: localStorage.getItem('name') || 'Buyer',
        email: localStorage.getItem('email') || 'buyer@example.com',
      },
      theme: { color: '#ff7f00' },
      modal: {
        ondismiss: function () {
        },
      },
    };

    const rzp = new window.Razorpay(rzpOptions);
    rzp.open();
  } catch (err) {
    setError(err.message);
  }
  setPlacingOrder(false);
};

  if (loadingCart) return <div className="flex justify-center items-center h-screen text-gray-500 text-lg">Loading your cart...</div>;
  if (!cart?.items?.length) return <div className="flex justify-center items-center h-screen text-gray-500 text-lg">Your cart is empty.</div>;

  const discount = total * discountRate;
  const tax = total * taxRate;
  const grandTotal = total - discount + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.items.map((item, idx) => {
            const product = item.product || {};
            const productId = product._id || `fallback-${idx}`;
            const quantity = quantities[productId] || 1;
            const price = product.price || 0;
            const imageUrl = product.images?.[0]?.url || '/placeholder.png';

            return (
              <div key={productId} className="flex flex-col sm:flex-row justify-between items-center border rounded-lg p-4 shadow hover:shadow-lg transition bg-white">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <img src={imageUrl} alt={product.name || 'Product'} className="w-20 h-20 object-cover rounded" />
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800">{product.name || 'Unnamed Product'}</p>
                    <p className="text-gray-600">Unit Price: ₹{price}</p>
                    <div className="flex items-center mt-1">
                      <label className="text-sm text-gray-500">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(productId, e.target.value)}
                        className="w-16 ml-2 px-2 py-1 border rounded focus:ring-2 focus:ring-[#ff7f00]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end mt-4 sm:mt-0 space-y-2">
                  <p className="font-semibold text-green-700 text-lg">₹{(price * quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemove(productId)} className="text-sm text-red-600 hover:text-red-700 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Order Summary</h3>
          <div className="space-y-1">
            <p className="flex justify-between"><span>Subtotal:</span> <span>₹{total.toFixed(2)}</span></p>
            <p className="flex justify-between text-red-600"><span>Discount (10%):</span> <span>-₹{discount.toFixed(2)}</span></p>
            <p className="flex justify-between"><span>Tax (5%):</span> <span>₹{tax.toFixed(2)}</span></p>
            <p className="flex justify-between font-semibold text-lg"><span>Total:</span> <span>₹{grandTotal.toFixed(2)}</span></p>
            <p className="text-sm text-gray-500 italic">Estimated Delivery: {estimatedDelivery}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Shipping Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[#ff7f00]"
                placeholder="Enter your shipping address"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[#ff7f00]"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="upi">Online</option>
              </select>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full px-6 py-2 bg-[#ff7f00] text-white rounded hover:bg-orange-600 disabled:opacity-50 transition"
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCart;
