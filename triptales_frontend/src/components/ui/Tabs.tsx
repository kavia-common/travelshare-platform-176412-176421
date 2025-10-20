"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
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
      <div role="tablist" aria-label="Tabs" className="flex gap-2 border-b border-gray-200">
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
                "px-3 py-2 text-sm rounded-t-md",
                isActive
                  ? "text-[color:var(--color-primary)] border-b-2 border-[color:var(--color-primary)]"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3">
        {items.map((item) =>
          item.id === active ? (
            <div
              key={item.id}
              role="tabpanel"
              id={`panel-${item.id}`}
              aria-labelledby={`tab-${item.id}`}
            >
              {item.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
