import { NoteColorOption } from "./types";

export const GOOGLE_COLORS: NoteColorOption[] = [
  {
    name: "default",
    bgClass: "bg-white",
    borderClass: "border-gray-200 dark:border-zinc-700",
    darkBgClass: "dark:bg-zinc-900",
    hex: "#ffffff",
    label: "默认"
  },
  {
    name: "red",
    bgClass: "bg-rose-100/80",
    borderClass: "border-rose-200 dark:border-rose-900/40",
    darkBgClass: "dark:bg-[#5c2521]",
    hex: "#F28B82",
    label: "珊瑚红"
  },
  {
    name: "orange",
    bgClass: "bg-orange-100/80",
    borderClass: "border-orange-200 dark:border-orange-900/40",
    darkBgClass: "dark:bg-[#5e3a1f]",
    hex: "#FBBC04",
    label: "蜜桃橙"
  },
  {
    name: "yellow",
    bgClass: "bg-amber-100/80",
    borderClass: "border-amber-200 dark:border-amber-900/40",
    darkBgClass: "dark:bg-[#5c4a1a]",
    hex: "#FFF475",
    label: "沙滩黄"
  },
  {
    name: "green",
    bgClass: "bg-emerald-100/80",
    borderClass: "border-emerald-200 dark:border-emerald-900/40",
    darkBgClass: "dark:bg-[#1a512e]",
    hex: "#CCFF90",
    label: "薄荷绿"
  },
  {
    name: "teal",
    bgClass: "bg-teal-100/80",
    borderClass: "border-teal-200 dark:border-teal-900/40",
    darkBgClass: "dark:bg-[#134d4a]",
    hex: "#A7FFEB",
    label: "鼠尾草绿"
  },
  {
    name: "blue",
    bgClass: "bg-sky-100/80",
    borderClass: "border-sky-200 dark:border-sky-900/40",
    darkBgClass: "dark:bg-[#1b4353]",
    hex: "#CBF0F8",
    label: "风暴蓝"
  },
  {
    name: "darkBlue",
    bgClass: "bg-blue-100/80",
    borderClass: "border-blue-200 dark:border-blue-900/40",
    darkBgClass: "dark:bg-[#172d4a]",
    hex: "#AECBFA",
    label: "晚霞蓝"
  },
  {
    name: "purple",
    bgClass: "bg-purple-100/80",
    borderClass: "border-purple-200 dark:border-purple-900/40",
    darkBgClass: "dark:bg-[#3d134d]",
    hex: "#D7AEFB",
    label: "紫水晶"
  },
  {
    name: "pink",
    bgClass: "bg-pink-100/80",
    borderClass: "border-pink-200 dark:border-pink-900/40",
    darkBgClass: "dark:bg-[#5c133a]",
    hex: "#FDCFE8",
    label: "樱花粉"
  },
  {
    name: "brown",
    bgClass: "bg-amber-200/40",
    borderClass: "border-amber-300/30 dark:border-amber-900/20",
    darkBgClass: "dark:bg-[#4d321d]",
    hex: "#E6C9A8",
    label: "火山泥"
  },
  {
    name: "gray",
    bgClass: "bg-slate-100/90",
    borderClass: "border-slate-200 dark:border-slate-700/60",
    darkBgClass: "dark:bg-[#2e3134]",
    hex: "#E8EAED",
    label: "石灰灰"
  }
];

export const DEFAULT_TAGS = ["工作", "个人", "灵感", "待办", "重要"];
