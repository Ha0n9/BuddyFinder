// Time formatting utilities for chat

/**
 * Format timestamp to relative time (e.g., "2 minutes ago", "1 hour ago")
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {string} Formatted relative time
 */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';

  const now = new Date();
  const messageTime = new Date(timestamp);
  
  // Check if date is valid
  if (isNaN(messageTime.getTime())) {
    console.error('Invalid timestamp:', timestamp);
    return 'Just now';
  }

  const diffInSeconds = Math.floor((now - messageTime) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // Less than a month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  // Format as date
  return messageTime.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: messageTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Format timestamp for message display (e.g., "10:30 AM")
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {string} Formatted time
 */
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';

  const messageTime = new Date(timestamp);
  
  if (isNaN(messageTime.getTime())) {
    console.error('Invalid timestamp:', timestamp);
    return '';
  }

  const now = new Date();
  const isToday = messageTime.toDateString() === now.toDateString();
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = messageTime.toDateString() === yesterday.toDateString();
  
  const timeString = messageTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  if (isToday) {
    return timeString;
  } else if (isYesterday) {
    return `Yesterday ${timeString}`;
  } else if (now - messageTime < 7 * 24 * 60 * 60 * 1000) {
    return messageTime.toLocaleDateString('en-US', { 
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else {
    return messageTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
};

/**
 * Format last message time for chat list
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {string} Formatted time
 */
export const formatLastMessageTime = (timestamp) => {
  if (!timestamp) return '';

  const messageTime = new Date(timestamp);
  
  if (isNaN(messageTime.getTime())) {
    console.error('Invalid timestamp:', timestamp);
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - messageTime) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Now';
  }
  
  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  // Today
  const isToday = messageTime.toDateString() === now.toDateString();
  if (isToday) {
    return messageTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = messageTime.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return 'Yesterday';
  }
  
  // This week
  const diffInDays = Math.floor(diffInSeconds / (24 * 60 * 60));
  if (diffInDays < 7) {
    return messageTime.toLocaleDateString('en-US', { weekday: 'short' });
  }
  
  // Older
  return messageTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Group messages by date for chat display
 * @param {Array} messages - Array of message objects
 * @returns {Array} Messages grouped by date
 */
export const groupMessagesByDate = (messages) => {
  if (!messages || messages.length === 0) return [];

  const groups = [];
  let currentGroup = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.timestamp);
    const dateKey = messageDate.toDateString();

    if (!currentGroup || currentGroup.dateKey !== dateKey) {
      currentGroup = {
        dateKey,
        dateLabel: formatDateLabel(messageDate),
        messages: []
      };
      groups.push(currentGroup);
    }

    currentGroup.messages.push(message);
  });

  return groups;
};

/**
 * Format date label for message groups
 * @param {Date} date - Date object
 * @returns {string} Formatted date label
 */
const formatDateLabel = (date) => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return 'Today';
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isYesterday) {
    return 'Yesterday';
  }
  
  // This year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Different year
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Check if timestamp is from today
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {boolean}
 */
export const isToday = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if timestamp is from yesterday
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {boolean}
 */
export const isYesterday = (timestamp) => {
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};