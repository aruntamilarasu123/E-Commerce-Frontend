function DashboardHeader(){
  const name = localStorage.getItem('userName');

  return (
    <header className="flex justify-between items-center bg-white p-4 rounded shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">Welcome, {name || 'Seller'}</h1>
      <div className="text-sm text-gray-500">Seller Dashboard</div>
    </header>
  );
};

export default DashboardHeader;
