import React, { useState } from "react";
import { Link, Navigate } from "react-router";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const navigate = useNavigate();

  const { handleLogin } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email,
      password,
    };

    const success = await handleLogin(formData);

    if (success) {
      navigate("/");
    }

    //console.log("Login submitted:", formData);
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07171a] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0d2226] shadow-2xl shadow-black/30">
        <div className="bg-gradient-to-br from-[#31b8c6]/25 via-transparent to-transparent px-8 pb-6 pt-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#31b8c6]">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            Login to your account
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter your credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-8 pb-8">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-[#091417] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#31b8c6] focus:ring-2 focus:ring-[#31b8c6]/30"
              required
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-white/10 bg-[#091417] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#31b8c6] focus:ring-2 focus:ring-[#31b8c6]/30"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#31b8c6] px-4 py-3 font-semibold text-[#06262b] transition hover:bg-[#57c9d4]"
          >
            Login
          </button>

          <p className="text-center text-sm text-slate-300">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#31b8c6] hover:text-[#57c9d4]"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
