import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProductsPage from "./pages/ProductsPage";
import SupplierPage from "./pages/SupplierPage";
import { Toaster } from "sonner";

const Dashboard = () => (
  <section>
    <h1 className="page-title">Dashboard Overview</h1>
    <div className="overview-grid">
     <h1>Dashboard Content</h1>
    </div>
  </section>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/supplier" element={<SupplierPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Toaster position="top-right" richColors />
      </div>
    </BrowserRouter>
  );
}