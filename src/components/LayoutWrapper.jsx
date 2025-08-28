// components/LayoutWrapper.js
"use client";

import Header from "@/components/Header";

export default function LayoutWrapper({ children }) {

  return (
    <>
      <Header 
       />
      {children}
    </>
  );
}
