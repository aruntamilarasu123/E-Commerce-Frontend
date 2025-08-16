import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products with filters, search, and pagination
  const fetchProducts = useCallback(
    async ({
      search = "",
      category = "",
      minPrice = "",
      maxPrice = "",
      sort = "",
      page = 1,
      limit = 8,
    } = {}) => {
      setLoading(true);
      try {
        const response = await axios.get("https://e-commerce-backend-getc.onrender.com/products", {
          params: { search, category, minPrice, maxPrice, sort, page, limit },
        });

        setData(response.data.products || []);
        setTotalPages(response.data.pages || 1);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setData([]);
        setTotalPages(1);
      }
      setLoading(false);
    },
    []
  );

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => ({
      items: [...(prevCart.items || []), product],
    }));
  };

  // Fetch initial products on mount
  useEffect(() => {
    fetchProducts({ page: 1, limit: 8 });
  }, [fetchProducts]);

  return (
    <MyContext.Provider
      value={{
        data,
        setData,
        cart,
        setCart,
        addToCart,
        fetchProducts,
        loading,
        totalPages,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
