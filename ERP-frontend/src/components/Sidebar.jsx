import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Users,
  Layers,
  Warehouse,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  Settings,
  ChevronDown,
} from "lucide-react";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, path: "/overview" },
  { name: "Products", icon: Box, path: "/products" },
  { name: "Supplier", icon: Users, path: "/supplier", dropdown: true },
  { name: "Category", icon: Layers, path: "/category", dropdown: true },
  { name: "Warehouse", icon: Warehouse, path: "/warehouse", dropdown: true },
  { name: "Payment", icon: CreditCard, path: "/payment", dropdown: true },
  { name: "Roles", icon: ShieldCheck, path: "/roles", dropdown: true },
  { name: "Support", icon: LifeBuoy, path: "/support", dropdown: true },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-200 px-4 py-5 flex flex-col justify-between rounded-r-2xl overflow-y-auto">
      <div>
        <h1 className="mb-5 text-[1.2rem] font-bold text-gray-900">
          The<span className="text-purple-600">UnityWare</span>
        </h1>
        <input
          type="text"
          placeholder="Search"
          className="w-full border border-gray-300 rounded-[10px] px-3 py-2 mb-3 text-[0.9rem] text-gray-900 bg-gray-50 focus:outline-2 focus:outline-purple-300 focus:border-purple-500 focus:bg-white"
        />
        <ul className="flex flex-col gap-1.5 p-0 m-0 list-none">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[10px] text-gray-600 text-[0.9rem] font-medium transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 ${isActive ? "bg-purple-100 text-purple-700" : ""}`}
                >
                  <Icon size={20} className="shrink-0" />
                  <span>{item.name}</span>
                  {item.dropdown && <ChevronDown size={18} className="ml-auto text-gray-400" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-gray-200 mt-4 pt-3 flex items-center gap-2">
        <img src="https://i.pravatar.cc/40" alt="user" className="w-10 h-10 rounded-full" />
        <div>
          <p className="m-0 text-[0.9rem] font-semibold text-gray-900">Olivia Rhye</p>
          <p className="m-0 text-[0.8rem] text-gray-500">Admin</p>
        </div>
      </div>
    </aside>
  );
}