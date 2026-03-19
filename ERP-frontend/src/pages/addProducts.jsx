import { useState } from "react";
import { CirclePlus, Upload, X } from "lucide-react";
import "./addProducts.css";
import AddCustomField from "./addCustomField";

export default function AddProducts({ isOpen, onClose }) {
  const [showAddCustomField, setShowAddCustomField] = useState(false);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="add-product-overlay" onClick={onClose}>
      <div className="add-product-card" onClick={(event) => event.stopPropagation()}>
        <div className="add-product-header">
          <h2 className="add-product-title">Add new product</h2>

          <div className="add-product-header-actions">
            <button
              type="button"
              className="add-product-top-btn"
              onClick={() => setShowAddCustomField(true)}
            >
              <CirclePlus size={16} />
              <span>Add Custom Field</span>
            </button>

            <button type="button" className="add-product-top-btn">
              <Upload size={16} />
              <span>Bulk Upload</span>
            </button>

            <button type="button" className="add-product-close-btn" aria-label="Close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="add-product-body">
          <div className="add-product-grid">
            <div className="add-product-field">
              <label>Product Name</label>
              <input type="text" placeholder="Ex: BoomHigh" />
            </div>

            <div className="add-product-field">
              <label>Supplier ID</label>
              <input type="text" placeholder="Ex: TUW10234" />
            </div>

            <div className="add-product-field">
              <label>Weight (in lbs)</label>
              <input type="text" placeholder="Enter Weight here" />
            </div>

            <div className="add-product-field">
              <label>Category</label>
              <input type="text" placeholder="Vapes" />
            </div>

            <div className="add-product-field">
              <label>Dimension Unit</label>
              <select defaultValue="inch">
                <option value="inch">inch</option>
                <option value="cm">cm</option>
              </select>
            </div>

            <div className="add-product-field">
              <label>Dimensions (L x B x H)</label>
              <input type="text" placeholder="20 × 30 × 40" />
            </div>

            <div className="add-product-field">
              <label>Recorded Stock Level</label>
              <input type="text" placeholder="Ex: 2000" />
            </div>

            <div className="add-product-field">
              <label>Warning Threshold Stock Level</label>
              <input type="text" placeholder="Ex: 100" />
            </div>

            <div className="add-product-field">
              <label>Auto Order Stock Level</label>
              <input type="text" placeholder="Ex: 50" />
            </div>

            <div className="add-product-field">
              <label>SKU Code</label>
              <input type="text" placeholder="RTY1234455" />
            </div>

            <div className="add-product-field">
              <label>Barcode Number</label>
              <input type="text" placeholder="QWERTY0987" />
            </div>

            <div className="add-product-field">
              <label>GRN Number (Optional)</label>
              <input type="text" placeholder="QWERTY56787" />
            </div>

            <div className="add-product-field add-product-image-field">
              <label>Insert Image (400px x 400 px)</label>
              <div className="add-product-upload-box" role="button" tabIndex={0}>
                <span className="add-product-upload-plus">+</span>
              </div>
            </div>

            <div className="add-product-field">
              <label>Purchasing Price</label>
              <input type="text" placeholder="Ex: $100" />
            </div>

            <div className="add-product-field">
              <label>Selling Price Margin</label>
              <input type="text" placeholder="Ex: 20%" />
            </div>

            <div className="add-product-field add-product-description-field">
              <label>Product Description</label>
              <textarea rows="2" placeholder="Ex: Type something about product here" />
            </div>
          </div>

          <button type="button" className="add-product-submit-btn">
            Add Product
          </button>
        </div>

        <AddCustomField
          isOpen={showAddCustomField}
          onClose={() => setShowAddCustomField(false)}
        />
      </div>
    </div>
  );
}
