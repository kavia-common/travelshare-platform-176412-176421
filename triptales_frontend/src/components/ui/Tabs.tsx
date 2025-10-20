"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  onChange?: (id: string) => void;
}

// PUBLIC_INTERFACE
export const Tabs: React.FC<TabsProps> = ({ items, defaultActiveId, onChange }) => {
  const [active, setActive] = useState<string>(defaultActiveId || items[0]?.id);

  const onTabClick = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div>
      {/* Tab List */}
      <div 
        role="tablist" 
        aria-label="Tabs" 
        className={cn(
          "flex gap-1 p-1 bg-gray-100/70 rounded-lg",
          "border border-gray-200/50 backdrop-blur-sm"
        )}
      >
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              onClick={() => onTabClick(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium",
                "transition-all duration-200",
                getFocusRing(),
                isActive
                  ? cn(
                      "bg-white text-[color:var(--color-primary)]",
                      "shadow-sm ring-1 ring-gray-200/50"
                    )
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {items.map((item) =>
          item.id === active ? (
            <div
              key={item.id}
              role="tabpanel"
              id={`panel-${item.id}`}
              aria-labelledby={`tab-${item.id}`}
              className="animate-in fade-in duration-200"
            >
              {item.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
