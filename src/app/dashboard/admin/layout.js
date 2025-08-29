import Header from "@/components/Header";
import React from "react";

function layout({ children }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}

export default layout;
