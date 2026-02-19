// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import {
//   registerAgency,
//   type RegisterAgencyPayload,
//   type ApiError,
// } from "@/src/api/auth";

// /* ────────────────────────── constants ────────────────────────── */

// const AUSTRALIAN_STATES = [
//   "Australian Capital Territory",
//   "New South Wales",
//   "Northern Territory",
//   "Queensland",
//   "South Australia",
//   "Tasmania",
//   "Victoria",
//   "Western Australia",
// ] as const;

// /* ────────────────────────── component ────────────────────────── */

// export default function RegisterPage() {
//   /* ── form state ── */
//   const [form, setForm] = useState<RegisterAgencyPayload>({
//     agencyName: "",
//     contactEmail: "",
//     contactPhone: "",
//     password: "",
//     abn: "",
//     address: "",
//     country: "Australia",
//     state: "",
//     city: "",
//   });

//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [agreed, setAgreed] = useState(false);

//   /* ── async state ── */
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<{
//     message: string;
//     agencyId: string;
//   } | null>(null);

//   /* ── step state (two‑step wizard) ── */
//   const [step, setStep] = useState<1 | 2>(1);

//   /* ── handlers ── */
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const goToStep2 = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setStep(2);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!/^\d{6}$/.test(form.password)) {
//       setError("Password must be exactly 6 digits.");
//       return;
//     }

//     if (form.password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (!agreed) {
//       setError("You must agree to the Terms & Conditions.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await registerAgency(form);
//       setSuccess({ message: res.message, agencyId: res.agencyId });
//     } catch (err: unknown) {
//       const apiErr = err as ApiError;
//       setError(apiErr.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ── input class helpers ── */
//   const inputBase =
//     "w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all duration-300 backdrop-blur-sm";

//   const labelBase =
//     "block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2";

//   /* ────────────────────── success screen ────────────────────── */
//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#0B0F1A] p-4">
//         {/* animated glow */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
//           <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
//         </div>

//         <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-[fadeInUp_0.6s_ease-out_both]">
//           {/* check icon */}
//           <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
//             <svg
//               className="w-12 h-12 text-white"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={3}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>

//           <h1 className="text-3xl md:text-4xl font-bold text-white">
//             Welcome Aboard!
//           </h1>
//           <p className="text-gray-300 text-lg">{success.message}</p>

//           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
//             <p className="text-gray-400 text-sm mb-1">Your Agency ID</p>
//             <p className="text-amber-400 font-mono text-lg font-bold tracking-wider">
//               {success.agencyId}
//             </p>
//           </div>

//           <Link
//             href="/login"
//             className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
//           >
//             Sign In to Your Account →
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   /* ────────────────────────── main form ────────────────────────── */
//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#0B0F1A] relative overflow-hidden">
//       {/* ── decorative backgrounds ── */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[140px]" />
//         <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] bg-orange-600/6 rounded-full blur-[160px]" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/3 rounded-full blur-[200px]" />
//       </div>

//       {/* ── left branding panel (hidden on mobile) ── */}
//       <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative flex-col justify-between p-12 xl:p-16">
//         <div className="relative z-10 mt-18">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-3 group">
//             <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold px-3.5 py-2.5 text-sm rounded-lg shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow duration-300">
//               AG
//             </div>
//             <div>
//               <p className="font-semibold text-white leading-none text-lg">
//                 Agency Garage
//               </p>
//               <p className="text-xs tracking-[0.35em] text-amber-400 font-medium">
//                 FLEET360
//               </p>
//             </div>
//           </Link>
//         </div>

//         {/* hero copy */}
//         <div className="relative z-10 max-w-lg">
//           <div className="flex items-center gap-3 mb-6">
//             <span className="w-10 h-0.5 bg-amber-500" />
//             <p className="text-sm tracking-[0.25em] text-amber-400 uppercase font-semibold">
//               Join the Network
//             </p>
//           </div>
//           <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
//             Register Your{" "}
//             <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent italic">
//               Agency
//             </span>
//           </h1>
//           <p className="text-gray-300 text-lg leading-relaxed">
//             Join Australia&apos;s premier fleet management platform. One
//             partner, simplified operations, smarter fleet decisions.
//           </p>

//           {/* feature pills */}
//           <div className="mt-10 space-y-4">
//             {[
//               { icon: "🛡️", text: "One Monthly Fee — No Hidden Costs" },
//               { icon: "⚡", text: "Onboard in Under 5 Minutes" },
//               { icon: "📊", text: "Real‑Time Fleet Dashboard" },
//             ].map((item) => (
//               <div
//                 key={item.text}
//                 className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-5 py-3.5 backdrop-blur-sm"
//               >
//                 <span className="text-xl">{item.icon}</span>
//                 <span className="text-gray-200 text-sm font-medium">
//                   {item.text}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* bottom note */}
//         <p className="relative z-10 text-gray-500 text-sm">
//           © {new Date().getFullYear()} Agency Garage · Fleet360
//         </p>
//       </div>

//       {/* ── right form panel ── */}
//       <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
//         <div className="w-full max-w-xl">
//           {/* mobile logo */}
//           <div className="lg:hidden mb-10 flex items-center gap-3">
//             <Link href="/" className="flex items-center gap-3">
//               <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold px-3 py-2 text-sm rounded-lg">
//                 AG
//               </div>
//               <div>
//                 <p className="font-semibold text-white leading-none">
//                   Agency Garage
//                 </p>
//                 <p className="text-xs tracking-[0.3em] text-amber-400">
//                   FLEET360
//                 </p>
//               </div>
//             </Link>
//           </div>

//           {/* card */}
//           <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-black/30">
//             {/* heading */}
//             <div className="mb-8">
//               <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//                 {step === 1 ? "Agency Details" : "Location & Security"}
//               </h2>
//               <p className="text-gray-400 text-sm">
//                 {step === 1
//                   ? "Tell us about your agency to get started."
//                   : "Almost there — set your password and location."}
//               </p>
//             </div>

//             {/* progress dots */}
//             <div className="flex items-center gap-3 mb-8">
//               <div
//                 className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
//                   step >= 1
//                     ? "bg-gradient-to-r from-amber-500 to-orange-500"
//                     : "bg-white/10"
//                 }`}
//               />
//               <div
//                 className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
//                   step >= 2
//                     ? "bg-gradient-to-r from-amber-500 to-orange-500"
//                     : "bg-white/10"
//                 }`}
//               />
//             </div>

//             {/* error banner */}
//             {error && (
//               <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm animate-[fadeInUp_0.3s_ease-out]">
//                 <svg
//                   className="w-5 h-5 flex-shrink-0 mt-0.5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 9v2m0 4h.01m-6.93 5h13.86c1.1 0 1.96-.9 1.84-1.98l-1.14-10.15A2 2 0 0016.7 7H7.3a2 2 0 00-1.97 1.87L4.19 19.02A1.84 1.84 0 006.03 21z"
//                   />
//                 </svg>
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* ─────────── STEP 1 ─────────── */}
//             {step === 1 && (
//               <form onSubmit={goToStep2} className="space-y-5">
//                 {/* Agency Name */}
//                 <div>
//                   <label htmlFor="agencyName" className={labelBase}>
//                     Agency Name
//                   </label>
//                   <input
//                     type="text"
//                     id="agencyName"
//                     name="agencyName"
//                     placeholder="e.g. Fleet Masters Pty Ltd"
//                     value={form.agencyName}
//                     onChange={handleChange}
//                     className={inputBase}
//                     required
//                   />
//                 </div>

