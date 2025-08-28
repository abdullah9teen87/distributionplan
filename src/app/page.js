"use client";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const user = JSON.parse(userString); // parse JSON string
          if (user?.role === "admin") {
            router.push("/dashboard/admin");
          } else if (user?.role === "distributor") {
            router.push("/dashboard/distributor");
          }
        } catch (err) {
          console.warn("Error parsing user from localStorage:", err);
        }
      }
    }
  }, [router]);

  return (
    <div>
      <AuthModal />
    </div>
  );
}

export default Page;
