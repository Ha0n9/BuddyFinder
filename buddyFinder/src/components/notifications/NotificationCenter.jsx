// src/components/notifications/NotificationCenter.jsx
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { showError } from '../../utils/toast';

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 16 });
  
  const { 
    notifications, 
    unreadCount, 
    setNotifications, 
    markAsRead, 
    markAllAsRead,
    removeNotification 
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const withinButton = buttonRef.current?.contains(e.target);
      const withinWrapper = dropdownRef.current?.contains(e.target);
      const withinPanel = panelRef.current?.contains(e.target);
      if (withinButton || withinWrapper || withinPanel) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleMarkAsRead = async (notiId) => {
    try {
      await markNotificationAsRead(notiId);
      markAsRead(notiId);
    } catch (error) {
      showError('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      markAllAsRead();
    } catch (error) {
      showError('Failed to mark all as read');
    }
  };

  const handleDelete = async (notiId) => {
    try {
      await deleteNotification(notiId);
      removeNotification(notiId);
    } catch (error) {
      showError('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      MATCH: '⚡️',
      MESSAGE: '💬',
      ACTIVITY: '🏃',
      RATING: '⭐',
      SYSTEM: '🔔'
    };
    return icons[type] || '🔔';
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!prev && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + 12,
          right: Math.max(window.innerWidth - rect.right, 16),
        });
      }
      return next;
    });
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        ref={buttonRef}
        onClick={toggleDropdown}
        className="relative p-2 text-gray-300 hover:text-[#FF5F00] hover:bg-[#1A1A1A] rounded-full transition-all"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#FF5F00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_10px_rgba(255,95,0,0.6)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen &&
        createPortal(
          <div
            className="fixed w-80 md:w-96 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.5)] z-[5000] max-h-[600px] flex flex-col"
            style={{ top: dropdownPos.top, right: dropdownPos.right }}
            ref={panelRef}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[#FF5F00] text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#2A2A2A]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.notiId}
                      className={`p-4 hover:bg-[#2A2A2A]/30 transition-all ${
                        !notif.isRead ? 'bg-[#FF5F00]/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm mb-1">
                            {notif.title}
                          </p>
                          <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1">
                          {!notif.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notif.notiId)}
                              className="p-1 text-[#FF5F00] hover:bg-[#FF5F00]/20 rounded-lg transition-all"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notif.notiId)}
                            className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default NotificationCenter;
