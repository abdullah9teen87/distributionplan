// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// const SplashScreen = ({ children }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fake loading time (2s), you can replace with real API init
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-r from-blue-200 to-blue-400">
//         <Image
//           src="/DistributionPlan.png"
//           alt="App Logo"
//           width={200}
//           height={200}
//           className="animate-bounce"
//         />
//         <h1 className="mt-4 text-2xl font-bold text-white animate-pulse">
//           Distribution Plan
//         </h1>
//       </div>
//     );
//   }

//   return children;
// };

// export default SplashScreen;

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const SplashScreen = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 5s splash
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-r from-blue-200 to-blue-400">
        <style jsx>{`
          @keyframes flip {
            0% {
              transform: rotateY(0deg);
            }
            50% {
              transform: rotateY(180deg);
            }
            100% {
              transform: rotateY(360deg);
            }
          }
          .flip {
            animation: flip 1s ease-in-out 4; /* 4 flips */
          }
        `}</style>

        <Image
          src="/DistributionPlan.png"
          alt="App Logo"
          width={200}
          height={200}
          className="animate-bounce"
        />

        <h1 className="mt-4 text-2xl font-bold text-white animate-pulse">
          Distribution Plan
        </h1>
      </div>
    );
  }

  return children;
};

export default SplashScreen;
