import { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, AlertTriangle, CalendarDays, Download, Loader2, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import "./ProductsPage.css";
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

  useEffect(() => {
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, selectedStockLevel]);

  const rangeOptions = ["1d", "7d", "1m", "3m", "6m", "1y", "3y", "5y"];
  const categoryOptions = [
    "all",
    ...new Set(products.map((product) => product.categoryId?.categoryName || "Uncategorized")),
  ];

  const filteredProducts = products.filter((product) => {
    const query = searchTerm.trim().toLowerCase().replace(/\s+/g, " ");
    const productName = product.productName?.toLowerCase() || "";
    const categoryName = product.categoryId?.categoryName || "Uncategorized";
    const productId = product._id?.toLowerCase() || "";
    const shortProductId = product._id?.slice(-8).toLowerCase() || "";
    const priceText = String(product.price ?? "").toLowerCase();
    const weightText = String(product.weight ?? "").toLowerCase();
    const stockCount = Number(product.item_count);
    const stockUnits = Number.isFinite(stockCount) ? stockCount : 0;
    const stockText = String(stockUnits);

    const matchesSearch =
      !query ||
      productName.includes(query) ||
      categoryName.toLowerCase().includes(query) ||
      productId.includes(query) ||
      shortProductId.includes(query) ||
      priceText.includes(query) ||
      weightText.includes(query) ||
      stockText.includes(query);

    const matchesCategory = selectedCategory === "all" || categoryName === selectedCategory;

    const matchesStock =
      selectedStockLevel === "all" ||
      (selectedStockLevel === "in-stock" && stockUnits > 0) ||
      (selectedStockLevel === "low-stock" && stockUnits > 0 && stockUnits <= 100) ||
      (selectedStockLevel === "out-of-stock" && stockUnits === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleExport = () => {
    const headers = ["Product Name", "Product ID", "Category", "Price", "Weight (lb)", "Stock Level"];
    const rows = filteredProducts.map((product) => [
      product.productName || "",
      product._id || "",
      product.categoryId?.categoryName || "Uncategorized",
      product.price ?? "",
      product.weight ?? "",
      product.item_count ?? 0,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete?._id || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`${API_BASE_URL}/products/${productToDelete._id}`);
      setProducts((prevProducts) => prevProducts.filter((item) => item._id !== productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1 className="products-title">Products</h1>
          <p className="products-subtitle">Manage your inventory and track stock levels</p>
        </div>
        <div className="products-header-actions">
          <button
            className="products-add-btn"
            type="button"
            onClick={() => setShowAddProductModal(true)}
          >
            <span className="products-add-icon">+</span>
            <span>Add New Product</span>
          </button>
          <button className="products-export-btn" onClick={handleExport}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <div className="products-toolbar-left">
            <div className="products-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="products-search-input"
              />
            </div>
            <button
              className={`products-filter-btn ${showFilterPanel ? "products-filter-btn-active" : ""}`}
              type="button"
              onClick={() => setShowFilterPanel((value) => !value)}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>

            {showFilterPanel && (
              <div className="products-filter-panel">
                <div className="products-filter-row">
                  <label htmlFor="categoryFilter">Category</label>
                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="products-filter-row">
                  <label htmlFor="stockFilter">Stock Level</label>
                  <select
                    id="stockFilter"
                    value={selectedStockLevel}
                    onChange={(event) => setSelectedStockLevel(event.target.value)}
                  >
                    <option value="all">All Stock </option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="products-filter-reset-btn"
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

          <div className="products-toolbar-right">
            <div className="products-range-group">
              {rangeOptions.map((range) => (
                <button
                  key={range}
                  type="button"
                  className={`products-range-btn ${selectedRange === range ? "products-range-btn-active" : ""}`}
                  onClick={() => setSelectedRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="products-date-btn" type="button">
              <CalendarDays size={16} />
              <span>Select dates</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="products-table">
            <thead>
              <tr>
                <th className="checkbox-column"></th>
                <th>Product Name</th>
                <th>Product ID</th>
                <th>Supplier ID</th>
                <th>Category</th>
                <th>Price</th>
                <th>Weight (lb)</th>
                <th>Stock Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="9" className="products-loading">
                    <span className="products-state-inline">
                      <Loader2 size={18} className="products-loading-icon" />
                      <span>Loading products...</span>
                    </span>
                  </td>
                </tr>
              )}
              {error && !loading && (
                <tr>
                  <td colSpan="9" className="products-error">
                    <span className="products-state-inline">
                      <AlertCircle size={18} className="products-error-icon" />
                      <strong>Error:</strong>
                      <span>{error}</span>
                    </span>
                  </td>
                </tr>
              )}
              {!loading && !error && filteredProducts.length > 0 &&
                paginatedProducts.map((product) => {
                  return (
                    <tr key={product._id}>
                      <td className="checkbox-column">
                        <input
                          type="checkbox"
                          className="row-checkbox"
                          aria-label={`Select ${product.productName}`}
                        />
                      </td>
                      <td>
                        <div className="product-cell">
                          {product.mainImage ? (
                            <img
                              src={product.mainImage}
                              alt={product.productName}
                              className="product-image"
                            />
                          ) : (
                            <div className="product-image-placeholder" aria-label="No product image" />
                          )}
                          <div className="product-name">
                            {product.productName}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="product-id-badge">
                          {product._id.slice(-8)}
                        </span>
                      </td>
                      <td>
                        <div className="product-supplier-cell">
                          <span className="product-link-text">
                            {product.supplierId || product.supplierCode || product.supplier?.supplierId || "N/A"}
                          </span>
                          {Number(product.supplierCount) > 0 && (
                            <span className="product-supplier-extra">+{product.supplierCount}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="product-link-text">
                          {product.categoryId?.categoryName || "Uncategorized"}
                        </span>
                      </td>
                      <td>
                        <span className="product-price">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td>{product.weight || "—"} lb</td>
                      <td style={{ fontWeight: "600", color: "#1f2937" }}>
                        {product.item_count || 0} units
                      </td>
                      <td>
                        <div className="products-actions">
                          <button
                            className="products-edit-icon-btn"
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
                            className="products-delete-icon-btn"
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
                  <td colSpan="9" className="products-empty">
                    <span>📦 No products found.</span>
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