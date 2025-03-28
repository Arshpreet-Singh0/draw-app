"use client";
import { Mail, Lock, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ChangeEvent } from "react";

interface inputType {
  name?: string;
  password: string;
  email: string;
}

export default function AuthPage({
  isSignIn,
  input,
  handleChange,
  handleSubmit,
}: {
  isSignIn: boolean;
  input: inputType;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <ExternalLink className="w-8 h-8" />
            Excalidraw
          </h1>
          <p className="text-gray-400">
            Create diagrams and sketches with ease
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-[#1e1e1e] rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              {!isSignIn && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={handleChange}
                    className="w-full bg-[#2d2d2d] text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  className="w-full bg-[#2d2d2d] text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={handleChange}
                  className="w-full bg-[#2d2d2d] text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {isSignIn ? "Login Into Your Account" : "Create Account"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1e1e1e] text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </form>

          {isSignIn ? (
            <>
              <p className="mt-6 text-center text-gray-400">
                {"Don't have an account?"}
                <Link
                  href="/signup"
                  className="text-blue-500 hover:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <p className="mt-6 text-center text-gray-400">
              Already have an account?
              <Link
                href="/signin"
                className="text-blue-500 hover:text-blue-400"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
