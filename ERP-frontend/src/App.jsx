import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProductsPage from "./pages/ProductsPage";
import "./App.css";

const Dashboard = () => (
  <section>
    <h1 className="page-title">Dashboard Overview</h1>
    <div className="overview-grid">
     <h1>Dashboard Content</h1>
    </div>
  </section>
);

const Supplier = () => (
  <section>
    <h1 className="page-title">Supplier</h1>
    <div className="simple-panel">Supplier management content goes here.</div>
  </section>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}