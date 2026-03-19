import { CirclePlus, X } from "lucide-react";
import "./addCustomField.css";

export default function AddCustomField({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="custom-field-overlay" onClick={onClose}>
      <div className="custom-field-card" onClick={(event) => event.stopPropagation()}>
        <div className="custom-field-header">
          <h2 className="custom-field-title">
            <span className="custom-field-title-muted">Add new product</span>
            <span className="custom-field-title-divider">›</span>
            <span>Add Custom Field</span>
          </h2>

          <div className="custom-field-header-actions">
            <button type="button" className="custom-field-add-more-btn">
              <CirclePlus size={16} />
              <span>Add More</span>
            </button>

            <button type="button" className="custom-field-close-btn" aria-label="Close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="custom-field-body">
          <div className="custom-field-grid">
            <div className="custom-field-block custom-field-radio-block">
              <label className="custom-field-label">Select from Existing System Fields</label>
              <div className="custom-field-radio-row">
                <label>
                  <input type="radio" name="existingField" defaultChecked /> Yes
                </label>
                <label>
                  <input type="radio" name="existingField" /> No
                </label>
              </div>
            </div>

            <div className="custom-field-block custom-field-full-row">
              <label className="custom-field-label">Choose Field Type</label>
              <input type="text" placeholder="Ex: Warehouse ID" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">Dimension Unit</label>
              <input type="text" placeholder="inch" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">Dimensions (L x B x H)</label>
              <input type="text" placeholder="20 × 30 × 40" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">Recorded Stock Level</label>
              <input type="text" placeholder="Ex: 2000" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">Warning Threshold Stock Level</label>
              <input type="text" placeholder="Ex: 100" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">Auto Order Stock Level</label>
              <input type="text" placeholder="Ex: 50" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">SKU Code</label>
              <input type="text" placeholder="RTY1234455" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">Barcode Number</label>
              <input type="text" placeholder="QWERTY0987" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">GRN Number (Optional)</label>
              <input type="text" placeholder="QWERTY56787" />
            </div>

            <div className="custom-field-block custom-field-image-block">
              <label className="custom-field-label">Insert Image (400px x 400 px)</label>
              <div className="custom-field-upload-box" role="button" tabIndex={0}>
                <span className="custom-field-upload-plus">+</span>
              </div>
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">Purchasing Price</label>
              <input type="text" placeholder="Ex: $100" />
            </div>

            <div className="custom-field-block">
              <label className="custom-field-label">Selling Price Margin</label>
              <input type="text" placeholder="Ex: 20%" />
            </div>

            <div className="custom-field-block custom-field-description-block">
              <label className="custom-field-label">Product Description</label>
              <textarea rows="2" placeholder="Ex: Type something about product here" />
            </div>
          </div>

          <button type="button" className="custom-field-submit-btn">
            Add Field
          </button>
        </div>
      </div>
    </div>
  );
}
