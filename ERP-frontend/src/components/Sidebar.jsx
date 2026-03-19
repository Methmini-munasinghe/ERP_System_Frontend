import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
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
} from "lucide-react";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, path: "/" },
  { name: "Products", icon: Box, path: "/products" },
  { name: "Supplier", icon: Users, path: "/supplier" },
  { name: "Category", icon: Layers, path: "/category" },
  { name: "Warehouse", icon: Warehouse, path: "/warehouse" },
  { name: "Payment", icon: CreditCard, path: "/payment" },
  { name: "Roles", icon: ShieldCheck, path: "/roles" },
  { name: "Support", icon: LifeBuoy, path: "/support" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div>
        <h1 className="sidebar-brand">
          The<span className="sidebar-brand-highlight">UnityWare</span>
        </h1>

        <input
          type="text"
          placeholder="Search"
          className="sidebar-search"
        />

        <ul className="sidebar-menu">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${
                    isActive ? "sidebar-link-active" : ""
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-profile">
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="sidebar-avatar"
        />
        <div>
          <p className="sidebar-name">Olivia Rhye</p>
          <p className="sidebar-role">Admin</p>
        </div>
      </div>
    </aside>
  );
}