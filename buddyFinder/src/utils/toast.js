import toast from 'react-hot-toast';

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showLoading = (message) => toast.loading(message);
export const dismissToast = (id) => toast.dismiss(id);

export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Error!',
  });
};