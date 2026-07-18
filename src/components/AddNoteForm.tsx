import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Pin, Palette, Tag, Bell, Check, Clock, Plus, Trash, Trash2, Calendar, X
} from "lucide-react";
import { Note, NoteColorOption, ThemeEffect } from "../types";
import { GOOGLE_COLORS } from "../constants";
import { getCardStyleClasses } from "../themeUtils";
import { InteractiveRipple } from "./InteractiveRipple";
import { getTagStyleConfig } from "../tagUtils";

interface AddNoteFormProps {
  onAddNote: (noteData: Partial<Note>) => void;
  tags: string[];
  themeEffect: ThemeEffect;
  isDarkMode: boolean;
}

export default function AddNoteForm({ onAddNote, tags, themeEffect, isDarkMode }: AddNoteFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [selectedColor, setSelectedColor] = useState<NoteColorOption>(GOOGLE_COLORS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState<string | null>(null);

  // Dropdown states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  // Custom reminder time state
  const [customReminderDate, setCustomReminderDate] = useState("");
  const [customReminderTime, setCustomReminderTime] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (themeEffect !== "classic") {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rY = ((x - centerX) / centerX) * 4; // slight elegant tilt
      const rX = -((y - centerY) / centerY) * 4;
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

  // Collapse and save if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleCloseAndSave();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, title, content, isPinned, selectedColor, selectedTags, reminderTime]);

  const handleCloseAndSave = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle || trimmedContent) {
      onAddNote({
        title: trimmedTitle,
        content: trimmedContent,
        color: selectedColor.name,
        isPinned,
        tags: selectedTags,
        reminderTime,
        isArchived: false,
        isDeleted: false,
        reminderTriggered: false
      });
    }

    // Reset form states
    setTitle("");
    setContent("");
    setIsPinned(false);
    setSelectedColor(GOOGLE_COLORS[0]);
    setSelectedTags([]);
    setReminderTime(null);
    setIsExpanded(false);
    setShowColorPicker(false);
    setShowTagPicker(false);
    setShowReminderPicker(false);
    setCustomReminderDate("");
    setCustomReminderTime("");
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSetQuickReminder = (type: 'today' | 'tomorrow' | 'nextWeek') => {
    const now = new Date();
    if (type === 'today') {
      // Set to today at 8:00 PM
      now.setHours(20, 0, 0, 0);
    } else if (type === 'tomorrow') {
      // Set to tomorrow at 8:00 AM
      now.setDate(now.getDate() + 1);
      now.setHours(8, 0, 0, 0);
    } else if (type === 'nextWeek') {
      // Set to next Monday at 8:00 AM
      const day = now.getDay();
      const diff = now.getDate() + (day === 0 ? 1 : 8 - day);
      now.setDate(diff);
      now.setHours(8, 0, 0, 0);
    }
    setReminderTime(now.toISOString());
    setShowReminderPicker(false);
  };

  const handleSetCustomReminder = () => {
    if (customReminderDate && customReminderTime) {
      const dateTime = new Date(`${customReminderDate}T${customReminderTime}`);
      if (!isNaN(dateTime.getTime())) {
        setReminderTime(dateTime.toISOString());
        setShowReminderPicker(false);
      }
    }
  };

  // Get current active theme classes based on selectedColor and themeEffect
  const formStyles = getCardStyleClasses(selectedColor, themeEffect, isDarkMode);

  return (
    <div className="w-full max-w-xl mx-auto px-4 my-6" ref={formRef}>
      <motion.div
        layout
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: themeEffect !== 'classic' ? 0.985 : 1.0 }}
        className={`w-full rounded-xl p-3.5 shadow-sm relative overflow-hidden border-fusion-hover ${formStyles}`}
        style={{
          transformStyle: "preserve-3d",
          transform: themeEffect !== 'classic' && isHovered 
            ? `perspective(1000px) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)` 
            : isHovered 
              ? "perspective(1000px) translateY(-3px) rotateX(0deg) rotateY(0deg) scale3d(1.008, 1.008, 1.008)"
              : "perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: isHovered ? "transform 0.08s ease-out, box-shadow 0.3s ease" : "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Click Ripple Effect */}
        <InteractiveRipple />

        {/* Real-time Spotlight Reflection Shine */}
        {themeEffect !== 'classic' && (
          <div 
            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            style={{
              background: `radial-gradient(220px circle at ${coords.x}px ${coords.y}px, ${
                isDarkMode 
                  ? 'rgba(255, 255, 255, 0.12)' 
                  : 'rgba(255, 255, 255, 0.45)'
              }, transparent 80%)`
            }}
          />
        )}
        
        {/* Constant subtle gloss shimmer sweep across the card */}
        {themeEffect === 'glass' && (
          <div className="absolute inset-0 rounded-xl pointer-events-none shimmer-sweep opacity-[0.22] z-0" />
        )}

        {/* Dynamic 3D Layer Content */}
        <div 
          className="w-full h-full flex flex-col"
          style={{ 
            transform: themeEffect !== 'classic' ? "translateZ(12px)" : "none",
            transformStyle: "preserve-3d" 
          }}
        >
          {/* Expanded: Title section + Pin */}
        {isExpanded && (
          <div className="flex items-start justify-between gap-2 mb-2">
            <input
              type="text"
              placeholder="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-gray-900 dark:text-zinc-50 font-semibold placeholder-gray-500 dark:placeholder-zinc-400 outline-none border-none py-1 text-base"
              id="new-note-title"
              autoFocus
            />
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                isPinned ? "text-amber-500 dark:text-amber-400" : "text-gray-400 dark:text-zinc-400"
              }`}
              title={isPinned ? "取消固定记事" : "固定记事"}
              id="new-note-pin-btn"
            >
              <Pin className="w-4 h-4" style={{ fill: isPinned ? "currentColor" : "none" }} />
            </button>
          </div>
        )}

        {/* Content body input */}
        <textarea
          placeholder={isExpanded ? "记事内容..." : "新建记事..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onClick={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
          rows={isExpanded ? 3 : 1}
          className="w-full bg-transparent text-gray-800 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400 outline-none border-none py-1 text-sm resize-none focus:outline-none"
          id="new-note-content"
        />

        {/* Selected Tags list in Form */}
        {isExpanded && (selectedTags.length > 0 || reminderTime) && (
          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
            {/* Reminder Label */}
            {reminderTime && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/5 dark:bg-white/10 text-gray-700 dark:text-zinc-300">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(reminderTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}{" "}
                  {new Date(reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button 
                  onClick={() => setReminderTime(null)}
                  className="hover:text-red-500 ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {/* Note Tags */}
            {selectedTags.map(tag => {
              const config = getTagStyleConfig(tag);
              const TagIcon = config.icon;
              return (
                <span 
                  key={tag} 
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all ${config.bgClass} ${config.borderClass} ${config.colorClass}`}
                >
                  <TagIcon className="w-2.5 h-2.5 shrink-0" />
                  <span>{tag}</span>
                  <button 
                    onClick={() => toggleTag(tag)}
                    className="hover:text-red-500 ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
                    title="移除标签"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Bottom Toolbar */}
        {isExpanded && (
          <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-black/5 dark:border-white/5 relative">
            <div className="flex items-center gap-1.5">
              {/* Color Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowTagPicker(false);
                    setShowReminderPicker(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 transition-colors"
                  title="更改背景颜色"
                  id="color-picker-trigger"
                >
                  <Palette className="w-4 h-4" />
                </button>

                {/* Color Palette Popover */}
                {showColorPicker && (
                  <div className="absolute left-0 bottom-9 z-50 flex flex-wrap gap-1.5 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 w-44">
                    {GOOGLE_COLORS.map(color => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`w-6 h-6 rounded-full border relative flex items-center justify-center transition-all ${color.bgClass} ${color.borderClass} hover:scale-110`}
                        title={color.label}
                      >
                        {selectedColor.name === color.name && (
                          <Check className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tag Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTagPicker(!showTagPicker);
                    setShowColorPicker(false);
                    setShowReminderPicker(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 transition-colors"
                  title="更改标签"
                  id="tag-picker-trigger"
                >
                  <Tag className="w-4 h-4" />
                </button>

                {/* Tag Selection Popover */}
                {showTagPicker && (
                  <div className="absolute left-0 bottom-9 z-50 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 w-48 max-h-48 overflow-y-auto space-y-1.5">
                    <p className="text-xs font-semibold px-1 text-gray-500 dark:text-zinc-400 border-b pb-1">选择标签</p>
                    {tags.length === 0 ? (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 px-1 py-1">暂无标签</p>
                    ) : (
                      tags.map(tag => (
                        <label 
                          key={tag}
                          className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50 dark:hover:bg-zinc-750 text-xs text-gray-700 dark:text-zinc-300 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => toggleTag(tag)}
                            className="rounded border-gray-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                          />
                          <span className="truncate">{tag}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Reminder Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowReminderPicker(!showReminderPicker);
                    setShowColorPicker(false);
                    setShowTagPicker(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 transition-colors"
                  title="添加提醒"
                  id="reminder-picker-trigger"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {/* Reminder Settings Popover */}
                {showReminderPicker && (
                  <div className="absolute left-0 bottom-9 z-50 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 w-64 text-xs text-gray-700 dark:text-zinc-300 space-y-2">
                    <p className="font-semibold text-gray-900 dark:text-zinc-100 border-b pb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>设置提醒时间</span>
                    </p>
                    
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
                      <button
                        onClick={() => handleSetQuickReminder('nextWeek')}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 flex justify-between"
                      >
                        <span>下周上午</span>
                        <span className="text-gray-400">周一 08:00</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-zinc-700 pt-2 space-y-2">
                      <p className="font-medium text-[10px] text-gray-500 dark:text-zinc-400 uppercase">自定义时间</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="date"
                          value={customReminderDate}
                          onChange={(e) => setCustomReminderDate(e.target.value)}
                          className="bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded px-1.5 py-1 text-[11px] outline-none text-gray-900 dark:text-white"
                        />
                        <input
                          type="time"
                          value={customReminderTime}
                          onChange={(e) => setCustomReminderTime(e.target.value)}
                          className="bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded px-1.5 py-1 text-[11px] outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <button
                        onClick={handleSetCustomReminder}
                        disabled={!customReminderDate || !customReminderTime}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-zinc-700 disabled:text-gray-500 text-white font-medium py-1.5 rounded text-[11px] transition-colors"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Close / Save Button */}
            <button
              onClick={handleCloseAndSave}
              className="px-4 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-zinc-200 font-medium text-xs md:text-sm transition-all focus:outline-none"
              id="new-note-close-btn"
            >
              关闭
            </button>
          </div>
        )}
        </div>
      </motion.div>
    </div>
  );
}
