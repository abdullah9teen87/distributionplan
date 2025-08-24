// components/LayoutWrapper.js
"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function LayoutWrapper({ children }) {
  const [user, setUser] = useState(null);

  const handleLogin = () => setUser({ name: "John Doe" });
  const handleLogout = () => setUser(null);

  return (
    <>
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      {children}
    </>
  );
}
