import Swal from 'sweetalert2';

// SweetAlert2 configuration
const swalConfig = {
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes',
  cancelButtonText: 'Cancel',
  reverseButtons: true, // This will make buttons right-aligned
};

// Success alert with custom icon
export const showSuccess = (title: string, message?: string) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonColor: '#28a745',
    confirmButtonText: 'OK',
    customClass: {
      icon: 'swal2-icon-custom'
    },
    html: `
      <div class="text-center">
        <div class="mb-3">
          <i class="mdi mdi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
        </div>
        <h3>${title}</h3>
        ${message ? `<p>${message}</p>` : ''}
      </div>
    `,
    showConfirmButton: true,
  });
};

// Error alert with custom icon
export const showError = (title: string, message?: string) => {
  return Swal.fire({
    title: '',
    text: '',
    icon: 'error',
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'OK',
    customClass: {
      icon: 'swal2-icon-custom'
    },
    html: `
      <div class="text-center">
        <div class="mb-3">
          <i class="mdi mdi-close-circle" style="font-size: 3rem; color: #dc3545;"></i>
        </div>
        <h3>${title}</h3>
        ${message ? `<p>${message}</p>` : ''}
      </div>
    `,
    showConfirmButton: true,
  });
};

// Warning alert with custom icon
export const showWarning = (title: string, message?: string) => {
  return Swal.fire({
    title: '',
    text: '',
    icon: 'warning',
    confirmButtonColor: '#ffc107',
    confirmButtonText: 'OK',
    customClass: {
      icon: 'swal2-icon-custom'
    },
    html: `
      <div class="text-center">
        <div class="mb-3">
          <i class="mdi mdi-alert-circle" style="font-size: 3rem; color: #ffc107;"></i>
        </div>
        <h3>${title}</h3>
        ${message ? `<p>${message}</p>` : ''}
      </div>
    `,
    showConfirmButton: true,
  });
};

// Info alert with custom icon
export const showInfo = (title: string, message?: string) => {
  return Swal.fire({
    title: '',
    text: '',
    icon: 'info',
    confirmButtonColor: '#17a2b8',
    confirmButtonText: 'OK',
    customClass: {
      icon: 'swal2-icon-custom'
    },
    html: `
      <div class="text-center">
        <div class="mb-3">
          <i class="mdi mdi-information" style="font-size: 3rem; color: #17a2b8;"></i>
        </div>
        <h3>${title}</h3>
        ${message ? `<p>${message}</p>` : ''}
      </div>
    `,
    showConfirmButton: true,
  });
};

// Confirmation dialog with custom icon
export const showConfirmation = (title: string, message?: string, confirmText = 'Yes', cancelText = 'Cancel') => {
  return Swal.fire({
    title: '',
    text: '',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true, // Right-aligned buttons
    customClass: {
      icon: 'swal2-icon-custom'
    },
    html: `
      <div class="text-center">
        <div class="mb-3">
          <i class="mdi mdi-help-circle" style="font-size: 3rem; color: #3085d6;"></i>
        </div>
        <h3>${title}</h3>
        ${message ? `<p>${message}</p>` : ''}
      </div>
    `,
  });
};

// Delete confirmation dialog with custom icon
export const showDeleteConfirmation = (title: string, message?: string) => {
  return Swal.fire({
    title: '',
    text: '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true, // Right-aligned buttons
    customClass: {
      icon: 'swal2-icon-custom'
    },
    html: `
      <div class="text-center">
        <div class="mb-3">
          <i class="mdi mdi-alert-circle" style="font-size: 3rem; color: #dc3545;"></i>
        </div>
        <h3>${title}</h3>
        ${message ? `<p>${message}</p>` : ''}
      </div>
    `,
  });
};

// Network error handler
export const handleNetworkError = (error: any) => {
  // Check if it's a network error or backend is down
  if (!navigator.onLine || error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    // Don't show error to user for network issues
    console.warn('Network error occurred:', error);
    return;
  }

  // For other errors, show a generic message
  showError('Something went wrong', 'Please try again later.');
};

// API error handler
export const handleApiError = (error: any, customMessage?: string) => {
  // Check if it's a network/connection error
  if (!navigator.onLine ||
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('Network Error') ||
    error.message?.includes('fetch') ||
    error.status === 0) {
    // Don't show error to user for network issues
    console.warn('Network/API error occurred:', error);
    return;
  }

  // For other errors, show the custom message or a generic one
  const message = customMessage || error.message || 'Something went wrong. Please try again.';
  showError('Error', message);
};

// Loading alert
export const showLoading = (title = 'Loading...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close loading alert
export const closeLoading = () => {
  Swal.close();
};

export default Swal;
