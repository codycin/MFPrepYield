import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ScanLine, Sparkles, Rocket, BookOpen, X } from "lucide-react";

import QuickAdd from "./QuickAdd";
import Scan from "./Scan";
import SearchComponent from "./Search";
import Ai from "./Ai";
import Prep from "./Prep";

const tabs = [
  { name: "Scan", icon: ScanLine, component: Scan },
  { name: "Search", icon: Search, component: SearchComponent },
  { name: "AI", icon: Sparkles, component: Ai },
  { name: "Quick Add", icon: Rocket, component: QuickAdd },
  { name: "Prep", icon: BookOpen, component: Prep },
];

const press = {
  whileTap: { scale: 0.94 },
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 20,
  },
};

export default function MacroUI() {
  const [activeTab, setActiveTab] = useState("Prep");
  const ActiveComponent = tabs.find((t) => t.name === activeTab)?.component;
  return (
    <div className="h-screen flex justify-center text-white mt-5">
      <div className="w-full max-w-sm h-full flex flex-col">
        {/* TOP SECTION (header background) */}
        <div className="bg-[#0a0a0a] px-4 pt-[env(safe-area-inset-top)] pb-3">
          {/* Top Row */}
          <div className="grid grid-cols-[auto_1fr_1fr_2fr] gap-2 w-full items-center">
            {/* X button - shrink to content */}
            <motion.button
              {...press}
              className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center"
            >
              <X size={18} />
            </motion.button>

            {/* Time */}
            <motion.div
              {...press}
              className="h-10 w-full rounded-xl bg-zinc-900 flex items-center justify-center text-sm"
            >
              10 AM
            </motion.div>

            {/* Progress */}
            <motion.div
              {...press}
              className="h-10 w-full rounded-xl bg-zinc-900 flex items-center justify-center text-sm"
            >
              0 / 2202
            </motion.div>

            {/* Empty wide container */}
            <motion.div
              {...press}
              className="h-10 w-full rounded-xl bg-zinc-900"
            />
          </div>
          {/* Tabs */}
          <div className="flex justify-between items-end border-b border-zinc-800 mt-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <motion.button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center flex-1 pb-2"
                >
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className={isActive ? "text-white" : "text-zinc-500"}
                  />
                  <span
                    className={`text-[11px] mt-1 ${isActive ? "text-white" : "text-zinc-500"}`}
                  >
                    {tab.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="h-[2px] w-6 bg-white mt-2 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#111111] overflow-y-auto no-scrollbar px-4 py-4">
          <div className="mt-4">{ActiveComponent && <ActiveComponent />}</div>
        </div>

        {/* Hide Scrollbar */}
        <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      </div>
    </div>
  );
}