//                 {/* Email + Phone */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div>
//                     <label htmlFor="contactEmail" className={labelBase}>
//                       Contact Email
//                     </label>
//                     <input
//                       type="email"
//                       id="contactEmail"
//                       name="contactEmail"
//                       placeholder="you@agency.com.au"
//                       value={form.contactEmail}
//                       onChange={handleChange}
//                       className={inputBase}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="contactPhone" className={labelBase}>
//                       Contact Phone
//                     </label>
//                     <input
//                       type="tel"
//                       id="contactPhone"
//                       name="contactPhone"
//                       placeholder="+61 412 345 678"
//                       value={form.contactPhone}
//                       onChange={handleChange}
//                       className={inputBase}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* ABN */}
//                 <div>
//                   <label htmlFor="abn" className={labelBase}>
//                     ABN (Australian Business Number)
//                   </label>
//                   <input
//                     type="text"
//                     id="abn"
//                     name="abn"
//                     placeholder="12 345 678 901"
//                     value={form.abn}
//                     onChange={handleChange}
//                     className={inputBase}
//                     required
//                   />
//                 </div>

//                 {/* Next button */}
//                 <button
//                   type="submit"
//                   className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center justify-center gap-2"
//                 >
//                   Continue
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M13 7l5 5m0 0l-5 5m5-5H6"
//                     />
//                   </svg>
//                 </button>
//               </form>
//             )}

