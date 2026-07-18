import { 
  Briefcase, User, Sparkles, ListTodo, Star, BookOpen, Wallet, Activity, Compass, Music, Tag, LucideIcon
} from "lucide-react";

export interface TagStyleConfig {
  icon: LucideIcon;
  colorClass: string;      // Text color
  bgClass: string;         // Background class
  borderClass: string;     // Border class
  activeTextClass: string; // Active text color
}

export const getTagStyleConfig = (tag: string): TagStyleConfig => {
  const normalized = tag.toLowerCase().trim();
  
  if (normalized.includes("工作") || normalized.includes("work") || normalized.includes("job") || normalized.includes("meeting") || normalized.includes("任务")) {
    return {
      icon: Briefcase,
      colorClass: "text-indigo-500 dark:text-indigo-400",
      bgClass: "bg-indigo-500/10 dark:bg-indigo-400/10",
      borderClass: "border-indigo-500/20 dark:border-indigo-400/20",
      activeTextClass: "text-indigo-600 dark:text-indigo-300"
    };
  }
  if (normalized.includes("个人") || normalized.includes("personal") || normalized.includes("life") || normalized.includes("生活") || normalized.includes("私事") || normalized.includes("自留地")) {
    return {
      icon: User,
      colorClass: "text-emerald-500 dark:text-emerald-400",
      bgClass: "bg-emerald-500/10 dark:bg-emerald-400/10",
      borderClass: "border-emerald-500/20 dark:border-emerald-400/20",
      activeTextClass: "text-emerald-600 dark:text-emerald-300"
    };
  }
  if (normalized.includes("灵感") || normalized.includes("idea") || normalized.includes("inspiration") || normalized.includes("creative") || normalized.includes("创意") || normalized.includes("随笔")) {
    return {
      icon: Sparkles,
      colorClass: "text-amber-500 dark:text-amber-400",
      bgClass: "bg-amber-500/10 dark:bg-amber-400/10",
      borderClass: "border-amber-500/20 dark:border-amber-400/20",
      activeTextClass: "text-amber-600 dark:text-amber-300"
    };
  }
  if (normalized.includes("待办") || normalized.includes("todo") || normalized.includes("checklist") || normalized.includes("日程") || normalized.includes("计划")) {
    return {
      icon: ListTodo,
      colorClass: "text-rose-500 dark:text-rose-400",
      bgClass: "bg-rose-500/10 dark:bg-rose-400/10",
      borderClass: "border-rose-500/20 dark:border-rose-400/20",
      activeTextClass: "text-rose-600 dark:text-rose-300"
    };
  }
  if (normalized.includes("重要") || normalized.includes("important") || normalized.includes("priority") || normalized.includes("星标") || normalized.includes("置顶")) {
    return {
      icon: Star,
      colorClass: "text-amber-500 dark:text-amber-400",
      bgClass: "bg-amber-500/10 dark:bg-amber-400/10",
      borderClass: "border-amber-500/20 dark:border-amber-400/20",
      activeTextClass: "text-amber-600 dark:text-amber-300"
    };
  }
  if (normalized.includes("学习") || normalized.includes("study") || normalized.includes("读书") || normalized.includes("book") || normalized.includes("课程")) {
    return {
      icon: BookOpen,
      colorClass: "text-cyan-500 dark:text-cyan-400",
      bgClass: "bg-cyan-500/10 dark:bg-cyan-400/10",
      borderClass: "border-cyan-500/20 dark:border-cyan-400/20",
      activeTextClass: "text-cyan-600 dark:text-cyan-300"
    };
  }
  if (normalized.includes("财务") || normalized.includes("money") || normalized.includes("budget") || normalized.includes("账单") || normalized.includes("消费") || normalized.includes("钱包")) {
    return {
      icon: Wallet,
      colorClass: "text-yellow-500 dark:text-yellow-400",
      bgClass: "bg-yellow-500/10 dark:bg-yellow-400/10",
      borderClass: "border-yellow-500/20 dark:border-yellow-400/20",
      activeTextClass: "text-yellow-600 dark:text-yellow-300"
    };
  }
  if (normalized.includes("健身") || normalized.includes("运动") || normalized.includes("fitness") || normalized.includes("health") || normalized.includes("跑")) {
    return {
      icon: Activity,
      colorClass: "text-teal-500 dark:text-teal-400",
      bgClass: "bg-teal-500/10 dark:bg-teal-400/10",
      borderClass: "border-teal-500/20 dark:border-teal-400/20",
      activeTextClass: "text-teal-600 dark:text-teal-300"
    };
  }
  if (normalized.includes("旅行") || normalized.includes("旅游") || normalized.includes("travel") || normalized.includes("trip")) {
    return {
      icon: Compass,
      colorClass: "text-sky-500 dark:text-sky-400",
      bgClass: "bg-sky-500/10 dark:bg-sky-400/10",
      borderClass: "border-sky-500/20 dark:border-sky-400/20",
      activeTextClass: "text-sky-600 dark:text-sky-300"
    };
  }
  if (normalized.includes("娱乐") || normalized.includes("游戏") || normalized.includes("音乐") || normalized.includes("电影") || normalized.includes("music") || normalized.includes("movie")) {
    return {
      icon: Music,
      colorClass: "text-purple-500 dark:text-purple-400",
      bgClass: "bg-purple-500/10 dark:bg-purple-400/10",
      borderClass: "border-purple-500/20 dark:border-purple-400/20",
      activeTextClass: "text-purple-600 dark:text-purple-300"
    };
  }
  
  return {
    icon: Tag,
    colorClass: "text-blue-500 dark:text-blue-400",
    bgClass: "bg-blue-500/10 dark:bg-blue-400/10",
    borderClass: "border-blue-500/20 dark:border-blue-400/20",
    activeTextClass: "text-blue-600 dark:text-blue-300"
  };
};
