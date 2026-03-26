import { useState } from "react";
import { CirclePlus, Upload, X } from "lucide-react";

import AddCustomField from "./addCustomField";

export default function AddProducts({ isOpen, onClose }) {
  const [showAddCustomField, setShowAddCustomField] = useState(false);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[1200] p-5 sm:p-2.5" onClick={onClose}>
      <div className="w-full max-w-[920px] max-h-[90vh] overflow-auto bg-white rounded-xl border border-gray-200 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 px-6 py-2.5 border-b border-gray-200 flex-wrap sm:px-3">
          <h2 className="m-0 text-[2.05rem] leading-tight text-gray-900 font-bold sm:text-[1.8rem] xs:text-[1.5rem]">Add new product</h2>

          <div className="inline-flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              className="border border-gray-500 bg-white text-gray-700 rounded-full px-3.5 py-2 flex items-center gap-2 text-[0.85rem] font-semibold cursor-pointer"
              onClick={() => setShowAddCustomField(true)}
            >
              <CirclePlus size={16} />
              <span>Add Custom Field</span>
            </button>

            <button type="button" className="border border-gray-500 bg-white text-gray-700 rounded-full px-3.5 py-2 flex items-center gap-2 text-[0.85rem] font-semibold cursor-pointer">
              <Upload size={16} />
              <span>Bulk Upload</span>
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
              <input type="text" placeholder="Ex: BoomHigh" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Supplier ID</label>
              <input type="text" placeholder="Ex: TUW10234" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Weight (in lbs)</label>
              <input type="text" placeholder="Enter Weight here" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Category</label>
              <input type="text" placeholder="Vapes" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Dimension Unit</label>
              <select defaultValue="inch" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans focus:border-violet-500">
                <option value="inch">inch</option>
                <option value="cm">cm</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Dimensions (L x B x H)</label>
              <input type="text" placeholder="20 × 30 × 40" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Recorded Stock Level</label>
              <input type="text" placeholder="Ex: 2000" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Warning Threshold Stock Level</label>
              <input type="text" placeholder="Ex: 100" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Auto Order Stock Level</label>
              <input type="text" placeholder="Ex: 50" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">SKU Code</label>
              <input type="text" placeholder="RTY1234455" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Barcode Number</label>
              <input type="text" placeholder="QWERTY0987" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">GRN Number (Optional)</label>
              <input type="text" placeholder="QWERTY56787" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="row-span-2 md:col-span-2 md:row-auto sm:col-span-1 flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Insert Image (400px x 400 px)</label>
              <div className="h-[94px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center" role="button" tabIndex={0}>
                <span className="w-[58px] h-[58px] border border-gray-300 rounded-full text-gray-300 text-2xl flex items-center justify-center">+</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Purchasing Price</label>
              <input type="text" placeholder="Ex: $100" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Selling Price Margin</label>
              <input type="text" placeholder="Ex: 20%" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>

            <div className="col-span-2 md:col-span-2 sm:col-span-1 flex flex-col gap-1.5">
              <label className="text-gray-600 text-[0.84rem] font-semibold">Product Description</label>
              <textarea rows="2" placeholder="Ex: Type something about product here" className="border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.95rem] px-3 py-2.5 outline-none font-sans placeholder:text-gray-400 focus:border-violet-500" />
            </div>
          </div>

          <button type="button" className="mt-4 w-full border border-violet-700 bg-violet-700 text-white rounded-lg px-3 py-2.5 text-base font-semibold cursor-pointer transition hover:bg-violet-800 disabled:opacity-60 disabled:cursor-not-allowed">
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
