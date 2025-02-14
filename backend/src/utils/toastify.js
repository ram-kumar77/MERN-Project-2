const createToastContainer = () => {
  const container = document.getElementById('toast-container');
  if (container) return container;

  const newContainer = document.createElement('div');
  newContainer.id = 'toast-container';
  newContainer.className = 'fixed top-4 right-4 z-50';
  document.body.appendChild(newContainer);
  return newContainer;
};

const createToast = (message, type) => {
  const toast = document.createElement('div');
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  toast.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg mb-3 transform transition-all duration-300 opacity-0 translate-x-full`;
  toast.textContent = message;

  // Add to container
  const container = createToastContainer();
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-x-full');
  }, 10);

  // Remove after delay
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => {
      container.removeChild(toast);
      if (container.children.length === 0) {
        document.body.removeChild(container);
      }
    }, 300);
  }, 3000);
};

export const toast = {
  success: (message) => createToast(message, 'success'),
  error: (message) => createToast(message, 'error'),
  info: (message) => createToast(message, 'info')
};

export default toast;
