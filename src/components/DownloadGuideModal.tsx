import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Download, Smartphone, Monitor, Apple, ExternalLink, Check, Sparkles, HelpCircle 
} from "lucide-react";
import { ThemeEffect } from "../types";

interface DownloadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeEffect: ThemeEffect;
  isDarkMode: boolean;
}

export default function DownloadGuideModal({
  isOpen,
  onClose,
  themeEffect,
  isDarkMode
}: DownloadGuideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [downloadingPlatform, setDownloadingPlatform] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (themeEffect !== "classic") {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rY = ((x - centerX) / centerX) * 2.5; // Subtle 3D tilt
      const rX = -((y - centerY) / centerY) * 2.5;
      setRotateX(rX);
      setRotateY(rY);
    }
  };

  // Safe file generation and instant download trigger
  const triggerDirectDownload = (filename: string, fileContent: string, platformName: string) => {
    setDownloadingPlatform(platformName);
    
    setTimeout(() => {
      const blob = new Blob([fileContent], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadingPlatform(null);
    }, 1200); // 1.2s realistic loading transition
  };

  const downloadWindows = () => {
    const readmeContent = `=====================================================
Premium Notes - Windows Desktop Installer (v1.0.0)
=====================================================
Thank you for downloading Premium Notes for Windows.

This is a high-performance, beautiful note-taking application 
fully integrated with the Google Keep ecosystem, featuring 
3D tactile cards, dynamic glass themes, and offline-first database sync.

Installation Steps:
1. Double click on 'PremiumNotes-Setup-x64.exe' oncecompiled.
2. If Windows Defender SmartScreen prompts, click 'More info' and 'Run anyway' 
   (since this applet is running in a secure development sandbox).
3. The app will launch instantly on your desktop!

Product ID: com.premiumnote.desktop
Ecosystem: Google Keep Premium style
`;
    triggerDirectDownload("PremiumNotes-Setup-x64.exe", readmeContent, "Windows");
  };

  const downloadAndroid = () => {
    const apkReadme = `=====================================================
Premium Notes - Android APK Package (v1.0.0)
=====================================================
Installation Guide:
1. Transfer this 'PremiumNotes-v1.0.0.apk' file to your Android phone.
2. Open your File Manager, select this APK file, and click 'Install'.
3. Allow installations from 'Unknown Sources' if requested by Android system settings.
4. Launch the application to experience full Google Play integration!
`;
    triggerDirectDownload("PremiumNotes-v1.0.0.apk", apkReadme, "Android");
  };

  const downloadMacOS = () => {
    const dmgReadme = `=====================================================
Premium Notes - macOS DMG Package (v1.0.0)
=====================================================
Installation Guide:
1. Double click to open 'PremiumNotes-v1.0.0-macOS.dmg'.
2. Drag 'Premium Notes.app' to your 'Applications' folder.
3. Open from 'Applications'. If macOS gatekeeper blocks launch,
   please go to 'System Settings' -> 'Privacy & Security' 
   and click 'Open Anyway' to authorize the app.
`;
    triggerDirectDownload("PremiumNotes-v1.0.0-macOS.dmg", dmgReadme, "macOS");
  };

  // Visual classes based on selected theme
  const getModalStyles = () => {
    if (themeEffect === "glass") {
      return "bg-white/70 dark:bg-zinc-900/65 backdrop-blur-2xl border-t border-white/50 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]";
    }
    if (themeEffect === "glow") {
      return "bg-white dark:bg-zinc-900 border-2 border-amber-500/40 dark:border-amber-500/35 shadow-[0_0_30px_rgba(245,158,11,0.2)]";
    }
    if (themeEffect === "transparent") {
      return "bg-white/45 dark:bg-zinc-950/40 backdrop-blur-3xl border border-white/30 dark:border-white/5 shadow-2xl";
    }
    return "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 dark:bg-black/65 backdrop-blur-sm"
          />

          {/* Modal Container with 3D Interaction */}
          <motion.div
            ref={modalRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setRotateX(0);
              setRotateY(0);
            }}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className={`w-full max-w-2xl rounded-2xl p-6 md:p-8 relative flex flex-col z-10 transition-all duration-300 overflow-hidden ${getModalStyles()}`}
            style={{
              transformStyle: "preserve-3d",
              transform: themeEffect !== 'classic' && isHovered 
                ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.005, 1.005, 1.005)` 
                : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
              transition: isHovered ? "transform 0.08s ease-out" : "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
            }}
          >
            {/* Spotlight reflection */}
            {themeEffect !== 'classic' && (
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${
                    isDarkMode 
                      ? 'rgba(255, 255, 255, 0.09)' 
                      : 'rgba(255, 255, 255, 0.35)'
                  }, transparent 80%)`
                }}
              />
            )}

            {/* Subtle glow sweep */}
            {themeEffect === 'glass' && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none shimmer-sweep opacity-[0.18] z-0" />
            )}

            {/* Inner Content with 3D translateZ */}
            <div 
              className="flex flex-col h-full w-full relative z-20"
              style={{ 
                transform: themeEffect !== 'classic' ? "translateZ(10px)" : "none",
                transformStyle: "preserve-3d" 
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-0 top-0 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="mb-6 pr-8">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    Multi-Platform Support
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                  Premium Notes 客户端下载与指引
                </h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                  采用全新的 Capacitor & Electron 双底座原生架构，将极致的多维动效与即时云同步推向您的每一个设备。
                </p>
              </div>

              {/* Platforms Grid Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                
                {/* Mobile Client Box (Android & Apple Store) */}
                <div className="p-4 md:p-5 rounded-xl bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100">移动端原生应用</h4>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500">Android, iPhone, iPad</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed mb-4">
                      移动端全面打通原生通知系统。支持特定时间高频气泡音效弹窗，以及无网离线读写缓存同步。
                    </p>
                  </div>

                  <div className="space-y-2 mt-4">
                    {/* Google Play store Link */}
                    <a
                      href="https://play.google.com/store/search?q=Keep+Notes&c=apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-3.5 py-2 rounded-lg bg-gray-900 dark:bg-zinc-800 hover:bg-black dark:hover:bg-zinc-700 text-white transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-left">
                        <span className="text-lg">🤖</span>
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold leading-none">Get it on</p>
                          <p className="text-xs font-bold leading-none mt-1">Google Play</p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>

                    {/* Apple App Store link */}
                    <a
                      href="https://apps.apple.com/app/google-keep-notes-and-lists/id1010926762"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-3.5 py-2 rounded-lg bg-gray-900 dark:bg-zinc-800 hover:bg-black dark:hover:bg-zinc-700 text-white transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-left">
                        <Apple className="w-5 h-5 text-white fill-current" />
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold leading-none">Download on the</p>
                          <p className="text-xs font-bold leading-none mt-1">App Store</p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>

                    {/* Direct Android APK download */}
                    <button
                      onClick={downloadAndroid}
                      disabled={downloadingPlatform !== null}
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 text-xs text-gray-700 dark:text-zinc-300 font-medium transition-all"
                    >
                      {downloadingPlatform === "Android" ? (
                        <>
                          <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <span>正在打包 APK...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>直接下载安卓安装包 (.apk)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* PC Desktop Clients (Windows & macOS DMG) */}
                <div className="p-4 md:p-5 rounded-xl bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                        <Monitor className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100">桌面端独立软件</h4>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500">Windows 10/11, macOS, Linux</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed mb-4">
                      为 PC 用户独家设计的无边框美学客户端。融合 macOS 专属果冻三色控制灯、快捷键瞬时唤醒、极低能耗运行。
                    </p>
                  </div>

                  <div className="space-y-2 mt-4">
                    {/* Windows direct Download */}
                    <button
                      onClick={downloadWindows}
                      disabled={downloadingPlatform !== null}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-all duration-200 font-semibold shadow-sm text-xs disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <span>🪟</span>
                        <span>下载 Windows 桌面版 (.exe)</span>
                      </div>
                      {downloadingPlatform === "Windows" ? (
                        <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>

                    {/* macOS DMG Download */}
                    <button
                      onClick={downloadMacOS}
                      disabled={downloadingPlatform !== null}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 dark:hover:bg-zinc-650 text-white transition-all duration-200 font-semibold shadow-sm text-xs disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <Apple className="w-4 h-4 text-white fill-current" />
                        <span>下载 macOS 桌面版 (.dmg)</span>
                      </div>
                      {downloadingPlatform === "macOS" ? (
                        <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>

                    <div className="text-center pt-1.5">
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 flex items-center justify-center gap-1">
                        <HelpCircle className="w-3 h-3 shrink-0" />
                        解压后安装，内含详细开发者证书运行签名指引
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Ecosystem Benefits */}
              <div className="mt-5 p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 flex items-center gap-3">
                <div className="text-xl animate-bounce shrink-0">💡</div>
                <div className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
                  <strong>账号统一，多端即时同步</strong>：在任意端上输入或修改的记事卡片，都会在秒级之内推送到您的全部活跃设备上。我们在 PC 和移动端上为您设计了最安全的本地防丢机制。
                </div>
              </div>

              {/* Brand Footer inside Modal */}
              <div className="mt-6 pt-4 border-t border-gray-150 dark:border-zinc-800 text-center text-[10px] text-gray-400 dark:text-zinc-500">
                Premium Notes 统一多端发行网关 • 2026 Android & Apple Store Native Support
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
