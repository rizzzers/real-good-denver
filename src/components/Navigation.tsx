"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Best of Denver", path: "/best-of-denver" },
  { name: "Podcast", path: "/podcast" },
  { name: "Newsletter", path: "/newsletter" },
  { name: "Jobs", path: "/jobs" },
  { name: "Work With Us", path: "/work-with-us" },
];

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Logo */}
      <div className="fixed top-0 left-0 z-50 p-6">
        <Link href="/">
          <img
            src="/lovable-uploads/21d77bb5-a33c-497f-8581-ddea2b1b4cdf.png"
            alt="Real Good Denver"
            className="h-12 w-auto"
          />
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="fixed top-0 right-0 z-50 p-6 md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-background/95 backdrop-blur-sm rounded-full shadow-lg border border-border p-3 hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Menu */}
      <nav className="fixed top-0 right-0 z-50 p-6 hidden md:block">
        <div className="bg-background/95 backdrop-blur-sm rounded-full shadow-lg border border-border">
          <ul className="flex items-center space-x-1 px-6 py-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
