"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  HiMenu,
  HiX,
  HiUser,
  HiUsers,
  HiCreditCard,
  HiHome,
} from "react-icons/hi";

const Header = ({ user, onLogin, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const buttonClass =
    "flex items-center space-x-2 bg-white text-gray-600 px-3 py-1 rounded-md shadow hover:shadow-lg hover:bg-gray-600 hover:text-gray-50 transition";

  return (
    // <header className="bg-white shadow-md sticky top-0 z-50">
    <header className="bg-gradient-to-r from-blue-200 to-blue-300 shadow-md sticky top-0 z-50">
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
            <Link href="/" className={buttonClass}>
              <HiHome size={20} />
              <span>Home</span>
            </Link>
            <Link href="/user" className={buttonClass}>
              <HiUser size={20} />
              <span>User</span>
            </Link>
            <Link href="/distributor" className={buttonClass}>
              <HiUsers size={20} />
              <span>Distributor</span>
            </Link>
               <Link href="/group" className={buttonClass}>
              <HiCreditCard size={20} />
              <span>Group</span>
            </Link>
            <Link href="/payment" className={buttonClass}>
              <HiCreditCard size={20} />
              <span>Payment</span>
            </Link>
            <Link href="/report" className={buttonClass}>
              <HiCreditCard size={20} />
              <span>Report</span>
            </Link>
         
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
                className="text-gray-700 hover:text-blue-500 transition"
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HiUser size={24} />
              </button>
            )}
          </div>

          {/* Mobile: User Icon + Menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* User Icon / Login button always visible on mobile */}
            {user ? (
              <button
                onClick={onLogout} // Or open profile menu here if you want
                aria-label="User Profile / Logout"
                className="text-gray-700 hover:text-blue-500 transition"
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HiUser size={24} />
              </button>
            ) : (
              <button
                onClick={onLogin}
                aria-label="Login"
                className="text-gray-700 hover:text-blue-500 transition"
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HiUser size={24} />
              </button>
            )}

            {/* Mobile menu toggle button */}
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
            <li>
              {/* Wrap Link inside a clickable block to close menu */}
              <Link href="/" passHref>
                <div
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer block px-3 py-2 rounded hover:bg-gray-100 transition"
                >
                  Home
                </div>
              </Link>
            </li>
            <li>
              {/* Wrap Link inside a clickable block to close menu */}
              <Link href="/user" passHref>
                <div
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer block px-3 py-2 rounded hover:bg-gray-100 transition"
                >
                  User
                </div>
              </Link>
            </li>
            <li>
              <Link href="/distributor" passHref>
                <div
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer block px-3 py-2 rounded hover:bg-gray-100 transition"
                >
                  Distributor
                </div>
              </Link>
            </li>
            <li>
              <Link href="/group" passHref>
                <div
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer block px-3 py-2 rounded hover:bg-gray-100 transition"
                >
                  Group
                </div>
              </Link>
            </li>
            <li>
              <Link href="/payment" passHref>
                <div
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer block px-3 py-2 rounded hover:bg-gray-100 transition"
                >
                  Payment
                </div>
              </Link>
            </li>
            <li>
              <Link href="/report" passHref>
                <div
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer block px-3 py-2 rounded hover:bg-gray-100 transition"
                >
                  Report
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
