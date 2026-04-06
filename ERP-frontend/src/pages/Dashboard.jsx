import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-3xl font-bold gap-6">
      <span>ERP Dashboard</span>

      <button
        onClick={() => navigate("/purchase-orders")}
        className="mt-4 px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition"
      >
        Purchase Orders
      </button>

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </div>
  );
}

export default Dashboard;