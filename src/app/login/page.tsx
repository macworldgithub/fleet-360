"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loginAgency,
  setAuthTokens,
  type LoginPayload,
  type ApiError,
} from "@/src/api/auth";

export default function LoginPage() {
  const router = useRouter();

  /* ── form state ── */
  const [form, setForm] = useState<LoginPayload>({
    contactEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /* ── async state ── */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── handlers ── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginAgency(form);
      setAuthTokens(res);
      router.push("/");
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── style helpers ── */
  const inputBase =
    "w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all duration-300 backdrop-blur-sm text-[15px]";

  const labelBase =
    "block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2";

  /* ────────────────────────── render ────────────────────────── */
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#0B0F1A] relative overflow-hidden">
      {/* ── decorative glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[140px]" />
        <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] bg-orange-600/6 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/3 rounded-full blur-[200px]" />
      </div>

      {/* ── left branding panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] relative flex-col justify-between p-12 xl:p-16">
        <div className="relative z-10 mt-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold px-3.5 py-2.5 text-sm rounded-lg shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow duration-300">
              AG
            </div>
            <div>
              <p className="font-semibold text-white leading-none text-lg">
                Agency Garage
              </p>
              <p className="text-xs tracking-[0.35em] text-amber-400 font-medium">
                FLEET360
              </p>
            </div>
          </Link>
        </div>

        {/* hero area */}
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-0.5 bg-amber-500" />
            <p className="text-sm tracking-[0.25em] text-amber-400 uppercase font-semibold">
              Fleet Management Portal
            </p>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Welcome{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent italic">
              Back
            </span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Sign in to manage your fleet, track costs, and optimise your
            agency&apos;s vehicle operations — all from one dashboard.
          </p>

          {/* stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Agencies" },
              { value: "12K+", label: "Vehicles Managed" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/5 rounded-xl p-4 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs mt-1 tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* bottom */}
        <p className="relative z-10 text-gray-500 text-sm">
          © {new Date().getFullYear()} Agency Garage · Fleet360
        </p>
      </div>

      {/* ── right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* mobile logo */}
          <div className="lg:hidden mb-10 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold px-3 py-2 text-sm rounded-lg">
                AG
              </div>
              <div>
                <p className="font-semibold text-white leading-none">
                  Agency Garage
                </p>
                <p className="text-xs tracking-[0.3em] text-amber-400">
                  FLEET360
                </p>
              </div>
            </Link>
          </div>

          {/* card */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-black/30">
            {/* heading */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Sign In
              </h2>
              <p className="text-gray-400 text-sm">
                Enter your credentials to access your fleet dashboard.
              </p>
            </div>

            {/* error banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm animate-[fadeInUp_0.3s_ease-out]">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="contactEmail" className={labelBase}>
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    placeholder="you@agency.com.au"
                    value={form.contactEmail}
                    onChange={handleChange}
                    className={`${inputBase} pl-12`}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className={labelBase + " !mb-0"}>
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs text-amber-400 hover:text-amber-300 transition font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••"
                    value={form.password}
                    onChange={handleChange}
                    className={`${inputBase} pl-12 pr-12`}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-white/5 text-amber-500 focus:ring-amber-500/40 accent-amber-500"
                />
                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition">
                  Keep me signed in
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 disabled:shadow-none flex items-center justify-center gap-2 text-[15px]"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* divider */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-amber-400 hover:text-amber-300 font-medium transition"
                >
                  Register your agency
                </Link>
              </p>
            </div>
          </div>

          {/* trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-gray-600 text-xs">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              256-bit SSL
            </span>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              SOC 2 Compliant
            </span>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <span>GDPR Ready</span>
          </div>
        </div>
      </div>

      {/* ── global keyframes ── */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
