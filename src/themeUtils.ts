import { NoteColorOption } from "./types";

/**
 * Returns appropriate Tailwind background, border, and custom visual effect classes
 * for a note card based on the active theme effect.
 */
export function getCardStyleClasses(
  noteColor: NoteColorOption,
  themeEffect: 'classic' | 'glass' | 'glow' | 'transparent',
  isDarkMode: boolean
): string {
  const name = noteColor.name;

  // 1. Classic keep layout (Solid colors)
  if (themeEffect === 'classic') {
    return `${noteColor.bgClass} ${noteColor.darkBgClass} ${noteColor.borderClass}`;
  }

  // 2. Glassmorphism / Frosted Glass (毛玻璃)
  if (themeEffect === 'glass') {
    const glassColorMap: Record<string, { light: string; dark: string; borderLight: string; borderDark: string }> = {
      default: { light: "bg-white/45 backdrop-blur-xl", dark: "bg-zinc-900/45 backdrop-blur-xl", borderLight: "border-white/50 border-t-white/75", borderDark: "border-zinc-800/50 border-t-zinc-700/60" },
      red: { light: "bg-rose-100/40 backdrop-blur-xl", dark: "bg-rose-950/25 backdrop-blur-xl", borderLight: "border-rose-300/40 border-t-rose-200/60", borderDark: "border-rose-900/30 border-t-rose-800/40" },
      orange: { light: "bg-orange-100/40 backdrop-blur-xl", dark: "bg-orange-950/25 backdrop-blur-xl", borderLight: "border-orange-300/40 border-t-orange-200/60", borderDark: "border-orange-900/30 border-t-orange-800/40" },
      yellow: { light: "bg-amber-100/40 backdrop-blur-xl", dark: "bg-amber-950/25 backdrop-blur-xl", borderLight: "border-amber-300/40 border-t-amber-200/60", borderDark: "border-amber-900/30 border-t-amber-800/40" },
      green: { light: "bg-emerald-100/40 backdrop-blur-xl", dark: "bg-emerald-950/25 backdrop-blur-xl", borderLight: "border-emerald-300/40 border-t-emerald-200/60", borderDark: "border-emerald-900/30 border-t-emerald-800/40" },
      teal: { light: "bg-teal-100/40 backdrop-blur-xl", dark: "bg-teal-950/25 backdrop-blur-xl", borderLight: "border-teal-300/40 border-t-teal-200/60", borderDark: "border-teal-900/30 border-t-teal-800/40" },
      blue: { light: "bg-white/35 bg-sky-400/8 backdrop-blur-xl", dark: "bg-zinc-900/35 bg-sky-400/5 backdrop-blur-xl", borderLight: "border-sky-300/50 border-t-sky-200/70", borderDark: "border-sky-800/50 border-t-sky-700/60" },
      darkBlue: { light: "bg-white/35 bg-blue-400/8 backdrop-blur-xl", dark: "bg-zinc-900/35 bg-blue-400/5 backdrop-blur-xl", borderLight: "border-blue-300/50 border-t-blue-200/70", borderDark: "border-blue-800/50 border-t-blue-700/60" },
      purple: { light: "bg-purple-100/40 backdrop-blur-xl", dark: "bg-purple-950/25 backdrop-blur-xl", borderLight: "border-purple-300/40 border-t-purple-200/60", borderDark: "border-purple-900/30 border-t-purple-800/40" },
      pink: { light: "bg-pink-100/40 backdrop-blur-xl", dark: "bg-pink-950/25 backdrop-blur-xl", borderLight: "border-pink-300/40 border-t-pink-200/60", borderDark: "border-pink-900/30 border-t-pink-800/40" },
      brown: { light: "bg-amber-500/20 backdrop-blur-xl", dark: "bg-amber-950/20 backdrop-blur-xl", borderLight: "border-amber-400/40 border-t-amber-300/60", borderDark: "border-amber-900/30 border-t-amber-800/40" },
      gray: { light: "bg-slate-200/40 backdrop-blur-xl", dark: "bg-zinc-800/30 backdrop-blur-xl", borderLight: "border-slate-300/45 border-t-slate-100/50", borderDark: "border-zinc-700/40 border-t-zinc-600/50" },
    };

    const mapping = glassColorMap[name] || glassColorMap.default;
    const highlightShadow = isDarkMode 
      ? "shadow-[0_12px_40px_rgba(0,0,0,0.35),_0_2px_4px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.12)]" 
      : "shadow-[0_12px_40px_rgba(31,38,135,0.06),_0_2px_4px_rgba(0,0,0,0.02),_inset_0_1px_1.5px_rgba(255,255,255,0.65)]";
    return `${isDarkMode ? mapping.dark : mapping.light} border ${isDarkMode ? mapping.borderDark : mapping.borderLight} ${highlightShadow} hover:shadow-2xl transition-all duration-300`;
  }

  // 3. Dynamic Glow Effect (动态光效 - has ambient border shadows matching colors)
  if (themeEffect === 'glow') {
    const glowColorMap: Record<string, { light: string; dark: string; border: string; glowShadow: string }> = {
      default: { light: "bg-white", dark: "bg-zinc-900/90", border: "border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500", glowShadow: "shadow-[0_0_12px_rgba(59,130,246,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(59,130,246,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(59,130,246,0.3)]" },
      red: { light: "bg-rose-50/90", dark: "bg-rose-950/30", border: "border-rose-200 dark:border-rose-900 hover:border-rose-400 dark:hover:border-rose-500", glowShadow: "shadow-[0_0_12px_rgba(244,63,94,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(244,63,94,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(244,63,94,0.3)]" },
      orange: { light: "bg-orange-50/90", dark: "bg-orange-950/30", border: "border-orange-200 dark:border-orange-900 hover:border-orange-400 dark:hover:border-orange-500", glowShadow: "shadow-[0_0_12px_rgba(249,115,22,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(249,115,22,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(249,115,22,0.3)]" },
      yellow: { light: "bg-amber-50/90", dark: "bg-amber-950/30", border: "border-amber-200 dark:border-amber-900 hover:border-amber-400 dark:hover:border-amber-500", glowShadow: "shadow-[0_0_12px_rgba(234,179,8,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(234,179,8,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(234,179,8,0.3)]" },
      green: { light: "bg-emerald-50/90", dark: "bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-900 hover:border-emerald-400 dark:hover:border-emerald-500", glowShadow: "shadow-[0_0_12px_rgba(16,185,129,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(16,185,129,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(16,185,129,0.3)]" },
      teal: { light: "bg-teal-50/90", dark: "bg-teal-950/30", border: "border-teal-200 dark:border-teal-900 hover:border-teal-400 dark:hover:border-teal-500", glowShadow: "shadow-[0_0_12px_rgba(20,184,166,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(20,184,166,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(20,184,166,0.3)]" },
      blue: { light: "bg-sky-50/90", dark: "bg-sky-950/30", border: "border-sky-200 dark:border-sky-900 hover:border-sky-400 dark:hover:border-sky-500", glowShadow: "shadow-[0_0_12px_rgba(14,165,233,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(14,165,233,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(14,165,233,0.3)]" },
      darkBlue: { light: "bg-blue-50/90", dark: "bg-blue-950/30", border: "border-blue-200 dark:border-blue-900 hover:border-blue-400 dark:hover:border-blue-500", glowShadow: "shadow-[0_0_12px_rgba(37,99,235,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(37,99,235,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(37,99,235,0.3)]" },
      purple: { light: "bg-purple-50/90", dark: "bg-purple-950/30", border: "border-purple-200 dark:border-purple-900 hover:border-purple-400 dark:hover:border-purple-500", glowShadow: "shadow-[0_0_12px_rgba(168,85,247,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(168,85,247,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(168,85,247,0.3)]" },
      pink: { light: "bg-pink-50/90", dark: "bg-pink-950/30", border: "border-pink-200 dark:border-pink-900 hover:border-pink-400 dark:hover:border-pink-500", glowShadow: "shadow-[0_0_12px_rgba(236,72,153,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(236,72,153,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(236,72,153,0.3)]" },
      brown: { light: "bg-amber-100/50", dark: "bg-amber-950/20", border: "border-amber-300 dark:border-amber-900 hover:border-amber-400 dark:hover:border-amber-500", glowShadow: "shadow-[0_0_12px_rgba(120,53,4,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(120,53,4,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(120,53,4,0.25)]" },
      gray: { light: "bg-slate-50", dark: "bg-zinc-800/20", border: "border-slate-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500", glowShadow: "shadow-[0_0_12px_rgba(100,116,139,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_0_12px_rgba(100,116,139,0.05),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_22px_rgba(100,116,139,0.25)]" },
    };

    const mapping = glowColorMap[name] || glowColorMap.default;
    return `${isDarkMode ? mapping.dark : mapping.light} border-2 ${mapping.border} ${mapping.glowShadow} transition-all duration-300`;
  }

  // 4. Fully Transparent Crystal Style (全透明玻璃)
  if (themeEffect === 'transparent') {
    const transparentColorMap: Record<string, { borderLight: string; borderDark: string }> = {
      default: { borderLight: "border-gray-200 hover:border-gray-400", borderDark: "border-zinc-800 hover:border-zinc-600" },
      red: { borderLight: "border-rose-200 hover:border-rose-400", borderDark: "border-rose-900/50 hover:border-rose-600" },
      orange: { borderLight: "border-orange-200 hover:border-orange-400", borderDark: "border-orange-900/50 hover:border-orange-600" },
      yellow: { borderLight: "border-amber-200 hover:border-amber-400", borderDark: "border-amber-900/50 hover:border-amber-600" },
      green: { borderLight: "border-emerald-200 hover:border-emerald-400", borderDark: "border-emerald-900/50 hover:border-emerald-600" },
      teal: { borderLight: "border-teal-200 hover:border-teal-400", borderDark: "border-teal-900/50 hover:border-teal-600" },
      blue: { borderLight: "border-sky-200 hover:border-sky-400", borderDark: "border-sky-900/50 hover:border-sky-600" },
      darkBlue: { borderLight: "border-blue-200 hover:border-blue-400", borderDark: "border-blue-900/50 hover:border-blue-600" },
      purple: { borderLight: "border-purple-200 hover:border-purple-400", borderDark: "border-purple-900/50 hover:border-purple-600" },
      pink: { borderLight: "border-pink-200 hover:border-pink-400", borderDark: "border-pink-900/50 hover:border-pink-600" },
      brown: { borderLight: "border-amber-200 hover:border-amber-400", borderDark: "border-amber-900/40 hover:border-amber-600" },
      gray: { borderLight: "border-slate-200 hover:border-slate-400", borderDark: "border-slate-800 hover:border-slate-600" },
    };

    const mapping = transparentColorMap[name] || transparentColorMap.default;
    return `bg-transparent hover:bg-black/[0.015] dark:hover:bg-white/[0.015] border ${isDarkMode ? mapping.borderDark : mapping.borderLight} shadow-none transition-all duration-200`;
  }

  return "";
}

/**
 * Returns style classes for functional UI panels (e.g. Header, Sidebar, AddNoteForm)
 * based on the active theme effect.
 */
export function getPanelStyleClasses(
  themeEffect: 'classic' | 'glass' | 'glow' | 'transparent',
  isDarkMode: boolean
): string {
  if (themeEffect === 'classic') {
    return 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800';
  }
  if (themeEffect === 'glass') {
    return 'glass-panel';
  }
  if (themeEffect === 'glow') {
    return `${isDarkMode ? 'bg-zinc-950/80' : 'bg-white/85'} border-blue-400/30 dark:border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.08)] backdrop-blur-md`;
  }
  if (themeEffect === 'transparent') {
    return `bg-transparent border ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} backdrop-blur-[2px]`;
  }
  return "";
}
