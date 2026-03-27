import { useState, useEffect } from "react";

export default function EditSupplier({ isOpen, onClose, supplier, onSave }) {
  const [form, setForm] = useState({
    fullName: "",
    contactName: "",
    phoneNumber: "",
    email: "",
    state: "",
    pincode: "",
    address: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (supplier) {
      setForm({
        fullName: supplier.fullName || "",
        contactName: supplier.contactName || "",
        phoneNumber: supplier.phoneNumber || "",
        email: supplier.email || "",
        state: supplier.state || "",
        pincode: supplier.pincode || "",
        address: supplier.address || ""
      });
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/suppliers/${supplier._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update supplier");
      if (onSave) onSave();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update supplier");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-2000 flex items-center justify-center" onClick={onClose}>
      <form
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-8 relative animate-[slideIn_0.2s]"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <button type="button" className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl font-bold" onClick={onClose} aria-label="Close">×</button>
        <h2 className="text-2xl font-bold text-center mb-6">Edit Supplier</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter Full Name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Name</label>
            <input name="contactName" value={form.contactName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter Contact Name" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Phone number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="+1 955 000 0000" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Email-Id</label>
            <input name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter your Email-ID" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input name="state" value={form.state} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Select your state" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter Pincode" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input name="address" value={form.address} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter your Address" />
          </div>
        </div>
        {error && <div className="text-red-600 text-sm mb-2 text-center">{error}</div>}
        <button type="submit" className="w-full bg-violet-600 text-white rounded-lg py-2.5 font-semibold text-base mt-2 hover:bg-violet-700 transition" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
