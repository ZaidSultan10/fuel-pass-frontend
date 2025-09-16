import toast from 'react-hot-toast';

// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show toast for the error
    const errorMessage = event.reason?.message || 'An unexpected error occurred';
    toast.error(errorMessage);
    
    // Prevent the default behavior (which would log to console)
    event.preventDefault();
  });

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Show toast for the error
    const errorMessage = event.error?.message || 'An unexpected error occurred';
    toast.error(errorMessage);
  });
}

// Utility function to handle API errors consistently
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unexpected error occurred';
}

// Utility function to show error toast
export function showErrorToast(error: unknown) {
  const message = handleApiError(error);
  toast.error(message);
}

// Utility function to show success toast
export function showSuccessToast(message: string) {
  toast.success(message);
}

// Utility function to show info toast
export function showInfoToast(message: string) {
  toast(message, {
    icon: 'ℹ️',
  });
}

// Utility function to show loading toast
export function showLoadingToast(message: string) {
  return toast.loading(message);
}

// Utility function to update a loading toast
export function updateToast(toastId: string, message: string, type: 'success' | 'error' | 'loading' = 'success') {
  if (type === 'success') {
    toast.success(message, { id: toastId });
  } else if (type === 'error') {
    toast.error(message, { id: toastId });
  } else {
    toast.loading(message, { id: toastId });
  }
}
