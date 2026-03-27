import { useState } from "react";
import { X } from "lucide-react";
import { getSuppliers } from "../api/supplierApi";

export default function AddSupplierModal({ isOpen, onClose, onSupplierAdded, addSupplier }) {
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    state: "",
    pincode: "",
    address: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await addSupplier(form);
      setForm({ name: "", contactName: "", phone: "", email: "", state: "", pincode: "", address: "" });
      onSupplierAdded && onSupplierAdded();
      onClose();
    } catch (err) {
      setError("Failed to add supplier");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-8 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Add New Supplier</h2>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter Full Name" />
          </div>
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Contact Name</label>
            <input name="contactName" value={form.contactName} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter Contact Name" />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Phone number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" placeholder="+1 955 000 0000" />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email-Id</label>
            <input name="email" value={form.email} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter your Email-ID" />
          </div>
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">State</label>
            <input name="state" value={form.state} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Select your state" />
          </div>
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Pincode</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter Pincode" />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input name="address" value={form.address} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter your Address" />
          </div>
          {error && <div className="col-span-2 text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="col-span-2 mt-2 bg-violet-600 text-white rounded-lg py-2 font-semibold text-lg hover:bg-violet-700 transition" disabled={saving}>
            {saving ? "Adding..." : "Add Supplier"}
          </button>
        </form>
      </div>
    </div>
  );
}
