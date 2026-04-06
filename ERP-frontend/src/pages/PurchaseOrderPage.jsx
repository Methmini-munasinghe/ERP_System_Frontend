import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  cancelPurchaseOrder,
} from "../features/slices/purchaseOrderSlice";
import axiosClient from "../services/axiosClient";
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  Pencil, Trash2, Calendar, FileText, MapPin, Timer,
  XCircle, ImagePlus, X, Plus, AlertTriangle, FileDown,
  Eye, RefreshCw,
} from "lucide-react";

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
  drafted:      { dot: "bg-gray-500",   text: "text-gray-600",   bg: "bg-gray-100"  },
  pending:      { dot: "bg-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50" },
  received:     { dot: "bg-green-500",  text: "text-green-600",  bg: "bg-green-50"  },
  rejected:     { dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50"    },
  "in transit": { dot: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
  cancelled:    { dot: "bg-red-300",    text: "text-red-400",    bg: "bg-red-50"    },
};

const ALL_STATUSES = ["pending", "confirmed", "cancelled"];

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase();
  const cfg = statusConfig[key] || statusConfig.drafted;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
      <div className="flex justify-center mb-5">
        <AlertTriangle className="w-14 h-14 text-amber-400" strokeWidth={1.5} />
      </div>
      <p className="text-gray-800 font-semibold text-lg leading-snug mb-1">{message}</p>
      <p className="text-gray-500 text-base mb-8">Are you sure?</p>
      <div className="flex gap-4">
        <button onClick={onConfirm} className="flex-1 bg-[#7C3AED] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#6D28D9] transition">Yes</button>
        <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-base hover:bg-gray-50 transition">No</button>
      </div>
    </div>
  </div>
);

