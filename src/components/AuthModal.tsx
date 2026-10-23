"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, Loader2, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { username: string; email: string }) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin
      ? { emailOrUsername: email || username, password }
      : { username, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Authentication failed");
      }

      onSuccess(data.data.user);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl glass-card border border-gray-700 p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-800 pb-3 mb-5">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`font-semibold text-sm pb-2 border-b-2 mr-6 transition ${
              isLogin ? "border-pink-500 text-white" : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`font-semibold text-sm pb-2 border-b-2 transition ${
              !isLogin ? "border-pink-500 text-white" : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Username</label>
              <div className="flex items-center px-3 rounded-xl bg-gray-900 border border-gray-700 focus-within:border-pink-500 transition">
                <UserIcon className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full bg-transparent py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              {isLogin ? "Email or Username" : "Email Address"}
            </label>
            <div className="flex items-center px-3 rounded-xl bg-gray-900 border border-gray-700 focus-within:border-pink-500 transition">
              <Mail className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type={isLogin ? "text" : "email"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLogin ? "you@example.com or username" : "you@example.com"}
                className="w-full bg-transparent py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
            <div className="flex items-center px-3 rounded-xl bg-gray-900 border border-gray-700 focus-within:border-pink-500 transition">
              <Lock className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
            {!isLogin && (
              <span className="text-[10px] text-gray-400 mt-1 block">
                Min 8 characters with at least one uppercase letter, lowercase letter, and number.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded-xl text-sm font-semibold text-white insta-gradient-bg hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLogin ? "Sign In" : "Register"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
