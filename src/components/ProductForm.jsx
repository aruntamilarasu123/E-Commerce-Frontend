import React, { useState, useEffect } from 'react';

function ProductForm({ onClose, product }) {
  const isEditing = !!product;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
  });

  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        images: [],
      });
    }
  }, [isEditing, product]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? Array.from(files) : [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in.');

    const { name, description, price, stock, category, images } = formData;
    if (!name || !description || !price || !stock || !category || (!isEditing && images.length === 0)) {
      return alert('Please fill all fields and upload at least one image.');
    }

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('price', price);
    data.append('stock', stock);
    data.append('category', category);
    images.forEach((img) => data.append('images', img));

    const url = isEditing
      ? `https://e-commerce-backend-getc.onrender.com/products/${product._id}`
      : 'https://e-commerce-backend-getc.onrender.com/products/';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      if (!res.ok) throw new Error('Failed to save product');
      alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
      location.reload();
    } catch (err) {
      alert(`Failed to ${isEditing ? 'update' : 'create'} product`);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-semibold text-[#ff7f00]">
          {isEditing ? 'Edit' : 'Create'} Product
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 text-3xl font-bold transition-colors duration-200"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">-- Select Category --</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Beauty">Beauty</option>
              <option value="Books">Books</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            {isEditing ? 'Update Images (optional)' : 'Upload Images'}
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            {...(!isEditing ? { required: true } : {})}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#ff7f00] hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition duration-200"
        >
          {isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
