"use client";

import { useState, useRef, useEffect } from "react";

interface ResourceLink {
  name: string;
  url: string;
  description: string;
}

interface ResourceCategory {
  category: string;
  links: ResourceLink[];
}

const resources: ResourceCategory[] = [
  {
    category: "SQLBI",
    links: [
      {
        name: "SQLBI Articles",
        url: "https://www.sqlbi.com/articles/",
        description: "In-depth DAX & data modeling articles",
      },
      {
        name: "DAX Guide",
        url: "https://dax.guide/",
        description: "Complete DAX function reference",
      },
      {
        name: "DAX Patterns",
        url: "https://www.daxpatterns.com/",
        description: "Ready-to-use DAX pattern library",
      },
      {
        name: "DAX Formatter",
        url: "https://www.daxformatter.com/",
        description: "Format & beautify your DAX code",
      },
    ],
  },
  {
    category: "Guy in a Cube",
    links: [
      {
        name: "YouTube Channel",
        url: "https://www.youtube.com/@GuyInACube",
        description: "Power BI tips, tricks & tutorials",
      },
      {
        name: "Website",
        url: "https://guyinacube.com/",
        description: "Blog posts and resources",
      },
    ],
  },
  {
    category: "Microsoft Learn",
    links: [
      {
        name: "Power BI Documentation",
        url: "https://learn.microsoft.com/en-us/power-bi/",
        description: "Official Power BI docs",
      },
      {
        name: "DAX Reference",
        url: "https://learn.microsoft.com/en-us/dax/",
        description: "Official DAX function reference",
      },
      {
        name: "Power BI Training Paths",
        url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi",
        description: "Free guided learning modules",
      },
    ],
  },
  {
    category: "Roadmaps & Updates",
    links: [
      {
        name: "Power BI Release Plan",
        url: "https://learn.microsoft.com/en-us/power-platform/release-plan/",
        description: "Upcoming features & release timeline",
      },
      {
        name: "Power BI Blog",
        url: "https://powerbi.microsoft.com/en-us/blog/",
        description: "Official announcements & monthly updates",
      },
      {
        name: "Fabric Roadmap",
        url: "https://learn.microsoft.com/en-us/fabric/release-plan/",
        description: "Microsoft Fabric release plan",
      },
    ],
  },
];

export default function ResourceMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Power BI Resources"
        aria-expanded={open}
        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
      >
        {/* Hamburger icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <rect x="2" y="4" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1d24] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-[#e87722]">
              Power BI Resources
            </h3>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {resources.map((group) => (
              <div key={group.category} className="border-b border-gray-700/50 last:border-b-0">
                <div className="px-4 py-2 bg-[#12141a]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#487a7b]">
                    {group.category}
                  </span>
                </div>
                {group.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-white/5 transition group"
                    onClick={() => setOpen(false)}
                  >
                    <div className="text-sm text-gray-200 group-hover:text-white">
                      {link.name}
                      <span className="inline-block ml-1 text-gray-500 text-xs">&#8599;</span>
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-400">
                      {link.description}
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
