import React, { useState, useRef, useEffect } from "react";
import { 
  Menu, Search, Grid, List, Sun, Moon, Bell, RefreshCw, LogOut, Check, X, User, ShieldCheck, Sparkles, Download
} from "lucide-react";
import { AppNotification, ThemeEffect } from "../types";
import { getPanelStyleClasses } from "../themeUtils";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  notifications: AppNotification[];
  setNotifications: (notifs: AppNotification[]) => void;
  currentUser: any;
  handleLogout: () => void;
  onUpdateProfile?: (photoURL: string, displayName: string) => void;
  isSyncing: boolean;
  toggleSidebar: () => void;
  onSelectNote: (noteId: string) => void;
  themeEffect: ThemeEffect;
  setThemeEffect: (effect: ThemeEffect) => void;
  onOpenDownloadGuide?: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  isGridView,
  setIsGridView,
  isDarkMode,
  setIsDarkMode,
  notifications,
  setNotifications,
  currentUser,
  handleLogout,
  onUpdateProfile,
  isSyncing,
  toggleSidebar,
  onSelectNote,
  themeEffect,
  setThemeEffect,
  onOpenDownloadGuide
}: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showThemeDrop, setShowThemeDrop] = useState(false);
  
  // Custom Avatar & Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const themeDropRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const PRESET_AVATARS = [
    { emoji: "🦊", from: "#f97316", to: "#fbbf24", label: "灵狐" },
    { emoji: "🚀", from: "#6366f1", to: "#a855f7", label: "火箭" },
    { emoji: "💡", from: "#eab308", to: "#f59e0b", label: "灵感" },
    { emoji: "👾", from: "#8b5cf6", to: "#ec4899", label: "极客" },
    { emoji: "🍀", from: "#34d399", to: "#059669", label: "幸运" },
    { emoji: "💖", from: "#f43f5e", to: "#ec4899", label: "甜心" },
    { emoji: "⚡", from: "#22d3ee", to: "#3b82f6", label: "极速" },
    { emoji: "🐼", from: "#64748b", to: "#3f3f46", label: "国宝" },
  ];

  const getPresetAvatarUrl = (gradientFrom: string, gradientTo: string, emoji: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradientFrom}" />
          <stop offset="100%" stop-color="${gradientTo}" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#g)" />
      <text x="50" y="65" font-size="52" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`;
    const base64Svg = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64Svg}`;
  };

  const startEditing = () => {
    setEditName(currentUser?.displayName || "");
    setEditAvatar(currentUser?.photoURL || "");
    setIsEditingProfile(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("图片大小不能超过 1.5MB 噢");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          setEditAvatar(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      alert("昵称不能为空哦");
      return;
    }
    if (onUpdateProfile) {
      onUpdateProfile(editAvatar, editName.trim());
    }
    setIsEditingProfile(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
        setIsEditingProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (themeDropRef.current && !themeDropRef.current.contains(event.target as Node)) {
        setShowThemeDrop(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, isRead: true }))
    );
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <header className={`sticky top-0 z-40 flex items-center justify-between px-4 py-2 border-b transition-all duration-300 h-16 ${getPanelStyleClasses(themeEffect, isDarkMode)}`}>
      {/* Left side: Menu & Logo */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none"
          title="主菜单"
          id="menu-toggle-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 select-none">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden shadow-md bg-white/20 dark:bg-zinc-900/60 border border-white/40 dark:border-white/15 backdrop-blur-md shrink-0">
            {/* Ambient cold ice-blue and cyan backing glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-sky-500/15 to-indigo-500/30 opacity-75 dark:opacity-45 blur-xs rounded-lg" />
            
            {/* Specular glare line */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-90" />
            
            {/* Stylized Upper Case X with a hollowed-out (stencil) 3D glassmorphic effect with dual high-contrast drop shadow */}
            <svg viewBox="0 0 100 100" className="w-5 h-5 relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.55)] drop-shadow-[0_0_2px_rgba(34,211,238,0.5)]">
              <defs>
                {/* Cold icy-blue/cyan refractive gradient with high opacity for maximum clarity */}
                <linearGradient id="coolGlassOutlineHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1.0" />
                  <stop offset="25%" stopColor="#22d3ee" stopOpacity="0.95" />   {/* Sharp cyan edge */}
                  <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.85" />  {/* Radiant crystal blue */}
                  <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.95" />   {/* Clear sky blue */}
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="1.0" /> {/* Sapphire base */}
                </linearGradient>
                
                {/* Icy glowing highlight thread */}
                <linearGradient id="iceInnerHighlightHeader" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1.0" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.95" /> {/* Vivid cyan flash */}
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>

                <filter id="glassBlurFilterHeader" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.0" />
                </filter>
              </defs>

              {/* Subsurface frost glow (subtle to prevent blurring lines) */}
              <path 
                d="M 22,12 L 38,12 L 50,32 L 62,12 L 78,12 L 59,48 L 78,84 L 62,84 L 50,64 L 38,84 L 22,84 L 41,48 Z" 
                fill="none"
                stroke="rgba(34, 211, 238, 0.4)"
                strokeWidth="4"
                filter="url(#glassBlurFilterHeader)"
              />

              {/* Real hollowed-out glass body using evenodd rule with thicker glass ribbon */}
              <path 
                d="M 22,12 L 38,12 L 50,32 L 62,12 L 78,12 L 59,48 L 78,84 L 62,84 L 50,64 L 38,84 L 22,84 L 41,48 Z M 32,22 L 36,22 L 50,43 L 64,22 L 68,22 L 54,48 L 68,74 L 64,74 L 50,53 L 36,74 L 32,74 L 46,48 Z" 
                fill="rgba(255, 255, 255, 0.24)"
                fillRule="evenodd"
                stroke="url(#coolGlassOutlineHeader)"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />

              {/* Inner highlight thread giving 3D refraction glint */}
              <path 
                d="M 32,22 L 36,22 L 50,43 L 64,22 M 32,74 L 46,48 L 32,22" 
                fill="none"
                stroke="url(#iceInnerHighlightHeader)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-[240px] mx-4 md:mx-8">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3.5 text-gray-500 dark:text-zinc-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="搜索您的记事..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-11 pr-10 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-850 focus:shadow-md focus:ring-1 focus:ring-blue-500 border border-transparent focus:border-transparent outline-none transition-all text-sm md:text-base"
            id="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Sync Indicator */}
        <div 
          className={`p-2 rounded-full text-gray-500 dark:text-zinc-400 transition-colors ${isSyncing ? 'animate-spin text-blue-500 dark:text-blue-400' : ''}`}
          title={isSyncing ? "正在云端同步..." : "已与云端同步"}
        >
          <RefreshCw className="w-5 h-5" />
        </div>

        {/* Layout Toggle */}
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none"
          title={isGridView ? "列表视图" : "网格视图"}
          id="layout-toggle-btn"
        >
          {isGridView ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
        </button>

        {/* App Download Guide trigger */}
        {onOpenDownloadGuide && (
          <button
            onClick={onOpenDownloadGuide}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all focus:outline-none relative"
            title="下载多端应用 (安卓/苹果/桌面端)"
            id="header-download-app-btn"
          >
            <Download className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-amber-500" />
          </button>
        )}

        {/* Theme Effect Dropdown */}
        <div className="relative" ref={themeDropRef}>
          <button
            onClick={() => setShowThemeDrop(!showThemeDrop)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all relative focus:outline-none"
            title="选择高级主题特效"
            id="theme-effect-dropdown-btn"
          >
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </button>

          {showThemeDrop && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right">
              <div className="px-3 py-1.5 border-b border-gray-100 dark:border-zinc-700 text-xs font-semibold text-gray-500 dark:text-zinc-400">
                选择视觉特效
              </div>
              
              <button
                onClick={() => {
                  setThemeEffect('classic');
                  setShowThemeDrop(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${themeEffect === 'classic' ? 'text-amber-500 font-medium' : 'text-gray-700 dark:text-zinc-200'}`}
              >
                <span className="flex items-center gap-1.5">🎨 经典高雅 (Classic)</span>
                {themeEffect === 'classic' && <Check className="w-4 h-4 text-amber-500" />}
              </button>

              <button
                onClick={() => {
                  setThemeEffect('glass');
                  setShowThemeDrop(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${themeEffect === 'glass' ? 'text-amber-500 font-medium' : 'text-gray-700 dark:text-zinc-200'}`}
              >
                <span className="flex items-center gap-1.5">🌸 极光毛玻璃 (Glass)</span>
                {themeEffect === 'glass' && <Check className="w-4 h-4 text-amber-500" />}
              </button>

              <button
                onClick={() => {
                  setThemeEffect('glow');
                  setShowThemeDrop(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${themeEffect === 'glow' ? 'text-amber-500 font-medium' : 'text-gray-700 dark:text-zinc-200'}`}
              >
                <span className="flex items-center gap-1.5">⚡ 酷炫霓虹光效 (Glow)</span>
                {themeEffect === 'glow' && <Check className="w-4 h-4 text-amber-500" />}
              </button>

              <button
                onClick={() => {
                  setThemeEffect('transparent');
                  setShowThemeDrop(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${themeEffect === 'transparent' ? 'text-amber-500 font-medium' : 'text-gray-700 dark:text-zinc-200'}`}
              >
                <span className="flex items-center gap-1.5">🔮 极简冰晶透明 (Crystal)</span>
                {themeEffect === 'transparent' && <Check className="w-4 h-4 text-amber-500" />}
              </button>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none"
          title={isDarkMode ? "浅色模式" : "深色模式"}
          id="theme-toggle-btn"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative focus:outline-none"
            title="通知中心"
            id="notification-bell-btn"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-extrabold text-white ring-1 ring-white dark:ring-zinc-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2 text-gray-800 dark:text-zinc-100 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-zinc-700">
                <span className="font-semibold text-sm">提醒与通知</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    全部已读
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-700">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-zinc-400 text-sm">
                    <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    没有新通知
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        if (notif.noteId) onSelectNote(notif.noteId);
                        setShowNotifs(false);
                      }}
                      className={`p-3.5 hover:bg-gray-50 dark:hover:bg-zinc-750 transition-colors flex gap-3 cursor-pointer relative ${!notif.isRead ? 'bg-blue-50/40 dark:bg-blue-950/15' : ''}`}
                    >
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-500 self-start shrink-0" style={{ opacity: notif.isRead ? 0 : 1 }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-xs text-gray-900 dark:text-zinc-100">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-zinc-350 mt-1 line-clamp-2">
                          {notif.content}
                        </p>
                      </div>
                      <button
                        onClick={(e) => clearNotification(notif.id, e)}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 shrink-0 self-center"
                        title="删除此通知"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Card */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
            title="谷歌账号"
            id="profile-avatar-btn"
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-700 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-700 p-4 text-center text-gray-800 dark:text-zinc-100 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right">
              {!isEditingProfile ? (
                <>
                  <div className="text-xs text-gray-500 dark:text-zinc-400 mb-3 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Google 账号绑定成功</span>
                  </div>
                  
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full border-2 border-blue-500 mx-auto mb-3 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                      {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'G'}
                    </div>
                  )}

                  <h3 className="font-semibold text-base text-gray-900 dark:text-zinc-100">
                    {currentUser?.displayName || "Google 用户"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2 truncate">
                    {currentUser?.email || "user@gmail.com"}
                  </p>

                  <div className="flex flex-col gap-2 mb-4">
                    <button
                      onClick={startEditing}
                      className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-semibold flex items-center justify-center gap-1.5 mx-auto bg-amber-500/10 dark:bg-amber-500/5 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      修改头像与昵称
                    </button>
                  </div>

                  <div className="border-t border-gray-100 dark:border-zinc-700 pt-3">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        handleLogout();
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-700 dark:hover:bg-red-950/30 dark:hover:text-red-400 rounded-lg text-sm font-medium transition-all"
                      id="signout-btn"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-3 text-left pl-1">
                    编辑个性空间资料
                  </div>

                  <div className="relative w-16 h-16 mx-auto mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {editAvatar ? (
                      <img 
                        src={editAvatar} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-full border-2 border-amber-500 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl">
                        {editName ? editName.charAt(0).toUpperCase() : 'G'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-semibold">更换</span>
                    </div>
                  </div>

                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="mb-4 text-left">
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-400 mb-1 pl-1">
                      空间昵称
                    </label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={15}
                      placeholder="请输入您的昵称"
                      className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="mb-4 text-left">
                    <div className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-400 mb-2 pl-1 flex items-center justify-between">
                      <span>挑选个性头像</span>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        上传本地图片
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_AVATARS.map((preset, index) => {
                        const presetUrl = getPresetAvatarUrl(preset.from, preset.to, preset.emoji);
                        const isSelected = editAvatar === presetUrl;
                        return (
                          <button
                            key={index}
                            onClick={() => setEditAvatar(presetUrl)}
                            className={`aspect-square rounded-full flex items-center justify-center text-xl transition-all relative border ${
                              isSelected 
                                ? "border-amber-500 ring-2 ring-amber-500/30 scale-110" 
                                : "border-gray-150 dark:border-zinc-750 hover:scale-105"
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`
                            }}
                            title={preset.label}
                          >
                            <span>{preset.emoji}</span>
                            {isSelected && (
                              <div className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-white rounded-full p-0.5 border border-white dark:border-zinc-800">
                                <Check className="w-2 h-2" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 dark:border-zinc-700 pt-3">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-gray-700 dark:text-zinc-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                    >
                      保存设置
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
