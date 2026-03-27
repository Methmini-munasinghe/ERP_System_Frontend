import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Download, Pencil, Trash2, Plus } from "lucide-react";
import { getSuppliers } from "../api/supplierApi";
import AddSupplier from "./addSupplier";
import EditSupplier from "./editSupplier";
import DeleteSupplierModal from "../components/DeleteSupplierModal";
import axios from "axios";


export default function SupplierPage() {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await getSuppliers();
      setSuppliers(res.data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(s => (s.name || s.contactName || "").toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = filteredSuppliers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const activeCount = suppliers.filter(s => (s.status || s.supplierStatus || '').toLowerCase() === 'active').length;
  const inactiveCount = suppliers.filter(s => (s.status || s.supplierStatus || '').toLowerCase() === 'inactive').length;
  const deletedCount = suppliers.filter(s => (s.status || s.supplierStatus || '').toLowerCase() === 'deleted').length;

  const handleExport = () => {
    if (!filteredSuppliers.length) return;
    const headers = [
      'Contact Name',
      'Supplier ID',
      'Contact',
      'Email',
      'Address',
      'Phone Number'
    ];
    const rows = filteredSuppliers.map(s => [
      s.name || s.contactName || '',
      s.supplierId || s.supplierID || '',
      s.contact || s.contactName || '',
      s.email || s.emailId || '',
      s.address || '',
      s.phone || s.phoneNumber || ''
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}` + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 flex-1 min-h-screen bg-gray-50">
      <button className="mb-4 text-violet-600 hover:underline text-sm font-medium">&lt; Back</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Suppliers</h1>
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="bg-violet-600 text-white rounded-xl px-8 py-6 flex-1 min-w-[220px] shadow">
          <div className="text-lg font-bold">{activeCount}</div>
          <div className="text-sm">Active Suppliers</div>
          <div className="text-xs mt-2 opacity-80">↑ 12% vs last month</div>
        </div>
        <div className="bg-white rounded-xl px-8 py-6 flex-1 min-w-[220px] shadow border border-gray-200">
          <div className="text-lg font-bold text-gray-700">{inactiveCount}</div>
          <div className="text-sm text-gray-500">Inactive Suppliers</div>
          <div className="text-xs mt-2 text-gray-400">↓ 12% vs last month</div>
        </div>
        <div className="bg-white rounded-xl px-8 py-6 flex-1 min-w-[220px] shadow border border-gray-200">
          <div className="text-lg font-bold text-gray-700">{deletedCount}</div>
          <div className="text-sm text-gray-500">Deleted Suppliers</div>
          <div className="text-xs mt-2 text-gray-400">↓ 12% vs last month</div>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Active Suppliers</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 flex-wrap">
          <div className="relative inline-flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-lg bg-white px-3 py-2 min-w-[220px] text-gray-400">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border-none outline-none text-[0.9rem] text-gray-700 w-full bg-transparent placeholder:text-gray-400"
              />
            </div>
            <button className="border border-gray-200 bg-white text-gray-500 rounded-lg px-3 py-2 text-[0.85rem] font-semibold flex items-center gap-2 transition hover:border-violet-500 hover:text-violet-600">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>
          <div className="inline-flex items-center gap-2 flex-wrap">
            <button
              className="border border-violet-500 bg-white text-violet-500 rounded-[10px] px-4 py-[9px] text-[0.9rem] font-semibold flex items-center gap-2 hover:bg-violet-50 transition"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} />
              <span>Add New Supplier</span>
            </button>
            <button
              className="border border-violet-500 bg-violet-500 text-white rounded-[10px] px-4 py-[9px] text-[0.9rem] font-semibold flex items-center gap-2 hover:bg-violet-600 transition"
              onClick={handleExport}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-12 text-center bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4"></th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Contact Name</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Supplier ID</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Contact</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Email-id</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Address</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Phone Number</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="8" className="text-center py-8 text-gray-400">Loading suppliers...</td></tr>
              )}
              {error && !loading && (
                <tr><td colSpan="8" className="text-center py-8 text-red-500">{error}</td></tr>
              )}
              {!loading && !error && paginatedSuppliers.map((supplier, idx) => (
                <tr key={supplier._id || supplier.id || idx} className="transition hover:bg-gray-50 hover:shadow-sm align-middle">
                  <td className="w-12 text-center py-4">
                    <input type="checkbox" className="w-4 h-4 accent-violet-500 cursor-pointer" />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {supplier.avatar || supplier.imageUrl ? (
                        <img src={supplier.avatar || supplier.imageUrl} alt={supplier.name || supplier.contactName} className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-gray-50" />
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-transparent flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                          {(supplier.name || supplier.contactName || "").split(" ").map(n => n[0]).join("")}
                        </div>
                      )}
                      <div className="font-semibold text-gray-900 text-[0.92rem] leading-tight">
                        {supplier.name || supplier.contactName}
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-500 text-[0.98rem] font-medium tracking-tight py-4">{supplier.supplierId || supplier.supplierID}</td>
                  <td className="text-gray-500 text-[0.9rem] font-bold py-4">{supplier.contact || supplier.contactName}</td>
                  <td className="text-gray-500 text-[0.9rem] py-4">{supplier.email || supplier.emailId}</td>
                  <td className="text-gray-500 text-[0.9rem] py-4">{supplier.address}</td>
                  <td className="text-gray-500 text-[0.9rem] py-4">{supplier.phone || supplier.phoneNumber}</td>
                  <td className="py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="w-8 h-8 border border-violet-200 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center transition hover:bg-violet-100 hover:border-violet-500 cursor-pointer"
                        aria-label="Edit supplier"
                        type="button"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setShowEditModal(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="w-8 h-8 border border-red-200 bg-red-50 text-red-600 rounded-lg flex items-center justify-center transition hover:bg-red-100 hover:border-red-500 cursor-pointer"
                        aria-label="Delete supplier"
                        type="button"
                        onClick={() => {
                          setSupplierToDelete(supplier);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="products-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="pagination-numbers">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`pagination-btn pagination-number ${currentPage === pageNumber ? "pagination-number-active" : ""}`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <AddSupplier isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={fetchSuppliers} />
      <EditSupplier
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        supplier={selectedSupplier}
        onSave={() => {
          setShowEditModal(false);
          fetchSuppliers();
        }}
      />
      <DeleteSupplierModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        supplier={supplierToDelete}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!supplierToDelete) return;
          setIsDeleting(true);
          try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/suppliers/${supplierToDelete._id}`);
            setShowDeleteModal(false);
            setSupplierToDelete(null);
            fetchSuppliers();
          } catch (err) {
            alert("Failed to delete supplier");
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </div>
  );
}
