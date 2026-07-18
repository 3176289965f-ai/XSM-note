import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  LogIn, Shield, Key, Sparkles, Check, Globe, HelpCircle, CloudLightning, ArrowRight
} from "lucide-react";

interface LoginProps {
  onGoogleLogin: () => void;
  onDemoLogin: (email: string, name: string) => void;
  isLoading: boolean;
  userEmailFromContext?: string;
}

export default function Login({ 
  onGoogleLogin, 
  onDemoLogin, 
  isLoading,
  userEmailFromContext = "user@gmail.com"
}: LoginProps) {
  const [useCustomDemo, setUseCustomDemo] = useState(false);
  const [demoName, setDemoName] = useState(userEmailFromContext.split('@')[0]);
  const [demoEmail, setDemoEmail] = useState(userEmailFromContext);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail.trim() && demoName.trim()) {
      onDemoLogin(demoEmail.trim(), demoName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* Visual background accents */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl p-8 relative overflow-hidden z-10"
      >
        {/* Top Google Colors Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="w-1/4 h-full bg-blue-500" />
          <div className="w-1/4 h-full bg-red-500" />
          <div className="w-1/4 h-full bg-yellow-500" />
          <div className="w-1/4 h-full bg-green-500" />
        </div>

        {/* Logo / Header */}
        <div className="text-center mb-8 mt-2">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden shadow-xl bg-white/20 dark:bg-zinc-900/60 border border-white/40 dark:border-white/15 backdrop-blur-md animate-pulse">
              {/* Ambient cold ice-blue and cyan backing glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-sky-500/15 to-indigo-500/30 opacity-75 dark:opacity-45 blur-xs rounded-2xl" />
              
              {/* Specular glare line */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-90" />
              
              {/* Stylized Upper Case X with a hollowed-out (stencil) 3D glassmorphic effect with dual high-contrast drop shadow */}
              <svg viewBox="0 0 100 100" className="w-12 h-12 relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.55)] drop-shadow-[0_0_2px_rgba(34,211,238,0.5)]">
                <defs>
                  {/* Cold icy-blue/cyan refractive gradient with high opacity for maximum clarity */}
                  <linearGradient id="coolGlassOutlineLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1.0" />
                    <stop offset="25%" stopColor="#22d3ee" stopOpacity="0.95" />   {/* Sharp cyan edge */}
                    <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.85" />  {/* Radiant crystal blue */}
                    <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.95" />   {/* Clear sky blue */}
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="1.0" /> {/* Sapphire base */}
                  </linearGradient>
                  
                  {/* Icy glowing highlight thread */}
                  <linearGradient id="iceInnerHighlightLogin" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1.0" />
                    <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.95" /> {/* Vivid cyan flash */}
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                  </linearGradient>

                  <filter id="glassBlurFilterLogin" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.0" />
                  </filter>
                </defs>

                {/* Subsurface frost glow (subtle to prevent blurring lines) */}
                <path 
                  d="M 22,12 L 38,12 L 50,32 L 62,12 L 78,12 L 59,48 L 78,84 L 62,84 L 50,64 L 38,84 L 22,84 L 41,48 Z" 
                  fill="none"
                  stroke="rgba(34, 211, 238, 0.4)"
                  strokeWidth="4"
                  filter="url(#glassBlurFilterLogin)"
                />

                {/* Real hollowed-out glass body using evenodd rule with thicker glass ribbon */}
                <path 
                  d="M 22,12 L 38,12 L 50,32 L 62,12 L 78,12 L 59,48 L 78,84 L 62,84 L 50,64 L 38,84 L 22,84 L 41,48 Z M 32,22 L 36,22 L 50,43 L 64,22 L 68,22 L 54,48 L 68,74 L 64,74 L 50,53 L 36,74 L 32,74 L 46,48 Z" 
                  fill="rgba(255, 255, 255, 0.24)"
                  fillRule="evenodd"
                  stroke="url(#coolGlassOutlineLogin)"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />

                {/* Inner highlight thread giving 3D refraction glint */}
                <path 
                  d="M 32,22 L 36,22 L 50,43 L 64,22 M 32,74 L 46,48 L 32,22" 
                  fill="none"
                  stroke="url(#iceInnerHighlightLogin)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            全端美学记事本 · 秒级云端同步
          </p>
        </div>

        {/* Interactive login modes */}
        {!useCustomDemo ? (
          <div className="space-y-4">
            {/* Real Google Account SignIn Button */}
            <button
              onClick={onGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-gray-50 dark:bg-zinc-850 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-zinc-200 font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
              id="google-signin-btn"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLoading ? "正在连接谷歌..." : "使用 Google 账号登录"}
            </button>

            {/* Sandbox Iframe Bypass button */}
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-100 dark:border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 dark:text-zinc-500 uppercase font-medium">或者</span>
              <div className="flex-grow border-t border-gray-100 dark:border-zinc-800"></div>
            </div>

            {/* Sandbox Quick Access Button */}
            <button
              onClick={() => {
                // If context provided an email, use it. Else toggle custom panel
                if (userEmailFromContext) {
                  onDemoLogin(userEmailFromContext, userEmailFromContext.split('@')[0]);
                } else {
                  setUseCustomDemo(true);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99]"
              id="sandbox-signin-btn"
            >
              <Sparkles className="w-4 h-4" />
              <span>开发者沙盒一键接入 (免Cookie阻挡)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setUseCustomDemo(true)}
              className="w-full text-center text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
            >
              自定义演示账号登录
            </button>
          </div>
        ) : (
          /* Custom Demo Login Panel */
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-1">
                  显示名称
                </label>
                <input
                  type="text"
                  required
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="例如: Google User"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-1">
                  邮箱地址
                </label>
                <input
                  type="email"
                  required
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="例如: user@gmail.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white font-semibold rounded-xl text-sm transition-all"
            >
              开始体验
            </button>

            <button
              type="button"
              onClick={() => setUseCustomDemo(false)}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              返回标准登录
            </button>
          </form>
        )}

        {/* Features highlight */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-2 gap-4 text-left">
          <div className="flex items-start gap-2 text-xs">
            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-zinc-200">多彩卡片体系</p>
              <p className="text-gray-500 dark:text-zinc-400 text-[10px]">应用谷歌原生配色设计</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-zinc-200">提醒与通知中心</p>
              <p className="text-gray-500 dark:text-zinc-400 text-[10px]">支持多重桌面气泡推送</p>
            </div>
          </div>
        </div>

        {/* Security / Iframe message */}
        <p className="mt-6 text-center text-[10px] text-gray-400 dark:text-zinc-500 leading-normal">
          提示：沙盒模式无需真实授权，完美适配 iframe 环境，能完整存储、读取、分类并启动推送。
        </p>
      </motion.div>
    </div>
  );
}
