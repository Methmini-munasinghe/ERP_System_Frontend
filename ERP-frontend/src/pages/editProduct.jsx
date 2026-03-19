import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CirclePlus, Pencil, X } from "lucide-react";
import "./editProduct.css";

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
    <div className="edit-product-overlay" onClick={onClose}>
      <div className="edit-product-card" onClick={(event) => event.stopPropagation()}>
        {notification && (
          <div className={`edit-product-notification edit-product-notification-${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="edit-product-header">
          <h2 className="edit-product-title">Edit product</h2>

          <div className="edit-product-header-actions">
            <button type="button" className="edit-product-variants-btn">
              <CirclePlus size={16} />
              <span>Add Variants</span>
            </button>

            <button type="button" className="edit-product-close-btn" aria-label="Close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="edit-product-body">
          <div className="edit-product-grid">
            <div className="edit-product-field">
              <label>Product Name</label>
              <input 
                type="text" 
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Ex: BoomHigh" 
              />
            </div>

            <div className="edit-product-field">
              <label>Supplier ID</label>
              <input type="text" placeholder="Ex: TUW10234" />
            </div>

            <div className="edit-product-field">
              <label>Weight (in lbs)</label>
              <input 
                type="text" 
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter Weight here" 
              />
            </div>

            <div className="edit-product-field">
              <label>Category</label>
              <input 
                type="text" 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Vapes" 
              />
            </div>

            <div className="edit-product-field">
              <label>Dimension Unit</label>
              <input 
                type="text" 
                name="dimensionUnit"
                value={formData.dimensionUnit}
                onChange={handleInputChange}
                placeholder="inch" 
              />
            </div>

            <div className="edit-product-field">
              <label>Dimensions (L x B x H)</label>
              <input 
                type="text" 
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="20 × 30 × 40" 
              />
            </div>

            <div className="edit-product-field">
              <label>Recorded Stock Level</label>
              <input 
                type="text" 
                name="recordedStock"
                value={formData.recordedStock}
                onChange={handleInputChange}
                placeholder="Ex: 200" 
              />
            </div>

            <div className="edit-product-field">
              <label>Warning Threshold Stock Level</label>
              <input 
                type="text" 
                name="warningThreshold"
                value={formData.warningThreshold}
                onChange={handleInputChange}
                placeholder="Ex: 100" 
              />
            </div>

            <div className="edit-product-field">
              <label>Auto Order Stock Level</label>
              <input 
                type="text" 
                name="autoOrderStock"
                value={formData.autoOrderStock}
                onChange={handleInputChange}
                placeholder="Ex: 50" 
              />
            </div>

            <div className="edit-product-field">
              <label>SKU Code</label>
              <input 
                type="text" 
                name="skuCode"
                value={formData.skuCode}
                onChange={handleInputChange}
                placeholder="RTY1234455" 
              />
            </div>

            <div className="edit-product-field">
              <label>Barcode Number</label>
              <input 
                type="text" 
                name="barcodeNumber"
                value={formData.barcodeNumber}
                onChange={handleInputChange}
                placeholder="QWERTY0987" 
              />
            </div>

            <div className="edit-product-field">
              <label>GRN Number (Optional)</label>
              <input 
                type="text" 
                name="grnNumber"
                value={formData.grnNumber}
                onChange={handleInputChange}
                placeholder="QWERTY56787" 
              />
            </div>

            <div className="edit-product-field edit-product-image-field">
              <label>Insert Image (400px x 400 px)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="edit-product-file-input"
                onChange={handleImageChange}
              />
              <div
                className="edit-product-upload-box"
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
                  <img src={imagePreview} alt="Product preview" className="edit-product-image-preview" />
                ) : (
                  <Pencil size={42} strokeWidth={1.2} />
                )}
              </div>
              <button type="button" className="edit-product-insert-image-btn" onClick={handleChooseImage}>
                Insert image
              </button>
              <button type="button" className="edit-product-edit-image-btn" onClick={handleChooseImage}>
                Edit image
              </button>
              <div className="edit-product-image-note">
                {imagePreview ? "Image loaded" : "No image selected"}
              </div>
            </div>

            <div className="edit-product-field">
              <label>Purchasing Price</label>
              <input 
                type="text" 
                name="purchasingPrice"
                value={formData.purchasingPrice}
                onChange={handleInputChange}
                placeholder="Ex: $100" 
              />
            </div>

            <div className="edit-product-field">
              <label>Selling Price Margin</label>
              <input 
                type="text" 
                name="sellingPriceMargin"
                value={formData.sellingPriceMargin}
                onChange={handleInputChange}
                placeholder="Ex: 20%" 
              />
            </div>

            <div className="edit-product-field edit-product-description-field">
              <label>Product Description</label>
              <textarea 
                rows="2" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ex: Type something about product here" 
              />
            </div>
          </div>

          <button 
            type="button" 
            className="edit-product-submit-btn"
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
