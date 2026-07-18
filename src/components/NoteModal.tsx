import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Pin, Palette, Tag, Bell, Clock, X, Trash2, Archive, Check
} from "lucide-react";
import { Note, NoteColorOption, ThemeEffect } from "../types";
import { GOOGLE_COLORS } from "../constants";
import { getCardStyleClasses } from "../themeUtils";
import { InteractiveRipple } from "./InteractiveRipple";
import { getTagStyleConfig } from "../tagUtils";

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  allTags: string[];
  themeEffect: ThemeEffect;
  isDarkMode: boolean;
}

export default function NoteModal({
  note,
  isOpen,
  onClose,
  onUpdateNote,
  allTags,
  themeEffect,
  isDarkMode
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState("default");
  const [tags, setTags] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState<string | null>(null);

  // Popover toggles
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");

  const colorRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const reminderRef = useRef<HTMLDivElement>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (themeEffect !== "classic") {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rY = ((x - centerX) / centerX) * 3; // subtle elegant 3D tilt
      const rX = -((y - centerY) / centerY) * 3;
      setRotateX(rX);
      setRotateY(rY);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Sync internal state when note changes or modal opens
  useEffect(() => {
    if (note && isOpen) {
      setTitle(note.title);
      setContent(note.content);
      setIsPinned(note.isPinned);
      setColor(note.color);
      setTags(note.tags);
      setReminderTime(note.reminderTime);
    }
  }, [note, isOpen]);

  // Handle outside clicks for popovers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
        setShowTagPicker(false);
      }
      if (reminderRef.current && !reminderRef.current.contains(event.target as Node)) {
        setShowReminderPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!note) return null;

  const handleSaveAndClose = () => {
    onUpdateNote(note.id, {
      title,
      content,
      isPinned,
      color,
      tags,
      reminderTime,
      updatedAt: Date.now()
    });
    onClose();
  };

  const toggleTagInModal = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSetQuickReminder = (type: 'today' | 'tomorrow' | 'nextWeek') => {
    const now = new Date();
    if (type === 'today') {
      now.setHours(20, 0, 0, 0);
    } else if (type === 'tomorrow') {
      now.setDate(now.getDate() + 1);
      now.setHours(8, 0, 0, 0);
    } else if (type === 'nextWeek') {
      const day = now.getDay();
      const diff = now.getDate() + (day === 0 ? 1 : 8 - day);
      now.setDate(diff);
      now.setHours(8, 0, 0, 0);
    }
    setReminderTime(now.toISOString());
    setShowReminderPicker(false);
  };

  const handleSetCustomReminder = () => {
    if (customDate && customTime) {
      const dateTime = new Date(`${customDate}T${customTime}`);
      if (!isNaN(dateTime.getTime())) {
        setReminderTime(dateTime.toISOString());
        setShowReminderPicker(false);
      }
    }
  };

  const activeColorOption = GOOGLE_COLORS.find(c => c.name === color) || GOOGLE_COLORS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSaveAndClose}
            className="fixed inset-0 bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`w-full max-w-lg rounded-2xl p-5 shadow-2xl relative flex flex-col max-h-[85vh] z-10 transition-all duration-300 overflow-hidden ${getCardStyleClasses(activeColorOption, themeEffect, isDarkMode)}`}
            style={{
              transformStyle: "preserve-3d",
              transform: themeEffect !== 'classic' && isHovered 
                ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)` 
                : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
              transition: isHovered ? "transform 0.08s ease-out" : "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
            }}
            id="note-modal-dialog"
          >
            {/* Click Ripple Effect */}
            <InteractiveRipple />

            {/* Real-time Spotlight Reflection Shine */}
            {themeEffect !== 'classic' && (
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(250px circle at ${coords.x}px ${coords.y}px, ${
                    isDarkMode 
                      ? 'rgba(255, 255, 255, 0.11)' 
                      : 'rgba(255, 255, 255, 0.42)'
                  }, transparent 80%)`
                }}
              />
            )}
            
            {/* Constant subtle gloss shimmer sweep across the card */}
            {themeEffect === 'glass' && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none shimmer-sweep opacity-[0.22] z-0" />
            )}

            {/* Dynamic 3D Layer Content */}
            <div 
              className="flex flex-col h-full w-full flex-1"
              style={{ 
                transform: themeEffect !== 'classic' ? "translateZ(10px)" : "none",
                transformStyle: "preserve-3d" 
              }}
            >
              {/* Header: Pin & Pin State */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <input
                type="text"
                placeholder="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-gray-900 dark:text-zinc-50 font-semibold placeholder-gray-500 dark:placeholder-zinc-400 outline-none border-none py-1 text-lg"
                id="modal-note-title"
              />
              <button
                onClick={() => setIsPinned(!isPinned)}
                className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 ${
                  isPinned ? "text-amber-500 dark:text-amber-400" : "text-gray-400 dark:text-zinc-400"
                }`}
                title={isPinned ? "取消固定" : "固定记事"}
              >
                <Pin className="w-4 h-4" style={{ fill: isPinned ? "currentColor" : "none" }} />
              </button>
            </div>

            {/* Content Textarea */}
            <div className="flex-1 overflow-y-auto min-h-[120px] py-1">
              <textarea
                placeholder="记事内容..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full bg-transparent text-gray-800 dark:text-zinc-150 placeholder-gray-500 dark:placeholder-zinc-400 outline-none border-none py-1 text-sm md:text-base resize-none focus:outline-none h-full"
                id="modal-note-content"
              />
            </div>

            {/* Selected Labels & Reminders */}
            {(reminderTime || tags.length > 0) && (
              <div className="flex flex-wrap gap-1.5 py-2.5 mt-2 border-t border-black/5 dark:border-white/5">
                {/* Reminder Label */}
                {reminderTime && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 text-gray-700 dark:text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      {new Date(reminderTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}{" "}
                      {new Date(reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button 
                      onClick={() => setReminderTime(null)}
                      className="hover:text-red-500 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Note Tags */}
                {tags.map(tag => {
                  const config = getTagStyleConfig(tag);
                  const TagIcon = config.icon;
                  return (
                    <span 
                      key={tag} 
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${config.bgClass} ${config.borderClass} ${config.colorClass}`}
                    >
                      <TagIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tag}</span>
                      <button 
                        onClick={() => toggleTagInModal(tag)}
                        className="hover:text-red-500 ml-0.5 opacity-75 hover:opacity-100 transition-opacity"
                        title="移除标签"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Footer Toolbar: Actions + Close button */}
            <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-1 md:gap-2">
                {/* Color Button */}
                <div className="relative" ref={colorRef}>
                  <button
                    onClick={() => {
                      setShowColorPicker(!showColorPicker);
                      setShowTagPicker(false);
                      setShowReminderPicker(false);
                    }}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 transition-colors"
                    title="更改背景颜色"
                  >
                    <Palette className="w-4 h-4" />
                  </button>

                  {/* Colors Popover */}
                  {showColorPicker && (
                    <div className="absolute left-0 bottom-10 z-50 flex flex-wrap gap-1.5 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 w-44">
                      {GOOGLE_COLORS.map(c => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setColor(c.name);
                            setShowColorPicker(false);
                          }}
                          className={`w-6 h-6 rounded-full border relative flex items-center justify-center transition-all ${c.bgClass} ${c.borderClass} hover:scale-110`}
                          title={c.label}
                        >
                          {color === c.name && (
                            <Check className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tag Button */}
                <div className="relative" ref={tagRef}>
                  <button
                    onClick={() => {
                      setShowTagPicker(!showTagPicker);
                      setShowColorPicker(false);
                      setShowReminderPicker(false);
                    }}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 transition-colors"
                    title="更改标签"
                  >
                    <Tag className="w-4 h-4" />
                  </button>

                  {/* Tags selection popup */}
                  {showTagPicker && (
                    <div className="absolute left-0 bottom-10 z-50 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 w-48 max-h-48 overflow-y-auto space-y-1.5 text-xs text-gray-700 dark:text-zinc-300">
                      <p className="font-semibold text-gray-500 pb-1 border-b">选择标签</p>
                      {allTags.length === 0 ? (
                        <p className="text-gray-400 py-1">暂无标签</p>
                      ) : (
                        allTags.map(tag => (
                          <label 
                            key={tag}
                            className="flex items-center gap-2 p-1 rounded hover:bg-gray-55 dark:hover:bg-zinc-750 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={tags.includes(tag)}
                              onChange={() => toggleTagInModal(tag)}
                              className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                            />
                            <span className="truncate">{tag}</span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Reminder Button */}
                <div className="relative" ref={reminderRef}>
                  <button
                    onClick={() => {
                      setShowReminderPicker(!showReminderPicker);
                      setShowColorPicker(false);
                      setShowTagPicker(false);
                    }}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 transition-colors"
                    title="设置提醒"
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  {/* Reminder settings popup */}
                  {showReminderPicker && (
                    <div className="absolute left-0 bottom-10 z-50 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 w-60 text-xs text-gray-700 dark:text-zinc-300 space-y-2">
                      <p className="font-semibold text-gray-900 dark:text-zinc-100 border-b pb-1">设置提醒时间</p>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleSetQuickReminder('today')}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 flex justify-between"
                        >
                          <span>今天晚些时候</span>
                          <span className="text-gray-400">20:00</span>
                        </button>
                        <button
                          onClick={() => handleSetQuickReminder('tomorrow')}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 flex justify-between"
                        >
                          <span>明天上午</span>
                          <span className="text-gray-400">08:00</span>
                        </button>
                      </div>

                      <div className="border-t border-gray-100 dark:border-zinc-700 pt-2 space-y-2">
                        <p className="font-semibold text-[10px] text-gray-500 uppercase">自定义</p>
                        <div className="grid grid-cols-2 gap-1">
                          <input
                            type="date"
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            className="border rounded p-1 text-[11px] outline-none bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white"
                          />
                          <input
                            type="time"
                            value={customTime}
                            onChange={(e) => setCustomTime(e.target.value)}
                            className="border rounded p-1 text-[11px] outline-none bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <button
                          onClick={handleSetCustomReminder}
                          disabled={!customDate || !customTime}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-1 rounded text-[11px] transition-colors"
                        >
                          确认时间
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleSaveAndClose}
                className="px-5 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-zinc-100 font-semibold text-xs md:text-sm transition-all focus:outline-none"
                id="modal-note-close-btn"
              >
                保存并关闭
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
