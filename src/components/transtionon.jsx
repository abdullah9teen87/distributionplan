       <div
  className={`w-full sm:w-1/2 bg-gray-200 p-8 flex items-center justify-center transition-all duration-500 ease-in-out`}
>
  {/* Login Form */}
  <div className={`${isLogin ? "block" : "hidden"} w-full max-w-md`}>
    <form
      className="space-y-4 bg-amber-200 w-full rounded-lg p-6"
      onSubmit={handleLogin}
    >
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Login
      </h3>
      <input
        type="email"
        name="email"
        onChange={handleLoginChange}
        value={loginData.email}
        placeholder="Email"
        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        name="password"
        onChange={handleLoginChange}
        value={loginData.password}
        placeholder="Password"
        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
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

  {/* Signup Form */}
  <div className={`${isLogin ? "hidden" : "block"} w-full max-w-md`}>
    <form
      onSubmit={handleSignup}
      className="space-y-4 bg-amber-200 w-full rounded-lg p-6"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Sign Up
      </h3>
      <input
        type="text"
        name="name"
        onChange={handleChange}
        value={formData.name}
        placeholder="Name"
        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
      />
      <input
        type="email"
        name="email"
        onChange={handleChange}
        value={formData.email}
        placeholder="Email"
        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
      />
      <input
        type="password"
        name="password"
        onChange={handleChange}
        value={formData.password}
        placeholder="Password"
        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
      />
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