import { Link } from "react-router";


function SellerSidebar(){
  const linkStyle = "block py-2 px-4 rounded hover:bg-blue-100 transition";

  return (
    <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Seller Panel</h2>
      <nav className="space-y-2">
        <Link to="products" className={linkStyle}>Products</Link>
        <Link to="orders" className={linkStyle}>Orders</Link>
        <Link to="reports" className={linkStyle}>Sales Reports</Link>
        <Link to="profile" className={linkStyle}>Profile</Link>
      </nav>
    </aside>
  );
};

export default SellerSidebar;
