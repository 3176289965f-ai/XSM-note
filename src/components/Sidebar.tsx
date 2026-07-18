import { useState } from "react";
import { 
  Lightbulb, Bell, Archive, Trash2, Tag, ChevronDown, Plus, X, Edit2, Check, Download
} from "lucide-react";
import { SidebarTab, ThemeEffect } from "../types";
import { getPanelStyleClasses } from "../themeUtils";
import { getTagStyleConfig } from "../tagUtils";

interface SidebarProps {
  currentTab: SidebarTab;
  setCurrentTab: (tab: SidebarTab) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  tags: string[];
  handleAddTag: (tagName: string) => void;
  handleDeleteTag: (tagName: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  themeEffect: ThemeEffect;
  isDarkMode: boolean;
  onOpenDownloadGuide?: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  selectedTag,
  setSelectedTag,
  tags,
  handleAddTag,
  handleDeleteTag,
  isOpen,
  toggleSidebar,
  themeEffect,
  isDarkMode,
  onOpenDownloadGuide
}: SidebarProps) {
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const mainTabs = [
    { id: "notes" as SidebarTab, label: "记事", icon: Lightbulb },
    { id: "reminders" as SidebarTab, label: "提醒", icon: Bell },
  ];

  const bottomTabs = [
    { id: "archive" as SidebarTab, label: "归档", icon: Archive },
    { id: "trash" as SidebarTab, label: "回收站", icon: Trash2 },
  ];

  const onTabClick = (tabId: SidebarTab) => {
    setCurrentTab(tabId);
    setSelectedTag(null);
  };

  const onTagClick = (tag: string) => {
    setCurrentTab("tag");
    setSelectedTag(tag);
  };

  const submitNewTag = () => {
    const trimmed = newTagName.trim();
    if (trimmed && !tags.includes(trimmed)) {
      handleAddTag(trimmed);
      setNewTagName("");
    }
  };

  return (
    <>
      {/* Sidebar container */}
      <aside 
        className={`fixed md:sticky top-16 left-0 bottom-0 z-30 flex flex-col border-r transition-all duration-300 ${
          isOpen ? "w-56 max-w-[48vw]" : "w-0 md:w-16 overflow-hidden"
        } ${getPanelStyleClasses(themeEffect, isDarkMode)}`}
      >
        <div className="flex-1 py-3 overflow-y-auto no-scrollbar">
          {/* Main tabs (Notes, Reminders) */}
          <div className="space-y-1 px-2">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id && !selectedTag;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabClick(tab.id)}
                  className={`flex items-center w-full gap-5 px-4 py-3 rounded-full transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-amber-100/70 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                      : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-amber-600 dark:text-amber-400" : ""}`} />
                  <span className={`transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 md:hidden"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="my-2 border-t border-gray-100 dark:border-zinc-800" />

          {/* Dynamic Tags */}
          <div className="px-2">
            <div className={`flex items-center justify-between px-4 py-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider ${!isOpen && "md:hidden"}`}>
              <span>标签</span>
              <button 
                onClick={() => setShowTagEditor(!showTagEditor)}
                className="p-0.5 rounded-md hover:bg-gray-150 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300"
                title="修改标签"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tag edit input inline */}
            {showTagEditor && isOpen && (
              <div className="px-3 py-2 bg-gray-50 dark:bg-zinc-850 rounded-xl mb-2 mx-1 animate-in slide-in-from-top duration-200">
                <div className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    placeholder="创建新标签..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitNewTag()}
                    className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs px-2 py-1.5 rounded-md outline-none focus:border-amber-500 text-gray-900 dark:text-zinc-100"
                  />
                  <button 
                    onClick={submitNewTag}
                    className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2 max-h-24 overflow-y-auto space-y-1">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center justify-between text-xs px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-750 text-gray-700 dark:text-zinc-300">
                      <span className="truncate">{tag}</span>
                      <button 
                        onClick={() => handleDeleteTag(tag)}
                        className="p-0.5 hover:text-red-500 rounded"
                        title="删除标签"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tag List */}
            <div className="space-y-1 mt-1">
              {tags.map((tag) => {
                const isActive = currentTab === "tag" && selectedTag === tag;
                const config = getTagStyleConfig(tag);
                const TagIcon = config.icon;
                return (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
                    className={`flex items-center w-full gap-5 px-4 py-3 rounded-full transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? themeEffect !== 'classic'
                          ? `bg-white/45 dark:bg-zinc-800/40 backdrop-blur-md shadow-sm border border-blue-500/10 ${config.activeTextClass}`
                          : `bg-blue-50 dark:bg-blue-950/20 ${config.activeTextClass}`
                        : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <TagIcon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? config.colorClass : "text-gray-400 dark:text-zinc-500"}`} />
                    <span className={`truncate text-left transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 md:hidden"}`}>
                      {tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-2 border-t border-gray-100 dark:border-zinc-800" />

          {/* Archive, Trash */}
          <div className="space-y-1 px-2">
            {bottomTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabClick(tab.id)}
                  className={`flex items-center w-full gap-5 px-4 py-3 rounded-full transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className={`transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 md:hidden"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}

            {/* Download Client Premium Link */}
            {onOpenDownloadGuide && (
              <button
                onClick={onOpenDownloadGuide}
                className="flex items-center w-full gap-5 px-4 py-3 rounded-full transition-all duration-200 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/15 mt-2 border border-dashed border-amber-200/60 dark:border-amber-900/30"
                title="下载全端客户端"
                id="sidebar-download-app-btn"
              >
                <Download className="w-5 h-5 shrink-0 text-amber-500" />
                <span className={`transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 md:hidden"}`}>
                  下载客户端
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Brand footer inside Sidebar */}
        {isOpen && (
          <div className="p-4 text-center border-t border-gray-100 dark:border-zinc-800 text-[10px] text-gray-400 dark:text-zinc-500">
            Google Ecosystem Style
            <div className="mt-1 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
          </div>
        )}
      </aside>

      {/* Overlay on mobile for open sidebar */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-20 md:hidden"
        />
      )}
    </>
  );
}
