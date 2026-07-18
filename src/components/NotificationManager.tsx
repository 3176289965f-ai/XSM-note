import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, Info, Clock, Check } from "lucide-react";
import { Note, AppNotification } from "../types";

interface NotificationManagerProps {
  notes: Note[];
  onTriggerReminder: (noteId: string, title: string, content: string) => void;
  notifications: AppNotification[];
}

interface ToastMessage {
  id: string;
  title: string;
  content: string;
  noteId?: string;
}

export default function NotificationManager({
  notes,
  onTriggerReminder,
  notifications
}: NotificationManagerProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Play Keep-style synth chime sound
  const playNotificationChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // Resume context if suspended (browser security autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const now = ctx.currentTime;
      
      // Helper to synthesize a sweet chime note
      const playChimeNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        // Soft attack, decay, and release curve
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      // Keep style dual-tone notification chime: E5 then G5 then C6
      playChimeNote(659.25, now, 0.4);       // E5
      playChimeNote(783.99, now + 0.12, 0.5); // G5
      playChimeNote(1046.50, now + 0.24, 0.6); // C6
      
    } catch (err) {
      console.warn("Could not play notification audio chime:", err);
    }
  };

  // Request browser notification permissions on load
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Poll for reached reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      notes.forEach(note => {
        if (
          note.reminderTime && 
          !note.reminderTriggered && 
          !note.isDeleted && 
          !note.isArchived
        ) {
          const reminderDate = new Date(note.reminderTime);
          
          if (reminderDate <= now) {
            // Trigger!
            const title = note.title || "记事提醒";
            const content = note.content || "您有一条记事提醒";
            
            // Invoke parent state trigger
            onTriggerReminder(note.id, title, content);
            
            // Add custom local toast
            const toastId = Math.random().toString();
            setToasts(prev => [...prev, { id: toastId, title, content, noteId: note.id }]);
            
            // Play sweet chime
            playNotificationChime();
            
            // Native HTML5 push notification
            if ("Notification" in window && Notification.permission === "granted") {
              try {
                new Notification(title, {
                  body: content,
                  icon: "https://cdn-icons-png.flaticon.com/512/564/564793.png" // Keep yellow bulb icon
                });
              } catch (e) {
                console.warn("Native Notification error:", e);
              }
            }
          }
        }
      });
    };

    // Check immediately and every 5 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 5000);
    return () => clearInterval(interval);
  }, [notes, onTriggerReminder]);

  // Remove toast after 6 seconds
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            onAnimationComplete={() => {
              // Auto dismiss
              setTimeout(() => removeToast(toast.id), 6000);
            }}
            className="pointer-events-auto bg-amber-500 text-white rounded-xl shadow-2xl p-4 flex gap-3 items-start border border-amber-400 select-none"
          >
            <div className="p-2 bg-white/20 rounded-lg shrink-0 mt-0.5">
              <Bell className="w-4 h-4 animate-swing" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-sm truncate leading-snug">
                {toast.title}
              </h5>
              <p className="text-xs text-white/95 mt-1 line-clamp-2 leading-relaxed">
                {toast.content}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white self-center shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
