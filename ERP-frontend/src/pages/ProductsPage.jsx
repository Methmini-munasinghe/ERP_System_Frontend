import { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, AlertTriangle, CalendarDays, Download, Loader2, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";

import AddProducts from "./addProducts";
import EditProduct from "./editProduct";

const API_BASE_URL = "http://localhost:5000/api";
const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRange, setSelectedRange] = useState("1d");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockLevel, setSelectedStockLevel] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/getAll`);
      setProducts(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoryId?.categoryName === selectedCategory;
    const matchesStockLevel = selectedStockLevel === "all" || (product.item_count || 0) >= (selectedStockLevel === "in-stock" ? 1 : 0);
    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const rangeOptions = ["1d", "7d", "30d", "90d", "365d"];
  const categoryOptions = ["all", "electronics", "clothing", "home", "sports", "books", "toys", "games", "tools", "health", "beauty", "groceries", "furniture", "vehicles", "animals", "ground", "air", "water", "space", "other"];

  const handleExport = () => {
    // Export logic
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setIsDeleting(true);
      // Delete logic
      setProducts(products.filter((product) => product._id !== productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div>
          <h1 className="m-0 text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-gray-500 text-[0.92rem]">Manage your inventory and track stock levels</p>
        </div>
        <div className="inline-flex items-center gap-2">
          <button
            className="border border-violet-500 bg-white text-violet-500 rounded-[10px] px-4 py-[9px] text-[0.9rem] font-semibold flex items-center gap-2 hover:bg-violet-50 transition"
            type="button"
            onClick={() => setShowAddProductModal(true)}
          >
            <span className="w-5 h-5 rounded-full border-2 border-violet-500 bg-white text-violet-500 text-[0.95rem] font-bold flex items-center justify-center">+</span>
            <span>Add New Product</span>
          </button>
          <button className="border border-violet-500 bg-violet-500 text-white rounded-[10px] px-4 py-[9px] text-[0.9rem] font-semibold flex items-center gap-2 hover:bg-violet-600 transition" onClick={handleExport}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 flex-wrap mb-8">
          <div className="relative inline-flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-lg bg-white px-3 py-2 min-w-[220px] text-gray-400">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="border-none outline-none text-[0.9rem] text-gray-700 w-full bg-transparent placeholder:text-gray-400"
              />
            </div>
            <button
              className={`border border-gray-200 bg-white text-gray-500 rounded-lg px-3 py-2 text-[0.85rem] font-semibold flex items-center gap-2 transition hover:border-violet-500 hover:text-violet-600 ${showFilterPanel ? "border-violet-500 text-violet-600 bg-violet-50" : ""}`}
              type="button"
              onClick={() => setShowFilterPanel((value) => !value)}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>

            {showFilterPanel && (
              <div className="absolute left-0 top-[calc(100%+8px)] w-60 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-40 flex flex-col gap-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="categoryFilter" className="text-xs text-gray-500 font-semibold">Category</label>
                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="border border-gray-300 rounded-lg bg-white text-[0.85rem] px-2 py-2 outline-none focus:border-violet-500 text-gray-700"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="stockFilter" className="text-xs text-gray-500 font-semibold">Stock Level</label>
                  <select
                    id="stockFilter"
                    value={selectedStockLevel}
                    onChange={(event) => setSelectedStockLevel(event.target.value)}
                    className="border border-gray-300 rounded-lg bg-white text-[0.85rem] px-2 py-2 outline-none focus:border-violet-500 text-gray-700"
                  >
                    <option value="all">All Stock </option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-[0.84rem] font-semibold px-2 py-2 hover:border-violet-500 hover:text-violet-600"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedStockLevel("all");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          <div className="inline-flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
              {rangeOptions.map((range) => (
                <button
                  key={range}
                  type="button"
                  className={`border-r border-gray-200 last:border-r-0 bg-white text-gray-500 px-2 py-2 text-xs font-semibold min-w-[38px] transition ${selectedRange === range ? "bg-gray-100 text-gray-800" : ""}`}
                  onClick={() => setSelectedRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="border border-gray-200 bg-white text-gray-500 rounded-lg px-3 py-2 text-[0.85rem] font-semibold flex items-center gap-2 transition hover:border-violet-500 hover:text-violet-600" type="button">
              <CalendarDays size={16} />
              <span>Select dates</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-12 text-center bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4"></th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Product Name</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Product ID</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Supplier ID</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Category</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Price</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Weight (lb)</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Stock Level</th>
                <th className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 text-base py-12">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Loading products...</span>
                    </span>
                  </td>
                </tr>
              )}
              {error && !loading && (
                <tr>
                  <td colSpan="9" className="text-center text-red-600 text-base py-12">
                    <span className="inline-flex items-center gap-2">
                      <AlertCircle size={18} className="text-red-600" />
                      <strong>Error:</strong>
                      <span>{error}</span>
                    </span>
                  </td>
                </tr>
              )}
              {!loading && !error && filteredProducts.length > 0 &&
                paginatedProducts.map((product) => {
                  return (
                    <tr key={product._id} className="transition hover:bg-gray-50 hover:shadow-sm">
                      <td className="w-12 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-violet-500 cursor-pointer"
                          aria-label={`Select ${product.productName}`}
                        />
                      </td>
                      <td>
                        <div className="flex items-center gap-6">
                          {product.mainImage ? (
                            <img
                              src={product.mainImage}
                              alt={product.productName}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 bg-gray-50"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full border-2 border-gray-300 bg-transparent flex-shrink-0" aria-label="No product image" />
                          )}
                          <div className="font-semibold text-gray-900 text-[0.92rem] leading-tight">
                            {product.productName}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-gray-500 text-[0.98rem] font-medium tracking-tight">
                          {product._id.slice(-8)}
                        </span>
                      </td>
                      <td>
                        <div className="inline-flex items-center gap-1">
                          <span className="text-gray-500 text-[0.9rem] font-bold underline underline-offset-2">
                            {product.supplierId || product.supplierCode || product.supplier?.supplierId || "N/A"}
                          </span>
                          {Number(product.supplierCount) > 0 && (
                            <span className="border border-gray-400 rounded-full text-gray-500 bg-white text-xs px-1.5 font-semibold ml-1">+{product.supplierCount}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-gray-500 text-[0.9rem] font-bold underline underline-offset-2">
                          {product.categoryId?.categoryName || "Uncategorized"}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-emerald-600 text-[0.95rem]">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td>{product.weight || "—"} lb</td>
                      <td className="font-bold text-gray-800">
                        {product.item_count || 0} units
                      </td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <button
                            className="w-8 h-8 border border-violet-200 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center transition hover:bg-violet-100 hover:border-violet-500"
                            aria-label="Edit product"
                            type="button"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowEditProductModal(true);
                            }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="w-8 h-8 border border-red-200 bg-red-50 text-red-600 rounded-lg flex items-center justify-center transition hover:bg-red-100 hover:border-red-500"
                            aria-label="Delete product"
                            type="button"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
              {!loading && !error && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center text-gray-400 text-base py-12">
                    <span> No products found.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && totalPages > 1 && (
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
                  className={`pagination-btn pagination-number ${
                    currentPage === pageNumber ? "pagination-number-active" : ""
                  }`}
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

      <AddProducts
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      />

      <EditProduct
        isOpen={showEditProductModal}
        onClose={() => setShowEditProductModal(false)}
        product={selectedProduct}
        onSave={fetchProducts}
      />

      {showDeleteModal && (
        <div className="products-delete-overlay" onClick={handleDeleteCancel}>
          <div className="products-delete-modal" onClick={(event) => event.stopPropagation()}>
            <div className="products-delete-icon-wrap">
              <AlertTriangle size={46} strokeWidth={1.8} />
            </div>
            <p className="products-delete-message">
              Do you really want to delete the product!
              <br />
              Are you sure?
            </p>
            <div className="products-delete-actions">
              <button
                type="button"
                className="products-delete-yes-btn"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes"}
              </button>
              <button
                type="button"
                className="products-delete-no-btn"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}