// ─── View Modal ───────────────────────────────────────────────────────────────
const ViewModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Purchase Order Details</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-7 py-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status</span>
            <StatusBadge status={order.status} />
          </div>

          <div className="border-t border-gray-100" />

          {/* Order ID */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Purchase Order ID</span>
            <span className="text-xs font-semibold text-gray-800">{order._id?.slice(-10).toUpperCase()}</span>
          </div>

          {/* Ordered Date */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Ordered Date</span>
            <span className="text-xs text-gray-700">
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {" "}
              {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {/* Supplier */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Supplier</span>
            <span className="text-xs text-[#7C3AED] font-medium">{order.supplierName || "—"}</span>
          </div>

          {/* Supplier ID */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Supplier ID</span>
            <span className="text-xs text-gray-700">{order.supplierId || "—"}</span>
          </div>

          {/* Product */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Product</span>
            <span className="text-xs text-gray-700 font-medium">{order.productName || "—"}</span>
          </div>

          {/* Product ID */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Product ID</span>
            <span className="text-xs text-gray-700">{order.productId || "—"}</span>
          </div>

          {/* Quantity */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Quantity</span>
            <span className="text-xs text-gray-700">{order.quantity}</span>
          </div>

          {/* ETA */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">ETA</span>
            <span className="text-xs text-gray-700">
              {order.eta
                ? `${new Date(order.eta).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${new Date(order.eta).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                : "NA"}
            </span>
          </div>

          {/* Images */}
          {order.images && order.images.length > 0 && (
            <>
              <div className="border-t border-gray-100" />
              <div>
                <span className="text-xs text-gray-500 block mb-2">Product Images</span>
                <div className="flex gap-3 flex-wrap">
                  {order.images.map((src, i) => (
                    <img key={i} src={src} alt={`img-${i}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-7 pb-6">
          <button onClick={onClose} className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Status Modal ────────────────────────────────────────────────────────
const EditStatusModal = ({ order, onClose, onSave, loading }) => {
  const [status, setStatus] = useState(order?.status || "");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!order) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
          {/* Header */}
          <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Edit Order Status</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-7 py-5">
            <p className="text-xs text-gray-400 mb-1">Order ID</p>
            <p className="text-sm font-semibold text-gray-800 mb-4">{order._id?.slice(-10).toUpperCase()}</p>

            <label className="text-xs text-gray-500 mb-1.5 block">New Status</label>
            <div className="relative mb-6">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#7C3AED] bg-white pr-8 text-gray-700"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5 rotate-90" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={status === order.status || loading}
                className="flex-1 bg-[#7C3AED] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#6D28D9] transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message={`Do you really want to change status to "${status}"!`}
          onConfirm={() => { setShowConfirm(false); onSave(order._id, status); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

// ─── Image Drop Zone ──────────────────────────────────────────────────────────
const ImageDropZone = ({ images, onChange }) => {
  const [dragging, setDragging] = useState(false);

  const processFiles = (files) => {
    const remaining = 3 - images.length;
    const toAdd = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, remaining);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange((prev) => prev.length < 3 ? [...prev, { src: e.target.result, name: file.name, file }] : prev);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); };
  const removeImage = (index) => onChange((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="mb-5">
      <label className="text-xs text-gray-500 mb-1.5 block">Product Images (up to 3)</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all
          ${dragging ? "border-[#7C3AED] bg-purple-50" : "border-gray-200 bg-gray-50"}
          ${images.length >= 3 ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-[#7C3AED] hover:bg-purple-50/40"}`}
      >
        <input type="file" accept="image/*" multiple disabled={images.length >= 3} className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => processFiles(e.target.files)} />
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <ImagePlus className="w-7 h-7 text-gray-400" />
          <p className="text-sm text-gray-400">Drag & drop images here, or <span className="text-[#7C3AED] font-medium">browse</span></p>
          <p className="text-xs text-gray-300">{images.length}/3 images added · PNG, JPG, WEBP</p>
        </div>
      </div>
      {images.length > 0 && (
        <div className="flex gap-3 mt-3 flex-wrap">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img.src} alt={img.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
              <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <X className="w-3 h-3" />
              </button>
              <p className="text-xs text-gray-400 mt-1 truncate w-20">{img.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Create Modal ─────────────────────────────────────────────────────────────
const CreateModal = ({ onClose, onSubmit, loading }) => {
  const [supplierId, setSupplierId]     = useState("");
  const [productId, setProductId]       = useState("");
  const [quantity, setQuantity]         = useState("");
  const [images, setImages]             = useState([]);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [productOptions, setProductOptions]   = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingProducts, setLoadingProducts]   = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingSuppliers(true);
      setLoadingProducts(true);
      try {
        const [suppRes, prodRes] = await Promise.all([
          axiosClient.get("/suppliers"),
          axiosClient.get("/products"),
        ]);
        setSupplierOptions(suppRes.data);
        setProductOptions(prodRes.data);
      } catch {
        toast.error("Failed to load suppliers or products");
      } finally {
        setLoadingSuppliers(false);
        setLoadingProducts(false);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = () => {
    if (!supplierId) { toast.error("Please select a supplier"); return; }
    if (!productId)  { toast.error("Please select a product");  return; }
    if (!quantity)   { toast.error("Please enter quantity");     return; }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    const formData = new FormData();
    formData.append("supplierId", supplierId);
    formData.append("productId", productId);
    formData.append("quantity", quantity);
    images.forEach((img) => formData.append("images", img.file));
    onSubmit(formData);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Create New Purchase Order</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-8 py-6">
            {/* Product */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Product</label>
              <div className="relative">
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  disabled={loadingProducts}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#7C3AED] bg-white pr-8 text-gray-700 disabled:opacity-60"
                >
                  <option value="">{loadingProducts ? "Loading..." : "Select Product"}</option>
                  {productOptions.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.productName} ({p.productId || p._id?.slice(-6).toUpperCase()})
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity here"
                min="1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] placeholder-gray-300"
              />
            </div>

            {/* Image Upload */}
            <ImageDropZone images={images} onChange={setImages} />

            <div className="border-t border-gray-200 mb-5" />

            {/* Supplier + Submit */}
            <div className="flex items-end gap-4">
              <div className="w-52">
                <label className="text-xs text-gray-500 mb-1 block">Supplier</label>
                <div className="relative">
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    disabled={loadingSuppliers}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#7C3AED] bg-white pr-8 text-gray-700 disabled:opacity-60"
                  >
                    <option value="">{loadingSuppliers ? "Loading..." : "Select Supplier"}</option>
                    {supplierOptions.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.fullName} ({s.supplierId || s._id?.slice(-6).toUpperCase()})
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5 rotate-90" />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[#7C3AED] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#6D28D9] transition disabled:opacity-60"
              >
                {loading ? "Placing..." : "Place Purchase Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="Do you really want to place the purchase order!"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PurchaseOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.purchaseOrder);

  const [showCreate, setShowCreate]       = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [viewOrder, setViewOrder]         = useState(null);
  const [editOrder, setEditOrder]         = useState(null);
  const [editLoading, setEditLoading]     = useState(false);
  const [search, setSearch]               = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentPage, setCurrentPage]     = useState(1);
  const [activeTimeFilter, setActiveTimeFilter] = useState("7d");
  const itemsPerPage = 8;

  useEffect(() => { dispatch(fetchPurchaseOrders()); }, [dispatch]);

  const filtered = orders.filter((o) =>
    o._id?.toLowerCase().includes(search.toLowerCase()) ||
    o.supplierName?.toLowerCase().includes(search.toLowerCase()) ||
    o.productName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreate = async (formData) => {
    setCreateLoading(true);
    const res = await dispatch(createPurchaseOrder(formData));
    setCreateLoading(false);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Purchase order created!");
      setShowCreate(false);
    } else {
      toast.error(res.payload || "Failed to create order");
    }
  };

  const handleEditSave = async (id, status) => {
    setEditLoading(true);
    const res = await dispatch(updatePurchaseOrderStatus({ id, status }));
    setEditLoading(false);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Status updated!");
      setEditOrder(null);
    } else {
      toast.error(res.payload || "Failed to update status");
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    if (confirmAction.type === "cancel") {
      const res = await dispatch(cancelPurchaseOrder(confirmAction.id));
      if (res.meta.requestStatus === "fulfilled") toast.success("Order cancelled");
      else toast.error(res.payload);
    }
    setConfirmAction(null);
  };

  const getPageNumbers = () => {
    const pages = [];
    const total = totalPages || 10;
    if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
    else pages.push(1, 2, 3, "...", total - 2, total - 1, total);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-[1200px] mx-auto">

        {/* Back + Title + Date filters */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2 transition">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Purchase Order</h1>
          </div>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {["1d", "7d", "1m", "3m", "6m", "1y", "3y", "5y"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeFilter(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition
                  ${activeTimeFilter === t ? "border-[#7C3AED] text-[#7C3AED] bg-white" : "border-gray-200 text-gray-500 bg-white hover:border-[#7C3AED] hover:text-[#7C3AED]"}`}
              >{t}</button>
            ))}
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 bg-white hover:border-[#7C3AED] hover:text-[#7C3AED] transition ml-1">
              <Calendar className="w-3 h-3" /> Select dates
            </button>
          </div>
        </div>

        {/* White card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search"
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7C3AED] w-52 placeholder-gray-400"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-300 transition">
                <Filter className="w-3.5 h-3.5" /> Filters
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-[#7C3AED] hover:text-[#7C3AED] transition"
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center"><Plus className="w-3 h-3" /></span>
                Create New Purchase Order
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white rounded-lg text-sm font-medium hover:bg-[#6D28D9] transition">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">Ordered Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">Purchase Order ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">Supplier ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">ETA</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">No purchase orders found</td></tr>
              ) : paginated.map((order) => {
                const status = order.status?.toLowerCase();
                return (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/40 transition">
                    {/* Ordered Date */}
                    <td className="px-5 py-3">
                      <div className="text-xs text-gray-700 leading-5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        <br />
                        <span className="text-gray-400">{new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </td>

                    {/* PO ID */}
                    <td className="px-5 py-3 text-xs text-gray-700 font-medium">
                      {order._id?.slice(-10).toUpperCase()}
                    </td>

                    {/* Supplier ID */}
                    <td className="px-5 py-3">
                      <span className="text-xs text-[#7C3AED] underline cursor-pointer font-medium">
                        {order.supplierId || "—"}
                      </span>
                    </td>

                    {/* ETA */}
                    <td className="px-5 py-3">
                      {order.eta ? (
                        <div className="text-xs text-gray-700 leading-5">
                          {new Date(order.eta).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          <br />
                          <span className="text-gray-400">{new Date(order.eta).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">NA</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Actions — View + Edit Status for every row, plus status-specific cancel */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {/* View — always visible */}
                        <button
                          onClick={() => setViewOrder(order)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Status — always visible */}
                        <button
                          onClick={() => setEditOrder(order)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-purple-50 text-gray-400 hover:text-[#7C3AED] transition"
                          title="Edit Status"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        {/* Cancel — only for pending */}
                        {status === "pending" && (
                          <button
                            onClick={() => setConfirmAction({ type: "cancel", id: order._id })}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-300 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="w-8 text-center text-gray-400 text-sm">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${currentPage === p ? "bg-[#7C3AED] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >{p}</button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-300 disabled:opacity-40 transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} loading={createLoading} />
      )}

      {viewOrder && (
        <ViewModal order={viewOrder} onClose={() => setViewOrder(null)} />
      )}

      {editOrder && (
        <EditStatusModal
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onSave={handleEditSave}
          loading={editLoading}
        />
      )}

      {confirmAction && (
        <ConfirmModal
          message="Do you really want to cancel this order!"
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
};

export default PurchaseOrderPage;