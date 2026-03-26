import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CirclePlus, Pencil, X } from "lucide-react";


const API_BASE_URL = "http://localhost:5000/api";

export default function EditProduct({ isOpen, onClose, product, onSave }) {
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    weight: "",
    category: "",
    dimensionUnit: "",
    dimensions: "",
    recordedStock: "",
    warningThreshold: "",
    autoOrderStock: "",
    skuCode: "",
    barcodeNumber: "",
    grnNumber: "",
    purchasingPrice: "",
    sellingPriceMargin: "",
    description: ""
  });

  useEffect(() => {
    if (isOpen && product) {
      setImagePreview(product?.mainImage || "");
      setFormData({
        productName: product?.productName || "",
        weight: product?.weight || "",
        category: product?.categoryId?.categoryName || "",
        dimensionUnit: product?.dimensionUnit || "",
        dimensions: product?.dimensions || "",
        recordedStock: product?.item_count || "",
        warningThreshold: product?.warningThreshold || "",
        autoOrderStock: product?.autoOrderStock || "",
        skuCode: product?.skuCode || "",
        barcodeNumber: product?.barcodeNumber || "",
        grnNumber: product?.grnNumber || "",
        purchasingPrice: product?.purchasingPrice || "",
        sellingPriceMargin: product?.sellingPriceMargin || "",
        description: product?.description || ""
      });
      setSelectedFile(null);
    }
  }, [isOpen, product]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChooseImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFile(file);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setImagePreview(previewUrl);
  };

  const handleSave = async () => {
    if (!product?._id) {
      showNotification("Product ID not found", "error");
      return;
    }

    if (!formData.productName.trim()) {
      showNotification("Product name is required", "error");
      return;
    }

    try {
      setSaving(true);

      const submitData = new FormData();
      submitData.append("productName", formData.productName);
      submitData.append("weight", formData.weight);
      submitData.append("item_count", formData.recordedStock);
      submitData.append("warningThreshold", formData.warningThreshold);
      submitData.append("autoOrderStock", formData.autoOrderStock);
      submitData.append("skuCode", formData.skuCode);
      submitData.append("barcodeNumber", formData.barcodeNumber);
      submitData.append("grnNumber", formData.grnNumber);
      submitData.append("purchasingPrice", formData.purchasingPrice);
      submitData.append("sellingPriceMargin", formData.sellingPriceMargin);
      submitData.append("description", formData.description);
      submitData.append("dimensionUnit", formData.dimensionUnit);
      submitData.append("dimensions", formData.dimensions);

      if (selectedFile) {
        submitData.append("mainImage", selectedFile);
      }

      const response = await axios.put(
        `${API_BASE_URL}/products/${product._id}`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      showNotification("Product updated successfully!", "success");

      if (onSave) {
        onSave();
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update product";
      showNotification(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[1250] p-5 sm:p-2.5" onClick={onClose}>
      <div className="w-full max-w-[900px] max-h-[90vh] overflow-auto bg-white rounded-xl border border-gray-200 shadow-2xl relative" onClick={(event) => event.stopPropagation()}>
        {notification && (
          <div className={`absolute top-3 right-3 px-4 py-2.5 rounded-md text-[0.9rem] font-medium z-10 animate-[slideIn_0.3s_ease-out] ${notification.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'}`}> 
            {notification.message}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 px-6 py-2.5 border-b border-gray-200 flex-wrap sm:px-3">
          <h2 className="m-0 text-gray-900 text-[2.05rem] leading-tight font-bold sm:text-[1.8rem] xs:text-[1.5rem]">Edit product</h2>

          <div className="inline-flex items-center gap-2.5">
            <button type="button" className="border border-gray-500 bg-white text-gray-700 rounded-full px-3.5 py-2 flex items-center gap-2 text-[0.85rem] font-semibold cursor-pointer">
              <CirclePlus size={16} />
              <span>Add Variants</span>
            </button>

            <button type="button" className="w-7 h-7 rounded-full border border-gray-400 bg-white text-gray-900 flex items-center justify-center cursor-pointer" aria-label="Close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 pb-4 sm:px-3 sm:py-3">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3 md:grid-cols-2 sm:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Product Name</label>
              <input 
                type="text" 
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Ex: BoomHigh" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Supplier ID</label>
              <input type="text" placeholder="Ex: TUW10234" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Weight (in lbs)</label>
              <input 
                type="text" 
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter Weight here" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Category</label>
              <input 
                type="text" 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Vapes" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Dimension Unit</label>
              <input 
                type="text" 
                name="dimensionUnit"
                value={formData.dimensionUnit}
                onChange={handleInputChange}
                placeholder="inch" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Dimensions (L x B x H)</label>
              <input 
                type="text" 
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="20 × 30 × 40" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Recorded Stock Level</label>
              <input 
                type="text" 
                name="recordedStock"
                value={formData.recordedStock}
                onChange={handleInputChange}
                placeholder="Ex: 200" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Warning Threshold Stock Level</label>
              <input 
                type="text" 
                name="warningThreshold"
                value={formData.warningThreshold}
                onChange={handleInputChange}
                placeholder="Ex: 100" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Auto Order Stock Level</label>
              <input 
                type="text" 
                name="autoOrderStock"
                value={formData.autoOrderStock}
                onChange={handleInputChange}
                placeholder="Ex: 50" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">SKU Code</label>
              <input 
                type="text" 
                name="skuCode"
                value={formData.skuCode}
                onChange={handleInputChange}
                placeholder="RTY1234455" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Barcode Number</label>
              <input 
                type="text" 
                name="barcodeNumber"
                value={formData.barcodeNumber}
                onChange={handleInputChange}
                placeholder="QWERTY0987" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">GRN Number (Optional)</label>
              <input 
                type="text" 
                name="grnNumber"
                value={formData.grnNumber}
                onChange={handleInputChange}
                placeholder="QWERTY56787" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="row-span-2 md:col-span-2 sm:col-span-1 flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Insert Image (400px x 400 px)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div
                className="h-[154px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 cursor-pointer overflow-hidden"
                role="button"
                tabIndex={0}
                onClick={handleChooseImage}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleChooseImage();
                  }
                }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Product preview" className="w-full h-full object-cover" />
                ) : (
                  <Pencil size={42} strokeWidth={1.2} />
                )}
              </div>
              <button type="button" className="border-none bg-transparent text-violet-600 text-[0.84rem] font-semibold text-left p-0 cursor-pointer hover:underline" onClick={handleChooseImage}>
                Insert image
              </button>
              <button type="button" className="border-none bg-transparent text-violet-600 text-[0.84rem] font-semibold text-left p-0 cursor-pointer hover:underline" onClick={handleChooseImage}>
                Edit image
              </button>
              <div className="text-xs text-gray-400">
                {imagePreview ? "Image loaded" : "No image selected"}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Purchasing Price</label>
              <input 
                type="text" 
                name="purchasingPrice"
                value={formData.purchasingPrice}
                onChange={handleInputChange}
                placeholder="Ex: $100" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Selling Price Margin</label>
              <input 
                type="text" 
                name="sellingPriceMargin"
                value={formData.sellingPriceMargin}
                onChange={handleInputChange}
                placeholder="Ex: 20%" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>

            <div className="col-span-2 md:col-span-2 sm:col-span-1 flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Product Description</label>
              <textarea 
                rows="2" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ex: Type something about product here" 
                className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500"
              />
            </div>
          </div>

          <button 
            type="button" 
            className="mt-4 w-full border border-violet-700 bg-violet-700 text-white rounded-lg px-3 py-2.5 text-base font-semibold cursor-pointer transition hover:bg-violet-800 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
