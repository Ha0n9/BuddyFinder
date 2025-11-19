import { createElement } from 'react';
import toast from 'react-hot-toast';

const successIcon = createElement(
  'div',
  {
    style: {
      width: 24,
      height: 24,
      borderRadius: '9999px',
      backgroundColor: '#22c55e',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 14,
    },
  },
  '✓'
);

export const showSuccess = (message, options = {}) =>
  toast.success(message, {
    icon: successIcon,
    style: {
      background: '#1a1a1a',
      color: '#fff',
      ...options.style,
    },
    ...options,
  });

export const showError = (message, options = {}) =>
  toast.error(message, {
    style: {
      background: '#1a1a1a',
      color: '#fff',
      ...options.style,
    },
    ...options,
  });

export const showLoading = (message) => toast.loading(message);
export const dismissToast = (id) => toast.dismiss(id);

export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Error!',
  });
};
