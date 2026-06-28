import React, { useEffect } from "react";
import { X, CheckCircle2, XCircle, AlertTriangle, AlertCircle } from "lucide-react";

export default function GlobalModal({ isOpen, onClose, status, message }) {
  // Close the modal when the "Escape" key is pressed [cite: 2983]
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ================= ALAG-ALAG STATUS FUNCTIONS =================

  // 🟢 1. SUCCESS Function
  const renderSuccess = () => (
    <div className="text-center">
      <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">Success!</h2>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <button 
        onClick={onClose} 
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        Continue
      </button>
    </div>
  );

  // 🔴 2. FAIL Function
  const renderFail = () => (
    <div className="text-center">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">Failed!</h2>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <button 
        onClick={onClose} 
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // 🟠 3. ALERT Function
  const renderAlert = () => (
    <div className="text-center">
      <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">Warning!</h2>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <button 
        onClick={onClose} 
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        Understood
      </button>
    </div>
  );

  // 🟣 4. ERROR Function
  const renderError = () => (
    <div className="text-center">
      <AlertCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">System Error!</h2>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <button 
        onClick={onClose} 
        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        Close
      </button>
    </div>
  );

  // ================= SWITCH LOGIC =================
  // Yeh function decide karega ki status ke hisaab se kaunsa function call karna hai
  const renderContent = () => {
    switch (status) {
      case "success": return renderSuccess();
      case "fail": return renderFail();
      case "alert": return renderAlert();
      case "error": return renderError();
      default: return renderAlert(); // Default case
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background Overlay (Click to close) */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Pop-up Container */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        
        {/* Top Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Content Rendered Here */}
        {renderContent()}

      </div>
    </div>
  );
}