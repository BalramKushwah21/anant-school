"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutTemplate, 
  FileBadge, 
  Layers, 
  BookOpen, 
  ClipboardList,
  Building2,
  Award,
  Palette
} from "lucide-react";

// 📦 Importing All Standard & Premium Templates
import CBSETemplate from "./components/cbse";
import KVTemplate from "./components/kv";
import ModernTemplate from "./components/modern";
import StateBoardTemplate from "./components/stateBoard";
import ConventTemplate from "./components/convent";
import CertificateTemplate from "./components/simple";
import XaviersTemplate from "./components/oxeford";

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("cbse");
  
  // 🌟 Auto-Scale Logic states
  const [scale, setScale] = useState(1);
  const [wrapperHeight, setWrapperHeight] = useState("auto");
  const contentRef = useRef(null);

  const tabs = [
    { id: "cbse", label: "Standard CBSE" },
    { id: "xaviers", label: "Detailed CBSE" },
    { id: "modern", label: "Modern & Dynamic" },
    { id: "state", label: "State Board" },
    { id: "convent", label: "Primary Convent" },
    { id: "certificate", label: "Certificate Style" },
    { id: "kv", label: "KV Format" },
  ];

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "cbse": return <CBSETemplate />;
      case "xaviers": return <XaviersTemplate />;
      case "modern": return <ModernTemplate />;
      case "state": return <StateBoardTemplate />;
      case "convent": return <ConventTemplate />;
      case "certificate": return <CertificateTemplate />;
      case "kv": return <KVTemplate />;
      default: return <CBSETemplate />;
    }
  };

  // 🛠️ JAVASCRIPT MAGIC: Phone ki screen naap kar marksheet ko chota (scale) karega
  useEffect(() => {
    const fitToScreen = () => {
      // Browser me screen ki width check karo
      const screenWidth = window.innerWidth;
      const marksheetFixedSize = 900; // Marksheet ki asli choudai (Width)

      if (screenWidth < marksheetFixedSize) {
        // Agar phone hai, to screen ke hisaab se scale nikal lo
        const newScale = screenWidth / marksheetFixedSize;
        setScale(newScale);

        // Blank Space Fix: Scale karne ke baad niche ki khali jagah (Height) ko bhi adjust kar do
        if (contentRef.current) {
          const originalHeight = contentRef.current.offsetHeight;
          setWrapperHeight(`${originalHeight * newScale}px`);
        }
      } else {
        // Laptop/PC me normal dikhao
        setScale(1);
        setWrapperHeight("auto");
      }
    };

    fitToScreen();
    // Template load hone ke baad thoda time dekar height calculate karo
    const timeoutId = setTimeout(fitToScreen, 200);

    window.addEventListener("resize", fitToScreen);
    return () => {
      window.removeEventListener("resize", fitToScreen);
      clearTimeout(timeoutId);
    };
  }, [selectedTemplate]);

  return (
    // overflow-x-hidden: Scrollbar ko hamesha ke liye block karta hai
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col overflow-x-hidden">
      
      {/* 🌟 Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1600px] px-3 py-3">
          <h1 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-2">
            <LayoutTemplate className="text-indigo-600" size={20} />
            Template Gallery
          </h1>
          
          {/* Scrollable Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTemplate(tab.id)}
                className={`px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedTemplate === tab.id 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 MAIN RENDERING AREA WITH AUTO-FIT */}
      <div className="w-full flex justify-center mt-2 sm:mt-6">
        
        {/* Height Wrapper: Jisse niche khali space (blank gap) na bache */}
        <div 
          style={{ height: wrapperHeight, width: "100%", maxWidth: "100%" }} 
          className="flex justify-center"
        >
          {/* Main Marksheet Container - Scale yaha apply ho raha hai */}
          <div 
            ref={contentRef}
            style={{ 
              width: "2000px",          // Isko 900px pe fix rakha hai taki content na sikude (No squishing)
              transform: `scale(${scale})`, // JavaScript se nikala gaya zoom percentage
              transformOrigin: "top center" // Hamesha upar aur center se chota hoga
            }}
            className="bg-white shadow-xl border border-slate-300 rounded-md"
          >
            {renderTemplate()}
          </div>
        </div>

      </div>
      
    </div>
  );
}