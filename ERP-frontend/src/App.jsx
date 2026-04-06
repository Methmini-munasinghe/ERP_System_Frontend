import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProductsPage from "./pages/ProductsPage";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
 
function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <AppRouter /> 
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}
 
export default App;
