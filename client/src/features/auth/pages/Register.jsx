import React, { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { handleRegister } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      username,
      email,
      password,
    };

    const success = await handleRegister(formData);

    if (success) {
      navigate("/login");
    }

    //console.log("Register submitted:", formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07171a] px-4 py-10 text-white">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0d2226] shadow-2xl shadow-black/30">
        <div className="bg-gradient-to-br from-[#31b8c6]/25 via-transparent to-transparent px-8 pb-6 pt-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#31b8c6]">
            Join now
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Set up your profile to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-8 pb-8">
          <div>
            <label
              htmlFor="register-username"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Username
            </label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Choose a username"
              className="w-full rounded-2xl border border-white/10 bg-[#091417] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#31b8c6] focus:ring-2 focus:ring-[#31b8c6]/30"
              required
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="register-email"
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
              htmlFor="register-password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              className="w-full rounded-2xl border border-white/10 bg-[#091417] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#31b8c6] focus:ring-2 focus:ring-[#31b8c6]/30"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#31b8c6] px-4 py-3 font-semibold text-[#06262b] transition hover:bg-[#57c9d4]"
          >
            Register
          </button>

          <p className="text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#31b8c6] hover:text-[#57c9d4]"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
