"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  HiHome,
  HiUser,
  HiUsers,
  HiClipboardList,
  HiCreditCard,
  HiDocumentReport,
  HiCheckCircle,
  HiMenu,
  HiX,
} from "react-icons/hi";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
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

  // Logout function
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      setUser(null);
      router.push("/");
    }
  };

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
      icon: <HiClipboardList size={20} />,
    },
    {
      label: "Payment",
      href: "/dashboard/admin/payment",
      icon: <HiCreditCard size={20} />,
    },
    {
      label: "Report",
      href: "/dashboard/admin/report",
      icon: <HiDocumentReport size={20} />,
    },
    {
      label: "Approvals",
      href: "/dashboard/admin/approvals",
      icon: <HiCheckCircle size={20} />,
    },
  ];

  const getButtonClass = (href) => {
    const currentPath = pathname.replace(/\/$/, ""); // remove trailing slash
    const hrefPath = href.replace(/\/$/, "");

    // Exact match for home
    if (hrefPath === "/dashboard/admin") {
      return currentPath === hrefPath
        ? "flex items-center space-x-1 sm:px-3 px-2 py-1.5 rounded-md shadow transition bg-gray-600 text-white sm:text-md text-sm"
        : "flex items-center space-x-1 sm:px-3 px-2 py-1.5 rounded-md shadow transition bg-white text-gray-600 sm:text-md text-sm hover:bg-gray-600 hover:text-white";
    }

    return `flex items-center space-x-1 sm:px-3 px-2 py-1.5 rounded-md shadow transition ${
      currentPath.startsWith(hrefPath)
        ? "bg-gray-600 text-white sm:text-md text-sm"
        : "bg-white text-gray-600 hover:bg-gray-600 hover:text-white sm:text-md text-sm"
    }`;
  };

  return (
    <header
      className={
        "bg-gradient-to-r from-blue-200 to-blue-300 shadow-md top-0 z-50 sticky"
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="  h-16 flex justify-between items-center">
          {/* Left: Logo */}
          <div className=" flex justify-start items-center">
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

          {/* User Icon / Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center space-x-4">
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="text-gray-700 hover:text-gray-600 transition w-10 h-10 flex items-center justify-center rounded-full  "
                    aria-label="User menu"
                  >
                    <HiUser size={24} />
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 text-xs bg-white shadow-lg rounded-md p-2 z-50">
                      <p className="px-4 py-2 text-gray-700 font-medium  rounded-lg hover:bg-gray-100  transition duration-300 ease-in-out">
                        {user.email}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2  font-bold text-red-600 h rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 hover:text-gray-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md border-t border-gray-200">
          <ul className="flex flex-col px-4 py-3 space-y-2 text-gray-700 font-semibold">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <div
                    onClick={() => setMenuOpen(false)}
                    className={`cursor-pointer block px-3 py-2 rounded transition ${
                      item.href === "/dashboard/admin/"
                        ? pathname.replace(/\/$/, "") === "/dashboard/admin"
                          ? "bg-gray-600 text-white"
                          : "hover:bg-gray-100"
                        : pathname.startsWith(item.href.replace(/\/$/, ""))
                        ? "bg-gray-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              </li>
            ))}
            {user && (
              <li className="border-t border-gray-200 pt-2">
                <p className="px-3 py-2 text-gray-700">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
