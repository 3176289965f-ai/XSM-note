import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { 
  Lightbulb, Bell, Archive, Trash2, Tag, Loader2, Sparkles, CloudOff, Info, X
} from "lucide-react";

import { auth, db, googleProvider } from "./firebase";
import { Note, AppNotification, SidebarTab, ThemeEffect } from "./types";
import { GOOGLE_COLORS, DEFAULT_TAGS } from "./constants";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AddNoteForm from "./components/AddNoteForm";
import NoteCard from "./components/NoteCard";
import NoteModal from "./components/NoteModal";
import Login from "./components/Login";
import NotificationManager from "./components/NotificationManager";
import DownloadGuideModal from "./components/DownloadGuideModal";

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // App UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<SidebarTab>("notes");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showDownloadGuide, setShowDownloadGuide] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeEffect, setThemeEffect] = useState<ThemeEffect>("classic");
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Read dark mode, layout preference, and theme effects on startup
  useEffect(() => {
    const localDark = localStorage.getItem("keep_dark_mode") === "true";
    setIsDarkMode(localDark);
    if (localDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const localGrid = localStorage.getItem("keep_layout_grid") !== "false";
    setIsGridView(localGrid);

    const localEffect = (localStorage.getItem("keep_theme_effect") || "classic") as ThemeEffect;
    setThemeEffect(localEffect);
  }, []);

  // Global scrollbar active indicator (Only show scrollbar on active scroll/drag)
  useEffect(() => {
    let scrollTimeout: any = null;
    
    const handleScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Update dark mode class on change
  const toggleDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
    localStorage.setItem("keep_dark_mode", String(dark));
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Update layout on change
  const toggleLayout = (grid: boolean) => {
    setIsGridView(grid);
    localStorage.setItem("keep_layout_grid", String(grid));
  };

  // Update theme effect on change
  const changeThemeEffect = (effect: ThemeEffect) => {
    setThemeEffect(effect);
    localStorage.setItem("keep_theme_effect", effect);
  };

  // Auth Subscription
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const customAvatar = localStorage.getItem(`custom_avatar_${user.uid}`);
        const customName = localStorage.getItem(`custom_name_${user.uid}`);
        setCurrentUser({
          uid: user.uid,
          displayName: customName || user.displayName || user.email?.split("@")[0] || "Google User",
          email: user.email,
          photoURL: customAvatar || user.photoURL,
          isDemo: false
        });
      } else {
        // Check for persistent demo session
        const demoUser = localStorage.getItem("keep_demo_user");
        if (demoUser) {
          const parsed = JSON.parse(demoUser);
          const customAvatar = localStorage.getItem(`custom_avatar_${parsed.uid}`);
          const customName = localStorage.getItem(`custom_name_${parsed.uid}`);
          if (customAvatar) parsed.photoURL = customAvatar;
          if (customName) parsed.displayName = customName;
          setCurrentUser(parsed);
        } else {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Notes & Tags in Real-Time
  useEffect(() => {
    if (!currentUser) {
      setNotes([]);
      setTags(DEFAULT_TAGS);
      setNotifications([]);
      return;
    }

    // Load custom notifications from LocalStorage
    const localNotifs = localStorage.getItem(`notifications_${currentUser.uid}`);
    if (localNotifs) {
      setNotifications(JSON.parse(localNotifs));
    } else {
      setNotifications([]);
    }

    setIsSyncing(true);

    if (currentUser.isDemo) {
      // Demo Mode: Pull notes and tags from LocalStorage only (instant and works in any sandboxed sandbox)
      const demoNotes = localStorage.getItem(`notes_${currentUser.uid}`);
      if (demoNotes) {
        setNotes(JSON.parse(demoNotes));
      } else {
        // Seed default notes for a beautiful first-time experience
        const defaultNotes: Note[] = [
          {
            id: "demo-welcome",
            userId: currentUser.uid,
            title: "欢迎使用 Google Keep 记事本 💡",
            content: "这是一个仿谷歌 Keep 颜色生态的轻量级云同步记事本。\n\n• 点击下方选项来更改卡片背景颜色。\n• 点击标签分类您的想法。\n• 设置时间提醒，在特定时刻接收气泡消息！",
            color: "yellow",
            isPinned: true,
            isArchived: false,
            isDeleted: false,
            tags: ["个人"],
            reminderTime: null,
            reminderTriggered: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
          {
            id: "demo-reminder",
            userId: currentUser.uid,
            title: "⏰ 体验通知气泡与声音",
            content: "我们在卡片底部的导航工具栏中添加了提醒我功能。\n\n当提醒时间截止时，系统将会：\n1. 播放谷歌风的电子合成音效\n2. 右下角弹出定制动画卡片\n3. 触发网页系统通知（需授权）\n4. 同步至顶部通知历史中心",
            color: "blue",
            isPinned: false,
            isArchived: false,
            isDeleted: false,
            tags: ["工作", "重要"],
            reminderTime: new Date(Date.now() + 15000).toISOString(), // 15 seconds from now
            reminderTriggered: false,
            createdAt: Date.now() - 1000,
            updatedAt: Date.now() - 1000
          }
        ];
        setNotes(defaultNotes);
        localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(defaultNotes));
      }

      const demoTags = localStorage.getItem(`tags_${currentUser.uid}`);
      if (demoTags) {
        setTags(JSON.parse(demoTags));
      } else {
        setTags(DEFAULT_TAGS);
      }
      
      setIsSyncing(false);
      return;
    }

    // Real Firebase Mode
    let unsubscribeNotes = () => {};
    let unsubscribeTags = () => {};

    try {
      const notesRef = collection(db, "notes");
      const q = query(notesRef, where("userId", "==", currentUser.uid));
      
      unsubscribeNotes = onSnapshot(q, (snapshot) => {
        const fetchedNotes: Note[] = [];
        snapshot.forEach((doc) => {
          fetchedNotes.push({ id: doc.id, ...doc.data() } as Note);
        });
        
        // Sort: updated descending
        fetchedNotes.sort((a, b) => b.updatedAt - a.updatedAt);
        setNotes(fetchedNotes);
        // Sync cache to local storage in case they lose internet
        localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(fetchedNotes));
        setIsSyncing(false);
      }, (err) => {
        console.warn("Firestore listener warning (falling back to offline caching):", err);
        // Insufficient permissions or Firebase error fallback
        const cached = localStorage.getItem(`notes_${currentUser.uid}`);
        if (cached) {
          setNotes(JSON.parse(cached));
        }
        setIsSyncing(false);
      });

      // Tags Live Sync
      const tagsRef = collection(db, "tags");
      const tq = query(tagsRef, where("userId", "==", currentUser.uid));
      unsubscribeTags = onSnapshot(tq, (snapshot) => {
        const fetchedTags: string[] = [];
        snapshot.forEach(doc => {
          fetchedTags.push(doc.data().name);
        });
        if (fetchedTags.length > 0) {
          setTags([...new Set([...DEFAULT_TAGS, ...fetchedTags])]);
        } else {
          setTags(DEFAULT_TAGS);
        }
      }, (err) => {
        console.warn("Firestore tags listener fallback:", err);
      });

    } catch (err) {
      console.error("Firebase connection error:", err);
      setIsSyncing(false);
    }

    return () => {
      unsubscribeNotes();
      unsubscribeTags();
    };
  }, [currentUser]);

  // Persist notifications locally
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`notifications_${currentUser.uid}`, JSON.stringify(notifications));
    }
  }, [notifications, currentUser]);

  // Handle Google OAuth Sign-In
  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setErrorMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google popup error:", err);
      setErrorMessage(
        "由于沙盒浏览器 iframe 限制，第三方 Cookie 可能会阻挡 Google 授权登录。推荐您点击一键接入进行极速体验！"
      );
      setAuthLoading(false);
    }
  };

  // Handle Sandbox/Demo Quick Access Sign-In
  const handleDemoLogin = (email: string, name: string) => {
    setAuthLoading(true);
    const demoUser = {
      uid: `demo_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      displayName: name,
      email: email,
      photoURL: null,
      isDemo: true
    };
    localStorage.setItem("keep_demo_user", JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setAuthLoading(false);
  };

  // Handle Logout
  const handleLogout = async () => {
    setAuthLoading(true);
    if (currentUser?.isDemo) {
      localStorage.removeItem("keep_demo_user");
      setCurrentUser(null);
      setAuthLoading(false);
    } else {
      try {
        await signOut(auth);
        setCurrentUser(null);
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        setAuthLoading(false);
      }
    }
  };

  // Handle Profile Update (Custom Avatar & Name)
  const handleUpdateProfile = (photoURL: string, displayName: string) => {
    if (!currentUser) return;
    
    // Save to local storage for persistence across reloads
    localStorage.setItem(`custom_avatar_${currentUser.uid}`, photoURL);
    localStorage.setItem(`custom_name_${currentUser.uid}`, displayName);
    
    // Sync to demo user config if active
    if (currentUser.isDemo) {
      const demoUser = localStorage.getItem("keep_demo_user");
      if (demoUser) {
        const parsed = JSON.parse(demoUser);
        parsed.photoURL = photoURL;
        parsed.displayName = displayName;
        localStorage.setItem("keep_demo_user", JSON.stringify(parsed));
      }
    }
    
    // Set state
    setCurrentUser((prev: any) => prev ? {
      ...prev,
      photoURL: photoURL,
      displayName: displayName
    } : null);
  };

  // Create Note
  const handleAddNote = async (noteData: Partial<Note>) => {
    if (!currentUser) return;

    const newNoteObj: Omit<Note, 'id'> = {
      userId: currentUser.uid,
      title: noteData.title || "",
      content: noteData.content || "",
      color: noteData.color || "default",
      isPinned: noteData.isPinned || false,
      isArchived: false,
      isDeleted: false,
      tags: noteData.tags || [],
      reminderTime: noteData.reminderTime || null,
      reminderTriggered: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setIsSyncing(true);

    if (currentUser.isDemo) {
      const generatedId = `local_${Math.random().toString(36).substr(2, 9)}`;
      const completedNote = { id: generatedId, ...newNoteObj } as Note;
      const updatedNotes = [completedNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
      setIsSyncing(false);
      return;
    }

    try {
      await addDoc(collection(db, "notes"), newNoteObj);
    } catch (err) {
      console.error("Firestore add doc error, caching locally:", err);
      // Fallback
      const generatedId = `local_${Math.random().toString(36).substr(2, 9)}`;
      const completedNote = { id: generatedId, ...newNoteObj } as Note;
      const updatedNotes = [completedNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
    } finally {
      setIsSyncing(false);
    }
  };

  // Update Note
  const handleUpdateNote = async (noteId: string, updates: Partial<Note>) => {
    if (!currentUser) return;

    setIsSyncing(true);

    if (currentUser.isDemo || noteId.startsWith("local_") || !noteId) {
      const updatedNotes = notes.map(n => n.id === noteId ? { ...n, ...updates, updatedAt: Date.now() } : n);
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
      setIsSyncing(false);
      return;
    }

    try {
      await updateDoc(doc(db, "notes", noteId), { ...updates, updatedAt: Date.now() });
    } catch (err) {
      console.error("Firestore update error, caching locally:", err);
      const updatedNotes = notes.map(n => n.id === noteId ? { ...n, ...updates, updatedAt: Date.now() } : n);
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
    } finally {
      setIsSyncing(false);
    }
  };

  // Permanent Delete Note
  const handleDeleteNote = async (noteId: string) => {
    if (!currentUser) return;

    setIsSyncing(true);

    if (currentUser.isDemo || noteId.startsWith("local_") || !noteId) {
      const updatedNotes = notes.filter(n => n.id !== noteId);
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
      setIsSyncing(false);
      return;
    }

    try {
      await deleteDoc(doc(db, "notes", noteId));
    } catch (err) {
      console.error("Firestore delete error, caching locally:", err);
      const updatedNotes = notes.filter(n => n.id !== noteId);
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
    } finally {
      setIsSyncing(false);
    }
  };

  // Add tag globally
  const handleAddTag = async (tagName: string) => {
    if (!currentUser || !tagName.trim()) return;

    const trimmed = tagName.trim();
    if (tags.includes(trimmed)) return;

    const nextTags = [...tags, trimmed];
    setTags(nextTags);

    if (currentUser.isDemo) {
      localStorage.setItem(`tags_${currentUser.uid}`, JSON.stringify(nextTags));
      return;
    }

    try {
      await addDoc(collection(db, "tags"), { name: trimmed, userId: currentUser.uid });
    } catch (err) {
      console.warn("Firestore save tag warning, saved in session:", err);
      localStorage.setItem(`tags_${currentUser.uid}`, JSON.stringify(nextTags));
    }
  };

  // Delete Tag globally
  const handleDeleteTag = (tagName: string) => {
    const nextTags = tags.filter(t => t !== tagName);
    setTags(nextTags);
    if (currentUser) {
      localStorage.setItem(`tags_${currentUser.uid}`, JSON.stringify(nextTags));
    }
  };

  // Triggered Reminder Handler
  const handleTriggerReminder = (noteId: string, title: string, content: string) => {
    // 1. Mark as triggered
    handleUpdateNote(noteId, { reminderTriggered: true });

    // 2. Add to active notification center list
    const newNotif: AppNotification = {
      id: Math.random().toString(),
      noteId,
      title: `⏰ 提醒：${title}`,
      content: content,
      timestamp: Date.now(),
      isRead: false,
      type: "reminder"
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Filter notes depending on current tab
  const getTabFilteredNotes = () => {
    switch (currentTab) {
      case "notes":
        // Filter out deleted and archived notes
        return notes.filter(n => !n.isDeleted && !n.isArchived);
      case "reminders":
        // Filter out deleted, archived, and notes without reminders
        return notes.filter(n => !n.isDeleted && !n.isArchived && n.reminderTime);
      case "archive":
        // Filter out deleted, return archived notes
        return notes.filter(n => !n.isDeleted && n.isArchived);
      case "trash":
        // Return deleted notes
        return notes.filter(n => n.isDeleted);
      case "tag":
        // Filter by selected tag
        return notes.filter(n => !n.isDeleted && !n.isArchived && n.tags.includes(selectedTag || ""));
      default:
        return notes;
    }
  };

  // Further filter notes based on search query
  const getSearchFilteredNotes = (tabNotes: Note[]) => {
    if (!searchQuery.trim()) return tabNotes;
    
    const queryLower = searchQuery.toLowerCase().trim();
    return tabNotes.filter(n => 
      n.title.toLowerCase().includes(queryLower) ||
      n.content.toLowerCase().includes(queryLower) ||
      n.tags.some(t => t.toLowerCase().includes(queryLower))
    );
  };

  const filteredNotes = getSearchFilteredNotes(getTabFilteredNotes());

  // Split into Pinned vs Others for primary note screen
  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  // Dynamic Empty State rendering details
  const getEmptyStateDetails = () => {
    if (searchQuery) {
      return {
        icon: Lightbulb,
        title: "未找到匹配的记事",
        subtitle: "尝试修改您的搜索关键字或标签筛选"
      };
    }

    switch (currentTab) {
      case "notes":
        return {
          icon: Lightbulb,
          title: "记录一切，灵感不期而遇",
          subtitle: "在此处点击输入栏开始新建第一条记事卡片"
        };
      case "reminders":
        return {
          icon: Bell,
          title: "提醒事项为空",
          subtitle: "在此处显示有提醒时间的记事卡片"
        };
      case "archive":
        return {
          icon: Archive,
          title: "没有归档记事",
          subtitle: "归档的记事卡片会在此处显示，让空间保持清爽"
        };
      case "trash":
        return {
          icon: Trash2,
          title: "回收站为空",
          subtitle: "被删除的记事卡片会在回收站中保留，支持随时一键还原"
        };
      case "tag":
        return {
          icon: Tag,
          title: `标签 “${selectedTag}” 下没有记事`,
          subtitle: "去主页面给您的记事打上此标签吧"
        };
      default:
        return {
          icon: Lightbulb,
          title: "记事列表为空",
          subtitle: ""
        };
    }
  };

  const emptyState = getEmptyStateDetails();
  const EmptyIcon = emptyState.icon;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-3" />
        <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
          正在加载 Google 记事空间...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        {errorMessage && (
          <div className="bg-amber-500 text-white px-4 py-3 text-center text-xs font-semibold flex items-center justify-center gap-2 relative z-50">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)}
              className="absolute right-4 p-1 hover:bg-black/10 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <Login 
          onGoogleLogin={handleGoogleLogin} 
          onDemoLogin={handleDemoLogin} 
          isLoading={authLoading}
          userEmailFromContext="3176289965f@gmail.com"
        />
      </>
    );
  }

  // Dynamic background style based on theme effect
  const appBgClass = themeEffect === "classic"
    ? "bg-white dark:bg-zinc-900"
    : "bg-slate-50/50 dark:bg-zinc-950/70 overflow-x-hidden";

  return (
    <div className={`min-h-screen ${appBgClass} text-gray-900 dark:text-zinc-100 flex flex-col transition-all duration-300 relative z-0`}>
      
      {/* Floating Animated Aurora Blobs for Glass & Translucent effects */}
      {themeEffect !== 'classic' && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Blue glass blob */}
          <div className="absolute top-[5%] left-[5%] w-[45vw] h-[45vw] md:w-[35vw] md:h-[35vw] rounded-full bg-sky-300/25 dark:bg-sky-500/15 blur-[100px] md:blur-[130px] animate-float-1" />
          {/* Pink/purple glass blob */}
          <div className="absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] md:w-[35vw] md:h-[35vw] rounded-full bg-pink-300/20 dark:bg-purple-500/15 blur-[100px] md:blur-[140px] animate-float-2" />
          {/* Emerald/amber glass blob */}
          <div className="absolute top-[40%] left-[35%] w-[35vw] h-[35vw] rounded-full bg-emerald-200/20 dark:bg-emerald-500/10 blur-[90px] md:blur-[120px] animate-float-3" />
        </div>
      )}
      
      {/* Background checker / notification audio loop */}
      <NotificationManager 
        notes={notes}
        onTriggerReminder={handleTriggerReminder}
        notifications={notifications}
      />

      {/* Top Header */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isGridView={isGridView}
        setIsGridView={toggleLayout}
        isDarkMode={isDarkMode}
        setIsDarkMode={toggleDarkMode}
        notifications={notifications}
        setNotifications={setNotifications}
        currentUser={currentUser}
        handleLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
        isSyncing={isSyncing}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectNote={(noteId) => {
          const selected = notes.find(n => n.id === noteId);
          if (selected) setEditingNote(selected);
        }}
        themeEffect={themeEffect}
        setThemeEffect={changeThemeEffect}
        onOpenDownloadGuide={() => setShowDownloadGuide(true)}
      />

      {/* Main viewport */}
      <div className="flex flex-1 relative">
        
        {/* Navigation Sidebar */}
        <Sidebar 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          tags={tags}
          handleAddTag={handleAddTag}
          handleDeleteTag={handleDeleteTag}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          themeEffect={themeEffect}
          isDarkMode={isDarkMode}
          onOpenDownloadGuide={() => setShowDownloadGuide(true)}
        />

        {/* Notes Grid Panel */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          
          {/* Note Input Form - only show on notes or reminders tab */}
          {(currentTab === "notes" || currentTab === "reminders") && !searchQuery && (
            <AddNoteForm 
              onAddNote={handleAddNote} 
              tags={tags} 
              themeEffect={themeEffect}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Fallback Indicator for Offline syncing/Demo mode */}
          {currentUser.isDemo && (
            <div className="max-w-xl mx-auto mb-6 px-4">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 p-3 rounded-xl text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>您当前处于<strong>沙盒调试状态</strong>。记事和设置会自动持久化于您的浏览器。</span>
                </div>
              </div>
            </div>
          )}

          {/* Render Cards Grid */}
          <div className="max-w-7xl mx-auto mt-4">
            
            {filteredNotes.length === 0 ? (
              /* Empty state placeholder */
              <div className="flex flex-col items-center justify-center py-20 text-center select-none animate-in fade-in duration-300">
                <div className="p-5 bg-gray-50 dark:bg-zinc-800/40 rounded-full text-gray-400 dark:text-zinc-600 mb-4 border border-dashed border-gray-200 dark:border-zinc-700">
                  <EmptyIcon className="w-12 h-12 opacity-80" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 dark:text-zinc-300 leading-snug">
                  {emptyState.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5 max-w-sm">
                  {emptyState.subtitle}
                </p>
              </div>
            ) : (
              /* Notes available list */
              <div className="space-y-6">
                
                {/* Pinned section */}
                {pinnedNotes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] md:text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                      已固定
                    </p>
                    <div className={
                      isGridView 
                        ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3.5 space-y-3.5" 
                        : "flex flex-col gap-3.5 max-w-2xl mx-auto"
                    }>
                      {pinnedNotes.map(note => (
                        <NoteCard 
                          key={note.id}
                          note={note}
                          onUpdateNote={handleUpdateNote}
                          onDeleteNote={handleDeleteNote}
                          onCardClick={() => setEditingNote(note)}
                          allTags={tags}
                          themeEffect={themeEffect}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Others section */}
                {pinnedNotes.length > 0 && otherNotes.length > 0 && (
                  <div className="pt-2 border-t border-gray-150 dark:border-zinc-800" />
                )}

                {otherNotes.length > 0 && (
                  <div className="space-y-2">
                    {pinnedNotes.length > 0 && (
                      <p className="text-[10px] md:text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                        其他
                      </p>
                    )}
                    <div className={
                      isGridView 
                        ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3.5 space-y-3.5" 
                        : "flex flex-col gap-3.5 max-w-2xl mx-auto"
                    }>
                      {otherNotes.map(note => (
                        <NoteCard 
                          key={note.id}
                          note={note}
                          onUpdateNote={handleUpdateNote}
                          onDeleteNote={handleDeleteNote}
                          onCardClick={() => setEditingNote(note)}
                          allTags={tags}
                          themeEffect={themeEffect}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </main>

      </div>

      {/* Edit Details Overlay Modal */}
      <NoteModal 
        note={editingNote}
        isOpen={editingNote !== null}
        onClose={() => setEditingNote(null)}
        onUpdateNote={handleUpdateNote}
        allTags={tags}
        themeEffect={themeEffect}
        isDarkMode={isDarkMode}
      />

      {/* Download Multi-platform Clients Guide Modal */}
      <DownloadGuideModal 
        isOpen={showDownloadGuide}
        onClose={() => setShowDownloadGuide(false)}
        themeEffect={themeEffect}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
