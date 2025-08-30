"use client";
import { BASE_URL } from "@/data/baseurl";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineX } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    otp: "",
  });

  // const handleChange = (e) => {
  //    const { name, email, mobile, value, type } = e.target;
  //   let formattedValue = value;

  //   if (name === "mobile") {
  //     formattedValue = formatContact(value);
  //   }

  //   setFormData({ ...formData, [e.target.name]: e.target.value });

  // };

  // const formatContact = (value) => {
  //   const digits = value.replace(/\D/g, "").slice(0, 11);
  //   if (digits.length <= 4) return digits;
  //   return `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
  // };

  const formatContact = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11); // only digits, max 11
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`; // 0312-2255770
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "mobile") {
      formattedValue = formatContact(value); // format mobile input
    }

    setFormData({
      ...formData,
      [name]: formattedValue, // use formattedValue, not raw value
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "identifier" && !value.includes("@")) {
      let identifier = loginData.identifier;

      // Agar email nahi hai → treat as mobile aur normalize
      if (!identifier.includes("@")) {
        identifier = formatContact(identifier);
      }
      // If it's a mobile (no "@"), normalize it
      formattedValue = formatContact(value);
    }

    setLoginData({
      ...loginData,
      [name]: formattedValue, // <-- normalized with dash
    });
  };

  // const handleLoginChange = (e) => {
  // const { name, value } = e.target;
  // let formattedValue = value;

  // if (name === "mobile") {
  //   formattedValue = formatContact(value); // format mobile input
  // }

  //   setLoginData({ ...loginData, [e.target.name]: e.target.value });
  // };

  // Signup API Call
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });

      if (res.data.success) {
        toast.success("Signup successful 🎉 Please verify OTP");

        setShowOtp(true);
      } else {
        toast.error(res.data.message || "Signup failed ❌");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  // const handleResendOtp = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.post(`${BASE_URL}/api/auth/resend-otp`, {
  //       email: formData.email,
  //     });

  //     if (res.data.success) {
  //       toast.success("OTP resent successfully 📩");
  //     } else {
  //       toast.error(res.data.message || "Failed to resend OTP ❌");
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Resend failed ❌");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        otp: formData.otp,
      });

      if (res.data.success) {
        toast.success("Email verified and Signup successful 🎉");
        setShowOtp(false);
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          otp: "",
        });
      } else {
        toast.error(res.data.message || "Invalid OTP ❌");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP verification failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  // Login API Call
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const res = await axios.post(`${BASE_URL}/api/auth/login`, {
  //       // email: loginData.email,
  //       // mobile: loginData.mobile,
  //       identifier: loginData.identifier,
  //       password: loginData.password,
  //     });

  //     if (res.data.success) {
  //       console.log("Login response:", res.data);
  //       toast.success("Login successful 🎉");

  //       const user = res.data.data;
  //       console.log("User:", user);

  //       // Save user to localStorage
  //       if (typeof window !== "undefined") {
  //         localStorage.setItem("user", JSON.stringify(user));
  //       }

  //       setLoginData({ email: "", mobile: "", password: "" });

  //       // Redirect based on role
  //       if (user.role === "admin") {
  //         router.push("/dashboard/admin");
  //       } else {
  //         router.push("/dashboard/distributor");
  //       }
  //     } else {
  //       toast.error(res.data.message || "Login failed ❌");
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Login failed ❌");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  const doLogin = async (payload) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, payload);

      if (res.data.success) {
        console.log("Login response:", res.data);
        toast.success("Login successful 🎉");

        const user = res.data.data;
        console.log("User:", user);

        // Save user to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }

        setLoginData({ email: "", mobile: "", identifier: "", password: "" });

        // Redirect based on role
        if (user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/distributor");
        }
      } else {
        toast.error(res.data.message || "Login failed ❌");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Try to get location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        doLogin({
          identifier: loginData.identifier,
          password: loginData.password,
          latitude,
          longitude,
        });
      },
      (error) => {
        console.warn("Location permission denied:", error);
        // fallback: call login without location
        doLogin({
          identifier: loginData.identifier,
          password: loginData.password,
        });
      }
    );
  } else {
    // If browser doesn't support geolocation
    doLogin({
      identifier: loginData.identifier,
      password: loginData.password,
    });
  }
};


  return (
    <div className="flex sm:items-center items-start pt-8 justify-center h-screen w-screen bg-gradient-to-r from-blue-200 to-blue-400 relative">
      <div className="bg-stone-50 sm:flex-row flex-col rounded-2xl shadow-xl min-h-[70%] lg:w-[70%] md:w-[80%] w-[90%] overflow-hidden flex">
        {/* Left Section */}
        <div
          className={`w-full sm:w-1/2 ${
            isLogin
              ? "sm:translate-x-0 bg-blue-400"
              : "sm:translate-x-full bg-blue-400"
          } z-999 transition-all duration-500 ease-in-out p-8 flex flex-col justify-center items-center  text-white`}
        >
          <Image
            src={"/DistributionPlan.png"}
            width={100}
            height={100}
            alt={"Logo"}
          />
          <h2 className="text-3xl font-bold mb-4 transition-all duration-700">
            {isLogin ? "Welcome Back!" : "Hello, Friend!"}
          </h2>
          <p className="text-center transition-all duration-700">
            {isLogin
              ? "Login to access your account and continue your journey with us."
              : "Sign up and start your new journey with us today!"}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowOtp(false);
            }}
            className="mt-6 px-6 py-2 bg-white text-blue-400 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>

        {/* Right Section */}
        <div
          className={`w-full sm:w-1/2 bg-gray-100 p-8 flex ${
            isLogin ? "sm:translate-x-0" : "sm:-translate-x-full"
          } transition-all duration-500 ease-in-out items-center justify-center`}
        >
          <div
            className={`sm:w-full transition-all duration-500 ease-in-out ${
              isLogin ? "sm:-translate-x-0 flex" : "sm:translate-x-full hidden"
            }`}
          >
            <form className="space-y-4  w-full " onSubmit={handleLogin}>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Login
              </h3>
              <input
                type="text"
                name="identifier"
                onChange={handleLoginChange}
                value={loginData.identifier}
                placeholder="Email / Mobile Number"
                className="w-full border border-gray-400 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleLoginChange}
                  value={loginData.password}
                  placeholder="Password"
                  className="w-full border border-gray-400 px-4 bg-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                  disabled={loading}
                />

                {/* 👁 Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-400 text-white py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="loader border-2 border-white border-t-transparent w-5 h-5 rounded-full animate-spin"></span>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>

          <div
            className={`sm:w-full transition-all  duration-500 ease-in-out ${
              isLogin
                ? "sm:translate-x-full translate-y-full hidden"
                : "sm:translate-x-0 translate-x-0 flex"
            }`}
          >
            <form onSubmit={handleSignup} className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Sign Up
              </h3>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Name"
                className="w-full border px-4 py-2   border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                disabled={loading}
              />

              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Email"
                className="w-full border  border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                disabled={loading}
              />
              <input
                type="mobile"
                name="mobile"
                onChange={handleChange}
                value={formData.mobile}
                placeholder="Mobile Number"
                className="w-full border  border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                disabled={loading}
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"} // 👈 show/hide toggle
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Password"
                  className="w-full border border-gray-400 px-4 bg-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                  disabled={loading}
                />

                {/* 👁 Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>

              {/* <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="Password"
                className="w-full border px-4 py-2 rounded-lg   border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                disabled={loading}
              /> */}
              <button
                type="submit"
                className="w-full bg-blue-400 text-white py-2 rounded-lg font-semibold shadow-sm hover:shadow-sm transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="loader border-2 border-white border-t-transparent w-5 h-5 rounded-full animate-spin"></span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtp && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 z-9999">
          <div className="bg-white rounded-xl shadow-xl pt-10 w-[90%] max-w-sm p-6 animate-fadeIn relative">
            <HiOutlineX
              onClick={() => setShowOtp(false)}
              disabled={loading}
              className="inline-block ml-1 absolute right-5 top-5"
            />
            <h1 className="text-center font-bold text-lg mb-2">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500 text-center mb-4">
              Enter the OTP sent to <b>{formData.email}</b>
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="number"
                name="otp"
                onChange={handleChange}
                value={formData.otp}
                placeholder="Enter OTP"
                // className="shadow-md w-full py-2 border border-gray-300 rounded-lg text-center"
                className="shadow-md w-full py-2 border border-gray-300 rounded-lg text-center tracking-[0.5em]"
                disabled={loading}
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full py-2 bg-blue-400 text-white rounded-lg shadow-md hover:shadow-lg transition flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="loader border-2 border-white border-t-transparent w-5 h-5 rounded-full animate-spin"></span>
                ) : (
                  "Verify OTP"
                )}
              </button>
              {/* <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowOtp(false)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition"
                  disabled={loading}
                  >
                  Close 
                </button> */}
              {/* <button
                  onClick={handleResendOtp}
                  className="px-4 py-2 text-blue-500 border border-blue-400 rounded-lg hover:bg-blue-50 transition flex justify-center items-center"
                >
                  {loading ? (
                    <span className="loader border-2 border-blue-400 border-t-transparent w-5 h-5 rounded-full animate-spin"></span>
                  ) : (
                    "Resend OTP"
                  )}
                </button> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModal;