//             {/* ─────────── STEP 2 ─────────── */}
//             {step === 2 && (
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Address */}
//                 <div>
//                   <label htmlFor="address" className={labelBase}>
//                     Street Address
//                   </label>
//                   <input
//                     type="text"
//                     id="address"
//                     name="address"
//                     placeholder="123 Collins Street, Melbourne"
//                     value={form.address}
//                     onChange={handleChange}
//                     className={inputBase}
//                     required
//                   />
//                 </div>

//                 {/* Country + State */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div>
//                     <label htmlFor="country" className={labelBase}>
//                       Country
//                     </label>
//                     <input
//                       type="text"
//                       id="country"
//                       name="country"
//                       value={form.country}
//                       onChange={handleChange}
//                       className={inputBase}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="state" className={labelBase}>
//                       State
//                     </label>
//                     <select
//                       id="state"
//                       name="state"
//                       value={form.state}
//                       onChange={handleChange}
//                       className={`${inputBase} appearance-none`}
//                       required
//                     >
//                       <option value="" disabled>
//                         Select state
//                       </option>
//                       {AUSTRALIAN_STATES.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* City */}
//                 <div>
//                   <label htmlFor="city" className={labelBase}>
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     id="city"
//                     name="city"
//                     placeholder="Melbourne"
//                     value={form.city}
//                     onChange={handleChange}
//                     className={inputBase}
//                     required
//                   />
//                 </div>

//                 {/* Password + Confirm */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div className="relative">
//                     <label htmlFor="password" className={labelBase}>
//                       Password
//                     </label>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       id="password"
//                       name="password"
//                       placeholder="••••••"
//                       value={form.password}
//                       onChange={handleChange}
//                       className={inputBase}
//                       minLength={6}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-300 transition"
//                       aria-label="Toggle password visibility"
//                     >
//                       {showPassword ? (
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={1.5}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
//                           />
//                         </svg>
//                       ) : (
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={1.5}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                   <div>
//                     <label htmlFor="confirmPassword" className={labelBase}>
//                       Confirm Password
//                     </label>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       placeholder="••••••"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       className={inputBase}
//                       required
//                       inputMode="numeric"
//                       pattern="[0-9]{6}"
//                       maxLength={6}
//                     />
//                   </div>
//                 </div>

//                 {/* T&C checkbox */}
//                 <label className="flex items-start gap-3 cursor-pointer group">
//                   <input
//                     type="checkbox"
//                     checked={agreed}
//                     onChange={(e) => setAgreed(e.target.checked)}
//                     className="mt-1 w-4 h-4 rounded border-gray-600 bg-white/5 text-amber-500 focus:ring-amber-500/40 accent-amber-500"
//                   />
//                   <span className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition">
//                     I agree to Fleet360&apos;s{" "}
//                     <span className="text-amber-400 hover:underline cursor-pointer">
//                       Terms of Service
//                     </span>{" "}
//                     and{" "}
//                     <span className="text-amber-400 hover:underline cursor-pointer">
//                       Privacy Policy
//                     </span>
//                     .
//                   </span>
//                 </label>

//                 {/* Buttons */}
//                 <div className="flex gap-3 mt-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setStep(1);
//                       setError(null);
//                     }}
//                     className="flex-1 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M11 17l-5-5m0 0l5-5m-5 5h12"
//                       />
//                     </svg>
//                     Back
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="flex-[2] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 disabled:shadow-none flex items-center justify-center gap-2"
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg
//                           className="w-5 h-5 animate-spin"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           />
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                           />
//                         </svg>
//                         Registering…
//                       </>
//                     ) : (
//                       <>
//                         Create Agency Account
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* divider */}
//             <div className="mt-8 pt-6 border-t border-white/5 text-center">
//               <p className="text-gray-500 text-sm">
//                 Already have an account?{" "}
//                 <Link
//                   href="/login"
//                   className="text-amber-400 hover:text-amber-300 font-medium transition"
//                 >
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── global keyframe for fade-in animation ── */}
//       <style jsx global>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
