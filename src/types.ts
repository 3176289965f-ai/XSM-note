export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  color: string; // Tailwind bg-class or hex
  textColor?: string; // Text color contrast
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean; // in Trash
  tags: string[];
  reminderTime: string | null; // ISO Date String
  reminderTriggered: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  userId: string;
}

export interface AppNotification {
  id: string;
  noteId?: string;
  title: string;
  content: string;
  timestamp: number;
  isRead: boolean;
  type: 'reminder' | 'system' | 'sync';
}

export type SidebarTab = 'notes' | 'reminders' | 'archive' | 'trash' | 'tag';

export type ThemeEffect = 'classic' | 'glass' | 'glow' | 'transparent';

export interface NoteColorOption {
  name: string;
  bgClass: string;
  borderClass: string;
  darkBgClass: string;
  hex: string;
  label: string;
}
