import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Pin, Bell, Palette, Tag, Archive, Trash2, Check, Clock, RotateCcw, X, Trash
} from "lucide-react";
import { Note, NoteColorOption, ThemeEffect } from "../types";
import { GOOGLE_COLORS } from "../constants";
import { getCardStyleClasses } from "../themeUtils";
import { InteractiveRipple } from "./InteractiveRipple";
import { getTagStyleConfig } from "../tagUtils";

interface NoteCardProps {
  key?: string | number;
  note: Note;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void; // Delete permanently
  onCardClick: () => void;
  allTags: string[];
  themeEffect: ThemeEffect;
  isDarkMode: boolean;
}

export default function NoteCard({
  note,
  onUpdateNote,
  onDeleteNote,
  onCardClick,
  allTags,
  themeEffect,
  isDarkMode
}: NoteCardProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (themeEffect !== "classic") {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rY = ((x - centerX) / centerX) * 6; // max 6 degrees for standard elegant tilt
      const rX = -((y - centerY) / centerY) * 6;
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

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const tagPickerRef = useRef<HTMLDivElement>(null);
  const reminderPickerRef = useRef<HTMLDivElement>(null);

  // Close menus on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (tagPickerRef.current && !tagPickerRef.current.contains(event.target as Node)) {
        setShowTagPicker(false);
      }
      if (reminderPickerRef.current && !reminderPickerRef.current.contains(event.target as Node)) {
        setShowReminderPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const noteColor = GOOGLE_COLORS.find(c => c.name === note.color) || GOOGLE_COLORS[0];

  const handleSetQuickReminder = (type: 'today' | 'tomorrow' | 'nextWeek', e: React.MouseEvent) => {
    e.stopPropagation();
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
    onUpdateNote(note.id, { reminderTime: now.toISOString(), reminderTriggered: false });
    setShowReminderPicker(false);
  };

  const handleToggleTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTags = note.tags.includes(tag)
      ? note.tags.filter(t => t !== tag)
      : [...note.tags, tag];
    onUpdateNote(note.id, { tags: updatedTags });
  };

  const cardStyles = getCardStyleClasses(noteColor, themeEffect, isDarkMode);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      layout
      whileTap={{ scale: themeEffect !== 'classic' ? 0.96 : 0.99 }}
      onClick={onCardClick}
      className={`group w-full rounded-xl p-4 flex flex-col justify-between cursor-pointer relative break-inside-avoid overflow-hidden border-fusion-hover ${cardStyles}`}
      style={{
        transformStyle: "preserve-3d",
        transform: themeEffect !== 'classic' && isHovered 
          ? `perspective(1000px) translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)` 
          : isHovered 
            ? "perspective(1000px) translateY(-4px) rotateX(0deg) rotateY(0deg) scale3d(1.015, 1.015, 1.015)"
            : "perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: isHovered ? "transform 0.08s ease-out, box-shadow 0.3s ease" : "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      id={`note-card-${note.id}`}
    >
      {/* Click Ripple Effect */}
      <InteractiveRipple />

      {/* Real-time Spotlight Reflection Shine */}
      {themeEffect !== 'classic' && (
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, ${
              isDarkMode 
                ? 'rgba(255, 255, 255, 0.11)' 
                : 'rgba(255, 255, 255, 0.45)'
            }, transparent 80%)`
          }}
        />
      )}
      
      {/* Constant subtle gloss shimmer sweep across the card */}
      {themeEffect === 'glass' && (
        <div className="absolute inset-0 rounded-xl pointer-events-none shimmer-sweep opacity-[0.25] z-0" />
      )}

      {/* Dynamic 3D Layer Content */}
      <div 
        className="flex flex-col justify-between h-full w-full flex-1"
        style={{ 
          transform: themeEffect !== 'classic' ? "translateZ(18px)" : "none",
          transformStyle: "preserve-3d" 
        }}
      >
        {/* Top Section: Title & Pin Action */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 line-clamp-2 pr-4 leading-relaxed break-all">
          {note.title || <span className="text-gray-400 dark:text-zinc-500 font-normal italic">无标题</span>}
        </h4>
        
        {!note.isDeleted && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateNote(note.id, { isPinned: !note.isPinned });
            }}
            className={`absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity ${
              note.isPinned ? "text-amber-500 dark:text-amber-400 opacity-100" : "text-gray-400 dark:text-zinc-500"
            }`}
            title={note.isPinned ? "取消固定" : "固定记事"}
            id={`note-pin-${note.id}`}
          >
            <Pin className="stereoscopic-icon w-4 h-4" style={{ fill: note.isPinned ? "currentColor" : "none" }} />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-h-[40px] mb-3">
        <p className="text-xs md:text-sm text-gray-700 dark:text-zinc-350 whitespace-pre-wrap leading-relaxed break-all line-clamp-6">
          {note.content || <span className="text-gray-300 dark:text-zinc-600 italic">空记事</span>}
        </p>
      </div>

      {/* Chips: Reminders and Tags */}
      {(note.reminderTime || note.tags.length > 0) && (
        <div className="flex flex-wrap gap-1 mb-3">
          {/* Reminder Chip */}
          {note.reminderTime && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setShowReminderPicker(true);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/5 dark:bg-white/10 text-gray-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/15 transition-all"
            >
              <Clock className="w-2.5 h-2.5" />
              <span className="max-w-[100px] truncate">
                {new Date(note.reminderTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}{" "}
                {new Date(note.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </span>
          )}

          {/* Tag Chips */}
          {note.tags.map(tag => {
            const config = getTagStyleConfig(tag);
            const TagIcon = config.icon;
            return (
              <span 
                key={tag}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border hover:scale-105 transition-all duration-150 cursor-default truncate max-w-[90px] ${config.bgClass} ${config.borderClass} ${config.colorClass}`}
              >
                <TagIcon className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{tag}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Bottom Action Toolbar */}
      <div className="flex items-center justify-between mt-auto pt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
        {note.isDeleted ? (
          /* Trash View Actions */
          <div className="flex items-center gap-1.5 w-full justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateNote(note.id, { isDeleted: false });
              }}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-all"
              title="还原记事"
            >
              <RotateCcw className="stereoscopic-icon w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if(confirm("确定要永久删除此记事吗？此操作无法撤销。")) {
                  onDeleteNote(note.id);
                }
              }}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
              title="永久删除"
            >
              <Trash className="stereoscopic-icon w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Standard Note Actions */
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-0.5">
              {/* Reminder action */}
              <div className="relative" ref={reminderPickerRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReminderPicker(!showReminderPicker);
                    setShowColorPicker(false);
                    setShowTagPicker(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors"
                  title="提醒我"
                >
                  <Bell className="stereoscopic-icon w-3.5 h-3.5" />
                </button>

                {showReminderPicker && (
                  <div className="absolute left-0 bottom-8 z-50 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 w-44 text-[11px] space-y-1">
                    <button
                      onClick={(e) => handleSetQuickReminder('today', e)}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
                    >
                      今天晚些时候 20:00
                    </button>
                    <button
                      onClick={(e) => handleSetQuickReminder('tomorrow', e)}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
                    >
                      明天上午 08:00
                    </button>
                    {note.reminderTime && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateNote(note.id, { reminderTime: null });
                          setShowReminderPicker(false);
                        }}
                        className="w-full text-left px-2 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                      >
                        移除提醒
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Color action */}
              <div className="relative" ref={colorPickerRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowColorPicker(!showColorPicker);
                    setShowTagPicker(false);
                    setShowReminderPicker(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors"
                  title="更改背景颜色"
                >
                  <Palette className="stereoscopic-icon w-3.5 h-3.5" />
                </button>

                {showColorPicker && (
                  <div className="absolute left-0 bottom-8 z-50 flex flex-wrap gap-1 p-1.5 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 w-36">
                    {GOOGLE_COLORS.map(color => (
                      <button
                        key={color.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateNote(note.id, { color: color.name });
                          setShowColorPicker(false);
                        }}
                        className={`w-5 h-5 rounded-full border ${color.bgClass} ${color.borderClass} hover:scale-110 transition-all`}
                        title={color.label}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Tag action */}
              <div className="relative" ref={tagPickerRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTagPicker(!showTagPicker);
                    setShowColorPicker(false);
                    setShowReminderPicker(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors"
                  title="更改标签"
                >
                  <Tag className="w-3.5 h-3.5" />
                </button>

                {showTagPicker && (
                  <div className="absolute left-0 bottom-8 z-50 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 w-44 max-h-40 overflow-y-auto text-[11px] space-y-1">
                    <p className="font-semibold text-gray-500 pb-1 border-b">选择标签</p>
                    {allTags.length === 0 ? (
                      <p className="text-gray-400 py-1">暂无可用标签</p>
                    ) : (
                      allTags.map(tag => (
                        <label 
                          key={tag}
                          className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={note.tags.includes(tag)}
                            onChange={(e) => handleToggleTag(tag, e)}
                            className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 w-3 h-3"
                          />
                          <span className="truncate">{tag}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Archive action */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateNote(note.id, { isArchived: !note.isArchived });
                }}
                className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors ${
                  note.isArchived ? "text-amber-500 dark:text-amber-400" : ""
                }`}
                title={note.isArchived ? "取消归档" : "归档"}
              >
                <Archive className="stereoscopic-icon w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trash action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateNote(note.id, { isDeleted: true, isPinned: false });
              }}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="删除"
            >
              <Trash2 className="stereoscopic-icon w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      </div>
    </motion.div>
  );
}
