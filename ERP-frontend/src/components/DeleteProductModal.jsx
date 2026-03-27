import { AlertTriangle } from "lucide-react";

export default function DeleteProductModal({ isOpen, onClose, onConfirm, isDeleting, product }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-2000 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-[slideIn_0.2s] border-2 border-violet-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <div className="flex flex-col items-center">
          <div className="mb-4 text-violet-600">
            <AlertTriangle size={48} strokeWidth={2} />
          </div>
          <p className="text-center text-lg font-semibold mb-6 text-gray-800">
            Do you really want to delete the product{product ? ` \"${product.productName || product.name || ''}\"` : ''}!<br />Are you sure?
          </p>
          <div className="flex gap-4 justify-center w-full">
            <button
              type="button"
              className="bg-violet-600 text-white rounded-lg px-8 py-2 font-semibold text-base hover:bg-violet-700 transition w-32"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes"}
            </button>
            <button
              type="button"
              className="border border-gray-300 text-gray-700 rounded-lg px-8 py-2 font-semibold text-base bg-white hover:bg-gray-100 transition w-32"
              onClick={onClose}
              disabled={isDeleting}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
