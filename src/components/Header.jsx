"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  HiMenu,
  HiX,
  HiUser,
  HiUsers,
  HiCreditCard,
  HiHome,
} from "react-icons/hi";

const Header = ({ onLogin, onLogout }) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");

      let userData = null;

      try {
        userData = userString ? JSON.parse(userString) : null;
      } catch (err) {
        console.warn("Error parsing user from localStorage:", err);
        userData = null; // fallback
      }

      setUser(userData);
    }
  }, []);

  const navItems = [
    { label: "Home", href: "/dashboard/admin/", icon: <HiHome size={20} /> },
    {
      label: "User",
      href: "/dashboard/admin/user",
      icon: <HiUser size={20} />,
    },
    {
      label: "Distributor",
      href: "/dashboard/admin/distributor",
      icon: <HiUsers size={20} />,
    },
    {
      label: "Group",
      href: "/dashboard/admin/group",
      icon: <HiCreditCard size={20} />,
    },
    {
      label: "Payment",
      href: "/dashboard/admin/payment",
      icon: <HiCreditCard size={20} />,
    },
    {
      label: "Report",
      href: "/dashboard/admin/report",
      icon: <HiCreditCard size={20} />,
    },
  ];

  const getButtonClass = (href) => {
    const currentPath = pathname.replace(/\/$/, ""); // remove trailing slash
    const hrefPath = href.replace(/\/$/, "");

    // Exact match for home
    if (hrefPath === "/dashboard/admin") {
      return currentPath === hrefPath
        ? "flex items-center space-x-2 px-3 py-1 rounded-md shadow transition bg-gray-600 text-white"
        : "flex items-center space-x-2 px-3 py-1 rounded-md shadow transition bg-white text-gray-600 hover:bg-gray-600 hover:text-white";
    }

    return `flex items-center space-x-2 px-3 py-1 rounded-md shadow transition ${
      currentPath.startsWith(hrefPath)
        ? "bg-gray-600 text-white"
        : "bg-white text-gray-600 hover:bg-gray-600 hover:text-white"
    }`;
  };

  return (
    <header
      className={
        "bg-gradient-to-r from-blue-200 to-blue-300 shadow-md top-0 z-50 sticky"
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Image
                src="/DistributionPlan.png"
                width={40}
                height={40}
                alt="Distribution Plan Logo"
                className="rounded-full"
              />
            </Link>
          </div>

          {/* Center: Navigation (desktop only) */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getButtonClass(item.href)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right: Login / Logout (desktop only) */}
          <div className="hidden md:flex flex-1 justify-end min-w-[140px] items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 whitespace-nowrap">
                  Hello, {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition shadow whitespace-nowrap min-w-[80px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                aria-label="Login"
                className="text-gray-700 hover:text-blue-500 transition w-10 h-10 flex items-center justify-center"
              >
                <HiUser size={24} />
              </button>
            )}
          </div>

          {/* Mobile: User Icon + Menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {user ? (
              <button
                onClick={onLogout}
                aria-label="User Profile / Logout"
                className="text-gray-700 hover:text-blue-500 transition w-10 h-10 flex items-center justify-center"
              >
                <HiUser size={24} />
              </button>
            ) : (
              <button
                onClick={onLogin}
                aria-label="Login"
                className="text-gray-700 hover:text-blue-500 transition w-10 h-10 flex items-center justify-center"
              >
                <HiUser size={24} />
              </button>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md border-t border-gray-200">
          <ul className="flex flex-col px-4 py-3 space-y-2 text-gray-700 font-semibold">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <div
                    onClick={() => setMenuOpen(false)}
                    className={`cursor-pointer block px-3 py-2 rounded transition ${
                      pathname.startsWith(item.href)
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
