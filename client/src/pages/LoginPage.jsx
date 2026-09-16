import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  Sparkles,
  Shield,
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  Sun,
  Moon,
  Mail,
  BadgeCheck,
  UserPlus,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../context/AuthContext';
import { motion } from "motion/react";
import { Typewriter } from "motion-plus/react";
import { TypeAnimation } from "react-type-animation";
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';
import demoAvatars from '../utils/avatars';
import HLetterLogo from '../components/common/HLetterLogo';

const LoginPage = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'verify'

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign up form state
  const [signupData, setSignupData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    role: 'employee', // 'employee' | 'admin'
    department: 'Engineering',
    designation: 'Software Engineer',
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Verification form state
  const [verifyEmailInput, setVerifyEmailInput] = useState('');
  const [verifyTokenInput, setVerifyTokenInput] = useState('');
  const [demoVerificationInfo, setDemoVerificationInfo] = useState(null);

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check URL query parameters for token/email
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const emailParam = params.get('email');
    if (tokenParam || emailParam) {
      setAuthMode('verify');
      if (tokenParam) setVerifyTokenInput(tokenParam);
      if (emailParam) setVerifyEmailInput(emailParam);
    }
  }, [location.search]);

  // const handleLoginSubmit = async (e, customEmail, customPassword) => {
  //   if (e) e.preventDefault();
  //   const loginEmail = customEmail || email;
  //   const loginPass = customPassword || password;

  //   if (!loginEmail || !loginPass) {
  //     toast.error('Please enter both email and password');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const res = await api.post('/auth/login', { email: loginEmail, password: loginPass });
  //     setIsSubmitting(false);

  //     if (res.data.success) {
  //       localStorage.setItem('dayflow_token', res.data.token);
  //       localStorage.setItem('dayflow_user', JSON.stringify(res.data.user));
  //       toast.success(`Welcome to WorkZen, ${res.data.user.name}!`);

  //       const targetRoute =
  //         location.state?.from?.pathname ||
  //         (res.data.user.role === 'admin' ? '/admin' : '/employee');

  //       // Force window location or navigate to load fresh context
  //       window.location.href = targetRoute;
  //     }
  //   } catch (err) {
  //     setIsSubmitting(false);
  //     const data = err.response?.data;
  //     if (data?.unverified) {
  //       toast.error('Email not verified. Redirecting to verification...');
  //       setAuthMode('verify');
  //       setVerifyEmailInput(data.email || loginEmail);
  //       if (data.verificationToken) {
  //         setVerifyTokenInput(data.verificationToken);
  //       }
  //     } else {
  //       toast.error(data?.message || 'Login failed. Please check your credentials.');
  //     }
  //   }
  // };

  // const handleSignupSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!signupData.employeeId || !signupData.email || !signupData.password) {
  //     toast.error('Please fill in all required registration fields.');
  //     return;
  //   }

  //   if (signupData.password.length < 6) {
  //     toast.error('Password must be at least 6 characters.');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const res = await api.post('/auth/register', signupData);
  //     setIsSubmitting(false);

  //     if (res.data.success) {
  //       toast.success('Registration successful! Please verify your email.');
  //       setDemoVerificationInfo(res.data.demoVerification);
  //       setVerifyEmailInput(signupData.email);
  //       if (res.data.demoVerification?.token) {
  //         setVerifyTokenInput(res.data.demoVerification.token);
  //       }
  //       setAuthMode('verify');
  //     }
  //   } catch (err) {
  //     setIsSubmitting(false);
  //     toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
  //   }
  // };

  const handleVerifySubmit = async (e) => {
    if (e) e.preventDefault();
    if (!verifyTokenInput && !verifyEmailInput) {
      toast.error('Please enter the verification token or email');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/verify-email', {
        token: verifyTokenInput,
        email: verifyEmailInput,
      });
      setIsSubmitting(false);

      if (res.data.success) {
        toast.success('Account verified successfully! You can now sign in.');
        setEmail(verifyEmailInput);
        setAuthMode('login');
        setDemoVerificationInfo(null);
      }
    } catch (err) {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || 'Verification failed. Invalid or expired token.');
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setAuthMode('login');
    handleLoginSubmit(null, demoEmail, demoPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      {/* Background glowing orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header bar */}
      <header className="relative z-10 px-6 py-4 border-b border-slate-200 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <HLetterLogo iconSize={36} showTagline={false} />

          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-400 dark:text-slate-400 font-semibold hidden sm:inline-block">
              Human Resource Management System
            </span>
            {/* <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center shadow-sm"
            >
              {isDark ? (
                <FontAwesomeIcon icon={faSun} className='w-4 h-4 text-amber-500' />
              ) : (
                <FontAwesomeIcon icon={faMoon} className="w-4 h-4 text-indigo-500 " />
              )}
            </button> */}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-7xl flex flex-col lg:flex-col gap-8 items-center">
          {/* Left: the two login/signup cards */}
          <div className="w-full lg:flex-1 flex flex-col md:flex-row gap-6 min-w-0">
            <div className="flex-1 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 sm:p-9 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors duration-200">
              {/* This is Left Commponent Used For Sfot glow animation and Discriptions */}
              <div className="relativ dark:bg-slate-900/90 transition-colors duration-200 overflow-hidden min-h-[520px] flex items-center justify-center flex-col">

                {/* Soft glow behind the animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 bg-brand-500/15 dark:bg-brand-600/20 rounded-full blur-[90px]"></div>
                </div>

                <DotLottieReact
                  src='https://lottie.host/6bfd9910-fb51-44a8-9b35-c47df405b7ac/VwFWC2GTXq.lottie'
                  loop
                  autoplay
                  className="relative z-10 w-full max-w-sm"
                />
                <div className="relative z-10 mt-6 max-w-sm">
                  <h2 className="text-2xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Your entire workforce, in one place
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-6 leading-relaxed">
                    Laxmaya brings attendance, payroll, leave, and performance management together in a single, real-time HR platform — built to keep teams in sync.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Form (Login / Sign Up / Verify Email) */}
            <div className="flex-1 min-w-0 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors duration-200">
              {/* Mode Switcher Tabs */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-xl transition-all ${authMode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 rounded-xl transition-all ${authMode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  Sign Up
                </button>
                {/* <button
                type="button"
                onClick={() => setAuthMode('verify')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  authMode === 'verify'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Verify Email
              </button> */}
              </div>

              {/* TAB 1: SIGN IN */}
              {authMode === 'login' && (
                <>
                  <div className="min-h-fit w-full flex items-start justify-center bg-white px-6 pt-1 sm:pt-5">
                    <div className="w-full max-w-md">
                      <span className="text-sm font-semibold text-slate-900">LaxMaya</span>
                      <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mt-6 mb-10">
                        Sign in
                      </h2>
                      {/* onSubmit={handleLoginSubmit} */}
                      <form className="relative">
                        {/* connecting line running through every step */}
                        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />

                        <div className="space-y-9">
                          {/* Step 1 — email */}
                          <div className="relative pl-8">
                            <span
                              className={`absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors ${email
                                ? "bg-slate-950 border-slate-950"
                                : "bg-white border-slate-300"
                                }`}
                            />
                            <label htmlFor="email" className="block text-sm text-slate-500 mb-1.5">
                              Work email
                            </label>
                            <input
                              id="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="yourname@company.com"
                              className="w-full py-1.5 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-300 text-base focus:outline-none focus:border-slate-900 transition-colors"
                            />
                          </div>

                          {/* Step 2 — password */}
                          <div className="relative pl-8">
                            <span
                              className={`absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors ${password
                                ? "bg-slate-950 border-slate-950"
                                : "bg-white border-slate-300"
                                }`}
                            />
                            <div className="flex items-center justify-between mb-1.5">
                              <label htmlFor="password" className="text-sm text-slate-500">
                                Password
                              </label>
                              <button type="button" className="text-xs text-slate-400 hover:text-slate-700">
                                Forgot it?
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full py-1.5 pr-7 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-300 text-base focus:outline-none focus:border-slate-900 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-0 bottom-1.5 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="relative pl-8">
                            <span
                              className={`absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors ${isSubmitting
                                ? "bg-slate-950 border-slate-950"
                                : "bg-white border-slate-300"
                                }`}
                            />
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Signing in…</span>
                                </>
                              ) : (
                                <span>Sign in</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>

                      <p className="mt-10 text-sm text-slate-400">
                        New here?{" "}
                        <button className="text-slate-900 underline underline-offset-2">
                          Create an account
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-100 shrink-0 flex gap-3 mt-5">
                    {/* <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/40">
              <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                Hackathon Demo Quick Switcher
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Click any profile card below to sign in instantly with verified Indian demo accounts.
              </p>
            </div> */}

                    {/* HR Admin Card - Priya Iyer */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('admin@dayflow.com', 'admin123')}
                      className="w-1/2 aspect-square p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-sm"
                    >
                      <img
                        src={demoAvatars.priya}
                        alt="Priya Iyer"
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />

                      <div className="flex flex-col items-center gap-1">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                          Priya Iyer
                        </h4>

                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                          HR Admin
                        </span>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          HR Manager • Bengaluru
                        </p>
                      </div>

                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-y-1 transition-all mt-1" />
                    </button>

                    {/* Employee 1 - Ananya Sharma (Engineering) */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('alex@dayflow.com', 'employee123')}
                      className="w-1/2 aspect-square p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-sm"
                    >
                      <img
                        src={demoAvatars.ananya}
                        alt="Ananya Sharma"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />

                      <div className="flex flex-col items-center gap-1">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                          Ananya Sharma
                        </h4>

                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                          Employee
                        </span>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Senior Fullstack Dev • Bengaluru
                        </p>
                      </div>

                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-y-1 transition-all mt-1" />
                    </button>

                    {/* Employee 2 - Rohan Nair (UI/UX Design) */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('elena@dayflow.com', 'employee123')}
                      className="w-1/2 aspect-square p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-sm"
                    >
                      <img
                        src={demoAvatars.rohan}
                        alt="Rohan Nair"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />

                      <div className="flex flex-col items-center gap-1">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                          Rohan Nair
                        </h4>

                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                          Employee
                        </span>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Lead UI/UX Designer • Bengaluru
                        </p>
                      </div>

                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-y-1 transition-all mt-1" />
                    </button>

                    {/* Employee 3 - Arjun Menon (Marketing) */}
                    {/* <button
              type="button"
              onClick={() => handleQuickDemo('marcus@dayflow.com', 'employee123')}
              className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 transition-all group flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={demoAvatars.arjun}
                  alt="Arjun Menon"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                      Arjun Menon
                    </h4>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                      Marketing
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Marketing Director • Mumbai</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
            </button> */}
                  </div>
                </>
              )}

              {/* TAB 2: SIGN UP */}
              {authMode === 'signup' && (
                <>
                  <div className="min-h-screen w-full flex items-start justify-center bg-white px-6 pt-1 sm:pt-10 pb-10">
                    <div className="w-full max-w-md">
                      <span className="text-sm font-semibold text-slate-900">LaMaya</span>
                      <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mt-6">
                        Create your account
                      </h2>
                      <p className="text-slate-500 text-sm mt-1 mb-10">
                        Register as an employee or an HR administrator.
                      </p>
                      {/* onSubmit={handleSignupSubmit} */}
                      <form className="relative">

                        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />

                        <div className="space-y-9">
                          {/* Step 1 — role */}
                          <div className="relative pl-8">
                            <span className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 bg-slate-950 border-slate-950" />
                            <label className="block text-sm text-slate-500 mb-2">
                              Organization role
                            </label>
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => setSignupData({ ...signupData, role: "employee" })}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${signupData.role === "employee"
                                  ? "border-slate-900 bg-slate-50"
                                  : "border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <User className="w-4 h-4 text-slate-700 shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-900">Employee</p>
                                  <p className="text-xs text-slate-500">Standard team member access</p>
                                </div>
                                <span
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${signupData.role === "employee" ? "border-slate-900" : "border-slate-300"
                                    }`}
                                >
                                  {signupData.role === "employee" && (
                                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                                  )}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSignupData({ ...signupData, role: "admin" })}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${signupData.role === "admin"
                                  ? "border-slate-900 bg-slate-50"
                                  : "border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <Shield className="w-4 h-4 text-slate-700 shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-900">HR / Admin</p>
                                  <p className="text-xs text-slate-500">Manage employee records and access</p>
                                </div>
                                <span
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${signupData.role === "admin" ? "border-slate-900" : "border-slate-300"
                                    }`}
                                >
                                  {signupData.role === "admin" && (
                                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                                  )}
                                </span>
                              </button>
                            </div>
                          </div>


                          <div className="relative pl-8">
                            <span
                              className={`absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors ${signupData.employeeId
                                ? "bg-slate-950 border-slate-950"
                                : "bg-white border-slate-300"
                                }`}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="employeeId" className="block text-sm text-slate-500 mb-1.5">
                                  Employee ID
                                </label>
                                <input
                                  id="employeeId"
                                  type="text"
                                  required
                                  value={signupData.employeeId}
                                  onChange={(e) =>
                                    setSignupData({ ...signupData, employeeId: e.target.value.toUpperCase() })
                                  }
                                  placeholder="EMP-007"
                                  className="w-full py-1.5 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-300 font-mono text-sm focus:outline-none focus:border-slate-900 transition-colors"
                                />
                              </div>
                              <div>
                                <label htmlFor="name" className="block text-sm text-slate-500 mb-1.5">
                                  Full name
                                </label>
                                <input
                                  id="name"
                                  type="text"
                                  value={signupData.name}
                                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                  placeholder="Vikramaditya Rao"
                                  className="w-full py-1.5 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-300 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                                />
                              </div>
                            </div>
                          </div>


                          <div className="relative pl-8">
                            <span
                              className={`absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors ${signupData.email
                                ? "bg-slate-950 border-slate-950"
                                : "bg-white border-slate-300"
                                }`}
                            />
                            <label htmlFor="email" className="block text-sm text-slate-500 mb-1.5">
                              Work email
                            </label>
                            <input
                              id="email"
                              type="email"
                              required
                              value={signupData.email}
                              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                              placeholder="vikram@dayflow.com"
                              className="w-full py-1.5 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-300 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                            />
                          </div>


                          <div className="relative pl-8">
                            <span
                              className={`absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors ${signupData.password.length >= 6
                                ? "bg-slate-950 border-slate-950"
                                : "bg-white border-slate-300"
                                }`}
                            />
                            <label htmlFor="password" className="block text-sm text-slate-500 mb-1.5">
                              Password (min 6 characters)
                            </label>
                            <div className="relative">
                              <input
                                id="password"
                                type={showSignupPassword ? "text" : "password"}
                                required
                                minLength={6}
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                placeholder="Create a strong password"
                                className="w-full py-1.5 pr-7 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-300 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                                aria-label={showSignupPassword ? "Hide password" : "Show password"}
                                className="absolute right-0 bottom-1.5 text-slate-400 hover:text-slate-600"
                              >
                                {showSignupPassword ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>


                          <div className="relative pl-8">
                            <span
                              className={`absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors ${isSubmitting
                                ? "bg-slate-950 border-slate-950"
                                : "bg-white border-slate-300"
                                }`}
                            />
                            <div className="flex items-start gap-2 text-xs text-slate-500 mb-4">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>
                                Your account starts <strong className="text-slate-700">unverified</strong>.
                                Confirm your email before you can sign in.
                              </span>
                            </div>
                            <button
                              type="submit"
                              // disabled={isSubmitting}
                              className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isSubmitting ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4" />
                                  <span>Sign up</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>

                      <p className="mt-14 text-sm text-slate-400">
                        Already have an account?{" "}
                        <button className="text-slate-900 underline underline-offset-2">
                          Sign in
                        </button>
                      </p>
                    </div>
                  </div>

                </>
              )}

              {/* TAB 3: VERIFY EMAIL */}
              {/* {authMode === 'verify' && (
              <>
                <div className="mb-5">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Verify Your Email
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    Enter your email and verification token to activate your account.
                  </p>
                </div>

                {demoVerificationInfo && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 mb-4 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Demo Verification Ready
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-200">
                      Token auto-populated below for instant hackathon verification.
                    </p>
                  </div>
                )}

                <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Account Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3.5 my-auto" />
                      <input
                        type="email"
                        required
                        value={verifyEmailInput}
                        onChange={(e) => setVerifyEmailInput(e.target.value)}
                        placeholder="e.g. vikram@dayflow.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Verification Token
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3.5 my-auto" />
                      <input
                        type="text"
                        required
                        value={verifyTokenInput}
                        onChange={(e) => setVerifyTokenInput(e.target.value)}
                        placeholder="Enter verification token"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <BadgeCheck className="w-4 h-4" />
                        <span>Verify & Activate Account</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )} */}
            </div>
          </div>
          {/* Right Column: 1-Click Demo Accounts for Hackathon Judges */}
          {/* <div className="w-full lg:w-100 shrink-0 flex gap-3"> */}
          {/* <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/40">
              <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                Hackathon Demo Quick Switcher
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Click any profile card below to sign in instantly with verified Indian demo accounts.
              </p>
            </div> */}

          {/* HR Admin Card - Priya Iyer */}
          {/* <button
              type="button"
              onClick={() => handleQuickDemo('admin@dayflow.com', 'admin123')}
              className="w-1/2 aspect-square p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-sm"
            >
              <img
                src={demoAvatars.priya}
                alt="Priya Iyer"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />

              <div className="flex flex-col items-center gap-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  Priya Iyer
                </h4>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                  HR Admin
                </span>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  HR Manager • Bengaluru
                </p>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-y-1 transition-all mt-1" />
            </button> */}

          {/* Employee 1 - Ananya Sharma (Engineering) */}
          {/* <button
              type="button"
              onClick={() => handleQuickDemo('admin@dayflow.com', 'admin123')}
              className="w-1/2 aspect-square p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-sm"
            >
              <img
                src={demoAvatars.ananya}
                alt="Ananya Sharma"
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />

              <div className="flex flex-col items-center gap-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  Ananya Sharma
                </h4>

                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                  Employee
                </span>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Senior Fullstack Dev • Bengaluru
                </p>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-y-1 transition-all mt-1" />
            </button> */}

          {/* Employee 2 - Rohan Nair (UI/UX Design) */}
          {/* <button
              type="button"
              onClick={() => handleQuickDemo('admin@dayflow.com', 'admin123')}
              className="w-1/2 aspect-square p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-sm"
            >
              <img
                src={demoAvatars.rohan}
                alt="Rohan Nair"
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />

              <div className="flex flex-col items-center gap-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  Rohan Nair
                </h4>

                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                  Employee
                </span>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Lead UI/UX Designer • Bengaluru
                </p>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-y-1 transition-all mt-1" />
            </button> */}

          {/* Employee 3 - Arjun Menon (Marketing) */}
          {/* <button
              type="button"
              onClick={() => handleQuickDemo('marcus@dayflow.com', 'employee123')}
              className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 transition-all group flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={demoAvatars.arjun}
                  alt="Arjun Menon"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                      Arjun Menon
                    </h4>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                      Marketing
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Marketing Director • Mumbai</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
            </button> */}
          {/* </div> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs text-brand-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-900 bg-[#fff] dark:bg-slate-950/60">
        A smarter way to manage people, processes, and workplace operations.
      </footer>
    </div>
  );
};

export default LoginPage;
