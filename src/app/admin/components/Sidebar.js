'use client'

import React, { useState } from "react";
import { GraduationCap, Settings, X, ChevronDown, ChevronRight } from "lucide-react";
import { menuConfig } from "./menuData"; // Assuming your menuConfig array is saved here

import Link from "next/link";


// ==========================================
// 1. NAV ITEM COMPONENT (Combined internally)
// ==========================================
const NavItem = ({ menu, isOpen, onToggle, isActive, onClick }) => {
  const Icon = menu.icon;

  // 🎨 Color mapping updated for your new Admin Menu categories
  const iconColors = {
    "Dashboard": "text-orange-400",
    "Students": "text-blue-400",
    "Teachers": "text-emerald-400",
    "Students": "text-blue-400",
    "Academics": "text-purple-400",
    "Attendance": "text-pink-400",
    "Examination": "text-rose-400",
    "Fees & Finance": "text-green-400",
    "Parents": "text-indigo-400",
    "Library": "text-amber-400",
    "Transport": "text-cyan-400",
    "Communication": "text-sky-400",
    "Health": "text-red-400",
    "Events & Activities": "text-fuchsia-400",
    "Inventory": "text-teal-400",
    "Reports": "text-violet-400",
    "User Management": "text-yellow-500",
    "Settings": "text-slate-400"
  };

  const defaultColor = iconColors[menu.name] || "text-indigo-400";
  const iconClass = isActive ? "text-white" : defaultColor;

  // If no dropdown (e.g., Dashboard)
  if (!menu.isDropdown) {
    return (
      <Link 
        href={menu.link} 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3.5 mb-1 rounded-xl transition-all duration-200 ${
          isActive 
            ? "bg-[#2563eb] text-white font-medium shadow-md" 
            : "text-slate-200 hover:bg-white/5 hover:text-white font-medium"
        }`}
      >
        <Icon className={`w-[22px] h-[22px] transition-colors ${iconClass}`} />
        <span className="tracking-wide text-[15px]">{menu.name}</span>
      </Link>
    );
  }

  // If dropdown exists (e.g., Students, Teachers)
  return (
    <div className="flex flex-col w-full">
      <button 
        onClick={() => {
            if (onClick) onClick(); 
            onToggle(); 
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 mb-1 rounded-xl transition-all duration-200 ${
          isActive 
            ? "bg-[#2563eb] text-white font-medium shadow-md" 
            : "text-slate-200 hover:bg-white/5 hover:text-white font-medium"
        }`}
      >
        <div className="flex items-center gap-4">
          <Icon className={`w-[22px] h-[22px] transition-colors ${iconClass}`} />
          <span className="tracking-wide text-[15px]">{menu.name}</span>
        </div>
        
        {isOpen ? (
            <ChevronDown className={`w-4 h-4 transition-colors ${isActive ? "text-white/90" : "text-white/50"}`} />
        ) : (
            <ChevronRight className={`w-4 h-4 transition-colors ${isActive ? "text-white/90" : "text-white/50"}`} />
        )}
      </button>

      {/* Sub-menu Items */}
      {isOpen && (
        <div className="ml-[2.75rem] mt-1 mb-2 space-y-3 border-l border-white/10 pl-4 py-2">
          {menu.subItems.map((subItem, index) => (
            <Link
              key={index} 
              href={subItem.link} 
              className="block text-[14px] text-slate-400 hover:text-white transition-colors"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};


// ==========================================
// 2. MAIN SIDEBAR COMPONENT
// ==========================================
export default function Sidebar({ isOpen, onClose, schoolData }) {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const getData = async () => {
      const data = await prisma.schooldata.findUnique({
			where: {
				subdomain: subdomain,
			},
		});
   
    };
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleToggle = (menuName) => {
        setOpenDropdown(openDropdown === menuName ? null : menuName);
    };
   
    return (
        <>
            <aside
                className={` top-20 fixed lg:static inset-y-0 left-0 z-40 w-[280px] bg-[#0f1524] text-white h-screen flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl ${
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Header / Logo Area */}
              <div className="h-[88px] flex items-center justify-between px-6 border-b border-white/10 sticky top-0 z-10 shrink-0">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="text-[#3b82f6] w-8 h-8" />
                          <span className="text-[24px] font-extrabold tracking-wide text-white">
                            {schoolData?.name ? (
                              schoolData.name
                            ) : (
                              <>
                                User
                                <span className="text-[#3b82f6]">Account</span>
                              </>
                            )}
                          </span>
                        </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-2xl text-slate-400 hover:text-white focus:outline-none transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Navigation Container */}
                <nav className="px-4 py-6 overflow-y-auto flex-1 custom-scrollbar space-y-1.5">
                    {menuConfig.map((menu, index) => (
                        <NavItem
                            key={index}
                            menu={menu}
                            isActive={activeTab === menu.name} 
                            isOpen={openDropdown === menu.name}
                            onClick={() => setActiveTab(menu.name)}
                            onToggle={() => handleToggle(menu.name)}
                        />
                    ))}
                </nav>

                {/* Bottom Profile Avatar ("N" Bubble) */}
                <div className="p-6 shrink-0 border-t border-white/5">
                    <div className="w-11 h-11 rounded-full bg-[#0a0a0a] border border-white/10 shadow-inner flex items-center justify-center text-white text-lg font-medium cursor-pointer hover:bg-black transition-colors">
                        <Settings className="w-4 h-4"/>
                    </div>
                </div>
            </aside>

            {/* Mobile Screen Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                ></div>
            )}
        </>
    );
}